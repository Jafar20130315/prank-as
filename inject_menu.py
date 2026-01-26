import os

# Твой тег. Удалили начальный слэш для надежности путей
SCRIPT_TAG = '<script src="auto-menu.js"></script>'

def inject_menu():
    print("🚀 Робот запущен. Ищу файлы...")
    for root, dirs, files in os.walk("."):
        # Пропускаем скрытые папки (типа .git)
        if '.github' in root or '.git' in root:
            continue
            
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                
                # ИСКЛЮЧАЕМ главную страницу
                if file.lower() == "index.html":
                    print(f"🏠 Пропускаю главную: {path}")
                    continue

                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if SCRIPT_TAG not in content:
                    if '</body>' in content:
                        print(f"✅ Вставляю меню в: {path}")
                        new_content = content.replace('</body>', f'{SCRIPT_TAG}</body>')
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                    else:
                        print(f"⚠️ Ошибка: В файле {path} нет тега </body>")
                else:
                    print(f"ℹ️ Скрипт уже есть в: {path}")

if __name__ == "__main__":
    inject_menu()
