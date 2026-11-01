# Phase 3 Fix Report (v90)

File: `REFINED_18_05_HEALED_v90_FIXES.html`, copied from v88 REPAIRED. v87 and v88 are unchanged (`git diff` shows nothing for them).
Line numbers refer to v88 and have shifted in v90.

## Changes

| Area | Change |
|---|---|
| Tooling | `scripts/check_inline_js.js` extracts every inline `<script>` and syntax-checks it with `vm.Script`. Baseline on v88: 34 scripts, 0 failures. v90: 34 scripts, 0 failures. |
| `_rrnAPI` (v88 line 1276) | `window._rrnAPI.recordLessonCompletion` is now defined, so the `finishReading` hook runs. It marks `audioCompleted` in `rrn_progress` and does a best-effort `rrnApi` POST. |
| `rrnApi` (v88 line 55912) | The object stub is now a real function `rrnApi(path, method, body)`. It uses the base URL from `RRN_BACKEND_CONFIG`. On error, offline, or `file:` it queues the payload in `rrn_sync_queue` and resolves `{ok:false, queued:true}`. It never throws. The old `.progress` and `.lessons` members are kept. `flushSyncQueue` now replays both the old queue items and the new path-based items. |
| Intent router | Deterministic tiebreak: score, then specificity (longest exact phrase matched), then declaration order. The `<5` threshold was reviewed and kept. The lowest passing case is 6, and any exact phrase scores 10 or more, so the rejected inputs are queries with one weak partial word. The reasoning is in a code comment. |
| Safety gates | The distress gate moved ahead of the INTENTS table and nav/act dispatch. The L7 employer fast path already ran before dispatch; it now also matches `role === 7`. The duplicate employer gate that ran after dispatch was removed because it is redundant. The distress gate now also fires on nav/act queries. Some existing distress phrases are broad (e.g. "back on", "give up"), so some nav queries will now be caught by it. This is a deliberate safety-first choice. |
| `_calebNavigate` | Validates the section id format and an optional `window._rrnValidSections` allowlist. It guards `CalebMemory` and `caleb.close`. It verifies after 600 ms that `_rrnActiveSection` changed. It gives a spoken and visible fallback on failure or when the app has not mounted after 10 retries. |
| Audio (DEFECT-001 residual) | The length-based `maxWait` is now a floor. If `speechSynthesis.speaking` or `.pending` is true when it expires, it re-checks every second up to 3x the floor, then finalizes. |
| `RRN_API` duplicates | `meetings`, `audit`, `licensing` and `actions` (x3) were each defined more than once. Earlier blocks are renamed `_dup_*` and merged. For same-named methods the last definition still wins, so runtime behavior is unchanged, and methods that existed only in earlier blocks (e.g. `meetings.create`, `audit.log`, `licensing.update`) are available again. `RRN_BACKEND_CONFIG.API_BASE` is now derived from `BACKEND_URL`. The endpoint maps are not fully unified: they use different path shapes (e.g. `/api/auth` vs `/auth/login`), so merging them was not safe. |
| Lesson Continue button | It now calls `_calebAudioController.toggleReading(..., savedIndex)`, which accepts a new optional start index. The `_rrnStartReading_` registry was never populated. |
| Missing `js/lessons.js` | There is no `js/` directory and no script tag. `RRN_COURSES` and `RRN_LESSONS` now fall back to `[]` on `window` with a console warning. |
| Content policy | A banned pattern was removed from the finance intent, and all remaining banned mentions were rewritten (see "Content policy cleanup" below). |
| Section navigation (found in the real browser) | In v88 `window._rrnSetActiveSection` was the raw React setter, so calls from CALEB never updated `window._rrnActiveSection` and `_calebNavigate` always reported "did not load". The wrapper that sets both is now what gets exposed (around line 28886). It also records `session.lastSection` in `CalebMemory`. |

## Tests

`node tests/caleb_logic.test.js` runs 14 tests by extracting code from the HTML into a node `vm` with stubs. They cover router tiebreak, distress detection, gate ordering, `rrnApi` fallback and success path, `_rrnAPI` hook, navigate validation and verification, the audio bound (source check), duplicate keys, and the Continue button. Run against v88 it gives 0 passed, 14 failed (reverting the fixes fails the tests).

## Content policy cleanup

All mentions of the banned organization names, the nonprofit tax-status wording and tax-benefit claims were removed or rewritten in v90 (donation CTAs, fee panels, letters of intent, sub-operator forms, ledger labels, chariot receipts, voice lines). The fee percentages are kept but labelled as an administrative fee. The fiscal tab id became `admin`. The sub-operator agreement is now described as two-party. Every donation link (the `zeffyLink` fields, the Zeffy fallback URL and the QR "Donate" entry) now points to `https://www.givesendgo.com/help-build-refined-recovery-network`. The PayPal.me links in the invoicing tool are payment requests, not donation links, and were left alone. `tests/caleb_logic.test.js` fails if any forbidden term appears anywhere in v90 (16+ tests now run, all passing).

## Real browser run (FEAT-002)

**A real browser did run.** `npm i playwright` and `npx playwright install chromium` worked (network open) in `.agents/tools`, and headless Chromium (Headless Shell 156) launched with `--no-sandbox` against `python3 -m http.server` serving the repo. Script: `scripts/browser_test.js`. Logs: `tests/browser_logs/` (console, network errors, results JSON).

Results on v90 (13 checks): 12 passed, 1 not testable.

- The app mounts (title "Refined Recovery Network - Ministry OS", React root populated, all CALEB hooks present).
- `_calebNavigate` to housing, workforce, lessons and dashboard sets `_rrnActiveSection` with no failure message; an invalid id is rejected. **On the first run (before the wrapper fix) all four navigations reported "did not load".** This was a real defect that the node tests could not see.
- Typing into the real `caleb-text-input` and calling `_cSend` routes "I need help with housing" to `nav:housing` and "open my lesson" to `nav:step-lessons`, and the active section changes. Gibberish gets the "I didn't catch that" reply. A crisis phrase gets a reply containing 988.
- The rendered page text contains none of the forbidden terms. No uncaught page errors.
- **Not tested:** lesson completion. No complete or continue button was visible in the lessons views for the default demo user (role L0), so the lesson Continue button and audio completion were NOT exercised in a browser. The results JSON records this as a failed check for that reason. Real `speechSynthesis` audio was also not verified (headless has no audio output).
- Console shows 15 errors, all network: 401 from `rrn-api-production.up.railway.app` (no credentials, so the backend rejects `/api/*`) and connection refused for `localhost:5002/5003/health`. These are expected without a backend and are unrelated to the fixes, but they mean no authenticated API flow was verified.
- Section pages: the section content area changes size after navigation, but page content per section was not checked in detail.

## NOT tested / caveats

- A real browser did run (see above), but only for the checks listed there.
- The audio bound and the gate ordering are checked only by source inspection and string order, not by behavior.
- The `_calebNavigate` verification was exercised live in the browser run above. `_rrnValidSections` is not set anywhere, so section validation is format-only until a registry is provided.
- The real Railway backend was not contacted. The `/lms/audio-complete` endpoint is a guess and may not exist; a failure is queued and swallowed.
- The existing em dashes in moved or copied strings were left as they are. No new prose uses em dashes.
