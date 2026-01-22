document.addEventListener("DOMContentLoaded", function() {
    // 1. СТИЛИ
    const style = document.createElement('style');
    style.innerHTML = `
        .top-menu-toggle {
            position: fixed; 
            top: 15px; left: 15px; /* По умолчанию */
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px; 
            width: 48px; height: 48px;
            display: flex; align-items: center; justify-content: center;
            z-index: 100000;
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;
            opacity: 0.3; /* Почти прозрачная по умолчанию */
            cursor: pointer;
        }

        /* Эффект при наведении — становится четкой */
        .top-menu-toggle:hover {
            opacity: 1;
            background: rgba(255,255,255,0.25);
            transform: scale(1.05);
        }

        .top-menu-toggle svg { fill: #fff; width: 24px; height: 24px; }

        /* Выпадающее меню */
        .dropdown-menu-small {
            position: fixed; top: 75px; left: 15px; width: 220px;
            background: rgba(15, 15, 15, 0.98);
            backdrop-filter: blur(15px); border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            padding: 12px; display: flex; flex-direction: column; gap: 8px;
            opacity: 0; pointer-events: none; transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 99999;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .dropdown-menu-small.show { opacity: 1; pointer-events: auto; transform: translateY(0); }
        
        .dropdown-menu-small a {
            color: rgba(255,255,255,0.8); font-weight: 500; text-decoration: none;
            padding: 10px 15px; border-radius: 10px; transition: 0.2s;
            font-family: sans-serif; font-size: 14px;
        }
        .dropdown-menu-small a:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* Overlay */
        .menu-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.3);
            opacity: 0; pointer-events: none; transition: 0.3s; z-index: 99998;
        }
        .menu-overlay.show { opacity: 1; pointer-events: auto; }

        /* МОБИЛЬНАЯ ВЕРСИЯ (Телефоны) */
        @media (max-width: 768px) {
            .top-menu-toggle {
                top: auto; left: auto;
                bottom: 25px; right: 25px; /* Переезжает вниз вправо */
                opacity: 0.8; /* На мобилках чуть виднее сразу */
                background: #2563eb; /* Синий акцент, чтобы не терялась */
                border-radius: 50%; /* Круглая кнопка (FAB стиль) */
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            }
            .dropdown-menu-small {
                top: auto; left: auto;
                bottom: 85px; right: 25px; /* Меню открывается вверх */
                transform: translateY(10px);
            }
        }
    `;
    document.head.appendChild(style);

    // 2. HTML
    const menuHTML = `
        <button class="top-menu-toggle" id="autoMenuBtn">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <div class="menu-overlay" id="autoOverlay"></div>
        <nav id="autoDropdown" class="dropdown-menu-small">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/baholash">Fikr qoldirish</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacypolicy">Privacy policy</a>
            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin: 5px 0;">
            <a href="#" id="resetChoiceBtn">♻️ Tanlovni tiklash</a>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    const btn = document.getElementById('autoMenuBtn');
    const menu = document.getElementById('autoDropdown');
    const overlay = document.getElementById('autoOverlay');

    // 3. УМНОЕ ПОЗИЦИОНИРОВАНИЕ ("ПОД" ЭЛЕМЕНТОМ)
    function checkCollision() {
        if (window.innerWidth > 768) { // Только для ПК
            btn.style.visibility = 'hidden';
            const itemUnder = document.elementFromPoint(25, 25);
            btn.style.visibility = 'visible';

            // Если в углу что-то есть (не фон и не сам body)
            if (itemUnder && itemUnder !== document.body && itemUnder !== document.documentElement) {
                btn.style.top = "80px"; // Сдвигаем ниже (под элемент)
                menu.style.top = "140px";
            }
        }
    }

    checkCollision();

    // 4. ЛОГИКА
    const toggle = () => {
        menu.classList.toggle('show');
        overlay.classList.toggle('show');
    };

    btn.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
    
    document.getElementById('resetChoiceBtn').onclick = (e) => {
        e.preventDefault();
        localStorage.clear();
        location.reload();
    };
});
