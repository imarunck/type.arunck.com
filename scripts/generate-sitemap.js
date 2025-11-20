#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Usage (examples):
 *   node scripts/generate-sitemap.js --domain=https://type.arunck.com
 *   node scripts/generate-sitemap.js --domain=https://type.arunck.com --dir=./public --out=./public/sitemap.xml
 *   node scripts/generate-sitemap.js --domain=https://type.arunck.com --write-robots
 *
 * What it does:
 * - Walks the target directory (default: project root)
 * - Finds candidate HTML pages (index.html and other .html files)
 * - Converts local paths to site URLs using the provided domain
 * - Emits sitemap.xml with <loc>, <lastmod>, optional <changefreq> and <priority>
 *
 * Notes:
 * - By default, it ignores common asset folders (node_modules, assets, css, js, images).
 * - You can supply a config JSON via --config=./scripts/sitemap.config.json to set per-path priorities/changefreq.
 */

const fs = require('fs');
const path = require('path');

const argv = require('minimist')
  ? require('minimist')(process.argv.slice(2))
  : (function () {
      // Minimal fallback parser (in case minimist not installed)
      const args = {};
      for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith('--')) {
          const [k, v] = arg.slice(2).split('=');
          args[k] = v === undefined ? true : v;
        }
      }
      return args;
    })();

// Support either with or without minimist - but prefer built-in
const opts = {
  domain: argv.domain || argv.d || process.env.SITE_DOMAIN || 'https://type.arunck.com',
  dir: argv.dir || argv._?.[0] || './',              // base directory to scan
  out: argv.out || './sitemap.xml',                  // output sitemap path
  writeRobots: argv['write-robots'] || argv.r || false,
  config: argv.config || null,
  verbose: argv.verbose || argv.v || false,
  // default exclude folders
  exclude: (argv.exclude && argv.exclude.split(',')) || ['node_modules', '.git', 'assets', 'css', 'js', 'images', 'scripts'],
  // default file globs to include
  includeHtml: argv.includeHtml || true
};

function log(...args) {
  if (opts.verbose) console.log(...args);
}

function isHidden(name) {
  return name.startsWith('.');
}

function shouldExclude(relPath) {
  // Exclude if any segment matches an excluded folder
  const parts = relPath.split(path.sep);
  for (const ex of opts.exclude) {
    if (parts.includes(ex)) return true;
  }
  return false;
}

function walkDir(dir, cb) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const full = path.join(dir, file.name);
    const rel = path.relative(opts.dir, full);
    if (isHidden(file.name)) continue;
    if (shouldExclude(rel)) continue;

    if (file.isDirectory()) {
      walkDir(full, cb);
    } else if (file.isFile()) {
      cb(full, rel);
    }
  }
}

/**
 * Convert a relative path (inside site dir) to a clean URL path.
 * Rules:
 *  - /index.html at root -> '/'
 *  - /about/index.html -> '/about/'
 *  - /blog/article1/index.html -> '/blog/article1/'
 *  - other .html (e.g. /foo.html) -> '/foo.html' (you can tweak to remove .html if you want)
 */
function toUrlPath(relPath) {
  // Normalize to posix slashes for URL
  let p = relPath.split(path.sep).join('/');

  // Strip query/hash if somehow present (shouldn't be)
  p = p.split('?')[0].split('#')[0];

  // Only handle .html files and directories with index.html
  if (p.endsWith('index.html')) {
    p = p.replace(/index\.html$/, '');
    if (!p.startsWith('/')) p = '/' + p;
    if (!p.endsWith('/')) p = p + '/';
    // root case
    if (p === '//') p = '/';
    return p;
  }

  // Plain html file like foo.html -> /foo.html
  if (p.endsWith('.html')) {
    if (!p.startsWith('/')) p = '/' + p;
    return p;
  }

  // Not an html file; if directory, point to trailing slash
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p = p + '/';
  return p;
}

