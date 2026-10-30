import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.js';

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

// Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis.' });
  }

  if (db.verifyAdmin(username, password)) {
    // Return a session token simulation
    return res.json({
      success: true,
      token: 'admin-session-token-' + Date.now(),
      user: { username: 'admin', role: 'ADMINISTRATEUR' }
    });
  }

  return res.status(401).json({ error: 'Identifiants incorrects. Mot de passe par défaut : admin123' });
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

// Download file (with counter increment)
app.get('/api/files/:id/download', (req, res) => {
  try {
    const { id } = req.params;
    const file = db.getFileById(id);
    if (!file) {
      return res.status(404).send('Fichier introuvable.');
    }

    const physicalPath = path.join(UPLOADS_DIR, file.filename);
    if (!fs.existsSync(physicalPath)) {
      return res.status(404).send('Le document physique n\'existe plus sur le serveur.');
    }

    // Increment download count
    db.incrementDownloads(id);

    // Prompt browser download with original name
    res.download(physicalPath, file.originalName);
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).send('Erreur serveur lors du téléchargement.');
  }
});

// Preview file inline (text, code, pdf, image)
app.get('/api/files/:id/preview', (req, res) => {
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

    const ext = path.extname(file.originalName || file.filename).toLowerCase();
    
    // Check if file is text/code so we can send as text or utf8
    const textExts = ['.txt', '.sh', '.py', '.js', '.ts', '.sql', '.html', '.css', '.json', '.md'];
    if (textExts.includes(ext)) {
      const content = fs.readFileSync(physicalPath, 'utf8');
      return res.json({
        type: 'text',
        language: ext.replace('.', ''),
        content
      });
    }

    // For PDF and images, stream directly with appropriate inline content-type
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
      res.setHeader('Content-Type', file.mimeType || 'image/png');
    }

    fs.createReadStream(physicalPath).pipe(res);
  } catch (error) {
    console.error('Erreur prévisualisation:', error);
    res.status(500).json({ error: 'Erreur lors de la prévisualisation.' });
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
