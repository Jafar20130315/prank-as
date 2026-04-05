document.addEventListener("DOMContentLoaded", function() {
    // Если пользователь уже закрывал баннер, больше его не показываем
    if (localStorage.getItem("prankAsBannerClosed") === "true") return;

    // Защита: баннер перестанет показываться после 10 сентября 2026 (запас)
    const expiryDate = new Date("2026-09-11T00:00:00");
    if (new Date() > expiryDate) return;

    // Создаем стили для баннера
    const style = document.createElement('style');
    style.innerHTML = `
        .domain-move-banner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%); /* Красивый нежный градиент */
            color: #333;
            display: flex;
            align-items: center;
            padding: 12px 30px;
            box-sizing: border-box;
            z-index: 99999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            opacity: 0; /* Скрыт по умолчанию для анимации */
            animation: banner-entry 1s ease-out forwards; /* Анимация появления */
        }
        .banner-text-container {
            flex-grow: 1;
            text-align: center; /* Текст по центру */
            overflow: hidden;
        }
        .banner-main-text {
            font-weight: bold;
            font-size: 17px;
            display: inline-block;
            animation: text-float 6s ease-in-out infinite; /* Плавающая анимация */
        }
        .banner-new-domain {
            color: #e74c3c; /* Акцентный цвет для нового домена */
            border-bottom: 2px solid rgba(231, 76, 60, 0.3);
            font-weight: 800;
        }
        /* Анимация плавного появления баннера */
        @keyframes banner-entry {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        /* Медленная плавающая анимация текста */
        @keyframes text-float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-2px) translateX(1px); }
            50% { transform: translateY(1px) translateX(-1px); }
            75% { transform: translateY(-1px) translateX(0.5px); }
        }
        .banner-close-btn {
            background: rgba(255, 255, 255, 0.5);
            border: none;
            color: #555;
            font-size: 16px;
            cursor: pointer;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20px;
            transition: background 0.3s, color 0.3s, transform 0.2s;
        }
        .banner-close-btn:hover {
            background: rgba(255, 255, 255, 0.9);
            color: #000;
            transform: scale(1.1);
        }
        /* Сдвигаем контент сайта вниз, чтобы баннер его не перекрывал */
        body {
            padding-top: 55px !important; 
        }
    `;
    document.head.appendChild(style);

    // Создаем HTML структуру баннера
    const banner = document.createElement('div');
    banner.className = 'domain-move-banner';
    banner.id = 'domain-move-banner';
    banner.innerHTML = `
        <div class="banner-text-container">
            <span class="banner-main-text">
                Diqqat! Saytimiz manzili o‘zgarmoqda. 2026-yil sentabridan boshlab loyihamiz to‘liq <span class="banner-new-domain">prank-as.uz</span> manziliga ko‘chadi. Hozirdanoq yangi manzilga o‘tib, Prank-as’dan bemalol foydalanishingiz mumkin!
            </span>
        </div>
        <button class="banner-close-btn" id="banner-close-btn" title="Закрыть">&#10005;</button>
    `;
    
    // Добавляем баннер в самое начало body
    document.body.prepend(banner);

    // Логика кнопки закрытия
    document.getElementById("banner-close-btn").addEventListener("click", function() {
        banner.style.animation = 'banner-entry 0.5s ease-in reverse forwards'; // Анимация скрытия
        setTimeout(() => {
            banner.style.display = "none";
            document.body.style.paddingTop = "0"; // Возвращаем отступ сайта обратно
            localStorage.setItem("prankAsBannerClosed", "true"); // Запоминаем закрытие
        }, 500); // Задержка для завершения анимации
    });
});
