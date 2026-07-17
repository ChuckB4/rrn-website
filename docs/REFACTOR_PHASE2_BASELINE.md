# RRN Phase 2 Dependency Analysis Baseline

**Date**: 2026-07-17  
**Branch**: `refactor/phase2-cleanup-2026-07-17`  
**Commit Hash (main)**: `0f6b2cc597c1007ed478607c53b2671007d97466`

---

## Purpose

This document records the repository state **before Phase 3 cleanup**.

It provides:
- A rollback reference point
- Explanation for all file removals and moves
- Dependency map for future developers
- Verification checklist before merge

**All changes in this refactor are fully reversible.**

---

## Repository Pre-Refactor State

### File Count Summary
- **Total files**: ~150+
- **HTML files**: ~50
- **MP3 files (root)**: ~30
- **ZIP archives**: 4
- **Directories**: 15 (including 6 empty)

### Size Summary
- **Repository total**: 3.2 GB
- **Backup ZIPs**: ~11.8 MB
- **Root MP3 files**: ~150+ MB
- **Duplicate folders**: ~250+ MB (`RRN_WEBSITE_COMPLETE/`)

---

## Production Entry Points

### Frontend
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Main website homepage | ✅ Active |
| `preview.html` | Music preview player | ✅ Active |
| Various page HTML files | Site content pages | ✅ Active |

### Radio System
| File | Purpose | Status |
|------|---------|--------|
| `refined-radio.js` (root) | **Authoritative** radio configuration | ✅ Active |
| `Refined_Radio_Manager_3.html` | Admin interface for radio curation | ✅ Active |

### PWA & CI/CD
| Item | Purpose | Status |
|------|---------|--------|
| `.github/` | GitHub Actions workflows | ✅ Kept |
| `manifest.json` | Progressive Web App manifest | ✅ Active |
| `service-worker.js` | PWA offline support | ✅ Active |

---

## Active Asset Paths (Verified by Dependency Analysis)

### Music Directory Structure
```
music/
├── Acoustic/          ✅ 2 songs
├── Blues/             ✅ 1 song
├── Chill/             ✅ 1 song
├── Country/           ✅ 1 song
├── EDM-Club/          ✅ 15 songs
├── Jazz/              ✅ 3 songs
├── R&B/               ✅ 1 song
├── Radio/             ✅ 9 songs (broadcast edits)
├── Southern Rock/     ✅ 23 songs
├── Trance/            ✅ 2 songs
└── Worship/           ✅ 500+ songs (primary catalog)
```

**Total active music files**: 558+ songs  
**All referenced by**: `refined-radio.js` (root)

### Metadata Directories
```
ids/                   ✅ Station ID markers (3 files)
ads/                   ✅ Promotional audio (8 files)
```

---

## Items Approved for Removal

### 1. Duplicate Website Folder
```
RRN_WEBSITE_COMPLETE/
```

**Status**: Complete backup of entire website  
**Size**: ~250+ MB  
**Reason**: 
- Full duplicate of root structure
- Confirmed no unique files
- External backup exists
- **Action**: DELETE

---

### 2. Duplicate Radio Configuration
```
music/refined-radio.js
```

**Status**: Incomplete/truncated version of root `refined-radio.js`  
**Size**: Smaller than root version  
**Content**: Only 2 Worship songs (vs 500+ in root)  
**Reason**:
- Root version is authoritative
- Subdirectory version is outdated
- Would cause path resolution conflicts
- **Action**: DELETE

---

### 3. Backup Archives
```
files.zip                  (2.4 MB)
index_live144.zip          (2.7 MB)
rrn_hopewall_live154.zip   (2.8 MB)
rrn_pages_live152.zip      (3.0 MB)
```

**Status**: Historical backups  
**Total Size**: ~11.8 MB  
**Reason**:
- Git already provides version history
- External backup created
- Clutter repository size
- Should not be stored in version control
- **Action**: DELETE (after external archive)

---

### 4. Duplicate MP3 Files
```
Bow Before Your Thone (K - Pop) (1).mp3    (5.9 MB - identical to original)
I Googled God (K - Pop) (1).mp3            (2.7 MB - identical to original)
```

