@echo off
echo =============================================
echo   NEXTICK2 — Git Auto Sync
echo   Remote changes aayenge + aapke changes jayenge
echo =============================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0autosync.ps1"
pause
