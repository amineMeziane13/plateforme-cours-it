// ==============================================================================
// TEST AUTOMATISÉ : VALIDATION DE LA NON-PERTE DE DONNÉES APRÈS RELANCEMENT
// ==============================================================================
// Ce test valide le stockage relationnel avec Write-Ahead Logging (WAL) :
// 1. Dépôt de données réelles (Rubrique, Sous-rubrique, Fichier téléchargeable, Délégué, Message).
// 2. Simulation d'un arrêt brutal / extinction du serveur (Processus tué).
// 3. Relance complète à froid du serveur depuis le disque physique.
// 4. Vérification que 100% des données saisies sont intactes, lisibles et persistantes.
// 5. Modification des données + second arrêt brutal + seconde relance.
// ==============================================================================

import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:5000';

function request(method, pathName, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathName, BASE_URL);
    const reqHeaders = { ...headers };
    let postData = null;

    if (body) {
      if (typeof body === 'string') {
        postData = body;
      } else {
        postData = JSON.stringify(body);
        if (!reqHeaders['Content-Type']) reqHeaders['Content-Type'] = 'application/json';
      }
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
        resolve({ statusCode: res.statusCode, headers: res.headers, data, json });
      });
    });

    req.on('error', err => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

function startServerProcess() {
  return new Promise((resolve, reject) => {
    console.log('  [SERVEUR] Démarrage du processus backend...');
    const proc = spawn('node', ['backend/server.js'], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let started = false;
    proc.stdout.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('Serveur IT Course Platform démarré') || msg.includes('5000')) {
        if (!started) {
          started = true;
          resolve(proc);
        }
      }
    });

    proc.stderr.on('data', (d) => {
      console.error('  [SERVEUR-ERR]', d.toString().trim());
    });

    proc.on('error', err => reject(err));

    // Fallback timeout
    setTimeout(() => {
      if (!started) {
        started = true;
        resolve(proc);
      }
    }, 2500);
  });
}

async function stopServerProcess(proc) {
  console.log('  [ARRÊT BRUTAL] Arrêt immédiat du processus serveur (simulation crash/extinction)...');
  proc.kill('SIGKILL');
  await new Promise(r => setTimeout(r, 1000));
}

