# 🚀 Guide de Déploiement Gratuit (Permanent & Instantané)

Ce guide explique les deux méthodes pour rendre votre site accessible sur Internet gratuitement :

---

## ⚡ Méthode 1 : Accès Public Immédiat en Ligne (Déjà Actif !)

Votre site est **déjà accessible publiquement sur Internet** via le tunnel sécurisé HTTPS suivant :

- 🌐 **URL Publique Directe** : **https://it-courses-platform.loca.lt**
- 🔑 **Mot de passe IP (si demandé à l'ouverture)** : `197.207.83.216` *(il s'agit de la protection standard anti-abus de localtunnel ; entrez cette IP puis cliquez sur "Submit" pour accéder au site)*.

Toute personne ayant ce lien peut consulter, télécharger et tester le site en direct.

---

## ☁️ Méthode 2 : Déploiement Permanent Gratuit sur Render.com (Recommandé)

[Render.com](https://render.com) propose un hébergement gratuit pour les services web Node.js et Docker, avec certificat SSL automatique.

Le projet est déjà entièrement pré-configuré avec un fichier `render.yaml` et un `Dockerfile`.

### Étapes (Moins de 2 minutes) :

1. **Publier votre code sur GitHub** :
   Créez un nouveau dépôt sur votre compte GitHub (ex: `plateforme-cours-it`), puis exécutez dans le terminal :
   ```bash
   git remote add origin https://github.com/VOTRE_PSEUDO/plateforme-cours-it.git
   git branch -M main
   git push -u origin main
   ```

2. **Connecter sur Render.com** :
   - Rendez-vous sur [dashboard.render.com](https://dashboard.render.com) (inscription gratuite avec GitHub).
   - Cliquez sur **"New +"** > **"Web Service"**.
   - Sélectionnez votre dépôt GitHub `plateforme-cours-it`.
   - Render détectera automatiquement les réglages grâce au fichier `render.yaml` :
     - **Runtime** : `Node`
     - **Build Command** : `npm --prefix frontend install && npm --prefix frontend run build && npm --prefix backend install --omit=dev`
     - **Start Command** : `node backend/server.js`
     - **Plan** : `Free`
   - Cliquez sur **"Create Web Service"**.

3. **Votre site est en ligne 24h/24** avec une URL permanente du type :  
   `https://it-courses-platform.onrender.com`

---

## 🐳 Méthode 3 : Déploiement via Docker (Koyeb / Railway / Fly.io)

Un `Dockerfile` optimisé multi-stage est fourni à la racine. Il compile le frontend React et configure le serveur Express de production :

```bash
docker build -t it-courses-platform .
docker run -p 5000:5000 it-courses-platform
```
Ce conteneur peut être déployé gratuitement sur n'importe quel hébergeur Docker (Koyeb, Railway, Google Cloud Run).
