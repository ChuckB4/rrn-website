# CALEB PHASE 3 — INDEPENDENT FORENSIC VERIFICATION AND REMEDIATION

**Status:** PLAN DOCUMENT  
**Date:** November 1, 2026  
**Objective:** Establish actual application state through source inspection, execution tracing, and reproducible testing.

---

## Mission Statement

Previous remediation claimed 10 P0 defects fixed. Verification audit challenged those claims. **Neither report is accepted as proof.**

This phase establishes the actual condition through:
- Complete source inspection
- Execution path tracing
- Integration testing
- Regression verification
- No assumptions about runtime injection, initialization order, or unverified claims

**Success criterion:** Every advertised CALEB feature works end-to-end with documented evidence.

---

## PHASE 3 WORK BREAKDOWN

### 1. PRESERVE THE APPLICATION

**Objective:** Establish baseline and recovery capability.

**Tasks:**
- [ ] Identify current production version on Railway
- [ ] Identify staging version (if deployed)
- [ ] Identify development version in workspace
- [ ] Document Git branch, commit SHA, working tree status
- [ ] Calculate file hashes (v87, v88_REPAIRED, v89_PATCHED)
- [ ] Verify backup integrity (`BACKUP/REFINED_18_05_HEALED_v87.html.backup.20261101_060819`)
- [ ] Identify all competing or duplicate HTML files in workspace
- [ ] Document every Git branch containing CALEB changes
- [ ] Create immutable audit snapshot (git tag, file backups)

**Deliverable:** Application baseline document with recovery procedures

---

### 2. BUILD ACTUAL ARCHITECTURE MAP

**Objective:** Document the real system, not assumed architecture.

**Tasks:**

#### 2.1 CALEB Subsystems
- [ ] Locate every function with `_caleb` in name
- [ ] Trace initialization order and dependencies
- [ ] Map state variables and their scope
- [ ] Document message flows and event listeners
- [ ] Identify lifecycle hooks (init, wake, sleep, cleanup)

#### 2.2 Audio and Speech Synthesis
- [ ] Identify all speech synthesis implementations (Web Speech API, Piper, alternatives)
- [ ] Map utterance creation, lifecycle, cancellation
- [ ] Document voice selection algorithm
- [ ] Trace all callbacks and event handlers
- [ ] Map error handling and recovery paths
- [ ] Identify queue management (if any)

#### 2.3 Lesson Content and Rendering
- [ ] Locate lesson data source (localStorage, API, embedded)
- [ ] Trace lesson loading flow
- [ ] Document text rendering to DOM
- [ ] Map highlighting algorithm
- [ ] Trace progress position tracking

#### 2.4 Intent Recognition
- [ ] Map query parsing and normalization
- [ ] Document intent scoring algorithm
- [ ] Trace tie-breaking logic
- [ ] Identify minimum score threshold
- [ ] Map each intent to its handler

#### 2.5 Navigation and Action Execution
- [ ] Trace navigation command to destination
- [ ] Map React section navigation
- [ ] Identify all navigation targets (declared vs implemented)
- [ ] Document action handlers (checkin, prayer, journal, etc.)
- [ ] Trace state changes during navigation

#### 2.6 Progress Tracking
- [ ] Map localStorage persistence layer
- [ ] Identify API endpoints for progress
- [ ] Trace progress synchronization
- [ ] Document completion criteria
- [ ] Identify mentor visibility mechanisms

#### 2.7 Backend Integration
- [ ] Enumerate every API endpoint
- [ ] Document request/response contracts
- [ ] Trace authentication mechanism
- [ ] Identify error handling and retry logic
- [ ] Map database schema (lessons, progress, users, sessions)

#### 2.8 External Dependencies
- [ ] Identify all injected APIs and objects
- [ ] Trace window._ object initialization
- [ ] Document third-party libraries
- [ ] Identify feature detection and polyfills

**Deliverable:** `CALEB_ARCHITECTURE_MAP.md` (complete system diagram)

---

### 3. INDEPENDENTLY VERIFY ALL 10 PREVIOUS DEFECTS

