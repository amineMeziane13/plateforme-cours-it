import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.js';
import { 
  ADMIN_EMAIL, 
  generateDynamicCredentials, 
  verifyDynamicCredentials, 
  sendDynamicCredentialsEmail 
} from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static serving for uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Sanitize filename & retain extension
    const ext = path.extname(file.originalname);
    const cleanBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${uuidv4().substring(0, 8)}`;
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB max
});

// ==========================================
// ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'IT Course Platform API',
    timestamp: new Date().toISOString()
  });
});

// Platform Stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
  }
});

// Request dynamic credentials sent to amine.blackline@gmail.com
app.post('/api/auth/request-dynamic-login', async (req, res) => {
  try {
    const credentials = generateDynamicCredentials();
    const emailResult = await sendDynamicCredentialsEmail(credentials);

    res.json({
      success: true,
      recipient: ADMIN_EMAIL,
      emailSent: emailResult.sent,
      simulated: !!emailResult.simulated,
      message: emailResult.sent 
        ? `Identifiants dynamiques sécurisés envoyés avec succès à ${ADMIN_EMAIL}.` 
        : `Service SMTP non configuré sur Render. Identifiants générés en mémoire.`,
      expiresInMinutes: 10
    });
  } catch (error) {
    console.error('Erreur génération identifiants:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des accès sécurisés.' });
  }
});

// Admin Authentication (Dynamic Credentials & Master Password)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis.' });
  }

  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // 1. Check dynamic temporary credentials sent to amine.blackline@gmail.com
  const dynamicCheck = verifyDynamicCredentials(cleanUser, cleanPass);
  if (dynamicCheck.valid) {
    return res.json({
      success: true,
      token: 'admin-dynamic-token-' + Date.now(),
      user: { 
        username: username, 
        role: 'ADMINISTRATEUR',
        email: ADMIN_EMAIL,
        authType: 'DYNAMIC_EMAIL_OTP'
      }
    });
  }

  // 2. Master administrator password for Amine (secure, never prefilled, checked against DB or env)
  if (db.verifyMasterAdmin(cleanUser, cleanPass)) {
    const adminConfig = db.getAdminConfig();
    return res.json({
      success: true,
      token: 'admin-master-token-' + Date.now(),
      user: { 
        username: adminConfig.username || 'amine', 
        role: 'ADMINISTRATEUR',
        email: adminConfig.email || ADMIN_EMAIL,
        authType: 'MASTER'
      }
    });
  }

  return res.status(401).json({ 
    error: dynamicCheck.reason || 'Identifiants incorrects. Veuillez utiliser le code reçu par email ou votre mot de passe administrateur.' 
  });
});

// Admin Settings: get configuration (masked password)
app.get('/api/admin/settings', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Non autorisé.' });

  const config = db.getAdminConfig();
  res.json({
    username: config.username || 'amine',
    email: config.email || 'amine.blackline@gmail.com',
    smtp: {
      service: config.smtp?.service || 'gmail',
      user: config.smtp?.user || '',
      hasPass: !!(config.smtp?.pass || process.env.EMAIL_PASS)
    }
  });
});

// Admin Settings: update configuration directly in database.json
app.put('/api/admin/settings', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Non autorisé.' });

  const { email, smtpPass, masterPassword } = req.body;
  const updates = {};
  if (email) updates.email = email.trim();
  if (masterPassword) updates.masterPassword = masterPassword.trim();
  if (typeof smtpPass !== 'undefined') {
    updates.smtp = {
      pass: smtpPass.trim()
    };
  }

  const updated = db.updateAdminConfig(updates);
  res.json({
    success: true,
    message: 'Configuration SMTP et sécurité mise à jour dans la base de données.',
    config: {
      username: updated.username,
      email: updated.email,
      smtp: {
        service: updated.smtp?.service,
        user: updated.smtp?.user,
        hasPass: !!updated.smtp?.pass
      }
    }
  });
});

// ==========================================
// RUBRIQUES (CATEGORIES)
// ==========================================

// Get all rubriques with file counts
app.get('/api/rubriques', (req, res) => {
  try {
    const rubriques = db.getRubriques();
    res.json(rubriques);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rubriques.' });
  }
});

// Create new rubrique (Admin)
app.post('/api/rubriques', (req, res) => {
  try {
    const { name, description, icon, color, badge } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Le nom de la rubrique est obligatoire.' });
    }

    const created = db.createRubrique({ name, description, icon, color, badge });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur lors de la création de la rubrique.' });
  }
});

// Update rubrique (Admin)
app.put('/api/rubriques/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, color, badge } = req.body;
    const updated = db.updateRubrique(id, { name, description, icon, color, badge });
    if (!updated) {
      return res.status(404).json({ error: 'Rubrique introuvable.' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur lors de la modification de la rubrique.' });
  }
});

// Delete rubrique (Admin)
app.delete('/api/rubriques/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteRubrique(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Rubrique introuvable.' });
    }
    res.json({ success: true, message: 'Rubrique supprimée avec succès.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add sous-rubrique (Admin)
app.post('/api/rubriques/:id/sous-rubriques', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom de la sous-rubrique est requis.' });
    }
    const created = db.addSousRubrique(id, { name, description });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete sous-rubrique (Admin)
app.delete('/api/rubriques/:id/sous-rubriques/:subId', (req, res) => {
  try {
    const { id, subId } = req.params;
    const deleted = db.deleteSousRubrique(id, subId);
    if (!deleted) {
      return res.status(404).json({ error: 'Sous-rubrique introuvable.' });
    }
    res.json({ success: true, message: 'Sous-rubrique supprimée avec succès.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// GROUP LEADERS (RESPONSABLES DE GROUPE) & MESSAGING
// ==========================================

// Leader Login
app.post('/api/leaders/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis.' });
  }
  const leader = db.verifyGroupLeader(username, password);
  if (!leader) {
    return res.status(401).json({ error: 'Identifiant ou mot de passe délégué incorrect.' });
  }
  res.json({
    success: true,
    token: 'leader-token-' + leader.id + '-' + Date.now(),
    leader
  });
});

// Leader Get Messages
app.get('/api/leaders/messages', (req, res) => {
  const { leaderId } = req.query;
  const messages = db.getMessages(leaderId);
  res.json(messages);
});

// Leader Send Message
app.post('/api/leaders/messages', (req, res) => {
  try {
    const { leaderId, leaderName, groupName, subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ error: 'Objet et message requis.' });
    }
    const msg = db.createMessage({ leaderId, leaderName, groupName, subject, content });
    res.status(201).json(msg);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Get Group Leaders
app.get('/api/admin/leaders', (req, res) => {
  res.json(db.getGroupLeaders());
});

// Admin Create Group Leader
app.post('/api/admin/leaders', (req, res) => {
  try {
    const { username, password, studentName, groupName } = req.body;
    const created = db.createGroupLeader({ username, password, studentName, groupName });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Delete Group Leader
app.delete('/api/admin/leaders/:id', (req, res) => {
  const success = db.deleteGroupLeader(req.params.id);
  if (!success) return res.status(404).json({ error: 'Responsable introuvable.' });
  res.json({ success: true });
});

// Admin Get All Messages from Leaders
app.get('/api/admin/messages', (req, res) => {
  res.json(db.getMessages());
});

// Admin Reply Message
app.post('/api/admin/messages/:id/reply', (req, res) => {
  const { reply } = req.body;
  if (!reply || !reply.trim()) {
    return res.status(400).json({ error: 'Réponse vide.' });
  }
  const updated = db.replyMessage(req.params.id, reply);
  if (!updated) return res.status(404).json({ error: 'Message introuvable.' });
  res.json(updated);
});

// ==========================================
// FILES (COURSES, DOCUMENTS, TDS, TPS)
// ==========================================

// Get files with filtering and search
app.get('/api/files', (req, res) => {
  try {
    const { rubriqueId, search, level, fileType, sortBy } = req.query;
    const files = db.getFiles({ rubriqueId, search, level, fileType, sortBy });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des fichiers.' });
  }
});

// Get single file details
app.get('/api/files/:id', (req, res) => {
  try {
    const file = db.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'Fichier introuvable.' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du fichier.' });
  }
});

// Create/Upload new file under a rubrique
app.post('/api/files', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Veuillez sélectionner un fichier à déposer.' });
    }

    const { title, rubriqueId, description, level, professor, tags } = req.body;

    if (!title || title.trim() === '') {
      // Remove uploaded file if title is missing
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Le titre du fichier ou du cours est obligatoire.' });
    }

    if (!rubriqueId || rubriqueId.trim() === '') {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'L\'administrateur doit obligatoirement classer le fichier sous une rubrique.' });
    }

    // Verify rubrique exists
    const rub = db.getRubriqueById(rubriqueId);
    if (!rub) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'La rubrique sélectionnée n\'existe pas.' });
    }

    const newFile = db.createFile({
      title,
      rubriqueId,
      description,
      level,
      professor,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : (tags || []),
      filename: req.file.filename,
      originalName: Buffer.from(req.file.originalname, 'latin1').toString('utf8'), // handle utf8 accented characters
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur serveur lors du dépôt du fichier.' });
  }
});

// Update/Modify file metadata (and optionally replace attached document)
app.put('/api/files/:id', upload.single('file'), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getFileById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Fichier introuvable.' });
    }

    const { title, rubriqueId, description, level, professor, tags } = req.body;

    // Validate rubrique if changed
    if (rubriqueId) {
      const rub = db.getRubriqueById(rubriqueId);
      if (!rub) {
        return res.status(400).json({ error: 'La rubrique cible n\'existe pas.' });
      }
    }

    const updatePayload = {
      title,
      rubriqueId,
      description,
      level,
      professor,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : tags
    };

    if (req.file) {
      updatePayload.filename = req.file.filename;
      updatePayload.originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      updatePayload.mimeType = req.file.mimetype;
      updatePayload.sizeBytes = req.file.size;
    }

    const updated = db.updateFile(id, updatePayload);
    res.json(updated);
  } catch (error) {
    console.error('Erreur modification:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du fichier.' });
  }
});

// Delete file
app.delete('/api/files/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteFile(id);
    if (!success) {
      return res.status(404).json({ error: 'Fichier introuvable ou déjà supprimé.' });
    }
    res.json({ success: true, message: 'Fichier supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du fichier.' });
  }
});

// Download file - Disabled by pedagogical policy (viewing/reading on platform only)
app.get('/api/files/:id/download', (req, res) => {
  res.status(403).json({
    error: 'Le téléchargement direct des fichiers est désactivé. Veuillez consulter le cours en mode lecture interactive et sécurisée sur la plateforme.'
  });
});

// View / Preview file inline (text, code, pdf, image) with view counter increment
app.get(['/api/files/:id/preview', '/api/files/:id/view'], (req, res) => {
  try {
    const { id } = req.params;
    const file = db.getFileById(id);
    if (!file) {
      return res.status(404).json({ error: 'Fichier introuvable' });
    }

    const physicalPath = path.join(UPLOADS_DIR, file.filename);
    if (!fs.existsSync(physicalPath)) {
      return res.status(404).json({ error: 'Fichier physique introuvable' });
    }

    // Increment view / read count
    db.incrementViews(id);

    const ext = path.extname(file.originalName || file.filename).toLowerCase();
    
    // Check if file is text/code so we can send as text or utf8
    const textExts = ['.txt', '.sh', '.py', '.js', '.ts', '.sql', '.html', '.css', '.json', '.md', '.c', '.cpp', '.java'];
    if (textExts.includes(ext)) {
      const content = fs.readFileSync(physicalPath, 'utf8');
      return res.json({
        type: 'text',
        language: ext.replace('.', ''),
        title: file.title,
        content
      });
    }

    // For PDF and images, stream directly with appropriate inline content-type & security headers
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, max-age=3600');

    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
      res.setHeader('Content-Type', file.mimeType || 'image/png');
    }

    fs.createReadStream(physicalPath).pipe(res);
  } catch (error) {
    console.error('Erreur prévisualisation:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du document.' });
  }
});

// Serve frontend dist when built
const FRONTEND_DIST = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Serveur IT Course Platform démarré sur http://localhost:${PORT}`);
});
