# CALEB Phase 3 — Integration Control & Coordination

**Established:** 2026-11-01  
**Authority:** User directive for evidence-based remediation  
**Objective:** Prevent concurrent modifications; ensure testable recovery path  

---

## Integration Owner Designation

**Role:** Single point of control for all source modifications  
**Responsibility:** 
- Coordinate all fixes across parallel investigations
- Manage branch strategy
- Enforce regression testing before merge
- Maintain recoverable state at all times

**Authority:** Can pause/resume investigation steps, approve merges, command rollbacks

---

## Branch Strategy

### Branches in Use

1. **main** (Production/Baseline)
   - Contains v87 (verified baseline)
   - Protected: No direct pushes
   - Recovery point: Always restorable to committed state

2. **phase3-investigation** (Investigation branch)
   - Starting point: commit 062a40c
   - Contains: Architecture discovery, defect ledger
   - No source code modifications on this branch
   - Evidence-only: Documentation, audit traces, test results

3. **phase3-fixes-master** (Fixes integration branch)
   - Single branch for ALL coordinated fixes
   - Created from: commit 062a40c
   - Rule: Only one agent can push to this branch at a time
   - Merge to main requires: Regression tests pass + User approval

4. **phase3-fixes-audio** (Audio system fixes)
   - Feature branch off phase3-fixes-master
   - Fixes: DEFECT-001, DEFECT-002, DEFECT-003, DEFECT-004, DEFECT-005
   - Must merge to phase3-fixes-master with regression tests

5. **phase3-fixes-routing** (Intent routing fixes)
   - Feature branch off phase3-fixes-master
   - Fixes: DEFECT-006, DEFECT-007
   - Must merge to phase3-fixes-master with regression tests

6. **phase3-fixes-navigation** (Navigation/state fixes)
   - Feature branch off phase3-fixes-master
   - Fixes: DEFECT-008, DEFECT-009
   - Must merge to phase3-fixes-master with regression tests

7. **phase3-fixes-validation** (Completion validation)
   - Feature branch off phase3-fixes-master
   - Fixes: DEFECT-010
   - Must merge to phase3-fixes-master with regression tests

### Branch Protection Rules

```
main:
  - Require pull request review (2 approvers minimum)
  - Require status checks pass
  - Require branches up to date
  - NO force pushes

phase3-fixes-master:
  - Only integration owner can push merges
  - All fixes must come from feature branches with tests
  - NO direct commits
  - Linear history maintained

phase3-fixes-*:
  - Developers can force push (own branches)
  - Require test evidence before merge request
  - Merge only to phase3-fixes-master
  - Delete after merge
```

---

## Concurrent Modification Prevention

### Rule 1: Single Ownership of Each Defect Domain

| Domain | Owner | Defects | Status |
|--------|-------|---------|--------|
| Audio System | wf-coder-audio | 001-005 | AWAITING ASSIGNMENT |
| Intent Routing | wf-coder-routing | 006-007 | AWAITING ASSIGNMENT |
| Navigation/State | wf-coder-navigation | 008-009 | AWAITING ASSIGNMENT |
| Completion Validation | wf-coder-validation | 010 | AWAITING ASSIGNMENT |

### Rule 2: No Overlapping File Modifications

Each agent modifies ONLY its assigned section:

- **Audio agent** modifies: Lines 33170-33400 (read system)
- **Routing agent** modifies: Lines 58700-59100 (intent engine)
- **Navigation agent** modifies: Lines scattered (state management, navigation handlers)
- **Validation agent** modifies: Lines 32590-32620 (completion recording)

**Before modification:** Agent creates git branch, commits documented baseline, merges only after regression tests pass.

### Rule 3: Integration Gate Before Each Merge

Before merging to phase3-fixes-master:

```
1. Branch pushed to remote
2. Regression test suite executed (must pass)
3. Feature-specific tests executed (must pass)
4. Code review by integration owner
5. Merge commit created with evidence link
6. All tests re-run on merged code
7. Acceptance gate verified before next step
```

---

## Execution Tracing Requirement

**Objective:** Prove actual data flow from user action to backend persistence

### Tracing Framework

Each defect fix must include traces for:

**Trace 1: User Input → Application Action**
```
- Browser console: Log at entry point
- What: User clicks button / says command / enters data
- Evidence: Screenshot + console log timestamp
```

**Trace 2: Application Action → Function Call**
```
- Console log: Each step of execution
- What: Parsing, validation, routing, execution
- Evidence: Timestamped console output
```

