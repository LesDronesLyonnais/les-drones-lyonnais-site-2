// What a drone's EASA class means for its pilot, in plain words. Used by Pop on product
// pages and in his chat, and by "Quel permis ?" on every product page.
// Sources (checked 2026-11-17): DGAC, ecologie.gouv.fr — "Exploitation de drones en
// catégorie ouverte", "Examens théoriques de télépilote de drone" (CATS prerequisites);
// EASA, standard scenarios STS-01 / STS-02; Regulation (EU) 2019/947 (Appendix 1) and
// 2019/945 (class limits).
import type { Permis } from './catalog';

/** Pose of Pop matching the certificate the class calls for. */
export const classPose = (cls: string) => (cls === 'C5' || cls === 'C6' ? 'permis-cats' : 'permis-a1-a3') as 'permis-cats' | 'permis-a1-a3';

export function classAdvice(cls: string): string {
  if (cls === 'C0') return 'Classe C0 : catégorie Open A1, aucune formation obligatoire, mais lisez la notice et enregistrez-vous comme exploitant si le drone a une caméra.';
  if (cls === 'C1' || cls === 'C0/C1') return 'Classe C1 : catégorie Open A1. Il faut l’attestation A1/A3 (formation et examen en ligne gratuits sur AlphaTango) et s’enregistrer comme exploitant.';
  if (cls === 'C2') return 'Classe C2 : catégorie Open A2. Pour voler jusqu’à 30 m des personnes, il faut le BAPD : attestation A1/A3, formation pratique et examen OPEN A2. Avec la seule attestation A1/A3, il vole en A3, loin des personnes.';
  if (cls === 'C3') return 'Classe C3 : catégorie Open A3, loin des personnes et à 150 m des zones habitées, avec l’attestation A1/A3.';
  return `Classe ${cls} : catégorie Spécifique, scénario standard ${cls === 'C6' ? 'STS-02' : 'STS-01'} déclaré par l’exploitant. Il faut le CATS (examen théorique) et une formation pratique au scénario : c’est l’objet de notre formation CATS.`;
}

// "Quel permis ?" per class. Steps of requirementDetail are separated by "+".
// formation.family is a placeholder: each product keeps its own (technique / artistique).
const OPEN_DAY = 'Vol à vue, de jour, 120 m de hauteur maximum';
const A1A3 = 'Formation et examen en ligne gratuits sur AlphaTango (40 questions) + Enregistrement exploitant sur AlphaTango';
const CATS = (sts: string) => `Attestation A1/A3 ou BAPD (prérequis) + Examen théorique CATS + Formation pratique ${sts} (organisme reconnu)`;

export const PERMIS_BY_CLASS: Record<string, Permis> = {
  C0: {
    category: 'OPEN',
    cls: 'C0',
    scenario: 'A1',
    allowsTitle: 'Ce que la classe C0 vous permet',
    allows: ['Drone de moins de 250 g', 'Survol de personnes isolées toléré, jamais de rassemblements', OPEN_DAY],
    requirement: 'Aucune formation obligatoire avec un C0',
    requirementDetail: 'Lire la notice du drone + Enregistrement exploitant sur AlphaTango si le drone a une caméra + Formation A1/A3 conseillée',
    formation: { level: 'OPEN', family: 'ARTISTIQUE', text: 'Pour passer de l’usage loisir aux missions professionnelles.' },
  },
  C1: {
    category: 'OPEN',
    cls: 'C1',
    scenario: 'A1',
    allowsTitle: 'Ce que la classe C1 vous permet',
    allows: ['Drone de moins de 900 g', 'Survol accidentel de personnes isolées toléré, jamais de rassemblements', OPEN_DAY],
    requirement: 'Attestation A1/A3 nécessaire pour voler avec un C1',
    requirementDetail: A1A3,
    formation: { level: 'OPEN', family: 'ARTISTIQUE', text: 'Pour passer de l’attestation en ligne aux missions professionnelles.' },
  },
  C2: {
    category: 'OPEN',
    cls: 'C2',
    scenario: 'A2',
    allowsTitle: 'Ce que la classe C2 vous permet',
    allows: [
      'Drone de moins de 4 kg',
      'Vol jusqu’à 30 m des personnes non impliquées, 5 m en mode basse vitesse, sans les survoler',
      'Sans BAPD : vol en A3, à 150 m des zones habitées, avec la seule attestation A1/A3',
    ],
    requirement: 'BAPD nécessaire pour voler en A2 avec un C2',
    requirementDetail: 'Attestation A1/A3 (prérequis) + Formation pratique (autoformation possible) + Examen théorique OPEN A2 (30 questions)',
    formation: { level: 'OPEN', family: 'ARTISTIQUE', text: 'Notre formation prépare la pratique et l’examen OPEN A2.' },
  },
  C3: {
    category: 'OPEN',
    cls: 'C3',
    scenario: 'A3',
    allowsTitle: 'Ce que la classe C3 vous permet',
    allows: ['Drone de moins de 25 kg', 'Vol à 150 m au moins des zones résidentielles, commerciales, industrielles ou de loisirs', 'Aucune personne non impliquée dans la zone de vol'],
    requirement: 'Attestation A1/A3 nécessaire pour voler avec un C3',
    requirementDetail: A1A3,
    formation: { level: 'OPEN', family: 'ARTISTIQUE', text: 'Pour maîtriser un drone de cette taille en mission.' },
  },
  C5: {
    category: 'SPÉCIFIQUE',
    cls: 'C5',
    scenario: 'STS-01',
    allowsTitle: 'Ce que la classe C5 vous permet',
    allows: ['Drone de moins de 25 kg', 'Vol à vue au-dessus d’une zone au sol contrôlée, y compris en zone peuplée', '120 m de hauteur maximum, après déclaration STS-01 de l’exploitant'],
    requirement: 'CATS nécessaire pour voler avec un C5',
    requirementDetail: CATS('STS-01'),
    formation: { level: 'SPÉCIFIQUE', family: 'ARTISTIQUE', text: 'Notre formation CATS prépare l’examen théorique et la pratique STS-01.' },
  },
  C6: {
    category: 'SPÉCIFIQUE',
    cls: 'C6',
    scenario: 'STS-02',
    allowsTitle: 'Ce que la classe C6 vous permet',
    allows: [
      'Drone de moins de 25 kg',
      'Vol hors vue jusqu’à 2 km avec observateurs (1 km sans)',
      'Zone au sol contrôlée, en zone peu peuplée, 120 m maximum, après déclaration STS-02 de l’exploitant',
    ],
    requirement: 'CATS nécessaire pour voler avec un C6',
    requirementDetail: CATS('STS-02'),
    formation: { level: 'SPÉCIFIQUE', family: 'ARTISTIQUE', text: 'Notre formation CATS prépare l’examen théorique et la pratique STS-02.' },
  },
};

/** The official content for a permit block, keeping the product's training family;
 *  nothing for an unknown class (accessories imported with "Cx"). */
export const officialPermis = (p?: Permis): Permis | undefined => {
  const o = p && PERMIS_BY_CLASS[p.cls];
  return o ? { ...o, formation: { ...o.formation!, family: p.formation?.family ?? o.formation!.family } } : undefined;
};
