# ==============================================================================
# GUIDE OFFICIEL : CONFIGURATION DE LA PERSISTANCE TOTALE SUR RENDER
# (Base de Données PostgreSQL Managée & Zéro Perte de Données)
# Plateforme IT Academy - Dr. M.A. Meziane
# ==============================================================================

Ce guide détaille pas à pas comment connecter la base de données PostgreSQL 
gratuite de Render à votre Web Service pour que TOUTES vos modifications, 
ajouts de cours, chapitres, fichiers et messages de délégués soient conservés 
à 100%, même en cas de redéploiement, vidage de cache ou mise en veille.

--------------------------------------------------------------------------------
1. POURQUOI CETTE CONFIGURATION EST INDISPENSABLE SUR RENDER
--------------------------------------------------------------------------------
- Sur l'offre gratuite de Render, le serveur web (Web Service) tourne dans un 
  conteneur avec un disque "éphémère" (virtuel et temporaire).
- Chaque fois que vous cliquez sur "Deploy", "Clear cache & deploy", ou lorsque 
  le serveur s'endort après 15 minutes d'inactivité, ce conteneur est détruit 
  et recréé à partir du code initial de GitHub.
- Sans base de données externe reliée, toute modification faite en ligne est 
  effacée lors du redémarrage.
- En reliant la base PostgreSQL permanente, vos données sont écrites dans le 
  cloud de manière indestructible.

--------------------------------------------------------------------------------
2. LES ÉTAPES PAS À PAS (DURÉE : 2 MINUTES)
--------------------------------------------------------------------------------

### ÉTAPE 1 : CRÉER LA BASE POSTGRESQL GRATUITE SUR RENDER
1. Rendez-vous sur votre tableau de bord Render :
   https://dashboard.render.com
2. En haut de l'écran, cliquez sur le bouton bleu "+ New" (ou "New +").
3. Dans la liste déroulante, sélectionnez : "PostgreSQL".
4. Remplissez les champs suivants :
   - Name : it-courses-db
   - Database : it_academy (optionnel, laissez par défaut sinon)
   - User : it_admin (optionnel)
   - Region : Frankfurt (EU Central)
   - Instance Type / Plan : Free
5. Descendez en bas et cliquez sur le bouton bleu : "Create Database".
6. Patientez 30 à 60 secondes que la base soit créée. Le statut passera à "Available".

---

### ÉTAPE 2 : COPIER L'URL INTERNE DE CONNEXION
1. Sur la page de votre nouvelle base PostgreSQL ("it-courses-db") :
2. Faites défiler la page jusqu'à la section intitulée "Connections".
3. Repérez la ligne appelée : "Internal Database URL"
   (Elle commence toujours par : postgres://...)
4. Cliquez sur le bouton "Copy" à droite de cette ligne 
   (ou sélectionnez-la et faites Clic Droit > Copier).

---

### ÉTAPE 3 : OUVRIR VOTRE WEB SERVICE DANS L'ONGLET "ENVIRONMENT"
1. Ouvrez directement le lien de votre Web Service :
   https://dashboard.render.com/web/srv-dbio2kflk1mc73f921i0
   (Ou depuis le Dashboard Render, cliquez sur votre service nommé "it-courses-platform" ou avec le badge "Web Service").
2. Dans le menu de gauche (sous Events, Logs, Metrics) :
   Cliquez sur : "Environment".

---

### ÉTAPE 4 : AJOUTER LA VARIABLE DATABASE_URL
1. Dans la page "Environment", repérez la section "Environment Variables".
2. Cliquez sur le bouton : "Add Environment Variable" (ou "Add").
3. Deux cases s'affichent :
   - Case de gauche ("Key") : Tapez exactement :
     DATABASE_URL
   - Case de droite ("Value") : Faites Clic Droit > Coller
     (Collez l'adresse postgres://... copiée à l'Étape 2).
4. Cliquez sur le bouton bleu tout en bas : "Save Changes".

---

### ÉTAPE 5 : CONFIRMATION DU REDÉMARRAGE ET VALIDATION
1. Dès que vous cliquez sur "Save Changes", Render redéploie automatiquement 
   votre Web Service avec la nouvelle variable.
2. Cliquez sur l'onglet "Logs" à gauche. Vous devez voir apparaître dans les logs :
   [DB-PG] 🐘 Connexion à PostgreSQL détectée (DATABASE_URL)...
   [DB-PG] 🐘 Connecté avec succès à PostgreSQL.
   [DB-PG] ✅ Synchronisation PostgreSQL réussie.
   🚀 Serveur IT Course Platform démarré sur http://localhost:10000
3. Dès que le badge affiche "Live", la persistance totale est active !

--------------------------------------------------------------------------------
3. RÉSULTAT OBTENU
--------------------------------------------------------------------------------
✅ Toute modification, suppression ou ajout de fichier fait en ligne est 
   immédiatement enregistrée dans PostgreSQL.
✅ Vous pouvez cliquer sur "Clear cache and redeploy" 100 fois : vos données 
   seront automatiquement rechargées et JAMAIS perdues.
✅ Si vous éteignez votre ordinateur, les données en ligne restent intactes.
✅ Sur votre PC en local, la base SQLite WAL (data/platform.db) assure la même 
   garantie de non-perte de données.
