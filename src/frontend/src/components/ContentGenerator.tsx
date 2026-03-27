import { Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveContent } from "../hooks/useQueries";
import { useAuth } from "../lib/auth";
import { type GeneratedContent, generateContent } from "../lib/templates";

interface ContentGeneratorProps {
  onGenerated?: (topic: string, content: GeneratedContent) => void;
}

export default function ContentGenerator({
  onGenerated,
}: ContentGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isAuthenticated } = useAuth();
  const saveContent = useSaveContent();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = generateContent(topic);
    setContent(result);
    setIsGenerating(false);
    onGenerated?.(topic, result);
    if (isAuthenticated) {
      saveContent.mutate(
        {
          topic,
          hooks: result.hooks,
          script: result.script,
          canvaTips: result.canvaTips,
          caption: result.caption,
          hashtags: result.hashtags,
        },
        {
          onSuccess: () => toast.success("Gespeichert!"),
          onError: () => toast.error("Fehler beim Speichern"),
        },
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          data-ocid="generator.input"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder='z.B. "Canva", "Fitness", "Dropshipping"'
          className="flex-1 bg-[#0d1526] border border-[rgba(0,229,255,0.25)] rounded-xl px-5 py-4 text-white placeholder-[#4a6070] focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all text-base"
        />
        <button
          type="button"
          data-ocid="generator.primary_button"
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="glow-button px-8 py-4 rounded-xl font-semibold text-[#0a0f1e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generiere…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Content generieren
            </>
          )}
        </button>
      </div>

      {/* Output Cards */}
      <AnimatePresence>
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Virale Hooks */}
            <div
              data-ocid="generator.card"
              className="glow-card p-6 md:col-span-2"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                🎣 <span className="text-[#00e5ff]">Virale Hooks</span>
              </h3>
              <div className="space-y-3">
                {content.hooks.map((hook, i) => (
                  <div key={hook} className="flex gap-3">
                    <span className="text-[#00e5ff] font-bold text-sm mt-0.5">
                      {i + 1}.
                    </span>
                    <p className="text-[#c8d8e8] text-sm leading-relaxed">
                      {hook}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Story-Skript */}
            <div data-ocid="generator.card" className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📖 <span className="text-[#00e5ff]">Story-Skript</span>
              </h3>
              <p className="text-[#c8d8e8] text-sm leading-relaxed whitespace-pre-wrap">
                {content.script}
              </p>
            </div>

            {/* Canva-Anweisungen */}
            <div data-ocid="generator.card" className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                🎨 <span className="text-[#00e5ff]">Canva-Anweisungen</span>
              </h3>
              <div className="text-[#c8d8e8] text-sm leading-relaxed space-y-1">
                {content.canvaTips.split("\n").map((line) => (
                  <p key={line}>{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div data-ocid="generator.card" className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                ✍️ <span className="text-[#00e5ff]">Caption</span>
              </h3>
              <p className="text-[#c8d8e8] text-sm leading-relaxed whitespace-pre-wrap">
                {content.caption}
              </p>
            </div>

            {/* Hashtags */}
            <div data-ocid="generator.card" className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                #️⃣ <span className="text-[#00e5ff]">Hashtags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
