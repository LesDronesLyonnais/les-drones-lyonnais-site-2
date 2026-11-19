// Sign-in for the account area: e-mail + password (PBKDF2), or a one-time link by e-mail
// for a forgotten password; then a session cookie. Only server code (on-demand pages and
// middleware) imports this file. Tokens are random 32-byte values; only their SHA-256 is
// stored in D1.
import { env } from 'cloudflare:workers';
import type { AstroCookies } from 'astro';

export type Role = 'admin' | 'boutique' | 'prestation';
export interface User {
  id: number;
  email: string;
  name: string;
  company: string;
  phone: string;
  role: Role;
  created_at: string;
  last_login_at: string | null;
  password_hash: string | null;
  /** Temporary password: the user must choose their own before going further. */
  must_change_password: number;
}

export const db = () => env.DB;
/** Private file storage. No bucket for now (files move to Supabase Storage): callers
 *  must handle `undefined`. */
export const files = (): R2Bucket | undefined => (env as { FILES?: R2Bucket }).FILES;
export const FILES_UNAVAILABLE = 'Le stockage des fichiers arrive bientôt : ajout impossible pour l’instant.';

const SESSION_COOKIE = 'ldl_session';
const SESSION_DAYS = 30;
const LINK_MINUTES = 20;

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (h: string): Uint8Array<ArrayBuffer> => new Uint8Array((h.match(/../g) ?? []).map((b) => parseInt(b, 16)));
const randomToken = () => hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
const sha256 = async (s: string) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
const inMinutes = (m: number) => new Date(Date.now() + m * 60_000).toISOString();

export const normEmail = (s: string) => s.trim().toLowerCase();
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

