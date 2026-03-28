import { ChevronLeft, Rocket, Shield } from "lucide-react";
import { motion } from "motion/react";

const sections = [
  {
    num: "1.",
    title: "Allgemeine Hinweise",
    content:
      "Der Schutz deiner persönlichen Daten ist uns wichtig. Die Nutzung dieser Website ist in der Regel ohne Angabe personenbezogener Daten möglich.",
  },
  {
    num: "2.",
    title: "Datenerfassung auf dieser Website",
    content:
      "Beim Besuch der Website können automatisch Daten durch den Hosting-Anbieter erfasst werden (z. B. IP-Adresse, Browser, Uhrzeit). Diese Daten dienen der technischen Bereitstellung der Website.",
  },
  {
    num: "3.",
    title: "Kontaktaufnahme",
    content:
      "Wenn du uns per E-Mail kontaktierst, werden deine Angaben zur Bearbeitung der Anfrage gespeichert.",
  },
  {
    num: "4.",
    title: "Affiliate-Links",
    content:
      "Diese Website enthält sogenannte Affiliate-Links. Wenn du über einen solchen Link ein Produkt kaufst oder dich registrierst, erhalten wir möglicherweise eine Provision. Für dich entstehen dabei keine Mehrkosten.",
  },
  {
    num: "5.",
    title: "Externe Tools und Dienste",
    content:
      "Diese Website kann externe Tools und Plattformen einbinden (z. B. Caffeine AI, Canva, ElevenLabs, InVideo oder andere Anbieter). Beim Besuch solcher externen Seiten gelten deren Datenschutzbestimmungen.",
  },
  {
    num: "6.",
    title: "Deine Rechte",
    bullets: [
      "Auskunft über deine gespeicherten Daten",
      "Berichtigung",
      "Löschung",
      "Einschränkung der Verarbeitung",
    ],
    intro: "Du hast jederzeit das Recht auf:",
  },
  {
    num: "7.",
    title: "Haftungsausschluss",
    content:
      "Wir übernehmen keine Verantwortung für Inhalte externer Websites, auf die wir verlinken.",
  },
];

export default function DatenschutzPage() {
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
      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-6">
            <Shield className="w-3.5 h-3.5" /> Datenschutz
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            <span className="text-[#00e5ff] glow-text">
              Datenschutzerklärung
            </span>
          </h1>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="py-4 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="bg-[#0d1b2a] border border-[rgba(0,229,255,0.12)] rounded-2xl p-7 hover:border-[rgba(0,229,255,0.25)] transition-all"
            >
              <h2 className="text-white font-bold text-lg mb-3">
                <span className="text-[#00e5ff]">{sec.num}</span> {sec.title}
              </h2>
              {sec.intro && (
                <p className="text-[#93a4b6] text-sm mb-3">{sec.intro}</p>
              )}
              {sec.content && (
                <p className="text-[#93a4b6] leading-relaxed text-sm">
                  {sec.content}
                </p>
              )}
              {sec.bullets && (
                <ul className="space-y-2">
                  {sec.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-[#93a4b6]"
                    >
                      <span className="text-[#00e5ff] mt-0.5">–</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
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
