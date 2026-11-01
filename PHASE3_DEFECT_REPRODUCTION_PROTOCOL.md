# CALEB Phase 3 — Defect Reproduction Protocol

**Objective:** Reproduce and validate all 10 P0 defects with actual execution evidence  
**Status:** READY FOR EXECUTION  
**Evidence Required:** Browser execution, console logs, network traces, code line references  

---

## Overview of 10 P0 Defects

| # | Title | Severity | Root Cause | Evidence Type |
|---|-------|----------|-----------|---|
| 001 | Audio Lifecycle Race Conditions | BLOCKING | Multiple finalization triggers | Code inspection + Browser audio test |
| 002 | No Utterance Queue | BLOCKING | Direct speak() calls, no tracking | Code inspection + Sequential speech test |
| 003 | Voice Initialization Race | BLOCKING | getVoices() async timing | Code inspection + Browser voice test |
| 004 | Text Segmentation Regex | BLOCKING | Lookbehind unsupported | Code inspection + Regex compatibility test |
| 005 | Highlight Scoring Bias | BLOCKING | ALL-CAPS logic, double-highlight | Code inspection + Visual test |
| 006 | Intent Collision | BLOCKING | Pattern "read it" too general | Code inspection + Ambiguous query test |
| 007 | No Precondition Validation | BLOCKING | Missing auth/permission checks | Code inspection + Command test |
| 008 | Navigation State Not Sync'd | BLOCKING | Multiple state vars, no single source | Code inspection + Navigation test |
| 009 | Async Navigation (No Await) | BLOCKING | No Promise/await pattern | Code inspection + Race condition test |
| 010 | Completion Not Validated | BLOCKING | Quiz pass marks complete | Code inspection + Fraud scenario test |

---

## DEFECT-001: Audio Lifecycle Race Conditions

### Root Cause Statement
The speech synthesis lifecycle has three independent finalization triggers:
1. `u.onend` callback — fires when utterance naturally completes
2. `u.onerror` callback — fires on error
3. `setTimeout(finish, maxWait)` — forced timeout after calculated duration

All three call the same `finish()` callback, which invokes `onDone()`, which calls `readNext()` immediately. Multiple simultaneous fires result in `readNext()` being called twice, skipping a sentence.

Additionally, a 5-second watchdog calls `resume()` every 5 seconds, potentially interrupting mid-sentence.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 33330-33345  

### Original Code to Inspect
```javascript
// Line 33330+
var done=false;
function finish(){if(!done){done=true;if(_watchdog){clearInterval(_watchdog);_watchdog=null;}onDone();}}
_watchdog=setInterval(function(){
  if(!window._calebReading||done){clearInterval(_watchdog);_watchdog=null;return;}
  try{window.speechSynthesis.resume();}catch(e){}
},5000);
u.onend=finish;
u.onerror=finish;
var maxWait=Math.max(800,Math.ceil(s.length/(0.87*14)*1000)+400);
setTimeout(function(){finish();},maxWait);
window.speechSynthesis.speak(u);
```

### Reproduction Test

**Test Steps:**

1. Load application in Chrome
2. Open lesson with 60-second+ audio
3. Click "Read Lesson Aloud"
4. Monitor browser console and DevTools Network tab
5. Record:
   - When `u.onend` fires (timestamp)
   - When `u.onerror` fires (if at all)
   - When `finish()` is called (multiple times?)
   - When `readNext()` is called
   - Actual audio playback time

**Expected Behavior:**
- Audio plays smoothly without interruption
- `finish()` called exactly once per sentence
- `readNext()` called exactly once per completion
- Entire lesson reads without stopping

**Actual Behavior (If Defect Present):**
- Audio stops mid-sentence OR
- Sentences skip OR
- Reading hangs indefinitely OR
- Console shows multiple `finish()` calls for single sentence

**Test Evidence to Capture:**
- Screenshot of console logs showing call sequence
- Network tab showing speech synthesis API calls
- Audio playback time vs sentence length
- Sentence count at start vs end

