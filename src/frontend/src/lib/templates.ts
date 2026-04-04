export interface ReelSlide {
  id: string;
  slide1: string;
  slide2: string;
  slide3: string;
  slide4: string;
}

export interface WisdomReel {
  id: string;
  slide1: string;
  slide2: string;
  slide3: string;
  slide4: string;
  canvaCopy: string;
  caption: string;
  hashtags: string[];
}

export interface GeneratedContent {
  hooks: string[];
  script: string;
  canvaTips: string;
  caption: string;
  hashtags: string[];
  reelSlides?: ReelSlide[];
  wisdomReels?: WisdomReel[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const hookTemplates = [
  (t: string) => `Das hätte ich früher wissen müssen – alles über ${t}…`,
  (t: string) => `Ganz ehrlich: ${t} hat mein Leben verändert. So.`,
  (t: string) => `Wenn du ${t} nicht nutzt, verpasst du gerade was Riesiges.`,
  (t: string) =>
    `Ich hab Stunden mit ${t} vergeudet – bis ich DAS entdeckt hab.`,
  (t: string) => `${t} – das verstehen die meisten komplett falsch.`,
  (t: string) => `Niemand redet darüber. Aber ${t} ist gerade der Move.`,
  (t: string) => `Ich wünschte, jemand hätte mir das über ${t} früher gesagt…`,
  (t: string) => `Kurz & ehrlich: Wer ${t} ignoriert, verliert Geld. Facts.`,
  (t: string) => `Stop. Bevor du ${t} aufgibst – lies das hier.`,
  (t: string) =>
    `Was ${t} wirklich ist – und warum du es sofort ausprobieren solltest.`,
];

const scriptTemplates = [
  (t: string) =>
    `Hey, ich muss dir schnell was sagen über ${t}. Ich hab das selbst erst kürzlich rausgefunden und bin ehrlich gesagt noch begeistert. Mit ${t} kannst du in kurzer Zeit richtig viel erreichen – ohne Umwege, ohne Stress. Ich zeig dir, wie das geht. Bleib dran, das lohnt sich.`,
  (t: string) =>
    `Stell dir vor, du könntest mit ${t} innerhalb von Stunden Ergebnisse sehen, für die andere Wochen brauchen. Klingt unrealistisch? Ich dachte das auch. Bis ich anfing, es wirklich zu testen. Heute kann ich dir sagen: ${t} ist kein Hype – es ist ein echtes Tool, das du nutzen solltest. Jetzt.`,
  (t: string) =>
    `Okay, kurze Frage: Kennst du schon ${t}? Weil wenn nicht, verpasst du gerade echt was. Ich nutze ${t} seit einer Weile und der Unterschied ist spürbar. Weniger Aufwand, mehr Output. Das ist der Deal. Ich erkläre dir in den nächsten Sekunden, warum das so funktioniert.`,
  (t: string) =>
    `Die meisten Menschen, die über ${t} reden, erklären es falsch. Ich zeig dir heute, wie es wirklich funktioniert – und warum es gerade jetzt so wichtig ist. ${t} ist nicht kompliziert. Du brauchst nur den richtigen Ansatz. Den bekommst du hier.`,
];

const canvaTemplates = [
  (t: string) =>
    `**Format:** Quadratisch (1080x1080px) oder Story (1080x1920px)\n**Hintergrund:** Tiefes Dunkelblau (#0b0f1a) oder Schwarz\n**Akzentfarbe:** Neon-Cyan (#00e5ff) für Überschriften und Highlights\n**Schrift Headline:** Inter Bold oder Montserrat ExtraBold, Größe 56–72pt, weiß\n**Schrift Body:** Inter Regular, Größe 20–24pt, hellgrau (#b7c3cf)\n**Layout:** Headline oben, Icon-Element mittig als visueller Anker, CTA unten\n**Keyword "${t}"** groß und auffällig platzieren – am besten mit Glow-Effekt\n**Tipp:** Füge eine dünne Cyan-Border (2px) um das Hauptelement hinzu für Premium-Look`,
  (t: string) =>
    `**Format:** Reels-Cover (1080x1920px)\n**Farbschema:** Dunkler Gradient von #050a12 nach #0d2040\n**Typografie:** Bricolage Grotesque oder Space Grotesk, Bold\n**Headline-Farbe:** Weiß mit Cyan-Underline (#00e5ff)\n**Visuals:** Abstraktes geometrisches Muster im Hintergrund, leicht durchsichtig\n**"${t}"** als dominantes Textelement, leicht angeschrägt für Dynamik\n**CTA-Button:** Pill-Form, Cyan-Füllung, dunkler Text, unten zentriert\n**Schatten:** Box-Shadow auf Hauptelement für Tiefe (20px Blur, Cyan-Tönung)`,
];

const captionTemplates = [
  (t: string) =>
    `Du willst wirklich verstehen, wie ${t} funktioniert? Dann lies das hier genau durch.\n\nIch hab in den letzten Wochen alles über ${t} getestet – und ich sag dir: Es gibt Wege, die die meisten noch nicht kennen.\n\nWenn du bereit bist, ehrlich mit dir zu sein und neue Wege zu gehen, dann ist ${t} dein nächster Schritt.\n\n👇 Spar dir Stunden Recherche – kommentiere "INFO" und ich schick dir alles direkt.`,
  (t: string) =>
    `Ganz ehrlich: ${t} ist anders als du denkst.\n\nViele starten damit und machen sofort Fehler – nicht weil sie dumm sind, sondern weil niemand ihnen das Wichtigste erklärt hat.\n\nDas ändere ich heute. ${t} kann für dich arbeiten, wenn du es richtig aufstellst.\n\n💬 Schreib mir oder kommentiere – ich helfe dir persönlich weiter.`,
  (t: string) =>
    `${t} ist gerade einer der heißesten Trends – und die meisten schlafen noch drauf.\n\nWer jetzt anfängt, hat einen echten Vorteil. Die Kurve zeigt nach oben und der Einstieg war nie einfacher.\n\nBereit? Dann lass uns loslegen.\n\n✅ Folge mir für mehr Content zu ${t} und ähnlichen Themen.`,
];

const hashtagSets = [
  (t: string) => [
    t.toLowerCase().replace(/\s+/g, ""),
    `${t.toLowerCase().replace(/\s+/g, "")}tipps`,
    "onlinebusiness",
    "digitalmarketing",
    "contentcreator",
    "socialmediatips",
    "deutscherinstagram",
    "businesstipps",
    "erfolgreich",
    "selftaught",
    "growthmindset",
    "passiveseinkommen",
  ],
  (t: string) => [
    t.toLowerCase().replace(/\s+/g, ""),
    "viral",
    "viraltiktok",
    "trendsetter",
    "marketingtips",
    "onlinemarketing",
    "creator",
    "wachstum",
    "sideproject",
    "entrepreneurship",
    "instagram",
    `learn${t.toLowerCase().replace(/\s+/g, "")}`,
  ],
];

// Reel slide variants: Hook → Problem → Lösung → CTA
// Each slide: max 6–8 words, last slide always "👉 Link in Bio"
const reelSlideVariants: Array<(t: string) => ReelSlide> = [
  (t: string) => ({
    id: "v1",
    slide1: `Kennst du das Problem mit ${t}?`,
    slide2: "Die meisten machen dabei einen Fehler.",
    slide3: `${t} richtig nutzen – so geht's.`,
    slide4: "👉 Link in Bio",
  }),
  (t: string) => ({
    id: "v2",
    slide1: `${t} verändert gerade alles. Wirklich.`,
    slide2: `Ohne ${t} verlierst du täglich Zeit.`,
    slide3: `Mit ${t} sparst du Stunden – sofort.`,
    slide4: "👉 Link in Bio",
  }),
  (t: string) => ({
    id: "v3",
    slide1: `Das niemand dir über ${t} sagt.`,
    slide2: "Falsch gestartet – und dann frustriert aufgehört.",
    slide3: `Mein einfacher Einstieg in ${t} – hier.`,
    slide4: "👉 Link in Bio",
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// WISDOM REELS – Lebensweisheiten als virale Reel-Inhalte
// Struktur: Hook (Weisheit) → Problem/Realität → Verbindung zur Lösung → CTA
// Regeln: modern, emotional, keine Namen, 6–10 Wörter pro Slide, kein Tool-Name
// ─────────────────────────────────────────────────────────────────────────────

const wisdomReelPool: Array<{
  slide1: string;
  slide2: string;
  slide3: string;
  caption: string;
  hashtags: string[];
}> = [
  {
    slide1: "Wer wartet, verliert – immer.",
    slide2: "Du weißt genug. Du fängst nur nicht an.",
    slide3: "Der erste Schritt ist schon das Werkzeug.",
    caption:
      "Das Warten auf den richtigen Moment ist die größte Lüge, die wir uns selbst erzählen. Wer anfängt, findet den Weg. Wer wartet, findet Ausreden.\n\n👉 Link in Bio",
    hashtags: ["mindset", "lebensweisheit", "wachstum", "motivation", "reels"],
  },
  {
    slide1: "Einfach ist nicht dasselbe wie leicht.",
    slide2: "Die Lösung liegt oft direkt vor dir.",
    slide3: "Du brauchst kein Wunder. Du brauchst ein System.",
    caption:
      "Wir suchen nach komplizierten Antworten – dabei ist die Wahrheit fast immer einfach. Einfach zu sehen. Schwer umzusetzen. Aber möglich.\n\n👉 Link in Bio",
    hashtags: [
      "mindset",
      "klarheit",
      "produktivität",
      "onlinebusiness",
      "motivation",
    ],
  },
  {
    slide1: "Dein Gehirn lügt dich täglich an.",
    slide2: 'Es sagt: "Nicht jetzt." Du glaubst es.',
    slide3: "Das Richtige fühlt sich selten richtig an.",
    caption:
      "Jedes Mal, wenn du dich kleiner machst als du bist, glaubt dein Gehirn, es schützt dich. Tut es nicht. Es hält dich nur auf.\n\n👉 Link in Bio",
    hashtags: [
      "selfawareness",
      "mindset",
      "lebensweisheit",
      "wachstum",
      "psychologie",
    ],
  },
  {
    slide1: "Niemand erinnert sich an deine Ausreden.",
    slide2: "Alle erinnern sich an dein Ergebnis.",
    slide3: "Werkzeuge entscheiden, wer schneller ankommt.",
    caption:
      "Am Ende zählt nicht, wie schwer es war. Es zählt, was du daraus gemacht hast. Die richtigen Mittel ändern alles.\n\n👉 Link in Bio",
    hashtags: ["erfolg", "mindset", "motivation", "creator", "reels"],
  },
  {
    slide1: "Komfort ist teuer. Er kostet dein Potenzial.",
    slide2: "Stillstand fühlt sich sicher an. Ist er nicht.",
    slide3: "Veränderung beginnt mit einem anderen Werkzeug.",
    caption:
      "Wer sich wohl fühlt, wächst nicht. Wer wächst, braucht manchmal nur einen neuen Ansatz – und den Mut, ihn auszuprobieren.\n\n👉 Link in Bio",
    hashtags: ["motivation", "wachstum", "mindset", "lebensweisheit", "viral"],
  },
  {
    slide1: "Du bist nicht zu spät. Du denkst nur zu klein.",
    slide2: "Die meisten geben auf, kurz vor dem Durchbruch.",
    slide3: "Das Richtige Tool bringt dich über die Linie.",
    caption:
      "Timing ist keine Ausrede. Wer heute anfängt, ist morgen schon weiter als alle, die noch warten. Der Moment ist jetzt.\n\n👉 Link in Bio",
    hashtags: [
      "motivation",
      "nebeneinkommen",
      "onlinebusiness",
      "mindset",
      "reels",
    ],
  },
  {
    slide1: "Vergleiche töten leise deinen Fortschritt.",
    slide2: "Du läufst die falsche Strecke – mit fremden Schuhen.",
    slide3: "Finde dein System. Nicht das von anderen.",
    caption:
      "Wer immer schaut, was andere tun, verliert den Blick für den eigenen Weg. Dein Weg braucht dein Tempo – und die richtigen Mittel.\n\n👉 Link in Bio",
    hashtags: [
      "selfgrowth",
      "mindset",
      "lebensweisheit",
      "klarheit",
      "motivation",
    ],
  },
  {
    slide1: "Wissen ohne Handlung ist nur Unterhaltung.",
    slide2: "Du weißt schon genug. Du brauchst den Start.",
    slide3: "Ein gutes Werkzeug macht aus Wissen Ergebnis.",
    caption:
      "Die meisten Menschen haben genug Ideen. Was fehlt, ist das erste ehrliche Tun. Nicht perfekt – einfach anfangen.\n\n👉 Link in Bio",
    hashtags: [
      "produktivität",
      "onlinebusiness",
      "motivation",
      "mindset",
      "creator",
    ],
  },
  {
    slide1: "Zeit läuft. Mit oder ohne dich.",
    slide2: "In einem Jahr wirst du dir wünschen, du hättest heute begonnen.",
    slide3: "Smarte Tools machen aus Stunden Minuten.",
    caption:
      "Ein Jahr geht schnell vorbei. Die Frage ist nicht ob – sondern wofür du es nutzt. Wer heute startet, gewinnt morgen Zeit zurück.\n\n👉 Link in Bio",
    hashtags: ["zeitmanagement", "mindset", "wachstum", "motivation", "viral"],
  },
];

function generateWisdomReels(topic: string): WisdomReel[] {
  const t = topic.trim() || "dieses Thema";
  const pool = shuffle(wisdomReelPool);
  // Pick 3 distinct variants
  const selected = pool.slice(0, 3);

  // Inject topic into slide3 and caption where it adds context naturally
  const topicInjections: Array<
    (slide3: string, caption: string) => { slide3: string; caption: string }
  > = [
    (s3, cap) => ({
      slide3: s3
        .replace("Werkzeug", `Tool für ${t}`)
        .replace("System", `System für ${t}`),
      caption: cap,
    }),
    (s3, cap) => ({ slide3: s3, caption: cap }),
    (s3, cap) => ({ slide3: s3, caption: cap }),
  ];

  return selected.map((variant, idx) => {
    const injection = topicInjections[idx % topicInjections.length];
    const { slide3, caption } = injection(variant.slide3, variant.caption);
    const slides = [variant.slide1, variant.slide2, slide3, "👉 Link in Bio"];
    return {
      id: `wisdom-${idx + 1}`,
      slide1: variant.slide1,
      slide2: variant.slide2,
      slide3: slide3,
      slide4: "👉 Link in Bio",
      canvaCopy: slides.join(" | "),
      caption: caption,
      hashtags: variant.hashtags,
    };
  });
}

export function generateContent(topic: string): GeneratedContent {
  const t = topic.trim() || "dieses Thema";
  const selectedHookTemplates = shuffle(hookTemplates).slice(0, 3);
  const hooks = selectedHookTemplates.map((fn) => fn(t));
  const script = pick(scriptTemplates)(t);
  const canvaTips = pick(canvaTemplates)(t);
  const caption = pick(captionTemplates)(t);
  const hashtags = pick(hashtagSets)(t);
  const reelSlides = reelSlideVariants.map((fn) => fn(t));
  const wisdomReels = generateWisdomReels(t);
  return {
    hooks,
    script,
    canvaTips,
    caption,
    hashtags,
    reelSlides,
    wisdomReels,
  };
}
