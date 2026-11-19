-- Messages sent from the contact page (/contact/), read by the team in /admin/demandes/.
-- topic: the activity the visitor chose (it will also pick the e-mail sender: LDL
-- Prestations, Formations, Boutique or Location). context: what the button that led to
-- the page carried (service, formation, cart lines, rental dates), rebuilt on the server
-- from the catalogue, one line per item.
CREATE TABLE contact_requests (
  id INTEGER PRIMARY KEY,
  topic TEXT NOT NULL DEFAULT 'autre' CHECK (topic IN ('prestations', 'formations', 'boutique', 'location', 'autre')),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL COLLATE NOCASE,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'nouvelle' CHECK (status IN ('nouvelle', 'traitee')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX contact_requests_created ON contact_requests(created_at);
CREATE INDEX contact_requests_email ON contact_requests(email, created_at);