**Regression Test:**
```javascript
// Creates failing test before fix, passing after
window._testAudioLifecycle = function() {
  var callCount = 0;
  var originalFinish = window._finishCallback;
  window._finishCallback = function() {
    callCount++;
    if (originalFinish) originalFinish();
  };
  
  // Simulate 60-second sentence
  var text = "The quick brown fox jumps over the lazy dog. " +
             "This is a long sentence that should take about 60 seconds to read aloud at normal speech rate. " +
             (new Array(20)).join("Lorem ipsum dolor sit amet. ");
  
  window._calebSpeak(text, function() {
    console.log('[TEST] Callback invoked. Call count: ' + callCount);
    if (callCount > 1) {
      console.error('[TEST] FAIL: finish() called ' + callCount + ' times');
      return false;
    } else {
      console.log('[TEST] PASS: finish() called exactly once');
      return true;
    }
  });
};
```

---

## DEFECT-002: No Utterance Queue

### Root Cause Statement
There is no application-level queue management for utterances. Every call to `window._calebSpeak()` directly calls `speechSynthesis.speak()`, relying on the browser's internal queue. Multiple rapid calls can create race conditions where:
1. Sentence N is queued
2. Callback for sentence N fires
3. `readNext()` calls `_calebSpeak()` for sentence N+1 (correct)
4. BUT if callback fires twice, `readNext()` called twice, skipping sentence N+1

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 33338 (call to `speechSynthesis.speak(u)`), no queue operations found  

### Reproduction Test

**Test Steps:**

1. Load application
2. Select lesson with 5+ paragraphs
3. Click "Read Lesson Aloud"
4. In browser console, count sentences read
5. Record actual sentence count at completion
6. Compare to expected sentence count

**Expected Behavior:**
- All sentences read in order
- No sentences skipped
- Sentence count matches total

**Actual Behavior (If Defect Present):**
- One or more sentences skipped
- Sentence count < total sentences
- Highlighting jumps ahead

**Test Evidence:**
```javascript
// Instrument to count sentences
window._sentenceCount = 0;
window._readNextOriginal = window._readNext;
window._readNext = function() {
  window._sentenceCount++;
  console.log('[TEST] readNext() called, sentence #' + window._sentenceCount);
  return window._readNextOriginal.apply(this, arguments);
};
```

**Regression Test:**
```javascript
window._testUtteranceQueue = function() {
  var startSentences = window._totalSentences || 0;
  var endSentences = 0;
  
  // After reading completes, check:
  setTimeout(function() {
    endSentences = window._sentenceCount;
    if (endSentences < startSentences) {
      console.error('[TEST] FAIL: Skipped sentences. Expected ' + startSentences + ', got ' + endSentences);
      return false;
    } else {
      console.log('[TEST] PASS: All sentences read. Count: ' + endSentences);
      return true;
    }
  }, (startSentences * 8000)); // Rough timing: 8s per sentence
};
```

---

## DEFECT-003: Voice Initialization Race

### Root Cause Statement
`window.speechSynthesis.getVoices()` returns an empty array on initial call in many browsers. The browser loads voices asynchronously. Code calls `getVoices()` without waiting for the `voiceschanged` event, resulting in empty array and system default voice being used.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 33317, 58171-58176  

### Reproduction Test

**Test Steps:**

1. Open Chrome DevTools
2. Add breakpoint at voice selection code
3. Load page
4. Click "Read Lesson Aloud"
5. Observe: Does `getVoices()` return empty array?
6. What voice is actually used?

**Expected Behavior:**
- Preferred voice is selected (Microsoft Guy, Google US English, etc.)
- Consistent voice across reads

**Actual Behavior (If Defect Present):**
- Wrong voice used (system default)
- Inconsistent voice across reads
- Audio quality degrades

**Test Evidence:**
```javascript
window._testVoiceInitialization = function() {
  var voices = window.speechSynthesis.getVoices();
  console.log('[TEST] getVoices() returned ' + voices.length + ' voices');
  
  if (voices.length === 0) {
    console.warn('[TEST] WARNING: getVoices() returned empty array');
    console.log('[TEST] Browser must support voiceschanged event');
    
    var voicesChangedFired = false;
    window.speechSynthesis.onvoiceschanged = function() {
      voicesChangedFired = true;
      var newVoices = window.speechSynthesis.getVoices();
      console.log('[TEST] voiceschanged: now have ' + newVoices.length + ' voices');
    };
    
    setTimeout(function() {
      if (!voicesChangedFired) {
        console.error('[TEST] FAIL: voiceschanged event did not fire');
        return false;
      }
    }, 2000);
  } else {
    console.log('[TEST] PASS: getVoices() returned voices immediately');
    return true;
  }
};
```

