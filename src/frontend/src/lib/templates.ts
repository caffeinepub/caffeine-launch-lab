export interface ReelSlide {
  id: string;
  slide1: string;
  slide2: string;
  slide3: string;
  slide4: string;
}

export interface GeneratedContent {
  hooks: string[];
  script: string;
  canvaTips: string;
  caption: string;
  hashtags: string[];
  reelSlides?: ReelSlide[];
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

export function generateContent(topic: string): GeneratedContent {
  const t = topic.trim() || "dieses Thema";
  const selectedHookTemplates = shuffle(hookTemplates).slice(0, 3);
  const hooks = selectedHookTemplates.map((fn) => fn(t));
  const script = pick(scriptTemplates)(t);
  const canvaTips = pick(canvaTemplates)(t);
  const caption = pick(captionTemplates)(t);
  const hashtags = pick(hashtagSets)(t);
  const reelSlides = reelSlideVariants.map((fn) => fn(t));
  return { hooks, script, canvaTips, caption, hashtags, reelSlides };
}
