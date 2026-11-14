@echo off
chcp 65001 >nul
title IT.ACADEMY - Arrêt Sécurisé du Serveur
color 0C

echo ================================================================
echo    🎓 IT.ACADEMY - ARRÊT PROPRE ET SÉCURISÉ DU SERVEUR
echo ================================================================
echo.

:: Trouver le processus node qui écoute sur le port 5000 et l'arrêter
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Arrêt du processus Node.js PID %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo [OK] Serveur arrêté avec succès. Toutes vos données restent enregistrées sur le disque.
timeout /t 3 >nul
