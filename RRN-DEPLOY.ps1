# ============================================================
# RRN MASTER DEPLOY SCRIPT
# Covers everything built/fixed in this session
# Run from: C:\Users\broch\Downloads\
# Repo: ChuckB4/rrn-website (branch: main)
# ============================================================

# ---------- CONFIG ----------
$ZipName    = "RRN-MASTER-DEPLOY.zip"
$ExtractDir = "C:\Users\broch\Downloads\RRN-MASTER-DEPLOY"
$RepoUrl    = "https://github.com/ChuckB4/rrn-website"
$Branch     = "main"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  RRN MASTER DEPLOY — Full Session Package" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# ---------- STEP 1: Verify zip exists ----------
$ZipPath = "C:\Users\broch\Downloads\$ZipName"
if (-not (Test-Path $ZipPath)) {
    Write-Host "ERROR: $ZipName not found in Downloads." -ForegroundColor Red
    Write-Host "Download it from Claude first, then re-run this script." -ForegroundColor Yellow
    exit 1
}
Write-Host "[1/6] ZIP found: $ZipPath" -ForegroundColor Green

# ---------- STEP 2: Extract ----------
if (Test-Path $ExtractDir) {
    Remove-Item $ExtractDir -Recurse -Force
}
Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force
Write-Host "[2/6] Extracted to: $ExtractDir" -ForegroundColor Green

# ---------- STEP 3: Inventory what we have ----------
Write-Host ""
Write-Host "[3/6] FILES TO DEPLOY:" -ForegroundColor Cyan

$RootFiles = @(
    "index.html",           # Radio updated — 4 new songs added
    "events.html",          # New events page — Tiffany Howard June 25 loaded
    "40DaysToFreedom.html", # New 40-day challenge page
    "journal.html",         # Updated — Steps 8/9/10 added
    "scripture-search.html",# Fixed — real site nav/footer
    "tools.html",           # Fixed — real site nav/footer
    "recovery-tracker.html" # Fixed — real site nav/footer
)

