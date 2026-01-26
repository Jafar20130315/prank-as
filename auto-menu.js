(function() {
    // Если по какой-то причине скрипт попал на index.html, он сам себя выключит
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        #am-btn {
            position: fixed !important; top: 20px !important; left: 20px !important;
            background: #222 !important; border: 1px solid #444 !important;
            border-radius: 10px !important; width: 45px !important; height: 45px !important;
            z-index: 999999 !important; display: flex !important; align-items: center !important; 
            justify-content: center !important; cursor: pointer !important; opacity: 0.5; transition: 0.3s;
        }
        #am-btn:hover { opacity: 1; background: #333 !important; }
        #am-nav {
            position: fixed !important; top: 75px !important; left: 20px !important;
            background: #111 !important; border-radius: 12px !important; padding: 10px !important;
            display: none; flex-direction: column; gap: 5px !important;
            z-index: 999999 !important; border: 1px solid #333 !important; width: 200px !important;
        }
        #am-nav.show { display: flex !important; }
        #am-nav a { color: #fff !important; text-decoration: none !important; padding: 10px !important; font-family: sans-serif !important; }
        @media (max-width: 768px) {
            #am-btn { top: auto !important; bottom: 20px !important; right: 20px !important; left: auto !important; opacity: 1; background: #007bff !important; }
            #am-nav { top: auto !important; bottom: 75px !important; right: 20px !important; left: auto !important; }
        }
    `;
    document.head.appendChild(style);

    document.body.insertAdjacentHTML('beforeend', `
        <div id="am-btn"><svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" fill="none"><path d="M3 12h18M3 6h18M3 18h18"/></svg></div>
        <nav id="am-nav">
            <a href="/">🏠 Главная</a>
            <a href="/about">О нас</a>
            <a href="/contact">Контакты</a>
        </nav>
    `);

    const btn = document.getElementById('am-btn');
    const nav = document.getElementById('am-nav');
    btn.onclick = () => nav.classList.toggle('show');
    // Закрытие при клике мимо
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !nav.contains(e.target)) nav.classList.remove('show');
    });
})();
