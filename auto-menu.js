(function() {
    // 1. Проверка на главную страницу
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path.endsWith("/index.html")) return;

    // 2. Создаем кастомный элемент (Web Component)
    class AutoMenu extends HTMLElement {
        constructor() {
            super();
            // Создаем закрытый Shadow Root — сюда никто не заглянет
            this.attachShadow({ mode: 'closed' });
        }

        connectedCallback() {
            this.render();
        }

        render() {
            this.shadowRoot.innerHTML = `
            <style>
                /* Сбрасываем всё, что могло прийти извне */
                :host {
                    all: initial; 
                    display: block;
                    position: fixed;
                    z-index: 2147483647;
                }

                .menu-wrapper {
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }

                /* Кнопка */
                .btn {
                    position: fixed; top: 20px; left: 20px;
                    width: 50px; height: 50px;
                    background: #1a1a1a; border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: 0.3s; opacity: 0.4;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                }
                .btn:hover { opacity: 1; transform: scale(1.05); background: #222; }
                .btn svg { width: 26px; height: 26px; stroke: white; fill: none; stroke-width: 2; }

                /* Навигация */
                .nav {
                    position: fixed; top: 80px; left: 20px; width: 240px;
                    background: #111; border-radius: 16px; border: 1px solid #333;
                    padding: 10px; display: none; flex-direction: column; gap: 5px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                }
                .nav.active { display: flex; }

                .nav a {
                    color: #fff; text-decoration: none; padding: 12px 15px;
                    border-radius: 10px; font-size: 15px; font-weight: 500;
                    transition: 0.2s;
                }
                .nav a:hover { background: rgba(255,255,255,0.1); }

                /* Затемнение */
                .overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
                    display: none; z-index: -1; backdrop-filter: blur(3px);
                }
                .overlay.active { display: block; }

                /* Мобилки */
                @media (max-width: 768px) {
                    .btn { top: auto; bottom: 25px; right: 20px; left: auto; opacity: 1; background: #007bff; border-radius: 50%; }
                    .nav { top: auto; bottom: 85px; right: 20px; left: auto; }
                }
            </style>

            <div class="menu-wrapper">
                <div class="overlay" id="ovl"></div>
                <div class="btn" id="trigger">
                    <svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round"/></svg>
                </div>
                <nav class="nav" id="menu">
                    <a href="/">🏠 Bosh sahifa</a>
                    <a href="/disclaimer">Disclaimer</a>
                    <a href="/baholash">Fikr qoldirish</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacypolicy">Privacy policy</a>
                </nav>
            </div>
            `;

            const trigger = this.shadowRoot.getElementById('trigger');
            const menu = this.shadowRoot.getElementById('menu');
            const ovl = this.shadowRoot.getElementById('ovl');

            const toggle = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = menu.classList.contains('active');
                if (isOpen) {
                    menu.classList.remove('active');
                    ovl.classList.remove('active');
                } else {
                    menu.classList.add('active');
                    ovl.classList.add('active');
                }
            };

            trigger.addEventListener('click', toggle);
            ovl.addEventListener('click', toggle);
        }
    }

    // Регистрируем наш "бронированный" элемент
    if (!customElements.get('auto-menu-element')) {
        customElements.define('auto-menu-element', AutoMenu);
    }

    // Вставляем его на страницу
    const el = document.createElement('auto-menu-element');
    document.body.appendChild(el);
})();
