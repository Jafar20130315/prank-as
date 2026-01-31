import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TRACKER_TAG = `<script src="/tracker.js" data-prank-as="tracker"></script>`;
const MENU_TAG = `<script src="/auto-menu.js" data-prank-as="menu"></script>`;

const EXCLUDE_DIRS = new Set([".git", "node_modules", ".github"]);
const EXCLUDE_FILES = new Set([]); // xohlasang masalan "admin.html" ni exclude qilasan

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(ROOT, p);

    if (rel.split(path.sep).some(seg => EXCLUDE_DIRS.has(seg))) continue;

    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (st.isFile() && name.toLowerCase().endsWith(".html")) out.push(p);
  }
  return out;
}

function inject(html) {
  // allaqachon qo‘yilgan bo‘lsa tegmaymiz
  if (html.includes('data-prank-as="tracker"') || html.includes("/tracker.js")) return html;

  // </body> oldidan qo‘shamiz (eng xavfsiz joy)
  if (html.includes("</body>")) {
    return html.replace(
      /<\/body>/i,
      `  ${MENU_TAG}\n  ${TRACKER_TAG}\n</body>`
    );
  }

  // agar </body> bo‘lmasa, oxiriga qo‘shamiz
  return html + `\n${MENU_TAG}\n${TRACKER_TAG}\n`;
}

const files = walk(ROOT);
let changed = 0;

for (const file of files) {
  const base = path.basename(file);
  if (EXCLUDE_FILES.has(base)) continue;

  const oldHtml = fs.readFileSync(file, "utf8");
  const newHtml = inject(oldHtml);

  if (newHtml !== oldHtml) {
    fs.writeFileSync(file, newHtml, "utf8");
    changed++;
    console.log("Injected:", path.relative(ROOT, file));
  }
}

console.log("Done. Changed files:", changed);
