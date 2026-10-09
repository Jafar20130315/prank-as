(function () {
  // На главной страницу не трогаем: там своё меню
  const path = window.location.pathname;
  if (path === "/" || path === "/index.html" || path.endsWith("/index.html")) return;

  // Установка приложения (PWA)
  let deferredPrompt = window.__deferredInstallPrompt || null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.__deferredInstallPrompt = e;
    const btn = document.querySelector("auto-menu-element");
    if (btn && btn.showInstall) btn.showInstall();
  });

  class AutoMenu extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    showInstall() {
      const el = this.shadowRoot && this.shadowRoot.getElementById("installAppBtn");
      if (el) el.hidden = false;
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; }
        * { box-sizing: border-box; }

        .toggle {
          position: fixed; top: 15px; left: 15px;
          background: rgba(255,255,255,.15); border: none; border-radius: 12px;
          padding: 10px 12px; cursor: pointer; z-index: 99999;
          box-shadow: 0 4px 12px rgba(0,0,0,.4);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          transition: .3s; width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .toggle:hover { background: rgba(255,255,255,.35); transform: scale(1.1); }
        .toggle svg { width: 26px; height: 26px; }

        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.55);
          backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
          opacity: 0; visibility: hidden;
          transition: opacity .3s ease, visibility 0s linear .3s;
          z-index: 100010;
        }
        .overlay.show { opacity: 1; visibility: visible; transition: opacity .3s ease; }

        .panel {
          position: fixed; top: 0; left: 0; height: 100vh; height: 100dvh;
          width: 80%; max-width: 300px;
          background: rgba(20,20,20,.97);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-right: 1px solid rgba(255,255,255,.08);
          box-shadow: 8px 0 30px rgba(0,0,0,.6);
          padding: calc(20px + env(safe-area-inset-top,0px)) 14px calc(20px + env(safe-area-inset-bottom,0px));
          display: flex; flex-direction: column; gap: 4px;
          overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
          transform: translateX(-100%); visibility: hidden;
          transition: transform .3s cubic-bezier(.25,1,.5,1), visibility 0s linear .3s;
          z-index: 100011;
          font-family: 'Poppins', 'Segoe UI', Roboto, Arial, sans-serif;
        }
        .panel.show { transform: translateX(0); visibility: visible;
          transition: transform .3s cubic-bezier(.25,1,.5,1); }

        .title {
          color: #fff; font-size: 20px; font-weight: 700;
          padding: 4px 12px 14px; margin-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }
        .panel a {
          color: #fff; font-weight: 600; font-size: 15px; text-decoration: none;
          padding: 13px 12px; border-radius: 10px; transition: background .2s;
          -webkit-tap-highlight-color: transparent;
        }
        .panel a[hidden] { display: none; }
        .panel a:hover, .panel a:focus-visible { background: rgba(255,255,255,.12); outline: none; }
        .divider { height: 1px; background: rgba(255,255,255,.1); margin: 8px 6px; flex-shrink: 0; }

        @media (prefers-reduced-motion: reduce) { .panel, .overlay { transition: none; } }
      </style>

      <button class="toggle" id="toggle" aria-label="Menyuni ochish"
              aria-expanded="false" aria-controls="menu">
        <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
      </button>
      <div class="overlay" id="overlay"></div>
      <nav class="panel" id="menu" aria-label="Asosiy menyu">
        <div class="title">Prank-as</div>
         <a href="https://prank-as.uz">Asosiy sahifa</a>
        <a href="#" id="installAppBtn" hidden>📱 Ilovani o‘rnatish</a>
        <a href="/baholash">Fikr qoldirish</a>
        <a href="https://help.prank-as.site">Yordam</a>
        <a href="https://old.prank-as.site">Oldingi saytga qaytish</a>
        <div class="divider"></div>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/privacypolicy">Privacy policy</a>
      </nav>`;

      const root = this.shadowRoot;
      const toggle = root.getElementById("toggle");
      const overlay = root.getElementById("overlay");
      const menu = root.getElementById("menu");
      const install = root.getElementById("installAppBtn");

      const setOpen = (open) => {
        menu.classList.toggle("show", open);
        overlay.classList.toggle("show", open);
        toggle.setAttribute("aria-expanded", String(open));
        // блокировка прокрутки страницы, пока меню открыто
        document.documentElement.style.overflow = open ? "hidden" : "";
      };

      toggle.addEventListener("click", () => setOpen(!menu.classList.contains("show")));
      overlay.addEventListener("click", () => setOpen(false));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });

      // Кнопка установки: видна только если браузер готов предложить установку
      if (deferredPrompt) install.hidden = false;
      install.addEventListener("click", (e) => {
        e.preventDefault();
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt = null;
          window.__deferredInstallPrompt = null;
          install.hidden = true;
        }
        setOpen(false);
      });
      window.addEventListener("appinstalled", () => { install.hidden = true; });
    }
  }

  if (!customElements.get("auto-menu-element")) {
    customElements.define("auto-menu-element", AutoMenu);
  }

  // Защита от дублей: если меню уже есть, второе не добавляем
  if (!document.querySelector("auto-menu-element")) {
    document.body.appendChild(document.createElement("auto-menu-element"));
  }
})();
