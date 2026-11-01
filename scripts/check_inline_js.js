#!/usr/bin/env node
// Extracts every inline <script> (no src, JS type) from an HTML file and syntax-checks it.
// Usage: node scripts/check_inline_js.js <file.html>
const fs = require('fs');
const vm = require('vm');
const file = process.argv[2];
if (!file) { console.error('usage: check_inline_js.js <file.html>'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m, n = 0, bad = 0, skipped = 0;
while ((m = re.exec(html))) {
  const attrs = m[1], body = m[2];
  const line = html.slice(0, m.index).split('\n').length;
  if (/\bsrc\s*=/.test(attrs) || !body.trim()) { skipped++; continue; }
  const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(attrs);
  if (t && !/javascript|ecmascript|^module$/i.test(t[1])) { skipped++; continue; }
  if (/text\/babel|jsx/i.test(attrs)) { skipped++; continue; }
  n++;
  try { new vm.Script(body, { filename: file + ':script@line' + line }); }
  catch (e) { bad++; console.error('SYNTAX ERROR in script at line ' + line + ': ' + e.message); }
}
console.log(`checked ${n} inline scripts, skipped ${skipped}, failures ${bad}`);
process.exit(bad ? 1 : 0);
