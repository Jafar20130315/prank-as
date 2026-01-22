import os

# Что вставляем
SCRIPT_TAG = '<script src="/auto-menu.js"></script>'

def inject_menu():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Если скрипта еще нет, но есть </body>
                if SCRIPT_TAG not in content and '</body>' in content:
                    print(f"Injecting menu into {path}")
                    new_content = content.replace('</body>', f'{SCRIPT_TAG}</body>')
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    inject_menu()
