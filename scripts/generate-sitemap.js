const fs = require("fs");
const path = require("path");

const DOMAIN = "https://type.arunck.com";
const ROOT_DIR = ".";
const OUTPUT = "sitemap.xml";

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    if (file.startsWith(".") || file === "node_modules") return;

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath, files);
    } else if (file.endsWith(".html")) {
      files.push(fullPath);
    }
  });
  return files;
}

function toUrl(filePath) {

  // FIX: root index.html
  if (filePath === "index.html" || filePath === "./index.html") {
    return DOMAIN + "/";
  }

  let url = filePath
    .replace(/^\.?\//, "")     // remove ./ if present
    .replace(/\\/g, "/");      // windows fix

  if (url.endsWith("/index.html")) {
    url = url.replace(/\/index\.html$/, "/");
  } else if (url.endsWith(".html")) {
    url = url.replace(/\.html$/, "/");
  }

  return DOMAIN + "/" + url;
}

const pages = walk(ROOT_DIR)
  .map(toUrl)
  .filter(url => !url.includes("/partials/"));

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

pages.forEach(url => {
  xml += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
});

xml += `</urlset>\n`;

fs.writeFileSync(OUTPUT, xml, "utf8");

console.log(`✔ Sitemap generated: ${OUTPUT}`);
console.log(`✔ Pages found: ${pages.length}`);