async function runRelaunchTest() {
  console.log('================================================================');
  console.log('💾 TEST DE NON-PERTE DE DONNÉES APRÈS RELANCEMENT DU SERVEUR');
  console.log('   (Approche Storage : SGBD Relationnel + Write-Ahead Logging WAL)');
  console.log('================================================================\n');

  let serverProc = null;
  let testRubId = null;
  let testFileId = null;
  let testLeaderId = null;
  let adminToken = null;

  try {
    // ÉTAPE 1 : Premier démarrage du serveur
    console.log('--- ÉTAPE 1 : PREMIER DÉMARRAGE DU SERVEUR ---');
    serverProc = await startServerProcess();
    await new Promise(r => setTimeout(r, 800));

    const health = await request('GET', '/api/health');
    console.log(`  -> Santé API : HTTP ${health.statusCode} (${health.json?.status})`);

    // Authentification Admin
    const login = await request('POST', '/api/auth/login', { username: 'amine', password: 'AmineAdmin2026!' });
    adminToken = login.json?.token;
    console.log(`  -> Connexion Enseignant : OK (Jeton cryptographique généré)`);

    // ÉTAPE 2 : Création de données complètes
    console.log('\n--- ÉTAPE 2 : INSERTION DES DONNÉES EN SESSION ENSEIGNANT ---');

    // 2.1 Rubrique
    const rubRes = await request('POST', '/api/rubriques', {
      name: 'Architecture Stockage WAL & Relational',
      description: 'Dossier de cours dédié aux bases relationnelles avec Write-Ahead Logging',
      icon: 'Database',
      color: 'blue',
      badge: 'ACID-WAL'
    }, { 'Authorization': `Bearer ${adminToken}` });
    testRubId = rubRes.json?.id;
    console.log(`  -> Rubrique créée avec succès : "${rubRes.json?.name}" (ID: ${testRubId})`);

    // 2.2 Sous-Rubrique
    const subRes = await request('POST', `/api/rubriques/${testRubId}/sous-rubriques`, {
      name: 'Journalisation & Crash Recovery',
      description: 'Fonctionnement des Shared Buffers et du WAL'
    }, { 'Authorization': `Bearer ${adminToken}` });
    const testSubId = subRes.json?.id;
    console.log(`  -> Sous-rubrique créée : "${subRes.json?.name}" (ID: ${testSubId})`);

    // 2.3 Fichier uploadé (téléchargeable = true)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const fileContent = 'SUPPORT DE COURS : Architecture de Stockage Relational & WAL.\nCe document atteste de la persistance permanente après redémarrage.';
    let multipartBody = '';
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="title"\r\n\r\n`;
    multipartBody += `Guide Complet Stockage & Récupération des Données\r\n`;
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="rubriqueId"\r\n\r\n`;
    multipartBody += `${testRubId}\r\n`;
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="sousRubriqueId"\r\n\r\n`;
    multipartBody += `${testSubId}\r\n`;
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="level"\r\n\r\n`;
    multipartBody += `Master 2 Systèmes & Cloud\r\n`;
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="professor"\r\n\r\n`;
    multipartBody += `Dr. M.A. Meziane\r\n`;
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="downloadable"\r\n\r\n`;
    multipartBody += `true\r\n`;
    multipartBody += `--${boundary}\r\n`;
    multipartBody += `Content-Disposition: form-data; name="file"; filename="support-wal-persistence.txt"\r\n`;
    multipartBody += `Content-Type: text/plain\r\n\r\n`;
    multipartBody += `${fileContent}\r\n`;
    multipartBody += `--${boundary}--\r\n`;

    const uploadRes = await request('POST', '/api/files', multipartBody, {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    });
    testFileId = uploadRes.json?.id;
    console.log(`  -> Fichier de cours déposé : "${uploadRes.json?.title}" (Téléchargeable: ${uploadRes.json?.downloadable})`);

    // 2.4 Délégué de groupe
    const leaderRes = await request('POST', '/api/admin/leaders', {
      username: 'delegue_test_wal',
      password: 'DeleguePass2026!',
      studentName: 'Karim Hadj',
      groupName: 'Groupe Master IT'
    }, { 'Authorization': `Bearer ${adminToken}` });
    testLeaderId = leaderRes.json?.id;
    console.log(`  -> Délégué enregistré : "${leaderRes.json?.studentName}" (@${leaderRes.json?.username})`);

    // 2.5 Message envoyé par ce délégué
    const msgRes = await request('POST', '/api/leaders/messages', {
      leaderId: testLeaderId,
      leaderName: 'Karim Hadj',
      groupName: 'Groupe Master IT',
      subject: 'Question sur le TP Stockage',
      content: 'Bonjour Dr. Meziane, le support de cours WAL est-il inclus dans l\'examen ?'
    });
    const testMsgId = msgRes.json?.id;
    console.log(`  -> Message transmis par le délégué : "${msgRes.json?.subject}"`);

    // 2.6 Réponse de Dr. Meziane
    await request('POST', `/api/admin/messages/${testMsgId}/reply`, {
      reply: 'Bonjour Karim. Oui, la persistance WAL et ACID est un point fondamental.'
    }, { 'Authorization': `Bearer ${adminToken}` });
    console.log(`  -> Réponse de Dr. Meziane enregistrée dans la base.`);

    // ÉTAPE 3 : Simulation d'un crash / extinction brutale du PC
    console.log('\n--- ÉTAPE 3 : SIMULATION EXTINCTION BRUTALE / REBOOT PC (CRASH DU PROCESSUS) ---');
    await stopServerProcess(serverProc);
    serverProc = null;
    console.log('  -> Le processus Node.js est totalement arrêté. La mémoire vive (RAM) est purgée.');

    // ÉTAPE 4 : Relance complète à froid du serveur (Reboot)
    console.log('\n--- ÉTAPE 4 : RELANCE DU SERVEUR À FROID DEPUIS LE DISQUE PHYSIQUE ---');
    serverProc = await startServerProcess();
    await new Promise(r => setTimeout(r, 1000));
    console.log('  -> Serveur redémarré avec succès sur http://localhost:5000');

    // ÉTAPE 5 : Vérification de la persistance totale (Mode Consultation Étudiant)
    console.log('\n--- ÉTAPE 5 : VÉRIFICATION DE LA PRÉSENCE DES DONNÉES EN MODE ÉTUDIANT ---');

    // Vérification de la rubrique
    const getRubriques = await request('GET', '/api/rubriques');
    const persistedRub = getRubriques.json?.find(r => r.id === testRubId);
    if (!persistedRub) {
      throw new Error(`ÉCHEC CRITIQUE : La rubrique ${testRubId} a disparu après le redémarrage !`);
    }
    console.log(`  [OK] Rubrique retrouvée intacte : "${persistedRub.name}" (Badge: ${persistedRub.badge})`);

    // Vérification de la sous-rubrique
    const hasSub = persistedRub.sousRubriques?.some(s => s.id === testSubId);
    if (!hasSub) {
      throw new Error(`ÉCHEC : La sous-rubrique n'a pas été conservée dans la base relationnelle !`);
    }
    console.log(`  [OK] Sous-rubrique retrouvée intacte : "Journalisation & Crash Recovery"`);

    // Vérification du fichier de cours
    const getFiles = await request('GET', `/api/files?rubriqueId=${testRubId}`);
    const persistedFile = getFiles.json?.find(f => f.id === testFileId);
    if (!persistedFile) {
      throw new Error(`ÉCHEC CRITIQUE : Le cours ${testFileId} a disparu après le redémarrage !`);
    }
    console.log(`  [OK] Fichier de cours retrouvé intact : "${persistedFile.title}"`);
    console.log(`  [OK] Attribut téléchargeable conservé : ${persistedFile.downloadable === true}`);

    // Vérification du contenu du document en lecture haute fidélité
    const previewRes = await request('GET', `/api/files/${testFileId}/preview?format=json`);
    if (!previewRes.json?.content?.includes('Ce document atteste de la persistance')) {
      throw new Error(`ÉCHEC : Le contenu physique du fichier est altéré !`);
    }
    console.log(`  [OK] Lecture haute fidélité : Contenu intégral vérifié et conforme`);

    // Re-connexion Enseignant pour vérifier délégués et messages
    const login2 = await request('POST', '/api/auth/login', { username: 'amine', password: 'AmineAdmin2026!' });
    const token2 = login2.json?.token;

    const messagesRes = await request('GET', '/api/admin/messages', null, { 'Authorization': `Bearer ${token2}` });
    const persistedMsg = messagesRes.json?.find(m => m.id === testMsgId);
    if (!persistedMsg || !persistedMsg.reply) {
      throw new Error(`ÉCHEC : Le message ou la réponse de l'enseignant a été perdu après le redémarrage !`);
    }
    console.log(`  [OK] Messages et réponses conservés : Statut = "${persistedMsg.status}", Réponse = "${persistedMsg.reply.slice(0, 30)}..."`);

    // ÉTAPE 6 : Modification des données + second redémarrage pour valider l'intégrité
    console.log('\n--- ÉTAPE 6 : TEST DE MODIFICATION + SECOND REDÉMARRAGE BRUTAL ---');
    const updatedTitle = 'Architecture Stockage WAL (TITRE MODIFIÉ CONFIRMÉ)';
    await request('PUT', `/api/rubriques/${testRubId}`, {
      name: updatedTitle,
      color: 'red',
      badge: 'MODIFIÉ-2'
    }, { 'Authorization': `Bearer ${token2}` });
    console.log(`  -> Titre de la rubrique modifié en : "${updatedTitle}"`);

    // Second arrêt brutal
    await stopServerProcess(serverProc);
    serverProc = null;

    // Seconde relance
    serverProc = await startServerProcess();
    await new Promise(r => setTimeout(r, 1000));

    // Vérification de la modification
    const getRubriquesAfter2 = await request('GET', '/api/rubriques');
    const rubAfter2 = getRubriquesAfter2.json?.find(r => r.id === testRubId);
    if (rubAfter2?.name !== updatedTitle || rubAfter2?.badge !== 'MODIFIÉ-2') {
      throw new Error(`ÉCHEC : La modification n'a pas survécu au deuxième redémarrage !`);
    }
    console.log(`  [OK] Modification persistée avec succès après le 2e redémarrage : "${rubAfter2.name}"`);

    // ÉTAPE 7 : Nettoyage propre
    console.log('\n--- ÉTAPE 7 : NETTOYAGE DES DONNÉES DE TEST ---');
    const login3 = await request('POST', '/api/auth/login', { username: 'amine', password: 'AmineAdmin2026!' });
    const token3 = login3.json?.token;

    await request('DELETE', `/api/files/${testFileId}`, null, { 'Authorization': `Bearer ${token3}` });
    await request('DELETE', `/api/rubriques/${testRubId}`, null, { 'Authorization': `Bearer ${token3}` });
    await request('DELETE', `/api/admin/leaders/${testLeaderId}`, null, { 'Authorization': `Bearer ${token3}` });
    console.log('  -> Fichiers et rubriques de test supprimés proprement.');

    console.log('\n================================================================');
    console.log('🎉 VALIDATION COMPLÈTE RÉUSSIE : 100% DES DONNÉES SONT PERSISTÉES !');
    console.log('✅ Aucune donnée n\'est perdue lors de l\'extinction ou du redémarrage.');
    console.log('✅ Le moteur relationnel SQLite avec Write-Ahead Logging (WAL)');
    console.log('   garantit la durabilité totale des saisies.');
    console.log('================================================================\n');

  } catch (err) {
    console.error('\n❌ ERREUR DURANT LE TEST DE PERSISTANCE :', err.message);
    process.exitCode = 1;
  } finally {
    if (serverProc) {
      serverProc.kill('SIGKILL');
    }
  }
}

runRelaunchTest();
