# PHASE 3 — ARCHITECTURE MAP (RRN / CALEB PWA)

**Produced by:** Phase 3 Step 1 (Architecture Discovery)
**Date:** 2026-11-01
**Method:** Static source trace of v87 and v88. Every claim below cites `file:line`. No runtime assumptions — execution paths are traced through the actual code.

**Artifacts analyzed**

| Label | Path | Lines | Bytes | md5 |
|-------|------|-------|-------|-----|
| v87 (baseline) | `REFINED_18_05_HEALED_v87.html` | 61,475 | 6,270,012 | `b38128ed9bdfc0ba1f86fd3ce74457db` |
| v88 (Phase 2 fixes) | `REFINED_18_05_HEALED_v88_REPAIRED.html` | 61,855 | 6,278,163 | `a32ff28c32ddbedf85eb07e2cb0b7fb6` |
| v89 (later patch, not in scope) | `REFINED_18_05_HEALED_v89_PATCHED.html` | 61,355 | 6,261,133 | `1a3e1e7458473d99a1bd12aff373fb8b` |

All v88 line numbers below are authoritative against md5 `a32ff28c…`.

---

## 0. DATA-INTEGRITY NOTICE (read first)

During this step the working-tree file `REFINED_18_05_HEALED_v88_REPAIRED.html` was found **reverted to byte-identical v87 content** (both md5 `b38128ed…`). The genuine Phase 2 v88 (md5 `a32ff28c…`, the audio-controller rewrite) survived only in the on-disk backup:

- `/projects/sandbox/BACKUP/REFINED_18_05_HEALED_v88_REPAIRED.backup.20261101_061222` (6,278,163 bytes, md5 `a32ff28c…`)

**Git-confirmed scope of the corruption:** the committed `HEAD:REFINED_18_05_HEALED_v88_REPAIRED.html` is itself md5 `b38128ed…` — **byte-identical to v87**. The repaired v88 (`a32ff28c…`) was **never committed**; `_calebAudioController`, `_rrnAPI`, and `finishReading` appear in no HTML anywhere in git history (`git grep` across all commits finds them only in `CALEB_REMEDIATION_PLAN.md`). In other words, the "Phase 2 repaired" file tracked in the repo has been a silent duplicate of the baseline; the actual repaired code lived only in the working file (since overwritten) and this backup.

**Action taken:** I restored the working-tree `REFINED_18_05_HEALED_v88_REPAIRED.html` from that backup (it is now md5 `a32ff28c…`, 61,855 lines) and commit it so the repo's v88 is the genuine Phase 2 artifact. This is fully reversible — the backup, the v87 file, and prior git history all remain untouched. Without the restore, the next step (execution tracing) would have silently analyzed v87 under the v88 filename.

---

## 1. SOURCE INVENTORY

### 1.1 Structure: monolithic single-file PWA

Both v87 and v88 are **one self-contained HTML file** each — a monolithic PWA, not a modular build. Per v88:

- **38** inline `<script>` blocks, no module system (no `import`/`export`, no bundler output).
- **11,134** `React.createElement(...)` calls — the entire UI is hand-written `createElement` (no JSX/Babel at runtime).
- **~498** `localStorage` references — localStorage is the primary persistence layer; the Railway API is a sync target layered on top.
- **17** IndexedDB references (CALEB memory / offline cache).

### 1.2 External runtime dependencies (loaded by the PWA)

| Dependency | Source | Evidence |
|-----------|--------|----------|
| React 18.2.0 (UMD prod) | `cdnjs.cloudflare.com/.../react.production.min.js` | `<script src>` in head |
| ReactDOM 18.2.0 (UMD prod) | `cdnjs.cloudflare.com/.../react-dom.production.min.js` | same |
| qrcodejs 1.0.0 | `cdnjs.cloudflare.com/.../qrcode.min.js` | same |
| **Curriculum data `js/lessons.js`** | expected `<script src="js/lessons.js">` | v88:55874 comment; **FILE IS MISSING from the repo** (no `js/lessons.js`, no `lessons/lessons.js`) |

