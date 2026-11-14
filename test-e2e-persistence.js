import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('================================================================');
  console.log('🧪 DÉBUT DU TEST DE PERSISTANCE PHYSIQUE DE LA BASE DE DONNÉES');
  console.log('================================================================\n');

  // Démarrage du serveur backend
  await import('./backend/server.js');
  await new Promise(r => setTimeout(r, 1200));

  const BASE_URL = 'http://127.0.0.1:5000';

  // 1. Contrôle de santé
  console.log('[ÉTAPE 1/6] Vérification du serveur et de l\'API...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  if (!healthRes.ok) throw new Error('Le serveur ne répond pas.');
  console.log('  -> ✅ Serveur opérationnel (HTTP 200)\n');

  // 2. Création d\'une catégorie
  console.log('[ÉTAPE 2/6] Création d\'une rubrique (POST /api/rubriques)...');
  const createRubRes = await fetch(`${BASE_URL}/api/rubriques`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rubrique Test Persistance Automatisée',
      description: 'Catégorie créée pour valider le stockage physique permanent sur disque',
      icon: 'Shield',
      color: 'red',
      badge: 'TEST-AUTO'
    })
  });
  const createdRub = await createRubRes.json();
  console.log(`  -> Réponse HTTP: ${createRubRes.status} (ID: ${createdRub.id})`);

  // Vérification physique sur le disque
  const disk1 = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const foundRub1 = disk1.rubriques.find(r => r.id === createdRub.id);
  const backup1 = JSON.parse(fs.readFileSync('data/database.backup.json', 'utf8'));
  const foundBackup1 = backup1.rubriques.find(r => r.id === createdRub.id);

  if (!foundRub1) throw new Error('ÉCHEC : La rubrique n\'a pas été enregistrée dans data/database.json !');
  if (!foundBackup1) throw new Error('ÉCHEC : La rubrique n\'est pas dans data/database.backup.json !');
  console.log('  -> ✅ Écriture physique disque vérifiée dans "data/database.json"');
  console.log('  -> ✅ Écriture miroir vérifiée dans "data/database.backup.json"\n');

  // 3. Modification de la catégorie
  console.log('[ÉTAPE 3/6] Modification de la rubrique (PUT /api/rubriques/:id)...');
  const newRubName = 'Rubrique Test MODIFIÉE AVEC SUCCÈS';
  const updateRubRes = await fetch(`${BASE_URL}/api/rubriques/${createdRub.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: newRubName,
      description: 'Description mise à jour et confirmée',
      color: 'cyan',
      badge: 'MODIFIÉ'
    })
  });
  const updatedRub = await updateRubRes.json();
  console.log(`  -> Réponse HTTP: ${updateRubRes.status} - Nouveau titre: "${updatedRub.name}"`);

  // Vérification sur le disque
  const disk2 = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const foundRub2 = disk2.rubriques.find(r => r.id === createdRub.id);
  if (foundRub2?.name !== newRubName) {
    throw new Error('ÉCHEC : La modification de la rubrique n\'a pas été enregistrée sur le disque !');
  }
  console.log(`  -> ✅ Modification confirmée physiquement sur le disque : "${foundRub2.name}"\n`);

  // 4. Dépôt / Upload d'un fichier réel
  console.log('[ÉTAPE 4/6] Dépôt / Upload d\'un fichier de cours (POST /api/files)...');
  const formData = new FormData();
  const fileContent = 'Contenu académique de test : validation de l\'enregistrement physique et du téléchargement.';
  const fileBlob = new Blob([fileContent], { type: 'text/plain' });
  formData.append('file', fileBlob, 'support-cours-persistance-test.txt');
  formData.append('title', 'Cours Test Persistance Électronique');
  formData.append('rubriqueId', createdRub.id);
  formData.append('description', 'Test automatisé du système de persistance');
  formData.append('level', 'Master 2');
  formData.append('professor', 'Dr. Meziane');
  formData.append('tags', 'test, persistance, auto');
  formData.append('downloadable', 'true');

  const uploadRes = await fetch(`${BASE_URL}/api/files`, {
    method: 'POST',
    body: formData
  });
  const uploadedFile = await uploadRes.json();
  console.log(`  -> Réponse HTTP: ${uploadRes.status} (Fichier ID: ${uploadedFile.id})`);

  // Vérification dans database.json
  const disk3 = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const foundFile3 = disk3.files.find(f => f.id === uploadedFile.id);
  if (!foundFile3) throw new Error('ÉCHEC : Métadonnées du fichier absentes de database.json !');
  console.log('  -> ✅ Métadonnées du cours écrites dans "data/database.json"');
  console.log(`  -> ✅ Attribut "downloadable" (téléchargeable) enregistré : ${foundFile3.downloadable}`);

  // Vérification de la présence du fichier physique dans uploads/
  const physicalFilePath = path.join(__dirname, 'uploads', foundFile3.filename);
  if (!fs.existsSync(physicalFilePath)) {
    throw new Error('ÉCHEC : Fichier physique absent du dossier uploads/ !');
  }
  console.log(`  -> ✅ Fichier physique stocké avec succès dans uploads/${foundFile3.filename} (${fs.statSync(physicalFilePath).size} octets)\n`);

  // 5. Modification des métadonnées du fichier
  console.log('[ÉTAPE 5/6] Modification des métadonnées du cours (PUT /api/files/:id)...');
  const updateFileFormData = new FormData();
  const newFileTitle = 'Cours Test Persistance (TITRE MODIFIÉ)';
  updateFileFormData.append('title', newFileTitle);
  updateFileFormData.append('rubriqueId', createdRub.id);
  updateFileFormData.append('description', 'Nouvelle description confirmée');
  updateFileFormData.append('downloadable', 'false');

  const updateFileRes = await fetch(`${BASE_URL}/api/files/${uploadedFile.id}`, {
    method: 'PUT',
    body: updateFileFormData
  });
  const updatedFile = await updateFileRes.json();
  console.log(`  -> Réponse HTTP: ${updateFileRes.status} - Titre: "${updatedFile.title}" - Téléchargeable: ${updatedFile.downloadable}`);

  // Vérification disque
  const disk4 = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const foundFile4 = disk4.files.find(f => f.id === uploadedFile.id);
  if (foundFile4?.title !== newFileTitle || foundFile4?.downloadable !== false) {
    throw new Error('ÉCHEC : Les modifications du fichier ne sont pas écrites sur disque !');
  }
  console.log(`  -> ✅ Modification enregistrée sur disque : Titre = "${foundFile4.title}", Téléchargeable = ${foundFile4.downloadable}\n`);

  // 6. Nettoyage et vérification de la suppression
  console.log('[ÉTAPE 6/6] Nettoyage et test de suppression (DELETE)...');
  await fetch(`${BASE_URL}/api/files/${uploadedFile.id}`, { method: 'DELETE' });
  await fetch(`${BASE_URL}/api/rubriques/${createdRub.id}`, { method: 'DELETE' });

  const diskFinal = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const fileStillPresent = diskFinal.files.some(f => f.id === uploadedFile.id);
  const rubStillPresent = diskFinal.rubriques.some(r => r.id === createdRub.id);

  if (fileStillPresent || rubStillPresent) {
    throw new Error('ÉCHEC : Les données supprimées subsistent dans database.json !');
  }
  console.log('  -> ✅ Fichier et rubrique de test supprimés proprement du disque.\n');

  console.log('================================================================');
  console.log('🎉 RÉSULTAT DU TEST : SUCCÈS TOTAL (100%)');
  console.log('   Toutes les modifications et dépôts sont enregistrés immédiatement');
  console.log('   et de façon permanente sur le disque dur physique.');
  console.log('================================================================\n');

  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ ÉCHEC DU TEST DE PERSISTANCE :', err.message || err);
  process.exit(1);
});
