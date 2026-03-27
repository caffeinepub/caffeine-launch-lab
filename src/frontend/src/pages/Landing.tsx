import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  Layout,
  Menu,
  Rocket,
  Share2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useMyHistory, usePublicTools } from "../hooks/useQueries";
import { useAuth } from "../lib/auth";
import type { GeneratedContent } from "../lib/templates";

interface LocalHistory {
  topic: string;
  content: GeneratedContent;
  timestamp: number;
}

function SparklesIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
    </svg>
  );
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
    emoji: "🎥",
    label: "TikTok Videos erstellen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Ideen & Skripte generieren",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/detail/caffeine",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "InVideo",
        action: "Video erstellen",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/invideo",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "ElevenLabs",
        action: "Voice-Over hinzufügen",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/elevenlabs",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "🔥",
    label: "Virale Content Ideen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Virale Hooks generieren",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/detail/caffeine",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "Design erstellen",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "InVideo",
        action: "Content als Video",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/invideo",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "💰",
    label: "Geld online verdienen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Dein Business aufbauen",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/detail/caffeine",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "Produkte & Angebote gestalten",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "ElevenLabs",
        action: "Deine Stimme automatisieren",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/elevenlabs",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "🌐",
    label: "Website erstellen",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "Website in Minuten bauen",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/detail/caffeine",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "Design-Assets erstellen",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "InVideo",
        action: "Promo-Video für deine Site",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/invideo",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
  {
    emoji: "📱",
    label: "App ohne Programmieren",
    steps: [
      {
        num: "01",
        tool: "Caffeine AI",
        action: "App-Idee direkt umsetzen",
        ctaLabel: "Mit Caffeine starten",
        ctaHref: "https://caffeine.ai",
        ctaExternal: true,
        detailHref: "/detail/caffeine",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "02",
        tool: "Canva",
        action: "UI Mockups gestalten",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/canva",
        detailLabel: "Mehr erfahren",
      },
      {
        num: "03",
        tool: "ElevenLabs",
        action: "Sprachsteuerung hinzufügen",
        ctaLabel: "Tool nutzen",
        ctaHref: "#",
        detailHref: "/detail/elevenlabs",
        detailLabel: "Mehr erfahren",
      },
    ],
  },
];