**Trace 3: Function Call → API Request**
```
- Network tab: All HTTP requests captured
- What: Method, URL, headers, body, response
- Evidence: Browser DevTools Network export
```

**Trace 4: API Request → Backend Processing**
```
- Server logs (if accessible): Request received, processed, response sent
- What: Input validation, business logic, database operation
- Evidence: Server log entries with timestamps
```

**Trace 5: Backend Processing → Database Persistence**
```
- Database query: Record inserted/updated/verified
- What: Table, row ID, values, timestamp
- Evidence: Database query result or SELECT verification
```

**Trace 6: Database State → User Visibility**
```
- Browser display: Updated UI showing persisted data
- What: User refreshes, data appears, mentor sees result
- Evidence: Screenshots showing data reflection in UI
```

### Tracing Template (Required for Each Flow)

```markdown
## Execution Trace: [Feature Name]

### Scenario
User [action] with [inputs]

### Expected Flow
[Step-by-step expected behavior]

### Actual Trace
1. Browser Entry Point
   - URL: [initial page]
   - User action: [button click / command / input]
   - Console: [log output]
   - Screenshot: [provided]

2. JavaScript Execution
   - Function called: [name]
   - Line number: [exact location in code]
   - Execution log: [console output with timestamps]
   - Values: [key variables at execution time]

3. Network Request
   - Request: [method URL]
   - Headers: [auth, content-type, etc]
   - Body: [JSON payload]
   - Response: [HTTP status, response body]
   - Screenshot: [Network tab capture]

4. Backend Processing
   - Endpoint: [exact route]
   - Database table: [which table affected]
   - Operation: [INSERT/UPDATE/SELECT]
   - Query: [SQL or ORM equivalent]
   - Result: [rows affected, IDs returned]
   - Logs: [server-side event log]

5. Data Verification
   - SELECT query: [to verify persistence]
   - Expected rows: [what should exist]
   - Actual rows: [what was found]
   - Diff: [any discrepancies]

6. User Visibility
   - Feature displayed: [where / how]
   - Correct data shown: [yes/no]
   - Mentor visible: [if applicable]
   - Screenshot: [proof of display]

### Result
PASS / FAIL / PARTIAL

### Evidence Artifacts
- console_output.txt
- network_capture.har
- database_query_results.txt
- screenshots/ [multiple]
- server_logs.txt
```

---

## Remediation Requirements

### Defect Fix Checklist (for each P0 defect)

Before merge to phase3-fixes-master:

- [ ] Root cause documented in code comments
- [ ] Original broken code removed (not commented out)
- [ ] New code implements minimum viable fix (no over-engineering)
- [ ] No duplicate code introduced
- [ ] Automated unit test created (passes)
- [ ] Integration test created (proves fix works)
- [ ] Regression test suite runs (all pass)
- [ ] Code review completed
- [ ] Execution trace documented (proves actual behavior)
- [ ] Database state verified (if applicable)
- [ ] User-facing behavior verified in browser

### Fix Documentation Template

```markdown
## Fix: [DEFECT-XXX] [Title]

### Root Cause
[Why the defect exists, architectural issue]

### Original Code Location
Lines [X-Y] in REFINED_18_05_HEALED_v87.html

### Original Code
[Paste original problematic code]

### Problem With Original
[What breaks because of this code]

### New Code Location
Lines [X-Y] in REFINED_18_05_HEALED_vXX.html

### New Code
[Paste replacement code]

### Why This Fixes It
[Explain the fix]

### Automated Test
[Unit test code that verifies fix]

### Test Result
[Actual test execution output]

### Integration Test
[Test that proves it works in context]

### Integration Test Result
[Actual test execution output]

### Regression Impact
[Features affected, tested]

### Regression Results
- Feature A: PASS
- Feature B: PASS
- Feature C: PASS

### Browser Verification
[For UI/audio features: actual browser testing]

### Production Readiness
- [ ] Code complete
- [ ] Tests passing
- [ ] No regressions
- [ ] Documentation complete
- [ ] Ready for acceptance testing
```

---

## Acceptance Testing Requirements

### Test Execution Protocol

Each acceptance test MUST include:

1. **Setup State**
   - Browser: [Chrome/Edge/etc version]
   - User role: [member/mentor/admin]
   - Lesson state: [which lesson, completion status]
   - Prior actions: [any prerequisite actions]

2. **Test Steps**
   - Step 1: [exact action]
   - Step 2: [exact action]
   - (etc)

