import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  CheckSquare,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  Rocket,
  Square,
  Trash2,
  UserPlus,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { ContentRecord } from "../backend";
import { useAnonActor } from "../hooks/useAnonActor";
import { getAnalytics } from "../hooks/useLocalAnalytics";
import {
  type CreateToolArgs,
  type Tool,
  useAllHistory,
  useAllToolsAdmin,
  useBulkDelete,
  useCreateTool,
  useDeleteContent,
  useDeleteTool,
  useSaveContent,
  useStats,
  useUpdateTool,
} from "../hooks/useQueries";
import { useAuth } from "../lib/auth";
import { type GeneratedContent, generateContent } from "../lib/templates";

type AdminTab = "generator" | "history" | "analytics" | "quickaccess" | "tools";

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "generator", label: "Generator", icon: <Zap className="w-5 h-5" /> },
  { id: "history", label: "Verlauf", icon: <Clock className="w-5 h-5" /> },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    id: "quickaccess",
    label: "Schnellzugriffe",
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    id: "tools",
    label: "Tool-Verwaltung",
    icon: <Wrench className="w-5 h-5" />,
  },
];

function CopyButton({ text, label }: { text: string; label?: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Kopiert!");
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,229,255,0.15)] text-[#93a4b6] text-xs hover:border-[rgba(0,229,255,0.4)] hover:text-[#00e5ff] transition-all"
    >
      <Copy className="w-3.5 h-3.5" />
      {label ?? "Kopieren"}
    </button>
  );
}

function SectionCard({
  emoji,
  title,
  copyText,
  children,
}: {
  emoji: string;
  title: string;
  copyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glow-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">
          {emoji} {title}
        </h3>
        <CopyButton text={copyText} />
      </div>
      {children}
    </div>
  );
}

