import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { usePublicTools } from "../hooks/useQueries";
import { useAuth } from "../lib/auth";

export default function ToolsPage() {
  const { data: tools, isLoading } = usePublicTools();
  const { isAuthenticated, login, logout, isLoggingIn } = useAuth();

  const getLink = (tool: {
    affiliateLink: [] | [string];
    fallbackLink: string;
  }) =>
    tool.affiliateLink.length > 0 ? tool.affiliateLink[0] : tool.fallbackLink;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none constellation-bg" />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[rgba(0,229,255,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-7">
            <a
              href="/"
              data-ocid="nav.link"
              className="text-sm text-[#93a4b6] hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/tools"
              data-ocid="nav.link"
              className="text-sm text-[#00e5ff] font-medium"
            >
              Tools
            </a>
            <a
              href="/generator"
              data-ocid="nav.link"
              className="text-sm text-[#93a4b6] hover:text-white transition-colors"
            >
              Generator
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
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-28 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-5">
              🛠️ Empfohlene Tools
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Die besten <span className="text-[#00e5ff]">Tools</span> für
              Content Creator
            </h1>
            <p className="text-[#93a4b6] text-base max-w-xl mx-auto">
              Alle Tools, die wir selbst nutzen und empfehlen – für
              professionellen Content ohne Umwege.
            </p>
          </motion.div>

          {isLoading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="tools.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="glow-card p-6 space-y-4">
                  <Skeleton className="h-10 w-10 rounded-xl bg-[rgba(0,229,255,0.08)]" />
                  <Skeleton className="h-5 w-2/3 bg-[rgba(0,229,255,0.08)]" />
                  <Skeleton className="h-4 w-full bg-[rgba(0,229,255,0.06)]" />
                  <Skeleton className="h-4 w-3/4 bg-[rgba(0,229,255,0.06)]" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!tools || tools.length === 0) && (
            <div className="text-center py-16" data-ocid="tools.empty_state">
              <p className="text-4xl mb-4">🛠️</p>
              <p className="text-[#93a4b6]">Noch keine Tools vorhanden.</p>
            </div>
          )}

          {!isLoading && tools && tools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool, i) => (
                <motion.div
                  key={String(tool.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  data-ocid={`tools.item.${i + 1}`}
                  className="glow-card p-6 flex flex-col gap-4 hover:border-[rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.1)] transition-all duration-300"
                >
                  <div className="text-4xl">{tool.emoji}</div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-[#93a4b6] text-sm leading-relaxed">
                      {tool.kurzbeschreibung}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs border border-[rgba(0,229,255,0.25)] text-[#00e5ff] bg-[rgba(0,229,255,0.06)]">
                      {tool.zielgruppe}
                    </span>
                  </div>
                  <a
                    href={getLink(tool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`tools.primary_button.${i + 1}`}
                    className="glow-button mt-auto text-center px-5 py-2.5 rounded-lg text-sm font-bold text-[#0a0f1e] flex items-center justify-center gap-2"
                  >
                    Jetzt starten <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

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
    </div>
  );
}