**Finding (P1):** `RRN_LESSONS` is initialized `var RRN_LESSONS = window.RRN_LESSONS || []` (v88:55878) and is meant to be populated by `js/lessons.js`. That file does not exist in the workspace, so unless the runtime loads it from the deployed host, `RRN_LESSONS` is empty and the lesson list / "Read Lesson Aloud" body (`l.body`) has no source. A rebuild path exists at v88:56140 (`window.RRN_LESSONS = rebuilt`). The `lessons/` directory holds standalone per-step HTML pages (`step-1-…html` … `step-12-…html`, prefaces) — these are separate static pages, not the PWA's `RRN_LESSONS` array.

### 1.3 v87 → v88 delta (what Phase 2 changed)

| Marker | v87 | v88 | Meaning |
|--------|-----|-----|---------|
| `_calebReadIdx` / `function startReading` / `function speakSentence` (old inline reader) | present @ v87:33179–33345 | **0** (removed) | old audio reader deleted |
| `_calebAudioController` | 0 | defined @ v88:1013 | new audio subsystem |
| `_calebReadLesson` | 0 | defined @ v88:1384 | new reader entry point |
| `_rrnAPI` | 0 | referenced @ v88:1276–1277 | new (but undefined — see §5a) |
| `finishReading` / `recordLessonCompletion` | 0 | @ v88:1260 / 1276 | new completion hook |
| `_rrnStateManager` | 0 | defined @ v88:1430+ | DEFECT-008 state tracker |

Net: v88 **replaced** the old inline reader with `_calebAudioController`. It did **not** leave a duplicate reader behind (verified: `function startReading`=0, `function speakSentence`=0 in v88).

### 1.4 Supporting / backend source in the repo (not part of the PWA file)

| Path | Lang | Purpose |
|------|------|---------|
| `routes/auth.ts` | TS (Express) | `/register /login /refresh /profile /logout` |
| `routes/workforce.ts` | TS | jobs, applications, résumé, certifications |
| `routes/grants.ts` | TS | grants CRUD |
| `routes/repairs.ts` | TS | self-heal repair log / run |
| `routes/community-events.ts` | TS | community events |
| `RRN_BACKEND_RAILWAY/rrn_intake_api.{ts,js}` | TS/JS | public intake form POST + health |
| `RRN_BACKEND_RAILWAY/rrn_radio_api.ts.txt` | TS | radio events/ratings/scoreboard |
| `RRN_BACKEND_RAILWAY/rrn_books_api.ts.txt` | TS | reading/book events + stats |
| `RRN_BACKEND_RAILWAY/rrn_followup_email.js` | JS | `/api/intake` follow-up email |
| `campuses.ts`, `index.ts`, `src/`, `lib/` | TS | config / entry fragments |

**Competing artifacts in the workspace** (same app, divergent copies — a maintenance hazard): `index.html` (591 KB), `index_27.html` / `index (6).html` (4.17 MB, identical to each other), `UPLOAD-THIS-TO-rrn-website-repo-ONLY.html` (4.18 MB), and the v87/v88/v89 trio. These are not wired together; only one is the deployed PWA.

---

## 2. FUNCTION CATALOG (v88)

### 2.1 `window._caleb*` namespace (19 members)

| Member | Line | Role |
|--------|------|------|
| `_calebAudioController` | 1013 | IIFE singleton; the entire read-aloud subsystem |
| `_calebReadLesson(lessonId, body, btn, container)` | 1384 | thin wrapper → `_calebAudioController.toggleReading` (1385); called @1492 |
| `_calebSpeak` | (73 call sites) | one-shot TTS announcer (Web Speech) |
| `_calebNavigate(section, q)` | 60623 | routes a nav intent to the React section setter |
| `_calebNavigateToLessonAndRead` | (1) | combined navigate-then-read helper |
| `_calebSetWaveState` | — | mic/thinking visual state |
| `_calebAudioController.currentContext/currentLesson` | 1430+ | updated by `_rrnStateManager` subscription |
| `_calebSystemHealth()` | 60xxx | computes 0–100 health score from localStorage |
| `_calebDetectIncidents` | — | derives incidents from health |
| `_calebContextResponse` | — | spoken confirmation after navigation |
| `_calebWS`, `_calebAwake`, `_calebT0`, `_calebGreeted`, `_calebVoiceWaiting`, `_calebContextResponse`, `_calebKeyWarned`, `_calebHealthInterval`, `_calebToggle`, `_calebReadingSession`, `_calebGreeting` | various | session/greeting/telemetry state |