---

## DEFECT-004: Text Segmentation Regex

### Root Cause Statement
Code uses lookbehind regex `(?<=[a-zA-Z\u2019\)])` which is not supported in older browsers (IE, older Safari). When the regex is evaluated, it throws a SyntaxError, breaking text segmentation entirely.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 33210-33235  

### Reproduction Test

**Test Steps on Browser Without Lookbehind Support:**

1. Open older browser or simulate with polyfill removal
2. Load page
3. Try to read a lesson
4. Check console for errors
5. Does text segmentation work or fail silently?

**Expected Behavior:**
- Fallback to simple split if lookbehind not supported
- Sentences parsed correctly
- Reading begins

**Actual Behavior (If Defect Present):**
- Console error: `SyntaxError: Invalid regular expression`
- Text segmentation fails
- Reading doesn't start OR uses broken segments

**Test Evidence:**
```javascript
window._testRegexCompatibility = function() {
  var testStr = "Hello. World.";
  
  try {
    var result = testStr.split(/(?<=[a-zA-Z])[.!?](?=\s+)/g);
    console.log('[TEST] Lookbehind regex supported');
    return true;
  } catch (e) {
    console.warn('[TEST] Lookbehind regex NOT supported: ' + e.message);
    
    // Try fallback
    var fallback = testStr.split(/[.!?]+\s+/g);
    console.log('[TEST] Fallback split produced ' + fallback.length + ' segments');
    
    if (fallback.length > 0) {
      console.log('[TEST] PASS: Fallback works');
      return true;
    } else {
      console.error('[TEST] FAIL: Fallback also failed');
      return false;
    }
  }
};
```

---

## DEFECT-005: Highlight Scoring Bias

### Root Cause Statement
Highlighting algorithm has logic that treats ALL-CAPS text specially, pushing it to highlight. But double-highlighting can occur if cleanup doesn't properly remove prior highlights. Additionally, multiple elements matching the same text can all be highlighted simultaneously.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 33280-33315  

### Reproduction Test

**Test Steps:**

1. Load lesson with mixed case, all-caps, and special text
2. Click "Read Lesson Aloud"
3. Observe highlighting as audio plays
4. Count simultaneously highlighted elements
5. Does highlighting update correctly each sentence?

**Expected Behavior:**
- Exactly one element highlighted at a time
- Highlighting follows audio
- Highlights cleanup between sentences

**Actual Behavior (If Defect Present):**
- Multiple elements highlighted simultaneously
- Highlighting doesn't update cleanly
- Visual confusion

**Test Evidence:**
```javascript
window._testHighlighting = function() {
  var highlightedElements = document.querySelectorAll('.caleb-hl');
  console.log('[TEST] Currently highlighted elements: ' + highlightedElements.length);
  
  if (highlightedElements.length > 1) {
    console.error('[TEST] FAIL: More than one element highlighted');
    highlightedElements.forEach(function(el, idx) {
      console.log('[TEST]  ' + idx + ': ' + el.textContent.substring(0, 50));
    });
    return false;
  } else if (highlightedElements.length === 1) {
    console.log('[TEST] PASS: Exactly one element highlighted');
    return true;
  } else {
    console.log('[TEST] INFO: No elements currently highlighted');
    return null;
  }
};
```

---

## DEFECT-006: Intent Collision

### Root Cause Statement
Pattern matching intent router uses array position priority. Pattern "read it" appears before "open journal" in array. User query "read my journal" contains substring "read it", so matches the wrong intent. No context awareness (current screen) in scoring.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** ~58769 (CALEB_INTENTS array)  

### Reproduction Test

**Test Steps:**