**Objective:** Assign PASS/FAIL/PARTIAL/NOT_VERIFIED to each claimed fix.

#### For Each Defect:

**3.1 DEFECT-001: Audio Lifecycle Race Conditions**

- [ ] Locate original broken code in v87
- [ ] Locate claimed fix in v88_REPAIRED
- [ ] Trace every caller of `speakSentence()`
- [ ] Map all callbacks: `onend`, `onerror`, `setTimeout`, watchdog
- [ ] Verify single `completed` flag prevents duplicate calls
- [ ] Test: Play 60-second sentence, verify no interruption
- [ ] Test: Multiple rapid sentences, verify correct sequencing
- [ ] Verify no orphaned callbacks after finish
- **Verdict:** PASS / FAIL / PARTIAL

**3.2 DEFECT-002: Utterance Queue Management**

- [ ] Locate `utteranceQueue` declaration
- [ ] Trace every place utterances are enqueued
- [ ] Verify queue is consumed in order
- [ ] Verify no duplicates are created
- [ ] Test: Rapid-fire speech calls, verify no skipping
- [ ] Verify callback sequence matches queue order
- **Verdict:** PASS / FAIL / PARTIAL

**3.3 DEFECT-003: Voice Initialization Race**

- [ ] Trace `getVoices()` call timing
- [ ] Verify caching mechanism (if implemented)
- [ ] Test on multiple browsers (Chrome, Edge, mobile)
- [ ] Verify fallback when voices unavailable
- [ ] Verify consistent voice selection across sessions
- **Verdict:** PASS / FAIL / PARTIAL

**3.4 DEFECT-004: Text Segmentation (Lookbehind)**

- [ ] Verify try-catch on all lookbehind usage
- [ ] Test on browsers without lookbehind support
- [ ] Verify fallback splitting works correctly
- [ ] Test edge cases: quotes, all-caps, long sentences
- [ ] Verify no silent failures
- **Verdict:** PASS / FAIL / PARTIAL

**3.5 DEFECT-005: Highlight Scoring Bias**

- [ ] Trace highlighting algorithm
- [ ] Verify scoring for exact, partial, and fuzzy matches
- [ ] Test with Scripture references, headings, lists
- [ ] Verify fallback when no match found
- [ ] Test after DOM changes (React re-renders)
- **Verdict:** PASS / FAIL / PARTIAL

**3.6 DEFECT-006: Intent Collision Tiebreaker**

- [ ] Trace intent scoring for ambiguous queries
- [ ] Verify stable sort preserves declaration order
- [ ] Document actual priority for tied intents
- [ ] Test: "read", "next", "open", "check", ambiguous commands
- [ ] Verify deterministic results across repeated calls
- **Verdict:** PASS / FAIL / PARTIAL

**3.7 DEFECT-007: Precondition Validation**

- [ ] Identify all preconditions before navigation
- [ ] Verify React component mounting checks
- [ ] Verify session state validation
- [ ] Verify permission checks
- [ ] Test: Execute commands when preconditions not met
- **Verdict:** PASS / FAIL / PARTIAL

**3.8 DEFECT-008: Navigation State Sync**

- [ ] Trace navigation command to final destination
- [ ] Verify destination state is updated correctly
- [ ] Test: Navigate away and back, verify state integrity
- [ ] Verify CALEB knows current location after navigation
- [ ] Test: Navigation during reading, verify pause/resume
- **Verdict:** PASS / FAIL / PARTIAL

**3.9 DEFECT-009: Async Navigation / Completion Recording**

- [ ] Locate `window._rrnAPI` definition (if it exists)
- [ ] Trace all runtime injection points
- [ ] Verify `recordLessonCompletion()` is called when lesson finishes
- [ ] Trace from completion to backend persistence
- [ ] Test: Complete lesson, verify mentor sees it recorded
- **Verdict:** PASS / FAIL / PARTIAL

**3.10 DEFECT-010: Completion Validation**

