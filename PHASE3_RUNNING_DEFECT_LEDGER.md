# CALEB Phase 3 — Running Defect Ledger

**Status:** IN PROGRESS — Updated as evidence is gathered  
**Last Updated:** 2026-11-01 Post-Architecture-Discovery  
**Investigation Stage:** Blocking Issues → Defect Verification → Remediation  

---

## KEY FINDINGS FROM ARCHITECTURE DISCOVERY

### Critical Discovery #1: `window._rrnAPI` Does NOT Exist
- **Status:** CONFIRMED
- **Alternative:** System uses direct `fetch()` with `window._apiFetch` proxy (line 60500)
- **Implication:** Completion recording works differently than claimed
- **Evidence:** No assignment of `_rrnAPI` found in entire codebase

### Critical Discovery #2: Completion Recording is LOCAL-FIRST Pattern
- **Storage:** localStorage:rrn_curriculum_progress (immediate save)
- **Backend Sync:** POST /progress (async, fire-and-forget, no verification)
- **Gap:** NO VALIDATION that user actually read content before marking complete
- **Evidence:** Lines 32593-32610 show quiz pass triggers completion, not read completion

### Critical Discovery #3: Intent Routing Uses Array Order Priority
- **Mechanism:** First pattern match in array wins
- **Problem:** "read it" pattern appears before "open journal" in array
- **Result:** "read my journal" triggers lesson reading (collision)
- **Evidence:** Line ~58769, CALEB_INTENTS array declaration

### Critical Discovery #4: NO Utterance Queue Management
- **Current:** Direct `speechSynthesis.speak()` calls, browser handles sequencing
- **Missing:** Application-level queue state tracking
- **Impact:** Multiple completion callbacks can fire, causing skips/hangs
- **Evidence:** Lines 58138-58230, no queue array operations

### Critical Discovery #5: Navigation Verification is Incomplete
- **Verified:** Component existence only (getElementById check)
- **Missing:** User permissions, content loaded, state synchronized
- **Result:** Race conditions where CALEB tries to read unloaded content
- **Evidence:** Lines 33203-33204 check button exists, not content

---

## DEFECT SEVERITY CLASSIFICATION

### P0 CRITICAL (10 defects) — BLOCKING PRODUCTION USE

| ID | Title | Root Cause | Impact | Evidence | Fix Complexity |
|----|-------|-----------|--------|----------|-----------------|
| **DEFECT-001** | Audio Lifecycle Race Conditions | 3 competing finalization triggers (onend, onerror, timeout) | Lessons stop mid-sentence | Lines 33330-33345 | HIGH |
| **DEFECT-002** | No Utterance Queue | Direct speak() calls, no application tracking | Paragraphs skip or hang | Line 33338 | HIGH |
| **DEFECT-003** | Voice Init Race | getVoices() returns empty initially | Wrong voice or silent failure | Lines 33317, 58171 | MEDIUM |
| **DEFECT-004** | Text Segmentation Regex | Lookbehind not supported on all browsers | Verses split incorrectly | Lines 33210-33235 | MEDIUM |
| **DEFECT-005** | Highlight Scoring Bias | ALL-CAPS pushed, double-highlighting bug | Visual confusion | Lines 33280-33315 | MEDIUM |
| **DEFECT-006** | Intent Collision | Pattern "read it" too general, no context | "read journal" triggers lesson | Line ~58769 | MEDIUM |
| **DEFECT-007** | No Precondition Validation | No checks before actions execute | Fails silently | Lines 58903-58904 | MEDIUM |
| **DEFECT-008** | Navigation State Not Sync'd | No single source of truth for context | CALEB doesn't know current screen | Scattered | HIGH |
| **DEFECT-009** | Async Navigation (No Await) | Code doesn't wait for content load | Race condition on read | Scattered | HIGH |
| **DEFECT-010** | Completion Not Validated | Quiz pass marks complete, no read verification | False completion claims | Not found (absence) | HIGH |

### P1 DEGRADED (4 defects) — AFFECTS USER EXPERIENCE