Write-Host ""
Write-Host "  ROOT FILES (upload to repo root):" -ForegroundColor Yellow
foreach ($f in $RootFiles) {
    $fp = "$ExtractDir\$f"
    if (Test-Path $fp) {
        $sz = [math]::Round((Get-Item $fp).Length / 1KB)
        Write-Host "    OK  $f  ($sz KB)" -ForegroundColor Green
    } else {
        Write-Host "    MISSING: $f" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  IMAGES/ FOLDER (upload to images/ subfolder — CREATE if missing):" -ForegroundColor Yellow
$ImgFiles = Get-ChildItem "$ExtractDir\images\" -File -ErrorAction SilentlyContinue
foreach ($f in $ImgFiles) {
    $sz = [math]::Round($f.Length / 1KB)
    Write-Host "    OK  images\$($f.Name)  ($sz KB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "  JOURNAL/ FOLDER (upload to journal/ subfolder — CREATE if missing):" -ForegroundColor Yellow
$JournalFiles = Get-ChildItem "$ExtractDir\journal\" -File -ErrorAction SilentlyContinue
Write-Host "    OK  $($JournalFiles.Count) journal article files" -ForegroundColor Green
foreach ($f in $JournalFiles) {
    Write-Host "        $($f.Name)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "  LESSONS/ FOLDER (upload to lessons/ subfolder):" -ForegroundColor Yellow
$LessonFiles = Get-ChildItem "$ExtractDir\lessons\" -File -ErrorAction SilentlyContinue
Write-Host "    OK  $($LessonFiles.Count) lesson files (teacher sections stripped, h2 fixed)" -ForegroundColor Green
foreach ($f in $LessonFiles) {
    Write-Host "        $($f.Name)" -ForegroundColor Gray
}

# ---------- STEP 4: Open GitHub in Edge for uploading ----------
Write-Host ""
Write-Host "[4/6] OPENING GITHUB UPLOADER IN EDGE..." -ForegroundColor Cyan
Write-Host "      You will need to upload in batches of 5 files." -ForegroundColor Yellow
Write-Host "      See BATCH ORDER below." -ForegroundColor Yellow

Start-Sleep -Seconds 2
Start-Process "msedge.exe" "https://github.com/ChuckB4/rrn-website/upload/main"

# ---------- STEP 5: Batch order ----------
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  GITHUB UPLOAD BATCH ORDER (5 files per drag)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  BATCH 1 — Root (5 files, drag to repo ROOT):" -ForegroundColor Yellow
Write-Host "    index.html" -ForegroundColor White
Write-Host "    events.html" -ForegroundColor White
Write-Host "    40DaysToFreedom.html" -ForegroundColor White
Write-Host "    journal.html" -ForegroundColor White
Write-Host "    scripture-search.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 2 — Root continued (2 files, drag to repo ROOT):" -ForegroundColor Yellow
Write-Host "    tools.html" -ForegroundColor White
Write-Host "    recovery-tracker.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 3 — Images (1 file — create images/ folder first):" -ForegroundColor Yellow
Write-Host "    images/tiffany-testimony-night.jpg" -ForegroundColor White
Write-Host "    ^ Go to: https://github.com/ChuckB4/rrn-website/upload/main/images" -ForegroundColor Gray
Write-Host ""
Write-Host "  BATCH 4 — Journal articles, part 1 of 5 (5 files → journal/ folder):" -ForegroundColor Yellow
Write-Host "    ^ Go to: https://github.com/ChuckB4/rrn-website/upload/main/journal" -ForegroundColor Gray
Write-Host "    why-you-cannot-fix-yourself.html" -ForegroundColor White
Write-Host "    powerless-is-where-wisdom-begins.html" -ForegroundColor White
Write-Host "    the-god-who-is-actually-able.html" -ForegroundColor White
Write-Host "    not-my-will-but-thine.html" -ForegroundColor White
Write-Host "    search-me-o-god.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 5 — Journal articles, part 2 of 5:" -ForegroundColor Yellow
Write-Host "    confess-and-be-healed.html" -ForegroundColor White
Write-Host "    create-in-me-a-clean-heart.html" -ForegroundColor White
Write-Host "    humble-yourselves.html" -ForegroundColor White
Write-Host "    the-list-and-the-willing-heart.html" -ForegroundColor White
Write-Host "    go-thy-way-and-be-reconciled.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 6 — Journal articles, part 3 of 5:" -ForegroundColor Yellow
Write-Host "    let-a-man-examine-himself.html" -ForegroundColor White
Write-Host "    draw-nigh-and-he-draws-nigh.html" -ForegroundColor White
Write-Host "    he-will-finish-what-he-started.html" -ForegroundColor White
Write-Host "    hope-anchored-my-soul.html" -ForegroundColor White
Write-Host "    your-recovery-start-date.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 7 — Journal articles, part 4 of 5:" -ForegroundColor Yellow
Write-Host "    when-the-night-is-hardest.html" -ForegroundColor White
Write-Host "    why-you-need-an-accountability-partner.html" -ForegroundColor White
Write-Host "    when-you-stumble.html" -ForegroundColor White
Write-Host "    a-verse-for-the-moment-it-hits.html" -ForegroundColor White
Write-Host "    you-are-not-too-far-gone.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 8 — Journal articles, part 5 of 5:" -ForegroundColor Yellow
Write-Host "    burned-bridges-and-new-mornings.html" -ForegroundColor White
Write-Host "    pure-and-undefiled.html" -ForegroundColor White
Write-Host "    free-indeed.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 9 — Lessons, part 1 of 3 (→ lessons/ folder):" -ForegroundColor Yellow
Write-Host "    ^ Go to: https://github.com/ChuckB4/rrn-website/upload/main/lessons" -ForegroundColor Gray
Write-Host "    preface-how-to-use-this-program-structure-journal-and-daily-reading.html" -ForegroundColor White
Write-Host "    preface-why-this-program-exists-and-why-you-cannot-fix-yourself.html" -ForegroundColor White
Write-Host "    step-1-we-admitted-we-were-powerless-and-why-that-is-not-weakness-but-.html" -ForegroundColor White
Write-Host "    step-2-came-to-believe-why-the-god-you-believe-in-must-be-real-specifi.html" -ForegroundColor White
Write-Host "    step-3-not-my-will-but-thine-what-it-means-to-actually-make-the-decisi.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 10 — Lessons, part 2 of 3:" -ForegroundColor Yellow
Write-Host "    step-4-search-me-o-god-the-searching-and-fearless-moral-inventory-and-.html" -ForegroundColor White
Write-Host "    step-5-confess-your-faults-one-to-another-admitted-to-god-to-ourselves.html" -ForegroundColor White
Write-Host "    step-6-create-in-me-a-clean-heart-o-god-were-entirely-ready-and-what-t.html" -ForegroundColor White
Write-Host "    step-7-humble-yourselves-in-the-sight-of-the-lord-and-he-shall-lift-yo.html" -ForegroundColor White
Write-Host "    step-8-if-thou-bring-thy-gift-to-the-altar-the-list-of-all-persons-har.html" -ForegroundColor White
Write-Host ""
Write-Host "  BATCH 11 — Lessons, part 3 of 3:" -ForegroundColor Yellow
Write-Host "    step-9-go-thy-way-and-be-reconciled-the-direct-amends-and-how-to-make-.html" -ForegroundColor White
Write-Host "    step-10-let-a-man-examine-himself-continued-personal-inventory-and-the.html" -ForegroundColor White
Write-Host "    step-11-draw-nigh-to-god-sought-through-prayer-and-meditation-and-what.html" -ForegroundColor White
Write-Host "    step-12-go-ye-into-all-the-world-self-examination-first-proving-your-f.html" -ForegroundColor White
Write-Host ""

# ---------- STEP 6: Open Explorer to the extracted folder ----------
Write-Host "[5/6] Opening extracted folder in Explorer..." -ForegroundColor Cyan
Start-Process "explorer.exe" $ExtractDir

Write-Host ""
Write-Host "[6/6] QUICK-SORT by folder for easy drag-and-drop:" -ForegroundColor Cyan
Write-Host "      Root files are in:   $ExtractDir\" -ForegroundColor White
Write-Host "      Journal articles in: $ExtractDir\journal\" -ForegroundColor White
Write-Host "      Lesson files in:     $ExtractDir\lessons\" -ForegroundColor White
Write-Host "      Tiffany flyer in:    $ExtractDir\images\" -ForegroundColor White
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  WHAT CHANGED — FULL SUMMARY" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  index.html          — 4 new songs added to Refined Radio:" -ForegroundColor White
Write-Host "                        Spirit Don't Let Me Check My Messages" -ForegroundColor Gray
Write-Host "                        I Tried to Run, But the Choir Caught Me" -ForegroundColor Gray
Write-Host "                        Devil Lost My Address" -ForegroundColor Gray
Write-Host "                        Your Way Is Better" -ForegroundColor Gray
Write-Host ""
Write-Host "  events.html         — NEW: Events/Testimony Night page" -ForegroundColor White
Write-Host "                        Tiffany Howard June 25 loaded as featured event" -ForegroundColor Gray
Write-Host "                        Community submit form (goes to Railway /api/intake)" -ForegroundColor Gray
Write-Host "                        Google/Outlook/Apple calendar add buttons" -ForegroundColor Gray
Write-Host "                        Facebook share on every event" -ForegroundColor Gray
Write-Host ""
Write-Host "  40DaysToFreedom.html — NEW: 40-day scripture challenge" -ForegroundColor White
Write-Host "                        Countdown to July 4, 2026 launch" -ForegroundColor Gray
Write-Host "                        Daily tracker, journal, badges, certificate" -ForegroundColor Gray
Write-Host "                        Health/medical/terms disclaimers included" -ForegroundColor Gray
Write-Host ""
Write-Host "  images/tiffany-testimony-night.jpg — Testimony Night flyer" -ForegroundColor White
Write-Host ""
Write-Host "  journal.html        — Steps 8/9/10 articles added to index" -ForegroundColor White
Write-Host "  journal/*.html      — 23 full articles (all 12 steps + encouragement)" -ForegroundColor White
Write-Host ""
Write-Host "  scripture-search.html — Fixed: real site nav/footer" -ForegroundColor White
Write-Host "  tools.html            — Fixed: real site nav/footer" -ForegroundColor White
Write-Host "  recovery-tracker.html — Fixed: real site nav/footer" -ForegroundColor White
Write-Host ""
Write-Host "  lessons/*.html      — All 14: teacher notes stripped, h2 fixed" -ForegroundColor White
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  Script complete. Follow batch order above." -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