function ToolVerwaltung() {
  const { anonActor, isLoading: isActorLoading } = useAnonActor();
  const {
    data: tools,
    isLoading: isToolsLoading,
    isError,
    error: toolsError,
  } = useAllToolsAdmin();
  const isLoading = isActorLoading || isToolsLoading || !anonActor;
  const safeTools = tools ?? [];
  const createTool = useCreateTool();
  const updateTool = useUpdateTool();
  const deleteTool = useDeleteTool();

  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const emptyForm: CreateToolArgs = {
    emoji: "",
    name: "",
    kurzbeschreibung: "",
    zielgruppe: "",
    affiliateLink: [],
    fallbackLink: "",
    reihenfolge: BigInt(0),
    isPublic: true,
  };
  const [form, setForm] = useState<CreateToolArgs>(emptyForm);
  const [affiliateLinkInput, setAffiliateLinkInput] = useState("");
  const [reihenfolgeInput, setReihenfolgeInput] = useState("0");

  function openCreate() {
    setEditingTool(null);
    setForm(emptyForm);
    setAffiliateLinkInput("");
    setReihenfolgeInput("0");
    setShowModal(true);
  }

  function openEdit(tool: Tool) {
    setEditingTool(tool);
    const af = tool.affiliateLink.length > 0 ? tool.affiliateLink[0] : "";
    setAffiliateLinkInput(af ?? "");
    setReihenfolgeInput(String(tool.reihenfolge));
    setForm({
      emoji: tool.emoji,
      name: tool.name,
      kurzbeschreibung: tool.kurzbeschreibung,
      zielgruppe: tool.zielgruppe,
      affiliateLink: tool.affiliateLink,
      fallbackLink: tool.fallbackLink,
      reihenfolge: tool.reihenfolge,
      isPublic: tool.isPublic,
    });
    setShowModal(true);
  }

  async function handleSave() {
    const args: CreateToolArgs = {
      ...form,
      affiliateLink: affiliateLinkInput.trim()
        ? [affiliateLinkInput.trim()]
        : [],
      reihenfolge: BigInt(Number.parseInt(reihenfolgeInput, 10) || 0),
    };
    try {
      if (editingTool) {
        await updateTool.mutateAsync({ id: editingTool.id, args });
        toast.success("Tool aktualisiert");
      } else {
        await createTool.mutateAsync(args);
        toast.success("Tool erstellt");
      }
      setShowModal(false);
    } catch (e) {
      toast.error(`Fehler beim Speichern: ${String(e)}`);
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteTool.mutateAsync(id);
      toast.success("Tool gelöscht");
      setDeleteConfirm(null);
    } catch (e) {
      toast.error(`Fehler beim Löschen: ${String(e)}`);
    }
  }

  const isSaving = createTool.isPending || updateTool.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
            Tool-Verwaltung
          </h1>
          <p className="text-[#93a4b6] text-sm">
            Verwalte deine Tools für die öffentliche Webseite.
          </p>
        </div>
        <button
          type="button"
          data-ocid="tools.open_modal_button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00e5ff] text-[#060d1a] font-bold text-sm hover:bg-[#00b8cc] transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Neues Tool
        </button>
      </div>

      {isLoading && (
        <div
          data-ocid="tools.loading_state"
          className="flex items-center gap-3 text-[#93a4b6] py-8"
        >
          <Loader2 className="w-5 h-5 animate-spin text-[#00e5ff]" />
          <span>Tools werden geladen…</span>
        </div>
      )}

      {isError && (
        <div data-ocid="tools.error_state" className="space-y-2 py-4">
          <p className="text-red-400 font-medium">
            Fehler beim Laden der Tools.
          </p>
          <p className="text-red-300/70 text-sm">
            {toolsError instanceof Error
              ? toolsError.message
              : String(toolsError)}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      )}

      {!isLoading && !isError && safeTools.length === 0 && (
        <div
          data-ocid="tools.empty_state"
          className="glow-card p-8 text-center text-[#93a4b6]"
        >
          Noch keine Tools. Erstelle dein erstes Tool mit dem Button oben
          rechts.
        </div>
      )}

      {!isLoading && safeTools.length > 0 && (
        <div className="space-y-3" data-ocid="tools.list">
          {safeTools.map((tool, idx) => (
            <div
              key={String(tool.id)}
              data-ocid={`tools.item.${idx + 1}`}
              className="glow-card p-4 flex items-center gap-4"
            >
              <span className="text-2xl w-10 text-center flex-shrink-0">
                {tool.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold">{tool.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tool.isPublic ? "bg-[rgba(0,229,255,0.15)] text-[#00e5ff]" : "bg-[rgba(255,255,255,0.08)] text-[#4a6070]"}`}
                  >
                    {tool.isPublic ? "Öffentlich" : "Privat"}
                  </span>
                </div>
                <div className="text-[#93a4b6] text-xs mt-0.5">
                  {tool.zielgruppe}
                </div>
                {tool.affiliateLink.length > 0 && (
                  <div className="text-[#4a6070] text-xs mt-0.5 truncate">
                    🔗 {tool.affiliateLink[0]}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  data-ocid={`tools.edit_button.${idx + 1}`}
                  onClick={() => openEdit(tool)}
                  className="p-2 rounded-lg text-[#93a4b6] hover:text-[#00e5ff] hover:bg-[rgba(0,229,255,0.08)] transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deleteConfirm === tool.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      data-ocid={`tools.confirm_button.${idx + 1}`}
                      onClick={() => handleDelete(tool.id)}
                      disabled={deleteTool.isPending}
                      className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      {deleteTool.isPending ? "…" : "Ja"}
                    </button>
                    <button
                      type="button"
                      data-ocid={`tools.cancel_button.${idx + 1}`}
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 rounded text-xs bg-[rgba(255,255,255,0.05)] text-[#93a4b6] hover:bg-[rgba(255,255,255,0.1)]"
                    >
                      Nein
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid={`tools.delete_button.${idx + 1}`}
                    onClick={() => setDeleteConfirm(tool.id)}
                    className="p-2 rounded-lg text-[#93a4b6] hover:text-red-400 hover:bg-[rgba(255,0,0,0.08)] transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tool Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            data-ocid="tools.modal"
            className="bg-[#0d1526] border border-[rgba(0,229,255,0.2)] rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(0,229,255,0.1)] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-[rgba(0,229,255,0.1)]">
              <h2 className="text-white font-bold text-lg">
                {editingTool ? "Tool bearbeiten" : "Neues Tool erstellen"}
              </h2>
              <button
                type="button"
                data-ocid="tools.close_button"
                onClick={() => setShowModal(false)}
                className="text-[#4a6070] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label
                  htmlFor="tool-emoji"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Emoji
                </label>
                <input
                  id="tool-emoji"
                  data-ocid="tools.input"
                  type="text"
                  value={form.emoji}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emoji: e.target.value }))
                  }
                  placeholder="z.B. 🎨"
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="tool-name"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Name *
                </label>
                <input
                  id="tool-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Tool-Name"
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="tool-kurz"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Kurzbeschreibung *
                </label>
                <textarea
                  id="tool-kurz"
                  data-ocid="tools.textarea"
                  value={form.kurzbeschreibung}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kurzbeschreibung: e.target.value }))
                  }
                  placeholder="Kurze Beschreibung des Tools"
                  rows={3}
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors resize-none"
                />
              </div>
              <div>
                <label
                  htmlFor="tool-ziel"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Zielgruppe *
                </label>
                <input
                  id="tool-ziel"
                  type="text"
                  value={form.zielgruppe}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, zielgruppe: e.target.value }))
                  }
                  placeholder="z.B. Content Creator, Marketer"
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="tool-affiliate"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Affiliate-Link (optional)
                </label>
                <input
                  id="tool-affiliate"
                  type="url"
                  value={affiliateLinkInput}
                  onChange={(e) => setAffiliateLinkInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="tool-fallback"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Fallback-Link *
                </label>
                <input
                  id="tool-fallback"
                  type="url"
                  value={form.fallbackLink}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fallbackLink: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="tool-reihenfolge"
                  className="block text-[#93a4b6] text-xs mb-1.5"
                >
                  Reihenfolge
                </label>
                <input
                  id="tool-reihenfolge"
                  type="number"
                  value={reihenfolgeInput}
                  onChange={(e) => setReihenfolgeInput(e.target.value)}
                  className="w-full bg-[#060d1a] border border-[rgba(0,229,255,0.15)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[rgba(0,229,255,0.5)] transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="tools.toggle"
                  onClick={() =>
                    setForm((f) => ({ ...f, isPublic: !f.isPublic }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublic ? "bg-[#00e5ff]" : "bg-[#1a2a3a]"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
                <span className="text-sm text-[#93a4b6]">
                  {form.isPublic ? "Öffentlich" : "Privat"}
                </span>
              </div>
            </div>
            <div className="p-5 border-t border-[rgba(0,229,255,0.1)] flex gap-3 justify-end">
              <button
                type="button"
                data-ocid="tools.cancel_button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-[rgba(0,229,255,0.15)] text-[#93a4b6] text-sm hover:border-[rgba(0,229,255,0.3)] transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="button"
                data-ocid="tools.submit_button"
                onClick={handleSave}
                disabled={isSaving || !form.name || !form.fallbackLink}
                className="px-5 py-2 rounded-xl bg-[#00e5ff] text-[#060d1a] font-bold text-sm hover:bg-[#00b8cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingTool ? "Speichern" : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Admin() {
  const { isAuthenticated, isInitializing, login, logout, identity } =
    useAuth();

  const { data: stats, isLoading: statsLoading } = useStats();
  const [localAnalytics, setLocalAnalytics] = useState(() => getAnalytics());
  const { data: allHistory, isLoading: historyLoading } = useAllHistory();
  const deleteContent = useDeleteContent();
  const bulkDelete = useBulkDelete();
  const saveContent = useSaveContent();

  const [tab, setTab] = useState<AdminTab>("generator");
  useEffect(() => {
    if (tab === "analytics") setLocalAnalytics(getAnalytics());
  }, [tab]);
  const [selectedIds, setSelectedIds] = useState<Set<bigint>>(new Set());
  // Generator state
  const [generatorTopic, setGeneratorTopic] = useState("");
  const [generatorResult, setGeneratorResult] =
    useState<GeneratedContent | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="text-[#00e5ff] text-center">
          <div className="w-10 h-10 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#93a4b6]">Wird geladen…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin-Bereich</h1>
          <p className="text-[#93a4b6] text-sm mb-8">
            Bitte melde dich an, um das Admin Dashboard zu öffnen.
          </p>
          <button
            type="button"
            onClick={() => login()}
            className="w-full py-3 px-6 bg-[#00e5ff] text-[#0b0f1a] font-bold rounded-xl hover:bg-[#00b8cc] transition-colors"
          >
            Mit Internet Identity anmelden
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = (id: bigint) => {
    deleteContent.mutate(id, {
      onSuccess: () => toast.success("Gelöscht!"),
      onError: () => toast.error("Fehler beim Löschen"),
    });
  };

  const handleBulkDelete = () => {
    bulkDelete.mutate([...selectedIds], {
      onSuccess: (count) => {
        toast.success(`${count} Einträge gelöscht`);
        setSelectedIds(new Set());
      },
      onError: () => toast.error("Fehler beim Löschen"),
    });
  };

  const toggleSelect = (id: bigint) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    if (!generatorTopic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateContent(generatorTopic);
      setGeneratorResult(result);
      setIsSaved(false);
      setIsGenerating(false);
    }, 600);
  };

  const handleSave = () => {
    if (!generatorResult) return;
    saveContent.mutate(
      {
        topic: generatorTopic,
        hooks: generatorResult.hooks,
        script: generatorResult.script,
        canvaTips: generatorResult.canvaTips,
        caption: generatorResult.caption,
        hashtags: generatorResult.hashtags,
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          toast.success("Gespeichert!");
        },
        onError: () => toast.error("Fehler beim Speichern"),
      },
    );
  };

  const handleReuse = (record: ContentRecord) => {
    setGeneratorTopic(record.topic);
    setGeneratorResult({
      hooks: record.hooks,
      script: record.script,
      canvaTips: record.canvaTips,
      caption: record.caption,
      hashtags: record.hashtags,
    });
    setIsSaved(true);
    setTab("generator");
  };

  const sortedHistory = [...(allHistory ?? [])].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  const quickLinks = [
    {
      label: "Mit Caffeine bauen",
      href: "https://caffeine.ai",
      icon: "🚀",
      external: true,
    },
    {
      label: "Caffeine AI Info",
      href: "/detail/caffeine",
      icon: "🤖",
      external: false,
    },
    {
      label: "Canva Guide",
      href: "/detail/canva",
      icon: "🎨",
      external: false,
    },
    {
      label: "ElevenLabs Guide",
      href: "/detail/elevenlabs",
      icon: "🎤",
      external: false,
    },
    {
      label: "InVideo Guide",
      href: "/detail/invideo",
      icon: "🎥",
      external: false,
    },
    { label: "Zur Startseite", href: "/", icon: "🏠", external: false },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-[rgba(0,229,255,0.08)] bg-[#0d1526] flex-col min-h-screen">
        <div className="p-6 border-b border-[rgba(0,229,255,0.08)]">
          <a href="/#/" className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-white font-bold text-sm">
              CAFFEINE <span className="text-[#00e5ff]">LAB</span>
            </span>
          </a>
          <p className="text-[#4a6070] text-xs mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`admin.${item.id}.tab`}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                tab === item.id
                  ? "bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff]"
                  : "text-[#93a4b6] hover:bg-[rgba(255,255,255,0.03)] hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[rgba(0,229,255,0.08)]">
          <p className="text-[#4a6070] text-xs px-4 mb-2 truncate">
            {identity?.getPrincipal().toString().slice(0, 20)}…
          </p>
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#93a4b6] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-24 md:pb-8">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-[rgba(0,229,255,0.08)] bg-[#0d1526]">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#00e5ff]" />
            <span className="text-white font-bold text-sm">
              CAFFEINE <span className="text-[#00e5ff]">LAB</span>
            </span>
          </div>
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-[#93a4b6] hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

        <div className="p-4 md:p-8">
          {/* GENERATOR TAB */}
          {tab === "generator" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                Content Generator
              </h1>
              <p className="text-[#93a4b6] text-sm mb-6">
                Hooks, Story-Skript, Caption, Hashtags & Canva-Anweisungen auf
                einen Klick.
              </p>

              <div className="space-y-3 mb-6">
                <label
                  htmlFor="generator-topic"
                  className="block text-[#93a4b6] text-xs font-medium uppercase tracking-wider"
                >
                  Thema / Keyword
                </label>
                <div className="flex gap-2">
                  <input
                    id="generator-topic"
                    data-ocid="generator.input"
                    type="text"
                    value={generatorTopic}
                    onChange={(e) => setGeneratorTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="z.B. Instagram Wachstum, KI Tools…"
                    className="flex-1 px-4 py-3 rounded-lg bg-[#0d1526] border border-[rgba(0,229,255,0.15)] text-white placeholder-[#4a6070] text-sm outline-none focus:border-[#00e5ff] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.1)] transition-all"
                  />
                  <button
                    type="button"
                    data-ocid="generator.submit_button"
                    onClick={handleGenerate}
                    disabled={!generatorTopic.trim() || isGenerating}
                    className="glow-button px-5 py-3 rounded-lg text-sm font-bold text-[#0a0f1e] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0a0f1e] border-t-transparent rounded-full animate-spin" />
                        Generiere…
                      </span>
                    ) : (
                      "Alles generieren"
                    )}
                  </button>
                </div>
              </div>

              {generatorResult && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <SectionCard
                    emoji="🎣"
                    title="Hooks"
                    copyText={generatorResult.hooks
                      .map((h, i) => `${i + 1}. ${h}`)
                      .join("\n")}
                  >
                    <ol className="space-y-2">
                      {generatorResult.hooks.map((hook, i) => (
                        <li key={hook} className="flex gap-3">
                          <span className="text-[#00e5ff] font-bold text-sm shrink-0">
                            {i + 1}.
                          </span>
                          <p className="text-[#d0dde8] text-sm leading-relaxed">
                            {hook}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </SectionCard>

                  <SectionCard
                    emoji="📖"
                    title="Story-Skript"
                    copyText={generatorResult.script}
                  >
                    <p className="text-[#d0dde8] text-sm leading-relaxed whitespace-pre-wrap">
                      {generatorResult.script}
                    </p>
                  </SectionCard>

                  <SectionCard
                    emoji="✍️"
                    title="Caption"
                    copyText={generatorResult.caption}
                  >
                    <p className="text-[#d0dde8] text-sm leading-relaxed whitespace-pre-wrap">
                      {generatorResult.caption}
                    </p>
                  </SectionCard>

                  <SectionCard
                    emoji="#"
                    title="Hashtags"
                    copyText={generatorResult.hashtags
                      .map((t) => `#${t}`)
                      .join(" ")}
                  >
                    <div className="flex flex-wrap gap-2">
                      {generatorResult.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.15)] text-[#00e5ff]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard
                    emoji="🎨"
                    title="Canva-Anweisungen"
                    copyText={generatorResult.canvaTips}
                  >
                    <p className="text-[#d0dde8] text-sm leading-relaxed whitespace-pre-wrap">
                      {generatorResult.canvaTips}
                    </p>
                  </SectionCard>

                  <div className="pt-2">
                    {isSaved ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-sm">
                        ✓ Gespeichert
                      </span>
                    ) : (
                      <button
                        type="button"
                        data-ocid="generator.save_button"
                        onClick={handleSave}
                        disabled={saveContent.isPending}
                        className="px-5 py-2.5 rounded-lg border border-[rgba(0,229,255,0.2)] text-[#93a4b6] text-sm hover:border-[rgba(0,229,255,0.4)] hover:text-white transition-all disabled:opacity-40"
                      >
                        In Verlauf speichern
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* HISTORY TAB */}
          {tab === "history" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    Verlauf
                  </h1>
                  <p className="text-[#93a4b6] text-sm mt-1">
                    Neueste zuerst – klicke auf Wiederverwenden, um Thema zu
                    laden.
                  </p>
                </div>
                {selectedIds.size > 0 && (
                  <button
                    type="button"
                    data-ocid="admin.bulk.delete_button"
                    onClick={handleBulkDelete}
                    disabled={bulkDelete.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/30 border border-red-500/30 text-red-400 text-sm hover:bg-red-900/50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    {selectedIds.size} löschen
                  </button>
                )}
              </div>

              {historyLoading ? (
                <div
                  data-ocid="admin.history.loading_state"
                  className="space-y-3"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-16 w-full bg-[rgba(255,255,255,0.03)]"
                    />
                  ))}
                </div>
              ) : sortedHistory.length === 0 ? (
                <div
                  data-ocid="admin.history.empty_state"
                  className="glow-card p-12 text-center text-[#93a4b6]"
                >
                  Noch kein Content generiert.
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedHistory.map((r: ContentRecord, i: number) => (
                    <div
                      key={String(r.id)}
                      data-ocid={`admin.history.item.${i + 1}`}
                      className="glow-card p-4 flex items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSelect(r.id)}
                        className="shrink-0"
                      >
                        {selectedIds.has(r.id) ? (
                          <CheckSquare className="w-4 h-4 text-[#00e5ff]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#4a6070]" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {r.topic}
                        </p>
                        <p className="text-[#4a6070] text-xs">
                          {new Date(
                            Number(r.timestamp / BigInt(1_000_000)),
                          ).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          data-ocid={`admin.history.edit_button.${i + 1}`}
                          onClick={() => handleReuse(r)}
                          className="px-3 py-1.5 rounded-lg border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs hover:bg-[rgba(0,229,255,0.08)] transition-all"
                        >
                          Wiederverwenden
                        </button>
                        <button
                          type="button"
                          data-ocid={`admin.history.delete_button.${i + 1}`}
                          onClick={() => handleDelete(r.id)}
                          disabled={deleteContent.isPending}
                          className="p-2 rounded-lg text-[#93a4b6] hover:text-red-400 hover:bg-red-900/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {tab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                Analytics
              </h1>
              <p className="text-[#93a4b6] text-sm mb-6">
                Deine Content-Aktivität auf einen Blick.
              </p>

              <h2 className="text-base font-bold text-white mb-4">
                Besucher-Analytics
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  data-ocid="admin.visitor.card"
                  className="glow-card p-5 relative"
                >
                  <Users className="w-4 h-4 text-[#00e5ff] absolute top-4 right-4" />
                  <p className="text-[#93a4b6] text-xs mb-2">Gesamtbesucher</p>
                  <p className="text-3xl font-black text-[#00e5ff]">
                    {localAnalytics.totalVisitors}
                  </p>
                </div>
                <div
                  data-ocid="admin.visitor.card"
                  className="glow-card p-5 relative"
                >
                  <Eye className="w-4 h-4 text-[#00e5ff] absolute top-4 right-4" />
                  <p className="text-[#93a4b6] text-xs mb-2">Heute</p>
                  <p className="text-3xl font-black text-[#00e5ff]">
                    {localAnalytics.visitorsToday}
                  </p>
                </div>
                <div
                  data-ocid="admin.visitor.card"
                  className="glow-card p-5 relative"
                >
                  <UserPlus className="w-4 h-4 text-[#00e5ff] absolute top-4 right-4" />
                  <p className="text-[#93a4b6] text-xs mb-2">Diese Woche</p>
                  <p className="text-3xl font-black text-[#00e5ff]">
                    {localAnalytics.visitorsThisWeek}
                  </p>
                </div>
                <div
                  data-ocid="admin.visitor.card"
                  className="glow-card p-5 relative"
                >
                  <RefreshCw className="w-4 h-4 text-[#00e5ff] absolute top-4 right-4" />
                  <p className="text-[#93a4b6] text-xs mb-2">Seitenaufrufe</p>
                  <p className="text-3xl font-black text-[#00e5ff]">
                    {localAnalytics.pageViews}
                  </p>
                </div>
              </div>

              <div className="glow-card p-5 mb-8">
                <h2 className="text-base font-bold text-white mb-4">
                  Besucher der letzten 7 Tage
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={localAnalytics.dailyChartData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="day"
                      stroke="#4a6070"
                      tick={{ fill: "#4a6070", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#4a6070"
                      tick={{ fill: "#4a6070", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0d1526",
                        border: "1px solid rgba(0,229,255,0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      cursor={{ fill: "rgba(0,229,255,0.05)" }}
                    />
                    <Bar
                      dataKey="besucher"
                      fill="#00e5ff"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h2 className="text-base font-bold text-white mb-4 mt-8">
                Content-Analytics
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div data-ocid="admin.stats.card" className="glow-card p-5">
                  <p className="text-[#93a4b6] text-xs mb-2">
                    Gesamt generiert
                  </p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 bg-[rgba(255,255,255,0.05)]" />
                  ) : (
                    <p className="text-3xl md:text-4xl font-black text-[#00e5ff]">
                      {String(stats?.totalCount ?? 0)}
                    </p>
                  )}
                </div>
                <div data-ocid="admin.stats.card" className="glow-card p-5">
                  <p className="text-[#93a4b6] text-xs mb-2">Letzte 7 Tage</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 bg-[rgba(255,255,255,0.05)]" />
                  ) : (
                    <p className="text-3xl md:text-4xl font-black text-[#00e5ff]">
                      {String(stats?.recentCount ?? 0)}
                    </p>
                  )}
                </div>
              </div>

              <h2 className="text-base font-bold text-white mb-4">
                Letzte 10 Aktivitäten
              </h2>
              {historyLoading ? (
                <div
                  data-ocid="admin.analytics.loading_state"
                  className="space-y-2"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-12 w-full bg-[rgba(255,255,255,0.03)]"
                    />
                  ))}
                </div>
              ) : sortedHistory.length === 0 ? (
                <div
                  data-ocid="admin.analytics.empty_state"
                  className="glow-card p-8 text-center text-[#93a4b6]"
                >
                  Noch kein Content generiert.
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedHistory.slice(0, 10).map((r, i) => (
                    <div
                      key={String(r.id)}
                      data-ocid={`admin.analytics.item.${i + 1}`}
                      className="glow-card p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#00e5ff] font-bold text-xs w-5">
                          {i + 1}.
                        </span>
                        <p className="text-white text-sm font-medium">
                          {r.topic}
                        </p>
                      </div>
                      <p className="text-[#4a6070] text-xs shrink-0">
                        {new Date(
                          Number(r.timestamp / BigInt(1_000_000)),
                        ).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* QUICKACCESS TAB */}
          {tab === "quickaccess" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                Schnellzugriffe
              </h1>
              <p className="text-[#93a4b6] text-sm mb-6">
                Direkte Links zu den wichtigsten Bereichen.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    data-ocid="admin.quickaccess.link"
                    className="glow-card p-5 flex flex-col items-center gap-3 hover:border-[rgba(0,229,255,0.3)] transition-all group cursor-pointer text-center"
                  >
                    <span className="text-3xl">{link.icon}</span>
                    <span className="text-white text-sm font-medium leading-tight">
                      {link.label}
                    </span>
                    {link.external ? (
                      <ExternalLink className="w-3.5 h-3.5 text-[#4a6070] group-hover:text-[#00e5ff] transition-colors" />
                    ) : (
                      <span className="text-[#4a6070] group-hover:text-[#00e5ff] text-xs transition-colors">
                        →
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
          {tab === "tools" && <ToolVerwaltung />}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d1526] border-t border-[rgba(0,229,255,0.12)] flex z-50">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            data-ocid={`admin.${item.id}.tab`}
            onClick={() => setTab(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all ${
              tab === item.id ? "text-[#00e5ff]" : "text-[#4a6070]"
            }`}
          >
            {item.icon}
            <span className="hidden xs:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
