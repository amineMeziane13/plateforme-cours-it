@echo off
chcp 65001 >nul
title IT.ACADEMY - Test de Sécurité de la Session Administrateur
color 0A

echo ================================================================
echo    🔒 IT.ACADEMY - TEST AUTOMATISÉ D'ÉTANCHÉITÉ ADMIN & SÉCURITÉ
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Vérification du serveur en cours d'exécution...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }"
if %ERRORLEVEL% equ 0 (
    echo [OK] Serveur déjà actif sur http://localhost:5000
    goto RUN_TESTS
)

echo [INFO] Serveur non détecté, démarrage d'une instance temporaire pour les tests...
start /b "" node backend/server.js >nul 2>&1
timeout /t 3 /nobreak >nul

:RUN_TESTS
echo.
echo [2/3] Exécution de la suite de tests de sécurité et d'étanchéité...
echo.
node test-admin-security.js

set "TEST_RESULT=%ERRORLEVEL%"
echo.
echo ================================================================
if %TEST_RESULT% equ 0 (
    color 0A
    echo   [SUCCÈS] TOUS LES TESTS DE SÉCURITÉ ONT RÉUSSI AVEC SUCCÈS !
    echo   Le lien partagé garantit un accès strictement étudiant.
) else (
    color 0C
    echo   [ATTENTION] Certains tests de sécurité ont échoué.
)
echo ================================================================
echo.
pause
