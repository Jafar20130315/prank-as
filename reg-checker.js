/*!
 * reg-checker.js — защита VIP-страниц Prank-as
 * Подключать в <head> БЕЗ defer/async, самым первым скриптом:
 *   <script src="/reg-checker.js"></script>
 */
(function () {
  "use strict";

  var WORKER_URL = "https://auth.prank-as.uz";
  var AUTH_PAGE  = "/auth";
  var TOKEN_KEY  = "session_token";

  // 1. Сразу прячем страницу, пока не проверили доступ
  var hideStyle = document.createElement("style");
  hideStyle.id = "reg-checker-hide";
  hideStyle.textContent = "html{visibility:hidden !important}";
  (document.head || document.documentElement).appendChild(hideStyle);

  function reveal() {
    var s = document.getElementById("reg-checker-hide");
    if (s) s.remove();
  }

  function deny(clearToken) {
    if (clearToken) {
      try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    }
    window.location.replace(AUTH_PAGE);
  }

  function isTestOnly() {
    try {
      return new URLSearchParams(window.location.search).get("testonly") === "1";
    } catch (e) {
      return false;
    }
  }

  async function check() {
    if (isTestOnly()) {
      reveal();
      return;
    }

    var token = null;
    try { token = localStorage.getItem(TOKEN_KEY); } catch (e) {}

    if (!token) return deny(false);

    try {
      var res = await fetch(WORKER_URL + "/api/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
        cache: "no-store"
      });

      if (!res.ok) return deny(res.status === 401 || res.status === 403);

      var data = await res.json();
      if (data && data.user) {
        reveal();
      } else {
        deny(true);
      }
    } catch (err) {
      console.error("reg-checker error:", err);
      deny(false);
    }
  }

  check();

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      if (isTestOnly()) return;

      var st = document.createElement("style");
      st.id = "reg-checker-hide";
      st.textContent = "html{visibility:hidden !important}";
      document.head.appendChild(st);
      check();
    }
  });

  window.addEventListener("storage", function (e) {
    if (e.key === TOKEN_KEY && !e.newValue) deny(false);
  });
})();
