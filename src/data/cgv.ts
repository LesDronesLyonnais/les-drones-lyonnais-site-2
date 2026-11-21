// Conditions générales (CGV) of Les Drones Lyonnais — written on 2026-11-21 at the client's
// request ("cover us as much as possible on trainings, services, shop and rental"; for the
// rental: our insurance covers nothing, breakage / theft / loss are the renter's, who must be
// registered on AlphaTango, hold an RC Pro and check the rules himself).
// Built on French law as checked on 2026-11-21: Code de la consommation (distance selling,
// withdrawal L.221-18 s., exceptions L.221-28, legal guarantee L.217-3 s. and its mandatory
// box D.211-2, withdrawal form R.221-1, mediation L.612-1 / L.616-1; the EU ODR platform
// closed on 2025-07-20, no link any more), Code de commerce L.441-10 / D.441-5 (late payment),
// Code civil 1218 (force majeure), Code du travail L.6353-1 s. (training contracts),
// Code de la propriété intellectuelle L.131-3 (transfer of rights). Clauses limiting
// liability are written so that they never apply to consumers where the law forbids it.
// To be reviewed by a lawyer. Commercial figures (fees, delays) are in TERMS below.
import { COMPANY, SITE } from './site';

/** Commercial terms proposed on 2026-11-21, to be validated by the client. */
export const TERMS = {
  quoteValidityDays: 30,
  serviceDepositPercent: 30,
  b2bPaymentDays: 30,
  deliverableCheckDays: 8,
  rushesKeepMonths: 3,
  depositReleaseDays: 7,
  theftReportHours: 48,
  lateReturnNoticeHours: 48,
} as const;

/** Consumer mediator (mandatory before selling to consumers): to be chosen by the client. */
export const MEDIATOR: { name: string; address: string; url: string } | null = null;

export interface CgvArticle {
  id: string;
  title: string;
  html: string;
}
export interface CgvPart {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  articles: CgvArticle[];
}

const LDL = COMPANY.legalName;
const office = `${COMPANY.headOffice.street}, ${COMPANY.headOffice.postalCode} ${COMPANY.headOffice.locality}`;
const shop = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.locality}`;
const mail = `<a href="mailto:${SITE.email}">${SITE.email}</a>`;
const T = TERMS;

// French typography: a narrow no-break space before : ; ! ? and inside « ».
const fr = (s: string) => s.replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
const ul = (items: string[]) => `<ul class="dots">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const box = (html: string) => `<div class="box">${html}</div>`;

