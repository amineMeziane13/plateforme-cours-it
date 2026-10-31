import nodemailer from 'nodemailer';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'amine.blackline@gmail.com';

// In-memory store for active dynamic credentials (can hold active OTPs)
// Format: { username, password, expiresAt, createdAt, used: false }
let currentDynamicAuth = null;

// Helper to generate dynamic username & high-security password
export function generateDynamicCredentials() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const randomPass = Math.floor(100000 + Math.random() * 900000);
  
  const username = `admin_${randomSuffix}`;
  const password = `SEC-${randomPass}`;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  currentDynamicAuth = {
    username,
    password,
    expiresAt,
    createdAt: new Date().toISOString(),
    used: false
  };

  return currentDynamicAuth;
}

// Verify dynamic credentials
export function verifyDynamicCredentials(username, password) {
  if (!currentDynamicAuth) {
    return { valid: false, reason: 'Aucun code temporaire actif. Veuillez en demander un nouveau.' };
  }

  if (Date.now() > currentDynamicAuth.expiresAt) {
    currentDynamicAuth = null;
    return { valid: false, reason: 'Ces identifiants dynamiques ont expiré (validité 10 minutes).' };
  }

  if (currentDynamicAuth.used) {
    return { valid: false, reason: 'Ces identifiants ont déjà été utilisés.' };
  }

  const matchUser = currentDynamicAuth.username.toLowerCase() === (username || '').trim().toLowerCase();
  const matchPass = currentDynamicAuth.password === (password || '').trim();

  // Allow either exact dynamic username or 'admin' with the dynamic password for convenience
  const isUsernameAccepted = matchUser || (username || '').trim().toLowerCase() === 'admin';

  if (isUsernameAccepted && matchPass) {
    currentDynamicAuth.used = true; // invalidate for single-use
    return { valid: true };
  }

  return { valid: false, reason: 'Nom d\'utilisateur ou mot de passe temporaire incorrect.' };
}

// Create mail transporter
function getTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return null;
}

// Send dynamic credentials email to amine.blackline@gmail.com
export async function sendDynamicCredentialsEmail(credentials) {
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #080C14; color: #F1F5F9; margin: 0; padding: 20px; }
        .card { max-width: 550px; margin: 0 auto; background: #0F172A; border: 1px solid #1E2D4A; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(90deg, #1E3A8A, #0F172A, #991B1B); padding: 25px; text-align: center; border-bottom: 1px solid #2563EB; }
        .badge { display: inline-block; background: rgba(239, 68, 68, 0.2); color: #F87171; border: 1px solid #EF4444; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
        .title { color: #FFFFFF; font-size: 20px; font-weight: 800; margin: 0; }
        .body { padding: 30px; }
        .intro { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 25px; }
        .credentials-box { background: #080C14; border: 1px solid #2563EB; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
        .field { margin-bottom: 15px; }
        .field:last-child { margin-bottom: 0; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #60A5FA; margin-bottom: 5px; font-weight: bold; }
        .value { font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px; }
        .value.pass { color: #F87171; }
        .timer { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; color: #F59E0B; margin-bottom: 20px; }
        .footer { padding: 20px; background: #080C14; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #1E2D4A; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="badge">SÉCURITÉ DYNAMIQUE RENFORCÉE</div>
          <h1 class="title">Plateforme Cours IT - Accès Administrateur</h1>
        </div>
        <div class="body">
          <p class="intro">
            Bonjour Administrateur,<br><br>
            Une demande d'authentification a été initiée pour l'espace d'administration. Voici vos <strong>identifiants temporaires dynamiques</strong> à usage unique :
          </p>
          
          <div class="credentials-box">
            <div class="field">
              <div class="label">Identifiant Temporaire (Username)</div>
              <div class="value">${credentials.username}</div>
            </div>
            <hr style="border: 0; border-top: 1px solid #1E2D4A; margin: 15px 0;">
            <div class="field">
              <div class="label">Mot de Passe Dynamique Sécurisé (OTP)</div>
              <div class="value pass">${credentials.password}</div>
            </div>
          </div>

          <div class="timer">
            ⏱️ <strong>Validité : 10 minutes</strong> (expire automatiquement après ce délai).
          </div>

          <p style="font-size: 12px; color: #94A3B8; line-height: 1.5; margin: 0;">
            ⚠️ <em>Ces identifiants sont strictement confidentiels et à usage unique. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</em>
          </p>
        </div>
        <div class="footer">
          Système d'Authentification IT.Academy • Plateforme de Gestion des Cours
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Sécurité IT-Portal" <${process.env.EMAIL_USER || 'no-reply@it-academy.com'}>`,
        to: ADMIN_EMAIL,
        subject: `🔐 Vos identifiants temporaires IT-Portal : ${credentials.password}`,
        html: htmlContent
      });

      console.log('✅ Email envoyé avec succès à', ADMIN_EMAIL, info.messageId);
      return { sent: true, recipient: ADMIN_EMAIL, messageId: info.messageId };
    } catch (err) {
      console.error('❌ Erreur envoi SMTP:', err);
      return { sent: false, recipient: ADMIN_EMAIL, error: err.message, fallbackCredentials: credentials };
    }
  } else {
    console.log(`ℹ️ [MODE SIMULATION SÉCURITÉ / DÉMO] Email généré pour ${ADMIN_EMAIL} :`);
    console.log(`   Username : ${credentials.username}`);
    console.log(`   Password : ${credentials.password}`);
    return { 
      sent: false, 
      recipient: ADMIN_EMAIL, 
      simulated: true,
      message: 'SMTP non configuré dans les variables d\'environnement. Identifiants générés et enregistrés.',
      credentials: credentials 
    };
  }
}