- [ ] Verify completion criteria (95% of content read)
- [ ] Trace verification evidence structure
- [ ] Verify completion is persisted to backend
- [ ] Test: Stop at 50%, verify marked incomplete
- [ ] Test: Complete 95%, verify marked complete
- [ ] Test: Resume and finish, verify completion records correctly
- **Verdict:** PASS / FAIL / PARTIAL

**Deliverable:** `CALEB_DEFECT_VERIFICATION.md` with individual verdict + evidence

---

### 4. INVESTIGATE FIVE BLOCKING ISSUES

**Objective:** Establish facts about critical dependencies.

#### Issue A: `window._rrnAPI` Initialization

- [ ] Search entire PWA file for `window._rrnAPI` definition
- [ ] Search for `_rrnAPI` assignment in any form
- [ ] Trace all script injection points
- [ ] Check for external scripts loaded via `<script src>`
- [ ] Check for dynamic script injection via `innerHTML` or `appendChild`
- [ ] Check for runtime object assignment in startup sequence
- [ ] Examine Railway backend initialization sequence
- [ ] Test: Does completion recording work end-to-end?
- **Finding:** _______________

#### Issue B: Lesson Completion Persistence

- [ ] Trace from `finishReading()` call to backend API
- [ ] Identify the actual API endpoint for completion
- [ ] Document request body and response contract
- [ ] Verify database storage (if accessible)
- [ ] Test: Complete lesson, query backend for completion record
- [ ] Verify mentor interface displays the completion
- [ ] Test: Refresh page, verify completion persists
- **Finding:** _______________

#### Issue C: Intent Scoring Tie Resolution

- [ ] Generate test cases with tied intent scores
- [ ] Verify stable sort order matches declaration order
- [ ] Identify actual priority (which intent wins)
- [ ] Test: Ambiguous queries with equal-scoring intents
- [ ] Document whether current behavior is acceptable
- **Finding:** _______________

#### Issue D: Utterance Queue Management

- [ ] Trace every `speechSynthesis.speak()` call
- [ ] Verify no duplicate utterances created
- [ ] Test: Rapid-fire sentences, verify no skipping
- [ ] Map actual queue behavior (if any exists)
- [ ] Test: Cancel utterance, verify queue state
- **Finding:** _______________

#### Issue E: Navigation Destination Verification

- [ ] Trace navigation from intent to destination
- [ ] Verify React component actually mounts
- [ ] Verify action actually executes (not just announced)
- [ ] Test: Navigation to each supported destination
- [ ] Document any failed or partial navigation
- **Finding:** _______________

**Deliverable:** `BLOCKING_ISSUES_INVESTIGATION.md`

---

### 5. EXECUTE END-TO-END TESTS

**Objective:** Prove each advertised feature works.

#### Test A: Read Entire Lesson (5+ minutes)
- [ ] Load a long lesson (e.g., Step 1 Lesson 1)
- [ ] Click "Read Lesson Aloud"
- [ ] Verify audio plays continuously
- [ ] Verify highlighting advances correctly
- [ ] Verify no premature stopping
- [ ] Verify lesson completes naturally
- [ ] Verify completion is recorded
- **Result:** PASS / FAIL — _____________

#### Test B: Pause, Resume, Continue
- [ ] Start reading a lesson
- [ ] Click pause after 30 seconds
- [ ] Verify audio stops
- [ ] Verify position is saved
- [ ] Wait 5 seconds
- [ ] Click resume
- [ ] Verify audio continues from correct position
- [ ] Verify no content repeated or skipped
- **Result:** PASS / FAIL — _____________

#### Test C: Navigate Away and Return
- [ ] Start reading Lesson 1
- [ ] Navigate to different section
- [ ] Wait 3 seconds
- [ ] Return to Lesson 1
- [ ] Verify state is preserved (position, highlighting)
- [ ] Verify can resume from correct position
- **Result:** PASS / FAIL — _____________

#### Test D: Ambiguous Commands
- [ ] Say "read"
- [ ] Say "next"
- [ ] Say "open lessons"
- [ ] Say "check in"
- [ ] Verify each resolves to correct intent
- [ ] Repeat each command 5 times, verify consistency
- **Result:** PASS / FAIL — _____________

