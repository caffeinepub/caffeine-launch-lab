import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Menu,
  Rocket,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type Tool,
  useMyHistory,
  usePublicTools,
  useTrackVisit,
} from "../hooks/useQueries";
import { useAuth } from "../lib/auth";
import type { GeneratedContent } from "../lib/templates";

interface LocalHistory {
  topic: string;
  content: GeneratedContent;
  timestamp: number;
}

type StepItem = {
  num: string;
  tool: string;
  action: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
  detailHref: string;
  detailLabel: string;
};

type Suggestion = {
  emoji: string;
  label: string;
  steps: StepItem[];
};

const suggestions: Suggestion[] = [
  {
    emoji: "\uD83C\uDFA5",
    label: "TikTok Videos erstellen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Ideen & Skripte generieren",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/caffeine-info",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "InVideo",
        action: "Video erstellen",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://invideo.io",
        ctaExternal: true,
        detailHref: "/tool/invideo",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "ElevenLabs",
        action: "Voice-Over hinzufügen",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://elevenlabs.io",
        ctaExternal: true,
        detailHref: "/tool/elevenlabs",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "\uD83D\uDD25",
    label: "Virale Content Ideen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Virale Hooks generieren",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/caffeine-info",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "Design erstellen",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://www.canva.com",
        ctaExternal: true,
        detailHref: "/tool/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "InVideo",
        action: "Content als Video",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://invideo.io",
        ctaExternal: true,
        detailHref: "/tool/invideo",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "\uD83D\uDCB0",
    label: "Geld online verdienen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Dein Business aufbauen",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/caffeine-info",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "Produkte & Angebote gestalten",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://www.canva.com",
        ctaExternal: true,
        detailHref: "/tool/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "ElevenLabs",
        action: "Deine Stimme automatisieren",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://elevenlabs.io",
        ctaExternal: true,
        detailHref: "/tool/elevenlabs",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "\uD83C\uDF10",
    label: "Website erstellen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Website in Minuten bauen",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/caffeine-info",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "Design-Assets erstellen",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://www.canva.com",
        ctaExternal: true,
        detailHref: "/tool/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "InVideo",
        action: "Promo-Video für deine Site",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://invideo.io",
        ctaExternal: true,
        detailHref: "/tool/invideo",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "\uD83D\uDCF1",
    label: "App ohne Programmieren",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "App-Idee direkt umsetzen",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/caffeine-info",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "UI Mockups gestalten",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://www.canva.com",
        ctaExternal: true,
        detailHref: "/tool/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "ElevenLabs",
        action: "Sprachsteuerung hinzufügen",
        ctaLabel: "Tool nutzen",
        ctaHref: "https://elevenlabs.io",
        ctaExternal: true,
        detailHref: "/tool/elevenlabs",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
];

function getToolDetailHref(toolName: string): string | null {
  if (toolName.toLowerCase().includes("canva")) return "/tool/canva";
  if (toolName.toLowerCase().includes("invideo")) return "/tool/invideo";
  if (toolName.toLowerCase().includes("elevenlabs")) return "/tool/elevenlabs";
  return null;
}

const caffeineFeatures = [
  "Webseiten erstellen",
  "Tools & Apps bauen",
  "Content generieren",
  "Geld verdienen",
];

export default function Landing() {
  const { isAuthenticated, logout, isLoginSuccess } = useAuth();

  const trackVisitMutation = useTrackVisit();
  const trackVisitMutate = trackVisitMutation.mutate;
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    trackVisitMutate(today);
  }, [trackVisitMutate]);

  useEffect(() => {
    if (isLoginSuccess) {
      window.location.href = "/#/admin";
    }
  }, [isLoginSuccess]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localHistory] = useState<LocalHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<LocalHistory | null>(
    null,
  );
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const { data: backendHistory } = useMyHistory();
  const { data: publicTools = [] } = usePublicTools();

  const features = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Website, App & Funnel erstellen",
      desc: "Baue deine eigene Webseite, App oder Landingpage in Minuten – ohne Programmieren.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Content & Reichweite aufbauen",
      desc: "Erstelle virale Inhalte, Hooks und Skripte für TikTok, Instagram und mehr Traffic.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Online Geld verdienen",
      desc: "Nutze Affiliate Links und Tools, um automatisiert Einnahmen zu generieren.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automatisieren & skalieren",
      desc: "Lass KI für dich arbeiten und baue dir ein System, das langfristig läuft.",
    },
  ];

  const steps = [
    { num: "01", label: "Idee eingeben" },
    { num: "02", label: "App wird erstellt" },
    { num: "03", label: "Design anpassen" },
    { num: "04", label: "Veröffentlichen" },
  ];

  const displayHistory =
    isAuthenticated && backendHistory && backendHistory.length > 0
      ? backendHistory.map((r) => ({
          topic: r.topic,
          content: {
            hooks: r.hooks,
            script: r.script,
            canvaTips: r.canvaTips,
            caption: r.caption,
            hashtags: r.hashtags,
          },
          timestamp: Number(r.timestamp / BigInt(1_000_000)),
        }))
      : localHistory;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden">
      {/* Background constellation */}
      <div className="fixed inset-0 pointer-events-none constellation-bg" />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[rgba(0,229,255,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-7">
            <a
              href="#features"
              data-ocid="nav.link"
              className="text-sm text-[#93a4b6] hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#wie-es-funktioniert"
              data-ocid="nav.link"
              className="text-sm text-[#93a4b6] hover:text-white transition-colors"
            >
              Wie es funktioniert
            </a>
            <a
              href="/#/about"
              data-ocid="nav.link"
              className="text-sm text-[#93a4b6] hover:text-white transition-colors"
            >
              Über uns
            </a>
          </nav>

          <a
            href="/#/"
            className="flex items-center gap-2 font-bold tracking-wide"
            data-ocid="nav.link"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">AIToolsProX</span>
          </a>

          {/* Desktop: show Admin/Logout when authenticated */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <>
                <a
                  href="/#/admin"
                  data-ocid="nav.link"
                  className="text-sm text-[#00e5ff] hover:underline"
                >
                  Admin
                </a>
                <button
                  type="button"
                  data-ocid="nav.button"
                  onClick={logout}
                  className="glow-button-outline px-5 py-2 rounded-full text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            data-ocid="nav.toggle"
            className="md:hidden text-[#93a4b6]"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0d1526] border-t border-[rgba(0,229,255,0.08)] px-4 py-4 space-y-3">
            <button
              type="button"
              className="block text-sm text-[#93a4b6] hover:text-white text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Features
            </button>
            <button
              type="button"
              className="block text-sm text-[#93a4b6] hover:text-white text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                document
                  .getElementById("wie-es-funktioniert")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Wie es funktioniert
            </button>
            <a
              href="/#/about"
              className="block text-sm text-[#93a4b6] hover:text-white"
            >
              Über uns
            </a>

            {isAuthenticated && (
              <a
                href="/#/admin"
                data-ocid="nav.link"
                className="block text-sm text-[#00e5ff] font-medium"
              >
                Admin Dashboard
              </a>
            )}
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="block text-sm text-[#00e5ff]"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="pt-36 pb-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.3)] text-[#00e5ff] text-xs font-semibold mb-6">
                <Rocket className="w-3.5 h-3.5" /> Das Hauptprodukt
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-5">
                Baue mit Caffeine deine eigene App &ndash;{" "}
                <span className="text-[#00e5ff] glow-text">ohne Code</span>
              </h1>
              <p className="text-lg text-[#93a4b6] max-w-xl mb-8">
                Erstelle Webseiten, Tools, KI-Workflows und digitale
                Geschäftsmodelle in Minuten – einfach per Beschreibung statt
                Programmierung.
              </p>
              <ul className="space-y-3 mb-10">
                {caffeineFeatures.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-3 justify-center md:justify-start"
                  >
                    <span className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#00e5ff]" />
                    </span>
                    <span className="text-white font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <a
                  href="https://caffeine.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="hero.primary_button"
                  className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
                >
                  Jetzt mit Caffeine starten{" "}
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="/#/caffeine-info"
                  data-ocid="hero.secondary_button"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border border-[rgba(0,229,255,0.4)] text-[#00e5ff] hover:bg-[rgba(0,229,255,0.08)] transition-all"
                >
                  Mehr über Caffeine erfahren
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-64">
              <div className="relative mx-auto w-56 md:w-full">
                <div className="absolute inset-0 rounded-2xl bg-[#00e5ff] opacity-10 blur-2xl" />
                <div className="relative bg-[#0d1b2a] border border-[rgba(0,229,255,0.25)] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.15)] flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-[#00e5ff]" />
                    </div>
                    <span className="text-white font-bold text-sm">
                      Caffeine AI
                    </span>
                  </div>
                  {["App erstellt ✓", "Design fertig ✓", "Live in 2 Min ✓"].map(
                    (line) => (
                      <div
                        key={line}
                        className="flex items-center gap-2 text-sm text-[#93a4b6]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] flex-shrink-0" />
                        {line}
                      </div>
                    ),
                  )}
                  <div className="pt-2 border-t border-[rgba(0,229,255,0.1)]">
                    <span className="text-[#00e5ff] text-xs font-semibold">
                      Keine Kenntnisse nötig
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE FLOW SECTION */}
      <section className="py-20 px-4 bg-[rgba(0,229,255,0.02)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Was möchtest du machen?
            </h2>
            <p className="text-[#93a4b6]">
              Klick auf dein Ziel – und bekomme sofort deinen
              Schritt-für-Schritt Plan.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {suggestions.map((s, i) => (
              <button
                key={s.label}
                type="button"
                data-ocid={`flow.tab.${i + 1}`}
                onClick={() =>
                  setActiveSuggestion(activeSuggestion === i ? null : i)
                }
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeSuggestion === i
                    ? "bg-[#00e5ff] text-[#0a0f1e] border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.5)]"
                    : "bg-[#0d1526] text-[#93a4b6] border-[rgba(0,229,255,0.2)] hover:border-[rgba(0,229,255,0.6)] hover:text-white"
                }`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSuggestion !== null && (
              <motion.div
                key={activeSuggestion}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                data-ocid="flow.panel"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {suggestions[activeSuggestion].steps.map((step, idx) => (
                    <div
                      key={step.num}
                      data-ocid={`flow.item.${idx + 1}`}
                      className="glow-card p-6 flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#00e5ff] font-black text-2xl tabular-nums">
                          {step.num}
                        </span>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {step.tool}
                          </p>
                          <p className="text-[#93a4b6] text-xs">
                            {step.action}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <a
                          href={step.ctaHref}
                          data-ocid={`flow.primary_button.${idx + 1}`}
                          {...(step.ctaExternal
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="glow-button text-center px-4 py-2.5 rounded-lg text-sm font-bold text-[#0a0f1e]"
                        >
                          {step.ctaLabel}
                        </a>
                        <a
                          href={step.detailHref}
                          data-ocid={`flow.link.${idx + 1}`}
                          className="text-center text-xs text-[#00e5ff] hover:underline py-1"
                        >
                          {step.detailLabel} &rarr;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FEATURES – So baust du dein AI Business */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              So baust du dein AI Business
            </h2>
            <p className="text-[#93a4b6]">
              In 4 einfachen Schritten von der Idee zu deinem Online Einkommen
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                data-ocid={`features.card.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glow-card p-6 hover:border-[rgba(0,229,255,0.5)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-default relative"
              >
                {/* Step badge */}
                <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-[#00e5ff] flex items-center justify-center">
                  <span className="text-[#0a0f1e] text-xs font-black">
                    {i + 1}
                  </span>
                </div>
                <div className="text-[#00e5ff] mb-4 mt-6">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-[#93a4b6] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Closing section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mt-14"
          >
            <p className="text-white text-xl font-bold mb-3">
              … und das ist erst der Anfang.
            </p>
            <p className="text-[#93a4b6] text-base max-w-xl mx-auto mb-8">
              Entdecke weitere KI-Tools, Strategien und Möglichkeiten, um dein
              Online Business weiter auszubauen und zu skalieren.
            </p>
            <a
              href="#tools"
              data-ocid="features.secondary_button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border border-[rgba(0,229,255,0.4)] text-[#00e5ff] hover:bg-[rgba(0,229,255,0.08)] transition-all"
            >
              Weitere Tools entdecken <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="wie-es-funktioniert"
        className="py-20 px-4 bg-[rgba(0,229,255,0.02)]"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              So funktioniert es
            </h2>
            <p className="text-[#93a4b6]">
              In vier einfachen Schritten zur fertigen App
            </p>
          </motion.div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
            <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,229,255,0.3)] to-transparent" />
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center flex-1 relative z-10"
              >
                <div className="w-14 h-14 rounded-full bg-[#0d1526] border-2 border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center mb-4">
                  <span className="text-[#00e5ff] font-black text-sm">
                    {s.num}
                  </span>
                </div>
                <span className="text-white font-semibold text-sm">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section id="über-uns" className="py-20 px-4 bg-[rgba(0,229,255,0.02)]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ich war genau wie du.
            </h2>
            <p className="text-[#93a4b6] text-lg leading-relaxed mb-8">
              Ideen hatte ich viele – aber kein Budget, keine Entwickler, keine
              Zeit.
              <br className="hidden sm:block" />
              Dann entdeckte ich Caffeine AI. Heute baue ich Apps und verdiene
              damit Geld – ohne eine Zeile Code.
            </p>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="story.primary_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Jetzt selbst ausprobieren <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ADDITIONAL TOOLS SECTION */}
      {publicTools.length > 0 && (
        <section id="tools" className="py-20 px-4 bg-[rgba(0,229,255,0.02)]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-3">
                Zusätzliche Tools für dein Wachstum
              </h2>
              <p className="text-[#93a4b6]">
                Ergänzende Tools, die deinen Workflow beschleunigen.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...publicTools]
                .sort((a, b) => Number(a.reihenfolge) - Number(b.reihenfolge))
                .map((tool: Tool, idx: number) => {
                  const href =
                    tool.affiliateLink.length > 0 && tool.affiliateLink[0]
                      ? tool.affiliateLink[0]
                      : tool.fallbackLink;
                  const detailHref = getToolDetailHref(tool.name);
                  return (
                    <motion.div
                      key={String(tool.id)}
                      data-ocid={`tools.card.${idx + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                      className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-6 flex flex-col gap-4 hover:border-[rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.08)] transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.12)] flex items-center justify-center text-2xl flex-shrink-0">
                        {tool.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-base mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-[#93a4b6] text-sm leading-relaxed mb-3">
                          {tool.kurzbeschreibung}
                        </p>
                        <div className="flex items-center gap-1.5 text-[#00e5ff] text-xs">
                          <Users className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{tool.zielgruppe}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid={`tools.link.${idx + 1}`}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0d1b2a] border border-[rgba(0,229,255,0.25)] text-[#00e5ff] font-bold text-sm hover:bg-[rgba(0,229,255,0.08)] transition-colors"
                        >
                          Jetzt starten
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {detailHref && (
                          <a
                            href={detailHref}
                            data-ocid={`tools.secondary_button.${idx + 1}`}
                            className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-xs text-[#00e5ff] hover:underline transition-colors"
                          >
                            Mehr erfahren &rarr;
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* HISTORY */}
      {displayHistory.length > 0 && (
        <section id="verlauf" className="py-20 px-4 bg-[rgba(0,229,255,0.02)]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-white mb-3">Verlauf</h2>
              <p className="text-[#93a4b6]">
                Deine zuletzt generierten Inhalte
              </p>
            </motion.div>
            <div className="space-y-3">
              {displayHistory.slice(0, 8).map((item, i) => (
                <motion.button
                  type="button"
                  key={item.topic + item.timestamp}
                  data-ocid={`history.item.${i + 1}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedHistory(item)}
                  className="w-full glow-card p-4 flex items-center justify-between hover:border-[rgba(0,229,255,0.5)] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.2)] flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#00e5ff]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.topic}</p>
                      <p className="text-[#4a6070] text-xs">
                        {new Date(item.timestamp).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#00e5ff]" />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[rgba(0,229,255,0.08)] py-10 px-4 mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white font-bold text-sm">AIToolsProX</span>
          </div>
          <div className="max-w-3xl mx-auto border-t border-[rgba(0,229,255,0.08)] pt-6">
            <p className="text-[#93a4b6] text-xs font-semibold mb-3 text-center">
              Transparenz &amp; Hinweis:
            </p>
            <p className="text-[#4a6070] text-xs text-center leading-relaxed mb-4">
              Diese Website ist ein unabhängiges Projekt und steht in keiner
              direkten Verbindung zu den genannten Unternehmen, Plattformen oder
              Marken (z.&nbsp;B. Caffeine, Canva, ElevenLabs oder andere).
            </p>
            <p className="text-[#4a6070] text-xs text-center leading-relaxed mb-4">
              Einige Links auf dieser Website sind sogenannte Affiliate-Links.
              Wenn du über diese Links ein Produkt kaufst oder dich
              registrierst, erhalten wir möglicherweise eine Provision – für
              dich entstehen dabei keine zusätzlichen Kosten.
            </p>
            <p className="text-[#4a6070] text-xs text-center leading-relaxed mb-4">
              Die Inhalte dieser Website dienen ausschließlich zu
              Informationszwecken. Wir übernehmen keine Garantie oder Haftung
              für die Richtigkeit, Vollständigkeit oder Aktualität.
            </p>
            <p className="text-[#4a6070] text-xs text-center leading-relaxed mb-4">
              Die Nutzung der vorgestellten Tools erfolgt auf eigene
              Verantwortung. Ergebnisse sind nicht garantiert.
            </p>
            <p className="text-[#4a6070] text-xs text-center leading-relaxed mb-6">
              Externe Links führen zu Webseiten Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Dafür übernehmen wir keine Haftung.
            </p>
            <p className="text-[#4a6070] text-xs text-center">
              © 2026 AIToolsProX
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <a
                href="/#/impressum"
                className="text-[#4a6070] text-xs hover:text-[#00e5ff] transition-colors"
              >
                Impressum
              </a>
              <span className="text-[#4a6070] text-xs">|</span>
              <a
                href="/#/datenschutz"
                className="text-[#4a6070] text-xs hover:text-[#00e5ff] transition-colors"
              >
                Datenschutz
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* History Modal */}
      <Dialog
        open={!!selectedHistory}
        onOpenChange={() => setSelectedHistory(null)}
      >
        <DialogContent className="max-w-2xl bg-[#0d1526] border border-[rgba(0,229,255,0.2)] text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#00e5ff] text-xl">
              {selectedHistory?.topic}
            </DialogTitle>
          </DialogHeader>
          {selectedHistory && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-[#00e5ff] mb-2">
                  🍃 Hooks
                </h4>
                {selectedHistory.content.hooks.map((h, i) => (
                  <p key={h} className="text-[#c8d8e8] text-sm mb-1">
                    {i + 1}. {h}
                  </p>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#00e5ff] mb-2">
                  📖 Story-Skript
                </h4>
                <p className="text-[#c8d8e8] text-sm whitespace-pre-wrap">
                  {selectedHistory.content.script}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#00e5ff] mb-2">
                  ✍️ Caption
                </h4>
                <p className="text-[#c8d8e8] text-sm whitespace-pre-wrap">
                  {selectedHistory.content.caption}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#00e5ff] mb-2">
                  #️⃣ Hashtags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHistory.content.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
