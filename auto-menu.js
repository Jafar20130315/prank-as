document.addEventListener("DOMContentLoaded", function() {
    // 1. Создаем стили (чтобы не лезть в CSS файлы)
    const style = document.createElement('style');
    style.innerHTML = `
        .top-left-menu-toggle {
            position: fixed; top: 15px; left: 15px; background: rgba(255,255,255,0.15);
            border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer;
            z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            backdrop-filter: blur(6px); transition: 0.3s; width: 48px; height: 48px;
            display: flex; align-items: center; justify-content: center;
        }
        .top-left-menu-toggle:hover { background: rgba(255,255,255,0.35); transform: scale(1.1); }
        .top-left-menu-toggle svg { fill: #fff; width: 26px; height: 26px; }

        .dropdown-menu-small {
            position: fixed; top: 70px; left: 15px; width: 220px; background: rgba(20,20,20,0.95);
            backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.7);
            padding: 15px 10px; display: flex; flex-direction: column; gap: 12px;
            opacity: 0; pointer-events: none; transform: translateY(-10px); transition: all 0.35s ease;
            z-index: 99998;
        }
        .dropdown-menu-small.show { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .dropdown-menu-small a { color: #fff; font-weight: 600; text-decoration: none; padding: 8px 12px; border-radius: 8px; transition: background 0.3s; font-family: 'Poppins', sans-serif; }
        .dropdown-menu-small a:hover { background: rgba(255,255,255,0.12); }

        .menu-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.4); opacity: 0;
            pointer-events: none; transition: opacity 0.3s ease; z-index: 99997; backdrop-filter: blur(3px);
        }
        .menu-overlay.show { opacity: 1; pointer-events: auto; }
    `;
    document.head.appendChild(style);

    // 2. Создаем HTML структуру меню
    const menuContainer = document.createElement('div');
    menuContainer.innerHTML = `
        <button class="top-left-menu-toggle" id="autoMenuBtn">
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
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1);">
            <a href="#" id="resetChoiceBtn">♻️ Tanlovni tiklash</a>
        </nav>
    `;
    document.body.appendChild(menuContainer);

    // 3. Логика работы
    const btn = document.getElementById('autoMenuBtn');
    const menu = document.getElementById('autoDropdown');
    const overlay = document.getElementById('autoOverlay');

    function toggleMenu() {
        menu.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    btn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Сброс выбора (если у тебя есть такая логика в localStorage)
    document.getElementById('resetChoiceBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        alert("Barcha sozlamalar tiklandi!");
        location.reload();
    });
});