const PARTS_RAW: CgvPart[] = [
  // ---------------------------------------------------------------------------------------
  {
    id: 'communes',
    kicker: 'Partie 1',
    title: 'Dispositions communes',
    intro: 'Elles s’appliquent à toutes nos activités : boutique, location, prestations et formations.',
    articles: [
      {
        id: 'objet',
        title: 'Objet et champ d’application',
        html: `<p>Les présentes conditions générales régissent toutes les ventes de matériel, locations de matériel, prestations de services par drone et formations conclues entre ${LDL} et ses clients, que la commande soit passée sur le site ${SITE.url.replace('https://', '')}, par e-mail, par téléphone, sur devis ou dans nos locaux.</p>
<p>Elles s’appliquent aux clients consommateurs comme aux clients professionnels. Lorsque des règles diffèrent selon la qualité du client, l’article le précise. Toute commande implique l’acceptation sans réserve des présentes conditions générales, qui prévalent sur les conditions d’achat du client, sauf accord écrit contraire de ${LDL}.</p>`,
      },
      {
        id: 'identite',
        title: 'Qui sommes-nous',
        html: `<dl class="facts">
<div><dt>Société</dt><dd>${LDL}, ${COMPANY.form}, au capital de ${COMPANY.capital}</dd></div>
<div><dt>Siège social</dt><dd>${office}</dd></div>
<div><dt>Immatriculation</dt><dd>${COMPANY.rcs} – SIRET ${COMPANY.siret}</dd></div>
<div><dt>TVA intracommunautaire</dt><dd>${COMPANY.vat}</dd></div>
<div><dt>Adresse de contact et de retrait</dt><dd>${shop}</dd></div>
<div><dt>Contact</dt><dd><a href="${SITE.phoneHref}">${SITE.phone}</a> – ${mail}</dd></div>
<div><dt>Organisme de formation</dt><dd>Déclaration d’activité n° ${COMPANY.training.nda} (cet enregistrement ne vaut pas agrément de l’État), certifié Qualiopi au titre des actions de formation</dd></div>
</dl>`,
      },
      {
        id: 'definitions',
        title: 'Définitions',
        html: ul([
          '<strong>Client</strong> : toute personne qui achète, loue, commande une prestation ou s’inscrit à une formation.',
          '<strong>Consommateur</strong> : personne physique qui agit à des fins qui n’entrent pas dans le cadre de son activité commerciale, industrielle, artisanale, libérale ou agricole.',
          '<strong>Professionnel</strong> : tout Client qui n’est pas un Consommateur.',
          '<strong>Commande</strong> : l’engagement du Client sur un produit, une location, une prestation ou une formation, par la validation en ligne, l’acceptation d’un devis ou la signature d’un contrat.',
          '<strong>Matériel</strong> : les drones, caméras, batteries, accessoires et équipements vendus ou loués.',
          '<strong>Locataire</strong> : le Client qui loue du Matériel. <strong>Stagiaire</strong> : la personne qui suit une formation.',
        ]),
      },
      {
        id: 'documents',
        title: 'Documents contractuels',
        html: `<p>Le contrat est formé, par ordre de priorité décroissant, par : les conditions particulières (devis accepté, confirmation de réservation, convention ou contrat de formation) ; les présentes conditions générales ; pour les formations, le programme et le règlement intérieur. En cas de contradiction, le document de rang supérieur prévaut.</p>
<p>${LDL} peut modifier ses conditions générales à tout moment. La version applicable est celle en vigueur à la date de la Commande ; elle est envoyée ou mise à disposition du Client sur un support durable (e-mail de confirmation, page imprimable).</p>`,
      },
      {
        id: 'prix',
        title: 'Prix',
        html: `<p>Les prix sont indiqués en euros. Ils sont affichés toutes taxes comprises (TTC) pour les Consommateurs et hors taxes (HT) pour les Professionnels, les deux montants étant le plus souvent affichés côte à côte. Les frais de livraison, lorsqu’ils s’appliquent, sont indiqués avant la validation de la Commande.</p>
<p>Les prix peuvent être modifiés à tout moment ; le prix applicable est celui affiché ou indiqué sur le devis au moment de la Commande. Les devis sont valables ${T.quoteValidityDays} jours sauf mention contraire. Une erreur matérielle grossière sur un prix (prix manifestement dérisoire) ne peut engager ${LDL}.</p>`,
      },
      {
        id: 'paiement',
        title: 'Paiement',
        html: `<p>Le paiement s’effectue par les moyens proposés lors de la Commande : carte bancaire, Apple Pay ou Google Pay et, lorsqu’ils sont proposés, PayPal ou le paiement en plusieurs fois, via notre prestataire de paiement sécurisé ; virement bancaire ; financement CPF ou OPCO pour les formations. Les données de carte bancaire ne sont jamais conservées par ${LDL} : elles sont traitées par le prestataire de paiement.</p>
<p>Lorsque le paiement en plusieurs fois est proposé, il est assuré par un établissement partenaire, sous réserve de son acceptation et selon ses propres conditions. <strong>Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</strong></p>
<p>Sauf disposition particulière, le prix est payable à la Commande. Les factures adressées aux Professionnels sont payables à réception, ou dans le délai indiqué sur le devis ou la facture, sans pouvoir dépasser ${T.b2bPaymentDays} jours à compter de leur date.</p>`,
      },
      {
        id: 'retard',
        title: 'Retard ou défaut de paiement',
        html: `<p>Pour les Professionnels, tout retard de paiement entraîne de plein droit, dès le lendemain de l’échéance et sans rappel : des pénalités de retard au taux de la Banque centrale européenne majoré de 10 points (article L.441-10 du Code de commerce) et une indemnité forfaitaire pour frais de recouvrement de 40 € (article D.441-5), sans préjudice d’une indemnisation complémentaire sur justificatifs.</p>
<p>Pour tous les Clients, un défaut de paiement autorise ${LDL} à suspendre ou annuler les Commandes en cours, à refuser la remise du Matériel ou des livrables et à exiger le paiement immédiat de toutes les sommes dues.</p>`,
      },
      {
        id: 'retractation',
        title: 'Droit de rétractation des consommateurs',
        html: `<p>Le Consommateur qui conclut un contrat à distance (en ligne, par téléphone, par e-mail) ou hors de nos locaux dispose d’un délai de <strong>14 jours</strong> pour se rétracter, sans avoir à motiver sa décision (articles L.221-18 et suivants du Code de la consommation). Ce délai court à compter de la réception du bien pour une vente, et de la conclusion du contrat pour une location, une prestation ou une formation. Les modalités propres à chaque activité figurent dans les parties suivantes.</p>
<p>Pour l’exercer, le Consommateur adresse avant l’expiration du délai une déclaration dénuée d’ambiguïté, par e-mail à ${mail} ou par courrier à l’adresse de contact, par exemple au moyen du <a href="#formulaire">formulaire de rétractation</a> figurant en annexe. ${LDL} rembourse toutes les sommes versées, y compris les frais de livraison standard, au plus tard dans les 14 jours suivant la réception de la demande, avec le même moyen de paiement sauf accord contraire.</p>
<p>Le droit de rétractation ne s’applique pas notamment aux prestations de services pleinement exécutées avant la fin du délai lorsque leur exécution a commencé avec l’accord préalable exprès du Consommateur et son renoncement exprès à ce droit, ni aux biens confectionnés selon ses spécifications ou nettement personnalisés (article L.221-28). Si le Consommateur demande expressément que l’exécution d’une prestation ou d’une location commence avant la fin du délai, il reste redevable d’un montant proportionnel à ce qui a été fourni jusqu’à sa rétractation (article L.221-25).</p>
<p>Les Professionnels ne bénéficient pas du droit de rétractation, sauf, pour un contrat conclu hors établissement, le professionnel employant cinq salariés au plus dont l’objet du contrat n’entre pas dans le champ de son activité principale (article L.221-3).</p>`,
      },
      {
        id: 'reglementation',
        title: 'Réglementation des drones',
        html: `<p>Le pilotage d’un drone est encadré par la réglementation européenne et française (EASA, DGAC). Chaque Client reste <strong>seul responsable</strong> de l’usage qu’il fait d’un drone acheté, loué ou utilisé en dehors des séances encadrées par ${LDL} : enregistrement de l’exploitant, formation et certificats exigés, signalement électronique, respect des zones de vol, des hauteurs et des distances, autorisations, protection de la vie privée et droit à l’image.</p>
<p>Les informations réglementaires publiées par ${LDL} (fiches produits, rubrique « Quel permis ? », assistant Pop, conseils de l’équipe) sont données à titre indicatif et à jour à la date de leur publication. Elles ne remplacent pas les textes officiels, qui seuls font foi, et ne sauraient engager la responsabilité de ${LDL}.</p>`,
      },
      {
        id: 'responsabilite',
        title: 'Responsabilité',
        html: `<p>${LDL} est tenue d’une obligation de moyens dans l’exécution de ses prestations et de ses formations.</p>
<p><strong>À l’égard des Professionnels</strong>, la responsabilité de ${LDL}, toutes causes confondues, est limitée au montant hors taxes effectivement payé par le Client au titre de la Commande concernée. ${LDL} ne répond pas des dommages indirects ou immatériels, tels que perte d’exploitation, de chiffre d’affaires, de clientèle, de données, d’image ou de chance.</p>
<p>${LDL} n’est pas responsable des dommages résultant d’une faute du Client ou d’un tiers, d’informations inexactes ou incomplètes fournies par le Client, d’une utilisation du Matériel non conforme à sa notice, aux consignes reçues ou à la réglementation, ou d’un cas de force majeure.</p>
${box(`<p><strong>Consommateurs.</strong> Aucune stipulation des présentes ne limite ou n’exclut les droits que le Consommateur tient de la loi, ni la responsabilité de ${LDL} lorsque la loi interdit de la limiter. Les limitations ci-dessus ne s’appliquent pas non plus en cas de faute lourde ou dolosive ni en cas de dommage corporel.</p>`)}`,
      },
      {
        id: 'force-majeure',
        title: 'Force majeure, météo et sécurité aérienne',
        html: `<p>Aucune partie n’est responsable d’un manquement causé par un cas de force majeure au sens de l’article 1218 du Code civil. Les obligations sont suspendues pendant sa durée ; s’il dure plus de 30 jours, chaque partie peut résilier la Commande concernée par écrit, sans indemnité, les sommes correspondant à ce qui a déjà été exécuté restant dues.</p>
<p>Le vol d’un drone dépend des conditions météorologiques (vent, pluie, visibilité, température) et aéronautiques (restrictions temporaires, refus ou retard d’autorisation, zones interdites). Lorsque ces conditions ne permettent pas un vol en sécurité et dans le respect de la réglementation, ${LDL} peut décider seule de reporter une prestation ou une séance pratique, sans indemnité de part et d’autre.</p>`,
      },
      {
        id: 'propriete',
        title: 'Propriété intellectuelle',
        html: `<p>Les contenus du site, les supports de formation, les devis, les méthodes, les marques, logos et la mascotte Pop de ${LDL} sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation écrite est interdite. Les droits sur les images et vidéos réalisées lors des prestations sont régis par l’article <a href="#droits-images">« Droits d’auteur et utilisation des images »</a>.</p>`,
      },
      {
        id: 'donnees',
        title: 'Données personnelles',
        html: `<p>${LDL} traite les données personnelles de ses Clients pour gérer les Commandes, les locations, les prestations, les formations, la facturation et la relation client, sur le fondement de l’exécution du contrat et de ses obligations légales. Les données des Stagiaires peuvent être transmises aux financeurs (CPF, OPCO) et aux autorités (DGAC) lorsque la formation ou la réglementation l’exige. Le détail des traitements et vos droits figurent dans nos <a href="/mentions-legales/#donnees">mentions légales</a>.</p>`,
      },
      {
        id: 'reclamations',
        title: 'Réclamations et médiation',
        html: `<p>Toute réclamation est à adresser au service client : ${mail}, <a href="${SITE.phoneHref}">${SITE.phone}</a>, ou par courrier à l’adresse de contact. Nous nous efforçons d’y répondre dans les meilleurs délais.</p>
<p>Conformément aux articles L.612-1 et suivants du Code de la consommation, le Consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un litige, après avoir adressé une réclamation écrite à ${LDL} restée sans solution, et dans un délai d’un an à compter de cette réclamation.</p>
${
  MEDIATOR
    ? `<p>Médiateur : <strong>${MEDIATOR.name}</strong>, ${MEDIATOR.address} – <a href="${MEDIATOR.url}" rel="noopener">${MEDIATOR.url.replace('https://', '')}</a>.</p>`
    : `<p>Les coordonnées de notre médiateur de la consommation seront indiquées ici.</p>`
}`,
      },
      {
        id: 'droit',
        title: 'Droit applicable et tribunaux compétents',
        html: `<p>Les présentes conditions générales et les contrats conclus avec ${LDL} sont soumis au droit français.</p>
<p>Avec un Professionnel, tout litige relève de la compétence exclusive du tribunal dans le ressort duquel se trouve le siège social de ${LDL}, y compris en cas de référé, de pluralité de défendeurs ou d’appel en garantie. Le Consommateur peut saisir, à son choix, la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la survenance du fait dommageable, ou toute autre juridiction compétente selon la loi.</p>`,
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    id: 'boutique',
    kicker: 'Partie 2',
    title: 'Boutique : vente de matériel',
    intro: 'Drones, accessoires, batteries et équipements achetés sur le site, sur devis ou en boutique.',
    articles: [
      {
        id: 'b-commande',
        title: 'Commande',
        html: `<p>Le Client choisit ses produits, vérifie le contenu de son panier, le prix total et le mode de livraison, accepte les présentes conditions générales puis valide sa Commande. Lorsque le paiement en ligne est disponible, la Commande est ferme à la validation du paiement ; ${LDL} en accuse réception par e-mail.</p>
<p>Lorsque la validation du panier prend la forme d’une demande de commande ou de devis, la vente n’est conclue qu’à la confirmation écrite de ${LDL} (e-mail de confirmation ou devis accepté), accompagnée des modalités de paiement. ${LDL} peut refuser une Commande pour un motif légitime, notamment un litige de paiement antérieur, une quantité anormale ou une indisponibilité.</p>`,
      },
      {
        id: 'b-disponibilite',
        title: 'Produits et disponibilité',
        html: `<p>Les caractéristiques essentielles des produits figurent sur leur fiche. Les photographies sont aussi fidèles que possible mais n’ont pas de valeur contractuelle ; le contenu exact d’un pack est celui indiqué dans sa description.</p>
<p>Les produits sont proposés dans la limite des stocks disponibles chez ${LDL} ou ses fournisseurs. En cas d’indisponibilité après la Commande, ${LDL} en informe le Client et lui propose un délai de livraison, un produit équivalent ou le remboursement intégral des sommes versées, au plus tard dans les 14 jours.</p>`,
      },
      {
        id: 'b-livraison',
        title: 'Retrait et livraison',
        html: `<p>Selon les produits, le Client choisit parmi les modes proposés lors de la Commande :</p>
${ul([
  `<strong>retrait</strong> à l’adresse de contact (${shop}), sur rendez-vous, une fois la disponibilité confirmée, sur présentation d’une pièce d’identité ;`,
  '<strong>livraison à domicile</strong> par transporteur, en France métropolitaine ;',
  '<strong>livraison en point relais</strong>, pour les produits qui ne contiennent pas de batterie au lithium.',
])}
<p>Les batteries au lithium (seules ou installées dans un drone) sont soumises à des règles de transport strictes : certains produits ne peuvent pas être envoyés en point relais, une commande peut être expédiée en plusieurs colis, et les batteries de forte capacité de certains drones professionnels ne peuvent être que retirées ou livrées selon des modalités convenues avec le Client. Seuls les modes possibles pour le contenu du panier sont proposés.</p>
<p>Le délai de livraison est indiqué lors de la Commande. À défaut, le produit est livré au plus tard 30 jours après la conclusion du contrat. En cas de dépassement, le Consommateur peut enjoindre ${LDL} de livrer dans un délai supplémentaire raisonnable puis, à défaut, résoudre le contrat dans les conditions des articles L.216-6 et suivants du Code de la consommation.</p>`,
      },
      {
        id: 'b-reception',
        title: 'Réception et transfert des risques',
        html: `<p>Le Client vérifie l’état du colis et son contenu à la réception. En cas d’avarie, de colis ouvert ou de produit manquant, il formule des réserves précises auprès du transporteur et en informe ${LDL} sous 48 heures avec photos. Pour les Professionnels, à défaut de réserves notifiées au transporteur dans les 3 jours (article L.133-3 du Code de commerce), aucune réclamation pour avarie ou perte partielle ne sera recevable.</p>
<p>Pour le Consommateur, les risques de perte et d’endommagement sont transférés au moment où lui-même, ou un tiers qu’il a désigné autre que le transporteur proposé par ${LDL}, prend physiquement possession du produit. Pour le Professionnel, ils sont transférés dès la remise du produit au transporteur ou, en cas de retrait, dès sa remise.</p>`,
      },
      {
        id: 'b-reserve',
        title: 'Réserve de propriété',
        html: `<p>${LDL} conserve la propriété des produits jusqu’au paiement intégral du prix, frais et accessoires compris. En cas de défaut de paiement, ${LDL} peut revendiquer les produits, aux frais du Client.</p>`,
      },
      {
        id: 'b-retractation',
        title: 'Rétractation et retour',
        html: `<p>Le Consommateur dispose de 14 jours à compter de la réception du produit (ou du dernier produit d’une commande livrée en plusieurs fois) pour se rétracter, dans les conditions de l’article <a href="#retractation">« Droit de rétractation des consommateurs »</a>.</p>
<p>Il renvoie ou rapporte le produit au plus tard 14 jours après avoir communiqué sa décision, complet (accessoires, notices, batteries), à l’adresse de contact. <strong>Les frais de retour sont à sa charge</strong> ; il lui appartient de respecter les règles de transport des batteries au lithium. ${LDL} peut différer le remboursement jusqu’à la récupération du produit ou jusqu’à la preuve de son expédition.</p>
<p>Le Consommateur répond de la dépréciation du produit résultant de manipulations autres que celles nécessaires pour établir sa nature, ses caractéristiques et son bon fonctionnement (article L.221-23) : vols en extérieur, rayures, chocs, traces d’usure ou pièces manquantes peuvent ainsi entraîner une réduction du montant remboursé. Un produit personnalisé à la demande du Client (par exemple équipé d’un kit installé à sa demande) ne peut être retourné.</p>`,
      },
      {
        id: 'b-garanties',
        title: 'Garanties',
        html: `<p>Le Consommateur bénéficie de la garantie légale de conformité (articles L.217-3 et suivants du Code de la consommation) et de la garantie légale des vices cachés (articles 1641 et suivants du Code civil), dont les conditions sont rappelées en <a href="#garantie-legale">annexe 1</a>.</p>
<p>Les produits bénéficient en outre, le cas échéant, de la garantie commerciale de leur fabricant (par exemple DJI), selon les conditions de celui-ci. Elle s’ajoute aux garanties légales et ne les remplace pas. Ne sont pas couverts par les garanties les dommages résultant d’une chute, d’un choc, d’un crash, d’une immersion, d’une utilisation non conforme à la notice ou à la réglementation, d’une modification ou d’une réparation par un tiers non agréé, ni l’usure normale.</p>
<p>Pour les Professionnels, les garanties légales du Code de la consommation ne s’appliquent pas : seuls s’appliquent la garantie commerciale du fabricant et la garantie des vices cachés dans les conditions du droit commun.</p>`,
      },
      {
        id: 'b-sav',
        title: 'Service après-vente',
        html: `<p>Pour toute panne ou tout défaut, le Client contacte d’abord ${LDL} (${mail}) avec son numéro de commande, une description du problème et, si possible, des photos ou vidéos et les journaux de vol. ${LDL} l’oriente vers la solution adaptée : mise en œuvre de la garantie légale, prise en charge par le fabricant, ou devis de réparation.</p>`,
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    id: 'location',
    kicker: 'Partie 3',
    title: 'Location de matériel',
    intro: 'Drones, caméras et équipements loués à la journée ou pour une période donnée.',
    articles: [
      {
        id: 'l-reservation',
        title: 'Demande de réservation et confirmation',
        html: `<p>Le Client choisit le Matériel et les dates puis envoie une demande de réservation. Cette demande n’engage pas ${LDL} : la location n’est conclue qu’à la confirmation écrite de ${LDL}, après vérification de la disponibilité du Matériel et des documents du Locataire, et après paiement du prix de la location et constitution du dépôt de garantie.</p>`,
      },
      {
        id: 'l-conditions',
        title: 'Conditions pour louer',
        html: `<p>Le Locataire doit être majeur et présenter, au plus tard lors du retrait du Matériel :</p>
${ul([
  'une pièce d’identité en cours de validité et, pour un Professionnel, un extrait Kbis ou équivalent ;',
  'la preuve de son <strong>enregistrement en tant qu’exploitant d’UAS sur AlphaTango</strong>, le portail de la DGAC, et son numéro d’exploitant ;',
  'l’attestation ou le certificat de télépilote exigé pour le Matériel loué et l’usage prévu (catégorie Ouverte A1/A3, A2, ou catégorie Spécifique) ;',
  'une <strong>attestation d’assurance responsabilité civile</strong> couvrant l’utilisation d’un drone pendant la location, et une assurance responsabilité civile professionnelle pour un usage professionnel.',
])}
<p>À défaut, ${LDL} peut refuser de remettre le Matériel : la location est alors considérée comme annulée du fait du Locataire et les frais d’annulation s’appliquent. La remise du Matériel ne vaut en aucun cas vérification, par ${LDL}, de la conformité réglementaire des vols que le Locataire envisage.</p>`,
      },
      {
        id: 'l-prix',
        title: 'Prix, paiement et dépôt de garantie',
        html: `<p>Le prix de la location dépend de sa durée, selon le tarif indiqué sur la fiche du Matériel ou dans la confirmation. Toute journée commencée est due. Le prix est payable à la confirmation de la réservation.</p>
<p>Un <strong>dépôt de garantie</strong>, dont le montant est indiqué sur la fiche du Matériel ou dans la confirmation, est constitué avant la remise du Matériel, par autorisation de paiement sur carte bancaire, virement ou tout autre moyen accepté par ${LDL}. Il est libéré dans les ${T.depositReleaseDays} jours suivant la restitution complète et en bon état du Matériel, déduction faite des sommes dues par le Locataire.</p>
<p>Le Locataire autorise ${LDL} à enregistrer sa carte bancaire auprès de son prestataire de paiement et à prélever, après la restitution, les sommes dues au titre de la location (dommages, réparations, Matériel ou accessoires manquants, retard, frais de nettoyage), après lui avoir communiqué le détail et les justificatifs. <strong>Le dépôt de garantie ne constitue pas une limite de responsabilité</strong> : si les sommes dues dépassent son montant, le Locataire reste redevable de la différence.</p>`,
      },
      {
        id: 'l-remise',
        title: 'Retrait, état du Matériel et restitution',
        html: `<p>Le Matériel est retiré et restitué à l’adresse de contact, aux date et heure convenues, sauf livraison convenue par écrit aux frais du Locataire. Un état du Matériel (liste des éléments, état général, photos, nombre de cycles des batteries le cas échéant) est établi contradictoirement au départ et au retour. À défaut de réserve écrite du Locataire au retrait, le Matériel est réputé remis complet, en bon état de fonctionnement et conforme.</p>
<p>Le Locataire restitue le Matériel complet, propre, dans son emballage ou sa valise de transport, dans l’état où il l’a reçu. ${LDL} contrôle le Matériel au retour, au besoin sur plusieurs jours pour un test complet ; tout défaut constaté dans ce délai et non mentionné au départ est présumé survenu pendant la location.</p>`,
      },
      {
        id: 'l-utilisation',
        title: 'Utilisation du Matériel',
        html: `<p>Le Locataire utilise le Matériel en bon père de famille, conformément à sa notice, à sa destination et à la réglementation, et le pilote lui-même ou le fait piloter uniquement par des personnes qualifiées placées sous sa responsabilité. Il est notamment interdit :</p>
${ul([
  'de sous-louer, prêter ou céder le Matériel ;',
  'de l’utiliser hors de France métropolitaine sans accord écrit de ' + LDL + ' ;',
  'de le démonter, le modifier, le réparer, en modifier le logiciel ou les réglages de sécurité, ou d’en dissocier le compte du fabricant ;',
  'de demander un déverrouillage de zone (geofencing) sans accord écrit de ' + LDL + ' ;',
  'de l’utiliser dans des conditions dangereuses ou pour une activité illicite.',
])}
<p>Les journaux de vol enregistrés par le Matériel peuvent être consultés par ${LDL} en cas de dommage, pour en établir les circonstances.</p>`,
      },
      {
        id: 'l-reglementation',
        title: 'Réglementation, assurance et responsabilité du Locataire',
        html: box(`<p>Le Locataire est <strong>seul responsable</strong>, pendant toute la durée de la location, du respect de la réglementation applicable aux drones et de l’utilisation qu’il fait du Matériel. Il lui appartient de vérifier, avant chaque vol, qu’il est en règle : enregistrement de l’exploitant sur AlphaTango et apposition de son numéro d’exploitant sur le drone, signalement électronique lorsqu’il est requis, formation et certificats, catégorie et scénario de vol, zones, hauteurs et distances, autorisations et déclarations préalables, protection de la vie privée et droit à l’image.</p>
<p>Le Locataire déclare être titulaire d’une assurance responsabilité civile couvrant l’utilisation du drone loué et, pour un usage professionnel, d’une assurance responsabilité civile professionnelle. <strong>${LDL} ne vérifie pas la conformité des vols du Locataire et ne pourra en aucun cas être tenue responsable</strong> des conséquences de l’utilisation du Matériel par le Locataire, notamment des amendes, sanctions, saisies ou poursuites, des dommages causés aux personnes, aux biens ou aux tiers, ni des atteintes à la vie privée ou au droit à l’image.</p>
<p>Le Locataire garantit ${LDL} contre toute réclamation, action ou condamnation d’un tiers ou d’une autorité liée à l’utilisation du Matériel pendant la location, et l’indemnise de tous les frais qui en résulteraient.</p>`),
      },
      {
        id: 'l-risques',
        title: 'Garde du Matériel : casse, vol et perte',
        html: `${box(`<p>Le Locataire a la garde du Matériel dès sa remise et jusqu’à sa restitution. <strong>Le Matériel loué n’est pas assuré par ${LDL} pendant la location</strong> : notre assurance ne couvre ni la casse, ni le vol, ni la perte, ni les dommages subis par le Matériel ou causés par lui. Ces risques sont <strong>entièrement à la charge du Locataire</strong>, quelle qu’en soit la cause, y compris en cas de crash, de chute, d’immersion, de perte de liaison, de défaillance due à une erreur de pilotage ou à de mauvaises conditions de vol, de vol ou de perte.</p>`)}
<p>En cas de dommage, le Locataire paie le coût de la remise en état par le fabricant ou un réparateur agréé, sur devis, frais de diagnostic et de transport compris. Si le Matériel est perdu, volé ou irréparable, ou si le coût de la réparation dépasse sa valeur, le Locataire paie sa <strong>valeur de remplacement</strong> : la valeur indiquée dans la confirmation de réservation ou, à défaut, le prix public TTC d’un Matériel neuf identique ou équivalent au jour du sinistre. Les accessoires manquants ou endommagés (batteries, hélices, câbles, valise, carte mémoire…) sont facturés au prix de remplacement.</p>
<p>Le Locataire informe ${LDL} sans délai de tout incident. En cas de vol, il dépose plainte et en remet une copie à ${LDL} dans les ${T.theftReportHours} heures ; en cas de perte, il en fait la déclaration dans le même délai. Le prix de la location reste dû pour toute la période réservée.</p>`,
      },
      {
        id: 'l-retard',
        title: 'Retard de restitution',
        html: `<p>Tout retard de restitution est facturé, par journée de retard commencée, au tarif journalier du Matériel sans remise de durée, sans préjudice des dommages subis par ${LDL}, notamment l’indemnisation d’un client suivant privé du Matériel. Une prolongation n’est possible qu’avec l’accord écrit de ${LDL}, avant la fin de la location.</p>
<p>Si le Matériel n’est pas restitué dans les ${T.lateReturnNoticeHours} heures suivant la date prévue et que le Locataire ne répond pas aux relances, ${LDL} peut considérer le Matériel comme détourné, facturer sa valeur de remplacement et engager toute action, y compris pénale.</p>`,
      },
      {
        id: 'l-annulation',
        title: 'Annulation et rétractation',
        html: `<p>Le Consommateur qui réserve à distance peut se rétracter dans les 14 jours suivant la confirmation, tant que la location n’a pas commencé. S’il demande que la location commence avant la fin de ce délai, il le reconnaît expressément et reste redevable du prix correspondant à la période déjà écoulée en cas de rétractation.</p>
<p>En dehors du droit de rétractation, toute annulation par le Locataire, notifiée par écrit, entraîne les frais suivants :</p>
${ul([
  'plus de 7 jours avant le début de la location : sans frais ;',
  'entre 7 jours et 48 heures avant : 50 % du prix de la location ;',
  'moins de 48 heures avant, ou Matériel non retiré : 100 % du prix de la location.',
])}
<p>Une restitution anticipée ne donne lieu à aucun remboursement. Si ${LDL} ne peut fournir le Matériel réservé (panne, casse ou retard du locataire précédent), elle propose un Matériel équivalent ou d’autres dates, ou rembourse intégralement le Locataire.</p>`,
      },
      {
        id: 'l-panne',
        title: 'Panne ou défaut du Matériel',
        html: `<p>En cas de panne pendant la location, le Locataire cesse immédiatement d’utiliser le Matériel et prévient ${LDL}. Si la panne provient d’un défaut du Matériel non imputable au Locataire, ${LDL} propose un Matériel de remplacement ou rembourse le prix des journées non utilisées. Pour les Professionnels, ce remboursement constitue la seule indemnisation due par ${LDL}.</p>`,
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    id: 'prestations',
    kicker: 'Partie 4',
    title: 'Prestations par drone',
    intro: 'Prises de vue, vidéo, inspection, thermographie, topographie, modélisation 3D, nettoyage et autres missions réalisées par nos télépilotes.',
    articles: [
      {
        id: 'p-devis',
        title: 'Devis et commande',
        html: `<p>Chaque prestation fait l’objet d’un devis précisant son objet, le lieu, la date ou la période prévue, les livrables, les délais et le prix. La Commande est ferme à la réception du devis accepté (signature, bon pour accord ou acceptation écrite par e-mail) et de l’acompte. Toute modification demandée ensuite par le Client peut donner lieu à un devis complémentaire.</p>`,
      },
      {
        id: 'p-paiement',
        title: 'Acompte et paiement',
        html: `<p>Sauf mention contraire du devis, un <strong>acompte de ${T.serviceDepositPercent} %</strong> du prix TTC est versé à la Commande ; il ne s’agit pas d’arrhes. Le solde est payable à la livraison des livrables ou à la fin de la prestation, selon les conditions de l’article <a href="#paiement">« Paiement »</a>. Les fichiers définitifs sont remis après paiement intégral.</p>`,
      },
      {
        id: 'p-client',
        title: 'Obligations du Client',
        html: `<p>Le Client fournit à ${LDL}, en temps utile, des informations exactes et complètes sur le site, l’objet de la mission et ses contraintes, et lui permet d’y accéder. Il lui appartient :</p>
${ul([
  'd’obtenir l’accord du propriétaire, du gestionnaire ou de l’exploitant des lieux survolés ou filmés lorsqu’il n’est pas lui-même titulaire des droits ;',
  'd’informer les occupants, salariés, invités et intervenants de la présence d’un drone et, le cas échéant, de recueillir leur autorisation d’être filmés ;',
  'de signaler tout risque particulier (lignes électriques, installations sensibles, activité en cours, public) ;',
  'de respecter et faire respecter les consignes de sécurité données par le télépilote, qui peut interrompre la mission à tout moment pour raison de sécurité.',
])}
<p>Le Client est responsable des conséquences d’informations inexactes ou d’autorisations manquantes et garantit ${LDL} contre toute réclamation des personnes ou propriétaires concernés.</p>`,
      },
      {
        id: 'p-execution',
        title: 'Réalisation : autorisations, météo et sécurité',
        html: `<p>${LDL} réalise la prestation avec des télépilotes qualifiés, dans le respect de la réglementation, et se charge des démarches de vol qui relèvent de l’exploitant (déclarations, demandes d’autorisation). Les délais et décisions des autorités ne dépendent pas de ${LDL} : un refus ou un retard d’autorisation entraîne le report ou l’annulation de la mission, les frais déjà engagés restant dus.</p>
<p>Le télépilote est seul juge des conditions de sécurité du vol. Une mission reportée pour des raisons météorologiques ou de sécurité est reprogrammée à une date convenue, sans frais de part et d’autre.</p>`,
      },
      {
        id: 'p-annulation',
        title: 'Annulation et report par le Client',
        html: `<p>Le Consommateur qui commande à distance ou hors de nos locaux peut se rétracter dans les 14 jours suivant l’acceptation du devis. Toute autre annulation par le Client, notifiée par écrit, entraîne les frais suivants, frais déjà engagés en sus :</p>
${ul([
  'plus de 30 jours avant la date prévue : l’acompte reste acquis à ' + LDL + ' ;',
  'entre 30 et 8 jours avant : 50 % du prix total ;',
  'moins de 8 jours avant, ou absence d’accès au site le jour prévu : 100 % du prix total.',
])}
<p>Un report demandé par le Client plus de 8 jours avant la date prévue est accepté une fois, selon les disponibilités de ${LDL}.</p>`,
      },
      {
        id: 'p-livrables',
        title: 'Livrables, réception et conservation des fichiers',
        html: `<p>Les livrables (photos, vidéos, montages, rapports, orthophotos, modèles 3D, nuages de points, fichiers techniques) et leurs formats sont ceux décrits au devis, de même que le nombre d’allers-retours de corrections inclus. Ils sont remis par lien de téléchargement ou sur l’espace client.</p>
<p>Le Client dispose de ${T.deliverableCheckDays} jours à compter de la remise pour signaler par écrit toute non-conformité au devis ; passé ce délai, les livrables sont réputés acceptés. Les fichiers bruts (rushes) ne sont pas remis, sauf mention au devis, et sont conservés ${T.rushesKeepMonths} mois après la livraison, puis peuvent être supprimés. Il appartient au Client de conserver ses livrables.</p>`,
      },
      {
        id: 'p-resultats',
        title: 'Portée des résultats techniques',
        html: `<p>Les relevés, mesures, images thermiques, orthophotos, modèles 3D et rapports d’inspection reflètent l’état du site au moment et dans les conditions du vol. Leur précision dépend des conditions de vol et de mesure et correspond aux tolérances indiquées au devis. Ils constituent une aide à la décision : ils ne remplacent pas un diagnostic structurel, un contrôle réglementaire ou l’avis d’un bureau d’études, d’un géomètre-expert ou d’un expert habilité, et le Client reste seul responsable des décisions qu’il prend sur leur base.</p>`,
      },
      {
        id: 'droits-images',
        title: 'Droits d’auteur et utilisation des images',
        html: `<p>${LDL} est titulaire des droits d’auteur sur les photographies, vidéos et créations réalisées lors des prestations. Sauf conditions différentes prévues au devis, ${LDL} cède au Client, <strong>après paiement intégral du prix</strong>, les droits de reproduction et de représentation des livrables, pour les besoins propres du Client (communication interne et externe, site internet, réseaux sociaux, documents commerciaux, dossiers techniques), sur tous supports, pour le monde entier et pour la durée légale de protection des droits d’auteur.</p>
<p>Sont exclus de cette cession, sauf accord écrit : la revente ou la cession des images à des tiers, leur exploitation commerciale en tant que telles (banques d’images, publicité payante d’un tiers, diffusion télévisée ou cinématographique) et leur modification dénaturant l’œuvre. Le droit moral de ${LDL} est préservé : le crédit « ${LDL} » peut être demandé lorsque l’usage le permet.</p>
<p>${LDL} peut utiliser des extraits des prestations artistiques pour sa propre communication (site, réseaux sociaux, démonstrations), sauf refus écrit du Client avant la mission. Les données et images des missions techniques (inspection, thermographie, topographie, bureau d’études) restent confidentielles et ne sont pas publiées sans l’accord du Client.</p>`,
      },
      {
        id: 'p-responsabilite',
        title: 'Responsabilité',
        html: `<p>La responsabilité de ${LDL} est engagée dans les conditions de l’article <a href="#responsabilite">« Responsabilité »</a>. Elle ne répond pas des retards ou empêchements dus aux conditions météorologiques, aux autorités ou au Client, ni des conséquences d’un usage des livrables non conforme à leur objet.</p>`,
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    id: 'formations',
    kicker: 'Partie 5',
    title: 'Formations',
    intro: 'Formations au pilotage de drone (Open, BAPD, CATS) et spécialisations, en présentiel et en ligne.',
    articles: [
      {
        id: 'f-inscription',
        title: 'Inscription et documents',
        html: `<p>L’inscription est confirmée à la réception, selon le cas : de la convention de formation signée (financement par une entreprise ou un OPCO), du contrat de formation signé (Stagiaire qui finance lui-même sa formation, conformément aux articles L.6353-3 et suivants du Code du travail), ou de la validation de l’inscription sur la plateforme Mon Compte Formation (CPF). Le programme, les prérequis, la durée, les modalités d’évaluation et le règlement intérieur sont communiqués avant l’inscription.</p>
<p>Le Stagiaire certifie remplir les prérequis indiqués pour la formation choisie (notamment, pour les certifications de la catégorie Spécifique, l’attestation ou le certificat exigé au préalable).</p>`,
      },
      {
        id: 'f-financement',
        title: 'Prix et financement',
        html: `<p>Le prix de la formation est indiqué sur le programme, le devis ou la plateforme CPF. Il comprend l’enseignement, les supports et, pour les séances pratiques, la mise à disposition du matériel de ${LDL}, sauf mention contraire.</p>
${ul([
  '<strong>CPF</strong> : l’inscription, le paiement, l’annulation et les reports sont régis par les conditions générales d’utilisation de la plateforme Mon Compte Formation, qui prévalent sur les présentes en cas de contradiction.',
  '<strong>Entreprise ou OPCO</strong> : en cas de prise en charge par un OPCO, il appartient au Client d’obtenir l’accord de financement avant la formation. À défaut de prise en charge totale ou partielle, le Client règle le solde.',
  `<strong>Stagiaire qui finance lui-même sa formation</strong> : il dispose d’un délai de <strong>10 jours</strong> à compter de la signature du contrat pour se rétracter, par lettre recommandée avec avis de réception (article L.6353-5 du Code du travail). Aucune somme ne peut être exigée avant la fin de ce délai ; à son expiration, il ne peut être payé plus de 30 % du prix convenu, le solde étant échelonné au fur et à mesure du déroulement de la formation (article L.6353-6). Lorsque le contrat est conclu à distance, le délai de rétractation de 14 jours du Code de la consommation s’applique s’il est plus favorable.`,
])}`,
      },
      {
        id: 'f-annulation',
        title: 'Annulation, report et abandon',
        html: `<p>En dehors des délais de rétractation et des règles propres au CPF, toute annulation par le Client ou le Stagiaire, notifiée par écrit, entraîne les frais suivants :</p>
${ul([
  'plus de 15 jours avant le début de la formation : sans frais ;',
  'entre 15 jours et 72 heures avant : 30 % du prix ;',
  'moins de 72 heures avant, ou absence au premier jour : 100 % du prix.',
])}
<p>Le Client peut remplacer un Stagiaire par une autre personne remplissant les prérequis, sans frais. Ces sommes, dues au titre d’un dédit, ne peuvent pas être imputées sur une prise en charge par un OPCO.</p>
<p>Si le Stagiaire qui finance lui-même sa formation est empêché de la suivre par un cas de force majeure dûment reconnu, il peut rompre le contrat ; seules les prestations effectivement dispensées sont alors dues, au prorata de leur valeur (article L.6353-7). En cas d’abandon pour un autre motif, la formation commencée reste due.</p>
<p>${LDL} peut reporter ou annuler une session en cas de nombre de participants insuffisant, d’indisponibilité du formateur ou de conditions ne permettant pas les séances pratiques. Elle en informe les Stagiaires au plus tôt et propose une autre date ; si aucune ne convient, les sommes versées sont intégralement remboursées, sans autre indemnité pour un Professionnel.</p>`,
      },
      {
        id: 'f-deroulement',
        title: 'Déroulement, assiduité et règlement intérieur',
        html: `<p>Le Stagiaire suit la formation avec assiduité, signe les feuilles d’émargement ou se connecte aux modules en ligne selon les modalités prévues, et respecte le règlement intérieur, qui lui est remis avant la formation. Tout comportement mettant en danger la sécurité, ou contraire au règlement intérieur, peut entraîner l’exclusion du Stagiaire, la formation restant due.</p>`,
      },
      {
        id: 'f-pratique',
        title: 'Séances pratiques de vol',
        html: `<p>Les séances pratiques se déroulent sous la responsabilité et la supervision d’un formateur de ${LDL}, sur un terrain adapté et avec le matériel de ${LDL}, sauf accord contraire. Elles dépendent des conditions météorologiques : le formateur peut les reporter ou les adapter pour des raisons de sécurité.</p>
<p>Le Stagiaire respecte strictement les consignes du formateur. Il répond des dommages qu’il cause intentionnellement ou en ne respectant pas délibérément ces consignes. Lorsqu’il utilise son propre drone avec l’accord de ${LDL}, il en reste responsable et doit être assuré pour son utilisation.</p>`,
      },
      {
        id: 'f-examens',
        title: 'Examens et attestations',
        html: `<p>Une attestation de fin de formation est remise au Stagiaire qui a suivi l’intégralité de la formation. Les examens théoriques officiels et les certificats réglementaires sont délivrés par la DGAC ou les organismes habilités, selon leurs propres modalités et calendriers. ${LDL} prépare le Stagiaire à ces épreuves mais <strong>ne garantit pas leur réussite</strong>, qui dépend de son travail et de ses résultats.</p>`,
      },
      {
        id: 'f-supports',
        title: 'Supports de formation',
        html: `<p>Les supports remis ou accessibles en ligne sont réservés à l’usage personnel du Stagiaire. Ils ne peuvent être reproduits, diffusés ou utilisés pour former d’autres personnes sans l’accord écrit de ${LDL}. Les accès aux modules en ligne sont personnels et valables pour la durée indiquée lors de l’inscription.</p>`,
      },
      {
        id: 'f-handicap',
        title: 'Accessibilité',
        html: `<p>Toute personne en situation de handicap est invitée à nous contacter avant son inscription (${mail}) afin d’étudier ensemble les adaptations possibles de la formation et des séances pratiques.</p>`,
      },
    ],
  },
];

/** The CGV, with French typography applied. */
export const CGV_PARTS: CgvPart[] = PARTS_RAW.map((p) => ({
  ...p,
  intro: fr(p.intro),
  articles: p.articles.map((a) => ({ ...a, html: fr(a.html) })),
}));

/** Annex 1: the box of the legal guarantee (model annexed to article D.211-2 of the Code de
 *  la consommation, decree no. 2022-946). Not verified on Légifrance (blocked by its robot
 *  check on 2026-11-21): to check word for word. */
export const LEGAL_GUARANTEE: string[] = [
  'Le consommateur dispose d’un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de conformité en cas d’apparition d’un défaut de conformité. Durant ce délai, le consommateur n’est tenu d’établir que l’existence du défaut de conformité et non la date d’apparition de celui-ci.',
  'Lorsque le contrat de vente du bien prévoit la fourniture d’un contenu numérique ou d’un service numérique de manière continue pendant une durée supérieure à deux ans, la garantie légale est applicable à ce contenu numérique ou ce service numérique tout au long de la période de fourniture prévue. Durant ce délai, le consommateur n’est tenu d’établir que l’existence du défaut de conformité affectant le contenu numérique ou le service numérique et non la date d’apparition de celui-ci.',
  'La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant, de fournir toutes les mises à jour nécessaires au maintien de la conformité du bien.',
  'La garantie légale de conformité donne au consommateur droit à la réparation ou au remplacement du bien dans un délai de trente jours suivant sa demande, sans frais et sans inconvénient majeur pour lui.',
  'Si le bien est réparé dans le cadre de la garantie légale de conformité, le consommateur bénéficie d’une extension de six mois de la garantie initiale.',
  'Si le consommateur demande la réparation du bien, mais que le vendeur impose le remplacement, la garantie légale de conformité est renouvelée pour une période de deux ans à compter de la date de remplacement du bien.',
  'Le consommateur peut obtenir une réduction du prix d’achat en conservant le bien ou mettre fin au contrat en se faisant rembourser intégralement contre restitution du bien, si :<br>1° Le professionnel refuse de réparer ou de remplacer le bien ;<br>2° La réparation ou le remplacement du bien intervient après un délai de trente jours ;<br>3° La réparation ou le remplacement du bien occasionne un inconvénient majeur pour le consommateur, notamment lorsque le consommateur supporte définitivement les frais de reprise ou d’enlèvement du bien non conforme, ou s’il supporte les frais d’installation du bien réparé ou de remplacement ;<br>4° La non-conformité du bien persiste en dépit de la tentative de mise en conformité du vendeur restée infructueuse.',
  'Le consommateur a également droit à une réduction du prix du bien ou à la résolution du contrat lorsque le défaut de conformité est si grave qu’il justifie que la réduction du prix ou la résolution du contrat soit immédiate. Le consommateur n’est alors pas tenu de demander la réparation ou le remplacement du bien au préalable.',
  'Le consommateur n’a pas droit à la résolution de la vente si le défaut de conformité est mineur.',
  'Toute période d’immobilisation du bien en vue de sa réparation ou de son remplacement suspend la garantie qui restait à courir jusqu’à la délivrance du bien remis en état.',
  'Les droits mentionnés ci-dessus résultent de l’application des articles L. 217-1 à L. 217-32 du code de la consommation.',
  'Le vendeur qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt une amende civile d’un montant maximal de 300 000 euros, qui peut être porté jusqu’à 10 % du chiffre d’affaires moyen annuel (article L. 241-5 du code de la consommation).',
  'Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles 1641 à 1649 du code civil, pendant une durée de deux ans à compter de la découverte du défaut. Cette garantie donne droit à une réduction de prix si le bien est conservé ou à un remboursement intégral contre restitution du bien.',
].map(fr);

/** Annex 2: the model withdrawal form (annex to article R.221-1). */
export const WITHDRAWAL_FORM = {
  to: `À l’attention de ${LDL}, ${shop}, ${SITE.email} :`,
  lines: [
    'Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :',
    'Commandé le (*)/reçu le (*) :',
    'Nom du (des) consommateur(s) :',
    'Adresse du (des) consommateur(s) :',
    'Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :',
    'Date :',
  ].map(fr),
  note: '(*) Rayez la mention inutile.',
};
