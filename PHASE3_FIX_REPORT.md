# Phase 3 Fix Report (v90)

File: `REFINED_18_05_HEALED_v90_FIXES.html`, copied from v88 REPAIRED. v87 and v88 are unchanged (`git diff` shows nothing for them).
Line numbers refer to v88 and have shifted in v90.

## Changes

| Area | Change |
|---|---|
| Tooling | `scripts/check_inline_js.js` extracts every inline `<script>` and syntax-checks it with `vm.Script`. Baseline on v88: 34 scripts, 0 failures. v90: 34 scripts, 0 failures. |
| `_rrnAPI` (v88 line 1276) | `window._rrnAPI.recordLessonCompletion` is now defined, so the `finishReading` hook runs. It marks `audioCompleted` in `rrn_progress` and does a best-effort `rrnApi` POST to the existing `/lms/progress` route (review fix: the guessed `/lms/audio-complete` route was removed). |
| `rrnApi` (v88 line 55912) | The object stub is now a real function `rrnApi(path, method, body)`. It uses the base URL from `RRN_BACKEND_CONFIG`. On error, offline, or `file:` it queues the payload in `rrn_sync_queue` and resolves `{ok:false, queued:true}`. It never throws. The old `.progress` and `.lessons` members are kept. `flushSyncQueue` now replays both the old queue items and the new path-based items. Review fix: the flush takes a snapshot out of storage, replays with `noQueue` (no duplicate re-queue), and when all replays settle re-adds only the failures with an `attempts` counter (dropped after 5), merged with anything queued meanwhile. The fixed 3 second timer is gone. |
| Intent router | Deterministic tiebreak: score, then specificity (longest exact phrase matched), then declaration order. The `<5` threshold was reviewed and kept. The lowest passing case is 6, and any exact phrase scores 10 or more, so the rejected inputs are queries with one weak partial word. The reasoning is in a code comment. |
| Safety gates | The distress gate moved ahead of the INTENTS table and nav/act dispatch. The L7 employer fast path already ran before dispatch; it now also matches `role === 7`. The duplicate employer gate that ran after dispatch was removed because it is redundant. The distress gate now runs first of all, ahead of the L7 employer gate, so an employer in crisis gets the 988 response. Review fix: distress phrases are matched on word boundaries and the over-broad ones ("back on", "going back", "just once", "one more time", bare "give up") were replaced with specific phrases ("i give up", "back to using", "back on drugs", and so on), so "go back to housing" no longer writes a false distress flag or event. |
| `_calebNavigate` | Validates the section id format and an optional `window._rrnValidSections` allowlist. It guards `CalebMemory` and `caleb.close`. It verifies after 600 ms that `_rrnActiveSection` changed. It gives a spoken and visible fallback on failure or when the app has not mounted after 10 retries. |
| Audio (DEFECT-001 residual) | The length-based `maxWait` is now a floor. If `speechSynthesis.speaking` or `.pending` is true when it expires, it re-checks every second up to 3x the floor, then finalizes. |
| `RRN_API` duplicates | `meetings`, `audit`, `licensing` and `actions` (x3) were each defined more than once. Earlier blocks are renamed `_dup_*` and merged. For same-named methods the last definition still wins, so runtime behavior is unchanged, and methods that existed only in earlier blocks (e.g. `meetings.create`, `audit.log`, `licensing.update`) are available again. `RRN_BACKEND_CONFIG.API_BASE` is now derived from `BACKEND_URL`. The endpoint maps are not fully unified: they use different path shapes (e.g. `/api/auth` vs `/auth/login`), so merging them was not safe. |
| Lesson Continue button | It now calls `_calebAudioController.toggleReading(..., savedIndex)`, which accepts a new optional start index. The `_rrnStartReading_` registry was never populated. |
| Missing `js/lessons.js` | There is no `js/` directory and no script tag. `RRN_COURSES` and `RRN_LESSONS` now fall back to `[]` on `window` with a console warning. |
| Content policy | A banned pattern was removed from the finance intent, and all remaining banned mentions were rewritten (see "Content policy cleanup" below). |
| Section navigation (found in the real browser) | In v88 `window._rrnSetActiveSection` was the raw React setter, so calls from CALEB never updated `window._rrnActiveSection` and `_calebNavigate` always reported "did not load". The wrapper that sets both is now what gets exposed (around line 28886). It also records `session.lastSection` in `CalebMemory`. |

## Review fixes (2026-11-02 review)

