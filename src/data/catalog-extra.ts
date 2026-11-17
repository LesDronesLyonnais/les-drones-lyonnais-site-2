// Products added by hand, not on the WooCommerce site: scripts/import-catalog.mjs
// rewrites catalog.json, so they live here and catalog.ts merges them in.
// Photos in src/assets/products/<slug>-N.webp. Prices HT, TTC = ×1.2.
import type { Product, ProductPage } from './catalog';
import { PERMIS_BY_CLASS } from './regulation';

const ttc = (ht: number) => Math.round(ht * 1.2 * 100) / 100;
const sale = (p: Omit<Product, 'kind' | 'priceTTC'>): Product => ({ ...p, kind: 'vente', priceTTC: ttc(p.priceHT) });
const forM5T = ['accessoires', 'accessoires-pieces', 'boutique', 'dji-matrice'];

// DJI Matrice 5T (Enterprise, 2026) and its own accessories, prices of 2026-11-17.
// Left out because the reference page gives no price ("Nous consulter"): the DJI RC
// Plus 3 Enterprise radio (already in the drone's box) and the DJI AP1 parachute.
export const EXTRA_PRODUCTS: Product[] = [
  {
    slug: 'dji-matrice-5t',
    name: 'DJI Matrice 5T',
    kind: 'vente',
    priceHT: 7229.17,
    priceTTC: 8675,
    categories: ['bapd', 'boutique', 'c2', 'c6', 'dji-matrice', 'drones', 'open'],
    summary:
      'Le DJI Matrice 5T est le drone thermique repliable de DJI Enterprise pour la recherche, l’inspection et le relevé, de jour comme de nuit. Livré avec un an de DJI Care Enterprise Plus, activé au premier démarrage.',
    description: [
      { type: 'p', text: 'Le DJI Matrice 5T réunit dans un seul drone repliable ce que les secours, les forces de l’ordre, les gestionnaires de réseaux électriques et les équipes de cartographie attendent sur le terrain : chercher, inspecter et relever, de jour comme de nuit.' },
      { type: 'p', text: 'Sa nacelle porte une caméra thermique de 1280 × 1024 pixels, un grand-angle 50 MP (capteur 1/0,98 pouce), un téléobjectif moyen 70 mm et un téléobjectif 252 mm qui atteint un zoom hybride de 176×. Le télémètre laser situe une cible jusqu’à 3 000 m et l’éclairage infrarouge porte à 100 m.' },
      { type: 'p', text: 'Côté sécurité, un LiDAR 360°, des radars à ondes millimétriques et une vision couleur omnidirectionnelle repèrent un câble électrique à 32 m, même sous la pluie ou dans la poussière. Le drone vole jusqu’à 59 minutes, atteint 23 m/s, garde une liaison vidéo de 40 km grâce à sa 4G intégrée et résiste à l’eau et à la poussière (IP55), de −20 °C à 50 °C.' },
      { type: 'h', text: 'Dans la boîte' },
      { type: 'li', text: 'Drone DJI Matrice 5T avec carte microSD et cache de nacelle' },
      { type: 'li', text: 'Radiocommande DJI RC Plus 3 Enterprise' },
      { type: 'li', text: '6 paires d’hélices' },
      { type: 'li', text: 'Hub de charge Matrice 5 avec chargeur et câble d’alimentation' },
      { type: 'li', text: 'Câble USB-C vers USB-C' },
      { type: 'li', text: 'Valise de transport' },
      { type: 'li', text: 'DJI Care Enterprise Plus 1 an (activé au premier démarrage)' },
      { type: 'p', text: 'Batterie de vol vendue séparément.' },
    ],
    images: ['dji-matrice-5t-1.webp', 'dji-matrice-5t-2.webp', 'dji-matrice-5t-4.webp', 'dji-matrice-5t-3.webp'],
  },
  sale({
    slug: 'batterie-pour-dji-matrice-5t',
    name: 'Batterie pour DJI Matrice 5T',
    priceHT: 425.83,
    categories: [...forM5T, 'batterie'],
    summary: 'Batterie de vol intelligente de la série Matrice 5 : 215,2 Wh pour 768 g, jusqu’à 59 minutes de vol, chauffage intégré pour décoller par temps froid.',
    description: [
      { type: 'p', text: 'La batterie de vol intelligente du DJI Matrice 5T, vendue séparément du drone. Prévoyez-en plusieurs pour enchaîner les vols en secours, en inspection ou en cartographie.' },
      { type: 'li', text: '215,2 Wh pour 768 g' },
      { type: 'li', text: 'Jusqu’à 59 minutes de vol (54 minutes en stationnaire)' },
      { type: 'li', text: 'Chauffage intégré pour les décollages par temps froid' },
      { type: 'li', text: 'De 10 à 95 % en 30 minutes environ sur le hub de charge 515 W' },
      { type: 'li', text: 'Verrouillage en deux étapes, nouveau décollage en 10 secondes' },
    ],
    images: ['batterie-pour-dji-matrice-5t-1.webp'],
  }),
  sale({
    slug: 'hub-de-charge-515-w-pour-dji-matrice-5t',
    name: 'Hub de charge 515 W pour DJI Matrice 5T',
    priceHT: 95,
    categories: [...forM5T, 'batterie'],
    summary: 'Recharge trois batteries du Matrice 5T l’une après l’autre et alimente la radiocommande par USB-C : de 10 à 95 % en une trentaine de minutes.',
    description: [
      { type: 'li', text: '515 W, trois batteries chargées en séquence' },
      { type: 'li', text: 'De 10 à 95 % en une trentaine de minutes' },
      { type: 'li', text: 'Mode standard (100 %) ou mode stockage (95 %), qui ménage les batteries' },
      { type: 'li', text: 'Prise USB-C 5 à 28 V pour la radiocommande' },
      { type: 'li', text: 'Ventilateur intégré, charge de 5 à 40 °C' },
    ],
    images: ['hub-de-charge-515-w-pour-dji-matrice-5t-1.webp'],
  }),
  sale({
    slug: 'helices-standard-pour-dji-matrice-5t',
    name: 'Hélices standard pour DJI Matrice 5T',
    priceHT: 21.67,
    categories: forM5T,
    summary: 'Une paire d’hélices d’origine DJI 1460F (14,2 pouces), identiques à celles du Matrice 5T : la rechange à garder dans la valise.',
    description: [
      { type: 'li', text: 'Hélices d’origine DJI, modèle 1460F de 14,2 pouces' },
      { type: 'li', text: 'Extrémité en flèche : bruit du drone limité à 80 dB(A)' },
      { type: 'li', text: 'Vol jusqu’à 7 000 m d’altitude' },
      { type: 'li', text: 'Paire complète : sens horaire et sens antihoraire' },
    ],
    images: ['helices-standard-pour-dji-matrice-5t-1.webp'],
  }),
  sale({
    slug: 'projecteur-dji-al2-pour-dji-matrice-5t',
    name: 'Projecteur DJI AL2 pour DJI Matrice 5T',
    priceHT: 451.67,
    categories: [...forM5T, 'capteur-inspections'],
    summary: 'Un projecteur orientable de 60 W pour les recherches de nuit, les interventions de secours et les inspections sans éclairage.',
    description: [
      { type: 'li', text: 'Faisceau large (1 500 m² à 100 m) ou concentré (10 lux à 100 m)' },
      { type: 'li', text: '60 W, modes éclairage et stroboscope' },
      { type: 'li', text: 'Nacelle inclinable de −90° à +90°' },
      { type: 'li', text: '175 g, repliable, IP55, de −20 °C à 50 °C' },
      { type: 'li', text: 'Se monte avec le haut-parleur DJI AS2' },
    ],
    images: ['projecteur-dji-al2-pour-dji-matrice-5t-1.webp'],
  }),
  sale({
    slug: 'haut-parleur-dji-as2-pour-dji-matrice-5t',
    name: 'Haut-parleur DJI AS2 pour DJI Matrice 5T',
    priceHT: 305.83,
    categories: [...forM5T, 'capteur-inspections'],
    summary: 'Diffusez des consignes depuis les airs : 120 dB à 1 m, message audible jusqu’à 400 m, feu d’avertissement intégré.',
    description: [
      { type: 'li', text: '120 dB à 1 m, diffusion jusqu’à 400 m' },
      { type: 'li', text: 'Voix en direct, message enregistré, fichier importé ou synthèse vocale' },
      { type: 'li', text: 'Feu d’avertissement intégré' },
      { type: 'li', text: '194 g, 35 W, IP55, de −20 °C à 50 °C' },
      { type: 'li', text: 'Se monte avec le projecteur DJI AL2' },
    ],
    images: ['haut-parleur-dji-as2-pour-dji-matrice-5t-1.webp'],
  }),
  sale({
    slug: 'renouvellement-dji-care-enterprise-plus-pour-dji-matrice-5t',
    name: 'Renouvellement DJI Care Enterprise Plus pour DJI Matrice 5T',
    priceHT: 658.33,
    categories: forM5T,
    summary: 'Prolonge d’un an la couverture DJI Care Enterprise Plus du Matrice 5T, jusqu’à la troisième année.',
    description: [
      { type: 'li', text: 'Réparations sous plafond, dégâts des eaux, transport aller-retour offert' },
      { type: 'li', text: 'Remplacement en cas de perte en vol' },
      { type: 'li', text: 'Couvre le drone, le module RTK, la nacelle, la batterie, les hélices, la radiocommande et le hub' },
      { type: 'li', text: 'Activation en ligne avec le numéro de série, dans les 15 jours après la fin de la couverture en cours' },
    ],
    images: ['renouvellement-dji-care-enterprise-plus-pour-dji-matrice-5t-1.webp'],
  }),
];

