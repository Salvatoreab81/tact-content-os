"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Save,
  Loader2,
  CheckCircle,
  Globe,
  Layers,
  Hash,
  MessageSquare,
  Sparkles,
  Mail,
  Camera,
  Users,
  Video,
  Briefcase,
  History,
  ArrowRight,
  Eye,
  RotateCcw,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const XIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera },
  { id: "facebook", label: "Facebook", icon: Users },
  { id: "tiktok", label: "TikTok", icon: Video },
  { id: "youtube", label: "YouTube", icon: Video },
  { id: "blog", label: "Blog SEO", icon: PenLine },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase },
  { id: "threads", label: "Threads", icon: MessageSquare },
  { id: "x", label: "X.com", icon: XIcon },
  { id: "newsletter", label: "Newsletter", icon: Mail },
];

import { PenLine } from "lucide-react";

const PLATFORM_DETAILS_MAP: Record<string, {
  formats: { id: string; label: string }[];
  focus: string;
}> = {
  instagram: {
    formats: [
      { id: "reels", label: "Reels" },
      { id: "carousel", label: "Carousel Post" },
      { id: "single", label: "Single Photo Post" },
      { id: "stories", label: "Stories" }
    ],
    focus: "Visual hook first, structured copy in captions, and high interaction triggers."
  },
  facebook: {
    formats: [
      { id: "image", label: "Image Post" },
      { id: "link", label: "Link Share" },
      { id: "video", label: "Video Post" }
    ],
    focus: "Community engagement, longer conversational text, and link previews."
  },
  tiktok: {
    formats: [
      { id: "short", label: "Short Video (Trends)" },
      { id: "tutorial", label: "Educational Video" }
    ],
    focus: "Furious 3-second hook, fast pacing, native text overlays, and audio sync."
  },
  youtube: {
    formats: [
      { id: "long", label: "Long Video Intro/Outline" },
      { id: "shorts", label: "YouTube Shorts" },
      { id: "community", label: "Community Post" }
    ],
    focus: "CTR-optimized titles, comprehensive outline structures, and direct calls to subscribe."
  },
  blog: {
    formats: [
      { id: "seo_article", label: "100% Yoast SEO Article" },
      { id: "tutorial", label: "Step-by-Step Tutorial" },
      { id: "guide", label: "In-Depth Guide" }
    ],
    focus: "100% Yoast SEO compliance: keyword density, H2/H3 semantic tags, short readability blocks, and meta description optimization."
  },
  linkedin: {
    formats: [
      { id: "story", label: "Professional Storytelling" },
      { id: "pdf_carousel", label: "PDF Document Carousel" },
      { id: "insight", label: "Industry Takeaways" }
    ],
    focus: "Elite professional tone, white-space formatting for readability, hook-story-value-cta structure."
  },
  threads: {
    formats: [
      { id: "short", label: "Conversational Post" },
      { id: "thread", label: "Short Thread" }
    ],
    focus: "Casual, text-first, authentic voice, and quick-reply triggers."
  },
  x: {
    formats: [
      { id: "post", label: "Short Post (280 char)" },
      { id: "thread", label: "Viral Thread Outline" },
      { id: "article", label: "Long-form Article" }
    ],
    focus: "Contrarian viral hook, bulleted lists, high-punch delivery, and character constraint optimization."
  },
  newsletter: {
    formats: [
      { id: "weekly", label: "Weekly Digest" },
      { id: "promo", label: "Promotional Offer" },
      { id: "case_study", label: "Customer Case Study" }
    ],
    focus: "Intimate personal copywriting (Dear [Name]), CTR-optimized subject lines, and single prominent CTA link."
  }
};

const VERTICALS = [
  { id: "education", label: "Education" },
  { id: "curiosity", label: "Curiosity" },
  { id: "inspiration", label: "Inspiration" },
  { id: "authority", label: "Authority" },
  { id: "sale", label: "Sale" },
  { id: "entertainment", label: "Entertainment" },
];