1. **Tax receipt wording**: fixed. Donation form and receipt text now say "donation acknowledgment", chariot says "Trip log saved", and the trip log no longer shows a deductible amount ("Mileage value") or "IRS 170" text.
2. **Deductible semantics**: partly fixed. All user-facing tax-advantage claims were reworded or removed: the housing partner calculator now shows an "in-kind value" (rent reduction x months) with no 22%-37% bracket estimate, "Annual Tax Package" became "Annual Partner Summary", tax notes on contribution paths, the property partner pitch, ledger labels ("Nonprofit (Tax-Exempt)" is now "Donations"), the "faith-based nonprofit" sentence, and `deductible:true` flags were set to false. NOT changed: internal identifiers (`taxClass:'nonprofit'`, `TAX_RULES.nonprofit`, `deductibleMonthly`/`annualDeductible` variable names, the `charitableDeduction` variable, the `charitable-donation` path id, the `hasNonprofitStatus` partner form field, and the Tax-Exempt Number manager near line 37200). They drive ledger classification and stored data, and renaming them risks breaking saved records; they are not shown to donors as claims. This is a judgment call that the owner should confirm. The forbidden-term test now also rejects "tax receipt", "tax advantage" and "charitable deduction".
3. **Employer gate before distress**: fixed (distress now first), covered by a source-order test and a real-browser L7 test.
4. **Over-broad distress phrases**: fixed (see Safety gates row), covered by node tests and a real-browser check that "go back to housing" adds no flag.
5. **Sync queue race**: fixed (see rrnApi row), covered by a node test (entry queued during replay survives, failed item re-added once with attempts+1, item at the cap dropped).
6. **Unverified endpoint**: changed to `/lms/progress` with the retry cap. Still NOT verified against the real backend: in the browser run the POST went to the Railway URL and was refused, so it was queued.
7. **Untested paths**: now exercised in the real browser (see below).

## Tests

`node tests/caleb_logic.test.js` runs 18 tests by extracting code from the HTML into a node `vm` with stubs. They cover router tiebreak, distress detection (including false positives), gate ordering, `rrnApi` fallback and success path, the sync queue flush, `_rrnAPI` hook, navigate validation and verification, the audio bound (source check), duplicate keys, the Continue button, and the forbidden-term scan. Result: 18 passed, 0 failed. `node scripts/check_inline_js.js REFINED_18_05_HEALED_v90_FIXES.html`: 34 scripts, 0 failures.

## Content policy cleanup

All mentions of the banned organization names, the nonprofit tax-status wording and tax-benefit claims were removed or rewritten in v90 (donation CTAs, fee panels, letters of intent, sub-operator forms, ledger labels, chariot receipts, voice lines). The fee percentages are kept but labelled as an administrative fee. The fiscal tab id became `admin`. The sub-operator agreement is now described as two-party. Every donation link (the `zeffyLink` fields, the Zeffy fallback URL and the QR "Donate" entry) now points to `https://www.givesendgo.com/help-build-refined-recovery-network`. The PayPal.me links in the invoicing tool are payment requests, not donation links, and were left alone. `tests/caleb_logic.test.js` fails if any forbidden term appears anywhere in v90 (16+ tests now run, all passing).

## Real browser run (FEAT-002)

**A real browser did run.** `npm i playwright` and `npx playwright install chromium` worked (network open) in `.agents/tools`, and headless Chromium (Headless Shell 156) launched with `--no-sandbox` against `python3 -m http.server` serving the repo. Script: `scripts/browser_test.js`. Logs: `tests/browser_logs/` (console, network errors, results JSON).

Results on v90 after the review fixes (20 checks): 20 passed, 0 failed. Earlier checks (mount, navigation, intent routing, distress 988, no forbidden terms in rendered text, no page errors) still pass. New checks:

- The real lesson view is reached through the UI (12-Step Curriculum, Preface, first lesson) and the real `caleb-read-btn-pref-1` and `caleb-continue-btn-pref-1` buttons render.
- Continue with a saved position of 3 resumes the reader at position 4 of 51 sentences.
- The real Read button reads the whole lesson and `rrn_progress['pref-1'].audioCompleted` becomes true. The completion POST goes to `/api/lms/progress` on the Railway host, is refused, and is queued with an attempts counter.
- The audio bound keeps waiting while the (fake) speech engine reports busy: 2.2 s elapsed against a 1.5 s busy window and a 0.8 s floor.
- "go back to housing" adds no distress flag. An L7 session saying "I relapsed and I feel hopeless" gets the 988 reply; an L7 non-distress recovery question still gets the hiring-only reply.
- **Caveat:** `speechSynthesis` is stubbed in these checks (headless Chromium has no voices), so timing and completion are verified against a fake engine, not real speech. The L7 session was simulated by setting `window._rrnActiveLevel = 7`, not by logging in as an employer.
- Console errors total 28 in the latest run (more than the original 15 because the new checks trigger extra refused backend calls). Originally: 15 errors, all network: 401 from `rrn-api-production.up.railway.app` (no credentials, so the backend rejects `/api/*`) and connection refused for `localhost:5002/5003/health`. These are expected without a backend and are unrelated to the fixes, but they mean no authenticated API flow was verified.
- Section pages: the section content area changes size after navigation, but page content per section was not checked in detail.

## NOT tested / caveats

- A real browser did run (see above), but only for the checks listed there.
- Real speech playback is not verified (see the stub caveat above). Gate ordering is checked by source order and by behavior in the browser.
- The `_calebNavigate` verification was exercised live in the browser run above. `_rrnValidSections` is not set anywhere, so section validation is format-only until a registry is provided.
- The real Railway backend was not contacted. The `/lms/progress` route is assumed to exist (the legacy sync code already used it); a failure is queued, retried up to 5 times, then dropped.
- The existing em dashes in moved or copied strings were left as they are. No new prose uses em dashes.
