(function() {
    // 1. ПРОВЕРКА: Пропускаем главную
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path.endsWith("/index.html") || path === "") {
        return;
    }

    // 2. СТИЛИ
    const style = document.createElement('style');
    style.innerHTML = `
        #am-btn {
            position: fixed !important; top: 20px !important; left: 20px !important;
            background: #1a1a1a !important; border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 12px !important; width: 50px !important; height: 50px !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            z-index: 2147483647 !important; cursor: pointer !important; opacity: 0.5; transition: 0.3s !important;
        }
        #am-btn:hover { opacity: 1 !important; transform: scale(1.1) !important; }
        #am-btn svg { width: 24px !important; height: 24px !important; pointer-events: none !important; }

        #am-nav {
            position: fixed !important; top: 80px !important; left: 20px !important; width: 240px !important;
            background: #111 !important; border-radius: 15px !important; border: 1px solid #333 !important;
            padding: 10px !important; display: flex !important; flex-direction: column !important;
            z-index: 2147483647 !important; transition: 0.3s !important;
            /* Скрытое состояние */
            opacity: 0 !important; visibility: hidden !important; transform: translateY(-10px) !important;
        }
        #am-nav.active {
            opacity: 1 !important; visibility: visible !important; transform: translateY(0) !important;
        }
        
        #am-nav a {
            color: #fff !important; text-decoration: none !important; padding: 12px !important;
            border-radius: 8px !important; font-family: sans-serif !important; font-size: 15px !important;
        }
        #am-nav a:hover { background: #222 !important; }

        #am-overlay {
            position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.5) !important;
            z-index: 2147483646 !important; opacity: 0 !important; visibility: hidden !important; transition: 0.3s !important;
        }
        #am-overlay.active { opacity: 1 !important; visibility: visible !important; }

        @media (max-width: 768px) {
            #am-btn { top: auto !important; left: auto !important; bottom: 25px !important; right: 20px !important; opacity: 1 !important; background: #007bff !important; border-radius: 50% !important; }
            #am-nav { top: auto !important; left: auto !important; bottom: 85px !important; right: 20px !important; }
        }
    `;
    document.head.appendChild(style);

    // 3. HTML
    document.body.insertAdjacentHTML('beforeend', `
        <div id="am-overlay"></div>
        <div id="am-btn"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div>
        <nav id="am-nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    `);

    // 4. ЛОГИКА (Глобальная прослушка кликов)
    const btn = document.getElementById('am-btn');
    const nav = document.getElementById('am-nav');
    const overlay = document.getElementById('am-overlay');

    document.addEventListener('click', function(e) {
        // Если нажали на кнопку или внутри неё
        if (btn.contains(e.target)) {
            console.log("Клик по кнопке!");
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
        } 
        // Если нажали на оверлей или мимо меню, когда оно открыто
        else if (overlay.contains(e.target) || (nav.classList.contains('active') && !nav.contains(e.target))) {
            nav.classList.remove('active');
            overlay.classList.remove('active');
        }
    });

    // Умный сдвиг под элементы (только для ПК)
    if (window.innerWidth > 768) {
        setTimeout(() => {
            btn.style.visibility = 'hidden';
            const item = document.elementFromPoint(25, 25);
            btn.style.visibility = 'visible';
            if (item && item !== document.body && item !== document.documentElement && item !== btn) {
                btn.style.top = "85px";
                nav.style.top = "145px";
            }
        }, 600);
    }
})();
