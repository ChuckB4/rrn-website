// Real-browser check of v90 (headless Chromium via Playwright). Serve the repo first:
//   python3 -m http.server 8765   then   PLAYWRIGHT_PATH=<path to playwright module> node scripts/browser_test.js
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'tests', 'browser_logs');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8765/REFINED_18_05_HEALED_v90_FIXES.html';
(async () => {
  const b = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const log = [], res = [];
  pg.on('console', m => log.push(m.type() + ': ' + m.text()));
  pg.on('pageerror', e => log.push('PAGEERROR: ' + e.message));
  pg.on('response', r => { if (r.status() >= 400) res.push(r.status() + ' ' + r.url()); });
  pg.on('requestfailed', r => res.push('FAILED ' + r.url() + ' ' + (r.failure() || {}).errorText));
  await pg.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await pg.waitForTimeout(8000);
  const R = [];
  const rec = (n, ok, d) => { R.push({ test: n, ok, detail: d }); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' :: ' + (d || '')); };
  const st = await pg.evaluate(() => ({ nav: typeof window._calebNavigate, set: typeof window._rrnSetActiveSection, send: typeof window._cSend, input: !!document.getElementById('caleb-text-input'), active: window._rrnActiveSection, rootKids: document.getElementById('root') && document.getElementById('root').childElementCount }));
  rec('app mounted and hooks present', st.nav === 'function' && st.set === 'function' && st.rootKids > 0, JSON.stringify(st));
  await pg.screenshot({ path: path.join(OUT, 'v90_loaded.png') });

  // Navigation
  for (const sec of ['housing', 'workforce', 'lessons', 'dashboard']) {
    const r = await pg.evaluate(async (s) => {
      window._calebNavFail = (function (o) { return function (m) { window.__navFail = m; o && o(m); }; })(window._calebNavFail);
      window.__navFail = null;
      const ret = window._calebNavigate(s, 'test');
      await new Promise(r => setTimeout(r, 1000));
      return { ret, active: window._rrnActiveSection, fail: window.__navFail };
    }, sec);
    rec('navigate ' + sec, r.ret === true && r.active === sec && !r.fail, JSON.stringify(r));
  }
  const bad = await pg.evaluate(async () => { window.__navFail = null; const r = window._calebNavigate('../x'); return { r, fail: window.__navFail }; });
  rec('navigate rejects invalid id', bad.r === false && !!bad.fail, JSON.stringify(bad));

  // Intent routing through the real text input
  const hasInput = await pg.evaluate(() => !!document.getElementById('caleb-text-input'));
  if (!hasInput) {
    const opened = await pg.evaluate(() => { const c = window.caleb; if (c && c.open) { c.open(); return 'caleb.open'; } return 'none'; });
    await pg.waitForTimeout(1500);
    log.push('INFO: tried to open caleb panel: ' + opened);
  }
  const hasInput2 = await pg.evaluate(() => !!document.getElementById('caleb-text-input'));
  if (hasInput2) {
    for (const [q, expect] of [['I need help with housing', null], ['open my lesson', null], ['asdf qwerty zzzz', 'nomatch']]) {
      const r = await pg.evaluate(async (q) => {
        const spoken = []; const o = window._calebSpeak; window._calebSpeak = function (t) { spoken.push(String(t).slice(0, 120)); };
        const intents = []; const ol = console.log; console.log = function () { if (arguments[0] === '[CALEB INTENT]') intents.push(arguments[1]); ol.apply(console, arguments); };
        const inp = document.getElementById('caleb-text-input'); inp.value = q;
        try { window._cSend(); } catch (e) { return { err: e.message }; }
        await new Promise(r => setTimeout(r, 1500));
        console.log = ol; window._calebSpeak = o;
        return { intents, spoken, active: window._rrnActiveSection };
      }, q);
      const ok = !r.err && (expect === 'nomatch' ? r.intents.length === 0 && r.spoken.length > 0 : r.intents.length > 0);
      rec('intent routing: "' + q + '"', ok, JSON.stringify(r));
    }
    const d = await pg.evaluate(async () => {
      const spoken = []; const o = window._calebSpeak; window._calebSpeak = function (t) { spoken.push(String(t)); };
      const inp = document.getElementById('caleb-text-input'); inp.value = 'I want to kill myself'; window._cSend();
      await new Promise(r => setTimeout(r, 1000)); window._calebSpeak = o; return spoken;
    });
    rec('distress phrase gets a spoken response (988)', d.length > 0 && /988/.test(d.join(' ')), JSON.stringify(d));
  } else {
    rec('intent routing via text input', false, 'caleb-text-input not in DOM after attempting to open panel; NOT TESTED');
  }

  // Lesson completion: only report what can be observed
  const lc = await pg.evaluate(async () => {
    window._rrnSetActiveSection && window._rrnSetActiveSection('lessons');
    await new Promise(r => setTimeout(r, 1500));
    const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(t => /continue|complete|start|begin/i.test(t)).slice(0, 10);
    return { lessonsVisible: /lesson/i.test(document.body.innerText), buttons: btns, courses: Array.isArray(window.RRN_COURSES) ? window.RRN_COURSES.length : null, lessons: Array.isArray(window.RRN_LESSONS) ? window.RRN_LESSONS.length : null };
  });
  rec('lessons section renders', lc.lessonsVisible, JSON.stringify(lc));
  await pg.screenshot({ path: path.join(OUT, 'v90_lessons.png') });
  const comp = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => /mark.*complete|complete lesson/i.test(b.innerText)); if (!b) return null; b.click(); return b.innerText.trim(); });
  rec('lesson completion button exercised', !!comp, comp ? 'clicked: ' + comp : 'no complete button visible in the lessons view; NOT TESTED');

  const forbidden = await pg.evaluate(() => new RegExp('eagle' + ' summit|jeff' + ' walters|50' + '1\\(c\\)|fiscal' + ' sponsor|tax-' + 'deductible', 'i').test(document.body.innerText));
  rec('rendered page has no forbidden terms', !forbidden, '');

  const pe = log.filter(l => l.startsWith('PAGEERROR'));
  rec('no uncaught page errors', pe.length === 0, pe.slice(0, 5).join(' | '));
  fs.writeFileSync(path.join(OUT, 'browser_console.log'), log.join('\n'));
  fs.writeFileSync(path.join(OUT, 'browser_network_errors.log'), res.join('\n'));
  fs.writeFileSync(path.join(OUT, 'browser_results.json'), JSON.stringify(R, null, 2));
  console.log('console msgs:', log.length, 'errors:', log.filter(l => l.startsWith('error')).length, 'network>=400/failed:', res.length);
  await b.close();
})().catch(e => { console.log('RUN FAIL:', e.message.slice(0, 1500)); process.exit(2); });
