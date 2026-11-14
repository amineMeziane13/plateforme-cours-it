@echo off
chcp 65001 >nul
title IT.ACADEMY - Test de Non-Perte de Données après Relancement (WAL)
color 0B

echo ================================================================
echo    💾 IT.ACADEMY - TEST AUTOMATISÉ DE DURABILITÉ & RELANCEMENT
echo         (Moteur Relationnel SQLite + Write-Ahead Logging WAL)
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/2] Lancement du test de persistance avec crash/relance simulee...
echo.
node test-relaunch-persistence.js

set "TEST_RESULT=%ERRORLEVEL%"
echo.
echo ================================================================
if %TEST_RESULT% equ 0 (
    color 0A
    echo   [SUCCÈS TOTAL] TOUTES LES DONNÉES SONT PARFAITEMENT CONSERVÉES !
    echo   Aucune perte de données n'est constatée après extinction et relance.
) else (
    color 0C
    echo   [ATTENTION] Le test a détecté une anomalie de persistance.
)
echo ================================================================
echo.
pause