#### Test E: Completion Visibility
- [ ] Complete a lesson via voice reading
- [ ] Log out and back in
- [ ] Verify lesson shows as completed
- [ ] Ask mentor user to view progress
- [ ] Verify mentor sees completion recorded
- **Result:** PASS / FAIL — _____________

#### Test F: Consecutive Lessons
- [ ] Complete Lesson 1 fully
- [ ] Immediately start Lesson 2
- [ ] Verify Lesson 2 reads without issues
- [ ] Verify both completions recorded
- **Result:** PASS / FAIL — _____________

#### Test G: Browser Refresh During Lesson
- [ ] Start reading Lesson 1 (position 0)
- [ ] After 30 seconds, refresh the page
- [ ] Return to Lesson 1
- [ ] Verify position is saved and offers resume
- [ ] Resume from saved position
- **Result:** PASS / FAIL — _____________

#### Test H: Speech Synthesis Interruption
- [ ] Start reading a lesson
- [ ] After 10 seconds, call `window.speechSynthesis.cancel()`
- [ ] Verify reading stops cleanly
- [ ] Verify state is consistent
- [ ] Verify can restart reading
- **Result:** PASS / FAIL — _____________

#### Test I: Unavailable Voices
- [ ] Simulate unavailable voices (set `getVoices()` to return empty)
- [ ] Start reading
- [ ] Verify fallback voice is used (or browser default)
- [ ] Verify reading still works
- **Result:** PASS / FAIL — _____________

#### Test J: Complex Content
- [ ] Create/load lesson with: Scripture, headings, lists, punctuation
- [ ] Read entire lesson
- [ ] Verify all content reads correctly
- [ ] Verify highlighting aligns with audio
- **Result:** PASS / FAIL — _____________

**Deliverable:** `E2E_TEST_RESULTS.md`

---

### 6. FULL REGRESSION EXAMINATION

**Objective:** Verify no existing features were broken.

#### Navigation
- [ ] Test every navigation menu item
- [ ] Verify each destination loads correctly
- [ ] Verify no dead links
- [ ] Test responsive layout

#### Lesson Features
- [ ] Test quiz submission (if applicable)
- [ ] Test progress saving
- [ ] Test continue button
- [ ] Test lesson filters/search

#### User Activities
- [ ] Test check-in logging
- [ ] Test prayer request submission
- [ ] Test journal entry creation
- [ ] Test meeting attendance

#### Session Management
- [ ] Test login/logout
- [ ] Test session persistence
- [ ] Test timeout handling
- [ ] Test re-authentication

#### Data Persistence
- [ ] Test localStorage persistence across refresh
- [ ] Test API sync
- [ ] Test offline behavior (if applicable)

#### Error Handling
- [ ] Test network failure recovery
- [ ] Test invalid input handling
- [ ] Test timeout handling
- [ ] Verify error messages are helpful

#### Browser Compatibility
- [ ] Test on Chrome (latest)
- [ ] Test on Edge (latest)
- [ ] Test on Safari (if applicable)
- [ ] Test on mobile browsers
- [ ] Verify responsive design

#### Performance
- [ ] Measure lesson loading time
- [ ] Measure speech synthesis latency
- [ ] Check for memory leaks
- [ ] Verify no excessive CPU usage

**Deliverable:** `REGRESSION_TEST_REPORT.md`

---

### 7. ROOT CAUSE ANALYSIS

**Objective:** Identify architectural causes, not just symptoms.

For each identified defect:

- [ ] Trace root cause (not just the symptom)
- [ ] Identify why the defect was introduced
- [ ] Identify what should have prevented it
- [ ] Assess whether it's a one-off or systemic issue
- [ ] Identify similar patterns elsewhere in the code

**Deliverable:** `ROOT_CAUSE_ANALYSIS.md`

---

### 8. REMEDIATION PLAN

**Objective:** Fix defects at their source.

For each defect with FAIL verdict:

