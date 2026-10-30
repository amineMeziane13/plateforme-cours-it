// TP - Conception d'une API RESTful
// Stack: Express, TypeScript, JWT, Middleware d'authentification

import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET_KEY = "IT_COURSE_SUPER_SECRET_KEY_2026";

// Middleware d'autorisation
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide ou expiré" });
    req.user = user;
    next();
  });
}

console.log("Template de démarrage TP Web disponible !");
