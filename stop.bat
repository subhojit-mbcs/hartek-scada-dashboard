@echo off
title Stopping Hartek SCADA Dashboard
echo Stopping Hartek SCADA Dashboard...
echo.
powershell -Command ^
  "$procs = Get-CimInstance Win32_Process -Filter \"Name='python.exe' AND CommandLine LIKE '%%app.py%%'\";" ^
  "if ($procs) { $procs | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Output \"Killed PID: $($_.ProcessId)\" }; Write-Output 'Server stopped.' }" ^
  "else { Write-Output 'No server process found.'; exit 1 }"
if errorlevel 1 (
    echo.
    echo No running server found.
) else (
    echo.
    echo Server stopped successfully.
)
echo.
pause
