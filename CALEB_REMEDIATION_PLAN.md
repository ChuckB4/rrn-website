# CALEB Platform — Autonomous Remediation Plan

**Phase:** 2 — Defect Remediation  
**Status:** IN PROGRESS  
**Target:** REFINED_18_05_HEALED_v88_REPAIRED.html  
**Backup:** /projects/sandbox/BACKUP/REFINED_18_05_HEALED_v87.html.backup.20261101_060819  

---

## Remediation Strategy

Given the 61,475-line monolithic architecture, inline patching will be performed:

1. **DEFECT-001 through DEFECT-005** (P0 Audio System) → Replace lines 33170-33360
2. **DEFECT-006 through DEFECT-007** (P0 Intent/Action) → Fix intent router + action validation
3. **DEFECT-008 through DEFECT-009** (P0 Navigation/State) → Implement state synchronization
4. **DEFECT-010** (P0 Completion Validation) → Add completion verification
5. **Remaining P1-P3** → Progressive fixes

---

## Repair 1: DEFECT-001-005 — Complete Audio System Replacement

**File:** REFINED_18_05_HEALED_v88_REPAIRED.html  
**Lines to replace:** 33170-33360 (191 lines)  
**Replacement:** /tmp/CALEB_SPEECH_FIX.js (extracted section)  
**Strategy:** 

### Step 1a: Extract old code
```bash
sed -n '33170,33360p' REFINED_18_05_HEALED_v87.html > /tmp/old_read_lesson.js
```

### Step 1b: Insert new code
Replace the problematic `onClick` handler with call to new controller:

**OLD CODE (broken):**
```javascript
React.createElement('button',{
    id:'caleb-read-btn-'+l.id,
    onClick:function(){
      var btn=document.getElementById('caleb-read-btn-'+l.id);
      // ... 191 lines of broken code
    }
}, '📖 Read Lesson Aloud')
```

**NEW CODE (fixed):**
```javascript
React.createElement('button',{
    id:'caleb-read-btn-'+l.id,
    onClick:function(){
      var btn=document.getElementById('caleb-read-btn-'+l.id);
      var container=document.getElementById('lesson-body-'+l.id);
      window._calebReadLesson(l.id, l.body, btn, container);
    }
}, '📖 Read Lesson Aloud')
```

### Benefits of new approach:

✅ Single authoritative controller (`_calebAudioController`)  
✅ No race conditions (single finalization callback)  
✅ Proper utterance lifecycle (onend, onerror, timeout)  
✅ Async voice initialization with wait  
✅ Tab visibility detection (pause on background)  
✅ Proper text segmentation (no lookbehind dependency)  
✅ Deterministic playback position tracking  
✅ Complete content guarantee  

---

## Repair 2: DEFECT-006 — Intent Collision

**Problem:** Pattern `'read it'` too general  
**Fix:** Add context-aware intent scoring  

**Location:** Line ~58769  

**OLD CODE:**
```javascript
{ id:'act:read-lesson', score:0, patterns:['read lesson','read it','read aloud','start reading','caleb read','read to me','listen to lesson','read out loud'] },
```

**NEW CODE:**
```javascript
{
  id:'act:read-lesson',
  score:0,
  patterns:['read lesson','read aloud','start reading','caleb read','listen to lesson','read out loud'],
  // Keep 'read it' for explicit lesson context only
  contextPatterns: {
    'lesson': ['read it', 'read to me'],
    'journal': [], // Exclude 'read it' from journal context
    'prayer': []   // Exclude from prayer context
  },
  scorer: function(text, context) {
    // Boost score if on lesson screen
    if (context === 'lesson') return 95;
    if (context === 'lessonlist') return 85;
    return 0; // Lower precedence on other screens
  }
},
```

**Integration:** Update intent router to pass context:
```javascript
var intent_context = window._rrnActiveSection || 'unknown';
var selectedAction = routeToAction(userInput, intent_context);
```

---

## Repair 3: DEFECT-007 — Action Precondition Validation

**Problem:** No validation before executing "read lesson"  
**Fix:** Add precondition checks  

**Location:** Line ~58903 (action execution)  

**OLD CODE:**
```javascript
if(rb){ rb.click(); window._calebSpeak('Starting lesson reading.'); }
else{ window._calebSpeak('Open a lesson first, then I can read it for you.'); }
```

