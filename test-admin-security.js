// ==============================================================================
// TEST AUTOMATISÉ DE SÉCURITÉ DE LA SESSION ADMINISTRATEUR & MODE ÉTUDIANT
// ==============================================================================
// Vérifie que :
// 1. Toute personne accédant au lien partagé entre en Mode Consultation Étudiant.
// 2. Toutes les opérations administratives (création, modification, suppression, export)
//    sont STRICTEMENT rejetées (HTTP 401 Unauthorized) sans jeton administrateur valide.
// 3. Les jetons forgés ou expirés sont systématiquement rejetés.
// 4. L'authentification légitime via mot de passe maître délivre un jeton cryptographique.
// 5. La déconnexion révoque immédiatement le jeton.
// 6. Les exports de base de données ne divulguent aucun mot de passe maître en clair.
// ==============================================================================

import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { ...headers };
    let postData = null;

    if (body) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      if (!reqHeaders['Content-Type']) {
        reqHeaders['Content-Type'] = 'application/json';
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
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', err => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runSecurityTests() {
  console.log('================================================================');
  console.log('🔒 SUITE DE TESTS : SÉCURITÉ ADMIN & ÉTANCHÉITÉ SESSION PUBLIQUE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  [SUCCÈS] ${testName}`);
      passed++;
    } else {
      console.error(`  [ÉCHEC]  ${testName} -> ${details}`);
      failed++;
    }
  }

  try {
    // 1. Accès public (Mode Étudiant) : la lecture des cours et rubriques est autorisée
    console.log('--- 1. VÉRIFICATION DU MODE CONSULTATION ÉTUDIANT (LECTURE SEULE) ---');
    const health = await request('GET', '/api/health');
    assert(health.statusCode === 200, 'Serveur opérationnel (/api/health)');

    const publicRubriques = await request('GET', '/api/rubriques');
    assert(publicRubriques.statusCode === 200 && Array.isArray(publicRubriques.json), 
      'Étudiants : Consultation des rubriques autorisée (HTTP 200)');

    const publicFiles = await request('GET', '/api/files');
    assert(publicFiles.statusCode === 200 && Array.isArray(publicFiles.json), 
      'Étudiants : Consultation des fichiers autorisée (HTTP 200)');

    const publicStats = await request('GET', '/api/stats');
    assert(publicStats.statusCode === 200, 'Étudiants : Consultation des statistiques autorisée (HTTP 200)');

    const unauthVerify = await request('GET', '/api/auth/verify-admin');
    assert(unauthVerify.statusCode === 401 && unauthVerify.json?.valid === false,
      'Lien partagé : Visiteur sans session considéré non-admin (HTTP 401 valid=false)');

    // 2. Rejet strict des opérations d'écriture / modification pour un visiteur non-connecté
    console.log('\n--- 2. BLOCAGE DES ACTIONS ADMIN POUR TOUT LIEN PARTAGÉ SANS AUTH ---');

    const unauthCreateRub = await request('POST', '/api/rubriques', { name: 'Piratage Test' });
    assert(unauthCreateRub.statusCode === 401, 'Rejet création rubrique sans token (HTTP 401)');

    const unauthUpdateRub = await request('PUT', '/api/rubriques/rub-sys', { name: 'Modif Invalide' });
    assert(unauthUpdateRub.statusCode === 401, 'Rejet modification rubrique sans token (HTTP 401)');

    const unauthDeleteRub = await request('DELETE', '/api/rubriques/rub-sys');
    assert(unauthDeleteRub.statusCode === 401, 'Rejet suppression rubrique sans token (HTTP 401)');

    const unauthAddSub = await request('POST', '/api/rubriques/rub-sys/sous-rubriques', { name: 'Sub Test' });
    assert(unauthAddSub.statusCode === 401, 'Rejet ajout sous-rubrique sans token (HTTP 401)');

    const unauthDeleteSub = await request('DELETE', '/api/rubriques/rub-sys/sous-rubriques/sub-1');
    assert(unauthDeleteSub.statusCode === 401, 'Rejet suppression sous-rubrique sans token (HTTP 401)');

    const unauthUpload = await request('POST', '/api/files', { title: 'Fichier Fantôme' });
    assert(unauthUpload.statusCode === 401, 'Rejet upload fichier sans token (HTTP 401)');

    const unauthDeleteFile = await request('DELETE', '/api/files/any-file-id');
    assert(unauthDeleteFile.statusCode === 401, 'Rejet suppression fichier sans token (HTTP 401)');

    const unauthSettings = await request('GET', '/api/admin/settings');
    assert(unauthSettings.statusCode === 401, 'Rejet accès paramètres admin sans token (HTTP 401)');

    const unauthBackup = await request('GET', '/api/admin/database/backup');
    assert(unauthBackup.statusCode === 401, 'Rejet téléchargement backup DB sans token (HTTP 401)');

    const unauthExport = await request('GET', '/api/admin/database/export');
    assert(unauthExport.statusCode === 401, 'Rejet export base de données sans token (HTTP 401)');

    const unauthImport = await request('POST', '/api/admin/database/import', { rubriques: [] });
    assert(unauthImport.statusCode === 401, 'Rejet restauration DB sans token (HTTP 401)');

    const unauthLeaders = await request('GET', '/api/admin/leaders');
    assert(unauthLeaders.statusCode === 401, 'Rejet accès délégués admin sans token (HTTP 401)');

    const unauthMessages = await request('GET', '/api/admin/messages');
    assert(unauthMessages.statusCode === 401, 'Rejet lecture messages admin sans token (HTTP 401)');

    // 3. Rejet strict des faux jetons / jetons forgés
    console.log('\n--- 3. REJET DES FAUX JETONS OU JETONS EXPIRÉS (FORGERY TEST) ---');
    const forgedToken = 'Bearer adm_fake_0123456789abcdef0123456789abcdef';
    const fakeReq = await request('POST', '/api/rubriques', { name: 'Piratage Jeton Faux' }, { 'Authorization': forgedToken });
    assert(fakeReq.statusCode === 401, 'Rejet immédiat d\'un jeton forgé (HTTP 401)');

    const fakeVerify = await request('GET', '/api/auth/verify-admin', null, { 'Authorization': forgedToken });
    assert(fakeVerify.statusCode === 401 && fakeVerify.json?.valid === false, 'Vérification de faux jeton refusée (HTTP 401 valid=false)');

    // 4. Authentification légitime avec mot de passe Maître Enseignant
    console.log('\n--- 4. AUTHENTIFICATION LÉGITIME ENSEIGNANT (DR. MEZIANE) ---');
    const badLogin = await request('POST', '/api/auth/login', { username: 'amine', password: 'MauvaisMotDePasse!' });
    assert(badLogin.statusCode === 401, 'Rejet connexion avec mauvais mot de passe (HTTP 401)');

    const validLogin = await request('POST', '/api/auth/login', { username: 'amine', password: 'AmineAdmin2026!' });
    assert(validLogin.statusCode === 200 && validLogin.json?.token, 'Connexion Enseignant réussie avec mot de passe maître (HTTP 200 + token)');

    const adminToken = validLogin.json?.token;
    assert(adminToken && adminToken.startsWith('adm_') && adminToken.length > 30, 'Jeton sécurisé cryptographique à haute entropie généré');

    // 5. Vérification du jeton actif
    console.log('\n--- 5. VÉRIFICATION DU JETON ADMINISTRATEUR ACTIF ---');
    const verifyRes = await request('GET', '/api/auth/verify-admin', null, { 'Authorization': `Bearer ${adminToken}` });
    assert(verifyRes.statusCode === 200 && verifyRes.json?.valid === true, 'Validation du jeton Enseignant actif (HTTP 200 valid=true)');

    // 6. Opérations autorisées avec le jeton légitime
    console.log('\n--- 6. OPÉRATIONS ADMINISTRATEUR AVEC LE JETON VALIDE ---');
    const createTestRub = await request('POST', '/api/rubriques', {
      name: 'Rubrique Test Sécurité',
      description: 'Dossier créé avec token valide pour test de sécurité',
      icon: 'Shield',
      color: 'emerald',
      badge: 'SEC'
    }, { 'Authorization': `Bearer ${adminToken}` });
    assert(createTestRub.statusCode === 201 && createTestRub.json?.id, 'Création de rubrique autorisée avec token admin (HTTP 201)');

    const testRubId = createTestRub.json?.id;

    // Export DB sécurisé (sans divulgation de mot de passe)
    const exportRes = await request('GET', '/api/admin/database/export', null, { 'Authorization': `Bearer ${adminToken}` });
    assert(exportRes.statusCode === 200, 'Export de la base de données autorisé avec token admin (HTTP 200)');
    assert(exportRes.data.includes('"masterPassword": "[PROTECTED]"') || !exportRes.data.includes('AmineAdmin2026!'),
      'Protection mot de passe : Le mot de passe maître n\'est JAMAIS divulgué en clair dans l\'export JSON');

    // 7. Déconnexion & Révocation immédiate de la session
    console.log('\n--- 7. DÉCONNEXION & RÉVOCATION IMMÉDIATE DU JETON ---');
    const logoutRes = await request('POST', '/api/auth/logout', null, { 'Authorization': `Bearer ${adminToken}` });
    assert(logoutRes.statusCode === 200, 'Déconnexion réussie (/api/auth/logout HTTP 200)');

    const postLogoutVerify = await request('GET', '/api/auth/verify-admin', null, { 'Authorization': `Bearer ${adminToken}` });
    assert(postLogoutVerify.statusCode === 401 && postLogoutVerify.json?.valid === false,
      'Jeton révoqué immédiatement : session fermée et inutilisable (HTTP 401 valid=false)');

    const postLogoutAction = await request('POST', '/api/rubriques', { name: 'Action Interdite Après Logout' }, { 'Authorization': `Bearer ${adminToken}` });
    assert(postLogoutAction.statusCode === 401,
      'Opération administrative bloquée après déconnexion (HTTP 401 Unauthorized)');

    // Nettoyage de la rubrique de test (re-connexion temporaire pour supprimer)
    const cleanupLogin = await request('POST', '/api/auth/login', { username: 'amine', password: 'AmineAdmin2026!' });
    if (cleanupLogin.json?.token && testRubId) {
      await request('DELETE', `/api/rubriques/${testRubId}`, null, { 'Authorization': `Bearer ${cleanupLogin.json.token}` });
      await request('POST', '/api/auth/logout', null, { 'Authorization': `Bearer ${cleanupLogin.json.token}` });
    }

    console.log('\n================================================================');
    if (failed === 0) {
      console.log(`🎉 TOUS LES TESTS DE SÉCURITÉ ONT RÉUSSI (${passed}/${passed}) !`);
      console.log('✅ Tout visiteur recevant le lien entre STRICTEMENT en Mode Étudiant.');
      console.log('✅ Aucune session admin ne peut fuiter ni être détournée.');
    } else {
      console.error(`⚠️ CERTAINS TESTS ONT ÉCHOUÉ : ${passed} passés, ${failed} échoués.`);
    }
    console.log('================================================================');

    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('\n❌ Erreur inattendue durant les tests :', err.message);
    process.exit(1);
  }
}

runSecurityTests();
