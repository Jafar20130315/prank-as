(function() {
    // 1. ПРОВЕРКА: Не запускаем на главной
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path.endsWith("/index.html") || path === "") {
        return;
    }

    // 2. СТИЛИ (Копия дизайна с главной + защита от поломок)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Кнопка гамбургера */
        #am-custom-btn {
            position: fixed !important; top: 15px !important; left: 15px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            border: none !important; border-radius: 12px !important;
            width: 48px !important; height: 48px !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            z-index: 2147483647 !important; backdrop-filter: blur(8px) !important;
            transition: all 0.3s ease !important; cursor: pointer !important;
            opacity: 0.3 !important; /* Прячем "под" контент */
        }
        #am-custom-btn:hover { opacity: 1 !important; background: rgba(255, 255, 255, 0.3) !important; transform: scale(1.05) !important; }
        #am-custom-btn svg { width: 26px !important; height: 26px !important; fill: none !important; stroke: white !important; stroke-width: 2 !important; }

        /* Выпадающее меню */
        #am-custom-nav {
            position: fixed !important; top: 75px !important; left: 15px !important; 
            width: 240px !important; background: rgba(18, 18, 18, 0.96) !important;
            backdrop-filter: blur(15px) !important; border-radius: 15px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
            padding: 15px 10px !important; display: flex !important; flex-direction: column !important; gap: 8px !important;
            opacity: 0 !important; pointer-events: none !important; transform: translateY(-10px) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            z-index: 2147483646 !important; border: 1px solid rgba(255,255,255,0.1) !important;
            visibility: hidden !important;
        }
        #am-custom-nav.open { opacity: 1 !important; pointer-events: auto !important; transform: translateY(0) !important; visibility: visible !important; }
        
        /* Ссылки */
        #am-custom-nav a {
            color: #ffffff !important; text-decoration: none !important; 
            padding: 10px 15px !important; border-radius: 10px !important;
            font-family: 'Poppins', sans-serif !important; font-size: 14px !important;
            font-weight: 500 !important; transition: 0.2s !important;
            display: block !important; border: none !important;
        }
        #am-custom-nav a:hover { background: rgba(255, 255, 255, 0.1) !important; color: #fff !important; }

        /* Затемнение фона */
        #am-custom-overlay {
            position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.4) !important;
            opacity: 0 !important; pointer-events: none !important; transition: 0.3s !important; z-index: 2147483640 !important;
        }
        #am-custom-overlay.open { opacity: 1 !important; pointer-events: auto !important; }

        /* Мобильная версия (вниз вправо) */
        @media (max-width: 768px) {
            #am-custom-btn { top: auto !important; left: auto !important; bottom: 25px !important; right: 20px !important; opacity: 1 !important; background: #2563eb !important; border-radius: 50% !important; box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important; }
            #am-custom-nav { top: auto !important; left: auto !important; bottom: 85px !important; right: 20px !important; width: 220px !important; }
        }
    `;
    document.head.appendChild(style);

    // 3. HTML (все пункты как на главной)
    const menuHTML = `
        <div id="am-custom-overlay"></div>
        <button id="am-custom-btn"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"/></svg></button>
        <nav id="am-custom-nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/baholash">Fikr qoldirish</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacypolicy">Privacy policy</a>
            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin: 5px 0;">
            <a href="#" id="am-reset-btn">♻️ Tanlovni tiklash</a>
        </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // 4. ЛОГИКА
    const btn = document.getElementById('am-custom-btn');
    const nav = document.getElementById('am-custom-nav');
    const overlay = document.getElementById('am-custom-overlay');

    const toggle = () => {
        nav.classList.toggle('open');
        overlay.classList.toggle('open');
    };

    btn.onclick = toggle;
    overlay.onclick = toggle;

    document.getElementById('am-reset-btn').onclick = (e) => {
        e.preventDefault();
        localStorage.clear();
        location.reload();
    };

    // Умное позиционирование (под элемент)
    if (window.innerWidth > 768) {
        btn.style.visibility = 'hidden';
        const el = document.elementFromPoint(25, 25);
        btn.style.visibility = 'visible';
        if (el && el !== document.body && el !== document.documentElement) {
            btn.style.top = "80px";
            nav.style.top = "140px";
        }
    }
})();
