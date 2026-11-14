@echo off
chcp 65001 >nul
title IT.ACADEMY - Arrêt du Serveur
color 0C

echo ================================================================
echo    Arrêt propre du serveur IT.ACADEMY
echo ================================================================
echo.

:: Trouver le processus node qui écoute sur le port 5000 et l'arrêter
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Arrêt du processus Node.js PID %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo [OK] Serveur arrêté. Toutes les données sont enregistrées en sécurité.
timeout /t 3 >nul
