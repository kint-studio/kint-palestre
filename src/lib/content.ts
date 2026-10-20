/** I dati della landing per le palestre, in italiano. Le traduzioni stanno in `landing-i18n.ts`. */

export const SITE = {
  name: "kint",
  domain: "kint.ch",
  email: "info@kint.ch",
  city: "Lugano",
  since: 2020,
};

/** Un servizio della landing: titolo, motto, testo e punti dell'elenco. */
export type LandingService = {
  id: string;
  title: string;
  tagline: string;
  text: string;
  points: string[];
};

export type Landing = {
  /** nome del pubblico, per la versione testuale */
  label: string;
  /** settore gia' scelto nel modulo di contatto */
  sector: string;
  /** nome di esempio nel campo "Attivita'" del modulo */
  exampleBusiness: string;
  title: { before: string; accent: string };
  subtitle: string;
  /** titolo della sezione servizi: `lead` sbiadito, `accent` in oro */
  servicesHeading: { lead: string; accent: string };
  services: LandingService[];
  faq: { q: string; a: string }[];
  /** titolo e descrizione della pagina (metadata) */
  meta: { title: string; description: string };
};

const PALESTRE_SERVICES: LandingService[] = [
  {
    id: "sito",
    title: "Sito web",
    tagline: "La tua palestra",
    text: "Un sito veloce, pensato per il telefono, dove chi cerca una palestra trova corsi, orari e tariffe e ti contatta con un tocco.",
    points: [
      "Corsi, orari e tariffe sempre aggiornati, con un tuo messaggio",
      "Presentazione di spazi, istruttori e stile della palestra",
      "Contatto o richiesta di prova con un tocco, anche su WhatsApp",
      "In italiano, tedesco e inglese, con mappa e orari di apertura",
    ],
  },
  {
    id: "abbonamenti",
    title: "Gestione abbonamenti",
    tagline: "Gli iscritti si gestiscono da soli",
    text: "Iscrizioni, rinnovi e scadenze online, senza code in reception né fogli di calcolo. Tu tieni tutto sotto controllo in un unico posto.",
    points: [
      "Iscrizione e rinnovo dell'abbonamento direttamente dal sito",
      "Piani e tariffe sempre aggiornati e chiari",
      "Promemoria automatici prima della scadenza",
      "Elenco di iscritti e scadenze in un unico posto",
      "Collegamento al gestionale che usi già, da valutare insieme",
    ],
  },
  {
    id: "social",
    title: "Social media",
    tagline: "Allenamenti che motivano",
    text: "Instagram e Facebook curati da chi lo fa di mestiere, con foto e reel dei tuoi corsi, dei tuoi spazi e della tua community.",
    points: [
      "Strategia e calendario dei post, concordati con te",
      "Foto e reel in palestra, con shooting dedicati",
      "Stories, risposte a commenti e messaggi",
      "Campagne Meta locali per prove gratuite e nuovi corsi",
    ],
  },
  {
    id: "google",
    title: "Google e visibilità",
    tagline: "Ti trovano quando ti cercano",
    text: "Quando qualcuno cerca «palestra vicino a me», devi esserci, con foto, orari e recensioni in ordine.",
    points: [
      "Scheda Google Business Profile ottimizzata, con foto, orari e pulsante di contatto",
      "Recensioni: richiesta automatica e risposte assistite dall'AI, riviste da una persona",
      "SEO locale per chi cerca in zona, anche in tedesco e inglese",
      "Visibilità su ChatGPT e AI Overview, report mensile",
    ],
  },
  {
    id: "ai",
    title: "AI e automazioni",
    tagline: "Il lavoro ripetitivo, in automatico",
    text: "Chatbot e flussi automatici che rispondono a chi chiede informazioni e si occupano dei compiti ripetitivi della reception, anche fuori orario.",
    points: [
      "Chatbot sul sito che risponde su corsi, orari e tariffe, anche a palestra chiusa",
      "Richieste di prova gratuita raccolte e confermate in automatico",
      "Messaggio di benvenuto automatico ai nuovi iscritti, con orari e corsi",
      "Individuiamo insieme le attività ripetitive da automatizzare, partendo dalle più utili",
    ],
  },
];

const PALESTRE_FAQ = [
  { q: "Quanto costa?", a: "Prezzi fissi, senza sorprese. In call, dopo aver visto la tua palestra, ti diciamo quanto costa e in quanto tempo è pronto, prima di firmare qualsiasi cosa." },
  { q: "Devo prendere tutti i servizi?", a: "No. Si parte da quello che ti serve di più, per esempio il sito con la gestione degli abbonamenti, e si aggiunge il resto quando vuoi." },
  { q: "Come funziona la gestione degli abbonamenti?", a: "I tuoi iscritti scelgono e rinnovano l'abbonamento dal sito, e tu tieni sotto controllo iscritti e scadenze in un unico posto. Se usi già un gestionale o un sistema di accessi, ne parliamo in call." },
  { q: "Posso aggiornare corsi e orari da solo?", a: "Puoi, ma non devi: mandaci un messaggio con i nuovi orari o il nuovo corso e lo aggiorniamo noi." },
  { q: "I social li gestite voi?", a: "Sì: calendario dei post, foto e reel della tua palestra, e risposte ai messaggi. Concordiamo tutto con te, e niente va online senza che una persona l'abbia rivisto." },
  { q: "Quanto tempo ci vuole per essere online?", a: "Circa dieci giorni lavorativi dalla call. Di solito il tempo se ne va per raccogliere foto e orari, per questo ti chiediamo solo un modulo di dieci minuti." },
];

export const LANDING: Landing = {
  label: "Palestre",
  sector: "Retail, bellezza & fitness",
  exampleBusiness: "Palestra Aurora",
  title: { before: "kint per la ", accent: "tua palestra" },
  subtitle: "I servizi di cui hai bisogno offerti da professionisti nel settore.",
  servicesHeading: { lead: "Il digitale,", accent: "che serve alla tua palestra." },
  services: PALESTRE_SERVICES,
  faq: PALESTRE_FAQ,
  meta: {
    title: "Per le palestre",
    description: "Sito, gestione degli abbonamenti, social media, visibilità su Google, AI e automazioni: il partner digitale a prezzo fisso di palestre e centri fitness.",
  },
};