/** Default rules for changefreq/priority by path heuristics */
function heuristicsForUrl(urlPath) {
  // defaults
  let changefreq = 'monthly';
  let priority = '0.5';

  if (urlPath === '/' || urlPath === '') {
    changefreq = 'weekly';
    priority = '1.0';
  } else if (urlPath.startsWith('/fonts/')) {
    changefreq = 'monthly';
    priority = '0.9';
  } else if (urlPath.startsWith('/blog/')) {
    changefreq = 'weekly';
    priority = '0.8';
  } else if (urlPath.startsWith('/about')) {
    changefreq = 'yearly';
    priority = '0.6';
  } else {
    changefreq = 'monthly';
    priority = '0.5';
  }

  return { changefreq, priority };
}

/** Load optional config JSON that can override heuristics.
 * config file format (example below in README example):
 * {
 *   "/": { "changefreq": "weekly", "priority": "1.0" },
 *   "/fonts/gtn/": { "changefreq": "monthly", "priority": "0.9" }
 * }
 */
let configOverrides = {};
if (opts.config) {
  try {
    const cfgPath = path.resolve(opts.config);
    if (fs.existsSync(cfgPath)) {
      configOverrides = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      log('Loaded config overrides from', cfgPath);
    } else {
      console.warn('Config file not found:', cfgPath);
    }
  } catch (err) {
    console.error('Failed to read config JSON:', err.message);
  }
}

// Collect urls
const urls = []; // { loc, lastmod, changefreq, priority }
const scanBase = path.resolve(opts.dir);

walkDir(scanBase, (fullPath, relPath) => {
  const ext = path.extname(fullPath).toLowerCase();
  if (ext !== '.html') return; // ignore non-html files

  // convert path to URL path
  const urlPath = toUrlPath(relPath);

  // ignore certain patterns like partials or templates (optional)
  const basename = path.basename(fullPath).toLowerCase();
  if (basename.startsWith('_') || basename.startsWith('.')) return;

  // Determine lastmod from file mtime
  let lastmod = null;
  try {
    const stat = fs.statSync(fullPath);
    lastmod = new Date(stat.mtime).toISOString();
  } catch (err) {
    lastmod = null;
  }

  // Heuristics and config override
  const heur = heuristicsForUrl(urlPath);
  const override = configOverrides[urlPath] || {};
  const changefreq = override.changefreq || heur.changefreq;
  const priority = override.priority || heur.priority;

  // Only include canonical-like URLs (avoid double-including /index.html and /)
  // We'll include the cleaned urlPath only (converted above)
  const loc = (opts.domain.endsWith('/') ? opts.domain.slice(0, -1) : opts.domain) + urlPath;

  urls.push({ loc, lastmod, changefreq, priority, file: fullPath });
  log('Found page:', loc);
});

// Remove duplicates (multiple files mapping to same URL)
const unique = {};
const finalUrls = [];
for (const u of urls) {
  if (!unique[u.loc]) {
    unique[u.loc] = true;
    finalUrls.push(u);
  }
}

// Sort by priority then path (optional)
finalUrls.sort((a, b) => {
  const pa = parseFloat(a.priority), pb = parseFloat(b.priority);
  if (pa !== pb) return pb - pa;
  return a.loc.localeCompare(b.loc);
});

// Build XML
const xmlParts = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

for (const u of finalUrls) {
  xmlParts.push('  <url>');
  xmlParts.push(`    <loc>${u.loc}</loc>`);
  if (u.lastmod) xmlParts.push(`    <lastmod>${u.lastmod}</lastmod>`);
  if (u.changefreq) xmlParts.push(`    <changefreq>${u.changefreq}</changefreq>`);
  if (u.priority) xmlParts.push(`    <priority>${u.priority}</priority>`);
  xmlParts.push('  </url>');
}

xmlParts.push('</urlset>');

const xml = xmlParts.join('\n');

// Write sitemap file
const outPath = path.resolve(opts.out);
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Sitemap written to', outPath, `(${finalUrls.length} URLs)`);

// Optionally write robots.txt (simple)
if (opts.writeRobots) {
  const robotsPath = path.join(path.dirname(outPath), 'robots.txt');
  const sitemapUrl = (opts.domain.endsWith('/') ? opts.domain.slice(0, -1) : opts.domain) + '/' + path.basename(outPath);
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`
  ].join('\n');
  fs.writeFileSync(robotsPath, robots, 'utf8');
  console.log('robots.txt written to', robotsPath);
}
