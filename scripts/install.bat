@echo off
title TaskMate Manager v1.0
color 0A

:MENU
cls

echo.
echo ============================================================
echo.
echo                 TASKMATE MANAGER v1.0
echo.
echo ============================================================
echo.
echo    [1] Fresh Install
echo    [2] Start Development
echo    [3] Stop Development
echo    [4] Restart Infrastructure
echo    [5] Open PgAdmin
echo    [6] Open n8n
echo    [7] Open MinIO
echo    [8] Check Environment
echo    [9] Exit
echo.
echo ============================================================

set /p choice=Choose Menu :

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto START
if "%choice%"=="3" goto STOP
if "%choice%"=="4" goto RESTART
if "%choice%"=="5" goto PGADMIN
if "%choice%"=="6" goto N8N
if "%choice%"=="7" goto MINIO
if "%choice%"=="8" goto CHECK
if "%choice%"=="9" exit

goto MENU

:: ==========================================================
:: CHECK ENVIRONMENT
:: ==========================================================

:CHECK

cls

echo.
echo Checking Environment...
echo.

where docker >nul 2>nul

if errorlevel 1 (
    echo [X] Docker NOT Installed
) else (
    echo [OK] Docker Installed
)

where git >nul 2>nul

if errorlevel 1 (
    echo [X] Git NOT Installed
) else (
    echo [OK] Git Installed
)

where node >nul 2>nul

if errorlevel 1 (
    echo [X] NodeJS NOT Installed
) else (
    echo [OK] NodeJS Installed
)

where npm >nul 2>nul

if errorlevel 1 (
    echo [X] NPM NOT Installed
) else (
    echo [OK] NPM Installed
)

echo.

pause

goto MENU

:: ==========================================================
:: INSTALL
:: ==========================================================

:INSTALL

cls

echo.
echo Starting Infrastructure...
echo.

cd /d "%~dp0..\infrastructure"

docker compose up -d

echo.
echo ===========================================
echo.
echo Infrastructure Ready
echo.
echo PgAdmin : http://localhost:5050
echo n8n     : http://localhost:5678
echo MinIO   : http://localhost:9001
echo.
echo ===========================================

pause

goto MENU

:: ==========================================================
:: START
:: ==========================================================

:START

cd /d "%~dp0..\infrastructure"

docker compose up -d

pause

goto MENU

:: ==========================================================
:: STOP
:: ==========================================================

:STOP

cd /d "%~dp0..\infrastructure"

docker compose down

pause

goto MENU

:: ==========================================================
:: RESTART
:: ==========================================================

:RESTART

cd /d "%~dp0..\infrastructure"

docker compose restart

pause

goto MENU

:: ==========================================================
:: OPEN PGADMIN
:: ==========================================================

:PGADMIN

start http://localhost:5050

goto MENU

:: ==========================================================
:: OPEN N8N
:: ==========================================================

:N8N

start http://localhost:5678

goto MENU

:: ==========================================================
:: OPEN MINIO
:: ==========================================================

:MINIO

start http://localhost:9001

goto MENU