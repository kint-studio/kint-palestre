import { frenchTypography, type Lang } from "./i18n";
import type { Landing } from "./content";

/** I testi della landing in un'altra lingua. L'italiano resta in `content.ts`; qui ci sono inglese, francese e tedesco.
 *  Tono: "you" in inglese, "vous" in francese e "Sie" in tedesco (come si scrive a un cliente in Svizzera), con
 *  l'ortografia svizzera in tedesco (ss al posto di ß, «Reservation», «Abonnement» ecc.). */
type ServiceText = { title: string; tagline: string; text: string; points: string[] };
export type LandingText = {
  label: string;
  sector: string;
  exampleBusiness: string;
  title: { before: string; accent: string };
  subtitle: string;
  servicesHeading: { lead: string; accent: string };
  services: Record<string, ServiceText>;
  faq: { q: string; a: string }[];
  meta: { title: string; description: string };
};

type Translated = Record<Exclude<Lang, "it">, LandingText>;

const SUBTITLE = {
  en: "The services you need, delivered by professionals in the field.",
  fr: "Les services dont vous avez besoin, assurés par des professionnels du secteur.",
  de: "Die Leistungen, die Sie brauchen, von Fachleuten der Branche.",
};

const REVIEWS = {
  en: "Reviews: automatic requests and AI-assisted replies, checked by a person",
  fr: "Avis : demande automatique et réponses assistées par l'IA, relues par une personne",
  de: "Bewertungen: automatische Anfrage und KI-gestützte Antworten, von einer Person geprüft",
};
const AI_VISIBILITY = {
  en: "Visibility on ChatGPT and AI Overviews, monthly report",
  fr: "Visibilité sur ChatGPT et AI Overview, rapport mensuel",
  de: "Sichtbarkeit in ChatGPT und AI Overviews, Monatsbericht",
};
const TIME_Q = {
  en: "How long does it take to go online?",
  fr: "Combien de temps faut-il pour être en ligne ?",
  de: "Wie lange dauert es, bis ich online bin?",
};

