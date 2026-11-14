@echo off
chcp 65001 >nul
title IT.ACADEMY - Serveur Plateforme de Cours
color 0B

echo ================================================================
echo    🎓 IT.ACADEMY - PLATEFORME DE COURS & TRAVAUX PRATIQUES IT
echo ================================================================
echo.

:: Se positionner dans le dossier du projet
cd /d "%~dp0"

:: Vérifier la présence des dossiers critiques
if not exist "data" mkdir "data"
if not exist "uploads" mkdir "uploads"

:: Sécurité : si database.json est absent ou vide mais qu'un backup existe, le restaurer
if not exist "data\database.json" (
    if exist "data\database.backup.json" (
        echo [INFO] Restauration automatique depuis la sauvegarde persistante...
        copy /Y "data\database.backup.json" "data\database.json" >nul
    )
)

echo [OK] Répertoires et base de données vérifiés.
echo [OK] Démarrage du serveur sur http://localhost:5000...
echo.
echo ================================================================
echo   Pour quitter proprement : fermez cette fenêtre ou appuyez sur Ctrl+C
echo ================================================================
echo.

:: Ouvrir automatiquement le navigateur après 2 secondes
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

:: Démarrer le serveur Node.js
node backend/server.js

pause