1. Load application
2. Test ambiguous queries:
   - "read" (should resolve to context-dependent action)
   - "read my journal" (should open journal and read, not start lesson)
   - "read it" (ambiguous without context)
   - "listen" (should resolve to lesson reading)
3. Record which intent was resolved
4. Is resolution correct for context?

**Expected Behavior:**
- Context-aware resolution
- No collisions for reasonable queries

**Actual Behavior (If Defect Present):**
- "read my journal" → lesson reading instead of journal
- Ambiguous queries → wrong intent
- No context consideration

**Test Evidence:**
```javascript
window._testIntentRouting = function(query) {
  // Simulate intent matching
  var CALEB_INTENTS = [...]; // Extract from code
  
  var matched = null;
  CALEB_INTENTS.forEach(function(intent) {
    intent.patterns.forEach(function(pattern) {
      if (query.indexOf(pattern) >= 0) {
        matched = intent;
        return;
      }
    });
    if (matched) return;
  });
  
  console.log('[TEST] Query: "' + query + '"');
  console.log('[TEST] Matched intent: ' + (matched ? matched.id : 'NONE'));
  return matched;
};

// Test cases
window._testIntentRouting('read my journal');
window._testIntentRouting('read it');
window._testIntentRouting('listen to lesson');
```

---

## DEFECT-007: No Precondition Validation

### Root Cause Statement
Code executes actions without verifying preconditions. No checks for:
- Is user authenticated?
- Does user have permission for this action?
- Is required content loaded?
- Is this the right context/screen?

Actions fail silently without feedback.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 58903-58904 (and throughout action handlers)  

### Reproduction Test

**Test Steps:**

1. Call action without preconditions met:
   - Try to read lesson while offline
   - Try to navigate to inaccessible section
   - Try to submit without data
2. Observe: Does action fail silently or provide feedback?
3. Is there error logging?

**Expected Behavior:**
- Clear error message
- User knows what went wrong
- Actionable recovery steps

**Actual Behavior (If Defect Present):**
- Silent failure
- No error message
- User confused

**Test Evidence:**
```javascript
window._testPreconditions = function() {
  // Simulate precondition failures
  
  // Test 1: No auth token
  window._rrnToken = null;
  console.log('[TEST] Attempting action without auth token');
  window._calebSpeak('Open my profile');
  setTimeout(function() {
    console.log('[TEST] Did action complete or fail?');
  }, 1000);
  
  // Test 2: Missing data
  console.log('[TEST] Attempting to read with no lesson loaded');
  window._currentLesson = null;
  window._calebSpeak('Read the lesson');
};
```

---

## DEFECT-008: Navigation State Not Synchronized

