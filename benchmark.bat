@echo off
setlocal EnableDelayedExpansion
title Industrial Civilization Survival - benchmark session

rem  Double-click this, or run it with an argument:
rem
rem     benchmark.bat          a real session, elevating first if it has to
rem     benchmark.bat dry      check the wiring, touch nothing, no elevation
rem     benchmark.bat spike    profile only ticks over 100 ms
rem
rem  The shader state names the run, so there is nothing to remember and nothing
rem  to mislabel: run it once with shaders off and once with them on, and the
rem  two land in separate folders by themselves.
rem
rem  WHY THIS ELEVATES. PresentMon cannot open its trace session without it, and
rem  the failure is an empty CSV discovered after the run rather than an error
rem  during it. The dry run skips elevation because it captures nothing.

cd /d "%~dp0"

set "MODE=%~1"
set "EXTRA="
if /i "%MODE%"=="dry"   set "EXTRA=-DryRun"
if /i "%MODE%"=="spike" set "EXTRA=-SpikeProfile"

rem -- the date, from PowerShell rather than %DATE% -----------------------------
rem  %DATE% is locale-formatted and differs between machines and users; the
rem  capture folder is part of a path that has to be stable.
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"`) do set "TODAY=%%i"

rem -- elevate, unless this is a dry run ---------------------------------------
net session >nul 2>&1
if errorlevel 1 (
    if /i "%MODE%"=="dry" (
        echo.
        echo   Not elevated. Fine for a dry run - it captures nothing.
        echo.
    ) else (
        echo.
        echo   Not running as Administrator. PresentMon needs it, so this will
        echo   ask Windows for permission and reopen in a new window.
        echo.
        powershell -NoProfile -Command "Start-Process -Verb RunAs -FilePath '%~f0' -ArgumentList '%MODE%'"
        exit /b
    )
)

echo.
echo   date    %TODAY%
echo   zone    A
if defined EXTRA echo   mode    %EXTRA%
echo.

pwsh -NoProfile -File "scripts\benchmark\run-session.ps1" -Zone A -Date %TODAY% %EXTRA%
set "RC=%ERRORLEVEL%"

echo.
if not "%RC%"=="0" (
    echo   The session did not complete - exit code %RC%. Nothing above is a result.
) else (
    echo   Done. The report is under benchmarks\captures\%TODAY%\
)
echo.
pause