**NEW CODE:**
```javascript
// Validate preconditions
function validateReadLessonAction(lessonId) {
  // Check 1: User authenticated
  if (!window._rrnUser || !window._rrnUser.id) {
    return { valid: false, error: 'You must be logged in' };
  }
  
  // Check 2: Lesson exists and loaded
  var lesson = window._rrnLessons && window._rrnLessons[lessonId];
  if (!lesson) {
    return { valid: false, error: 'Lesson not found' };
  }
  
  // Check 3: Lesson content available
  if (!lesson.body || lesson.body.trim().length === 0) {
    return { valid: false, error: 'Lesson content is empty' };
  }
  
  // Check 4: User has permission
  var minRole = lesson.minRole || 0;
  var userRole = window._rrnUser.role || 99;
  if (userRole > minRole) {
    return { valid: false, error: 'You don\'t have access to this lesson' };
  }
  
  // Check 5: Lesson not archived
  if (lesson.archived || lesson.deleted) {
    return { valid: false, error: 'This lesson is no longer available' };
  }
  
  return { valid: true };
}

// Execute with validation
var rb = document.getElementById('caleb-read-btn-' + lessonId);
var validation = validateReadLessonAction(lessonId);

if (validation.valid && rb) {
  rb.click();
  window._calebSpeak('Starting lesson reading.');
} else {
  window._calebSpeak(validation.error || 'I can\'t read that lesson right now.');
  console.warn('[CALEB] Read lesson validation failed:', validation);
}
```

---

## Repair 4: DEFECT-008 — Navigation State Synchronization

**Problem:** CALEB doesn't know which screen user is on  
**Fix:** Implement state observation pattern  

**Create new global state manager:**
```javascript
if (!window._rrnStateManager) {
  window._rrnStateManager = {
    activeSection: null,
    currentLesson: null,
    currentJournal: null,
    currentUser: null,
    isLoading: false,
    
    setState: function(updates) {
      Object.assign(this, updates);
      // Notify observers
      this._notifyObservers();
    },
    
    getState: function() {
      return {
        activeSection: this.activeSection,
        currentLesson: this.currentLesson,
        currentJournal: this.currentJournal,
        currentUser: this.currentUser,
        isLoading: this.isLoading
      };
    },
    
    _observers: [],
    subscribe: function(callback) {
      this._observers.push(callback);
    },
    _notifyObservers: function() {
      this._observers.forEach(cb => {
        try { cb(this.getState()); } catch(e) {}
      });
    }
  };
}

// Subscribe CALEB to state changes
window._rrnStateManager.subscribe(function(state) {
  window._calebAudioController.currentContext = state.activeSection;
  window._calebAudioController.currentLesson = state.currentLesson;
  
  // If navigated away, pause reading
  if (!state.currentLesson && window._calebAudioController.isReading) {
    window._calebAudioController.pauseReading();
  }
});

// Update state on navigation
function navigateTo(section, params) {
  window._rrnStateManager.setState({
    activeSection: section,
    isLoading: true
  });
  
  // After load complete:
  window._rrnStateManager.setState({
    isLoading: false,
    // ... other updates
  });
}
```

---

## Repair 5: DEFECT-009 — Async Navigation Await

**Problem:** Actions fire before content loads  
**Fix:** Implement navigation promises  

**Strategy:**
```javascript
function navigateToLessonAndRead(lessonId) {
  // Step 1: Start navigation
  window._rrnNavigateTo('lesson', { id: lessonId })
    .then(function() {
      // Step 2: Wait for lesson to load and render
      return window._rrnWaitForLessonReady(lessonId);
    })
    .then(function(lesson) {
      // Step 3: Only then start reading
      var btn = document.getElementById('caleb-read-btn-' + lessonId);
      var container = document.getElementById('lesson-body-' + lessonId);
      if (btn && container) {
        window._calebReadLesson(lessonId, lesson.body, btn, container);
      }
    })
    .catch(function(error) {
      window._calebSpeak('I couldn\'t open that lesson: ' + (error.message || 'unknown error'));
      console.error('[CALEB] Navigation error:', error);
    });
}
```

---

## Repair 6: DEFECT-010 — Completion Validation

**Problem:** Lessons marked complete without verification  
**Fix:** Add completion checkpoint  

**Strategy:**
```javascript
// In audio controller
markLessonComplete: function(lessonId) {
  // Verify ENTIRE lesson was played
  const verification = {
    startPosition: 0,
    endPosition: this.sentences.length - 1,
    actualPosition: this.readPosition - 1,
    sentenceCount: this.sentences.length,
    readCount: this.readPosition,
    percentComplete: (this.readPosition / this.sentences.length) * 100
  };
  
  // Only mark complete if we read >95% of content
  if (verification.percentComplete < 95) {
    return {
      success: false,
      reason: 'Lesson is ' + Math.round(verification.percentComplete) + '% complete'
    };
  }
  
  // Record with verification evidence
  window._rrnAPI.recordLessonCompletion({
    lessonId: lessonId,
    timestamp: new Date().toISOString(),
    verification: verification,
    audioDevice: this.getBestVoice().name
  });
  
  return { success: true };
}
```