| ID | Title | Root Cause | Impact | Evidence | Fix Complexity |
|----|-------|-----------|--------|----------|-----------------|
| **DEFECT-011** | Missing Content Handling | Silent fail when lesson.body empty | Button does nothing | Lines 33200-33202 | LOW |
| **DEFECT-012** | No Tab Visibility Detection | Missing visibilitychange listener | Audio runs in background | Not found (missing) | LOW |
| **DEFECT-013** | Continue Button Always Visible | No position check | UI confusion | Lines 33203-33205 | LOW |
| **DEFECT-014** | No Voice Caching | Voice selection repeated per call | Performance delay | Lines 33315-33338 | LOW |

---

## BLOCKING ISSUES INVESTIGATION RESULTS

### Question 1: `_rrnAPI` Initialization
**Status:** ✅ ANSWERED
- **Finding:** Does NOT exist in codebase
- **Alternative:** `window._apiFetch` (line 60500) + direct fetch()
- **Backend Route:** POST /progress (exists on Railway)
- **Implication:** Phase 2 report was incorrect about missing API

### Question 2: Lesson Completion Persistence
**Status:** ✅ ANSWERED  
- **Path:** saveProgress() → localStorage → _apiFetch('/progress', POST)
- **Local:** Immediate (synchronous)
- **Backend:** Async, fire-and-forget
- **Gap:** NO verification user actually read (just quiz pass)
- **Implication:** DEFECT-010 = Data integrity risk

### Question 3: Intent Tie Resolution
**Status:** ✅ ANSWERED
- **Mechanism:** Stable sort preserves array order
- **Winner:** First match in CALEB_INTENTS array
- **Problem:** Array order is implementation detail, not user intent
- **Collision:** "read journal" → "read it" pattern match
- **Implication:** DEFECT-006 = Context-blind routing

### Question 4: Utterance Queue Management
**Status:** ✅ ANSWERED
- **Application Level:** NO queue exists (just variable declared)
- **Browser Level:** speechSynthesis has internal queue
- **Issue:** Multiple finish() callbacks can trigger readNext() twice
- **Race Condition:** Async callbacks not serialized
- **Implication:** DEFECT-001/002 = Audio lifecycle broken

### Question 5: Navigation Verification
**Status:** ✅ ANSWERED
- **Verified:** Component exists (getElementById)
- **Missing:** Permissions, content loaded, state sync
- **Race Condition:** Code tries to read before React renders
- **Implication:** DEFECT-008/009 = Navigation incomplete

---

## DEFECT VERIFICATION MATRIX

### Evidence Collected So Far

