# Les Drones Lyonnais — Website

Public website for **Les Drones Lyonnais**, drone operators based in Lyon working across
France: drone services (aerial filming, inspection, 3D/topography, audiovisual),
training, equipment sales (shop) and equipment rental.

Current production site: https://www.lesdroneslyonnais.com/ (WordPress + Elementor +
WooCommerce, WooCommerce Bookings for rental, WooPayments). No orders or bookings have
been recorded on it, so there is no customer data to migrate.

The goal is to replace it with a code-based site that is faster, better designed and
easier to evolve. Treat the current site as a content, business and SEO reference — not
as a technical or visual constraint.

## Stack

- Astro (static, plus on-demand account pages on the Cloudflare adapter), TypeScript, Tailwind CSS 4
- Cloudflare for hosting
- Stripe for payments (test keys during development), via Stripe Checkout
- Cloudflare Worker + D1 later, only for dynamic data (orders, bookings, availability)
- Playwright for visual QA

No React by default. Minimal client JavaScript — the homepage ships none.

## Commerce decisions (agreed)

- Shop and rental use **different devices**: two independent systems, no shared stock.
- Shop: catalogue in the repo, cart + Stripe Checkout session created by a Worker,
  prices checked server side.
- Rental, v1: availability shown on the site, booking *request* (dates + pilot
  certificate), manual validation, then a Stripe payment link with deposit.
  Card authorisations expire after ~7 days: save the card (SetupIntent) and place the
  hold or charge just before / after the rental.
- No Shopify, no Booqable.

## SEO migration

- Keep indexed URLs (trailing slash, as on WordPress). The sitemaps list ~25 pages,
  10 posts, 153 products (`/produit/...`), 42 product categories, 10 brands.
- Clean up with 301 redirects: duplicate pages (`*-2/`, two wedding pages), technical
  pages (`rent-grid`, `rent-list`, `modele`, `thank-you`), messy categories.
- Never silently break an indexed URL.

## Structure

src/
  pages/           routes
  layouts/         BaseLayout
  components/      layout/, home/, seo/, ui/
  data/            typed business data (site.ts = single source of truth)
  assets/          images optimised by astro:assets
  styles/          global.css (design tokens)
public/            fonts, favicon, robots.txt

## Homepage motion (client request: a "wow" effect)

- First screen (client request, 2026-10-27): a realistic 3D drone in the middle of the
  page (Three.js, lib/hero-drone.ts) and four **modes** — Prestations, Boutique,
  Location, Formations. Each mode has its own set and flight (scan beam / showroom
  pedestal / landing pad / figure of eight through gates), labels pinned to the drone,
  copy and CTAs. Drag turns the drone. Content of the modes: src/data/modes.ts.
- 2026-11-04 (client request): the first screen is back to the WordPress format, three
  full-height panels on photos (HeroPanels.astro: Prestations, Formations, Vente &
  location; hovered panel widens; hover/focus sets the mode). The 3D drone hero
  (Hero.astro) is kept in the repo but no longer used by index.astro.
