(function() {
    // 1. ПРОВЕРКА: Если это главная страница, выходим
    const path = window.location.pathname;
    const isIndex = path === "/" || path === "/index.html" || path.endsWith("/index.html") || path === "";
    
    if (isIndex) {
        console.log("Auto-Menu: Главная страница, пропуск.");
        return;
    }

    // 2. СТИЛИ (с !important, чтобы никто не перебил)
    const style = document.createElement('style');
    style.innerHTML = `
        #am-btn {
            position: fixed !important; top: 15px !important; left: 15px !important;
            background: rgba(40, 40, 40, 0.8) !important; border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 12px !important; width: 50px !important; height: 50px !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            z-index: 2147483647 !important; backdrop-filter: blur(10px) !important;
            transition: all 0.3s ease !important; opacity: 0.4 !important; cursor: pointer !important;
        }
        #am-btn:hover { opacity: 1 !important; background: #333 !important; }
        #am-btn svg { width: 26px !important; height: 26px !important; pointer-events: none !important; }

        #am-nav {
            position: fixed !important; top: 75px !important; left: 15px !important; width: 230px !important;
            background: #1a1a1a !important; border-radius: 15px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important; padding: 10px !important;
            display: flex !important; flex-direction: column !important; gap: 5px !important;
            opacity: 0 !important; pointer-events: none !important; transform: translateY(-15px) !important;
            transition: all 0.3s ease !important; z-index: 2147483646 !important;
            border: 1px solid rgba(255,255,255,0.1) !important; visibility: hidden;
        }
        #am-nav.am-show { opacity: 1 !important; pointer-events: auto !important; transform: translateY(0) !important; visibility: visible !important; }
        
        #am-nav a { 
            color: #fff !important; text-decoration: none !important; padding: 12px !important; 
            border-radius: 8px !important; font-family: sans-serif !important; font-size: 15px !important;
            transition: 0.2s !important; display: block !important;
        }
        #am-nav a:hover { background: rgba(255,255,255,0.1) !important; }

        #am-overlay { position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.5) !important; opacity: 0 !important; pointer-events: none !important; transition: 0.3s !important; z-index: 2147483645 !important; }
        #am-overlay.am-show { opacity: 1 !important; pointer-events: auto !important; }

        @media (max-width: 768px) {
            #am-btn { top: auto !important; left: auto !important; bottom: 30px !important; right: 20px !important; opacity: 1 !important; background: #007bff !important; border-radius: 50% !important; }
            #am-nav { top: auto !important; left: auto !important; bottom: 90px !important; right: 20px !important; }
        }
    `;
    document.head.appendChild(style);

    // 3. HTML (вставляем в самый конец body)
    const ui = `
        <div id="am-overlay"></div>
        <button id="am-btn"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
        <nav id="am-nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    `;
    
    document.body.insertAdjacentHTML('beforeend', ui);

    // 4. ЛОГИКА
    const btn = document.getElementById('am-btn');
    const nav = document.getElementById('am-nav');
    const overlay = document.getElementById('am-overlay');

    btn.onclick = (e) => {
        e.stopPropagation();
        nav.classList.toggle('am-show');
        overlay.classList.toggle('am-show');
    };

    overlay.onclick = () => {
        nav.classList.remove('am-show');
        overlay.classList.remove('am-show');
    };
})();
