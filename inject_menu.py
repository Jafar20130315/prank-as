import os

# Строка, которую мы вставляем
SCRIPT_TAG = '<script src="/auto-menu.js"></script>'

def inject_menu():
    for root, dirs, files in os.walk("."):
        for file in files:
            # ПРОВЕРКА: только .html файлы и ИСКЛЮЧАЕМ index.html
            if file.endswith(".html") and file.lower() != "index.html":
                path = os.path.join(root, file)
                
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Вставляем только если скрипта еще нет и есть тег </body>
                if SCRIPT_TAG not in content and '</body>' in content:
                    print(f"Вставляю меню в: {path}")
                    new_content = content.replace('</body>', f'{SCRIPT_TAG}</body>')
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                else:
                    print(f"Пропускаю (уже есть или нет </body>): {path}")

if __name__ == "__main__":
    inject_menu()