- **The whole homepage follows the mode**: html[data-mode] (set before paint from
  ?mode= or sessionStorage by BaseLayout's `mode` prop, changed by lib/mode.ts) +
  `[data-for="<mode>"]` elements and the animatable `--accent` colour (global.css).
  Mode-aware so far: hero, ModeFocus (offers under the hero, ending on a big "see the
  N items" link to the full page: its job is the click), FinalCta (`byMode`).
- 2026-10-28: the services screens (Services, ServicesSplit) and the pinned team
  (Team.astro) were removed from the homepage at the client's request; the team is
  TeamGrid (four portraits). Portrait sizes its disc from width + aspect-ratio only
  (a percentage height made it an oval in Safari).
- The model is /models/drone.glb: "DJI Mavic 3" by llirikslon (Sketchfab, CC BY 4.0,
  credit shown in the hero — keep it). Source in media-src/drone/ (gitignored, the
  Matrice 300 there was rejected: CAD look, merged propellers). Rebuild with
  `node scripts/prepare-drone.mjs` (names rotors prop_N for spinning, meshopt + WebP).
  A built-in procedural drone is the fallback if the model cannot load.
- Earlier heroes tried: "drone camera" HUD (assets feed-*.jpg), then the WordPress
  three-panel layout (assets hero-*.jpg). Both replaced.
- One boot-up sequence on load; on scroll the page rises over the hero while the
  picture moves down at half speed, blurs and darkens (plain JS scroll + rAF in
  Hero.astro, so it works in Safari too). A lens-opening effect was tried and dropped.
- Services: "same drone, different sensors" — a pinned control screen shows each
  service through its camera mode (SVG filters: thermal, survey; overlays for mesh,
  detection, cinema, live, grading). Photos from the current site, in src/assets/services.
- Team: real photos, cut out (src/assets/team). Each can get a looping portrait video:
  raw clips in media-src/team/<name>.mp4 (gitignored) → `npm run videos` (ffmpeg-static,
  720×720 square, WebM + MP4, no sound; --boomerang for a forward/back loop) →
  public/team/. Portrait.astro uses them only if the files exist and plays them only
  while on screen. Clips are generated from the avatars with Runware (Kling 2.5 Turbo
  Pro, same image as first and last frame for a seamless loop, ~$0.35 each):
  `node --env-file=.env scripts/generate-team-videos.mjs <name>` (RUNWARE_API_KEY in
  .env). Check frames before encoding; regenerate a take that looks off. Illustrated SVG avatars and WebGL-warped photos were tried and
  rejected by the client. Illustrated or traced avatars were tried
  and rejected by the client: keep real photos.
- Coverage (redone 2026-11-21, client: "not pretty", inspired by les-formateurs-ia.fr; then
  "too many cities: we have three, Lyon, Paris, Marseille, and we travel all over France"):
  CoverageMap.astro, a dark section, France as a field of dots (outline in
  src/data/france-outline.ts, union of the regions of france-map.ts — IGN Admin Express,
  Licence ouverte, keep the credit). "Nos villes" (default): gold dots around Lyon (gold
  square, our base), Paris and Marseille, arcs from Lyon with light travelling (SMIL
  animateMotion, negative begin); "Toute la France": every dot lit, waves from the three
  cities. No pin, no zoom, no other cities. The commitments are their own section below
  (Commitments.astro, "Nos engagements").
- Reveals fire once (`data-reveal` + `src/lib/reveal.ts`, the only client script).
- Scroll-linked effects are native CSS scroll-driven animations inside
  `@supports (animation-timeline: …)`, always written with longhands
  (`animation-name`, `animation-timeline`…): the minifier folds a timeline into the
  `animation` shorthand, which browsers reject.
- Everything has a still version under `prefers-reduced-motion: reduce`.

## Working method

Inspect before changing. Small focused components. Reuse `data/site.ts`.
For any UI work: build, run locally, review desktop / tablet / mobile with Playwright,
check hover, focus, overflow and reduced motion, fix, review again.

Skills: `ldl-art-direction` (identity), `seo-production`, `visual-qa`,
`astro-cloudflare`, plus the design-engineering skills (`emil-design-eng`, `animate`,
`review-animations`, `frontend-design`…).

## Pages built

- `/` homepage (proof of concept).
- `/prestations/` services hub: hero in two states (PrestationsHero.astro, 2026-10-28):
  Technique by default (animated survey background: grid, topographic contours, scan
  beam, targets, live readouts; guide Dylan), Artistique after the flight-mode lever of a
  drone remote is flipped (aperture opening onto a cinematic frame: FPV shot, letterbox,
  grain, thirds, REC timecode; guide Théo). The lever is centred on its own row between
  two rails; the family's 9 services show at once on a board (3 × 3, name + small photo;
  client asked on 2026-10-28 for an overview at a glance, a carousel was dropped); the
  chosen family's catalogue moves first (html[data-famille]); ?famille=artistique opens it,
  both catalogues as a mosaic of full-bleed photo cards (one large, tall and wide ones,
  text on the photo, colour photos; the artistic family mirrors the layout — client asked
  on 2026-10-28 for cards that stand out and bigger images), five-step
  method (Method.astro: pinned on large screens, a drone flies through one waypoint per
  step and the reached card lights up, each step illustrated by a Pop pose — `pose` in
  METHOD / FORMATION_STEPS; also used on /formations/), quote request. Services live in src/data/services.ts (single source for the
  homepage screen and this page); photos are cropped by lib/service-photo.ts.

- `/formations-drone-a-lyon/`: FormationsHero.astro (2026-10-28): a flight-school field
  seen from above where a drone flies a real exercise of the chosen path (Technique:
  photogrammetry survey grid over a building, photo triggers; Artistique: orbit around a
  point of interest), a flight log, and a 3D "path card" (front Technique / Dylan, back
  Artistique / Théo) that tilts with the pointer and flips on click or with the two tabs.
  The chosen path's catalogue moves first; ?parcours=artistique opens it. Path picker
  (2026-11-21, client: "we don't see that you can switch"): "Choisissez votre parcours", two
  large options (icon, name, sector), a block in the path's colour slides under the chosen one,
  ✓ on it and → on the other, which nudges with a ring three times until the first click
  (hero data-touched). Same day ("shift it left, it looks busy", then "a little less, keep a
  small margin"): the hero's content is wider than .wrap (max 1480px, padding up to 80px), the
  exercise is narrower and centred in the clear middle (C, passed to the script by
  data-centre), the flight zone starts after the copy, and the exercise is hidden below 1180px.
  Mouse effect (2026-11-21, client liked the hover of les-formateurs-ia.fr's training pages):
  lib/point-cloud.ts + ui/PointCloudLayer.astro (first child of a `relative isolate` white
  section) — faint survey points light up under the mouse in the path's colour, lightened for discretion (--cloud: #5a9a4c,
  --color-gold for artistique; client, 2026-11-21) and link into a triangulated mesh, a few become ground control targets,
  the mesh fades behind; a scan line passes once over the first white section. Client: not on
  the dark hero ("too busy"), on every white part of the page (FormationGuide, the technique
  FormationCatalog, Method with `cloud`), fading out (points shrink) where a white part meets a
  dark one. One grid aligned on the page, so it runs on across adjacent white sections; each
  layer's canvas is one screen tall and sticky (no huge canvas for the pinned Method), only
  allocated while on screen. Mouse only, nothing under reduced motion. DeckHero.astro
  is no longer used by any page.
  Below it (2026-10-28, client found the catalogue unclear): FormationGuide ("Par où
  commencer ?": the 3 steps Open/BAPD → Spécifique/CATS → spécialisation, LEVEL_GUIDE,
  plus CPF funding, with the Qualiopi logo and category line since 2026-11-21, linking to the
  certificate in /mentions-legales/#formation), then each family as fact sheets (FormationCatalog: certifications
  side by side, then specialisations; photo with step badge, objective, Durée and
  Prérequis on every card). Formations in src/data/formations.ts (`prerequisite` field).
- `/boutique/` (reorganised 2026-11-20, client: "no dynamism at the top, a parade of products
  with no logic below"): ShopShowcase (dark, title + search, the best sellers Mavic 4 Pro /
  Mini 5 Pro / Neo 2 / Matrice 4 in big photos changing every 6.5 s, names with progress
  bars, pause button, hover/focus pause, swipe; reduced motion = no autoplay), ShopMenu (the
  categories of the current site, SHOP_MENU in data/catalog.ts, kept under the showcase at the
  client's request, then redesigned the same day — "clearer, more modern, centred": centred
  segmented control with icons and a sliding black block, "Par réglementation" shown as
  "Selon votre permis", one sentence per tab, centred cards with the cheapest product's photo
  or, in the permit tab, the official EU class label (ui/ClassLabel.astro: digit in a circle with
  three lines each side, redrawn as SVG from the label the client sent on 2026-11-21), count; phones scroll the cards; click only; Pop help line +
  "Voir les N produits"; each card is a catalogue filter), ShopUses
  ("Que voulez-vous faire ?", 5 photo tiles), then one section per use with one FamilyBlock
  per drone family (photo, "Choisissez votre version" rows with class and TTC/HT price,
  "Accessoires compatibles" row), sensors after the professional use, "Pilotage, stockage
  et terrain", then the full catalogue (ProductGrid) in the same order. Organisation in
  src/data/shop.ts (FAMILIES with `terms` matched in product names, USAGES, SHOWCASE): a new
  product joins its family by its name, the rest falls into sensors / other gear. Photos in
  src/assets/shop/ (real photos: current site's media library and DJI press/sample images;
  dji.com serves its US site here, without the Mavic 4 Pro / Mini 5 Pro / Neo 2 pages).
  A "back to top" button (ui/BackToTop.astro, `after` = first screen selector; black square just
  left of Pop's button, whose empty box no longer catches clicks) shows once the showcase is gone.
  ShopHero (search + ShopMenu + the Octobre Rose band, data/campaign.ts) is no longer used by
  /boutique/: for a seasonal campaign, bring its band back into ShopShowcase.
- `/location-drone-et-camera/`: RentalHero = search + category tiles + featured packs.
- Heroes are deliberately different per page; do not reuse one hero everywhere.
- Activity headers (client request, 2026-11-19): /prestations/, /formations-drone-a-lyon/,
  /boutique/ and /location-drone-et-camera/ use ActivityHeader (BaseLayout `activity` prop)
  instead of the transparent Header: a copy of the WordPress header — white 63px bar, the
  activity's LDL logo (src/assets/brand/ldl-<activity>.png; the boutique one has a navy dot,
  as on the client's logo sheet) + "| ACTIVITY", menu in Montserrat (@fontsource, 600/700)
  centred on the page, current page in its colour and underlined, account, cart with its
  count even at 0, the activity's button (Demander un conseil / Conseil & devis / Réserver
  maintenant; hover: white with coloured text). Colours: #0835bd, #296321, #04082d,
  #e25d02. Burger below 1280px. Heroes read --header-over / --header-solid (global.css) so
  they leave no empty band under the solid bar.
  Since 2026-11-19 (client request) every page except the homepage uses it: service pages
  and /timelapse-chantier/ = prestations, product pages = boutique or location (product
  kind), account area (AccountLayout) = 'general', the WordPress header of Mon compte /
  Contact ("| LES DRONES LYONNAIS" in black, black "Contactez-nous" button with the chat
  icon; `current="contact"` for the future contact page). The homepage keeps the
  transparent Header over its panels (full width since 2026-11-19).
- Search: /recherche.json (built), lib/search-client.ts, components/shop/SearchBox.astro.
- Pop (mascot) is everywhere: PopChat (layout, guided assistant, answers in the file,
  contextual per page, opens with [data-pop-open][data-pop-ask]) and PopTip (speech
  bubble with a pose from src/assets/pop/). Regulation advice in data/regulation.ts.
- `/produit/<slug>/` for all 152 products (same URLs as WordPress). Catalogue imported
  from the WooCommerce Store API by `node scripts/import-catalog.mjs` →
  src/data/catalog.json + src/assets/products/ (prices HT; TTC = ×1.2; rentals per day).
  Filters in src/data/catalog.ts. The team's per-product content (docs, rent/buy link,
  "Complétez votre équipement", "Découvrez le" + figures, "Ce qu'il faut savoir", "Pop
  vous conseille", "Pour qui ?", "Quel permis ?") is imported by
  `node scripts/import-product-pages.mjs` → src/data/product-pages.json and shown by
  components/shop/ProductStory.astro. "Quel permis ?" shows the official EU class label (ui/ClassLabel.astro, white on the black card,
  drawn in on reveal, since 2026-11-21; product photos and catalogue cards show the class the
  same way, ui/ClassBadge.astro: one label per class, white circle + thin white halo, no plate; "C0/C1" → two) and always the official
  text of the drone's class (PERMIS_BY_CLASS in data/regulation.ts, checked against DGAC /
  EASA on 2026-11-17; A1/A3 shown as a prerequisite of BAPD and CATS); the imported text is
  ignored and non-drones get no block. A drone with two classes (Matrice 5T: C2 or C6) uses
  `permisOr`. Hand-added products: data/catalog-extra.ts (survives the import). Pop's advice is one section of its own (PopAdvice, after
  "Découvrez le": large Pop, chat bubbles that type in, quick questions opening PopChat),
  not bubbles scattered in the page; Pop also peeks over the "Quel permis ?" card. New
  high-res Pop poses (conseil, drone) come from `node --env-file=.env
  scripts/generate-pop.mjs <pose>` (Runware, FLUX Kontext from an existing pose +
  background removal, raw files in media-src/pop/). Sale CTA = order request, rental = dates + estimate +
  booking request, both to /contact/ until the Stripe Worker exists.

