-- Sign-in with e-mail and password (the e-mail link stays for a forgotten password).
-- password_hash: "pbkdf2$<iterations>$<salt hex>$<hash hex>" (PBKDF2-SHA256, lib/server/auth.ts).
-- must_change_password: 1 for a temporary password (set by an admin): the user chooses
-- their own at the next sign-in.
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;

-- Failed sign-ins per e-mail, to slow down password guessing (5 failures → 15 min lock).
CREATE TABLE login_failures (
  email TEXT NOT NULL COLLATE NOCASE,
  failed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX login_failures_email ON login_failures(email, failed_at);