---

## Repair 7: DEFECT-011 — Missing Content Handling

**Problem:** Silent failures when lesson body missing  
**Fix:** Add error reporting  

```javascript
startReading: function(lessonId, lessonBody, startPosition = 0, btn = null, container = null) {
  if (!lessonBody || !lessonBody.trim()) {
    window._calebSpeak('This lesson doesn\'t have any content loaded yet. Give me a moment.');
    console.error('[CALEB] Missing lesson body for', lessonId);
    
    // Try to reload
    this.attemptLessonReload(lessonId, (reloadedBody) => {
      if (reloadedBody) {
        this.startReading(lessonId, reloadedBody, startPosition, btn, container);
      } else {
        window._calebSpeak('I\'m having trouble loading this lesson. Please refresh the page.');
      }
    });
    
    if (btn) btn.textContent = '📖 Read Lesson Aloud';
    return;
  }
  // ... continue
}
```

---

## Repair 8: DEFECT-012 — Tab Visibility Detection

**Already fixed in new audio controller** (see `visibilityHandler` in CALEB_SPEECH_FIX.js)

---

## Repair 9: DEFECT-013 — Continue Button Logic

**Problem:** Continue button shows even when no previous position  
**Fix:** Only show if position > 0  

```javascript
if (window._calebReadIdx && window._calebReadIdx > 0) {
  cbtn.style.display = ''; // Show
} else {
  cbtn.style.display = 'none'; // Hide
}
```

---

## Repair 10: DEFECT-014 — Voice Caching

**Already fixed in new audio controller** (see `getBestVoice()` caching)

---

## Implementation Sequence

| Step | Defect | Priority | Effort | Est. Time |
|------|--------|----------|--------|-----------|
| 1 | DEFECT-001-005 | P0 | High | 30 min |
| 2 | DEFECT-006 | P0 | Medium | 20 min |
| 3 | DEFECT-007 | P0 | Medium | 20 min |
| 4 | DEFECT-008 | P0 | High | 40 min |
| 5 | DEFECT-009 | P0 | Medium | 25 min |
| 6 | DEFECT-010 | P0 | Medium | 20 min |
| 7 | DEFECT-011 | P1 | Low | 15 min |
| 8 | DEFECT-012 | P1 | Low | 10 min (done) |
| 9 | DEFECT-013 | P2 | Low | 5 min |
| 10 | DEFECT-014 | P3 | Low | 5 min |

**Total Estimated Time:** ~190 minutes (3+ hours)

---

## Verification & Testing

After each repair:

1. **Unit test** — Does the specific fix work?
2. **Integration test** — Does it work with adjacent code?
3. **Regression test** — Did we break anything else?

**Critical Test Scenarios:**

### Scenario A: Complete Lesson Reading
1. Open lesson
2. Click "Read Aloud"
3. Verify ALL content spoken in order
4. Verify completion recorded

### Scenario B: Interrupted Reading + Resume
1. Start reading lesson
2. Pause at 30% (button click or tab background)
3. Navigate away
4. Return to lesson
5. Click "Continue Reading"
6. Verify resume from saved position

### Scenario C: Intent Routing
1. On lesson screen: "read it" → triggers lesson reading ✓
2. On journal screen: "read it" → should NOT trigger lesson reading
3. Multi-step: "open step 5 and read it" → navigate then read

### Scenario D: Error Recovery
1. Lesson with missing content → error message shown
2. Voice not available → fallback to system default
3. Network error during speech → graceful degradation

### Scenario E: Tab Background
1. Start reading
2. Minimize browser window (tab hidden)
3. Verify reading pauses
4. Restore window
5. Verify reading resumes

---

## Commit & Deployment

Once all repairs verified:

1. **Backup new version:** `v88_REPAIRED.html`
2. **Create git commit:** Detailed message for each repair
3. **Deploy to Railway:** Test on staging first
4. **Monitor logs** for new errors
5. **Gather user feedback** from test group

---

## Known Limitations

- Browser voice availability varies by OS/browser
- Some browsers don't support lookbehind regex → fallback to naive split
- Speech synthesis quality depends on system TTS engine
- Long lessons (>1000 sentences) may require chunking
- Cannot play audio while device is muted

---

## Success Criteria

✅ CALEB reads complete lessons without stopping  
✅ Reading resumes from correct position  
✅ Navigation works reliably  
✅ Intent routing distinguishes contexts  
✅ Completion is validated  
✅ Errors are reported clearly  
✅ All regression tests pass  
✅ No new defects introduced  

---

**Ready to proceed with implementation?**