- The 18 service pages (2026-10-28), at their WordPress URLs (/inspection-thermique-par-drone-2/…):
  one template, src/pages/[service].astro, content in src/data/service-pages/<slug>.ts
  (schema in data/service-pages.ts), rewritten from the current pages (client asked for
  better copy; no invented facts). Two moods by family: technique = the drone's sensor
  (ServiceHero: scan line showing the photo through thermal / survey / night / detection
  filters, flight readouts; ServiceProcess: flight plan, a drone flies waypoint to
  waypoint with the scroll; ServiceCase: mission report) and artistique = the film set
  (letterbox, grain, REC timecode, LIVE, LOG/REC.709 split; editing timeline with a
  playhead; clapperboard that claps). Also a pre-flight checklist, a film strip of the
  page's own photos (`node scripts/import-service-photos.mjs` → src/assets/services/
  pages/<slug>/), FAQ (FAQPage JSON-LD), related services. Pop appears once, in the
  closing CTA (new poses clap / ingenieur from generate-pop.mjs). Quote links:
  /contact/?prestation=<slug>.
- /nettoyage-par-drone/ (2026-11-04): the page arrives dirty and a tethered cleaning drone
  washes it (components/service/CleaningWash.astro, canvas; off under reduced motion).
- /bureau-detude-drone/ deliverables (2026-11-05): hover / focus a deliverable to see its
  preview (DeliverablesPreview.astro; `preview` + `file` on deliverable items; thumbnails
  on small screens). Previews are illustrations of ONE synthetic site (quarry, stockpiles,
  building), labelled "Exemple": `node scripts/render-deliverables.mjs` →
  src/assets/deliverables/*.webp (renderer: scripts/deliverables/renderer.js).
- Cart (2026-10-28): lib/cart.ts (localStorage, `ldl:cart` event) + components/shop/
  CartDrawer.astro in BaseLayout, header button [data-cart-open] with count. Any
  [data-cart-add] (data-cart-item JSON, optional data-cart-suggest, data-cart-qty,
  data-cart-source) adds: a small drone carries the product photo to the header cart,
  then the drawer opens as a flight case (metal lid, foam slots, accessories to add).
  Pop only in the empty case. "Valider ma commande" → /contact/?commande=slug*qty,…
  until Stripe Checkout. Sale product pages: quantity + "Ajouter au panier"; rentals
  keep the booking request.

- /timelapse-chantier/ (2026-11-10): a client's building site (École Nat N°2) seen by a Tikee
  timelapse camera: live Tikee photo gallery + the film of each month (latest large, older
  months in <details> so their iframes load on opening). Content in src/data/timelapse.ts,
  updated by hand monthly (new video at the TOP of `videos`). Every iframe is sandboxed
  (IFRAME_SANDBOX, no allow-downloads / allow-popups): Tikee's "Téléchargement Image" link
  stays in its menu but downloads nothing (tested in Chromium). noindex, not in the menu.
  The Tikee gallery's title is white: keep it on a dark background.

- Accounts (2026-11-17): the site stays static except /connexion/, /compte/, /admin/ (on demand,
  `prerender = false`), via @astrojs/cloudflare 14.3 (prerenderEnvironment node, images
  compiled at build; build output dist/client + dist/server). D1 `DB` (schema in migrations/,
  `npm run db:migrate`, demo data `npm run db:seed`: three accounts whose temporary
  passwords are written at the top of scripts/seed-accounts.sql, local only) and R2 `FILES`
  (invoice PDFs, deliverables). Sign-in: e-mail + password (PBKDF2-SHA256 100k, lock after
  5 failures / 15 min), sign-up for shop customers, temporary passwords set by the admin
  (must_change_password → /compte/mot-de-passe/ first), forgotten password = one-time
  e-mail link (Brevo since 2026-11-19, sender by role; also shown on the page in dev). Session
  cookie; src/middleware.ts guards the areas. Roles: admin (/admin/: clients,
  orders, missions, deliverables, invoices), boutique (orders + invoices), prestation
  (missions: date, place, terms, deliverables + invoices). Files only through
  /compte/fichier/<facture|livrable>/<id>/ (owner or admin). ADMIN_EMAILS in .dev.vars /
  secret, never in wrangler.jsonc. Runtime types: src/cloudflare.d.ts (the full
  `wrangler types` runtime breaks the DOM types), bindings: `npm run types`.
  Cloudflare account of Les Drones Lyonnais (since 2026-11-19; until 2026-11-17 the site was
  built on a former account): D1 `ldl-accounts` (Western Europe, migrations applied
  --remote) and the SESSION KV are in wrangler.jsonc with their ids — previews
  (`wrangler preview`) do not create missing resources. No R2: the accounts are moving to the
  Supabase project of the LDL Academy app (shared accounts, `site` schema, private bucket
  for invoices / deliverables — agreed 2026-11-19); until then file uploads and downloads
  answer "bientôt disponible" (files() may be undefined).
  Previews: every pushed branch gets a preview link (`preview_urls`), shown in the Cloudflare
  check on the commit; review there before merging into main. Cloudflare Worker: `lesdroneslyonnais`
  (the name in wrangler.jsonc must match the Worker connected to the repo, or builds fail).

- /contact/ (2026-11-19, client: "an important page, make it nicer"; from the WordPress
  contact page): on demand (prerender = false). Title, then the details as editorial rows
  (phone, e-mail, address with a route link, hours with "open now" computed in Europe/Paris
  from SITE.hours) next to the form, Pop peeking over it (coucou; left on phones, the chat
  button is bottom right). Once stored, a 303 to /merci-contact/?activite=<topic>. The form starts with the
  activity (topic chips; it will pick the e-mail sender LDL Prestations / Formations /
  Boutique / Location) and is pre-filled from the button that led there (?prestation=,
  ?formation=, ?commande=slug*qty,…, ?location=&du=&au=): subject + recap rebuilt on the
  server from the catalogue (lib/server/contact.ts), never trusted from the form. Bots: a
  hidden field + 2.5 s minimum; 5 messages per address per hour. Stored in D1
  contact_requests (migration 0003, applied --remote), read and handled in
  /admin/demandes/ (tab "Demandes"). E-mails through Brevo (lib/server/mail.ts, the app's
  provider, transactional API): the team gets the request (reply-to = visitor), the visitor
  an acknowledgement, sender name by activity (LDL Prestations / Formations / Boutique /
  Location, "Les Drones Lyonnais" otherwise), one sender address MAIL_FROM (default
  SITE.email, verified in Brevo). Worker secret BREVO_API_KEY_SITE (set by the client in the
  Cloudflare dashboard on 2026-11-19, expires 2027-11-19 — a reminder is scheduled for
  2027-10-19; previews need it too via `wrangler preview secret put`); without
  it nothing is sent and the reason is logged. Optional vars: MAIL_FROM,
  CONTACT_NOTIFY_TO. Address / hours in data/site.ts.
- /merci-contact/ (2026-11-20, client: "the WordPress version is more fun"), its WordPress URL,
  static, noindex: "Votre message a bien atterri." (gold "atterri."), Pop moonwalking on an
  orbit (the WordPress 4 × 2 sprite sheet, assets/merci/pop-moonwalk.webp, 8 frames in
  0.96 s + a 5.6 s glide), the route drawing itself, the "Message bien reçu" card and its
  tick, "Et maintenant ?" in two steps, the four activities. A pause button (data-motion)
  stops every animation; reduced motion = still Pop. ?activite= sets the second button.

- /mentions-legales/ (2026-11-21), its WordPress URL: rewritten (the WordPress page dated from
  2022: old host, a pre-production domain, repealed laws). Facts in COMPANY / HOST (data/
  site.ts), from the public company register (recherche-entreprises.api.gouv.fr): SARL,
  SIREN 894 357 755, registered office in Morancé (≠ the Limonest office of SITE.address),
  APE 59.11B, manager Dylan Castano (director of publication), training body NDA
  84 69 19979 69; capital 1 000 €, RCS Villefranche-Tarare, office and director confirmed by
  the client on 2026-11-21. Qualiopi: logo (assets/brand/qualiopi.png, cut from the
  certificate) + the mandatory category line ("actions de formation"), certificate
  CW202520-4788 by BCI France, valid until 2027-03-04 — remove or renew the logo then (also
  on /formations-drone-a-lyon/; a reminder is scheduled for 2027-02-04). Sections: publisher, publication, host (Cloudflare), training body, IP and
  credits (IGN map), personal data (contact form, accounts, Brevo), cookies (session cookie
  only when signed in, local storage, host's security cookies; no analytics), liability,
  law. Layout: components/legal/LegalPage.astro.

- /conditions-generales/ (2026-11-21, client: "cover us as much as possible on trainings,
  services, shop and rental"; rental: our insurance covers nothing, breakage / theft / loss
  are the renter's, who must be on AlphaTango, hold an RC Pro and check the rules himself).
  Content in src/data/cgv.ts (articles as HTML, numbered Art. 1–52 across 5 parts: common,
  shop, rental, services, trainings; then annex 1 = legal guarantee box D.211-2, annex 2 =
  withdrawal form R.221-1 — both typed from memory and secondary sources, Légifrance was
  behind a robot check: to verify word for word). Commercial figures in TERMS and the
  cancellation lists (validated by the client on 2026-11-21); MEDIATOR = CM2C (chosen 2026-11-21 as the cheapest:
  ~48 € / 3 years + 36 € per case; the client must sign up on cm2c.net). Rental deposit = the
  value of the equipment (client, 2026-11-21), also said on rental product pages. Liability limits never apply to consumers where the law forbids
  it. Both legal pages use components/legal/LegalPage.astro (head, sticky contents, print
  button and print styles). To be reviewed by a lawyer.

- /reglement-interieur/ (2026-11-21): the training body's internal rules (client's document of
  2024-02-19, its art. 14 says it is online), transcribed with obvious errors fixed ("Drone On
  Air" → LDL, Auvergne-Rhône-Alpes, OPCO / France Travail, typos). Linked from the CGV and the
  Qualiopi band of /formations-drone-a-lyon/. Downloadable PDF made from the page:
  `node scripts/render-reglement-pdf.mjs` (site served locally) → public/documents/.
- /politique-de-confidentialite/ (2026-11-21): what the site really does (checked in the code:
  contact form, accounts, Brevo, no analytics, Pop runs in the browser), purposes and legal
  bases, recipients, transfers (DPF / SCC), retention (contact requests 3 years — purged when
  /admin/demandes/ is opened, with expired sessions, links and old failed sign-ins; inactive
  accounts 3 years — not automated yet, invoices must be kept 10 years), security, cookies,
  rights, CNIL, minors. Tables turn into cards on phones (LegalPage .table + data-label).

Next: Stripe checkout (from the cart) and booking Worker, redirect plan, domain switch.
Legal pages done on 2026-11-21 (mentions légales, CGV, privacy policy, internal rules).