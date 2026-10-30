# 🎓 IT.ACADEMY — Plateforme Dynamique de Cours & Ressources Informatiques

Plateforme web dynamique moderne conçue spécifiquement pour la gestion, le dépôt, la modification et la suppression de supports de cours IT (PDF, archives de code, scripts, présentations, travaux pratiques).

---

## 🎨 Charte Graphique & Design
- **Thème Sombre (Noir)** : Fond Obsidian & Cyber Slate (`#080C14`, `#0B111E`, `#111A2E`)
- **Bleu Électrique / Cyan** : Accents cyber, boutons d'action, barres de progression et métriques (`#2563EB`, `#3B82F6`, `#06B6D4`)
- **Touche de Rouge Crimson** : Badges critiques (Cybersécurité), alertes, confirmations de suppression et voyants administrateur (`#DC2626`, `#EF4444`, `#F43F5E`)
- **Effets UI** : Glassmorphism, néon glows, animations fluides et typographie adaptée au code (Inter + Fira Code).

---

## 🚀 Démarrage Rapide

### 1. Lancer l'application complète (Mode Production / Standalone)
Dans la racine du projet :
```bash
npm start
```
> Ouvrez votre navigateur sur **http://localhost:5000**

### 2. Lancer en Mode Développement (Hot Reload)
- **Serveur Backend (API)** :
  ```bash
  npm run dev:backend
  ```
- **Client Frontend (Vite + React)** :
  ```bash
  npm run dev:frontend
  ```
> Ouvrez votre navigateur sur **http://localhost:5173** (avec proxy automatique vers l'API).

---

## 🔑 Espace Administrateur
- **Bouton d'accès** : Cliquez sur **"Espace Admin"** dans la barre de navigation.
- **Identifiants par défaut** :
  - **Identifiant** : `admin`
  - **Mot de passe** : `admin123`
*(Les identifiants sont pré-remplis en 1 clic pour tester immédiatement).*

---

## ⚡ Fonctionnalités Clés

### 1. Dépôt de Fichier sous une Rubrique (Requis)
- L'administrateur peut déposer des fichiers jusqu'à **100 Mo** (PDF, ZIP, JS, PY, SH, PPTX, SQL, etc.).
- **Attribution obligatoire d'une rubrique** : le fichier est classé sous une thématique IT précise (Cybersécurité, Développement Web, Réseaux, Linux, DevOps, etc.).
- Zone de **glisser-déposer (Drag & Drop)** avec détection automatique du nom et de la taille.

### 2. Modification de Fichier (Édition)
- Modification du titre, de la description, du niveau d'études (L1 à M2 / Pro) et des mots-clés.
- **Changement de rubrique** : possibilité de transférer un cours d'une rubrique à une autre.
- **Remplacement de document** : téléversement d'une nouvelle version sans perdre l'historique ni l'identifiant.

### 3. Suppression Sécurisée
- Bouton de suppression rouge crimson avec **modal de confirmation**.
- Nettoyage automatique du fichier physique sur le disque du serveur et de la base de données.

### 4. Consultation & Prévisualisation pour les Étudiants
- **Filtres par rubriques** : Puces horizontales avec compteurs de fichiers par domaine.
- **Recherche temps réel** : Recherche instantanée par nom, mot-clé, professeur ou niveau.
- **Prévisualisation intégrée** : Lecture directe des fichiers texte/scripts avec coloration syntaxique et bouton de copie de code, aperçu PDF et images.
- **Téléchargement direct** avec mise à jour du compteur en direct.

### 5. Gestion Dynamique des Rubriques
- L'administrateur peut créer de nouvelles rubriques avec icônes et couleurs personnalisées.
- Protection anti-suppression si une rubrique contient encore des fichiers.
