-- Accounts and the customer areas. Three roles:
--   admin       the team: manages everything
--   boutique    shop customer: orders and invoices
--   prestation  services client: missions (date, place, terms), deliverables, invoices
-- Sign-in is passwordless: a one-time link sent by e-mail (login_tokens), then a session
-- cookie (sessions). Tokens are stored hashed (SHA-256), never in clear.

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'boutique' CHECK (role IN ('admin', 'boutique', 'prestation')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

CREATE TABLE login_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at TEXT
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX sessions_user ON sessions(user_id);

-- Shop orders. items: JSON [{ "name", "qty", "priceTTC" }] (prices at the time of the order).
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  number TEXT NOT NULL UNIQUE,
  ordered_on TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'en_preparation' CHECK (status IN ('en_attente', 'en_preparation', 'expediee', 'livree', 'annulee')),
  items TEXT NOT NULL DEFAULT '[]',
  total_ttc REAL NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX orders_user ON orders(user_id);

-- Services carried out for a client: when, where, how.
CREATE TABLE missions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  service TEXT NOT NULL DEFAULT '',          -- slug of the service page (/<slug>/), optional
  mission_on TEXT NOT NULL,                  -- date (YYYY-MM-DD)
  place TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',          -- terms: drone, team, schedule, authorisations…
  status TEXT NOT NULL DEFAULT 'planifiee' CHECK (status IN ('planifiee', 'realisee', 'livree', 'annulee')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX missions_user ON missions(user_id);

-- Files of a mission (photos, videos, reports, 3D models…), stored in R2 under file_key.
CREATE TABLE deliverables (
  id INTEGER PRIMARY KEY,
  mission_id INTEGER NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_key TEXT NOT NULL UNIQUE,
  size INTEGER NOT NULL DEFAULT 0,
  content_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX deliverables_mission ON deliverables(mission_id);

-- Invoices (PDF in R2), linked to an order or a mission, or standalone.
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  mission_id INTEGER REFERENCES missions(id) ON DELETE SET NULL,
  number TEXT NOT NULL UNIQUE,
  issued_on TEXT NOT NULL,
  amount_ttc REAL NOT NULL DEFAULT 0,
  file_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX invoices_user ON invoices(user_id);
