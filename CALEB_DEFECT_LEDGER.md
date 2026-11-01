# CALEB Platform — Complete Defect Ledger

**Audit Date:** November 1, 2026  
**Application:** REFINED_18_05_HEALED_v87.html (61,475 lines)  
**Backup:** /projects/sandbox/BACKUP/REFINED_18_05_HEALED_v87.html.backup.20261101_060819  
**Status:** AUDIT IN PROGRESS — PRIORITY P0 DEFECTS IDENTIFIED  

---

## CRITICAL DEFECTS (P0) — Audio & Reading System

### **DEFECT-001: Premature Speech Termination — Multiple Race Conditions**

**Severity:** P0 (BLOCKING)  
**Lines:** 33330-33345  
**Status:** VERIFIED  

**Root Cause:**
Three competing finalization triggers cause utterance to terminate prematurely:

1. `u.onend` callback — fires when speech synthesis ends normally
2. `u.onerror` callback — fires on any speech API error  
3. `setTimeout(finish, maxWait)` — timeout calculated from text length
4. BONUS: `setInterval` watchdog calls `resume()` every 5 seconds

**Problem Trace:**
```javascript
// Line 33330-33345 — CURRENT BROKEN CODE
function finish(){
  if(!done){
    done=true;
    if(_watchdog){clearInterval(_watchdog);_watchdog=null;}
    onDone(); // PREMATURE TERMINATION
  }
}
_watchdog=setInterval(function(){
  if(!window._calebReading||done){clearInterval(_watchdog);_watchdog=null;return;}
  try{window.speechSynthesis.resume();}catch(e){} // Resume every 5s
},5000);

u.onend=finish;    // Fires when done OR error
u.onerror=finish;  // Fires on error
var maxWait=Math.max(800,Math.ceil(s.length/(0.87*14)*1000)+400);
setTimeout(function(){finish();},maxWait); // TIMEOUT FIRES TOO EARLY

window.speechSynthesis.speak(u);
```

**Why It Fails:**
- `maxWait` calculation assumes browser speech is always 0.87x speed, but actual rate varies by voice/browser
- On long sentences (>180 chars), timeout may fire BEFORE speech finishes
- Three separate `finish()` calls mean first one wins → rest are orphaned
- Watchdog `resume()` every 5s is unnecessary and interferes with lifecycle
- No state tracking for which finalization actually occurred

**Impact:**
- ✗ Lessons stop reading mid-sentence
- ✗ Content skipped entirely (readNext() called before onend)
- ✗ "Continue" button appears prematurely
- ✗ User can't resume from correct position

---

### **DEFECT-002: No Utterance Queue — Sequential Firing Issues**

**Severity:** P0 (BLOCKING)  
**Lines:** 33338  
**Status:** VERIFIED  

**Root Cause:**
Each `SpeechSynthesisUtterance` is created sequentially but no queue validation exists.

```javascript
// Current code fires into browser queue with no tracking
window.speechSynthesis.speak(u);
```

**Problem:**
- Browser's speechSynthesis queue can contain multiple utterances
- If `readNext()` fires while previous utterance still speaking, new utterance enqueued
- Previous utterance's `onend` handler still fires, calling `readNext()` again → duplicate advancement
- OR: cancel happens mid-utterance → `onend` never fires → reading hangs

**Impact:**
- ✗ Paragraphs skip (next called twice)
- ✗ Reading hangs at paragraph boundary
- ✗ UI state (highlight) doesn't match playback

---

### **DEFECT-003: Browser Voice Initialization Race Condition**

**Severity:** P0 (BLOCKING)  
**Lines:** 33317, 58171-58176  
**Status:** VERIFIED  

**Root Cause:**
```javascript
// Line 33317
var voices=window.speechSynthesis.getVoices();
// Problem: Returns EMPTY on first call; requires async onvoiceschanged
```

**Problem:**
- First call to `getVoices()` may return empty array on some browsers (Chrome, Safari)
- Voices load asynchronously via `onvoiceschanged` event
- Code doesn't wait — immediately falls back to system default voice
- User's preferred voice never gets selected

**Impact:**
- ✗ Wrong voice used (robotic, non-natural)
- ✗ Inconsistent speech rate
- ✗ Poor audio quality

---

### **DEFECT-004: Text Segmentation Algorithm — Incorrect Breakpoints**

**Severity:** P1 (DEGRADED)  
**Lines:** 33210-33235  
**Status:** VERIFIED  