export const TRANSLATIONS: Translated = {
  en: {
    label: "Gyms",
    sector: "Gyms and fitness centres",
    exampleBusiness: "Aurora Gym",
    title: { before: "kint for your ", accent: "gym" },
    subtitle: SUBTITLE.en,
    servicesHeading: { lead: "Digital,", accent: "built for your gym." },
    services: {
      sito: {
        title: "Website",
        tagline: "Your gym",
        text: "A fast website designed for the phone, where people looking for a gym find classes, schedules and prices and contact you with a tap.",
        points: [
          "Classes, schedules and prices always up to date, with one message from you",
          "Presentation of your spaces, instructors and the style of the gym",
          "Contact or trial request with a tap, including on WhatsApp",
          "In Italian, German and English, with a map and opening hours",
        ],
      },
      abbonamenti: {
        title: "Membership management",
        tagline: "Members manage themselves",
        text: "Sign-ups, renewals and expiry dates online, with no queues at reception and no spreadsheets. You keep everything under control in one place.",
        points: [
          "Sign-up and membership renewal straight from the website",
          "Plans and prices always up to date and clear",
          "Automatic reminders before expiry",
          "List of members and expiry dates in one place",
          "Integration with the management software you already use, to be assessed together",
        ],
      },
      social: {
        title: "Social media",
        tagline: "Workouts that motivate",
        text: "Instagram and Facebook run by people who do this for a living, with photos and reels of your classes, your spaces and your community.",
        points: [
          "Strategy and post calendar, agreed with you",
          "Photos and reels at the gym, with dedicated shoots",
          "Stories, replies to comments and messages",
          "Local Meta campaigns for free trials and new classes",
        ],
      },
      google: {
        title: "Google and visibility",
        tagline: "They find you when they look for you",
        text: "When someone searches for “gym near me”, you need to be there, with photos, opening hours and reviews in order.",
        points: [
          "Optimised Google Business Profile, with photos, opening hours and a contact button",
          REVIEWS.en,
          "Local SEO for people searching in your area, in German and English too",
          AI_VISIBILITY.en,
        ],
      },
      ai: {
        title: "AI and automation",
        tagline: "Repetitive work, on autopilot",
        text: "Chatbots and automatic workflows that answer people asking for information and take care of repetitive reception tasks, even outside opening hours.",
        points: [
          "Website chatbot that answers questions on classes, schedules and prices, even when the gym is closed",
          "Trial requests collected and confirmed automatically",
          "Automatic welcome message for new members, with schedules and classes",
          "Together we pick the repetitive tasks worth automating, starting with the most useful",
        ],
      },
    },
    faq: [
      { q: "How much does it cost?", a: "Fixed prices, no surprises. On the call, after seeing your gym, we tell you what it costs and how long it takes, before you sign anything." },
      { q: "Do I have to take all the services?", a: "No. We start with what you need most, for example the website with membership management, and add the rest whenever you like." },
      { q: "How does membership management work?", a: "Your members choose and renew their membership on the website, and you keep members and expiry dates under control in one place. If you already use management software or an access system, we'll talk about it on the call." },
      { q: "Can I update classes and schedules myself?", a: "You can, but you don't have to: send us a message with the new schedule or the new class and we'll update it." },
      { q: "Do you run the social media?", a: "Yes: post calendar, photos and reels of your gym, and replies to messages. We agree everything with you, and nothing goes online without a person having reviewed it." },
      { q: TIME_Q.en, a: "About ten working days from the call. Most of the time goes into collecting photos and opening hours, which is why we only ask you for a ten-minute form." },
    ],
    meta: { title: "For gyms", description: "Website, membership management, social media, Google visibility, AI and automation: the fixed-price digital partner for gyms and fitness centres." },
  },
  fr: {
    label: "Salles de sport",
    sector: "Salles de sport",
    exampleBusiness: "Gym Aurore",
    title: { before: "kint pour votre ", accent: "salle de sport" },
    subtitle: SUBTITLE.fr,
    servicesHeading: { lead: "Le numérique,", accent: "conçu pour votre salle de sport." },
    services: {
      sito: {
        title: "Site web",
        tagline: "Votre salle de sport",
        text: "Un site rapide, pensé pour le téléphone, où ceux qui cherchent une salle trouvent les cours, les horaires et les tarifs, et vous contactent en un geste.",
        points: [
          "Cours, horaires et tarifs toujours à jour, sur simple message de votre part",
          "Présentation des espaces, des coachs et du style de la salle",
          "Contact ou demande d'essai en un geste, y compris sur WhatsApp",
          "En italien, allemand et anglais, avec plan et horaires d'ouverture",
        ],
      },
      abbonamenti: {
        title: "Gestion des abonnements",
        tagline: "Les adhérents se gèrent tout seuls",
        text: "Inscriptions, renouvellements et échéances en ligne, sans file d'attente à l'accueil ni tableurs. Vous gardez tout sous contrôle au même endroit.",
        points: [
          "Inscription et renouvellement de l'abonnement directement depuis le site",
          "Formules et tarifs toujours à jour et clairs",
          "Rappels automatiques avant l'échéance",
          "Liste des adhérents et des échéances au même endroit",
          "Connexion au logiciel de gestion que vous utilisez déjà, à évaluer ensemble",
        ],
      },
      social: {
        title: "Réseaux sociaux",
        tagline: "Des entraînements qui motivent",
        text: "Instagram et Facebook gérés par des professionnels, avec photos et reels de vos cours, de vos espaces et de votre communauté.",
        points: [
          "Stratégie et calendrier des publications, définis avec vous",
          "Photos et reels dans la salle, avec des séances dédiées",
          "Stories, réponses aux commentaires et aux messages",
          "Campagnes Meta locales pour les essais gratuits et les nouveaux cours",
        ],
      },
      google: {
        title: "Google et visibilité",
        tagline: "On vous trouve quand on vous cherche",
        text: "Quand quelqu'un cherche « salle de sport près de chez moi », vous devez y être, avec des photos, des horaires et des avis soignés.",
        points: [
          "Fiche Google Business Profile optimisée, avec photos, horaires et bouton de contact",
          REVIEWS.fr,
          "SEO local pour ceux qui cherchent dans la région, y compris en allemand et en anglais",
          AI_VISIBILITY.fr,
        ],
      },
      ai: {
        title: "IA et automatisations",
        tagline: "Le travail répétitif, en automatique",
        text: "Des chatbots et des flux automatiques qui répondent à ceux qui demandent des informations et s'occupent des tâches répétitives de l'accueil, même en dehors des horaires d'ouverture.",
        points: [
          "Chatbot sur le site qui répond sur les cours, les horaires et les tarifs, même salle fermée",
          "Demandes d'essai recueillies et confirmées automatiquement",
          "Message de bienvenue automatique pour les nouveaux adhérents, avec horaires et cours",
          "Nous choisissons ensemble les tâches répétitives à automatiser, en commençant par les plus utiles",
        ],
      },
    },
    faq: [
      { q: "Combien ça coûte ?", a: "Des prix fixes, sans surprise. Pendant l'appel, après avoir vu votre salle de sport, nous vous disons combien cela coûte et en combien de temps c'est prêt, avant que vous ne signiez quoi que ce soit." },
      { q: "Dois-je prendre tous les services ?", a: "Non. On commence par ce dont vous avez le plus besoin, par exemple le site avec la gestion des abonnements, et on ajoute le reste quand vous le souhaitez." },
      { q: "Comment fonctionne la gestion des abonnements ?", a: "Vos adhérents choisissent et renouvellent leur abonnement depuis le site, et vous gardez sous contrôle adhérents et échéances au même endroit. Si vous utilisez déjà un logiciel de gestion ou un système d'accès, nous en parlons pendant l'appel." },
      { q: "Puis-je mettre à jour les cours et les horaires moi-même ?", a: "Vous pouvez, mais vous n'y êtes pas obligé : envoyez-nous un message avec les nouveaux horaires ou le nouveau cours et nous le mettons à jour." },
      { q: "Gérez-vous les réseaux sociaux ?", a: "Oui : calendrier des publications, photos et reels de votre salle, et réponses aux messages. Nous convenons de tout avec vous, et rien n'est mis en ligne sans avoir été relu par une personne." },
      { q: TIME_Q.fr, a: "Environ dix jours ouvrables à partir de l'appel. Le temps passe surtout à rassembler photos et horaires, c'est pourquoi nous ne vous demandons qu'un formulaire de dix minutes." },
    ],
    meta: { title: "Pour les salles de sport", description: "Site web, gestion des abonnements, réseaux sociaux, visibilité sur Google, IA et automatisations : le partenaire numérique à prix fixe des salles de sport et centres de fitness." },
  },
  de: {
    label: "Fitnessstudios",
    sector: "Fitnessstudios",
    exampleBusiness: "Fitness Aurora",
    title: { before: "kint für ", accent: "Ihr Fitnessstudio" },
    subtitle: SUBTITLE.de,
    servicesHeading: { lead: "Das Digitale,", accent: "das Ihrem Fitnessstudio dient." },
    services: {
      sito: {
        title: "Website",
        tagline: "Ihr Fitnessstudio",
        text: "Eine schnelle, aufs Handy ausgerichtete Website, auf der Interessierte Kurse, Zeiten und Preise finden und Sie mit einem Fingertipp kontaktieren.",
        points: [
          "Kurse, Zeiten und Preise immer aktuell, mit einer Nachricht von Ihnen",
          "Vorstellung von Räumen, Trainerinnen und Trainern und dem Stil des Studios",
          "Kontakt oder Probetraining-Anfrage mit einem Fingertipp, auch über WhatsApp",
          "Auf Italienisch, Deutsch und Englisch, mit Karte und Öffnungszeiten",
        ],
      },
      abbonamenti: {
        title: "Verwaltung der Abonnemente",
        tagline: "Die Mitglieder verwalten sich selbst",
        text: "Anmeldungen, Verlängerungen und Ablaufdaten online, ohne Schlange am Empfang und ohne Tabellen. Sie behalten alles an einem Ort im Griff.",
        points: [
          "Anmeldung und Verlängerung des Abonnements direkt über die Website",
          "Abomodelle und Preise immer aktuell und klar",
          "Automatische Erinnerungen vor dem Ablauf",
          "Liste der Mitglieder und Ablaufdaten an einem Ort",
          "Anbindung an die Verwaltungssoftware, die Sie bereits nutzen, gemeinsam zu prüfen",
        ],
      },
      social: {
        title: "Social Media",
        tagline: "Training, das motiviert",
        text: "Instagram und Facebook, betreut von Profis, mit Fotos und Reels Ihrer Kurse, Ihrer Räume und Ihrer Community.",
        points: [
          "Strategie und Beitragskalender, mit Ihnen abgestimmt",
          "Fotos und Reels im Studio, mit eigenen Shootings",
          "Stories, Antworten auf Kommentare und Nachrichten",
          "Lokale Meta-Kampagnen für Gratis-Probetrainings und neue Kurse",
        ],
      },
      google: {
        title: "Google und Sichtbarkeit",
        tagline: "Man findet Sie, wenn man Sie sucht",
        text: "Wenn jemand «Fitnessstudio in meiner Nähe» sucht, müssen Sie dabei sein, mit Fotos, Öffnungszeiten und Bewertungen in Ordnung.",
        points: [
          "Optimiertes Google Business Profile, mit Fotos, Öffnungszeiten und Kontakt-Button",
          REVIEWS.de,
          "Lokales SEO für alle, die in Ihrer Region suchen, auch auf Deutsch und Englisch",
          AI_VISIBILITY.de,
        ],
      },
      ai: {
        title: "KI und Automatisierung",
        tagline: "Routinearbeit läuft automatisch",
        text: "Chatbots und automatische Abläufe, die Interessierten Auskunft geben und die wiederkehrenden Aufgaben am Empfang übernehmen, auch ausserhalb der Öffnungszeiten.",
        points: [
          "Chatbot auf der Website, der Fragen zu Kursen, Zeiten und Preisen beantwortet, auch wenn das Studio geschlossen ist",
          "Anfragen für ein Probetraining werden automatisch erfasst und bestätigt",
          "Automatische Willkommensnachricht für neue Mitglieder, mit Zeiten und Kursen",
          "Gemeinsam wählen wir die wiederkehrenden Aufgaben aus, die sich zu automatisieren lohnen, und beginnen mit den nützlichsten",
        ],
      },
    },
    faq: [
      { q: "Was kostet das?", a: "Feste Preise, keine Überraschungen. Im Call sagen wir Ihnen, nachdem wir Ihr Fitnessstudio gesehen haben, was es kostet und wie lange es dauert, bevor Sie irgendetwas unterschreiben." },
      { q: "Muss ich alle Leistungen nehmen?", a: "Nein. Wir beginnen mit dem, was Sie am meisten brauchen, zum Beispiel der Website mit Abonnementsverwaltung, und ergänzen den Rest, wann Sie möchten." },
      { q: "Wie funktioniert die Verwaltung der Abonnemente?", a: "Ihre Mitglieder wählen und verlängern ihr Abonnement auf der Website, und Sie behalten Mitglieder und Ablaufdaten an einem Ort im Griff. Wenn Sie bereits eine Verwaltungssoftware oder ein Zutrittssystem nutzen, besprechen wir das im Call." },
      { q: "Kann ich Kurse und Zeiten selbst aktualisieren?", a: "Sie können, müssen aber nicht: Schicken Sie uns eine Nachricht mit den neuen Zeiten oder dem neuen Kurs, und wir aktualisieren es." },
      { q: "Betreuen Sie die Social Media?", a: "Ja: Beitragskalender, Fotos und Reels Ihres Studios sowie Antworten auf Nachrichten. Wir stimmen alles mit Ihnen ab, und nichts geht online, ohne dass eine Person es geprüft hat." },
      { q: TIME_Q.de, a: "Etwa zehn Arbeitstage ab dem Call. Die Zeit geht meist für das Sammeln von Fotos und Öffnungszeiten drauf, deshalb bitten wir Sie nur um ein Formular von zehn Minuten." },
    ],
    meta: { title: "Für Fitnessstudios", description: "Website, Abonnementsverwaltung, Social Media, Sichtbarkeit auf Google, KI und Automatisierung: der digitale Partner zum Fixpreis für Fitnessstudios und Fitnesscenter." },
  },
};

/** I testi della landing nella lingua scelta (null per l'italiano, che sta gia' in `content.ts`). */
export function landingText(lang: Lang): LandingText | null {
  if (lang === "it") return null;
  const t = TRANSLATIONS[lang];
  return lang === "fr" ? frenchTypography(t) : t;
}

/** La stessa landing con i testi nella lingua scelta: struttura e ordine dei servizi restano quelli dell'originale. */
export function translateLanding(landing: Landing, lang: Lang): Landing {
  const t = landingText(lang);
  if (!t) return landing;
  return {
    ...landing,
    label: t.label,
    sector: t.sector,
    exampleBusiness: t.exampleBusiness,
    title: t.title,
    subtitle: t.subtitle,
    servicesHeading: t.servicesHeading,
    services: landing.services.map((s) => ({ ...s, ...(t.services[s.id] ?? {}) })),
    faq: t.faq,
    meta: t.meta,
  };
}
