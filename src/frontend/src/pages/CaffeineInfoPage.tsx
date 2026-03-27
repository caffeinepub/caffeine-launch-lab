import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ExternalLink,
  Rocket,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { type Tool, usePublicTools } from "../hooks/useQueries";

const sections = [
  {
    id: "caffeine",
    emoji: "☕",
    title: "Was ist Caffeine?",
    content:
      "Caffeine ist eine KI-Plattform, mit der du ohne klassisches Programmieren eigene Apps, Webseiten und digitale Tools erstellen kannst. Du beschreibst einfach, was du brauchst – und Caffeine baut es für dich.",
  },
  {
    id: "internet-computer",
    emoji: "🌐",
    title: "Was ist der Internet Computer?",
    content:
      "Der Internet Computer ist die technologische Grundlage im Hintergrund. Er ermöglicht moderne Web-Apps und Internetdienste auf einer dezentralen Infrastruktur – schnell, sicher und weltweit verfügbar.",
  },
  {
    id: "dfinity",
    emoji: "🏛️",
    title: "Was ist DFINITY?",
    content:
      "DFINITY ist die Organisation hinter dem Internet Computer. Sie entwickelt die Technologie kontinuierlich weiter und treibt die Vision eines offenen, dezentralen Internets voran.",
  },
  {
    id: "icp",
    emoji: "🪙",
    title: "Was ist der ICP Token?",
    content:
      "Der ICP-Token ist der native Token des Internet Computer Ökosystems. Er spielt im Netzwerk eine technische Rolle – zum Beispiel bei der Nutzung von Ressourcen auf der Plattform.",
  },
  {
    id: "warum",
    emoji: "🚀",
    title: "Warum ist Caffeine interessant?",
    bullets: [
      "Keine Code-Kenntnisse nötig",
      "Schnelle Umsetzung von Ideen",
      "Apps und Webseiten in kurzer Zeit erstellen",
      "Spannend für Creator, Gründer, Affiliate-Marketing und digitale Produkte",
    ],
  },
];

export default function CaffeineInfoPage() {
  const { data: publicTools = [] } = usePublicTools();

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none constellation-bg" />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[rgba(0,229,255,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-[#93a4b6] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zur Startseite
          </a>
          <a
            href="/"
            className="flex items-center gap-2 font-bold tracking-wide"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </a>
          <div className="w-32" />
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-6">
            <Cpu className="w-3.5 h-3.5" /> Alles über Caffeine
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Caffeine & Internet Computer –{" "}
            <span className="text-[#00e5ff] glow-text">einfach erklärt</span>
          </h1>
          <p className="text-lg text-[#93a4b6] max-w-xl mx-auto">
            Was steckt hinter Caffeine, dem Internet Computer und DFINITY? Hier
            bekommst du die wichtigsten Antworten – kurz und verständlich.
          </p>
        </motion.div>
      </section>

      {/* INFO SECTIONS */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-7 hover:border-[rgba(0,229,255,0.25)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(0,229,255,0.1)] flex items-center justify-center text-2xl flex-shrink-0">
                  {sec.emoji}
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-bold text-xl mb-3">
                    {sec.title}
                  </h2>
                  {sec.content && (
                    <p className="text-[#93a4b6] leading-relaxed">
                      {sec.content}
                    </p>
                  )}
                  {sec.bullets && (
                    <ul className="space-y-2.5">
                      {sec.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#00e5ff]" />
                          </span>
                          <span className="text-[#93a4b6]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.3)] text-[#00e5ff] text-xs font-semibold mb-5">
              <Rocket className="w-3.5 h-3.5" /> Das Hauptprodukt
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              Bereit, deine eigene App zu bauen?
            </h2>
            <p className="text-[#93a4b6] mb-8">
              Starte jetzt mit Caffeine – keine Code-Kenntnisse nötig.
            </p>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="info.cta_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Jetzt mit Caffeine starten <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* TOOLS HINT */}
      {publicTools.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-[#00e5ff]" />
                <h3 className="text-white font-bold">
                  Empfohlene Zusatz-Tools
                </h3>
              </div>
              <p className="text-[#93a4b6] text-sm mb-4">
                Diese Tools ergänzen Caffeine perfekt und beschleunigen deinen
                Workflow.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[...publicTools]
                  .sort((a, b) => Number(a.reihenfolge) - Number(b.reihenfolge))
                  .slice(0, 3)
                  .map((tool: Tool) => {
                    const href =
                      tool.affiliateLink.length > 0 && tool.affiliateLink[0]
                        ? tool.affiliateLink[0]
                        : tool.fallbackLink;
                    return (
                      <a
                        key={String(tool.id)}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(0,229,255,0.04)] border border-[rgba(0,229,255,0.1)] hover:border-[rgba(0,229,255,0.3)] transition-colors"
                      >
                        <span className="text-xl">{tool.emoji}</span>
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight">
                            {tool.name}
                          </p>
                          <p className="text-[#4a6070] text-xs flex items-center gap-1 mt-0.5">
                            <ExternalLink className="w-3 h-3" /> Öffnen
                          </p>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[rgba(0,229,255,0.08)] py-10 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white font-bold text-sm">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </div>
          <p className="text-[#4a6070] text-xs text-center">
            ©{new Date().getFullYear()}.{" "}
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
    </div>
  );
}