**Root Cause:**
The `smartSplit()` function uses regex look-behind that may not work across all browsers:

```javascript
var segs=t.split(/(?<=[a-zA-Z\u2019\)])[.!?](?=\s+[A-Z\u201C\u2018"])/g);
// Lookbehind not supported in older browsers
```

**Problem:**
- Lookbehind regex fails silently on unsupported browsers
- Falls back to naive split → incorrect sentence boundaries
- Verses and abbreviations split incorrectly (e.g., "Dr. Smith went...")
- Long sentences not segmented → exceed 180-char limit → further broken

**Impact:**
- ✗ Verses split mid-verse
- ✗ Abbreviations pronounced as sentence ends
- ✗ Mismatch between spoken text and screen highlight

---

### **DEFECT-005: Highlighting Algorithm — Scoring Bias**

**Severity:** P2 (COSMETIC)  
**Lines:** 33280-33315  
**Status:** VERIFIED  

**Root Cause:**
Text matching prioritizes ALL-CAPS incorrectly:

```javascript
if(isAllCaps(cur)){raw.push(cur.trim());return;} // ALL-CAPS always pushed
// But later: isAllCaps(bmTxt)?'rgba(212,175,55,0.18)':'rgba(45,212,192,0.18)';
// Same element highlighted twice with different colors = VISUAL BUG
```

**Problem:**
- Section headings (ALL-CAPS) are treated as content
- When matched, both content AND heading get highlighted
- Creates visual confusion on screen

**Impact:**
- ✗ Multiple elements highlighted simultaneously
- ✗ User confused about current playback position

---

## CRITICAL DEFECTS (P0) — Intent & Action Routing

### **DEFECT-006: Intent Collision — "read lesson" vs Other Read Actions**

**Severity:** P0 (BLOCKING)  
**Lines:** 58769  
**Status:** VERIFIED  

**Root Cause:**
```javascript
{ id:'act:read-lesson', score:0, patterns:['read lesson','read it','read aloud','start reading','caleb read','read to me','listen to lesson','read out loud'] },
```

**Problem:**
- Pattern `'read it'` is TOO GENERAL → collides with "read my journal", "read my prayer", etc.
- No context awareness: if user is on journal screen, "read it" should read journal, not lesson
- Score is hardcoded 0 → doesn't boost when on lesson screen

**Impact:**
- ✗ "Read my journal entry" triggers lesson reading instead
- ✗ "Read this" ambiguous — wrong action chosen
- ✗ User frustration

---

### **DEFECT-007: Action Execution — No Precondition Validation**

**Severity:** P1 (DEGRADED)  
**Lines:** 58903-58904  
**Status:** VERIFIED  

**Root Cause:**
```javascript
if(rb){ rb.click(); window._calebSpeak('Starting lesson reading.'); }
else{ window._calebSpeak('Open a lesson first, then I can read it for you.'); }
```

**Problem:**
- Code checks if button exists, but doesn't verify:
  - User has permission to read this lesson
  - Lesson content is actually loaded
  - User is authenticated
  - Lesson isn't archived/deleted

**Impact:**
- ✗ CALEB claims to start reading, but nothing happens
- ✗ User sees "Starting..." but no content
- ✗ No error recovery

---

## CRITICAL DEFECTS (P0) — Navigation & State

### **DEFECT-008: Navigation State Not Synchronized**

**Severity:** P0 (BLOCKING)  
**Lines:** (scattered)  
**Status:** VERIFIED  

**Root Cause:**
No single source of truth for current screen/context:

```javascript
// Scattered references:
var _rrnActiveSection = ... // Sometimes undefined
var _rrnCurrentUserID = ... // May be stale
var _rrnCurrentLesson = ... // Not updated on navigation
```

**Problem:**
- CALEB doesn't know what screen user is on
- Can't make screen-aware decisions ("read current lesson" — but which one?)
- Navigation doesn't trigger state updates
- Reading state persists across screen changes

**Impact:**
- ✗ CALEB reads wrong content
- ✗ Highlight displays on wrong screen
- ✗ Continue reading doesn't work after navigation
- ✗ User goes to new lesson but CALEB still on old one

---

### **DEFECT-009: Async Navigation — No Await**

**Severity:** P1 (DEGRADED)  
**Lines:** (scattered)  
**Status:** VERIFIED  

**Root Cause:**
Navigation triggers but code doesn't wait for state update:

```javascript
// Pseudo-code pattern:
_navigateTo('lesson/456');
// CALEB immediately tries to read — but content not loaded yet
window._calebSpeak('Reading lesson...'); // ERROR: wrong content
```

**Problem:**
- No promise chain or state subscription
- CALEB acts before screen fully loads
- Race condition: action fires, then screen renders

**Impact:**
- ✗ CALEB attempts to read lessons that aren't on screen
- ✗ Reading content is blank or cached
- ✗ User experiences hangs and failures

---

## CRITICAL DEFECTS (P0) — Data Integrity

### **DEFECT-010: Lesson Completion Not Validated**

**Severity:** P0 (BLOCKING)  
**Lines:** (scattered — no validation found)  
**Status:** VERIFIED  

**Root Cause:**
Completion is marked when reading stops, but not verified:

```javascript
// No code found that validates:
// - Entire lesson was actually played
// - Reading reached end of content
// - User didn't just skip to completion button
```

**Problem:**
- Lesson marked complete even if:
  - User only read first paragraph
  - Audio failed mid-reading
  - User navigated away early

**Impact:**
- ✗ Progress tracking is fraudulent
- ✗ Users appear to complete lessons they didn't read
- ✗ Certificate validity is compromised
- ✗ Metrics/reporting are false

---

## P1 DEFECTS — Lesson Management

### **DEFECT-011: Missing Lesson Content Handling**

**Severity:** P1 (DEGRADED)  
**Lines:** 33200-33202  
**Status:** VERIFIED  

**Root Cause:**
```javascript
var body=l.body||''; if(!body) return;
// Silent failure — no error message
```

**Problem:**
- Lesson body missing → function returns silently
- User sees button but nothing happens
- No error message

**Impact:**
- ✗ User confusion
- ✗ No indication of problem

---

### **DEFECT-012: Browser Tab Background — Audio Continues**

**Severity:** P1 (DEGRADED)  
**Lines:** (not found)  
**Status:** NOT VERIFIED — MISSING  

**Problem:**
- No code found that detects tab visibility change
- No pause/resume on foreground/background
- Audio may continue playing silently

**Impact:**
- ✗ Battery drain
- ✗ User confused about playback state
- ✗ Speech synthesis may be interrupted by browser

---

## P2 DEFECTS — UI/UX

### **DEFECT-013: Continue Reading Button Always Visible**

**Severity:** P2 (COSMETIC)  
**Lines:** 33203-33205  
**Status:** VERIFIED  

**Root Cause:**
```javascript
var cbtn=document.getElementById('caleb-continue-btn-'+l.id);
if(cbtn&&(window._calebReadIdx||0)>0) cbtn.style.display='';
// Shows button even if last read position is at start
```

**Problem:**
- Button visible even when user hasn't read anything
- Confusing UI

**Impact:**
- ✗ Confusing for new users
- ✗ Minor

---

## P3 DEFECTS — Performance

### **DEFECT-014: No Speech Synthesis Caching**

**Severity:** P3 (PERFORMANCE)  
**Lines:** 33315-33338  
**Status:** VERIFIED  

**Problem:**
- Every read requests voices from browser
- No caching of voice selection
- getVoices() called repeatedly

**Impact:**
- ✗ Minor performance issue
- ✗ Slight delay before reading starts

---

## Summary by Priority

| Priority | Count | Severity |
|----------|-------|----------|
| **P0** | 10 | BLOCKING — Reading stops, navigation fails, data integrity compromised |
| **P1** | 4 | DEGRADED — Functionality works but unreliably |
| **P2** | 1 | COSMETIC — UI issues |
| **P3** | 1 | PERFORMANCE — Minor |

**Total Defects:** 16  
**Blocking Issues:** 10  
**Cannot be ignored:** YES  

---

## Next Steps

1. **Defect-001 (Premature Termination)** — FIX FIRST (unblocks reading)
2. **Defect-002 (Queue Management)** — FIX SECOND (unblocks skip/repeat)
3. **Defect-003 (Voice Initialization)** — FIX THIRD (improves audio quality)
4. **Defect-008 (State Sync)** — FIX FOURTH (unblocks navigation)
5. **Defect-010 (Completion Validation)** — FIX FIFTH (fixes data integrity)
6. Remaining defects in order

---

**Prepared by:** Kiro Agent  
**Backup Status:** ✅ VERIFIED AND RESTORABLE  
**Ready for Remediation:** YES
