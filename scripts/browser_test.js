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

  // Real lesson: open the 12-step curriculum, the preface and its first lesson through the UI so the real
  // read and continue buttons render. speechSynthesis is stubbed because headless Chromium has no voices.
  await pg.evaluate(() => {
    window.__ssBusyUntil = 0; window.__speakCount = 0;
    window.__fakeOnend = true;
    const ss = window.speechSynthesis;
    ss.speak = function (u) { window.__speakCount++; if (window.__fakeOnend) setTimeout(() => u.onend && u.onend(), 5); };
    ss.cancel = function () {}; ss.resume = function () {}; ss.pause = function () {};
    Object.defineProperty(ss, 'speaking', { configurable: true, get: () => Date.now() < window.__ssBusyUntil });
    Object.defineProperty(ss, 'pending', { configurable: true, get: () => false });
    localStorage.removeItem('rrn_progress'); localStorage.setItem('rrn_read_pos_pref-1', '3');
  });
  let opened = false;
  try {
    await pg.getByText('12-Step Curriculum', { exact: true }).first().click(); await pg.waitForTimeout(1500);
    await pg.getByText('Preface \u2014 Why This Program Exists').first().click(); await pg.waitForTimeout(800);
    await pg.getByText('Why this program exists \u2014 and why you cannot fix yourself').first().click(); await pg.waitForTimeout(1500);
    opened = await pg.evaluate(() => !!document.getElementById('caleb-read-btn-pref-1') && !!document.getElementById('caleb-continue-btn-pref-1'));
  } catch (e) { log.push('INFO: lesson open failed: ' + e.message.slice(0, 200)); }
  rec('real lesson view renders read and continue buttons', opened, opened ? 'caleb-read-btn-pref-1 and caleb-continue-btn-pref-1 present' : 'lesson buttons not found');
  await pg.screenshot({ path: path.join(OUT, 'v90_lessons.png') });
  if (opened) {
    // Continue resumes from the saved position through the audio controller
    const cont = await pg.evaluate(async () => {
      const c = window._calebAudioController; const btn = document.getElementById('caleb-continue-btn-pref-1');
      window.__fakeOnend = false; // hold the reader on the first resumed sentence
      btn.click(); await new Promise(r => setTimeout(r, 900));
      const out = { position: c.readPosition, reading: c.isReading, sentences: c.sentences.length };
      c.isReading = false; c.readPosition = 0; c.sentences = []; window.__fakeOnend = true;
      return out;
    });
    rec('Continue button resumes from saved position (3)', cont.reading === true && cont.position >= 4 && cont.sentences > 4, JSON.stringify(cont));
    // Full read through the real Read button: completion must be recorded
    await pg.evaluate(() => { localStorage.removeItem('rrn_read_pos_pref-1'); window.__posted = []; const of = window.fetch; window.fetch = function (u, i) { if (String(u).indexOf('/lms/') >= 0) window.__posted.push({ u: String(u), m: i && i.method }); return of.apply(this, arguments); }; document.getElementById('caleb-read-btn-pref-1').click(); });
    let comp = null;
    for (let i = 0; i < 120 && !comp; i++) {
      await pg.waitForTimeout(1000);
      comp = await pg.evaluate(() => { const p = JSON.parse(localStorage.getItem('rrn_progress') || '{}')['pref-1']; return p && p.audioCompleted ? p : null; });
    }
    const q = await pg.evaluate(() => ({ posted: window.__posted, queue: JSON.parse(localStorage.getItem('rrn_sync_queue') || '[]').map(x => ({ path: x.path, attempts: x.attempts })) }));
    rec('lesson completion recorded through the real Read button (stubbed speech)', !!comp, JSON.stringify({ comp: !!comp, posted: q.posted, queue: q.queue }));
    rec('completion posts to /lms/progress (backend refuses, queued with attempts counter)', !!comp && q.posted.some(x => /\/lms\/progress$/.test(x.u) && x.m === 'POST'), JSON.stringify(q));
  } else {
    rec('Continue button / lesson completion', false, 'NOT TESTED: lesson view did not render');
  }

  // Audio bound: while speech is still busy after the length floor, the reader must keep waiting
  const ab = await pg.evaluate(async () => {
    const c = window._calebAudioController; window.__fakeOnend = false; window.__ssBusyUntil = Date.now() + 1500;
    c.isReading = true; const t0 = Date.now();
    await new Promise(res => c.speakSentence('Short one.', res));
    const dt = Date.now() - t0; c.isReading = false; window.__fakeOnend = true; window.__ssBusyUntil = 0;
    return { elapsedMs: dt };
  });
  rec('audio bound waits while speechSynthesis is busy (fake engine, not real speech)', ab.elapsedMs >= 1400 && ab.elapsedMs < 2600, JSON.stringify(ab));

  // Safety: distress beats the employer-only reply (L7), and nav phrases are not false distress hits
  const safety = await pg.evaluate(async () => {
    const run = async (q) => {
      const spoken = []; const o = window._calebSpeak; window._calebSpeak = function (t) { spoken.push(String(t)); };
      const before = (JSON.parse(localStorage.getItem('caleb_distress_flags') || '[]')).length;
      document.getElementById('caleb-text-input').value = q; window._cSend();
      await new Promise(r => setTimeout(r, 800)); window._calebSpeak = o;
      return { spoken: spoken.join(' | ').slice(0, 300), newFlags: (JSON.parse(localStorage.getItem('caleb_distress_flags') || '[]')).length - before };
    };
    const out = {};
    out.navBack = await run('go back to housing');
    window._rrnActiveLevel = 7;
    out.employerDistress = await run('I relapsed and I feel hopeless');
    out.employerHiring = await run('show me the candidate pipeline for sobriety lessons');
    window._rrnActiveLevel = undefined;
    return out;
  });
  rec('nav phrase "go back to housing" is not a distress hit', safety.navBack.newFlags === 0 && !/988/.test(safety.navBack.spoken), JSON.stringify(safety.navBack));
  rec('L7 employer in distress gets the 988 response, not the hiring-only reply', /988/.test(safety.employerDistress.spoken) && !/only assist with hiring/.test(safety.employerDistress.spoken), JSON.stringify(safety.employerDistress));
  rec('L7 employer non-distress recovery question still gets hiring-only reply', /only assist with hiring/.test(safety.employerHiring.spoken), JSON.stringify(safety.employerHiring));

  const forbidden = await pg.evaluate(() => new RegExp('eagle' + ' summit|jeff' + ' walters|50' + '1\\(c\\)|fiscal' + ' sponsor|tax-' + 'deductible|tax ' + 'receipt|tax ' + 'advantage|charitable ' + 'deduction|IRS ' + 'deduction|form ?' + '8283|tax ' + 'documentation|charitable ' + 'contribution|charitable ' + 'mileage|BENEFIT ' + 'ESTIMATOR|tax ' + 'benefit(?! is claimed)', 'i').test(document.body.innerText));
  rec('rendered page has no forbidden terms', !forbidden, '');

  const pe = log.filter(l => l.startsWith('PAGEERROR'));
  rec('no uncaught page errors', pe.length === 0, pe.slice(0, 5).join(' | '));
  fs.writeFileSync(path.join(OUT, 'browser_console.log'), log.join('\n'));
  fs.writeFileSync(path.join(OUT, 'browser_network_errors.log'), res.join('\n'));
  fs.writeFileSync(path.join(OUT, 'browser_results.json'), JSON.stringify(R, null, 2));
  console.log('console msgs:', log.length, 'errors:', log.filter(l => l.startsWith('error')).length, 'network>=400/failed:', res.length);
  await b.close();
})().catch(e => { console.log('RUN FAIL:', e.message.slice(0, 1500)); process.exit(2); });
