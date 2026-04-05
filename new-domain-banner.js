document.addEventListener("DOMContentLoaded", function() {
    // Если пользователь уже закрывал баннер, больше его не показываем
    if (localStorage.getItem("prankAsBannerClosed") === "true") return;

    // Встроенная защита: баннер перестанет показываться сам после 1 сентября 2026
    const expiryDate = new Date("2026-09-01T00:00:00");
    if (new Date() > expiryDate) return;

    // Создаем стили для баннера
    const style = document.createElement('style');
    style.innerHTML = `
        .domain-move-banner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #ff7e5f, #feb47b); /* Красивый градиент */
            color: white;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            box-sizing: border-box;
            z-index: 99999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .banner-text-container {
            flex-grow: 1;
            overflow: hidden;
            white-space: nowrap;
        }
        .banner-scrolling-text {
            display: inline-block;
            padding-left: 100%;
            animation: scroll-banner-text 20s linear infinite;
            font-weight: bold;
            font-size: 16px;
        }
        @keyframes scroll-banner-text {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        .banner-close-btn {
            background: rgba(0, 0, 0, 0.2);
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 15px;
            transition: background 0.3s;
        }
        .banner-close-btn:hover {
            background: rgba(0, 0, 0, 0.4);
        }
        /* Сдвигаем контент сайта вниз, чтобы баннер его не перекрывал */
        body {
            padding-top: 50px !important; 
        }
    `;
    document.head.appendChild(style);

    // Создаем HTML структуру баннера
    const banner = document.createElement('div');
    banner.className = 'domain-move-banner';
    banner.id = 'domain-move-banner';
    banner.innerHTML = `
        <div class="banner-text-container">
            <span class="banner-scrolling-text">
                Внимание! Вскоре наш сайт переезжает на новый адрес: prank-as.uz. Сохраните новую ссылку!
            </span>
        </div>
        <button class="banner-close-btn" id="banner-close-btn" title="Закрыть">&#10005;</button>
    `;
    
    // Добавляем баннер в самое начало body
    document.body.prepend(banner);

    // Логика кнопки закрытия
    document.getElementById("banner-close-btn").addEventListener("click", function() {
        banner.style.display = "none";
        document.body.style.paddingTop = "0"; // Возвращаем отступ сайта обратно
        localStorage.setItem("prankAsBannerClosed", "true"); // Запоминаем закрытие
    });
});