export const EXTRA_PAGES: Record<string, ProductPage> = {
  'dji-matrice-5t': {
    crossSell: [
      'Batterie pour DJI Matrice 5T',
      'Hub de charge 515 W pour DJI Matrice 5T',
      'Projecteur DJI AL2 pour DJI Matrice 5T',
      'Haut-parleur DJI AS2 pour DJI Matrice 5T',
    ],
    discover: {
      title: 'DJI MATRICE 5T',
      text: 'Le drone thermique repliable de DJI Enterprise : caméra thermique 1280 × 1024, zoom hybride 176×, télémètre laser 3 000 m et LiDAR 360°, avec jusqu’à 59 minutes de vol.',
      stats: [
        { value: 'THERMIQUE 1280 × 1024', label: 'Quatre fois plus de points que la génération précédente' },
        { value: 'ZOOM 176X', label: 'Une plaque lisible à 400 m' },
        { value: '59 MIN', label: 'De vol, liaison vidéo jusqu’à 40 km' },
      ],
    },
    know: [
      { title: 'Triple caméra 50 MP', text: 'Grand-angle 23,5 mm, téléobjectif 70 mm et téléobjectif 252 mm.' },
      { title: 'Télémètre laser 3 000 m', text: 'Positionne une cible à distance, avec éclairage infrarouge jusqu’à 100 m.' },
      { title: 'LiDAR 360° et radars', text: 'Câbles électriques détectés à 32 m, même sous la pluie ou dans la poussière.' },
      { title: 'IP55, de −20 °C à 50 °C', text: 'Résiste à l’eau et à la poussière pour voler par tous les temps.' },
      { title: '4G intégrée', text: 'Double modem 4G, récepteurs ADS-B et Remote ID, relais à une ou deux radiocommandes.' },
      { title: 'DJI Care 1 an inclus', text: 'DJI Care Enterprise Plus activé au premier démarrage, renouvelable.' },
    ],
    forWho: [
      { title: 'Secours et sécurité', text: 'Pour chercher une personne ou surveiller une zone, de jour comme de nuit.' },
      { title: 'Réseaux et énergie', text: 'Pour inspecter lignes électriques et installations en restant à distance.' },
      { title: 'Cartographie', text: 'Pour relever un site et produire une carte rapidement.' },
    ],
    // Classes C2 and C6: either licence. The texts are the official ones of each class
    // (data/regulation.ts); only the training family is ours.
    permis: { ...PERMIS_BY_CLASS.C2, formation: { ...PERMIS_BY_CLASS.C2.formation!, family: 'TECHNIQUE' } },
    permisOr: { ...PERMIS_BY_CLASS.C6, formation: { ...PERMIS_BY_CLASS.C6.formation!, family: 'TECHNIQUE' } },
    pop: [
      'Choisissez le Matrice 5T pour la recherche, l’inspection thermique ou la surveillance, de jour comme de nuit : caméra thermique, zoom 176× et télémètre laser dans un drone repliable.',
      'Il est classé C2 et C6 : avec le BAPD, vous le pilotez en catégorie Open (A2) ; avec le CATS, en scénario STS-02. L’un ou l’autre suffit, selon vos missions.',
    ],
  },
};
