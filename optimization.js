/*!
 * optimization.js — Prank-as
 * Автоматически включает «лёгкий режим» на слабых устройствах:
 *  - убирает backdrop-filter / blur
 *  - останавливает анимацию фона body и бесконечные анимации
 *  - отключает падающие листья
 * Подключение: первым скриптом в <head>:
 *   <script src="/optimization.js"></script>
 *
 * Ручное управление:
 *   ?perf=low    — принудительно лёгкий режим
 *   ?perf=high   — принудительно полный режим
 *   ?perf=auto   — сбросить выбор, определять автоматически
 *   Переключатель также добавляется в боковое меню.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY_USER = 'perf_mode';   // выбор пользователя: 'low' | 'high'
  var KEY_AUTO = 'perf_auto';   // результат авто-определения {m, t}
  var AUTO_TTL = 3 * 24 * 60 * 60 * 1000; // 3 дня
  var current = 'high';
  var fxStopped = false;

  /* ---------- localStorage (безопасно) ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- URL-параметр ---------- */
  try {
    var q = new URLSearchParams(location.search).get('perf');
    if (q === 'low' || q === 'high') lsSet(KEY_USER, q);
    else if (q === 'auto') { lsDel(KEY_USER); lsDel(KEY_AUTO); }
  } catch (e) {}

  /* ---------- CSS ---------- */
  var CSS = [
    /* === Для всех устройств (визуально ничего не меняется) === */
    '.custom-modal-overlay:not(.show){-webkit-backdrop-filter:none;backdrop-filter:none}',
    '.custom-modal-overlay:not(.show) .custom-modal-icon{animation:none}',
    '.swipe-container{will-change:transform}',
    '.info-section{content-visibility:auto;contain-intrinsic-size:auto 1600px}',

    /* === Лёгкий режим === */
    'html.perf-low body{animation:none!important;background:linear-gradient(180deg,#1b1b1b,#2a2a2a)!important;background-size:auto!important}',

    'html.perf-low .category-tabs,',
    'html.perf-low .top-left-menu-toggle,',
    'html.perf-low .desktop-clock,',
    'html.perf-low .user-icon,',
    'html.perf-low .info-section,',
    'html.perf-low .menu-overlay,',
    'html.perf-low .dropdown-menu-small,',
    'html.perf-low .custom-modal-overlay,',
    'html.perf-low .maintenance-overlay{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}',

    'html.perf-low .category-tabs{background:rgba(20,20,20,.88)}',
    'html.perf-low .top-left-menu-toggle{background:rgba(60,60,60,.92)}',
    'html.perf-low .desktop-clock{background:rgba(20,20,20,.88)}',
    'html.perf-low .user-icon{background:rgba(70,70,70,.92)}',
    'html.perf-low .info-section{background:rgba(20,20,20,.75)}',
    'html.perf-low .menu-overlay{background:rgba(0,0,0,.7)}',
    'html.perf-low .custom-modal-overlay{background:rgba(0,0,0,.78)}',
    'html.perf-low .maintenance-overlay{background:rgba(10,10,10,.96)}',

    /* кнопки: без бесконечных анимаций и без появления «лесенкой» */
    'html.perf-low .btn,',
    'html.perf-low .btn.new,',
    'html.perf-low .btn.vip,',
    'html.perf-low .btn.new.vip{animation:none!important;opacity:1!important;transform:none!important;transition:background-color .2s,color .2s!important}',
    'html.perf-low .btn .tag,',
    'html.perf-low .cat-btn.has-new::after{animation:none!important}',

    /* переключение вкладок без блюра */
    'html.perf-low .swipe-container.is-blur{animation:none!important}',

    /* листья/снег */
    'html.perf-low .season-fx{display:none!important}'
  ].join('\n');

  var style = document.createElement('style');
  style.id = 'perf-style';
  style.textContent = CSS;
  (document.head || root).appendChild(style);

  function looksWeak() {
  var n = navigator;
  var c = n.connection || {};
  if (c.saveData) return true;
  if (c.effectiveType === 'slow-2g' || c.effectiveType === '2g') return true;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (n.deviceMemory && n.deviceMemory <= 2) return true; // только совсем слабые
  return false;
}

  function readAuto() {
    try {
      var o = JSON.parse(lsGet(KEY_AUTO));
      if (o && (o.m === 'low' || o.m === 'high') && Date.now() - o.t < AUTO_TTL) return o.m;
    } catch (e) {}
    return null;
  }
  function cacheAuto(m) { lsSet(KEY_AUTO, JSON.stringify({ m: m, t: Date.now() })); }

  /* ---------- Замер FPS ---------- */
  function measureFps(cb) {
    var start = 0, last = 0, frames = 0, slow = 0, aborted = false;
    function onVis() { if (document.hidden) aborted = true; }
    document.addEventListener('visibilitychange', onVis);
    function done(r) { document.removeEventListener('visibilitychange', onVis); cb(r); }
    function tick(t) {
      if (aborted) return done(null);
      if (!start) { start = last = t; return requestAnimationFrame(tick); }
      var dt = t - last; last = t; frames++;
      if (dt > 50) slow++;
      if (t - start < 2000) requestAnimationFrame(tick);
      else done({ fps: frames * 1000 / (t - start), slow: slow / frames });
    }
    requestAnimationFrame(tick);
  }

  function whenVisible(cb) {
    if (!document.hidden) return cb();
    document.addEventListener('visibilitychange', function h() {
      if (!document.hidden) { document.removeEventListener('visibilitychange', h); cb(); }
    });
  }

  function scheduleMeasure() {
    function go() {
      // ждём, пока закончатся анимации появления и загрузка сторонних скриптов
      setTimeout(function () {
        whenVisible(function () {
          measureFps(function (r) {
            if (!r) return;
            var low = r.fps < 42 || r.slow > 0.25;
            cacheAuto(low ? 'low' : 'high');
            var u = lsGet(KEY_USER);
            if (low && u !== 'low' && u !== 'high') apply('low');
          });
        });
      }, 2500);
    }
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }

  /* ---------- Применение режима ---------- */
  function killSeasonFx() {
    if (typeof window.__stopSeasonFX === 'function') {
      try { window.__stopSeasonFX(); fxStopped = true; } catch (e) {}
    }
  }

  function apply(mode) {
    current = mode;
    root.classList.toggle('perf-low', mode === 'low');
    root.classList.toggle('perf-high', mode !== 'low');
    if (mode === 'low') killSeasonFx();
    updateToggle();
    try { window.dispatchEvent(new CustomEvent('perfmodechange', { detail: { mode: mode } })); } catch (e) {}
  }

  function setMode(mode) {
    lsSet(KEY_USER, mode);
    apply(mode);
    if (typeof window.showMessage === 'function') {
      window.showMessage(mode === 'low' ? '⚡ Yengil rejim yoqildi' : '✨ To‘liq rejim yoqildi');
    }
    // листья остановлены — для их возврата нужна перезагрузка
    if (mode === 'high' && fxStopped) setTimeout(function () { location.reload(); }, 700);
  }

  /* ---------- Переключатель в меню ---------- */
  function updateToggle() {
    var a = document.getElementById('perfToggle');
    if (a) a.textContent = current === 'low' ? '⚡ Yengil rejim: yoqilgan' : '⚡ Yengil rejim: o‘chirilgan';
  }

  function initToggle() {
    var nav = document.getElementById('dropdown-menu');
    if (!nav || document.getElementById('perfToggle')) return;
    var a = document.createElement('a');
    a.href = '#';
    a.id = 'perfToggle';
    nav.insertBefore(a, nav.querySelector('.menu-divider') || null);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      setMode(current === 'low' ? 'high' : 'low');
    });
    updateToggle();
  }

  /* ---------- Старт ---------- */
  var userMode = lsGet(KEY_USER);
  var mode = 'high';
  var needMeasure = false;

  if (userMode === 'low' || userMode === 'high') {
    mode = userMode;
  } else {
    var cached = readAuto();
    if (cached) {
      mode = cached;
    } else if (looksWeak()) {
      mode = 'low';
      cacheAuto('low');
    } else {
      mode = 'high';
      needMeasure = true;
    }
  }

  apply(mode);
  if (needMeasure) scheduleMeasure();

  function onReady() {
    initToggle();
    if (current === 'low') killSeasonFx();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();

  /* ---------- Публичный API ---------- */
  window.PerfMode = {
    get: function () { return current; },
    set: setMode,
    auto: function () { lsDel(KEY_USER); lsDel(KEY_AUTO); location.reload(); }
  };
})();
