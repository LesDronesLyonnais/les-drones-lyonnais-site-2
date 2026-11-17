-- Demo accounts for local testing only (npm run db:seed, after npm run db:migrate).
-- Fictitious people and companies, on the reserved .test domain. NEVER load this file into
-- the production database: the passwords below are public.
--
-- Sign in at /connexion/ with these temporary passwords; at the first sign-in each
-- account is asked to choose its own (run npm run db:seed again to get them back):
--   e-mail                         temporary password    account
--   admin@exemple.test             Demo-Admin-4821       administrator
--   client.boutique@exemple.test   Demo-Boutique-3157    shop customer (2 orders)
--   client.pro@exemple.test        Demo-Pro-7604         services client (3 missions)
--
-- Invoices and deliverables need files: add them from /admin/ (stored in local R2).

DELETE FROM users WHERE email IN ('admin@exemple.test', 'client.boutique@exemple.test', 'client.pro@exemple.test');

INSERT INTO users (email, name, company, phone, role) VALUES
  ('admin@exemple.test', 'Admin Démo', 'Les Drones Lyonnais', '', 'admin'),
  ('client.boutique@exemple.test', 'Camille Martin', '', '06 00 00 00 01', 'boutique'),
  ('client.pro@exemple.test', 'Alex Durand', 'Bâtiments Démo SAS', '06 00 00 00 02', 'prestation');

INSERT INTO orders (user_id, number, ordered_on, status, items, total_ttc) VALUES
  ((SELECT id FROM users WHERE email = 'client.boutique@exemple.test'), 'CMD-DEMO-0001', '2026-10-02', 'livree',
   '[{"name":"DJI Mini 5 Pro Fly More Combo","qty":1,"priceTTC":1099},{"name":"Carte microSDXC Extreme PRO 128 Go","qty":2,"priceTTC":29.9}]', 1158.8),
  ((SELECT id FROM users WHERE email = 'client.boutique@exemple.test'), 'CMD-DEMO-0002', '2026-11-12', 'en_preparation',
   '[{"name":"DJI Matrice 5T","qty":1,"priceTTC":8675},{"name":"Batterie pour DJI Matrice 5T","qty":2,"priceTTC":511}]', 9697);

INSERT INTO missions (user_id, title, service, mission_on, place, details, status) VALUES
  ((SELECT id FROM users WHERE email = 'client.pro@exemple.test'), 'Inspection thermique de la toiture', 'inspection-thermique-par-drone-2', '2026-09-18', 'Entrepôt, Vénissieux (69)',
   'Drone DJI Matrice 4T, caméra thermique.
Vol entre 7 h et 9 h, toiture froide, sans soleil direct.
Télépilote : Dylan. Zone dégagée par le site pendant le vol.', 'livree'),
  ((SELECT id FROM users WHERE email = 'client.pro@exemple.test'), 'Relevé photogrammétrique du terrain', 'modelisation-3d-drone', '2026-11-05', 'Parcelle, Décines-Charpieu (69)',
   'Plan de vol en grille, 120 photos, recouvrement 80 %.
Livrables prévus : orthophoto, nuage de points, modèle 3D.', 'realisee'),
  ((SELECT id FROM users WHERE email = 'client.pro@exemple.test'), 'Suivi de chantier — passage de décembre', 'suivi-de-chantier-timelapse', '2026-12-03', 'Chantier, Lyon 7e',
   'Passage mensuel : photos et vidéo aux mêmes points de vue que le mois précédent.', 'planifiee');

-- Temporary passwords above, hashed (PBKDF2-SHA256, as lib/server/auth.ts).
UPDATE users SET password_hash = 'pbkdf2$100000$ae764f3392b4875785818fccfdd802e2$3051e14742f40087f225cb1e031356b96e47fcebd493d85188ad2015796a6fbb', must_change_password = 1 WHERE email = 'admin@exemple.test';
UPDATE users SET password_hash = 'pbkdf2$100000$7a5d434ff21ea41455d0e6fb71a9fc12$7c814aa0abd3290bd690efaf5d332500607d350b6bc064d3ba22e75a0284679b', must_change_password = 1 WHERE email = 'client.boutique@exemple.test';
UPDATE users SET password_hash = 'pbkdf2$100000$209287951fbba5de6aac7b6823f02e47$21b199e361f70108e732cfe21044821835594936000bc7aa086e805de36a7a1b', must_change_password = 1 WHERE email = 'client.pro@exemple.test';