3. **Captured Evidence**
   - Browser DevTools screenshots
   - Network tab export (HAR file)
   - Console output (copy-paste)
   - Backend logs (if accessible)
   - Database state (before/after SELECT)
   - User-facing result screenshot

4. **Pass/Fail Criteria**
   - Expected: [exact expected outcome]
   - Actual: [what actually happened]
   - Match: [YES / NO]

5. **Verdict**
   - PASS / FAIL / PARTIAL
   - If FAIL: Root cause analysis required

### Test Matrix Template

```markdown
## Acceptance Test Matrix

| Test # | Feature | Scenario | Browser | Result | Evidence |
|--------|---------|----------|---------|--------|----------|
| AT-1 | Read Lesson | 5-min audio | Chrome | PASS/FAIL | trace-1.md |
| AT-2 | Pause/Resume | Mid-lesson pause | Chrome | PASS/FAIL | trace-2.md |
| (etc) | | | | | |
```

---

## Final Report Structure

### Required Sections for Each Feature

```markdown
## Feature: [Name]

### Advertised Functionality
[What RRN website claims]

### Current Implementation Status
- Works: [what actually works]
- Partially Works: [what partially works, limitations]
- Broken: [what doesn't work]
- Missing: [what wasn't implemented]

### Defects Affecting This Feature
- DEFECT-XXX: [impact]
- DEFECT-YYY: [impact]

### Repairs Applied
- DEFECT-XXX: [fix description]
- DEFECT-YYY: [fix description]

### Testing Results
- Unit tests: [count, all pass]
- Integration tests: [count, all pass]
- Regression tests: [count, all pass]
- Browser tests: [Chrome/Edge/etc, results]
- Backend verification: [database state correct]

### Acceptance Test Evidence
- Test AT-1: PASS [link to trace]
- Test AT-2: PASS [link to trace]
- (etc)

### Unverified Aspects
- [What remains untested]
- [What has limitations]
- [What was not fixed]

### Conclusion
READY / NOT READY (with specific reasons)
```

---

## Workflow Coordination Rules

### Rule: No Concurrent Modifications

**Enforcement:**
1. Each branch assigned to single agent
2. Only one feature branch can merge per day
3. Full regression cycle after each merge
4. Integration owner approves all merges

### Rule: Evidence Comes First

**Enforcement:**
1. No code pushed without test evidence
2. Test evidence must include actual execution output
3. Screenshots/logs/traces required before merge
4. Claims verified before acceptance

### Rule: Rollback Available Always

**Enforcement:**
1. Before each merge: `git tag phase3-before-[defect]`
2. If regression detected: `git reset --hard [tag]`
3. Root cause analysis required before re-attempt
4. Integration owner authorizes re-fix

---

## Integration Owner Checklist

After each feature branch merge to phase3-fixes-master:

- [ ] Branch code reviewed
- [ ] Test evidence examined
- [ ] Regression tests passed (full suite)
- [ ] No file conflicts
- [ ] Linear history maintained
- [ ] Tag created for rollback
- [ ] Integration state verified

Before final merge to main:

- [ ] All feature branches merged to phase3-fixes-master
- [ ] Full regression suite passes
- [ ] All acceptance tests pass
- [ ] Final report generated
- [ ] Feature-by-feature status documented
- [ ] User has reviewed and approved
- [ ] Production state matches testing state
- [ ] Rollback procedures verified

---

## Current Status

**Branch Status:**
- main: Protected, unchanged (baseline at 062a40c)
- phase3-investigation: Documentation only (no source changes)
- phase3-fixes-master: Created, ready for feature branches
- Feature branches: Ready to be created as fixes are developed

**Workflow Status:**
- Current: PAUSED (awaiting integration control confirmation)
- Next: Resume with coordinated fix development

**Recovery State:**
- Backup: Verified restorable (`../BACKUP/REFINED_18_05_HEALED_v87.html.backup.20261101_060819`)
- Latest commit: 062a40c (tagged as phase3-baseline)
- v87 production file: Unchanged, recoverable

---

## Authorization Required

User must confirm:

1. ✓ Integration control framework accepted
2. ✓ Branch strategy understood
3. ✓ Concurrent modification prevention accepted
4. ✓ Evidence standards for all tests understood
5. ✓ Execution tracing requirement accepted
6. ✓ No production deployment until acceptance tests complete

Once confirmed, Phase 3 will resume with:
- Blocking issues investigation (complete evidence)
- Defect verification (proof-based, not claims)
- Remediation (fixes with tests, no patches)
- Acceptance testing (real browser, real backend)