**DEFECT-001: Audio Lifecycle**
- [ ] Code inspection: Lines 33330-33345 examined, 3 triggers confirmed
- [ ] Root cause: Multiple finish() paths, single done flag insufficient
- [ ] Impact: 60-second sentence test (PENDING)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-002: Utterance Queue**
- [ ] Code inspection: Line 33338, no queue operations found
- [ ] Root cause: Browser queue used, no app-level tracking
- [ ] Impact: Rapid-fire sentences (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-003: Voice Initialization**
- [ ] Code inspection: Lines 33317, 58171, getVoices() called directly
- [ ] Root cause: Async timing issue, voices not ready on first call
- [ ] Impact: Voice selection (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-004: Text Segmentation**
- [ ] Code inspection: Lines 33210-33235, lookbehind regex present
- [ ] Root cause: No try-catch on regex, only on Piper fallback
- [ ] Impact: Regex failure (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-005: Highlighting Algorithm**
- [ ] Code inspection: Lines 33280-33315, ALL-CAPS logic present
- [ ] Root cause: Double-push to highlights, no cleanup
- [ ] Impact: Multiple elements highlighted (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-006: Intent Collision**
- [ ] Code inspection: Line ~58769, CALEB_INTENTS array order matters
- [ ] Root cause: "read it" pattern too general, appears before journal intent
- [ ] Impact: Command routing (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-007: Precondition Validation**
- [ ] Code inspection: Lines 58903-58904, no validation gates
- [ ] Root cause: Code assumes preconditions met
- [ ] Impact: Silent failures (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-008: Navigation State Sync**
- [ ] Code inspection: Scattered state variables (_rrnActiveSection, tab, etc.)
- [ ] Root cause: No single source of truth, multiple state containers
- [ ] Impact: State desync (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-009: Async Navigation**
- [ ] Code inspection: Scattered, no await pattern found
- [ ] Root cause: Navigation triggers, code doesn't wait for completion
- [ ] Impact: Race conditions (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

**DEFECT-010: Completion Validation**
- [ ] Code inspection: NO validation code found (by absence)
- [ ] Root cause: Quiz pass immediately marks complete
- [ ] Impact: False completion (PENDING TEST)
- [ ] Test Result: NOT YET EXECUTED

---

## PHASE 2 REMEDIATION ASSESSMENT

**v88_REPAIRED.html Analysis:**

### Claims vs Evidence

| Claim | Evidence | Verdict |
|-------|----------|---------|
| DEFECT-001 fixed | New audio controller exists | NEEDS BROWSER TEST |
| DEFECT-002 fixed | Queue declared but not used | LIKELY FALSE |
| DEFECT-003 fixed | Voice caching added | LIKELY TRUE |
| DEFECT-004 fixed | Try-catch on first lookbehind | LIKELY PARTIAL |
| DEFECT-005 fixed | Improved highlighting algorithm | NEEDS TEST |
| DEFECT-006 fixed | No tiebreaker found | FALSE |
| DEFECT-007 fixed | No validation added | FALSE |
| DEFECT-008 fixed | No state sync added | FALSE |
| DEFECT-009 fixed | Calls undefined _rrnAPI | FALSE |
| DEFECT-010 fixed | 95% threshold exists but unreachable | FALSE |

**Summary:** 3/10 likely fixed, 7/10 NOT fixed or false claims

---

## NEXT INVESTIGATION STEPS

Currently executing in main workflow:

1. ✅ **ARCHITECTURE DISCOVERY** — COMPLETE
   - Answers to 5 critical questions
   - System flows mapped
   - All defects located and classified

2. 🔄 **BLOCKING ISSUES INVESTIGATION** — IN PROGRESS
   - Will answer: _rrnAPI, completion flow, intent priority, queue state, nav verification
   - Provides detailed evidence for each

3. ⏳ **DEFECT VERIFICATION** — QUEUED
   - Individual PASS/FAIL verdict for all 10 P0 defects
   - Requires actual browser/code execution

4. ⏳ **FEATURE INVENTORY** — QUEUED
   - All RRN website features mapped vs implementation

5. ⏳ **EXECUTION TRACING** — QUEUED
   - 3 critical workflows traced end-to-end

6. ⏳ **REGRESSION TESTING** — QUEUED
   - Verify all existing features work

7. ⏳ **ROOT CAUSE REMEDIATION** — QUEUED
   - Fix defects, implement automated tests

8. ⏳ **ACCEPTANCE TESTING** — QUEUED
   - 10 E2E tests, browser compatibility

9. ⏳ **DEPLOYMENT READINESS** — QUEUED
   - Final go/no-go decision

---

## INTERIM CONCLUSION

**Application Status:** Architecturally sound but operationally broken

**Blocking Issues for Users:**
1. ❌ Reading stops mid-lesson (DEFECT-001)
2. ❌ Cannot resume reading (no queue state)
3. ❌ Cannot verify completion actually occurred
4. ❌ False completion claims possible (fraud risk)
5. ❌ 42 CFR Part 2 compliance at risk

**Production Readiness:** NOT READY (0/10 defects verified fixed)

**Estimated Remediation Effort:** 
- Architecture changes: 40-60 hours
- Implementation: 30-40 hours
- Testing: 20-30 hours
- Total: 90-130 hours

---

## UPDATE FREQUENCY

This ledger will be updated after each workflow step completes with actual evidence.
Last update timestamp indicates when findings were added.

**Current:** POST ARCHITECTURE DISCOVERY
**Next Update:** POST BLOCKING ISSUES INVESTIGATION