- [ ] Identify required architectural change
- [ ] Identify all affected components
- [ ] Develop fix that doesn't introduce duplicates
- [ ] Plan automated regression tests
- [ ] Document remaining limitations
- [ ] Estimate effort and risk

**Constraints:**
- No duplicate implementations
- No temporary workarounds
- Changes must be minimal and focused
- Every change requires automated test

**Deliverable:** `REMEDIATION_PLAN.md`

---

### 9. EVIDENCE REQUIREMENTS

Every claimed repair must have:

1. **Defect ID** — e.g., DEFECT-001
2. **Location** — File, line number, original code
3. **Root Cause** — Why it occurred
4. **Fix Location** — Where the change was made
5. **Fix Code** — Actual code change
6. **Unit Test** — Automated test for the fix
7. **Test Result** — Actual execution output
8. **Regression Check** — Tests that verify no breakage
9. **Limitations** — What remains unresolved
10. **Sign-off** — Evidence of verification

**No fabricated results. No simulated tests. Only actual execution output.**

---

### 10. FINAL DELIVERABLES

All documents will be created in `/projects/sandbox/rrn-website/.agents/PHASE_3_*/`:

1. ✓ `PHASE_3_FORENSIC_AUDIT_PLAN.md` — This document
2. `CALEB_ARCHITECTURE_MAP.md` — Complete system architecture
3. `CALEB_FORENSIC_AUDIT.md` — Detailed code inspection findings
4. `CALEB_DEFECT_VERIFICATION.md` — Individual verdict on all 10 defects
5. `BLOCKING_ISSUES_INVESTIGATION.md` — Deep dive on 5 critical issues
6. `E2E_TEST_RESULTS.md` — Reproducible test execution evidence
7. `REGRESSION_TEST_REPORT.md` — Full feature verification
8. `ROOT_CAUSE_ANALYSIS.md` — Why each defect occurred
9. `REMEDIATION_PLAN.md` — Priority and sequence for fixes
10. `CALEB_DEPLOYMENT_READINESS.md` — Go/no-go decision

---

## PHASE 3 EXECUTION SEQUENCE

**Step 1:** Preserve application (Task 1)  
**Step 2:** Build architecture map (Task 2)  
**Step 3:** Investigate blocking issues (Task 4) — these inform everything else  
**Step 4:** Verify defects (Task 3)  
**Step 5:** Execute E2E tests (Task 5)  
**Step 6:** Regression examination (Task 6)  
**Step 7:** Root cause analysis (Task 7)  
**Step 8:** Develop remediation plan (Task 8)  

---

## DECISION GATES

**GATE 1: After architecture mapping**
- Does the map accurately represent the system?
- Are there undiscovered subsystems or dependencies?
- Proceed if complete and accurate.

**GATE 2: After blocking issues investigation**
- Is `_rrnAPI` initialization understood?
- Is completion persistence confirmed?
- Is intent routing behavior acceptable?
- Proceed if all critical dependencies are resolved.

**GATE 3: After E2E testing**
- Do all 10 tests pass?
- Are results reproducible?
- Proceed if 8+ tests pass; escalate if fewer.

**GATE 4: After regression testing**
- Are all existing features working?
- No new defects introduced?
- Proceed if regression clean.

**GATE 5: After remediation plan**
- Are fixes minimal and focused?
- Do they address root causes?
- Will they not introduce new issues?
- Proceed if all criteria met.

---

## SUCCESS CRITERIA

Phase 3 is complete when:

✅ Architecture map is accurate and complete  
✅ All 10 defects have been independently verified  
✅ All 5 blocking issues are resolved  
✅ 10/10 E2E tests pass  
✅ Regression testing shows no breakage  
✅ Root cause analysis explains each defect  
✅ Remediation plan is practical and safe  
✅ Every claimed fix has evidence  

**Deployment restriction:** NO deployment or production changes until all criteria met and explicit authorization given.

---

## NOTES

- This is a forensic audit, not a code review.
- Assume nothing. Verify everything.
- No test is complete until it has been executed.
- No defect is fixed until the fix has been tested and proven.
- The goal is a working application, not another report.
