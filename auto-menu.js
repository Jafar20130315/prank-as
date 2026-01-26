(function() {
    // 1. ПРОВЕРКА: Не запускаем на главной
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path.endsWith("/index.html") || path === "") {
        console.log("Auto-Menu: Это главная, скрипт выключен.");
        return;
    }

    console.log("Auto-Menu: Скрипт запущен успешно.");

    // 2. СТИЛИ
    const style = document.createElement('style');
    style.innerHTML = `
        #am-btn {
            position: fixed !important; top: 15px !important; left: 15px !important;
            background: rgba(30, 30, 30, 0.9) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 12px !important; width: 50px !important; height: 50px !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            z-index: 999999999 !important; /* Прямо поверх ВСЕГО */
            backdrop-filter: blur(8px) !important;
            cursor: pointer !important; opacity: 0.5 !important;
            transition: 0.3s !important;
            pointer-events: auto !important; /* Разрешаем клики */
        }
        #am-btn:hover { opacity: 1 !important; background: #000 !important; transform: scale(1.1) !important; }
        #am-btn svg { width: 26px !important; height: 26px !important; pointer-events: none !important; }

        #am-nav {
            position: fixed !important; top: 75px !important; left: 15px !important; 
            width: 240px !important; background: #121212 !important;
            border-radius: 15px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
            padding: 10px !important; display: none !important; flex-direction: column !important;
            z-index: 999999998 !important; border: 1px solid rgba(255,255,255,0.1) !important;
        }
        #am-nav.open { display: flex !important; }
        
        #am-nav a {
            color: #fff !important; text-decoration: none !important; padding: 12px !important;
            border-radius: 8px !important; font-family: sans-serif !important; font-size: 15px !important;
            transition: 0.2s !important; display: block !important;
        }
        #am-nav a:hover { background: rgba(255,255,255,0.1) !important; }

        #am-overlay {
            position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.5) !important;
            display: none !important; z-index: 999999997 !important;
        }
        #am-overlay.open { display: block !important; }

        @media (max-width: 768px) {
            #am-btn { top: auto !important; bottom: 25px !important; right: 20px !important; left: auto !important; opacity: 1 !important; background: #2563eb !important; border-radius: 50% !important; }
            #am-nav { top: auto !important; bottom: 85px !important; right: 20px !important; left: auto !important; }
        }
    `;
    document.head.appendChild(style);

    // 3. HTML
    const html = `
        <div id="am-overlay"></div>
        <div id="am-btn" role="button" aria-label="Menu">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <nav id="am-nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // 4. ЛОГИКА
    const btn = document.getElementById('am-btn');
    const nav = document.getElementById('am-nav');
    const overlay = document.getElementById('am-overlay');

    const toggle = (e) => {
        console.log("Auto-Menu: Клик сработал!");
        nav.classList.toggle('open');
        overlay.classList.toggle('open');
    };

    // Слушаем клик напрямую
    btn.onclick = toggle;
    overlay.onclick = toggle;

    // Сдвиг "под" элементы на ПК
    if (window.innerWidth > 768) {
        setTimeout(() => {
            btn.style.visibility = 'hidden';
            const el = document.elementFromPoint(25, 25);
            btn.style.visibility = 'visible';
            if (el && el !== document.body && el !== document.documentElement && el !== btn) {
                console.log("Auto-Menu: Нашел препятствие, сдвигаюсь.");
                btn.style.top = "80px";
                nav.style.top = "140px";
            }
        }, 500);
    }
})();