### Root Cause Statement
Multiple independent state variables track application state:
- `window._rrnActiveSection` (CALEB's view)
- `window._rrnCurrentLesson` (current lesson)
- React `tab` state (UI view)
- localStorage state (persisted)

No single source of truth. When one updates, others don't. CALEB doesn't know actual current screen.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** Scattered (no centralized state management)  

### Reproduction Test

**Test Steps:**

1. Navigate to "Lessons" section
2. Check `window._rrnActiveSection`
3. Navigate to "Journal"
4. Check `window._rrnActiveSection` again
5. Do they match?
6. Can CALEB describe current location?

**Expected Behavior:**
- State synchronized across all variables
- CALEB knows current location
- Navigation updates all state consistently

**Actual Behavior (If Defect Present):**
- State variables don't match
- CALEB confused about location
- Race conditions after navigation

**Test Evidence:**
```javascript
window._testStateSync = function() {
  console.log('[TEST] State before navigation:');
  console.log('[TEST]   _rrnActiveSection: ' + window._rrnActiveSection);
  console.log('[TEST]   _rrnCurrentLesson: ' + window._rrnCurrentLesson);
  
  // Simulate navigation
  window._navigateTo('journal');
  
  setTimeout(function() {
    console.log('[TEST] State after navigation:');
    console.log('[TEST]   _rrnActiveSection: ' + window._rrnActiveSection);
    console.log('[TEST]   _rrnCurrentLesson: ' + window._rrnCurrentLesson);
    
    if (window._rrnActiveSection === 'journal') {
      console.log('[TEST] PASS: State synchronized');
    } else {
      console.error('[TEST] FAIL: State not synchronized');
    }
  }, 500);
};
```

---

## DEFECT-009: Async Navigation (No Await)

### Root Cause Statement
Navigation is triggered but code doesn't wait for completion. Sequence:
1. Navigation command issued
2. React state change queued (async)
3. Code immediately tries to read (content not loaded yet)
4. Race condition: reads old content or blank

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** Scattered (no Promise/await pattern)  

### Reproduction Test

**Test Steps:**

1. Issue command: "Navigate to next lesson and read it"
2. Does navigation complete before reading starts?
3. Is correct content read?
4. Or is old/blank content read?

**Expected Behavior:**
- Navigation completes before reading starts
- Correct content is read
- No race conditions

**Actual Behavior (If Defect Present):**
- Reading starts before navigation complete
- Wrong content read
- Race conditions

**Test Evidence:**
```javascript
window._testAsyncNavigation = function() {
  var navigationPromise = window._navigateTo('lesson/next');
  
  if (navigationPromise && typeof navigationPromise.then === 'function') {
    console.log('[TEST] Navigation returns Promise - can be awaited');
    
    navigationPromise.then(function() {
      console.log('[TEST] PASS: Navigation completed before continuation');
    });
  } else {
    console.error('[TEST] FAIL: Navigation does not return Promise - cannot await');
  }
};
```

---

## DEFECT-010: Completion Not Validated

### Root Cause Statement
Lesson marked complete when user passes quiz, with NO verification that content was actually read. Code path:
1. User clicks "Submit Quiz"
2. Score calculated
3. IF score >= passing: Mark complete
4. Nowhere in this path: Did user actually read the lesson?

User could skip directly to quiz and mark complete without reading.

### Source Location
**File:** REFINED_18_05_HEALED_v87.html  
**Lines:** 32590-32620 (saveProgress, no verification code)  

### Reproduction Test

**Test Steps:**

1. Load lesson
2. WITHOUT clicking "Read Lesson Aloud":
   - Attempt to take quiz
   - Answer questions correctly
   - Submit
3. Does system mark lesson as completed?
4. Check backend/localStorage: is completion recorded?

**Expected Behavior:**
- System requires reading before quiz
- Or: Validates >95% of lesson was read
- Or: Marks quiz-pass separately from reading-pass

**Actual Behavior (If Defect Present):**
- Completion recorded without reading
- User marked complete for lesson they didn't read
- Fraudulent completion possible

**Test Evidence:**
```javascript
window._testCompletionValidation = function() {
  var completionBefore = localStorage.getItem('rrn_curriculum_progress');
  console.log('[TEST] Completion status before quiz: ' + completionBefore);
  
  // Skip reading, go directly to quiz
  window._currentLesson = {id: 'lesson-1', passingScore: 70};
  window._submitQuiz({score: 85}); // Pass with high score
  
  setTimeout(function() {
    var completionAfter = localStorage.getItem('rrn_curriculum_progress');
    console.log('[TEST] Completion status after quiz: ' + completionAfter);
    
    if (completionAfter && completionAfter !== completionBefore) {
      console.error('[TEST] FAIL: Lesson marked complete without reading');
      console.log('[TEST]   This is a data integrity risk - fraudulent completion possible');
      return false;
    } else {
      console.log('[TEST] PASS: Completion not marked without reading');
      return true;
    }
  }, 1000);
};
```

---

## Test Execution Plan

### Phase 3a: Code Inspection (Immediate)
For each defect: Locate exact lines, verify root cause in code

### Phase 3b: Browser Testing (Requires Environment)
For each defect: Execute reproduction test in actual browser

### Phase 3c: Regression Tests (Before Remediation)
Create failing tests that prove each defect; these must pass after fixes

### Phase 3d: Evidence Collection
- Console logs
- Browser DevTools screenshots
- Network traces
- Backend logs (if accessible)

### Stop Gate: Before Any Remediation
All 10 defects must be reproduced with evidence BEFORE any fixes are applied.

---

## Next: Execute Reproduction Tests

Ready to begin actual browser testing to validate each defect.
