// Logic tests for the v90 fixes. No browser: functions are extracted from the HTML by marker
// comments or anchors and run in a node vm with minimal stubs.
// Usage: node tests/caleb_logic.test.js [file.html]   (default REFINED_18_05_HEALED_v90_FIXES.html)
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const file = process.argv[2] || path.join(__dirname, '..', 'REFINED_18_05_HEALED_v90_FIXES.html');
const html = fs.readFileSync(file, 'utf8');
let failed = 0, passed = 0;
function test(name, fn) {
  return Promise.resolve().then(fn).then(
    () => { passed++; console.log('ok   - ' + name); },
    (e) => { failed++; console.log('FAIL - ' + name + ': ' + (e && e.message)); });
}
// Built from fragments so this file itself does not contain the banned strings.
const FORBIDDEN_RE = new RegExp('\\b' + 'es' + 'm\\b|es' + 'm[A-Z_]|eagle' + ' summit|jeff' + ' walters|50' + '1\\s*\\(?c\\)?|fiscal' + '\\s*sponsor|tax[-\\s]?' + 'deductible|tax\\s+' + 'receipt|tax\\s+' + 'advantage|charitable\\s+' + 'deduction|IRS\\s+' + 'deduction|form\\s*' + '8283|tax\\s+' + 'documentation|charitable\\s+' + 'contribution|charitable\\s+' + 'mileage|IRS\\s*(?:§|publication|pub\\.?)\\s*(?:170|502)|BENEFIT\\s+' + 'ESTIMATOR|tax\\s+' + 'benefit(?!\\s+is\\s+claimed)', 'i');
function assert(c, m) { if (!c) throw new Error(m || 'assertion failed'); }
function between(a, b) {
  const i = html.indexOf(a); if (i < 0) throw new Error('anchor not found: ' + a);
  const j = html.indexOf(b, i); if (j < 0) throw new Error('end anchor not found: ' + b);
  return html.slice(i, j);
}
function marker(name) {
  return between('/* CALEB_TESTABLE_BEGIN:' + name + ' */', '/* CALEB_TESTABLE_END:' + name + ' */');
}
function makeStorage() {
  const m = {};
  return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; }, _m: m };
}