const adminEmails = () =>
  String(env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(normEmail)
    .filter(Boolean);

export const findUser = (email: string) => db().prepare('SELECT * FROM users WHERE email = ?').bind(email).first<User>();

/** A new account (shop customer by default, admin for ADMIN_EMAILS), without password. */
export async function createUser(email: string, fields: { name?: string; company?: string; phone?: string; role?: Role } = {}) {
  const role: Role = adminEmails().includes(email) ? 'admin' : (fields.role ?? 'boutique');
  return (await db()
    .prepare('INSERT INTO users (email, name, company, phone, role) VALUES (?, ?, ?, ?, ?) RETURNING *')
    .bind(email, fields.name ?? '', fields.company ?? '', fields.phone ?? '', role)
    .first<User>())!;
}

// ---------- Passwords ----------
// PBKDF2-SHA256, 100 000 iterations (the most Workers allow), 16-byte salt.
const ITERATIONS = 100_000;
export const MIN_PASSWORD = 10;

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${hex(salt.buffer)}$${await pbkdf2(password, salt, ITERATIONS)}`;
}
async function verifyPassword(password: string, stored: string | null) {
  const [scheme, iter, salt, hash] = (stored ?? '').split('$');
  if (scheme !== 'pbkdf2' || !salt || !hash) return false;
  const candidate = await pbkdf2(password, unhex(salt), Number(iter));
  // Constant-time comparison.
  let diff = candidate.length ^ hash.length;
  for (let i = 0; i < candidate.length; i++) diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i % hash.length);
  return diff === 0;
}
export const passwordProblem = (password: string, confirm: string) =>
  password.length < MIN_PASSWORD ? `Le mot de passe doit faire au moins ${MIN_PASSWORD} caractères.` : password !== confirm ? 'Les deux mots de passe ne correspondent pas.' : null;

/** Sets a password; `temporary` makes the user choose their own at the next sign-in. */
export async function setPassword(userId: number, password: string, temporary = false) {
  await db().prepare('UPDATE users SET password_hash = ?, must_change_password = ? WHERE id = ?').bind(await hashPassword(password), temporary ? 1 : 0, userId).run();
}

/** A readable temporary password for an admin to give a client (e.g. "Vol-4827-Drone"). */
export function temporaryPassword() {
  const words = ['Vol', 'Drone', 'Helice', 'Nacelle', 'Lyon', 'Cap', 'Radar', 'Pilote', 'Ciel', 'Gimbal'];
  const r = crypto.getRandomValues(new Uint32Array(3));
  return `${words[r[0] % words.length]}-${1000 + (r[1] % 9000)}-${words[r[2] % words.length]}`;
}

const LOCK_FAILURES = 5;
const LOCK_MINUTES = 15;
const sqlTime = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19);

/** Checks e-mail + password. After 5 failures in 15 minutes the e-mail is locked for a while. */
export async function signInWithPassword(email: string, password: string): Promise<{ user?: User; error?: string }> {
  const since = sqlTime(new Date(Date.now() - LOCK_MINUTES * 60_000));
  const failures = await db().prepare('SELECT COUNT(*) AS n FROM login_failures WHERE email = ? AND failed_at > ?').bind(email, since).first<{ n: number }>();
  if ((failures?.n ?? 0) >= LOCK_FAILURES) return { error: `Trop d’essais. Réessayez dans ${LOCK_MINUTES} minutes, ou utilisez « Mot de passe oublié ».` };
  const user = await findUser(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    await db().prepare('INSERT INTO login_failures (email) VALUES (?)').bind(email).run();
    return { error: 'E-mail ou mot de passe incorrect.' };
  }
  await db().batch([
    db().prepare('DELETE FROM login_failures WHERE email = ?').bind(email),
    db().prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").bind(user.id),
  ]);
  // ADMIN_EMAILS added after the account was created.
  if (user.role !== 'admin' && adminEmails().includes(email)) {
    await db().prepare("UPDATE users SET role = 'admin' WHERE id = ?").bind(user.id).run();
    user.role = 'admin';
  }
  return { user };
}

// ---------- Forgotten password: one-time link ----------

/** A one-time sign-in link for this user, valid LINK_MINUTES. */
export async function createSignInLink(user: User, origin: string): Promise<string> {
  const token = randomToken();
  await db().prepare('INSERT INTO login_tokens (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), user.id, inMinutes(LINK_MINUTES)).run();
  const url = new URL('/connexion/lien/', origin);
  url.searchParams.set('t', token);
  return url.toString();
}

/** Uses the link's token once; returns its user if it was valid. */
export async function consumeSignInToken(token: string): Promise<User | null> {
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  const row = await db()
    .prepare("UPDATE login_tokens SET used_at = datetime('now') WHERE token_hash = ? AND used_at IS NULL AND expires_at > ? RETURNING user_id")
    .bind(await sha256(token), new Date().toISOString())
    .first<{ user_id: number }>();
  if (!row) return null;
  await db().prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").bind(row.user_id).run();
  return db().prepare('SELECT * FROM users WHERE id = ?').bind(row.user_id).first<User>();
}

/** E-mails the one-time link (Brevo, sender by account type). In dev the link is also
 *  shown on the page, so the flow can be tried without a mail key. */
export async function sendResetLink(email: string, link: string, role?: Role): Promise<{ shownLink?: string }> {
  const { sendMail, layout, button, esc } = await import('./mail');
  const audience = role === 'boutique' ? 'boutique' : role === 'prestation' ? 'prestations' : 'autre';
  const sent = await sendMail({
    audience,
    to: { email },
    subject: 'Choisissez un nouveau mot de passe',
    html: layout(
      audience,
      `<h1 style="margin:0 0 12px;font-size:22px;">Nouveau mot de passe</h1>
<p style="margin:0;">Vous avez demandé à changer le mot de passe de votre espace client. Ce lien est valable ${LINK_MINUTES} minutes et ne sert qu’une fois.</p>
${button(link, 'Choisir un nouveau mot de passe')}
<p style="margin:20px 0 0;color:#5c5c5c;font-size:14px;">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : votre mot de passe ne change pas.<br>Lien : ${esc(link)}</p>`,
    ),
    text: `Vous avez demandé à changer le mot de passe de votre espace client.\nCe lien est valable ${LINK_MINUTES} minutes et ne sert qu’une fois :\n${link}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.`,
  });
  if (!sent) console.log(`[connexion] lien de réinitialisation pour ${email} : ${link}`);
  return import.meta.env.DEV ? { shownLink: link } : {};
}

// ---------- Sessions ----------

export async function startSession(user: User, cookies: AstroCookies, secure: boolean) {
  const token = randomToken();
  await db().prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), user.id, inMinutes(SESSION_DAYS * 24 * 60)).run();
  cookies.set(SESSION_COOKIE, token, { path: '/', httpOnly: true, sameSite: 'lax', secure, maxAge: SESSION_DAYS * 86400 });
}

export async function sessionUser(cookies: AstroCookies): Promise<User | null> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  return db()
    .prepare('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?')
    .bind(await sha256(token), new Date().toISOString())
    .first<User>();
}

export async function endSession(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) await db().prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/** Signs out everywhere else after a password change (keeps the current session). */
export async function endOtherSessions(userId: number, cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value ?? '';
  await db().prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?').bind(userId, await sha256(token)).run();
}

/** Must choose a password before anything else (temporary one, or reset link). */
export const needsPassword = (user: User) => !!user.must_change_password || !user.password_hash;

/** Where a user lands after signing in. */
export const homeOf = (user: User) => (needsPassword(user) ? '/compte/mot-de-passe/' : user.role === 'admin' ? '/admin/' : '/compte/');

/** Only same-site paths are followed after sign-in. */
export const safeNext = (s: string | null) => (s && s.startsWith('/') && !s.startsWith('//') ? s : '');
