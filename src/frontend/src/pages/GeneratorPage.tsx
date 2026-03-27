import { ChevronLeft, Rocket } from "lucide-react";
import { motion } from "motion/react";
import ContentGenerator from "../components/ContentGenerator";

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none constellation-bg" />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[rgba(0,229,255,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            data-ocid="generator_page.link"
            className="flex items-center gap-2 text-sm text-[#93a4b6] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </a>

          <a
            href="/"
            className="flex items-center gap-2 font-bold tracking-wide"
            data-ocid="generator_page.link"
          >
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white text-sm sm:text-base">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </a>

          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-medium mb-6">
              ⚡ Powered by Caffeine AI
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Content{" "}
              <span className="text-[#00e5ff] glow-text">Generator</span>
            </h1>
            <p className="text-[#93a4b6] text-lg max-w-lg mx-auto">
              Gib ein Keyword ein und erhalte sofort virale Hooks, Skripte,
              Captions und mehr.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <ContentGenerator />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,229,255,0.08)] py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#00e5ff]" />
            <span className="text-white font-bold text-sm">
              CAFFEINE <span className="text-[#00e5ff]">LAUNCH LAB</span>
            </span>
          </div>
          <p className="text-[#4a6070] text-xs">
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
      </footer>
    </div>
  );
}