**`_calebAudioController` methods** (IIFE @1013): `init`, `getBestVoice` (voice scoring ~1051), `segmentText`, `highlightSentence` (match scoring ~1149), `speakSentence(text,onComplete)` (~1200), `readNextSentence(container,btn,lessonId)` (~1232), `finishReading(btn,lessonId)` (1260), `pauseReading`, `resumeReading`, `toggleReading(lessonId,body,btn,container)` (start/stop entry).

### 2.2 `window.RRN_*` namespace (25 members)

Config/state: `RRN_BACKEND_CONFIG` (750), `RRN_BACKEND_LIVE` (752, default `false`), `RRN_API_BASE` (2322), `RRN_BACKEND_CONFIG`, `RRN_FILE_PROTOCOL`, `RRN_AUDIT_MODE`.
Data: `RRN_LESSONS` (55878), `RRN_COURSES`, `RRN_CURRICULUM_READY`, `RRN_CRE` (cross-reference engine), `RRN_EVENTS` (event bus, 59820+), `RRN_TELEMETRY`, `RRN_ERROR_LOG`/`RRN_ERROR_LEVELS`.
Secrets/engines: `RRN_ANTHROPIC_KEY` (Claude key), `RRN_HEAL`/`RRN_HEAL_ENGINE` (self-heal), `RRN_VALIDATE`, `RRN_KERNEL`, `RRN_PROVISION`, `RRN_PWA`, `RRN_CONTACT`, `RRN_MISSIONS`, `RRN_RESOLVE_TOKENS`, `RRN_INIT_COLLAPSIBLES`, `RRN_DASHBOARD_READY`, `RRN_UTILS_READY`.

### 2.3 `RRN_API` object (v88:3250)

Top-level `var RRN_API`. Every method returns `_apiFetch(path, opts)` (promise). Domains: `auth` (login/me/logout/isLoggedIn), `dashboard`, `meetings`, `audit`, `licensing`, `actions`, `members`, `intake`, `pipeline`, `tasks`, `journal`, `housing`, `notifications`, `grants`, `missions`, `activity`.

**Finding (P1 — duplicate object keys):** `actions`, `audit`, `licensing`, and `meetings` are each declared **two or three times** inside the one object literal (e.g. `actions:` appears 3×). JavaScript keeps only the **last** declaration, so the earlier blocks (including a first `actions` block that posts to `/actions/call` with a different payload shape) are silently discarded. The effective `RRN_API.actions` is the final positional-or-object variant; the effective `RRN_API.audit` is `{recent, byTarget}`.

**Finding:** `RRN_API` has **no lesson/progress/LMS method**. Curriculum persistence lives in a separate function layer (§2.4), not in `RRN_API`.

### 2.4 Curriculum / LMS layer (separate from `RRN_API`)

| Function | Line | Behavior |
|----------|------|----------|
| `PROGRESS_KEY` | 55880 | `'rrn_progress'` (localStorage key) |
| `rrnGetProgress()` | 55883 | read progress map from localStorage |
| `rrnSaveProgress(lessonId, data)` | 55889 | write localStorage **then** `rrnApi('/lms/progress','POST',…)` (55899) |
| `rrnApi` | 55912 | **stub object** `{progress:{get,set}, lessons:{get,complete}}` — see §5b |
| `rrnLoadProgressFromApi()` | 55912 | GET via real `_apiFetch('/lms/progress')` (55917) |
| `rrnTierGate(lesson, session)` | 55926 | access control by tier/role/level |
| `lessonComplete(lessonId, opts)` | 55951 | `rrnSaveProgress(...)` + `rrnApi('/lms/complete','POST',…)` (55965); callers: quiz pass @56078/56091, shortcut @56356 |
| `stepExam(stepNum, answers, cb)` | 55985 | `rrnApi('/lms/exam','POST',…)` |
| `mentorSignOff(lessonId, mentorId, …)` | 56009 | `rrnApi('/lms/mentor-signoff','POST',…)` |

### 2.5 Auth / fetch helpers

