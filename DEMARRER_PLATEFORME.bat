@echo off
chcp 65001 >nul
title IT.ACADEMY - Serveur Plateforme de Cours
color 0B

echo ================================================================
echo    🎓 IT.ACADEMY - PLATEFORME DE COURS & TRAVAUX PRATIQUES IT
echo ================================================================
echo.

:: Se positionner dans le dossier du script
cd /d "%~dp0"

:: Vérifier la présence des dossiers indispensables
if not exist "data" mkdir "data"
if not exist "uploads" mkdir "uploads"

:: Sécurité anti-perte : si database.json est manquant ou a une taille nulle (arrêt brutal)
set "RESTORE_NEEDED=0"
if not exist "data\database.json" set "RESTORE_NEEDED=1"
if exist "data\database.json" (
    for %%I in ("data\database.json") do (
        if %%~zI equ 0 set "RESTORE_NEEDED=1"
    )
)

if "%RESTORE_NEEDED%"=="1" (
    if exist "data\database.backup.json" (
        echo [INFO] Restauration automatique de database.json depuis la sauvegarde de securite...
        copy /Y "data\database.backup.json" "data\database.json" >nul
        echo [OK] Base de donnees restauree avec succes !
    ) else if exist "data\database.bak.json" (
        echo [INFO] Restauration automatique depuis le backup secondaire...
        copy /Y "data\database.bak.json" "data\database.json" >nul
        echo [OK] Base de donnees restauree avec succes !
    )
)

echo [OK] Verification effectuee : stockage persistant pret.
echo [OK] Lancement du serveur sur http://localhost:5000 ...
echo.
echo ================================================================
echo   Pour quitter en securite : fermez cette fenetre ou Ctrl+C
echo ================================================================
echo.

:: Ouvrir automatiquement la plateforme dans le navigateur
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

:: Demarrer le serveur Node.js
node backend/server.js

pause
