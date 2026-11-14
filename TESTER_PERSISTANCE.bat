@echo off
chcp 65001 >nul
title IT.ACADEMY - Test de Persistance Physique de la Base de Données
color 0A

echo ================================================================
echo    🧪 IT.ACADEMY - TEST COMPLET DE PERSISTANCE DES DONNÉES
echo ================================================================
echo.
echo Ce test va exécuter un cycle complet de :
echo  1. Création d'une catégorie et vérification physique sur disque
echo  2. Modification de catégorie et vérification du fichier database.json
echo  3. Dépôt / Upload d'un fichier réel et vérification dans uploads/
echo  4. Modification des métadonnées du fichier (téléchargeable oui/non)
echo  5. Nettoyage et vérification de la suppression sur le disque
echo.
echo Exécution en cours, veuillez patienter...
echo.

cd /d "%~dp0"
node test-e2e-persistence.js

echo.
echo ================================================================
pause
