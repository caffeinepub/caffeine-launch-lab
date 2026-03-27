import { Check, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { motion } from "motion/react";

export default function InVideoPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none constellation-bg" />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[rgba(0,229,255,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-[#93a4b6] hover:text-white transition-colors"
            data-ocid="invideo.back_button"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </button>
          <a
            href="/"
            className="flex items-center gap-2 font-bold tracking-wide"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </a>
          <div className="w-24" />
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-6">
            🎬 Video Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            InVideo – Videos{" "}
            <span className="text-[#00e5ff] glow-text">
              automatisch erstellen
            </span>
          </h1>
          <p className="text-lg text-[#93a4b6] max-w-xl mx-auto">
            Mit InVideo kannst du schnell Videos für TikTok, Instagram oder
            Werbung erstellen – auch ohne Erfahrung. Ideal für Content und
            Reichweite.
          </p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-7 hover:border-[rgba(0,229,255,0.25)] transition-all"
          >
            <h2 className="text-white font-bold text-xl mb-4">
              Was kannst du damit machen:
            </h2>
            <ul className="space-y-3">
              {[
                "TikTok & Reels Videos erstellen",
                "Werbevideos produzieren",
                "Automatisierte Video-Content erstellen",
                "Storytelling mit KI",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#00e5ff]" />
                  </span>
                  <span className="text-[#93a4b6]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-7 hover:border-[rgba(0,229,255,0.25)] transition-all"
          >
            <h2 className="text-white font-bold text-xl mb-3">
              Warum in Kombination mit Caffeine:
            </h2>
            <p className="text-[#93a4b6] leading-relaxed">
              Caffeine baut deine Plattform – InVideo bringt dir Traffic durch
              Videos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-7 hover:border-[rgba(0,229,255,0.25)] transition-all"
          >
            <h2 className="text-white font-bold text-xl mb-4">
              Für wen geeignet:
            </h2>
            <ul className="space-y-3">
              {[
                "Anfänger",
                "Social Media Creator",
                "Affiliate Marketing",
                "Online Business",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#00e5ff]" />
                  </span>
                  <span className="text-[#93a4b6]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="text-center py-4"
          >
            <a
              href="https://invideo.io"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="invideo.primary_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Jetzt InVideo nutzen <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CAFFEINE CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.2)] rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.3)] text-[#00e5ff] text-xs font-semibold mb-5">
              <Rocket className="w-3.5 h-3.5" /> Das Hauptprodukt
            </div>
            <h2 className="text-3xl font-black text-white mb-3">
              Bereit deine eigene App zu bauen?
            </h2>
            <p className="text-[#93a4b6] mb-7">
              Mit Caffeine kannst du deine Ideen sofort umsetzen – ohne
              Programmieren.
            </p>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="invideo.caffeine_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Mit Caffeine starten <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(0,229,255,0.08)] py-10 px-4 mt-4">
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
    </div>
  );
}