const PLATFORM_TRANSLATIONS: Record<string, { focus: string; formats: Record<string, string> }> = {
  instagram: {
    focus: "Gancho visual primero, texto estructurado en descripciones e incentivos de interacción.",
    formats: { reels: "Reels", carousel: "Publicación Carrusel", single: "Imagen Única", stories: "Stories" }
  },
  facebook: {
    focus: "Interacción de la comunidad, textos conversacionales más largos y vistas previas de enlaces.",
    formats: { image: "Publicación de Imagen", link: "Compartir Enlace", video: "Publicación de Video" }
  },
  tiktok: {
    focus: "Gancho inicial de 3 segundos, ritmo rápido, textos nativos superpuestos y audio en tendencia.",
    formats: { short: "Video Corto (Tendencias)", tutorial: "Video Educativo" }
  },
  youtube: {
    focus: "Títulos optimizados para CTR, estructura de contenido completa y llamado a la acción directo.",
    formats: { long: "Intro/Guion Video Largo", shorts: "YouTube Shorts", community: "Comunidad" }
  },
  blog: {
    focus: "100% optimizado para Yoast SEO: densidad de palabras clave, etiquetas H2/H3, párrafos legibles y meta descripción.",
    formats: { seo_article: "Artículo 100% Yoast SEO", tutorial: "Tutorial Paso a Paso", guide: "Guía Detallada" }
  },
  linkedin: {
    focus: "Tono profesional, estructura limpia con espacios, gancho-historia-valor-llamado a la acción.",
    formats: { story: "Narrativa Profesional", pdf_carousel: "Carrusel de Documento PDF", insight: "Perspectivas del Sector" }
  },
  threads: {
    focus: "Tono casual, primero texto, voz auténtica e hilos rápidos que inviten a opinar.",
    formats: { short: "Publicación Casual", thread: "Hilo Corto" }
  },
  x: {
    focus: "Gancho viral e impactante, listas de viñetas, tono conciso y optimización del límite de caracteres.",
    formats: { post: "Post Corto (280 char)", thread: "Estructura de Hilo Viral", article: "Artículo Largo" }
  },
  newsletter: {
    focus: "Copia íntima y directa (Estimado/a [Nombre]), asuntos de correo con alto CTR y un enlace destacado de llamada a la acción.",
    formats: { weekly: "Resumen Semanal", promo: "Oferta Promocional", case_study: "Caso de Éxito de Cliente" }
  }
};

const TRANSLATIONS = {
  en: {
    brandGuidelinesDashboard: "Brand Guidelines Dashboard",
    editGuidelinesOnboarding: "Edit Guidelines (Onboarding)",
    saveChanges: "Save active guidelines",
    brandPersonaTitle: "Brand Persona & Tone Guidelines",
    brandPersonaDesc: "Describe how TACT should communicate and represent your brand identity.",
    targetAudienceDemographics: "Target Audience Demographics",
    activeChannelsTitle: "Active Channels, Formats & Focus Rules",
    brandColorsFonts: "Brand Identity Assets (Colors & Fonts)",
    brandMemoryIntelligence: "Brand Memory & Context Intelligence",
    versionHistoryTitle: "Brand Version History & Rollbacks",
    versionHistoryDesc: "Restore your brand configuration to any past snapshot in one click.",
    brandName: "Brand Name",
    industry: "Industry",
    loadingBrand: "Loading brand profile...",
    savingGuidelines: "Saving guidelines...",
  },
  es: {
    brandGuidelinesDashboard: "Panel de Guías de Marca",
    editGuidelinesOnboarding: "Editar Guías (Onboarding)",
    saveChanges: "Guardar guías activas",
    brandPersonaTitle: "Personalidad de Marca y Pautas de Tono",
    brandPersonaDesc: "Describe cómo debe comunicarse TACT y representar la identidad de tu marca.",
    targetAudienceDemographics: "Demografía de la Audiencia Objetivo",
    activeChannelsTitle: "Canales Activos, Formatos y Reglas de Enfoque",
    brandColorsFonts: "Identidad Visual (Colores y Fuentes)",
    brandMemoryIntelligence: "Memoria de Marca e Inteligencia de Contexto",
    versionHistoryTitle: "Historial de Versiones y Restauración",
    versionHistoryDesc: "Restaura la configuración de tu marca a cualquier versión pasada en un clic.",
    brandName: "Nombre de Marca",
    industry: "Industria",
    loadingBrand: "Cargando perfil de marca...",
    savingGuidelines: "Guardando guías...",
  }
};