function PublicToolsSection() {
  const { data: tools, isLoading } = usePublicTools();

  if (isLoading || !tools || tools.length === 0) return null;

  const getLink = (tool: {
    affiliateLink: [] | [string];
    fallbackLink: string;
  }) =>
    tool.affiliateLink.length > 0 ? tool.affiliateLink[0] : tool.fallbackLink;

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-3">
              🛠️ Empfohlene Tools
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Empfohlene <span className="text-[#00e5ff]">Tools</span>
            </h2>
          </div>
          <a
            href="/tools"
            data-ocid="tools.link"
            className="text-sm text-[#00e5ff] hover:underline flex items-center gap-1"
          >
            Alle Tools ansehen <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.slice(0, 6).map((tool, i) => (
            <div
              key={String(tool.id)}
              data-ocid={`tools.item.${i + 1}`}
              className="glow-card p-6 flex flex-col gap-4 hover:border-[rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.1)] transition-all duration-300"
            >
              <div className="text-3xl">{tool.emoji}</div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">
                  {tool.name}
                </h3>
                <p className="text-[#93a4b6] text-xs leading-relaxed">
                  {tool.kurzbeschreibung}
                </p>
              </div>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs border border-[rgba(0,229,255,0.25)] text-[#00e5ff] bg-[rgba(0,229,255,0.06)] self-start">
                {tool.zielgruppe}
              </span>
              <a
                href={getLink(tool)}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`tools.primary_button.${i + 1}`}
                className="glow-button mt-auto text-center px-4 py-2 rounded-lg text-sm font-bold text-[#0a0f1e]"
              >
                Jetzt starten →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const { isAuthenticated, login, logout, isLoggingIn, isLoginSuccess } =
    useAuth();

  useEffect(() => {
    if (isLoginSuccess) {
      window.location.href = "/admin";
    }
  }, [isLoginSuccess]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localHistory] = useState<LocalHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<LocalHistory | null>(
    null,
  );
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const { data: backendHistory } = useMyHistory();

  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Landingpage Builder",
      desc: "Erstelle professionelle Landingpages in Minuten – ohne Code, ohne Design-Kenntnisse.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Content Generator",
      desc: "Virale Hooks, Skripte, Captions und Hashtags – alles auf Knopfdruck generiert.",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Affiliate Tools",
      desc: "Automatisierte Affiliate-Links, Tracking und Conversion-Optimierung.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Mini Apps",
      desc: "Kleine, fokussierte Apps für spezifische Aufgaben – schnell deployed, sofort nutzbar.",
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
            {["Features", "Wie es funktioniert", "Über uns"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                data-ocid="nav.link"
                className="text-sm text-[#93a4b6] hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="/tools"
              data-ocid="nav.link"
              className="text-sm text-[#93a4b6] hover:text-white transition-colors"
            >
              Tools
            </a>
          </nav>

          <a
            href="/"
            className="flex items-center gap-2 font-bold tracking-wide"
            data-ocid="nav.link"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <a
                  href="/admin"
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
            ) : (
              <button
                type="button"
                data-ocid="nav.button"
                onClick={login}
                disabled={isLoggingIn}
                className="glow-button px-6 py-2 rounded-full text-sm font-semibold text-[#0a0f1e]"
              >
                {isLoggingIn ? "…" : "LOG IN"}
              </button>
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
            {["Features", "Wie es funktioniert", "Über uns"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-sm text-[#93a4b6] hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a
              href="/tools"
              className="block text-sm text-[#93a4b6] hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </a>

            {isAuthenticated && (
              <a
                href="/admin"
                data-ocid="nav.link"
                className="block text-sm text-[#00e5ff] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </a>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="block text-sm text-[#00e5ff]"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="glow-button px-6 py-2 rounded-full text-sm font-semibold text-[#0a0f1e] w-full"
              >
                {isLoggingIn ? "Einloggen…" : "LOG IN"}
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="pt-36 pb-24 px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-6">
            <SparklesIcon size={12} /> KI-gestützte Content-Erstellung
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6">
            Deine Idee. Deine App.
            <br />
            <span className="text-[#00e5ff] glow-text">Dein Einkommen.</span>
          </h1>
          <p className="text-lg text-[#93a4b6] max-w-xl mx-auto mb-10">
            Caffeine AI baut deine App – in Minuten, ohne Code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.primary_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Mit Caffeine starten <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="/detail/caffeine"
              data-ocid="hero.secondary_button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border border-[rgba(0,229,255,0.4)] text-[#00e5ff] hover:bg-[rgba(0,229,255,0.08)] transition-all"
            >
              Mehr erfahren
            </a>
          </div>
        </motion.div>
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
                          {step.detailLabel} →
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

      {/* FEATURES */}
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
              Alles was du brauchst
            </h2>
            <p className="text-[#93a4b6]">
              Vier leistungsstarke Tools in einer Plattform
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
                className="glow-card p-6 hover:border-[rgba(0,229,255,0.5)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-default"
              >
                <div className="text-[#00e5ff] mb-4">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-[#93a4b6] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
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

      {/* TOOLS SECTION */}
      <PublicToolsSection />

      {/* FOOTER */}
      <footer className="border-t border-[rgba(0,229,255,0.08)] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white font-bold text-sm">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </div>
          <p className="text-[#4a6070] text-xs text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00e5ff] hover:underline"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-[rgba(0,229,255,0.08)]">
          <p className="text-[#4a6070] text-xs text-center leading-relaxed">
            <span className="text-[#93a4b6] font-semibold">
              Transparenz & Hinweis:
            </span>{" "}
            Diese Seite enthält Affiliate-Links. Wenn du über einen dieser Links
            ein Produkt kaufst oder dich registrierst, erhalten wir
            möglicherweise eine Provision – für dich entstehen dabei keine
            Mehrkosten. Wir empfehlen nur Tools, von denen wir überzeugt sind.
            Alle Angaben ohne Gewähr. Ergebnisse können individuell variieren.
            Externe Links führen zu Seiten Dritter, für deren Inhalte wir keine
            Verantwortung übernehmen.
          </p>
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
                  🎣 Hooks
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
