
# =============================================================
# NEXTICK2 — Git Auto Sync Script
# Dono taraf: Pull from remote + Push local changes
# =============================================================

$projectDir = "e:\Antigravitiy\Nextick2"
$branch = "main"
$syncIntervalSeconds = 30
$debounceSeconds = 5  # local file change hone ke baad wait karke push karega

Set-Location $projectDir

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  NEXTICK2 — Auto Git Sync Started" -ForegroundColor Cyan
Write-Host "  Pull interval : every $syncIntervalSeconds seconds" -ForegroundColor Yellow
Write-Host "  Push debounce : $debounceSeconds sec after file change" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$lastPushTime = [DateTime]::MinValue
$pendingPush = $false
$lastChangeTime = [DateTime]::MinValue

# File watcher setup — src folder watch karega
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "$projectDir\src"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.Filter = "*.*"

$onChange = {
    $global:pendingPush = $true
    $global:lastChangeTime = [DateTime]::UtcNow
}

Register-ObjectEvent $watcher "Changed" -Action $onChange | Out-Null
Register-ObjectEvent $watcher "Created" -Action $onChange | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $onChange | Out-Null

$lastPullTime = [DateTime]::MinValue

function Do-Pull {
    $status = git status --porcelain 2>&1
    $hasUncommitted = ($status | Where-Object { $_ -ne "" }).Count -gt 0

    # Stash if needed before pull
    if ($hasUncommitted) {
        git stash push -m "autosync-stash-$(Get-Date -Format 'HHmmss')" --include-untracked 2>&1 | Out-Null
        $stashed = $true
    } else {
        $stashed = $false
    }

    $pullResult = git pull origin $branch --rebase 2>&1
    $pullOutput = $pullResult -join " "

    if ($pullOutput -match "Already up to date") {
        # No changes from remote
    } elseif ($pullOutput -match "error|conflict|CONFLICT") {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⚠️  Pull conflict! Manual resolution needed." -ForegroundColor Red
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⬇️  Pulled new changes from remote!" -ForegroundColor Green
    }

    if ($stashed) {
        git stash pop 2>&1 | Out-Null
    }
}

function Do-Push {
    $status = git status --porcelain 2>&1
    $hasChanges = ($status | Where-Object { $_ -ne "" }).Count -gt 0

    if (-not $hasChanges) {
        return
    }

    git add -A 2>&1 | Out-Null
    $commitMsg = "autosync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $commitMsg 2>&1 | Out-Null
    $pushResult = git push origin $branch 2>&1
    $pushOutput = $pushResult -join " "

    if ($pushOutput -match "error|rejected") {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ❌ Push failed! Trying pull-rebase first..." -ForegroundColor Red
        git pull origin $branch --rebase 2>&1 | Out-Null
        git push origin $branch 2>&1 | Out-Null
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⬆️  Pushed after rebase." -ForegroundColor Yellow
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⬆️  Pushed local changes → GitHub" -ForegroundColor Green
    }

    $global:pendingPush = $false
    $global:lastPushTime = [DateTime]::UtcNow
}

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Watching for changes... Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

while ($true) {
    $now = [DateTime]::UtcNow

    # Pull from remote every $syncIntervalSeconds
    if (($now - $lastPullTime).TotalSeconds -ge $syncIntervalSeconds) {
        Do-Pull
        $lastPullTime = $now
    }

    # Push if there are pending local changes and debounce time passed
    if ($pendingPush -and ($now - $lastChangeTime).TotalSeconds -ge $debounceSeconds) {
        Do-Push
    }

    Start-Sleep -Seconds 5
}