| Function | Line | Behavior |
|----------|------|----------|
| `_getToken()` | 2588 | reads JWT from `localStorage 'rrn_token'` |
| `_setToken(token, remember, refreshToken)` | 2595 | stores token / refresh token |
| `_apiFetch(path, opts)` | 2975 | **the real data-plane client** — see §3.1 |
| `window._apiFetch = function` (override #1) | 59989 | CALEB/self-heal re-defines a *global* `_apiFetch` |
| `window._apiFetch = function` (override #2) | 60880 | second global re-definition |

**Finding:** the primary `_apiFetch` (2975) is lexically scoped (not on `window`). Two later blocks define a *different* `window._apiFetch` (59989, 60880). Call sites that use bare `_apiFetch(...)` bind to the scoped one; `window._apiFetch(...)` call sites bind to the last global override. This is a split fetch surface worth noting for the execution-tracing step.

### 2.6 Intent engine (`_cSend`)

`window._cSend` is defined **three times** and forms a decorator chain (not replacement):

| Def | Line | Role |
|-----|------|------|
| `_cSend` #1 | 58989 | **the real handler**: `INTENTS` array (59064), scorer (59120), winner (59140), dispatch |
| `_cSend` #2 | 59820 | memory-logging wrapper; captures original into `_origCSend_nav` @59819 and calls it |
| `_cSend` #3 | 60604 | wave-animation wrapper; captures `origSend` @60603, guards with `_waveWrapped` |

Chain integrity verified: #2 captures #1 (`_origCSend_nav = window._cSend`, 59819) before reassigning; #3 captures the then-current `_cSend` and guards re-wrapping. So the real scorer at 58989 **is** reachable at runtime through the chain.

### 2.7 Database / persistence operations

**localStorage keys** (client-side source of truth): `rrn_token`, `rrn_refresh_token`, `rrn_progress` (curriculum), `rrn_platform` (members/attendance/prayer/victories), `rrn_read_pos_<lessonId>` (audio resume position), `rrn_lesson_progress`, `rrn_curriculum_progress`, `rrn_sync_queue` (offline write queue), `rrn_member_twin`, `caleb_session_turns`, `caleb_distress_flags`, `caleb_ltm_cache_<id>`, `rrn_anthropic_key`, `rrn_alerts`, `rrn_heal_audit`.

**API-backed CRUD** (through `_apiFetch` / `RRN_API`): members, intake, pipeline, tasks, journal, housing, meetings (+`/attend`), notifications (+`/dismiss`), grants, missions, licensing, actions (call/sms/assign-prayer/follow-up/resolve/log), audit, dashboard, activity.

**LMS CRUD** (through the broken `rrnApi` stub): `/lms/progress`, `/lms/complete`, `/lms/exam`, `/lms/mentor-signoff`; read via real `_apiFetch('/lms/progress')`.

---

## 3. API ENDPOINTS & INTEGRATIONS

### 3.1 Transport & auth (`_apiFetch`, v88:2975)

- **Base URL:** `API_BASE = https://rrn-api-production.up.railway.app/api` (2319–2322).
- **Auth header:** `Authorization: Bearer <token>`, token from `_getToken()` → `localStorage 'rrn_token'`.
- **Request body:** `JSON.stringify(opts.body)`; `Content-Type: application/json`.
- **Token refresh:** proactive if token expires within 90 s (`_doRefresh()` → `/auth/refresh`); on `401`, refresh once and retry; second `401` → clear token + dispatch `rrn:session-expired` + throw.
- **Error classification:** `404`/`403` thrown with `.status`; handled by `handleApiError`.
- **Offline / SCAAM fallback:** on `file:` protocol or offline, a **local token** `local_rrn_<ts>` is issued (2196–2208, 2243–2248) and the app runs localStorage-only. `RRN_BACKEND_LIVE` defaults `false` (752) and only flips `true` after a successful `/health` probe (769, 2223).

### 3.2 Declared backend contract — `RRN_BACKEND_CONFIG` (v88:750)

`BACKEND_URL = https://rrn-api-production.up.railway.app`; `AUTH_HEADER="Authorization"`, `TOKEN_PREFIX="Bearer "`, `HEALTH_CHECK="/api/health"`. Endpoint map includes: `/api/auth`, `/api/auth/profile`, `/api/auth/password`, `/api/dashboard/stats`, `/api/members`, `/api/members/:id`, `/api/members/:id/progress`, `/api/lms/steps`, `/api/lms/courses(/:id)`, `/api/lms/lessons/:id`, **`/api/lms/lessons/:lessonId/complete`**, `/api/housing(...)`, `/api/workforce/employers`, `/api/financial/overview|donations|expenses`, `/api/admin/users|campuses|modules|site-config|audit-log`, `/api/grants`, `/api/licensing/partners|revenue`.

**Finding (P2 — two divergent endpoint maps):** `RRN_BACKEND_CONFIG` declares `/api/lms/lessons/:lessonId/complete`, but the live client (`RRN_API` + LMS layer) posts completion to `/lms/complete` via `rrnApi`. The declared map and the actually-called paths do not match; `RRN_BACKEND_CONFIG` appears to feed the self-heal/health probes, while `RRN_API`/`_apiFetch` carries real traffic.

### 3.3 Live endpoints actually called from the PWA

- **Auth:** `/auth/login`, `/auth/me`, `/auth/logout`, `/auth/refresh`.
- **Data:** `/dashboard`, `/members(/:id)`, `/intake(/:id)`, `/pipeline(/:id)`, `/tasks(/:id)`, `/journal`, `/housing(/residents/:id)`, `/meetings(/:id/attend)`, `/notifications(/:id/dismiss)`, `/grants`, `/missions`, `/licensing/partners|revenue`, `/activity`, `/audit/recent|/audit/target/:id`, `/actions/{call,sms,assign-prayer,follow-up,resolve,log,recent}`.
- **LMS (via broken `rrnApi` — see §5b):** `/lms/progress` (GET works via `_apiFetch`; POST broken), `/lms/complete`, `/lms/exam`, `/lms/mentor-signoff`.
- **Parallel bulk load** (self-heal, 60xxx & `_checkBackend`): `/members /donations /meetings /housing /employers /grants` with `Authorization: Bearer`.

### 3.4 Backend route inventory (repo-side Express routers)

- `auth.ts`: `POST /`, `POST /login`, `POST /register`, `POST /refresh`, `GET /profile`, `POST /logout`.
- `workforce.ts`: `GET/POST /jobs`, `POST /jobs/:jobId/apply`, `PATCH /applications/:id/status`, `POST /resume`, `GET/PUT /resume`, `GET /my-applications`, `GET /certifications/:userId`, `POST /certifications`.
- `grants.ts`: `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`.
- `repairs.ts`: `GET /`, `POST /run`, `DELETE /log`.
- `RRN_BACKEND_RAILWAY`: intake `POST /` + `GET /health`; radio `POST /event`, `POST /rate`, `GET /scores|/board`; books `POST /event`, `GET /stats`, `GET /:slug/stats`; follow-up email `POST /api/intake`.

### 3.5 Third-party integrations

| Integration | Role | Evidence |
|-------------|------|----------|
| **Railway** | primary backend/data plane | `rrn-api-production.up.railway.app` (76 refs) |
| **Claude (Anthropic)** | CALEB chat + grant writer/repair | `fetch('https://api.anthropic.com/v1/messages')`, model **`claude-haiku-4-5-20251001`**, header `x-api-key` + `anthropic-dangerous-direct-browser-access:true`; 13 call sites (CALEB answer @59534, employer-mode @59048, grant engine @15280/15356/16098/16522/17465) |
| **Web Speech API (TTS)** | actual read-aloud engine | `SpeechSynthesisUtterance` (speakSentence ~1200), `window.speechSynthesis.speak/cancel/pause/resume` (21 refs) |
| **Piper TTS** | *monitored only*, not the active engine | health card "Piper TTS" port 5002, `window._piperOnline` flag (51153), probe reuses Railway `/api/health` (57675). The reader path uses Web Speech, not Piper. |
| **Jitsi** | virtual interview / remote meeting video | iframe overlay from candidate detail (header §53), `jitsiRoom`/`setJitsiRoom` (27982–28007) |
| **SpeechRecognition** | voice mic input to CALEB | 7 refs |
| **Ollama** | *stubbed* local LLM health check | `_checkOllama` resolves `{ok:false}` constant (60xxx) — effectively inert |
| **IndexedDB** | CALEB long-term memory / offline cache | 17 refs |

---

## 4. CRITICAL EXECUTION PATHS (traced through code)

### 4.1 Lesson reading (click → audio → completion)

```
User clicks "📖 Read Lesson Aloud"
  → button onClick (v88:33667-33674):
       window._calebAudioController.toggleReading(l.id, l.body, btn, container)
  → toggleReading: if already reading → cancel + finishReading (stop);
       else guards !body → _calebSpeak("no content"); else:
       init(); sentences = segmentText(body); readPosition=0; isReading=true;
       setTimeout(readNextSentence, 300)
  → readNextSentence (loop): if readPosition >= sentences.length → finishReading();
       else highlightSentence(...) then speakSentence(text, cb)
  → speakSentence (v88:~1200): new SpeechSynthesisUtterance(text), rate 0.87,
       voice = getBestVoice(); single `completed` flag guards three finalizers:
       u.onend=finalize, u.onerror=finalize, setTimeout(finalize, maxWait);
       watchdog setInterval 5 s calls speechSynthesis.resume();
       window.speechSynthesis.speak(u)
  → on finalize → cb → setTimeout(readNextSentence, 150)  (advance one sentence)
  → at end → finishReading (v88:1260)
```

Voice command route to the same place: CALEB `_cSend` → `case 'read-lesson'` (v88:59238) finds a DOM `<button>` whose text contains "Read Lesson" and calls `rb.click()` — i.e. it drives the same onClick above (it does not call the controller directly).

**Live reader is wired** (new controller, not orphaned). The Continue button beside it (33680–33689) is **orphaned**: its onClick calls `window._rrnStartReading_[l.id](savedI)`, but nothing in v88 populates `_rrnStartReading_` anymore (the old reader that set it was removed; `_rrnStartReading_` now has exactly one reference — the read at 33687). Resume-from-saved-position via that button is dead in v88.

### 4.2 Completion recording (`finishReading` → persistence → mentor visibility)

```
finishReading (v88:1260):
  percentComplete = readPosition / max(sentences.length,1) * 100
  build `verification` object (positions, counts, percent)
  if percentComplete >= 95 && sentences.length > 0:
      if (window._rrnAPI && window._rrnAPI.recordLessonCompletion)   ← v88:1276
          window._rrnAPI.recordLessonCompletion({lessonId, timestamp, verification, audioDevice})
      _calebSpeak("Lesson complete! …")
  reset state; speechSynthesis.cancel(); clear localStorage read-pos; clear highlights
```

**`finishReading` does NOT call `lessonComplete`, `rrnSaveProgress`, or any `RRN_API` method** (verified, 1260–1300). Its only persistence hook is `window._rrnAPI.recordLessonCompletion` — and `_rrnAPI` is never defined anywhere (§5a). **Net: finishing an audio read records nothing** to localStorage or backend; it is invisible to mentors.

The separate curriculum completion path (`lessonComplete`, 55951) is triggered by **quiz pass** (56078/56091), not by audio reading. It writes `localStorage 'rrn_progress'` then attempts `rrnApi('/lms/complete','POST',…)`, which is broken (§5b). So even quiz completion persists locally only; backend/mentor sync does not occur as written.

### 4.3 Intent routing (ambiguous query → scoring → winner)

```
_cSend #1 (58989): normalize query → ql (lowercased), words[]
  INTENTS array (59064): ~40 intents, each {id:'nav:…'|'act:…', score:0, patterns:[…]}
  scorer (59120): for each intent, reset score; for each pattern:
      exact substring match (ql.indexOf(pattern)>=0):  score += 10 + pattern.length
      per-word overlap (words >2 chars present):        score += matched*3
      all pattern words present & multiword:             score += 8
      short-query command boost (words.length<=4 & score>0): score += 3
  winner (59140): best = INTENTS.slice().sort((a,b)=>b.score-a.score)[0]
  threshold (59143): if best.score < 5 → "I didn't catch that" (no action)
  dispatch: type = best.id.split(':')[0]
      'nav' → window._calebNavigate(section,q); return   (59158)
      'act' → switch(target){checkin,prayer,victory,repair,status,read-lesson,
               briefing,incident,architecture,grant-start,self-heal}; return
      (fall-through) employer 42-CFR gate, distress detection, then 'ans' → Claude
```

**Finding (P2 — gate ordering):** the L7-employer 42 CFR Part 2 block (59xxx) and distress detection run **after** the nav/act dispatch `return`s. They therefore only apply to `type==='ans'` queries; a `nav:`/`act:` intent (e.g. "open lessons") returns before those gates. Worth flagging for the compliance review.

### 4.4 Navigation (voice "open lessons" → React state → CALEB awareness)

```
_cSend 'nav' → window._calebNavigate(section, q)  (60623)
  doNav():
     if (window._rrnSetActiveSection) {           ← the captured React setter
         window._rrnSetActiveSection(section);     ← triggers React re-render
         setTimeout(()=>window.caleb.close(), 200);
         window._calebContextResponse(section, q); ← spoken confirmation
         CalebMemory.set('session.lastSection', section);
         return true;
     }
     return false;
  if !doNav(): retry setInterval every 300 ms up to 10 attempts (React not mounted yet)
```

`_rrnSetActiveSection` is the raw React `useState` setter, captured when the dashboard wraps `setActiveSection` (v88:28837): the wrapper sets `window._rrnActiveSection = v`, calls `orig(v)`, and scrolls top. A second nav patch layer re-assigns `window._rrnSetActiveSection = patchNav(orig)` at 60157/60163. CALEB "awareness" of the current screen = `window._rrnActiveSection` (string) + `CalebMemory 'session.lastSection'` + the `_rrnStateManager.activeSection` subscription that pushes into `_calebAudioController.currentContext` (1430+).

### 4.5 Utterance queue (storage / consumption / duplicate risk)

There is **no explicit application-level utterance queue array**. The controller holds a flat sentence array `this.sentences` (from `segmentText(body)`) and a cursor `this.readPosition`, consuming **one `SpeechSynthesisUtterance` at a time** through the recursive `readNextSentence → speakSentence → callback → readNextSentence` loop. The only real queue is the browser's internal `speechSynthesis` queue, into which exactly one utterance is pushed per sentence. See §5d for duplicate analysis.

---

## 5. FIVE BLOCKING QUESTIONS — ANSWERED WITH CODE EVIDENCE

### (a) `_rrnAPI` initialization — WHERE is it assigned/injected/created?

**Answer: nowhere. `window._rrnAPI` is never defined — not in the PWA, not in any workspace file, not injected at runtime.**

Evidence:
- v88 references `_rrnAPI` only at **1276–1277**, both reads, both guarded:
  `if (window._rrnAPI && window._rrnAPI.recordLessonCompletion) { window._rrnAPI.recordLessonCompletion({…}) }`
- `grep '_rrnAPI\s*=' v88` → **no match** (no assignment).
- Workspace-wide `grep -rn '_rrnAPI' --include=*.{html,js,ts}` (excluding v88) → **no match**. The backend (`routes/`, `RRN_BACKEND_RAILWAY/`) never defines or injects it.
- v87 contains `_rrnAPI` **0** times.

**Consequence:** the guard at 1276 is always false → `recordLessonCompletion` is never invoked → the audio reader's completion hook is dead code. This is the root cause behind DEFECT-009/010's "completion not recorded."

### (b) Completion persistence — path from `finishReading()` to backend confirmation?

**Answer: there is no working path to the backend. Two disconnected mechanisms exist; neither reaches Railway as written.**

1. **Audio path:** `finishReading` (1260) → `window._rrnAPI.recordLessonCompletion(...)` (1276). `_rrnAPI` undefined (see §5a) → nothing persisted (not even localStorage). `finishReading` never calls `lessonComplete`/`rrnSaveProgress`/`RRN_API` (verified 1260–1300).
2. **Curriculum path:** `lessonComplete(lessonId, opts)` (55951), triggered by **quiz pass** (56078/56091), does `rrnSaveProgress(...)` → writes `localStorage 'rrn_progress'` (succeeds), then `rrnApi('/lms/complete','POST',…)` (55965) — broken (see §5d/§5b: `rrnApi` is a non-callable object).

So completion reaches **localStorage only** (and only via the quiz path, not the audio path). Mentor visibility requires backend persistence (`/lms/complete` or `/members/:id/progress`), which no live code path successfully reaches. The read path records nothing at all.

### (c) Intent tie resolution — when two intents score equally, what wins?

**Answer: declaration order in the `INTENTS` array wins ties (first-declared intent of the tied group), because the winner is picked by a stable sort.**

Evidence (v88:59140):
```js
var best = INTENTS.slice().sort(function(a,b){ return b.score - a.score; })[0];
```
`Array.prototype.sort` is stable in all current engines (ES2019+), so equal-`score` intents retain their original array index; `[0]` therefore returns the **earliest-declared** of the tied intents. `.slice()` sorts a copy, leaving the canonical `INTENTS` order intact for the next call (deterministic across calls). Because the array is declared `nav:overview, nav:step-lessons, nav:recovery-journal, …` first and action intents like `act:read-lesson` later (59064+), navigation intents outrank equally-scored actions. A hard floor also applies: `if (best.score < 5)` (59143) → no action ("I didn't catch that"). There is **no explicit tiebreaker field** — the behavior is an implicit side effect of stable-sort + declaration order.

### (d) Utterance queue management — is there an array? add/remove? can duplicates occur?

**Answer: no application-level queue array; one utterance at a time, cursor-driven. A single sentence cannot double-advance (guarded), but a long sentence can advance early, and re-entrancy is only partly guarded.**

Evidence:
- State: `this.sentences` (array) + `this.readPosition` (cursor). Items are not enqueued/dequeued; the cursor increments in `readNextSentence`.
- Exactly one `SpeechSynthesisUtterance` is created per sentence and pushed to the browser queue via `window.speechSynthesis.speak(u)` (~1200).
- **Duplicate-advance within a sentence is prevented** by the `var completed=false; finalize(){ if(!completed){completed=true; … onComplete(); } }` guard that de-dupes the three finalizers (`u.onend`, `u.onerror`, `setTimeout(finalize, maxWait)`).
- **Residual duplicate/skip risks (DEFECT-001/002 territory):**
  - `maxWait = max(800, ceil(len/(0.87*14)*1000)+400)` is a length heuristic. If real speech is slower than 0.87×14 chars/s, `setTimeout(finalize)` fires **before** `onend`, advancing to the next sentence while audio is still speaking → effective skip/overlap.
  - `toggleReading` guards re-entry only by toggling stop when `isReading` is already true; a rapid second trigger during the 150 ms inter-sentence `setTimeout` is not separately locked.
  - On stop, `speechSynthesis.cancel()` is called; if `onend` had already been scheduled, the `completed` guard still prevents a stray advance.

### (e) Navigation verification — after a nav command, what proves the destination was reached?

**Answer: nothing proves the destination rendered. Verification is limited to "the React state setter exists and was invoked."**

Evidence (`_calebNavigate`, 60623): `doNav()` returns `true` as soon as `window._rrnSetActiveSection(section)` has been **called** — it does not await the React re-render, and it does not read back `window._rrnActiveSection` or query the DOM to confirm the target section mounted. The only failure handling is for the setter being **absent** (React not yet mounted): it retries up to 10× at 300 ms. Once the setter exists and is called, success is assumed; `_calebContextResponse` then speaks a confirmation and `CalebMemory` logs `session.lastSection` regardless of whether the destination component actually mounted or whether `section` is even a valid section id. (Valid ids observed from `setActiveSection('…')` call sites include `overview, my-lessons, my-progress, meetings, members, community-wall, grant-engine, victories, guest-signup`; `_calebNavigate` performs no membership check against that set.)

---

## Appendix — key line index (v88, md5 `a32ff28c…`)

| Symbol | Line |
|--------|------|
| `_calebAudioController` IIFE | 1013 |
| `speakSentence` | ~1200 |
| `readNextSentence` | ~1232 |
| `finishReading` | 1260 |
| `_rrnAPI` dead guard | 1276–1277 |
| `_calebReadLesson` def / call | 1384 / 1492 |
| `_rrnStateManager` | 1430+ |
| `RRN_BACKEND_CONFIG` / `RRN_BACKEND_LIVE=false` | 750 / 752 |
| `_getToken` / `_setToken` / `_apiFetch` | 2588 / 2595 / 2975 |
| `RRN_API` object | 3250 |
| dashboard `setActiveSection` wrap (`_rrnSetActiveSection=orig`) | 28837 |
| lesson "Read Lesson Aloud" button onClick | 33667–33674 |
| orphaned Continue button | 33680–33689 |
| `PROGRESS_KEY='rrn_progress'` | 55880 |
| `RRN_LESSONS` | 55878 |
| `rrnApi` stub object | 55912 |
| `lessonComplete` | 55951 |
| `_cSend` #1 (scorer) / INTENTS / scorer loop | 58989 / 59064 / 59120 |
| intent winner / threshold / `[CALEB INTENT]` log | 59140 / 59143 / 59151 |
| `case 'read-lesson'` | 59238 |
| `_cSend` #2 (memory) / `_origCSend_nav` | 59820 / 59819 |
| `window._apiFetch` overrides | 59989 / 60880 |
| nav patch layer (`_rrnSetActiveSection=patchNav`) | 60157 / 60163 |
| `_cSend` #3 (wave) / `origSend` | 60604 / 60603 |
| `_calebNavigate` | 60623 |
