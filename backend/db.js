import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
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
    color: 'red', // red accent
    badge: 'Urgent & Critique',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'rub-web',
    name: 'Développement Web & Mobile',
    description: 'Architecture frontend & backend, API REST, React, Node.js, TypeScript et mobile.',
    icon: 'Code2',
    color: 'blue', // electric blue
    badge: 'Fullstack',
    createdAt: '2026-09-02T08:00:00.000Z'
  },
  {
    id: 'rub-reseaux',
    name: 'Réseaux & Télécommunications',
    description: 'Modèle OSI, protocoles TCP/IP, routage Cisco/Juniper, VLAN et sous-réseaux.',
    icon: 'Network',
    color: 'cyan', // electric cyan
    badge: 'Infrastructure',
    createdAt: '2026-09-03T08:00:00.000Z'
  },
  {
    id: 'rub-linux',
    name: "Systèmes d'Exploitation & Linux",
    description: 'Administration système Linux/UNIX, Bash scripting, ordonnancement et kernel.',
    icon: 'Terminal',
    color: 'blue',
    badge: 'SysAdmin',
    createdAt: '2026-09-04T08:00:00.000Z'
  },
  {
    id: 'rub-cloud',
    name: 'Cloud Computing & DevOps',
    description: 'Docker, conteneurs, Kubernetes, CI/CD, Terraform et déploiement cloud AWS/GCP.',
    icon: 'Cloud',
    color: 'red', // red accent
    badge: 'DevOps',
    createdAt: '2026-09-05T08:00:00.000Z'
  },
  {
    id: 'rub-bdd',
    name: 'Bases de Données & Big Data',
    description: 'SQL relationnel avancé, NoSQL MongoDB/Redis, modélisation Merise et optimisation.',
    icon: 'Database',
    color: 'cyan',
    badge: 'Données',
    createdAt: '2026-09-06T08:00:00.000Z'
  },
  {
    id: 'rub-algo',
    name: 'Algorithmique & Structures de Données',
    description: 'Complexité algorithmique O(n), arbres, graphes, programmation dynamique Python/C++.',
    icon: 'Cpu',
    color: 'blue',
    badge: 'Fondamentaux',
    createdAt: '2026-09-07T08:00:00.000Z'
  },
  {
    id: 'rub-ia',
    name: 'Intelligence Artificielle & Machine Learning',
    description: 'Réseaux de neurones, LLM, apprentissage supervisé, PyTorch et vision par ordinateur.',
    icon: 'Sparkles',
    color: 'red',
    badge: 'Innovation',
    createdAt: '2026-09-08T08:00:00.000Z'
  }
];

// Helper to create initial sample files on disk if not present
function createSampleFileIfNotExists(filename, content) {
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  const stats = fs.statSync(filePath);
  return stats.size;
}

