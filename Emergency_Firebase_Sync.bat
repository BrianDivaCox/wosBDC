@echo off
echo ========================================================
echo       WOS DASHBOARD - EMERGENCY FIREBASE SYNC
echo ========================================================
echo.
echo Bypassing Google Quotas and fetching live data...
echo.

node manual_sync.cjs

echo.
echo ========================================================
echo Sync process complete!
echo ========================================================
pause
