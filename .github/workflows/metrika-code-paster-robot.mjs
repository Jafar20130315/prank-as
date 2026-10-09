import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const METRIKA_ID = "113262007";
const TAG = `<script src="/metrika-code-paster.js" data-prank-as="metrika"></script>`;

const EXCLUDE_DIRS = new Set([".git", "node_modules", ".github"]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(ROOT, p);
    if (rel.split(path.sep).some((seg) => EXCLUDE_DIRS.has(seg))) continue;

    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (st.isFile() && name.toLowerCase().endsWith(".html")) out.push(p);
  }
  return out;
}

function paste(html) {
  // Метрика уже подключена: ничего не делаем
  if (html.includes("/metrika-code-paster.js") || html.includes(`ym(${METRIKA_ID}`)) {
    return html;
  }
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, () => `  ${TAG}\n</body>`);
  }
  return html + `\n${TAG}\n`;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const oldHtml = fs.readFileSync(file, "utf8");
  const newHtml = paste(oldHtml);
  if (newHtml !== oldHtml) {
    fs.writeFileSync(file, newHtml, "utf8");
    changed++;
    console.log("Metrika pasted:", path.relative(ROOT, file));
  }
}
console.log("Done. Changed files:", changed);