const sampleFiles = [
  {
    filename: 'cours-securite-reseaux-firewall.txt',
    originalName: 'Cours_Securite_Reseaux_Firewalls_v2.pdf',
    title: 'Architecture Pare-feu & Détection d\'Intrusions (IDS/IPS)',
    rubriqueId: 'rub-securite',
    description: 'Guide complet sur la mise en place de zones DMZ, règles iptables, inspection avec Suricata et Snort.',
    level: 'Master 1',
    professor: 'Dr. Marc Valery (Cybersécurité)',
    tags: ['Pare-feu', 'Suricata', 'iptables', 'DMZ', 'Sécurité'],
    mimeType: 'application/pdf',
    downloads: 142,
    createdAt: '2026-10-15T10:30:00.000Z',
    content: `# CYBERSÉCURITÉ : ARCHITECTURE PARE-FEU & IDS/IPS
Module : Sécurité Réseaux Avancée
Année Universitaire 2026-2027

1. Introduction aux Zones Sécurisées
- Définition d'une DMZ (Demilitarized Zone)
- Séparation des flux WAN / LAN / DMZ

2. Configuration des règles de filtrage (Netfilter / iptables)
- Tables : filter, nat, mangle
- Chaînes par défaut : INPUT, OUTPUT, FORWARD
- Exemple de politique par défaut restrictive :
    iptables -P INPUT DROP
    iptables -P FORWARD DROP
    iptables -P OUTPUT ACCEPT

3. Systèmes de détection d'intrusions (IDS / IPS)
- Snort vs Suricata : multi-threading et signatures
- Détection d'anomalies comportementales vs basée sur les signatures

4. Travaux Dirigés & Exercices
- Analyse d'un dump PCAP avec Wireshark
- Détection d'un scan Nmap SYN (-sS)
`
  },
  {
    filename: 'tp-api-rest-nodejs.js',
    originalName: 'TP_API_REST_Express_TypeScript.zip',
    title: 'TP Pratique : API REST Sécurisée avec Express & JWT',
    rubriqueId: 'rub-web',
    description: 'Sujet et code source complet pour concevoir une API REST avec authentification token JWT et validation Zod.',
    level: 'Licence 3',
    professor: 'Prof. Sarah Benali',
    tags: ['Node.js', 'Express', 'JWT', 'TypeScript', 'REST API'],
    mimeType: 'application/zip',
    downloads: 289,
    createdAt: '2026-10-18T14:15:00.000Z',
    content: `// TP - Conception d'une API RESTful
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
`
  },
  {
    filename: 'cheatsheet-cisco-routage.txt',
    originalName: 'Cheatsheet_Cisco_Routage_OSPF_BGP.pdf',
    title: 'Aide-Mémoire Cisco IOS : Routage OSPF & VLANs',
    rubriqueId: 'rub-reseaux',
    description: 'Synthèse des commandes CLI Cisco Catalyst pour configurer le trunk 802.1Q, inter-vlan et OSPF multi-aires.',
    level: 'Licence 2',
    professor: 'Ing. Thomas Lefebvre',
    tags: ['Cisco', 'OSPF', 'VLAN', 'Trunk', 'CLI'],
    mimeType: 'application/pdf',
    downloads: 312,
    createdAt: '2026-10-20T09:00:00.000Z',
    content: `CISCO IOS CHEATSHEET - ROUTAGE & COMMUTATION
==============================================
1. Configuration VLAN & Trunk 802.1Q
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name GESTION_IT
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30

2. Routage Dynamique OSPF
Router(config)# router ospf 1
Router(config-router)# network 192.168.10.0 0.0.0.255 area 0
Router(config-router)# passive-interface default
Router(config-router)# no passive-interface gigabitethernet 0/0
`
  },
  {
    filename: 'cours-docker-k8s.txt',
    originalName: 'DevOps_Docker_Kubernetes_Architecture.pdf',
    title: 'Conteneurisation Docker & Orchestration Kubernetes',
    rubriqueId: 'rub-cloud',
    description: 'Introduction aux Dockerfile multi-stage, Docker Compose, Pods, Deployments et Services Kubernetes.',
    level: 'Master 2',
    professor: 'Alexandre Roux (Cloud Architect)',
    tags: ['Docker', 'Kubernetes', 'K8s', 'DevOps', 'Containers'],
    mimeType: 'application/pdf',
    downloads: 195,
    createdAt: '2026-10-22T16:45:00.000Z',
    content: `# CONTENEURISATION & ORCHESTRATION MODERNE
Architecture Microservices avec Docker et Kubernetes

1. Bonnes pratiques Dockerfile :
- Utiliser des images de base minimales (alpine ou distroless)
- Multi-stage build pour séparer le compilateur du runtime de production
- Exécuter sous un utilisateur non-root (USER 1001)

2. Déploiement Kubernetes :
apiVersion: apps/v1
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
        - containerPort: 5000
`
  },
  {
    filename: 'cours-linux-bash-scripting.sh',
    originalName: 'Support_Linux_Bash_Administration.sh',
    title: 'Scripting Bash Avancé pour Administrateurs Systèmes',
    rubriqueId: 'rub-linux',
    description: 'Scripts de surveillance de charge, rotation automatique des journaux et audit de sécurité des comptes utilisateurs.',
    level: 'Licence 2',
    professor: 'Dr. Marc Valery',
    tags: ['Linux', 'Bash', 'SysAdmin', 'Cron', 'Automatisation'],
    mimeType: 'text/x-shellscript',
    downloads: 164,
    createdAt: '2026-10-25T11:20:00.000Z',
    content: `#!/usr/bin/env bash
# Script de monitoring système pour serveurs Linux de cours
set -euo pipefail

echo "=== RAPPORT SYSTÈME DU SERVEUR IT ==="
echo "Date : $(date)"
echo "Charge CPU : $(uptime | awk -F'load average:' '{ print $2 }')"
echo "Mémoire RAM libre :"
free -h | grep "Mem:"
echo "Espace disque / :"
df -h / | awk 'NR==2 {print "Utilisé: " $3 " / Total: " $2 " (" $5 ")"}'
`
  }
];

class Database {
  constructor() {
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
      dynamicAuth: null
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);

        // Ensure robust security and email configuration in DB
        if (!this.data.adminConfig) {
          this.data.adminConfig = {};
        }
        if (!this.data.adminConfig.email) {
          this.data.adminConfig.email = 'amine.blackline@gmail.com';
        }
        if (!this.data.adminConfig.username) {
          this.data.adminConfig.username = 'amine';
        }
        if (!this.data.adminConfig.masterPassword) {
          this.data.adminConfig.masterPassword = 'AmineAdmin2026!';
        }
        if (!this.data.adminConfig.smtp) {
          this.data.adminConfig.smtp = {
            service: 'gmail',
            user: 'amine.blackline@gmail.com',
            pass: ''
          };
        }
        if (typeof this.data.dynamicAuth === 'undefined') {
          this.data.dynamicAuth = null;
        }

