import os

SCRIPT_TAG = '<script src="/auto-menu.js"></script>'

def inject_menu():
    for root, dirs, files in os.walk("."):
        for file in files:
            path = os.path.join(root, file)
            
            # Если это главная страница — УДАЛЯЕМ скрипт, если он там есть
            if file.lower() == "index.html":
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if SCRIPT_TAG in content:
                    print(f"🧹 Удаляю меню из главной: {path}")
                    new_content = content.replace(SCRIPT_TAG, "")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                continue

            # Для всех остальных файлов — вставляем
            if file.endswith(".html"):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if SCRIPT_TAG not in content and '</body>' in content:
                    print(f"✅ Вставляю в: {path}")
                    new_content = content.replace('</body>', f'{SCRIPT_TAG}</body>')
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    inject_menu()