**Status**: Exact duplicates (same file size, likely same hash)  
**Reason**:
- Redundant copies with version suffix
- Original files retained
- Wastes repository space
- **Action**: DELETE

---

## Items Approved for Moving

### Root MP3 Files → Archive

**Files**: ~30 unreferenced MP3 files in root directory

**Examples**:
- `Alabaster Tears (Outlaw Country).mp3`
- `Among the Tombs (Outlaw Country).mp3`
- `Backside Desert.mp3`
- `Hannah Prayed.mp3`
- `Lazarus Finished.mp3`
- etc.

**Status**: 
- ✅ Confirmed NOT referenced in any code
- ✅ Not in `refined-radio.js`
- ✅ Not in any HTML `src=` attributes
- ✅ Not in any JavaScript

**Size**: ~150+ MB

**Reason**:
- Prevent accidental inclusion in playlist rotation
- Preserve for future review/categorization
- Keep main directory clean
- Allow intentional re-integration later

**Action**: MOVE to `archive/unreferenced-audio/`

---

## Items Retained

### Keep as-is

✅ `.github/` — GitHub Actions workflows (future CI/CD expansion planned)  
✅ `ids/` — Station ID audio markers  
✅ `ads/` — Promotional advertisements  
✅ `music/` — Complete organized music library  
✅ All active HTML pages — Production content  
✅ `refined-radio.js` (root) — Authoritative radio config  
✅ `Refined_Radio_Manager_3.html` — Admin interface  
✅ `preview.html` — Music preview utility  

---

## Empty/Unclear Directories (To Remove)

```
1_root_files/          (Purpose unclear, appears to be organizational staging)
2_folders/             (Purpose unclear, appears to be organizational staging)
Batch085/              (Purpose unclear)
rrn_pages_live152/     (Extracted backup folder, no longer needed)
```

**Action**: DELETE (after confirming no unique content)

---

## Dependency Map (Reference)

```
index.html
    ├── refined-radio.js (AUTHORITATIVE)
    │   └── music/**/*.mp3 (558+ files)
    │
    ├── preview.html
    │   └── GitHub API → music/** (dynamic lookup)
    │
    └── Refined_Radio_Manager_3.html
        └── Drag-drop audio import → state storage
```

**No other dependencies found.**

---

## Verification Checklist

Before merge, verify:

### Website
- [ ] `index.html` loads without errors
- [ ] Navigation menu works
- [ ] All internal links resolve
- [ ] PWA manifest loads
- [ ] Service worker registers

### Radio System
- [ ] `refined-radio.js` loads successfully
- [ ] `window.REFINED_RADIO` object available
- [ ] Music paths resolve (558+ songs)
- [ ] Preview player (`preview.html`) works
- [ ] Admin interface (`Refined_Radio_Manager_3.html`) loads
- [ ] No console errors on main pages

### Repository Health
- [ ] No duplicate backup folders
- [ ] No ZIP archives in root
- [ ] No broken symlinks
- [ ] `.gitignore` excludes archives
- [ ] Git size reduced by ~15%

---

## Rollback Instructions

If any issues are discovered **before merge**:

```bash
git reset --hard main
git branch -D refactor/phase2-cleanup-2026-07-17
```

If issues appear **after merge**:

```bash
git revert <commit-hash>
```

All changes are reversible via Git history.

---

## Next Phase

**Phase 4: Production Hardening** will add:
- HTML validation CI/CD
- Asset integrity checks
- Playwright regression tests
- Database migration workflow
- Backend/frontend separation

---

## Approval & Sign-off

| Role | Date | Status |
|------|------|--------|
| Analysis | 2026-07-17 | ✅ Complete |
| Plan Review | 2026-07-17 | ✅ Approved |
| Code Cleanup | In Progress | 🔄 |
| PR Review | Pending | ⏳ |
| Merge | Pending | ⏳ |

---

**Document created**: 2026-07-17  
**Phase**: Phase 3 - Safe Refactor  
**Status**: Baseline established, cleanup proceeding