        // Ensure group leaders and messages collections exist
        let needsSave = false;
        if (!this.data.groupLeaders) {
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

        // Ensure sous-rubriques exist on all rubriques
        if (Array.isArray(this.data.rubriques)) {
          this.data.rubriques.forEach(r => {
            if (!r.sousRubriques) {
              r.sousRubriques = [];
              if (r.id === 'rub-securite') {
                r.sousRubriques = [
                  { id: 'sub-sec-1', name: 'Cryptographie & Protocoles', description: 'Chiffrement symétrique/asymétrique, RSA, AES' },
                  { id: 'sub-sec-2', name: 'Sécurité Réseaux & Pare-feu', description: 'IPTables, IDS/IPS, VPN, DMZ' },
                  { id: 'sub-sec-3', name: 'Ethical Hacking & Pentesting', description: 'Audits de sécurité, tests d\'intrusion' }
                ];
                needsSave = true;
              } else if (r.id === 'rub-web') {
                r.sousRubriques = [
                  { id: 'sub-web-1', name: 'Frontend React & TypeScript', description: 'Composants modernes, Hooks, Tailwind' },
                  { id: 'sub-web-2', name: 'Backend Node.js & API REST', description: 'Express, JWT, architectures microservices' }
                ];
                needsSave = true;
              } else if (r.id === 'rub-reseaux') {
                r.sousRubriques = [
                  { id: 'sub-res-1', name: 'Routage & Commutation Cisco', description: 'OSPF, BGP, VLANs, Spanning-Tree' },
                  { id: 'sub-res-2', name: 'Protocoles TCP/IP & Services', description: 'DNS, DHCP, HTTP/3, Wireshark' }
                ];
                needsSave = true;
              } else if (r.id === 'rub-linux') {
                r.sousRubriques = [
                  { id: 'sub-lin-1', name: 'Administration Système', description: 'Gestion des utilisateurs, permissions, services systemd' },
                  { id: 'sub-lin-2', name: 'Scripting Bash & Automatisation', description: 'Scripts avancés, cron jobs, parsing de logs' }
                ];
                needsSave = true;
              }
            }
          });
        }

        // Ensure sample physical files exist on disk if missing on container boot
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
      } catch (err) {
        console.error('Erreur lecture DB, réinitialisation...', err);
        this.seed();
      }
    } else {
      this.seed();
    }
  }

  seed() {
    this.data.rubriques = defaultRubriques;
    
    // Seed initial files and create physical files
    this.data.files = sampleFiles.map((sf, index) => {
      const size = createSampleFileIfNotExists(sf.filename, sf.content);
      const { content, ...meta } = sf;
      return {
        id: `file-${index + 1}`,
        ...meta,
        sizeBytes: size,
        path: sf.filename
      };
    });

    this.save();
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Erreur de sauvegarde de la base de données:', err);
    }
  }

  // RUBRIQUES CRUD
  getRubriques() {
    // augment with file counts
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
      color: rubData.color || 'blue', // 'blue' or 'red' or 'cyan'
      badge: rubData.badge || 'IT',
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
    
    // Check if any files belong to this rubrique
    const filesInRubrique = this.data.files.filter(f => f.rubriqueId === id);
    if (filesInRubrique.length > 0) {
      throw new Error(`Impossible de supprimer cette rubrique car elle contient encore ${filesInRubrique.length} fichier(s). Veuillez d'abord supprimer ou déplacer ces fichiers.`);
    }

    this.data.rubriques.splice(idx, 1);
    this.save();
    return true;
  }

  // FILES CRUD
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

    // Sorting
    if (sortBy === 'views' || sortBy === 'downloads') {
      result.sort((a, b) => ((b.views || b.downloads || 0) - (a.views || a.downloads || 0)));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'size') {
      result.sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0));
    } else {
      // Default: newest first
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
      rubriqueId: fileData.rubriqueId, // Mandatory rubrique!
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

    // If a new physical file was uploaded during edit, delete old file from disk
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

  // SOUS-RUBRIQUES METHODS
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
    // Unassign from files
    this.data.files.forEach(f => {
      if (f.sousRubriqueId === subId) {
        f.sousRubriqueId = null;
      }
    });
    this.save();
    return true;
  }

  // GROUP LEADERS (Responsables de groupe)
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
      l => l.username.toLowerCase() === cleanUser && l.password === cleanPass
    );
    if (!found) return null;
    const { password: _, ...safe } = found;
    return safe;
  }

  // MESSAGES (Communication Responsables de groupe -> Admin)
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
      totalSizeBytes
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
    const isPassValid = cleanPass === masterPass;

    return isUserValid && isPassValid;
  }

  verifyAdmin(username, password) {
    return this.verifyMasterAdmin(username, password);
  }
}

export const db = new Database();
