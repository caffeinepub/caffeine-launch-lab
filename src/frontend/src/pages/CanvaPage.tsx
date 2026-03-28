import { Check, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { motion } from "motion/react";

export default function CanvaPage() {
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
            data-ocid="canva.back_button"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </button>
          <a
            href="/"
            className="flex items-center gap-2 font-bold tracking-wide"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">AIToolsProX</span>
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
            🎨 Design Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Canva –{" "}
            <span className="text-[#00e5ff] glow-text">Designs & Mockups</span>{" "}
            in Minuten erstellen
          </h1>
          <p className="text-lg text-[#93a4b6] max-w-xl mx-auto">
            Mit Canva kannst du ohne Designkenntnisse professionelle Grafiken,
            Social Media Posts und komplette Layouts erstellen. Perfekt für
            Branding, Landingpages und Marketing.
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
                "Social Media Designs erstellen",
                "Thumbnails & Werbegrafiken bauen",
                "Webseiten visuell planen",
                "Logos & Branding entwickeln",
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
              Mit Caffeine baust du deine App oder Webseite – Canva hilft dir,
              alles visuell perfekt aussehen zu lassen.
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
                "Content Creator",
                "Affiliate Marketer",
                "Unternehmer",
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

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="text-center py-4"
          >
            <a
              href="https://www.canva.com"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="canva.primary_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Jetzt Canva nutzen <ChevronRight className="w-4 h-4" />
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
              data-ocid="canva.caffeine_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Mit Caffeine starten <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

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
          </div>
        </div>
      </footer>
    </div>
  );
}
