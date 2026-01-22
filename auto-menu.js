document.addEventListener("DOMContentLoaded", function() {
    // ПРОВЕРКА: Если это главная страница, ничего не делать
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path.endsWith("/index.html")) {
        console.log("Это главная страница. Меню не загружается.");
        return; // Полная остановка скрипта
    }

    // ... дальше весь остальной твой код меню ...
    const style = document.createElement('style');
    // и так далее...
});
