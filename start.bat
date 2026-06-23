@echo off
cd /d "%~dp0"
echo Starting Hartek SCADA Dashboard...
echo.
:: Launch Flask server in a new window
start "Hartek SCADA" cmd /c "python backend\app.py & pause"
echo.
echo Server started at http://localhost:5000
echo Close the server window or run stop.bat to shut down.