(async () => {
  await test('router tiebreak: equal score, higher specificity wins', () => {
    const w = {}; vm.runInNewContext(marker('pickbest').replace(/^\s*\/\/.*$/mg, ''), { window: w });
    const list = [{ id: 'a', score: 20, spec: 5 }, { id: 'b', score: 20, spec: 9 }, { id: 'c', score: 10, spec: 20 }];
    assert(w._calebPickBest(list).id === 'b', 'expected b');
  });
  await test('router tiebreak: full tie falls back to declaration order', () => {
    const w = {}; vm.runInNewContext(marker('pickbest'), { window: w });
    const list = [{ id: 'first', score: 12, spec: 4 }, { id: 'second', score: 12, spec: 4 }, { id: 'third', score: 12, spec: 4 }];
    for (let i = 0; i < 5; i++) assert(w._calebPickBest(list.slice()).id === 'first', 'expected first');
  });
  await test('distress detector matches crisis language and not neutral text', () => {
    const body = between('var _DISTRESS_SIGNALS = [', '];') + '];';
    const w = {}; vm.runInNewContext(body + marker('distress'), { window: w });
    assert(w._calebIsDistress('i want to die'), 'should detect');
    assert(!w._calebIsDistress('open my lessons'), 'should not detect');
    for (const q of ['go back to dashboard', 'get back on track', 'go back to housing', 'give up the draft', 'one more time please', 'just once more']) assert(!w._calebIsDistress(q), 'false positive: ' + q);
    for (const q of ['i relapsed', 'i give up', 'i m using again', 'i can t do this', 'i want to die', 'i am thinking about suicide', 'i feel suicidal', 'i keep killing myself over this', 'i want to end my life', 'i am going to relapse']) assert(w._calebIsDistress(q), 'missed: ' + q);
    for (const q of ['relapse prevention lesson', 'open the relapse plan']) assert(!w._calebIsDistress(q), 'false positive: ' + q);
  });
  await test('safety gate ordering: employer + distress run before intent dispatch', () => {
    const iIntents = html.indexOf('var INTENTS = [');
    const iEmp = html.indexOf('if(_empHandled) return;');
    const iDis = html.indexOf('var _isDistress = window._calebIsDistress(ql);');
    const iNav = html.indexOf("if(type === 'nav'){");
    assert(iIntents > 0 && iEmp > 0 && iDis > 0 && iNav > 0, 'anchors missing');
    assert(iEmp < iIntents, 'employer gate must precede INTENTS');
    assert(iDis < iIntents && iDis < iNav, 'distress gate must precede nav/act dispatch');
    assert(iDis < html.indexOf('var _empHandled = (function(){'), 'distress gate must precede the employer gate');
  });
  await test('rrnApi is a function, never throws, falls back to localStorage queue', async () => {
    const code = between('/* v90: rrnApi is a real function', 'function rrnLoadProgressFromApi');
    const ls = makeStorage();
    const w = { RRN_BACKEND_CONFIG: { BACKEND_URL: 'https://example.invalid' }, location: { protocol: 'https:' } };
    const ctx = { window: w, localStorage: ls, navigator: { onLine: true }, fetch: () => Promise.reject(new Error('network down')), JSON, Date, Promise };
    vm.runInNewContext(code, ctx);
    assert(typeof w.rrnApi === 'function', 'rrnApi must be a function');
    const r = await w.rrnApi('/lms/progress', 'POST', { lessonId: 'x' });
    assert(r && r.ok === false && r.queued === true, 'expected soft failure with queued flag');
    assert(JSON.parse(ls.getItem('rrn_sync_queue')).length === 1, 'payload should be queued');
    const g = await w.rrnApi('/lms/progress', 'GET');
    assert(g.ok === false, 'GET fails soft');
  });
  await test('rrnApi success path hits backend base from RRN_BACKEND_CONFIG', async () => {
    const code = between('/* v90: rrnApi is a real function', 'function rrnLoadProgressFromApi');
    let url = null;
    const w = { RRN_BACKEND_CONFIG: { BACKEND_URL: 'https://rrn-api-production.up.railway.app' }, location: { protocol: 'https:' } };
    const ctx = { window: w, localStorage: makeStorage(), navigator: { onLine: true }, JSON, Date, Promise,
      fetch: (u) => { url = u; return Promise.resolve({ ok: true, json: () => Promise.resolve({ saved: 1 }) }); } };
    vm.runInNewContext(code, ctx);
    const r = await w.rrnApi('/lms/progress', 'POST', {});
    assert(url === 'https://rrn-api-production.up.railway.app/api/lms/progress', 'bad url ' + url);
    assert(r.ok === true, 'ok should be true');
  });
  await test('sync queue flush keeps entries queued during replay, caps attempts, does not duplicate', async () => {
    const code = between('/* v90: rrnApi is a real function', 'function rrnLoadProgressFromApi') + '\n' + between('function flushSyncQueue() {', '// -- 14.');
    const ls = makeStorage();
    ls.setItem('rrn_sync_queue', JSON.stringify([{ path: '/lms/progress', method: 'POST', body: { a: 1 }, attempts: 0 }, { path: '/lms/progress', method: 'POST', body: { a: 2 }, attempts: 4 }]));
    const w = { RRN_BACKEND_CONFIG: { BACKEND_URL: 'https://example.invalid' }, location: { protocol: 'https:' } };
    const ctx = { window: w, localStorage: ls, navigator: { onLine: true }, JSON, Date, Promise, fetch: () => { ls.setItem('rrn_sync_queue', JSON.stringify([{ path: '/new', method: 'POST', body: {}, attempts: 0 }])); return Promise.reject(new Error('down')); } };
    vm.runInNewContext(code + '\nvar rrnApi = window.rrnApi; flushSyncQueue();', ctx);
    await new Promise(r => setTimeout(r, 50));
    const q = JSON.parse(ls.getItem('rrn_sync_queue'));
    assert(q.some(i => i.path === '/new'), 'entry queued during replay was lost');
    assert(q.filter(i => i.body && i.body.a === 1).length === 1 && q.find(i => i.body && i.body.a === 1).attempts === 1, 'failed item should be re-added once with attempts+1');
    assert(!q.some(i => i.body && i.body.a === 2), 'item at attempt cap should be dropped');
  });
  await test('_rrnAPI.recordLessonCompletion is defined and saves to rrn_progress', () => {
    const code = between('window._rrnAPI=window._rrnAPI||', '\nwindow.');
    const ls = makeStorage();
    const w = {};
    vm.runInNewContext(code.trim() + '\n', { window: w, localStorage: ls, JSON, Date, console });
    assert(w._rrnAPI && typeof w._rrnAPI.recordLessonCompletion === 'function', 'hook missing');
    w._rrnAPI.recordLessonCompletion({ lessonId: 'L1', timestamp: 't' });
    assert(JSON.parse(ls.getItem('rrn_progress')).L1.audioCompleted === true, 'progress not saved');
  });
  function navCtx(over) {
    const spoken = [];
    const box = { style: {}, textContent: '' };
    const w = Object.assign({ _calebSpeak: m => spoken.push(m) }, over || {});
    const ctx = { window: w, document: { getElementById: () => box }, setTimeout: (f) => { f(); return 1; }, setInterval: () => 1, clearInterval() {}, CalebMemory: { set() {} } };
    vm.runInNewContext(marker('navigate'), ctx);
    return { w, spoken, box };
  }
  await test('navigate rejects invalid section ids with spoken + visible fallback', () => {
    const { w, spoken, box } = navCtx({ _rrnSetActiveSection() {} });
    assert(w._calebNavigate('../x<script>') === false, 'should reject');
    assert(spoken.length === 1 && box.textContent, 'fallback missing');
  });
  await test('navigate verifies render and reports failure when section does not change', () => {
    const { w, spoken } = navCtx({ _rrnSetActiveSection() { /* does not update _rrnActiveSection */ }, _rrnActiveSection: 'home' });
    w._calebNavigate('housing', 'q');
    assert(spoken.some(s => /did not load/.test(s)), 'expected load-failure message');
  });
  await test('navigate succeeds silently when section changes', () => {
    const o = {}; o._rrnSetActiveSection = function (s) { o._rrnActiveSection = s; };
    const { w, spoken } = navCtx(o);
    // navCtx copies props, so wire through w
    w._rrnSetActiveSection = function (s) { w._rrnActiveSection = s; };
    assert(w._calebNavigate('housing', 'q') === true);
    assert(spoken.length === 0, 'no error expected: ' + spoken.join('|'));
  });
  await test('audio bound respects speechSynthesis speaking state', () => {
    const seg = between('var maxWait = Math.max(800', 'this._currentUtterance = u;');
    assert(/speechSynthesis\.speaking/.test(seg) && /hardCap/.test(seg), 'speaking-state bound missing');
  });
  await test('RRN_API has no duplicate top-level keys', () => {
    const lit = between('var RRN_API = {', '\n};\n');
    const keys = (lit.match(/^  ([A-Za-z_][A-Za-z0-9_]*):/mg) || []).map(k => k.trim().slice(0, -1));
    const dups = keys.filter((k, i) => keys.indexOf(k) !== i);
    assert(dups.length === 0, 'duplicate keys: ' + [...new Set(dups)].join(','));
  });
  await test('Continue button no longer depends on unpopulated _rrnStartReading_', () => {
    assert(!/window\._rrnStartReading_\s*&&/.test(html), 'orphaned registry still referenced');
  });
  await test('threshold-rejected content policy: no forbidden terms in CALEB router block', () => {
    const blk = between('var INTENTS = [', 'Find winner');
    assert(!FORBIDDEN_RE.test(blk), 'forbidden term in router');
  });

  await test('setActiveSection wrapper is exposed so external navigation updates _rrnActiveSection', () => {
    const seg = between('setActiveSection = (function(orig){', '})(_useState10[1]);');
    assert(/window\._rrnSetActiveSection\s*=\s*w/.test(seg) && /window\._rrnActiveSection\s*=\s*v/.test(seg), 'wrapper not exposed');
    assert(!/window\._rrnSetActiveSection\s*=\s*orig/.test(seg), 'raw setter still exposed');
  });
  await test('forbidden terms appear nowhere in the whole v90 file', () => {
    const re = FORBIDDEN_RE;
    const bad = html.split('\n').map((l, i) => re.test(l) ? i + 1 : 0).filter(Boolean);
    assert(bad.length === 0, 'forbidden terms on lines: ' + bad.slice(0, 10).join(','));
  });
  await test('donation links point only to the GiveSendGo campaign', () => {
    assert(!/zeffy\.com|refinedrecovery\.com\/donate/i.test(html), 'stale donation URL present');
    assert(html.indexOf('https://www.givesendgo.com/help-build-refined-recovery-network') > -1, 'GiveSendGo URL missing');
  });

  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