export default function BrandGuidelinesPage() {
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lang, setLang] = useState<"en" | "es">("en");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("tact_lang") as "en" | "es";
    if (savedLang === "en" || savedLang === "es") {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (l: "en" | "es") => {
    setLang(l);
    localStorage.setItem("tact_lang", l);
  };

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message: msg, type });
  };

  const t = (key: keyof typeof TRANSLATIONS.en) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
  };

  // Memories / Brand Intelligence state
  const [memories, setMemories] = useState<any[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [newMemory, setNewMemory] = useState({ title: "", content: "", category: "strategy" });
  const [addingMemory, setAddingMemory] = useState(false);

  // Version History State
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedHistoryVer, setSelectedHistoryVer] = useState<any>(null);

  const [generatingTone, setGeneratingTone] = useState(false);
  const [toneCustomPrompt, setToneCustomPrompt] = useState("");

  const [form, setForm] = useState({
    openrouterApiKey: "",
    openrouterModel: "google/gemini-2.0-flash",
    name: "",
    industry: "",
    toneOfVoice: "",
    markets: [] as string[],
    platforms: [] as string[],
    contentVerticals: [] as string[],
    targetAudience: {
      genders: { men: 50, women: 50 },
      socioEconomic: [] as string[],
      regions: [] as string[],
      countries: [] as string[],
      excludedCountries: [] as string[],
      generations: [] as string[],
    },
    platformDetails: {} as Record<string, { formats: string[] }>
  });

  const parseTargetAudience = (ta: any, marketsFallback: string[]) => {
    const genders = (ta && typeof ta.genders === "object" && !Array.isArray(ta.genders))
      ? { men: ta.genders.men ?? 50, women: ta.genders.women ?? 50 }
      : { men: 50, women: 50 };

    let socioEconomic: string[] = [];
    if (ta && ta.socioEconomic) {
      if (Array.isArray(ta.socioEconomic)) {
        socioEconomic = ta.socioEconomic;
      } else if (typeof ta.socioEconomic === "string") {
        if (ta.socioEconomic === "luxury") {
          socioEconomic = ["ab"];
        } else if (ta.socioEconomic === "high") {
          socioEconomic = ["ab", "cplus"];
        } else if (ta.socioEconomic === "medium") {
          socioEconomic = ["cplus", "c"];
        } else {
          socioEconomic = [ta.socioEconomic];
        }
      } else if (typeof ta.socioEconomic === "object") {
        if (ta.socioEconomic.ab > 0) socioEconomic.push("ab");
        if (ta.socioEconomic.cplus > 0) socioEconomic.push("cplus");
        if (ta.socioEconomic.c > 0) socioEconomic.push("c");
        if (ta.socioEconomic.de > 0) socioEconomic.push("de");
      }
    } else {
      socioEconomic = ["cplus", "c"];
    }

    const regions = ta?.regions || [];
    const countries = ta?.countries || ta?.markets || marketsFallback || [];
    const excludedCountries = ta?.excludedCountries || [];
    const generations = ta?.generations || [];

    return { genders, socioEconomic, regions, countries, excludedCountries, generations };
  };

  useEffect(() => {
    async function fetchBrandData() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const brands = await res.json();
          if (brands && brands.length > 0) {
            const current = brands[0]; // Fetch first brand
            setBrand(current);
            setForm({
              openrouterApiKey: current.openrouter_api_key || current.openrouterApiKey || "",
              openrouterModel: current.openrouter_model || current.openrouterModel || "google/gemini-2.0-flash",
              name: current.name || "",
              industry: current.industry || "",
              toneOfVoice: current.tone_of_voice || current.toneOfVoice || "",
              markets: current.markets || [],
              platforms: current.platforms || [],
              contentVerticals: current.content_verticals || current.contentVerticals || [],
              targetAudience: parseTargetAudience(current.target_audience || current.targetAudience, current.markets || []),
              platformDetails: current.platform_details || current.platformDetails || {}
            });
          }
        }
      } catch (err) {
        console.error("Error fetching brand data:", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchMemories() {
      try {
        const res = await fetch("/api/agent/memories");
        if (res.ok) {
          const data = await res.json();
          setMemories(data.memories || []);
        }
      } catch (err) {
        console.error("Error fetching memories:", err);
      } finally {
        setLoadingMemories(false);
      }
    }

    fetchBrandData();
    fetchMemories();
  }, []);

  // Fetch version history when brand is loaded
  useEffect(() => {
    if (!brand) return;
    async function fetchHistory() {
      try {
        const res = await fetch("/api/brands/history");
        if (res.ok) {
          const data = await res.json();
          setHistoryList(data || []);
        }
      } catch (err) {
        console.error("Failed to load history list:", err);
      } finally {
        setLoadingHistory(false);
      }
    }
    fetchHistory();
  }, [brand]);

  const handleAddMemory = async () => {
    if (!newMemory.title || !newMemory.content) return;
    setAddingMemory(true);
    try {
      const res = await fetch("/api/agent/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: brand?.id || "1",
          title: newMemory.title,
          content: newMemory.content,
          category: newMemory.category
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setMemories((prev) => [saved, ...prev]);
        setNewMemory({ title: "", content: "", category: "strategy" });
      }
    } catch (err) {
      console.error("Error adding brand memory:", err);
    } finally {
      setAddingMemory(false);
    }
  };

  const handleSave = async () => {
    if (!brand) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      // Sync markets root list with targetAudience countries/regions
      const payload = {
        ...form,
        markets: form.targetAudience.countries.length > 0 ? form.targetAudience.countries : form.targetAudience.regions,
      };

      const res = await fetch(`/api/brands/${brand.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        showToast(lang === "en" ? "Guidelines saved successfully!" : "¡Configuración de marca guardada con éxito!", "success");
        // Refresh history list
        const histRes = await fetch("/api/brands/history");
        if (histRes.ok) {
          const data = await histRes.json();
          setHistoryList(data || []);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Save failed:", errorData.error);
        showToast(lang === "en" ? `Save failed: ${errorData.error || "Internal error"}` : `Error al guardar: ${errorData.error || "Error interno"}`, "error");
      }
    } catch (err: any) {
      console.error("Error saving brand details:", err);
      showToast(lang === "en" ? `Save failed: ${err.message}` : `Error de red al guardar: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateTone = async () => {
    if (!form.name || !form.industry) {
      showToast(lang === "en" ? "Brand Name and Industry are required" : "Nombre e industria requeridos", "error");
      return;
    }
    setGeneratingTone(true);
    try {
      const res = await fetch("/api/generate/tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: form.name,
          industry: form.industry,
          targetAudience: form.targetAudience,
          model: form.openrouterModel,
          customPrompt: toneCustomPrompt
        })
      });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, toneOfVoice: data.toneOfVoice }));
        showToast(lang === "en" ? "Tone of voice generated successfully!" : "¡Tono de voz generado!", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to generate tone", "error");
      }
    } catch (e) {
      showToast("Error connecting to AI.", "error");
    } finally {
      setGeneratingTone(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/brands/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      if (res.ok) {
        showToast(lang === "en" ? "Restoring snapshot..." : "Restaurando versión...", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(lang === "en" ? `Restore failed: ${errorData.error || "Internal error"}` : `Fallo al restaurar: ${errorData.error || "Error interno"}`, "error");
      }
    } catch (err: any) {
      console.error("Restore failed:", err);
      showToast(lang === "en" ? `Restore failed: ${err.message}` : `Error de red al restaurar: ${err.message}`, "error");
    } finally {
      setSaving(false);
      setSelectedHistoryVer(null);
    }
  };

  const toggleArrayItem = (field: "platforms" | "contentVerticals", item: string) => {
    setForm((prev) => {
      const updatedList = prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item];

      const updatedDetails = { ...prev.platformDetails };
      if (field === "platforms") {
        if (!prev.platforms.includes(item)) {
          const defaultFormats = PLATFORM_DETAILS_MAP[item]?.formats.map(f => f.id).slice(0, 2) || [];
          updatedDetails[item] = { formats: defaultFormats };
        } else {
          delete updatedDetails[item];
        }
      }

      return {
        ...prev,
        [field]: updatedList,
        platformDetails: updatedDetails
      };
    });
  };

  const togglePlatformFormat = (platformId: string, formatId: string) => {
    setForm((prev) => {
      const currentDetails = prev.platformDetails[platformId] || { formats: [] };
      const currentFormats = currentDetails.formats || [];
      const updatedFormats = currentFormats.includes(formatId)
        ? currentFormats.filter((f) => f !== formatId)
        : [...currentFormats, formatId];
      
      return {
        ...prev,
        platformDetails: {
          ...prev.platformDetails,
          [platformId]: {
            ...currentDetails,
            formats: updatedFormats
          }
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="p-8 text-center space-y-4">
        <Building2 className="h-16 w-16 text-white/10 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Brand Configured</h2>
        <p className="text-sm text-white/40 max-w-sm mx-auto">
          Please complete the onboarding first to set up your brand guidelines.
        </p>
        <Link href="/onboarding">
          <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold">
            Start Setup Onboarding
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8 select-none relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : toast.type === "error"
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
              : "bg-blue-500/10 border-blue-500/20 text-blue-400"
        }`}>
          {toast.type === "success" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
          ) : toast.type === "error" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <Info className="h-3.5 w-3.5" />
            </div>
          )}
          <div className="space-y-0.5">
            <span className="block text-[9px] font-bold font-mono uppercase tracking-wider">
              {toast.type === "success" ? "Success" : toast.type === "error" ? "System Alert" : "Info"}
            </span>
            <p className="text-[11px] text-white/70 font-sans leading-tight pr-4">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-white/25 hover:text-white/50 text-xs ml-auto font-mono p-1">
            ×
          </button>
        </div>
      )}

      {/* Language Selector Selector */}
      <div className="absolute top-4 right-4 flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-sm z-30">
        <button
          type="button"
          onClick={() => changeLanguage("en")}
          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold font-mono transition-all ${
            lang === "en" ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20" : "text-white/40 hover:text-white/70"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => changeLanguage("es")}
          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold font-mono transition-all ${
            lang === "es" ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20" : "text-white/40 hover:text-white/70"
          }`}
        >
          ES-MX
        </button>
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow flex items-center gap-3">
            {t("brandGuidelinesDashboard")}
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            {lang === "en"
              ? "Manage your brand identity, tone of voice, demographics, and channels"
              : "Administra la identidad de tu marca, tono de voz, datos demográficos y canales"}
          </p>
        </div>
        <div className="flex items-center gap-3 pr-20 sm:pr-0">
          <Link href="/onboarding">
            <Button
              type="button"
              variant="outline"
              className="border-[#00ff88]/20 bg-[#00ff88]/5 text-[#00ff88] hover:bg-[#00ff88]/10 font-bold transition-all duration-300 rounded-xl text-xs gap-2"
            >
              <Sparkles className="h-4 w-4" /> {lang === "en" ? "Re-run Setup Wizard" : "Relanzar Configuración"}
            </Button>
          </Link>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)] rounded-xl"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t("savingGuidelines")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> {t("saveChanges")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Identity, Tone & Demographics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Building2 className="h-4 w-4 text-[#00d4ff]/60" /> {lang === "en" ? "Core Identity" : "Identidad Central"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block form-label mb-2">{t("brandName")}</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block form-label mb-2">{t("industry")}</label>
                <Input
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          {/* Tone of Voice Card */}
          <div className="glass p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal">
                <MessageSquare className="h-4 w-4 text-[#00ff88]/60" /> {lang === "en" ? "Tone of Voice" : "Tono de Voz"}
              </h3>
            </div>
            
            <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-[#00ff88]/10">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  placeholder={lang === "en" ? "Custom AI instructions (e.g. 'Make it funnier', 'More professional')" : "Instrucciones IA (ej. 'Hazlo más divertido', 'Más corporativo')"}
                  value={toneCustomPrompt}
                  onChange={(e) => setToneCustomPrompt(e.target.value)}
                  className="glass-input text-xs flex-1"
                />
                <Button 
                  onClick={handleGenerateTone} 
                  disabled={generatingTone || !form.name || !form.industry}
                  variant="outline"
                  className="w-full sm:w-auto text-xs bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/20 hover:text-[#00ff88]"
                >
                  {generatingTone ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Sparkles className="h-3 w-3 mr-2" />}
                  {lang === "en" ? "Generate with AI" : "Generar con IA"}
                </Button>
              </div>
              <p className="text-[10px] text-white/40">
                {lang === "en" ? "Fills out the tone guidelines based on your brand name, industry, and audience. Add custom instructions to steer the AI." : "Rellena las pautas de tono basándose en tu marca, industria y audiencia. Añade instrucciones para guiar a la IA."}
              </p>
            </div>

            <div>
              <label className="block form-label mb-2">{lang === "en" ? "Voice & Persona Guidelines" : "Pautas de Voz y Personalidad"}</label>
              <textarea
                rows={10}
                value={form.toneOfVoice}
                onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
                placeholder={lang === "en" ? "Describe your brand's voice and guidelines..." : "Describe la voz y pautas de tu marca..."}
                className="w-full rounded-xl glass-input px-4 py-3 text-sm outline-none resize-none"
              />
            </div>
          </div>

          {/* Target Audience / Segmentation Card */}
          <div className="glass p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Globe className="h-4 w-4 text-purple-400" /> {t("targetAudienceDemographics")}
            </h3>

            {/* Geographic Markets */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">{lang === "en" ? "Markets & Geographic Focus" : "Enfoque Geográfico y Mercados"}</span>
              <div className="flex flex-wrap gap-1.5">
                {form.targetAudience.regions.map((reg) => {
                  const regLabel = lang === "es" ? (reg === "latam" ? "América Latina" : reg === "north_america" ? "Norteamérica" : reg === "europe" ? "Europa" : reg === "apac" ? "Asia-Pacífico" : "Medio Oriente") : reg;
                  return (
                    <Badge
                      key={reg}
                      variant="outline"
                      className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs text-cyan-400 font-mono capitalize"
                    >
                      {lang === "en" ? "Region:" : "Región:"} {regLabel}
                    </Badge>
                  );
                })}
                {form.targetAudience.countries.map((m) => {
                  const countryLabel = lang === "es" ? (m === "United States" ? "Estados Unidos" : m === "United Kingdom" ? "Reino Unido" : m) : m;
                  return (
                    <Badge
                      key={m}
                      variant="outline"
                      className="rounded-lg bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs text-white/70 font-mono"
                    >
                      {countryLabel}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Excluded Markets */}
            {form.targetAudience.excludedCountries?.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-white/[0.04]">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono">{lang === "en" ? "Excluded Markets" : "Mercados Excluidos"}</span>
                <div className="flex flex-wrap gap-1.5">
                  {form.targetAudience.excludedCountries.map((ex) => (
                    <Badge
                      key={ex}
                      variant="outline"
                      className="rounded-lg bg-red-500/5 border border-red-500/20 px-2.5 py-1 text-xs text-red-400 font-mono"
                    >
                      {ex}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/[0.04]">
              {/* Gender ratio split bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-white/40">{lang === "en" ? "Gender Distribution" : "Distribución de Género"}</span>
                  <span className="text-[#00ff88]">
                    {form.targetAudience.genders.men}% {lang === "en" ? "Men" : "Hombres"} / {form.targetAudience.genders.women}% {lang === "en" ? "Women" : "Mujeres"}
                  </span>
                </div>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10 w-full shadow-inner">
                  <div style={{ width: `${form.targetAudience.genders.men}%` }} className="bg-[#00ff88]" />
                  <div style={{ width: `${form.targetAudience.genders.women}%` }} className="bg-purple-500" />
                </div>
                <div className="flex justify-between text-[9px] text-white/30 font-mono">
                  <span>{lang === "en" ? "MEN" : "HOMBRES"}</span>
                  <span>{lang === "en" ? "WOMEN" : "MUJERES"}</span>
                </div>
              </div>

              {/* Generations target */}
              <div className="space-y-2">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono block">{lang === "en" ? "Target Generations" : "Generaciones Objetivo"}</span>
                <div className="flex flex-wrap gap-1.5">
                  {form.targetAudience.generations.map((g) => (
                    <Badge
                      key={g}
                      variant="outline"
                      className="rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 px-2.5 py-1 text-xs text-[#00ff88] font-mono capitalize"
                    >
                      {g.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Socio-Economic split badges */}
            <div className="space-y-3 pt-4 border-t border-white/[0.04]">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono block">{lang === "en" ? "Socio-Economic Focus" : "Nivel Socioeconómico"}</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "ab", label: "A/B (Luxury / Alto)", labelEn: "A/B (Luxury / High)", desc: "Consumidores de lujo y alto nivel adquisitivo", descEn: "Luxury and high purchasing power consumers", color: "text-[#00ff88] border-[#00ff88]/20 bg-[#00ff88]/5" },
                  { id: "cplus", label: "C+ (Premium)", labelEn: "C+ (Premium)", desc: "Clase media alta con preferencia por lo premium", descEn: "Upper middle class with premium preference", color: "text-[#00d4ff] border-[#00d4ff]/20 bg-[#00d4ff]/5" },
                  { id: "c", label: "C (Clase Media)", labelEn: "C (Middle Class)", desc: "Mercado masivo con foco en calidad-precio", descEn: "Mass market focused on quality-price value", color: "text-purple-400 border-purple-500/20 bg-purple-500/5" },
                  { id: "de", label: "D/E (Bajo Costo)", labelEn: "D/E (Low Cost)", desc: "Mercado de bajo costo o presupuesto ajustado", descEn: "Low cost market or tight budget focus", color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
                ].map((tier) => {
                  const isActive = form.targetAudience.socioEconomic.includes(tier.id);
                  const tierLabel = lang === "en" ? tier.labelEn : tier.label;
                  const tierDesc = lang === "en" ? tier.descEn : tier.desc;
                  return (
                    <div
                      key={tier.id}
                      className={`rounded-xl border p-3 transition-all ${
                        isActive
                          ? `${tier.color} shadow-[0_0_12px_rgba(255,255,255,0.02)]`
                          : "border-white/[0.04] bg-white/[0.01] opacity-35"
                      }`}
                    >
                      <span className="block font-bold text-[11px]">{tierLabel}</span>
                      <span className="block text-[8px] text-white/40 mt-0.5 font-sans leading-normal">{tierDesc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Channels, Active Formats & Focus Guidelines */}
        <div className="space-y-6">
          {/* Platforms & Formats Details */}
          <div className="glass p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Layers className="h-4 w-4 text-[#ffaa00]/60" /> {lang === "en" ? "Channels & Formats" : "Canales y Formatos"}
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {form.platforms.length === 0 ? (
                <p className="text-xs text-white/35 text-center py-6">
                  {lang === "en"
                    ? "No active channels. Go through Onboarding setup to configure active publishing channels."
                    : "No hay canales activos. Realiza el Onboarding para configurar tus canales activos."}
                </p>
              ) : (
                form.platforms.map((platformId) => {
                  const details = PLATFORM_DETAILS_MAP[platformId];
                  const pInfo = PLATFORMS.find(p => p.id === platformId);
                  if (!details || !pInfo) return null;

                  const formatsSelected = form.platformDetails[platformId]?.formats || [];

                  return (
                    <div key={platformId} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                        <pInfo.icon className="h-3.5 w-3.5 text-[#00ff88]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{pInfo.label}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-[#00d4ff] uppercase tracking-wider font-mono">{lang === "en" ? "Tact strategist guideline" : "Directriz estratégica de Tact"}</span>
                        <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                          {lang === "es" && PLATFORM_TRANSLATIONS[platformId]?.focus
                            ? PLATFORM_TRANSLATIONS[platformId].focus
                            : details.focus}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider font-mono">{lang === "en" ? "Active Formats" : "Formatos Activos"}</span>
                        <div className="flex flex-wrap gap-1">
                          {details.formats.map((fmt) => {
                            const isFmtActive = formatsSelected.includes(fmt.id);
                            const localizedFmtLabel = lang === "es" && PLATFORM_TRANSLATIONS[platformId]?.formats[fmt.id]
                              ? PLATFORM_TRANSLATIONS[platformId].formats[fmt.id]
                              : fmt.label;
                            return (
                              <button
                                key={fmt.id}
                                type="button"
                                onClick={() => togglePlatformFormat(platformId, fmt.id)}
                                className={`rounded px-2 py-1 text-[9px] font-mono border transition-all ${
                                  isFmtActive
                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400 font-bold"
                                    : "bg-white/[0.02] border-white/[0.04] text-white/30"
                                }`}
                              >
                                {localizedFmtLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Content Verticals */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Hash className="h-4 w-4 text-pink-400" /> {lang === "en" ? "Content Verticals" : "Verticales de Contenido"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {VERTICALS.map((v) => {
                const isActive = form.contentVerticals.includes(v.id);
                const localizedVLabel = lang === "es"
                  ? (v.id === "education" ? "Educación" : v.id === "curiosity" ? "Curiosidad" : v.id === "inspiration" ? "Inspiración" : v.id === "authority" ? "Autoridad" : v.id === "sale" ? "Ventas" : "Entretenimiento")
                  : v.label;
                return (
                  <button
                    key={v.id}
                    onClick={() => toggleArrayItem("contentVerticals", v.id)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold text-center transition-all duration-300 ${
                      isActive
                        ? "bg-pink-500/10 border-pink-500/25 text-pink-400"
                        : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
                    }`}
                  >
                    {localizedVLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Intelligence & Learning Card */}
      <div className="glass p-6 space-y-4 max-w-4xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
          <Sparkles className="h-4 w-4 text-purple-400" /> {t("brandMemoryIntelligence")}
        </h3>
        <p className="text-xs text-white/40 leading-relaxed">
          {lang === "en"
            ? "This repository acts as the long-term memory for Hermes. Hermes logs performance insights, campaign learnings, and target audience feedback here, keeping all content strategically aligned."
            : "Este repositorio actúa como la memoria a largo plazo para Hermes. Hermes registra perspectivas de rendimiento, aprendizajes de campaña y comentarios del público objetivo aquí, manteniendo todo el contenido estratégicamente al cien por ciento alineado."}
        </p>

        {/* Add Memory Form */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Log Strategy Override / Learning</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Insight Title (e.g. Reels peak hour)"
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
              className="glass-input h-9 text-xs"
            />
            <select
              value={newMemory.category}
              onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
              className="rounded-xl glass-select px-3 py-1.5 text-xs"
            >
              <option value="strategy">Strategy</option>
              <option value="audience">Audience Insight</option>
              <option value="performance">Performance</option>
              <option value="style">Style Guideline</option>
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="Describe the learning or context override..."
            value={newMemory.content}
            onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
            className="w-full rounded-xl glass-input px-3 py-2 text-xs outline-none resize-none"
          />
          <Button
            size="sm"
            onClick={handleAddMemory}
            disabled={addingMemory || !newMemory.title || !newMemory.content}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all duration-300 text-xs py-1"
          >
            Log Intelligence
          </Button>
        </div>

        {/* Memory items */}
        <div className="space-y-3 pt-2 max-h-[220px] overflow-y-auto pr-1">
          {loadingMemories ? (
            <p className="text-xs text-white/30 text-center py-4">Loading intelligence log...</p>
          ) : memories.length === 0 ? (
            <p className="text-xs text-white/30 text-center py-4">No intelligence logged yet. Hermes will automatically populate this as it works, or you can log insights manually.</p>
          ) : (
            memories.map((m) => (
              <div key={m.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono">{m.title}</h4>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {m.category}
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-sans">{m.content}</p>
                <p className="text-[9px] text-white/20 font-mono">
                  Logged: {m.created_at ? (m.created_at.seconds ? new Date(m.created_at.seconds * 1000).toLocaleDateString() : new Date(m.created_at).toLocaleDateString()) : "Just now"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Version History & Timeline Section */}
      <div className="glass p-6 space-y-5 max-w-4xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
          <History className="h-4 w-4 text-cyan-400 animate-spin-slow" /> Brand Version History & Rollbacks
        </h3>
        <p className="text-xs text-white/40 leading-relaxed">
          TACT records a full version snapshot every time guidelines are changed. Review past presets and roll back or restore previous brand states easily.
        </p>

        <div className="space-y-3 pt-1 max-h-[300px] overflow-y-auto pr-1">
          {loadingHistory ? (
            <p className="text-xs text-white/30 text-center py-4">Loading version history...</p>
          ) : historyList.length === 0 ? (
            <p className="text-xs text-white/30 text-center py-4">No historical versions archived yet. Your current setup will create the first history record on next save.</p>
          ) : (
            <div className="relative border-l border-white/[0.08] ml-3 pl-6 space-y-5">
              {historyList.map((ver, idx) => {
                const isSelected = selectedHistoryVer?.id === ver.id;
                const timestamp = ver.version_timestamp?.seconds
                  ? new Date(ver.version_timestamp.seconds * 1000).toLocaleString()
                  : ver.updated_at?.seconds
                    ? new Date(ver.updated_at.seconds * 1000).toLocaleString()
                    : "Unknown date";

                return (
                  <div key={ver.id} className="relative group">
                    {/* Timeline dot */}
                    <div className="absolute -left-9 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a1a] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform" />
                    
                    <div className="glass p-4 rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-wider uppercase">
                            Version {historyList.length - idx}
                          </span>
                          <span className="text-[10px] text-white/30 font-mono ml-3">
                            {timestamp}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedHistoryVer(isSelected ? null : ver)}
                            className="text-white/50 hover:text-white text-xs h-7 px-3 bg-white/[0.02] border border-white/[0.04] rounded-lg"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {isSelected ? "Hide details" : "View configuration"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRestore(ver.id)}
                            disabled={saving}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs h-7 px-3 rounded-lg"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restore guidelines
                          </Button>
                        </div>
                      </div>

                      {/* Expanded View past data */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fade-in">
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider block">Brand & Industry</span>
                            <p className="text-white font-bold">{ver.name}</p>
                            <p className="text-white/50 font-sans italic">{ver.industry}</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider block">Tone of Voice Guidelines</span>
                            <p className="text-white/60 leading-relaxed font-sans">{ver.tone_of_voice || ver.toneOfVoice || "—"}</p>
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider block">Channels & Formats active</span>
                            <div className="flex flex-wrap gap-1">
                              {(ver.platforms || []).map((pId: string) => (
                                <Badge key={pId} variant="outline" className="border-purple-500/20 bg-purple-500/5 text-purple-400 rounded text-[9px] font-mono">
                                  {pId}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
