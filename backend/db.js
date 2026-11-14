import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const require = createRequire(import.meta.url);
const { Pool } = pg;
let DatabaseConstructor = null;
try {
  DatabaseConstructor = require('better-sqlite3');
} catch (e) {
  console.warn('[DB] Module better-sqlite3 non chargé:', e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const BACKUP_FILE = path.join(DATA_DIR, 'database.backup.json');
const BAK_FILE = path.join(DATA_DIR, 'database.bak.json');
const SQLITE_FILE = path.join(DATA_DIR, 'platform.db');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve(__dirname, '../uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const defaultRubriques = [
  {
    id: 'rub-securite',
    name: 'Cybersécurité & Ethical Hacking',
    description: 'Sécurité offensive/défensive, protocoles cryptographiques, pentesting et audits.',
    icon: 'ShieldAlert',
    color: 'red',
    badge: 'Urgent & Critique',
    createdAt: '2026-09-01T08:00:00.000Z',
    sousRubriques: [
      { id: 'sub-sec-1', name: 'Cryptographie & Protocoles', description: 'Chiffrement symétrique/asymétrique, RSA, AES' },
      { id: 'sub-sec-2', name: 'Sécurité Réseaux & Pare-feu', description: 'IPTables, IDS/IPS, VPN, DMZ' },
      { id: 'sub-sec-3', name: 'Ethical Hacking & Pentesting', description: 'Audits de sécurité, tests d\'intrusion' }
    ]
  },
  {
    id: 'rub-web',
    name: 'Développement Web & Mobile',
    description: 'Architecture frontend & backend, API REST, React, Node.js, TypeScript et mobile.',
    icon: 'Code2',
    color: 'blue',
    badge: 'Fullstack',
    createdAt: '2026-09-02T08:00:00.000Z',
    sousRubriques: [
      { id: 'sub-web-1', name: 'Frontend React & TypeScript', description: 'Composants modernes, Hooks, Tailwind' },
      { id: 'sub-web-2', name: 'Backend Node.js & API REST', description: 'Express, JWT, architectures microservices' }
    ]
  },
  {
    id: 'rub-reseaux',
    name: 'Réseaux & Télécommunications',
    description: 'Modèle OSI, protocoles TCP/IP, routage Cisco/Juniper, VLAN et sous-réseaux.',
    icon: 'Network',
    color: 'cyan',
    badge: 'Infrastructure',
    createdAt: '2026-09-03T08:00:00.000Z',
    sousRubriques: [
      { id: 'sub-res-1', name: 'Routage & Commutation Cisco', description: 'OSPF, BGP, VLANs, Spanning-Tree' },
      { id: 'sub-res-2', name: 'Protocoles TCP/IP & Services', description: 'DNS, DHCP, HTTP/3, Wireshark' }
    ]
  },
  {
    id: 'rub-linux',
    name: "Systèmes d'Exploitation & Linux",
    description: 'Administration système Linux/UNIX, Bash scripting, ordonnancement et kernel.',
    icon: 'Terminal',
    color: 'blue',
    badge: 'SysAdmin',
    createdAt: '2026-09-04T08:00:00.000Z',
    sousRubriques: [
      { id: 'sub-lin-1', name: 'Administration Système', description: 'Gestion des utilisateurs, permissions, services systemd' },
      { id: 'sub-lin-2', name: 'Scripting Bash & Automatisation', description: 'Scripts avancés, cron jobs, parsing de logs' }
    ]
  },
  {
    id: 'rub-bdd',
    name: 'Bases de Données & SQL',
    description: 'Modélisation relationnelle, SQL avancé, indexation B-Tree, transactions ACID et NoSQL.',
    icon: 'Database',
    color: 'blue',
    badge: 'Données',
    createdAt: '2026-09-05T08:00:00.000Z',
    sousRubriques: []
  },
  {
    id: 'rub-cloud',
    name: 'Cloud Computing & DevOps',
    description: 'Conteneurisation Docker, orchestration Kubernetes, CI/CD, Terraform et microservices.',
    icon: 'Cloud',
    color: 'cyan',
    badge: 'DevOps',
    createdAt: '2026-09-06T08:00:00.000Z',
    sousRubriques: []
  },
  {
    id: 'rub-algo',
    name: 'Algorithmique & Structures de Données',
    description: 'Complexité temporelle/spatiale, graphes, arbres binaires, programmation dynamique.',
    icon: 'Cpu',
    color: 'blue',
    badge: 'Fondamentaux',
    createdAt: '2026-09-07T08:00:00.000Z',
    sousRubriques: []
  },
  {
    id: 'rub-ia',
    name: 'Intelligence Artificielle & Data Science',
    description: 'Machine Learning, réseaux de neurones, Deep Learning, vision par ordinateur et NLP.',
    icon: 'Binary',
    color: 'red',
    badge: 'IA & ML',
    createdAt: '2026-09-08T08:00:00.000Z',
    sousRubriques: []
  }
];

const sampleFiles = [
  {
    filename: 'cours-securite-cryptographie.md',
    originalName: 'Cours_Complet_Cryptographie_Securite.md',
    title: 'Fondamentaux de la Cryptographie Moderne & Sécurité des Protocoles',
    rubriqueId: 'rub-securite',
    sousRubriqueId: 'sub-sec-1',
    description: 'Support complet de cours : Chiffrement symétrique (AES), asymétrique (RSA, ECC), fonctions de hachage (SHA-256) et signatures électroniques.',
    level: 'Master 1',
    professor: 'Dr. M.A. Meziane',
    tags: ['Cryptographie', 'AES', 'RSA', 'Sécurité', 'Cours'],
    mimeType: 'text/markdown',
    downloads: 142,
    createdAt: '2026-10-12T10:30:00.000Z',
    downloadable: false,
    content: `# Chapitre 1 : Introduction à la Cryptographie Moderne
Auteur : Dr. M.A. Meziane (ESE ORAN)

## 1. Principes Fondamentaux de la Sécurité
La sécurité des systèmes d'information repose sur le triptyque CID :
- **Confidentialité** : Assurée par le chiffrement (AES-256, ChaCha20).
- **Intégrité** : Garantie par les empreintes cryptographiques (SHA-256, HMAC).
- **Disponibilité** : Préservation contre les attaques DDoS et pannes d'infrastructure.

## 2. Chiffrement Symétrique vs Asymétrique
- Symétrique : Même clé pour chiffrer et déchiffrer (rapide, haut débit).
- Asymétrique : Paire de clés publique/privée (RSA-4096, Courbes elliptiques Ed25519).`
  },
  {
    filename: 'tp-api-rest-node-jwt.ts',
    originalName: 'TP_Architecture_API_REST_Express.ts',
    title: 'TP Pratique : API REST Sécurisée avec Express & JWT',
    rubriqueId: 'rub-web',
    sousRubriqueId: 'sub-web-2',
    description: 'Sujet et code source complet pour concevoir une API REST avec authentification token JWT et validation Zod.',
    level: 'Licence 3',
    professor: 'Prof. Sarah Benali',
    tags: ['Node.js', 'Express', 'JWT', 'TypeScript', 'TP'],
    mimeType: 'application/typescript',
    downloads: 98,
    createdAt: '2026-10-18T14:15:00.000Z',
    downloadable: true,
    content: `// TP - Conception d'une API RESTful
// Stack: Express, TypeScript, JWT, Middleware d'authentification
import express from 'express';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });
  next();
}`
  },
  {
    filename: 'cours-cisco-routage-vlan.txt',
    originalName: 'Fiche_Synthese_Cisco_VLAN_Routage.txt',
    title: 'Fiche de Synthèse : Configuration VLANs et Routage Inter-VLAN',
    rubriqueId: 'rub-reseaux',
    sousRubriqueId: 'sub-res-1',
    description: 'Guide mémo des commandes Cisco IOS pour configurer les switchs Catalyst, trunks 802.1Q et routeurs Router-on-a-Stick.',
    level: 'Licence 3',
    professor: 'Ing. Karim Mansouri',
    tags: ['Cisco', 'VLAN', 'Routage', 'CCNA', 'Réseaux'],
    mimeType: 'text/plain',
    downloads: 215,
    createdAt: '2026-10-05T09:00:00.000Z',
    downloadable: false,
    content: `=== CONFIGURATION SWITCH CISCO CATALYST ===
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name PEDAGOGIE
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30`
  },
  {
    filename: 'deploiement-docker-kubernetes.yaml',
    originalName: 'Manifest_Kubernetes_Production.yaml',
    title: 'Manifeste Kubernetes : Déploiement Microservice & Ingress Nginx',
    rubriqueId: 'rub-cloud',
    description: 'Fichier YAML complet de déploiement de pods, service ClusterIP et Ingress controller avec certificats SSL.',
    level: 'Master 2',
    professor: 'Dr. M.A. Meziane',
    tags: ['Kubernetes', 'Docker', 'DevOps', 'Cloud', 'YAML'],
    mimeType: 'text/yaml',
    downloads: 73,
    createdAt: '2026-10-22T16:45:00.000Z',
    downloadable: false,
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: it-portal-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: it-portal-api
  template:
    metadata:
      labels:
        app: it-portal-api
    spec:
      containers:
      - name: api
        image: it-portal:latest
        ports:
        - containerPort: 5000`
  },
  {
    filename: 'cours-linux-bash-scripting.sh',
    originalName: 'Support_Linux_Bash_Administration.sh',
    title: 'Scripting Bash Avancé pour Administrateurs Systèmes',
    rubriqueId: 'rub-linux',
    sousRubriqueId: 'sub-lin-2',
    description: 'Scripts de surveillance de charge, rotation automatique des journaux et audit de sécurité des comptes utilisateurs.',
    level: 'Licence 2',
    professor: 'Dr. Marc Valery',
    tags: ['Linux', 'Bash', 'SysAdmin', 'Cron', 'Automatisation'],
    mimeType: 'text/x-shellscript',
    downloads: 164,
    createdAt: '2026-10-25T11:20:00.000Z',
    downloadable: true,
    content: `#!/usr/bin/env bash
# Script de monitoring système pour serveurs Linux de cours
set -euo pipefail

echo "=== RAPPORT SYSTÈME DU SERVEUR IT ==="
echo "Date : $(date)"
echo "Charge CPU : $(uptime | awk -F'load average:' '{ print $2 }')"
free -h
df -h /`
  }
];

function createSampleFileIfNotExists(filename, content) {
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  const stats = fs.statSync(filePath);
  return stats.size;
}

class Database {
  constructor() {
    this.sqlite = null;
    this.pgPool = null;
    this.data = {
      rubriques: [],
      files: [],
      adminConfig: {
        username: 'amine',
        email: 'amine.blackline@gmail.com',
        masterPassword: 'AmineAdmin2026!',
        smtp: {
          service: 'gmail',
          user: 'amine.blackline@gmail.com',
          pass: ''
        }
      },
      groupLeaders: [],
      messages: [],
      dynamicAuth: null,
      visitorCount: 0,
      lastVisitors: []
    };

    // Initialize relational SQLite engine with Write-Ahead Logging (WAL)
    this.initSqlite();
    // Load and synchronize data
    this.init();
  }

  // ==========================================
  // RELATIONAL SQLITE ENGINE (ACID & WAL)
  // ==========================================
  initSqlite() {
    if (!DatabaseConstructor) {
      console.log('[DB] ℹ️ Module better-sqlite3 non actif sur cet environnement (mode PostgreSQL ou cloud fallback).');
      return;
    }
    try {
      this.sqlite = new DatabaseConstructor(SQLITE_FILE);
      // Enable Write-Ahead Logging (WAL) as detailed in Section 3 & 5 of the guide
      this.sqlite.pragma('journal_mode = WAL');
      this.sqlite.pragma('synchronous = NORMAL');
      this.sqlite.pragma('foreign_keys = ON');

      this.sqlite.exec(`
        CREATE TABLE IF NOT EXISTS rubriques (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          color TEXT,
          badge TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS sous_rubriques (
          id TEXT PRIMARY KEY,
          rubrique_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          created_at TEXT,
          FOREIGN KEY(rubrique_id) REFERENCES rubriques(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS files (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          rubrique_id TEXT NOT NULL,
          sous_rubrique_id TEXT,
          description TEXT,
          level TEXT,
          professor TEXT,
          tags TEXT,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          mime_type TEXT,
          size_bytes INTEGER,
          views INTEGER DEFAULT 0,
          downloads INTEGER DEFAULT 0,
          downloadable INTEGER DEFAULT 0,
          created_at TEXT,
          FOREIGN KEY(rubrique_id) REFERENCES rubriques(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS group_leaders (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          student_name TEXT,
          group_name TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS leader_messages (
          id TEXT PRIMARY KEY,
          leader_id TEXT,
          leader_name TEXT,
          group_name TEXT,
          subject TEXT NOT NULL,
          content TEXT NOT NULL,
          reply TEXT,
          status TEXT DEFAULT 'pending',
          created_at TEXT,
          replied_at TEXT
        );

        CREATE TABLE IF NOT EXISTS admin_config (
          key TEXT PRIMARY KEY,
          value TEXT
        );

        CREATE TABLE IF NOT EXISTS visitors (
          session_id TEXT PRIMARY KEY,
          last_seen INTEGER
        );

        -- B-Tree Indexes as detailed in Section 5.C of the guide
        CREATE INDEX IF NOT EXISTS idx_files_rubrique ON files(rubrique_id);
        CREATE INDEX IF NOT EXISTS idx_files_sous_rubrique ON files(sous_rubrique_id);
        CREATE INDEX IF NOT EXISTS idx_sous_rubriques_rubrique ON sous_rubriques(rubrique_id);
        CREATE INDEX IF NOT EXISTS idx_messages_leader ON leader_messages(leader_id);
      `);

      console.log('[DB] 🗄️ Moteur relationnel SQLite (WAL ACID) initialisé avec succès.');
    } catch (err) {
      console.error('[DB] ❌ Erreur initialisation SQLite:', err.message);
      this.sqlite = null;
    }
  }

  // Load from SQLite relational tables into memory cache
  loadFromSqlite() {
    if (!this.sqlite) return false;
    try {
      const rubRows = this.sqlite.prepare('SELECT * FROM rubriques ORDER BY created_at ASC').all();
      if (!rubRows || rubRows.length === 0) return false;

      const subRows = this.sqlite.prepare('SELECT * FROM sous_rubriques ORDER BY created_at ASC').all();
      const fileRows = this.sqlite.prepare('SELECT * FROM files ORDER BY created_at DESC').all();
      const leaderRows = this.sqlite.prepare('SELECT * FROM group_leaders').all();
      const msgRows = this.sqlite.prepare('SELECT * FROM leader_messages ORDER BY created_at DESC').all();
      const visitorRows = this.sqlite.prepare('SELECT * FROM visitors').all();
      const configRows = this.sqlite.prepare('SELECT * FROM admin_config').all();

      // Assemble rubriques with sous-rubriques
      const rubriques = rubRows.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        icon: r.icon || 'Folder',
        color: r.color || 'blue',
        badge: r.badge || 'IT',
        createdAt: r.created_at,
        sousRubriques: subRows
          .filter(s => s.rubrique_id === r.id)
          .map(s => ({
            id: s.id,
            rubriqueId: s.rubrique_id,
            name: s.name,
            description: s.description || ''
          }))
      }));

      // Assemble files
      const files = fileRows.map(f => ({
        id: f.id,
        title: f.title,
        rubriqueId: f.rubrique_id,
        sousRubriqueId: f.sous_rubrique_id || null,
        description: f.description || '',
        level: f.level || 'Tous niveaux',
        professor: f.professor || '',
        tags: f.tags ? JSON.parse(f.tags) : [],
        filename: f.filename,
        originalName: f.original_name,
        mimeType: f.mime_type || 'application/octet-stream',
        sizeBytes: f.size_bytes || 0,
        views: f.views || 0,
        downloads: f.downloads || 0,
        downloadable: Boolean(f.downloadable),
        createdAt: f.created_at
      }));

      // Assemble leaders
      const groupLeaders = leaderRows.map(l => ({
        id: l.id,
        username: l.username,
        password: l.password,
        studentName: l.student_name,
        groupName: l.group_name,
        createdAt: l.created_at
      }));

      // Assemble messages
      const messages = msgRows.map(m => ({
        id: m.id,
        leaderId: m.leader_id,
        leaderName: m.leader_name,
        groupName: m.group_name,
        subject: m.subject,
        content: m.content,
        reply: m.reply,
        status: m.status,
        createdAt: m.created_at,
        repliedAt: m.replied_at
      }));

      // Assemble admin config
      let adminConfig = {
        username: 'amine',
        email: 'amine.blackline@gmail.com',
        masterPassword: 'AmineAdmin2026!',
        smtp: { service: 'gmail', user: 'amine.blackline@gmail.com', pass: '' }
      };
      const cfgRow = configRows.find(c => c.key === 'admin_config');
      if (cfgRow && cfgRow.value) {
        try { adminConfig = JSON.parse(cfgRow.value); } catch (_) {}
      }

      this.data = {
        rubriques,
        files,
        adminConfig,
        groupLeaders,
        messages,
        dynamicAuth: null,
        visitorCount: visitorRows.length,
        lastVisitors: visitorRows.map(v => ({ id: v.session_id, ts: v.last_seen }))
      };

      console.log(`[DB] ✅ Données chargées depuis SQLite WAL (${rubriques.length} rubriques, ${files.length} fichiers).`);
      return true;
    } catch (err) {
      console.error('[DB] ❌ Erreur lecture SQLite:', err.message);
      return false;
    }
  }

  // Push memory data to SQLite relational tables (ACID transaction)
  persistToSqlite() {
    if (!this.sqlite) return;
    try {
      const syncTransaction = this.sqlite.transaction(() => {
        // Clear & rewrite tables
        this.sqlite.exec('DELETE FROM files; DELETE FROM sous_rubriques; DELETE FROM rubriques;');
        this.sqlite.exec('DELETE FROM group_leaders; DELETE FROM leader_messages; DELETE FROM admin_config;');

        // Insert rubriques & sous-rubriques
        const insertRub = this.sqlite.prepare(`
          INSERT INTO rubriques (id, name, description, icon, color, badge, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const insertSub = this.sqlite.prepare(`
          INSERT INTO sous_rubriques (id, rubrique_id, name, description, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);

        for (const rub of this.data.rubriques || []) {
          insertRub.run(
            rub.id,
            rub.name,
            rub.description || '',
            rub.icon || 'Folder',
            rub.color || 'blue',
            rub.badge || 'IT',
            rub.createdAt || new Date().toISOString()
          );
          if (Array.isArray(rub.sousRubriques)) {
            for (const sub of rub.sousRubriques) {
              insertSub.run(
                sub.id,
                rub.id,
                sub.name,
                sub.description || '',
                new Date().toISOString()
              );
            }
          }
        }

        // Insert files
        const insertFile = this.sqlite.prepare(`
          INSERT INTO files (id, title, rubrique_id, sous_rubrique_id, description, level, professor, tags, filename, original_name, mime_type, size_bytes, views, downloads, downloadable, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const file of this.data.files || []) {
          insertFile.run(
            file.id,
            file.title,
            file.rubriqueId,
            file.sousRubriqueId || null,
            file.description || '',
            file.level || 'Tous niveaux',
            file.professor || '',
            JSON.stringify(file.tags || []),
            file.filename,
            file.originalName,
            file.mimeType || 'application/octet-stream',
            file.sizeBytes || 0,
            file.views || 0,
            file.downloads || 0,
            file.downloadable ? 1 : 0,
            file.createdAt || new Date().toISOString()
          );
        }

        // Insert group leaders
        const insertLeader = this.sqlite.prepare(`
          INSERT INTO group_leaders (id, username, password, student_name, group_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const lead of this.data.groupLeaders || []) {
          insertLeader.run(
            lead.id,
            lead.username,
            lead.password,
            lead.studentName || '',
            lead.groupName || '',
            lead.createdAt || new Date().toISOString()
          );
        }

        // Insert messages
        const insertMsg = this.sqlite.prepare(`
          INSERT INTO leader_messages (id, leader_id, leader_name, group_name, subject, content, reply, status, created_at, replied_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const msg of this.data.messages || []) {
          insertMsg.run(
            msg.id,
            msg.leaderId || null,
            msg.leaderName || null,
            msg.groupName || null,
            msg.subject,
            msg.content,
            msg.reply || null,
            msg.status || 'pending',
            msg.createdAt || new Date().toISOString(),
            msg.repliedAt || null
          );
        }

        // Insert admin config
        const insertConfig = this.sqlite.prepare(`
          INSERT OR REPLACE INTO admin_config (key, value) VALUES (?, ?)
        `);
        insertConfig.run('admin_config', JSON.stringify(this.data.adminConfig || {}));

        // Insert visitors
        const insertVis = this.sqlite.prepare(`
          INSERT OR REPLACE INTO visitors (session_id, last_seen) VALUES (?, ?)
        `);
        for (const v of this.data.lastVisitors || []) {
          insertVis.run(v.id, v.ts || Date.now());
        }
      });

      syncTransaction();
    } catch (err) {
      console.error('[DB] ❌ Erreur écriture SQLite WAL:', err.message);
    }
  }

  // ==========================================
  // RELATIONAL POSTGRESQL ENGINE (CLOUD PERSISTENCE)
  // ==========================================
  async initPostgres() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return false;
    }
    try {
      console.log('[DB-PG] 🐘 Initialisation du moteur PostgreSQL Cloud (DATABASE_URL détectée)...');
      this.pgPool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.PG_NO_SSL ? false : { rejectUnauthorized: false }
      });

      const client = await this.pgPool.connect();
      console.log('[DB-PG] 🐘 Connecté avec succès à PostgreSQL.');

      await client.query(`
        CREATE TABLE IF NOT EXISTS rubriques (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          color VARCHAR(50),
          badge VARCHAR(100),
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS sous_rubriques (
          id VARCHAR(100) PRIMARY KEY,
          rubrique_id VARCHAR(100) NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS files (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          rubrique_id VARCHAR(100) NOT NULL,
          sous_rubrique_id VARCHAR(100),
          description TEXT,
          level VARCHAR(50),
          professor VARCHAR(100),
          tags TEXT,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          mime_type VARCHAR(100),
          size_bytes BIGINT DEFAULT 0,
          views INT DEFAULT 0,
          downloads INT DEFAULT 0,
          downloadable BOOLEAN DEFAULT FALSE,
          file_content TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS group_leaders (
          id VARCHAR(100) PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          student_name VARCHAR(150),
          group_name VARCHAR(150),
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS leader_messages (
          id VARCHAR(100) PRIMARY KEY,
          leader_id VARCHAR(100),
          leader_name VARCHAR(150),
          group_name VARCHAR(150),
          subject VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          reply TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TEXT,
          replied_at TEXT
        );

        CREATE TABLE IF NOT EXISTS admin_config (
          key VARCHAR(100) PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS visitors (
          session_id VARCHAR(150) PRIMARY KEY,
          last_seen BIGINT
        );

        CREATE INDEX IF NOT EXISTS idx_pg_files_rubrique ON files(rubrique_id);
        CREATE INDEX IF NOT EXISTS idx_pg_files_sous_rubrique ON files(sous_rubrique_id);
        CREATE INDEX IF NOT EXISTS idx_pg_sous_rubriques_rubrique ON sous_rubriques(rubrique_id);
        CREATE INDEX IF NOT EXISTS idx_pg_messages_leader ON leader_messages(leader_id);
      `);
      client.release();

      // Check if PG has existing data
      const { rows: rubRows } = await this.pgPool.query('SELECT * FROM rubriques ORDER BY created_at ASC');
      if (rubRows && rubRows.length > 0) {
        console.log(`[DB-PG] 📥 Chargement de ${rubRows.length} rubriques depuis PostgreSQL...`);
        const { rows: subRows } = await this.pgPool.query('SELECT * FROM sous_rubriques ORDER BY created_at ASC');
        const { rows: fileRows } = await this.pgPool.query('SELECT * FROM files ORDER BY created_at DESC');
        const { rows: leaderRows } = await this.pgPool.query('SELECT * FROM group_leaders');
        const { rows: msgRows } = await this.pgPool.query('SELECT * FROM leader_messages ORDER BY created_at DESC');
        const { rows: visitorRows } = await this.pgPool.query('SELECT * FROM visitors');
        const { rows: configRows } = await this.pgPool.query('SELECT * FROM admin_config');

        this.data.rubriques = rubRows.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          icon: r.icon || 'Folder',
          color: r.color || 'blue',
          badge: r.badge || 'IT',
          createdAt: r.created_at,
          sousRubriques: subRows
            .filter(s => s.rubrique_id === r.id)
            .map(s => ({
              id: s.id,
              rubriqueId: s.rubrique_id,
              name: s.name,
              description: s.description || ''
            }))
        }));

        this.data.files = fileRows.map(f => {
          const filePath = path.join(UPLOADS_DIR, f.filename);
          if (!fs.existsSync(filePath) && f.file_content) {
            try {
              if (f.file_content.startsWith('base64:')) {
                fs.writeFileSync(filePath, Buffer.from(f.file_content.slice(7), 'base64'));
              } else {
                fs.writeFileSync(filePath, f.file_content, 'utf8');
              }
            } catch (wErr) {
              console.warn('[DB-PG] Restauration fichier physique:', wErr.message);
            }
          }

          return {
            id: f.id,
            title: f.title,
            rubriqueId: f.rubrique_id,
            sousRubriqueId: f.sous_rubrique_id || null,
            description: f.description || '',
            level: f.level || 'Tous niveaux',
            professor: f.professor || '',
            tags: f.tags ? JSON.parse(f.tags) : [],
            filename: f.filename,
            originalName: f.original_name,
            mimeType: f.mime_type || 'application/octet-stream',
            sizeBytes: Number(f.size_bytes) || 0,
            views: f.views || 0,
            downloads: f.downloads || 0,
            downloadable: Boolean(f.downloadable),
            createdAt: f.created_at
          };
        });

        this.data.groupLeaders = leaderRows.map(l => ({
          id: l.id,
          username: l.username,
          password: l.password,
          studentName: l.student_name,
          groupName: l.group_name,
          createdAt: l.created_at
        }));

        this.data.messages = msgRows.map(m => ({
          id: m.id,
          leaderId: m.leader_id,
          leaderName: m.leader_name,
          groupName: m.group_name,
          subject: m.subject,
          content: m.content,
          reply: m.reply,
          status: m.status,
          createdAt: m.created_at,
          repliedAt: m.replied_at
        }));

        const cfg = configRows.find(c => c.key === 'admin_config');
        if (cfg && cfg.value) {
          try { this.data.adminConfig = JSON.parse(cfg.value); } catch (_) {}
        }

        this.data.visitorCount = visitorRows.length;
        this.data.lastVisitors = visitorRows.map(v => ({ id: v.session_id, ts: Number(v.last_seen) }));

        console.log(`[DB-PG] ✅ Données chargées avec succès depuis PostgreSQL (${this.data.rubriques.length} rubriques, ${this.data.files.length} fichiers).`);
      } else {
        console.log('[DB-PG] 🚀 Base PostgreSQL vide. Migration initiale des données vers PostgreSQL...');
        await this.persistToPostgres();
        console.log('[DB-PG] ✅ Migration initiale vers PostgreSQL terminée.');
      }
      return true;
    } catch (err) {
      console.error('[DB-PG] ❌ Erreur PostgreSQL:', err.message);
      return false;
    }
  }

  async persistToPostgres() {
    if (!this.pgPool) return;
    try {
      const client = await this.pgPool.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM files; DELETE FROM sous_rubriques; DELETE FROM rubriques;');
        await client.query('DELETE FROM group_leaders; DELETE FROM leader_messages; DELETE FROM admin_config;');

        for (const rub of this.data.rubriques || []) {
          await client.query(
            'INSERT INTO rubriques (id, name, description, icon, color, badge, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [rub.id, rub.name, rub.description || '', rub.icon || 'Folder', rub.color || 'blue', rub.badge || 'IT', rub.createdAt || new Date().toISOString()]
          );
          for (const sub of rub.sousRubriques || []) {
            await client.query(
              'INSERT INTO sous_rubriques (id, rubrique_id, name, description, created_at) VALUES ($1, $2, $3, $4, $5)',
              [sub.id, rub.id, sub.name, sub.description || '', new Date().toISOString()]
            );
          }
        }

        for (const file of this.data.files || []) {
          let fileContent = '';
          const physicalPath = path.join(UPLOADS_DIR, file.filename);
          if (fs.existsSync(physicalPath)) {
            try {
              const isText = file.mimeType?.startsWith('text/') || ['text/markdown', 'application/javascript', 'application/typescript', 'application/json', 'text/x-shellscript', 'text/yaml'].includes(file.mimeType);
              if (isText) {
                fileContent = fs.readFileSync(physicalPath, 'utf8');
              } else {
                fileContent = 'base64:' + fs.readFileSync(physicalPath).toString('base64');
              }
            } catch (_) {}
          }

          await client.query(
            `INSERT INTO files (id, title, rubrique_id, sous_rubrique_id, description, level, professor, tags, filename, original_name, mime_type, size_bytes, views, downloads, downloadable, file_content, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
            [
              file.id, file.title, file.rubriqueId, file.sousRubriqueId || null, file.description || '',
              file.level || 'Tous niveaux', file.professor || '', JSON.stringify(file.tags || []),
              file.filename, file.originalName, file.mimeType || 'application/octet-stream',
              file.sizeBytes || 0, file.views || 0, file.downloads || 0, Boolean(file.downloadable),
              fileContent, file.createdAt || new Date().toISOString()
            ]
          );
        }

        for (const lead of this.data.groupLeaders || []) {
          await client.query(
            'INSERT INTO group_leaders (id, username, password, student_name, group_name, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [lead.id, lead.username, lead.password, lead.studentName || '', lead.groupName || '', lead.createdAt || new Date().toISOString()]
          );
        }

        for (const msg of this.data.messages || []) {
          await client.query(
            'INSERT INTO leader_messages (id, leader_id, leader_name, group_name, subject, content, reply, status, created_at, replied_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [msg.id, msg.leaderId || null, msg.leaderName || null, msg.groupName || null, msg.subject, msg.content, msg.reply || null, msg.status || 'pending', msg.createdAt || new Date().toISOString(), msg.repliedAt || null]
          );
        }

        await client.query(
          'INSERT INTO admin_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
          ['admin_config', JSON.stringify(this.data.adminConfig || {})]
        );

        for (const v of this.data.lastVisitors || []) {
          await client.query(
            'INSERT INTO visitors (session_id, last_seen) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET last_seen = $2',
            [v.id, v.ts || Date.now()]
          );
        }

        await client.query('COMMIT');
        console.log(`[DB-PG] 💾 Synchronisation PostgreSQL réussie (${this.data.rubriques.length} rubriques, ${this.data.files.length} fichiers).`);
      } catch (txErr) {
        await client.query('ROLLBACK');
        throw txErr;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('[DB-PG] ❌ Erreur écriture PostgreSQL:', err.message);
    }
  }

  // ==========================================
  // INITIALIZATION & MULTI-TIER RECOVERY
  // ==========================================
  init() {
    // 1. Try loading from SQLite relational database (WAL mode)
    const sqliteLoaded = this.loadFromSqlite();

    if (!sqliteLoaded) {
      // 2. Fallback to existing JSON files and import into SQLite
      let loadedData = null;
      let source = null;

      const tryLoad = (filePath) => {
        try {
          if (!fs.existsSync(filePath)) return null;
          const raw = fs.readFileSync(filePath, 'utf8');
          if (!raw || raw.trim().length === 0) return null;
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && (Array.isArray(parsed.rubriques) || Array.isArray(parsed.files))) {
            return parsed;
          }
        } catch (e) {
          console.warn(`[DB] Impossible de parser ${filePath}:`, e.message);
        }
        return null;
      };

      loadedData = tryLoad(DB_FILE);
      if (loadedData) source = 'primary';

      if (!loadedData && fs.existsSync(BACKUP_FILE)) {
        loadedData = tryLoad(BACKUP_FILE);
        if (loadedData) source = 'backup';
      }

      if (!loadedData && fs.existsSync(BAK_FILE)) {
        loadedData = tryLoad(BAK_FILE);
        if (loadedData) source = 'bak';
      }

      if (loadedData) {
        this.data = loadedData;
        console.log(`[DB] ✅ Données chargées depuis ${source} JSON et migrées dans SQLite WAL.`);
        this.persistToSqlite();
      } else {
        console.log('[DB] Aucune base existante trouvée, initialisation des données par défaut...');
        this.seed();
      }
    }

    // Ensure integrity of schema and required properties
    let needsSave = false;

    if (!Array.isArray(this.data.rubriques) || this.data.rubriques.length === 0) {
      this.data.rubriques = defaultRubriques;
      needsSave = true;
    }
    if (!Array.isArray(this.data.files)) {
      this.data.files = [];
      needsSave = true;
    }
    if (!this.data.adminConfig) {
      this.data.adminConfig = {
        username: 'amine',
        email: 'amine.blackline@gmail.com',
        masterPassword: 'AmineAdmin2026!',
        smtp: { service: 'gmail', user: 'amine.blackline@gmail.com', pass: '' }
      };
      needsSave = true;
    }
    if (!this.data.groupLeaders || this.data.groupLeaders.length === 0) {
      this.data.groupLeaders = [
        {
          id: 'lead-1',
          username: 'delegue_g1',
          password: 'G1Password2026!',
          studentName: 'Yacine Benali',
          groupName: 'Groupe G1 - Licence 3',
          createdAt: new Date().toISOString()
        }
      ];
      needsSave = true;
    }
    if (!this.data.messages) {
      this.data.messages = [];
      needsSave = true;
    }

    // Ensure sample physical files exist on disk if missing
    if (Array.isArray(this.data.files)) {
      this.data.files.forEach(f => {
        const filePath = path.join(UPLOADS_DIR, f.filename);
        if (!fs.existsSync(filePath)) {
          const sample = sampleFiles.find(s => s.filename === f.filename);
          if (sample) {
            fs.writeFileSync(filePath, sample.content, 'utf8');
          }
        }
      });
    }

    if (needsSave) {
      this.save();
    }
  }

  seed() {
    this.data.rubriques = defaultRubriques;
    this.data.files = sampleFiles.map((sf, index) => {
      const size = createSampleFileIfNotExists(sf.filename, sf.content);
      const { content, ...meta } = sf;
      return {
        id: `file-${index + 1}`,
        ...meta,
        downloadable: sf.downloadable !== undefined ? sf.downloadable : false,
        sizeBytes: size,
        path: sf.filename
      };
    });
    this.save();
  }

  // ==========================================
  // SYNCHRONOUS PERSISTENCE (SQLite WAL + JSON Mirror)
  // ==========================================
  save() {
    try {
      // 1. Write to SQLite relational database with Write-Ahead Logging
      this.persistToSqlite();

      // 2. Write synchronous mirror to JSON files for maximum backward compatibility
      const content = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_FILE, content, 'utf8');
      fs.writeFileSync(BACKUP_FILE, content, 'utf8');
      fs.writeFileSync(BAK_FILE, content, 'utf8');

      console.log(`[DB] 💾 Données persistées (SQLite WAL + Miroir Disque) : ${this.data.rubriques.length} rubriques, ${this.data.files.length} fichiers.`);

      // 3. Persist to PostgreSQL if connected (Cloud database)
      if (this.pgPool) {
        this.persistToPostgres().catch(err => {
          console.error('[DB-PG] ❌ Erreur écriture asynchrone PostgreSQL:', err.message);
        });
      }
    } catch (err) {
      console.error('[DB] ❌ ERREUR CRITIQUE DE PERSISTANCE:', err);
    }
  }

  // ==========================================
  // RUBRIQUES CRUD
  // ==========================================
  getRubriques() {
    return this.data.rubriques.map(rub => {
      const count = this.data.files.filter(f => f.rubriqueId === rub.id).length;
      return {
        ...rub,
        filesCount: count
      };
    });
  }

  getRubriqueById(id) {
    return this.data.rubriques.find(r => r.id === id);
  }

  createRubrique(rubData) {
    const newRub = {
      id: `rub-${Date.now()}`,
      name: rubData.name.trim(),
      description: rubData.description ? rubData.description.trim() : '',
      icon: rubData.icon || 'Folder',
      color: rubData.color || 'blue',
      badge: rubData.badge || 'IT',
      sousRubriques: [],
      createdAt: new Date().toISOString()
    };
    this.data.rubriques.push(newRub);
    this.save();
    return { ...newRub, filesCount: 0 };
  }

  updateRubrique(id, rubData) {
    const idx = this.data.rubriques.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.rubriques[idx] = {
      ...this.data.rubriques[idx],
      name: rubData.name ? rubData.name.trim() : this.data.rubriques[idx].name,
      description: rubData.description !== undefined ? rubData.description.trim() : this.data.rubriques[idx].description,
      icon: rubData.icon || this.data.rubriques[idx].icon,
      color: rubData.color || this.data.rubriques[idx].color,
      badge: rubData.badge || this.data.rubriques[idx].badge,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.rubriques[idx];
  }

  deleteRubrique(id) {
    const idx = this.data.rubriques.findIndex(r => r.id === id);
    if (idx === -1) return false;
    
    const filesInRubrique = this.data.files.filter(f => f.rubriqueId === id);
    if (filesInRubrique.length > 0) {
      throw new Error(`Impossible de supprimer cette rubrique car elle contient encore ${filesInRubrique.length} fichier(s). Veuillez d'abord supprimer ou déplacer ces fichiers.`);
    }

    this.data.rubriques.splice(idx, 1);
    this.save();
    return true;
  }

  // ==========================================
  // FILES CRUD
  // ==========================================
  getFiles({ rubriqueId, sousRubriqueId, search, level, fileType, sortBy } = {}) {
    let result = [...this.data.files];

    if (rubriqueId && rubriqueId !== 'all') {
      result = result.filter(f => f.rubriqueId === rubriqueId);
    }

    if (sousRubriqueId && sousRubriqueId !== 'all') {
      result = result.filter(f => f.sousRubriqueId === sousRubriqueId);
    }

    if (level && level !== 'all') {
      result = result.filter(f => f.level && f.level.toLowerCase().includes(level.toLowerCase()));
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(f => {
        const inTitle = f.title.toLowerCase().includes(q);
        const inDesc = f.description && f.description.toLowerCase().includes(q);
        const inProf = f.professor && f.professor.toLowerCase().includes(q);
        const inTags = Array.isArray(f.tags) && f.tags.some(t => t.toLowerCase().includes(q));
        const inOrig = f.originalName && f.originalName.toLowerCase().includes(q);
        return inTitle || inDesc || inProf || inTags || inOrig;
      });
    }

    if (fileType && fileType !== 'all') {
      result = result.filter(f => {
        const ext = path.extname(f.originalName || '').toLowerCase();
        if (fileType === 'pdf') return ext === '.pdf' || f.mimeType === 'application/pdf';
        if (fileType === 'archive') return ['.zip', '.tar', '.gz', '.rar', '.7z'].includes(ext);
        if (fileType === 'code') return ['.js', '.ts', '.py', '.sh', '.cpp', '.c', '.java', '.sql', '.html', '.css', '.json'].includes(ext);
        if (fileType === 'doc') return ['.doc', '.docx', '.odt', '.txt', '.md'].includes(ext);
        if (fileType === 'slides') return ['.ppt', '.pptx', '.key', '.odp'].includes(ext);
        return true;
      });
    }

    // Attach rubrique & sous-rubrique info
    result = result.map(f => {
      const rub = this.data.rubriques.find(r => r.id === f.rubriqueId);
      const sub = rub?.sousRubriques?.find(s => s.id === f.sousRubriqueId);
      return {
        ...f,
        rubriqueName: rub ? rub.name : 'Non classé',
        rubriqueColor: rub ? rub.color : 'blue',
        sousRubriqueName: sub ? sub.name : undefined
      };
    });

    if (sortBy === 'views' || sortBy === 'downloads') {
      result.sort((a, b) => ((b.views || b.downloads || 0) - (a.views || a.downloads || 0)));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'size') {
      result.sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  getFileById(id) {
    const f = this.data.files.find(item => item.id === id);
    if (!f) return null;
    const rub = this.data.rubriques.find(r => r.id === f.rubriqueId);
    return {
      ...f,
      rubriqueName: rub ? rub.name : 'Non classé',
      rubriqueColor: rub ? rub.color : 'blue'
    };
  }

  createFile(fileData) {
    const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newFile = {
      id,
      title: fileData.title.trim(),
      rubriqueId: fileData.rubriqueId,
      sousRubriqueId: fileData.sousRubriqueId || null,
      description: fileData.description ? fileData.description.trim() : '',
      level: fileData.level || 'Tous niveaux',
      professor: fileData.professor ? fileData.professor.trim() : '',
      tags: Array.isArray(fileData.tags) ? fileData.tags : (fileData.tags ? fileData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      filename: fileData.filename,
      originalName: fileData.originalName,
      mimeType: fileData.mimeType || 'application/octet-stream',
      sizeBytes: fileData.sizeBytes || 0,
      downloads: 0,
      views: 0,
      downloadable: fileData.downloadable !== undefined ? Boolean(fileData.downloadable) : false,
      createdAt: new Date().toISOString()
    };

    this.data.files.unshift(newFile);
    this.save();
    return this.getFileById(id);
  }

  updateFile(id, updateData) {
    const idx = this.data.files.findIndex(f => f.id === id);
    if (idx === -1) return null;

    const existing = this.data.files[idx];

    if (updateData.filename && updateData.filename !== existing.filename) {
      const oldPath = path.join(UPLOADS_DIR, existing.filename);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { console.error(e); }
      }
    }

    this.data.files[idx] = {
      ...existing,
      title: updateData.title !== undefined ? updateData.title.trim() : existing.title,
      rubriqueId: updateData.rubriqueId !== undefined ? updateData.rubriqueId : existing.rubriqueId,
      sousRubriqueId: updateData.sousRubriqueId !== undefined ? updateData.sousRubriqueId : existing.sousRubriqueId,
      description: updateData.description !== undefined ? updateData.description.trim() : existing.description,
      level: updateData.level !== undefined ? updateData.level : existing.level,
      professor: updateData.professor !== undefined ? updateData.professor.trim() : existing.professor,
      tags: updateData.tags !== undefined ? (Array.isArray(updateData.tags) ? updateData.tags : updateData.tags.split(',').map(t => t.trim()).filter(Boolean)) : existing.tags,
      filename: updateData.filename || existing.filename,
      originalName: updateData.originalName || existing.originalName,
      mimeType: updateData.mimeType || existing.mimeType,
      sizeBytes: updateData.sizeBytes !== undefined ? updateData.sizeBytes : existing.sizeBytes,
      downloadable: updateData.downloadable !== undefined ? Boolean(updateData.downloadable) : existing.downloadable,
      updatedAt: new Date().toISOString()
    };

    this.save();
    return this.getFileById(id);
  }

  deleteFile(id) {
    const idx = this.data.files.findIndex(f => f.id === id);
    if (idx === -1) return false;

    const file = this.data.files[idx];
    const physicalPath = path.join(UPLOADS_DIR, file.filename);
    if (fs.existsSync(physicalPath)) {
      try {
        fs.unlinkSync(physicalPath);
      } catch (err) {
        console.error('Erreur suppression physique fichier:', err);
      }
    }

    this.data.files.splice(idx, 1);
    this.save();
    return true;
  }

  incrementViews(id) {
    const file = this.data.files.find(f => f.id === id);
    if (file) {
      file.views = (file.views || 0) + 1;
      this.save();
      return file.views;
    }
    return 0;
  }

  incrementDownloads(id) {
    return this.incrementViews(id);
  }

  // ==========================================
  // SOUS-RUBRIQUES
  // ==========================================
  addSousRubrique(rubriqueId, subData) {
    const rub = this.data.rubriques.find(r => r.id === rubriqueId);
    if (!rub) throw new Error('Rubrique introuvable');
    if (!rub.sousRubriques) rub.sousRubriques = [];

    const newSub = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      rubriqueId,
      name: (subData.name || '').trim(),
      description: subData.description ? subData.description.trim() : ''
    };
    rub.sousRubriques.push(newSub);
    this.save();
    return newSub;
  }

  deleteSousRubrique(rubriqueId, subId) {
    const rub = this.data.rubriques.find(r => r.id === rubriqueId);
    if (!rub || !rub.sousRubriques) return false;
    rub.sousRubriques = rub.sousRubriques.filter(s => s.id !== subId);
    this.data.files.forEach(f => {
      if (f.sousRubriqueId === subId) {
        f.sousRubriqueId = null;
      }
    });
    this.save();
    return true;
  }

  // ==========================================
  // GROUP LEADERS (RESPONSABLES DE GROUPE)
  // ==========================================
  getGroupLeaders() {
    return (this.data.groupLeaders || []).map(({ password, ...rest }) => rest);
  }

  createGroupLeader({ username, password, studentName, groupName }) {
    if (!username || !password || !groupName) {
      throw new Error('Identifiant, mot de passe et nom de groupe requis.');
    }
    const cleanUser = username.trim().toLowerCase();
    if (!this.data.groupLeaders) this.data.groupLeaders = [];
    const exists = this.data.groupLeaders.some(l => l.username.toLowerCase() === cleanUser);
    if (exists) {
      throw new Error('Un responsable avec cet identifiant existe déjà.');
    }

    const newLeader = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      username: username.trim(),
      password: password.trim(),
      studentName: (studentName || 'Responsable de Groupe').trim(),
      groupName: groupName.trim(),
      createdAt: new Date().toISOString()
    };

    this.data.groupLeaders.push(newLeader);
    this.save();

    const { password: _, ...safe } = newLeader;
    return safe;
  }

  deleteGroupLeader(id) {
    if (!this.data.groupLeaders) return false;
    const initialLen = this.data.groupLeaders.length;
    this.data.groupLeaders = this.data.groupLeaders.filter(l => l.id !== id);
    if (this.data.groupLeaders.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  verifyGroupLeader(username, password) {
    if (!this.data.groupLeaders) return null;
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const found = this.data.groupLeaders.find(
      l => l.username.toLowerCase() === cleanUser && (l.password === cleanPass || bcrypt.compareSync(cleanPass, l.password || ''))
    );
    if (!found) return null;
    const { password: _, ...safe } = found;
    return safe;
  }

  // ==========================================
  // MESSAGES
  // ==========================================
  getMessages(leaderId = null) {
    const list = this.data.messages || [];
    if (leaderId) {
      return list.filter(m => m.leaderId === leaderId);
    }
    return list;
  }

  createMessage({ leaderId, leaderName, groupName, subject, content }) {
    if (!subject || !content) {
      throw new Error('Objet et message obligatoires.');
    }
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      leaderId: leaderId || 'anonymous',
      leaderName: leaderName || 'Délégué de groupe',
      groupName: groupName || 'Groupe',
      subject: subject.trim(),
      content: content.trim(),
      reply: null,
      repliedAt: null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (!this.data.messages) this.data.messages = [];
    this.data.messages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  replyMessage(id, replyText) {
    if (!this.data.messages) return null;
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) return null;

    msg.reply = replyText.trim();
    msg.repliedAt = new Date().toISOString();
    msg.status = 'replied';
    this.save();
    return msg;
  }

  getStats() {
    const totalFiles = this.data.files.length;
    const totalRubriques = this.data.rubriques.length;
    const totalViews = this.data.files.reduce((acc, f) => acc + (f.views || f.downloads || 0), 0);
    const totalSizeBytes = this.data.files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);
    return {
      totalFiles,
      totalRubriques,
      totalViews,
      totalDownloads: totalViews,
      totalSizeBytes,
      visitorCount: this.data.visitorCount || 0
    };
  }

  getAdminConfig() {
    return this.data.adminConfig;
  }

  updateAdminConfig(newConfig) {
    this.data.adminConfig = {
      ...this.data.adminConfig,
      ...newConfig,
      smtp: {
        ...(this.data.adminConfig?.smtp || {}),
        ...(newConfig?.smtp || {})
      }
    };
    this.save();
    return this.data.adminConfig;
  }

  setDynamicOtp(otp) {
    this.data.dynamicAuth = {
      username: otp.username,
      password: otp.password,
      expiresAt: otp.expiresAt,
      createdAt: otp.createdAt,
      recipient: otp.recipient || this.data.adminConfig?.email || 'amine.blackline@gmail.com',
      used: false
    };
    this.save();
    return this.data.dynamicAuth;
  }

  getDynamicOtp() {
    return this.data.dynamicAuth;
  }

  verifyDynamicOtp(username, password) {
    const current = this.data.dynamicAuth;
    if (!current) {
      return { valid: false, reason: 'Aucun code temporaire actif. Veuillez en demander un nouveau.' };
    }

    if (Date.now() > current.expiresAt) {
      this.data.dynamicAuth = null;
      this.save();
      return { valid: false, reason: 'Ces identifiants dynamiques ont expiré (validité 10 minutes).' };
    }

    if (current.used) {
      return { valid: false, reason: 'Ces identifiants ont déjà été utilisés.' };
    }

    const matchUser = current.username.toLowerCase() === (username || '').trim().toLowerCase();
    const matchPass = current.password === (password || '').trim();

    if (matchUser && matchPass) {
      current.used = true;
      this.save();
      return { valid: true };
    }

    return { valid: false, reason: 'Nom d\'utilisateur ou mot de passe temporaire incorrect.' };
  }

  verifyMasterAdmin(username, password) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const masterUser = (process.env.ADMIN_MASTER_USERNAME || this.data.adminConfig?.username || 'amine').toLowerCase();
    const masterPass = process.env.ADMIN_MASTER_PASSWORD || this.data.adminConfig?.masterPassword || 'AmineAdmin2026!';

    const isUserValid = cleanUser === masterUser || cleanUser === 'admin';
    const isPassValid = cleanPass === masterPass || (cleanPass && bcrypt.compareSync(cleanPass, masterPass));

    return isUserValid && isPassValid;
  }

  verifyAdmin(username, password) {
    return this.verifyMasterAdmin(username, password);
  }

  // ==========================================
  // VISITORS
  // ==========================================
  getVisitorCount() {
    return this.data.visitorCount || 0;
  }

  incrementVisitor(sessionId) {
    if (!this.data.lastVisitors) this.data.lastVisitors = [];
    const now = Date.now();
    const recent = this.data.lastVisitors.find(v => v.id === sessionId && (now - v.ts) < 86400000);
    if (!recent) {
      this.data.visitorCount = (this.data.visitorCount || 0) + 1;
      this.data.lastVisitors.push({ id: sessionId, ts: now });
      if (this.data.lastVisitors.length > 500) {
        this.data.lastVisitors = this.data.lastVisitors.slice(-500);
      }
      this.save();
      return true;
    }
    return false;
  }

  // ==========================================
  // EXPORT / IMPORT DATABASE (BACKUP & RESTORE)
  // ==========================================
  exportDatabase() {
    const clone = JSON.parse(JSON.stringify(this.data));
    if (clone.adminConfig) {
      if (clone.adminConfig.masterPassword) {
        clone.adminConfig.masterPassword = '[PROTECTED]';
      }
      if (clone.adminConfig.smtp && clone.adminConfig.smtp.pass) {
        clone.adminConfig.smtp.pass = '[PROTECTED]';
      }
    }
    if (Array.isArray(clone.groupLeaders)) {
      clone.groupLeaders = clone.groupLeaders.map(({ password, ...rest }) => rest);
    }
    return JSON.stringify(clone, null, 2);
  }

  importDatabase(imported) {
    if (!imported || typeof imported !== 'object') {
      throw new Error('Format de données JSON invalide.');
    }
    if (!Array.isArray(imported.rubriques)) {
      throw new Error('La sauvegarde doit obligatoirement contenir une liste de rubriques.');
    }

    try {
      const safetyBackup = path.join(DATA_DIR, `database.pre-import-${Date.now()}.json`);
      fs.writeFileSync(safetyBackup, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (_) {}

    const currentAdmin = this.data.adminConfig || {};
    const importedAdmin = imported.adminConfig || {};
    if (!importedAdmin.masterPassword || importedAdmin.masterPassword === '[PROTECTED]') {
      importedAdmin.masterPassword = currentAdmin.masterPassword || 'AmineAdmin2026!';
    }
    if (!importedAdmin.smtp?.pass || importedAdmin.smtp?.pass === '[PROTECTED]') {
      if (importedAdmin.smtp) {
        importedAdmin.smtp.pass = currentAdmin.smtp?.pass || '';
      }
    }
    imported.adminConfig = importedAdmin;

    this.data = {
      ...this.data,
      ...imported,
      rubriques: imported.rubriques,
      files: Array.isArray(imported.files) ? imported.files : this.data.files
    };
    this.save();
    return true;
  }
}

export const db = new Database();
