import { ChevronLeft, ChevronRight, Rocket, User } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none constellation-bg" />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[rgba(0,229,255,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/#/"
            className="flex items-center gap-2 text-sm text-[#93a4b6] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zur Startseite
          </a>
          <a
            href="/#/"
            className="flex items-center gap-2 font-bold tracking-wide"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">AIToolsProX</span>
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
            <User className="w-3.5 h-3.5" /> Die Person dahinter
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Über <span className="text-[#00e5ff] glow-text">uns</span>
          </h1>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="py-4 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-8 sm:p-10 space-y-6"
          >
            <p className="text-[#c8d8e8] leading-relaxed text-base sm:text-lg">
              Ich bin Maria – und ich habe diese Plattform aufgebaut, um zu
              zeigen, wie einfach es heute ist, mit KI ein eigenes Online
              Business zu starten.
            </p>
            <p className="text-[#93a4b6] leading-relaxed">
              Früher dachte ich, man braucht Programmierkenntnisse, viel Zeit
              oder ein großes Budget. Doch durch Tools wie Caffeine AI und
              andere moderne KI-Lösungen habe ich erkannt, dass man heute
              innerhalb kürzester Zeit Webseiten, Apps und komplette Systeme
              aufbauen kann.
            </p>
            <p className="text-[#93a4b6] leading-relaxed">
              Genau dieses Wissen möchte ich hier weitergeben.
            </p>
            <p className="text-[#93a4b6] leading-relaxed">
              Diese Seite zeigt dir die besten KI-Tools, Strategien und
              Möglichkeiten, um dein eigenes Projekt aufzubauen – egal ob du
              Anfänger bist oder bereits erste Erfahrungen hast.
            </p>
            <p className="text-[#93a4b6] leading-relaxed">
              Mein Ziel ist es, dir einen einfachen Einstieg zu ermöglichen und
              dir zu zeigen, wie du mit den richtigen Tools Zeit sparst und
              gleichzeitig neue Einkommensmöglichkeiten erschließt.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 text-center"
          >
            <a
              href="/#/"
              data-ocid="about.cta_button"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-[#0a0f1e]"
            >
              Jetzt selbst starten <ChevronRight className="w-4 h-4" />
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
    </div>
  );
}
