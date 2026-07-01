"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  MessageSquare,
  Globe,
  Layers,
  Hash,
  Send,
  PenLine,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Award,
  ShoppingCart,
  Smile,
  Camera,
  Users,
  Video,
  Briefcase,
  Mail,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const XIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const STEPS = [
  { title: "Brand Basics", icon: Building2 },
  { title: "Target Audience", icon: Globe },
  { title: "Platforms & Formats", icon: Layers },
  { title: "Content Verticals", icon: Hash },
  { title: "Tone of Voice", icon: MessageSquare },
  { title: "Review & Audit", icon: Send },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera },
  { id: "facebook", label: "Facebook", icon: Users },
  { id: "tiktok", label: "TikTok", icon: Gamepad2 },
  { id: "youtube", label: "YouTube", icon: Video },
  { id: "blog", label: "Blog SEO", icon: PenLine },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase },
  { id: "threads", label: "Threads", icon: MessageSquare },
  { id: "x", label: "X.com", icon: XIcon },
  { id: "newsletter", label: "Newsletter", icon: Mail },
];

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

const REGIONS = [
  { id: "latam", label: "Latin America (LATAM)" },
  { id: "north_america", label: "North America" },
  { id: "europe", label: "Europe" },
  { id: "apac", label: "Asia-Pacific (APAC)" },
  { id: "middle_east", label: "Middle East" },
];

const COUNTRIES_BY_REGION: Record<string, { id: string; label: string }[]> = {
  latam: [
    { id: "Mexico", label: "México" },
    { id: "Colombia", label: "Colombia" },
    { id: "Argentina", label: "Argentina" },
    { id: "Chile", label: "Chile" },
    { id: "Peru", label: "Perú" },
  ],
  north_america: [
    { id: "United States", label: "United States" },
    { id: "Canada", label: "Canada" },
  ],
  europe: [
    { id: "Spain", label: "España" },
    { id: "United Kingdom", label: "United Kingdom" },
    { id: "Germany", label: "Germany" },
    { id: "France", label: "France" },
    { id: "Italy", label: "Italy" },
  ],
  apac: [
    { id: "Australia", label: "Australia" },
    { id: "India", label: "India" },
    { id: "Japan", label: "Japan" },
    { id: "Singapore", label: "Singapore" },
  ],
  middle_east: [
    { id: "UAE", label: "UAE" },
    { id: "Saudi Arabia", label: "Saudi Arabia" },
  ],
};

const VERTICALS = [
  { id: "education", label: "Education", icon: GraduationCap, color: "blue", desc: "Información educativa, tutoriales y guías útiles para resolver problemas.", example: "Post: '3 hacks para optimizar conversión en Shopify' o 'Cómo la tipografía afecta tus ventas.'" },
  { id: "curiosity", label: "Curiosity", icon: Lightbulb, color: "yellow", desc: "Datos curiosos, detrás de escenas y reflexiones fuera de lo común.", example: "Post: '¿Sabías que cambiar el color de este botón aumentó 20% los clics? Te explicamos el porqué.'" },
  { id: "inspiration", label: "Inspiration", icon: Award, color: "purple", desc: "Historias motivacionales, citas poderosas y casos de éxito que conectan con emociones.", example: "Post: 'El viaje de nuestra fundadora: de un garaje a diseñar joyas para celebridades.'" },
  { id: "authority", label: "Authority", icon: Building2, color: "green", desc: "Estadísticas, acreditaciones, certificaciones y por qué eres el experto ideal.", example: "Post: 'Nuestra metodología auditada que redujo tiempos de entrega a la mitad en 2025.'" },
  { id: "sale", label: "Sale", icon: ShoppingCart, color: "red", desc: "Ofertas directas, lanzamientos de producto y llamados a la acción comerciales claros.", example: "Post: 'Nuestra nueva colección PetJewels ya está disponible. 15% de descuento hoy.'" },
  { id: "entertainment", label: "Entertainment", icon: Smile, color: "pink", desc: "Meme marketing, tendencias, humor del nicho e interacciones divertidas.", example: "Post: 'Cuando tu perro te mira con cara de \"¿dónde está mi collar premium?\" [Meme]'" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [existingSlug, setExistingSlug] = useState("");
  const [generatingTone, setGeneratingTone] = useState(false);

  // Strategic AI Audit State
  const [auditing, setAuditing] = useState(false);
  const [auditRecommendations, setAuditRecommendations] = useState<any[]>([]);
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);
  const [excludedCountryInput, setExcludedCountryInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    industry: "",
    toneOfVoice: "",
    markets: [] as string[],
    platforms: [] as string[],
    contentVerticals: [] as string[],
    targetAudience: {
      genders: { men: 50, women: 50 },
      socioEconomic: { ab: 25, cplus: 25, c: 50, de: 0 },
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

    let socioEconomic = { ab: 25, cplus: 25, c: 50, de: 0 };
    if (ta && ta.socioEconomic) {
      if (typeof ta.socioEconomic === "object") {
        socioEconomic = {
          ab: ta.socioEconomic.ab ?? 25,
          cplus: ta.socioEconomic.cplus ?? 25,
          c: ta.socioEconomic.c ?? 50,
          de: ta.socioEconomic.de ?? 0
        };
      } else if (typeof ta.socioEconomic === "string") {
        if (ta.socioEconomic === "luxury") {
          socioEconomic = { ab: 80, cplus: 20, c: 0, de: 0 };
        } else if (ta.socioEconomic === "high") {
          socioEconomic = { ab: 30, cplus: 50, c: 20, de: 0 };
        } else if (ta.socioEconomic === "medium") {
          socioEconomic = { ab: 10, cplus: 20, c: 70, de: 0 };
        }
      }
    }

    const regions = ta?.regions || [];
    const countries = ta?.countries || ta?.markets || marketsFallback || [];
    const excludedCountries = ta?.excludedCountries || [];
    const generations = ta?.generations || [];

    return { genders, socioEconomic, regions, countries, excludedCountries, generations };
  };

  useEffect(() => {
    async function verifyAuthAndLoadBrand() {
      try {
        const authRes = await fetch("/api/auth/session");
        if (authRes.ok) {
          const authData = await authRes.json();
          if (!authData.authenticated) {
            router.push("/login");
            return;
          }
        } else {
          router.push("/login");
          return;
        }

        const brandRes = await fetch("/api/brands");
        if (brandRes.ok) {
          const brands = await brandRes.json();
          if (brands && brands.length > 0) {
            const b = brands[0];
            setIsEditing(true);
            setExistingSlug(b.slug);
            setForm({
              name: b.name || "",
              slug: b.slug || "",
              industry: b.industry || "",
              toneOfVoice: b.tone_of_voice || b.toneOfVoice || "",
              markets: b.markets || [],
              platforms: b.platforms || [],
              contentVerticals: b.content_verticals || b.contentVerticals || [],
              targetAudience: parseTargetAudience(b.target_audience || b.targetAudience, b.markets || []),
              platformDetails: b.platform_details || b.platformDetails || {}
            });
          }
        }
      } catch (err) {
        console.error("Auth check/brand loading failed:", err);
        router.push("/login");
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuthAndLoadBrand();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a1a] text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#00ff88]" />
          <p className="text-xs font-mono text-white/40">Securing workspace...</p>
        </div>
      </div>
    );
  }

  const updateForm = (patch: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const toggleArrayItem = (field: "markets" | "platforms" | "contentVerticals", item: string) => {
    if (field === "platforms") {
      const isCurrentlySelected = form.platforms.includes(item);
      const updatedPlatforms = isCurrentlySelected
        ? form.platforms.filter((p) => p !== item)
        : [...form.platforms, item];
      
      const updatedDetails = { ...form.platformDetails };
      if (!isCurrentlySelected) {
        const defaultFormats = PLATFORM_DETAILS_MAP[item]?.formats.map(f => f.id).slice(0, 2) || [];
        updatedDetails[item] = { formats: defaultFormats };
      } else {
        delete updatedDetails[item];
      }

      setForm((prev) => ({
        ...prev,
        platforms: updatedPlatforms,
        platformDetails: updatedDetails
      }));
    } else {
      updateForm({
        [field]: form[field].includes(item)
          ? form[field].filter((i) => i !== item)
          : [...form[field], item],
      });
    }
  };

  const toggleAudienceItem = (field: "generations" | "regions" | "countries" | "excludedCountries", value: string) => {
    setForm((prev) => {
      const current = prev.targetAudience[field] || [];
      const updated = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];
      return {
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          [field]: updated
        }
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

  const balanceSocioEconomic = () => {
    setForm((prev) => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        socioEconomic: { ab: 25, cplus: 25, c: 50, de: 0 }
      }
    }));
  };

  const handleAddExcludedCountry = () => {
    if (!excludedCountryInput.trim()) return;
    const value = excludedCountryInput.trim();
    if (!form.targetAudience.excludedCountries.includes(value)) {
      setForm((prev) => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          excludedCountries: [...prev.targetAudience.excludedCountries, value]
        }
      }));
    }
    setExcludedCountryInput("");
  };

  const handleRemoveExcludedCountry = (val: string) => {
    setForm((prev) => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        excludedCountries: prev.targetAudience.excludedCountries.filter(x => x !== val)
      }
    }));
  };

  const handleSuggestTone = async () => {
    if (!form.name || !form.industry) return;
    setGeneratingTone(true);
    try {
      const res = await fetch("/api/generate/tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: form.name,
          industry: form.industry,
          targetAudience: form.targetAudience,
          presets: ["divertido", "de lujo", "educativo", "profesional", "humorístico"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.toneOfVoice) {
          updateForm({ toneOfVoice: data.toneOfVoice });
        }
      }
    } catch (err) {
      console.error("Error generating tone:", err);
    } finally {
      setGeneratingTone(false);
    }
  };

  const handleAuditStrategy = async () => {
    setAuditing(true);
    setAuditRecommendations([]);
    setAppliedRecommendations([]);
    try {
      const res = await fetch("/api/generate/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          industry: form.industry,
          toneOfVoice: form.toneOfVoice,
          platforms: form.platforms,
          contentVerticals: form.contentVerticals,
          targetAudience: {
            ...form.targetAudience,
            markets: form.targetAudience.countries.length ? form.targetAudience.countries : form.targetAudience.regions
          },
          platformDetails: form.platformDetails
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendations) {
          setAuditRecommendations(data.recommendations);
          // Auto-select all recommendations by default
          setAppliedRecommendations(data.recommendations.map((r: any) => r.id));
        }
      }
    } catch (err) {
      console.error("AI Audit error:", err);
    } finally {
      setAuditing(false);
    }
  };

  const toggleRecommendation = (id: string) => {
    setAppliedRecommendations((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const applyAuditRecommendations = () => {
    let updatedTone = form.toneOfVoice;
    let updatedPlatforms = [...form.platforms];
    let updatedVerticals = [...form.contentVerticals];
    let updatedDetails = { ...form.platformDetails };

    auditRecommendations.forEach((rec) => {
      if (!appliedRecommendations.includes(rec.id)) return;

      if (rec.type === "tone" && rec.actionValue) {
        updatedTone = `${updatedTone} (AI Tune: ${rec.actionValue})`;
      } else if (rec.type === "platform" && rec.actionValue) {
        const pId = rec.actionValue.toLowerCase();
        if (!updatedPlatforms.includes(pId)) {
          updatedPlatforms.push(pId);
          const defaultFormats = PLATFORM_DETAILS_MAP[pId]?.formats.map(f => f.id).slice(0, 2) || [];
          updatedDetails[pId] = { formats: defaultFormats };
        }
      } else if (rec.type === "vertical" && rec.actionValue) {
        const vId = rec.actionValue.toLowerCase();
        if (!updatedVerticals.includes(vId)) {
          updatedVerticals.push(vId);
        }
      }
    });

    setForm((prev) => ({
      ...prev,
      toneOfVoice: updatedTone,
      platforms: updatedPlatforms,
      contentVerticals: updatedVerticals,
      platformDetails: updatedDetails
    }));

    // Reset audit so it doesn't prompt again unless requested
    setAuditRecommendations([]);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.name.trim().length > 0 && form.industry.trim().length > 0;
      case 1: // Target Audience: Need regions and generations
        return form.targetAudience.regions.length > 0 && form.targetAudience.generations.length > 0;
      case 2: // Platforms & Formats
        return form.platforms.length > 0;
      case 3: // Content Verticals
        return form.contentVerticals.length > 0;
      case 4: // Tone of Voice
        return form.toneOfVoice.trim().length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Sync markets array at the root level using countries list for backwards compatibility
      const marketsRoot = form.targetAudience.countries.length > 0
        ? form.targetAudience.countries
        : form.targetAudience.regions;

      const payload = {
        ...form,
        markets: marketsRoot,
        slug: form.slug || generateSlug(form.name),
      };

      const url = isEditing ? `/api/brands/${existingSlug}` : "/api/brands";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  // Get countries available for selected regions
  const getAvailableCountries = () => {
    const list: { id: string; label: string; region: string }[] = [];
    form.targetAudience.regions.forEach((regionId) => {
      const countries = COUNTRIES_BY_REGION[regionId] || [];
      countries.forEach((c) => {
        list.push({ ...c, region: regionId });
      });
    });
    return list;
  };

  const availableCountries = getAvailableCountries();

  const socioEconomicTotal = form.targetAudience.socioEconomic.ab +
    form.targetAudience.socioEconomic.cplus +
    form.targetAudience.socioEconomic.c +
    form.targetAudience.socioEconomic.de;

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 select-none">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] font-bold text-sm shadow-[0_0_24px_rgba(0,255,136,0.12)]">
              T
            </div>
            <span className="text-lg font-bold text-white heading-brutal">TACT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 heading-glow">
            {isEditing ? "Edit Brand Config" : "Set up your brand"}
          </h1>
          <p className="text-xs text-white/45 font-medium">
            {isEditing ? "Adjust your targets, platforms, and formats" : "Tell us about your brand to get personalized content"}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06] rounded-full mb-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-600 ease-out"
              style={{
                width: `${((step + 1) / STEPS.length) * 100}%`,
                background: "linear-gradient(90deg, #00ff88, #00d4ff)",
                boxShadow: "0 0 16px rgba(0,255,136,0.3)",
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 font-mono ${
                    i < step
                      ? "step-completed"
                      : i === step
                        ? "step-active"
                        : "step-pending"
                  }`}
                >
                  {i < step ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block w-6 lg:w-12 h-px mx-1 transition-all duration-300 ${
                      i < step
                        ? "bg-gradient-to-r from-[#00ff88]/50 to-[#00d4ff]/50"
                        : "bg-white/[0.06]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
              {STEPS[step].title}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="glass glass-accent-top p-7 sm:p-9">
          
          {/* Step 0: Brand Basics */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 heading-brutal">
                  Brand Basics
                </h2>
                <p className="text-xs text-white/40">
                  Start with your brand&apos;s core information
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block form-label mb-1.5">Brand Name *</label>
                  <Input
                    placeholder="e.g., TACT OS"
                    value={form.name}
                    onChange={(e) => {
                      updateForm({
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    className="glass-input h-10 text-xs"
                  />
                </div>
                <div>
                  <label className="block form-label mb-1.5">URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 font-mono">tact.app/</span>
                    <Input
                      placeholder="tact-os"
                      value={form.slug}
                      onChange={(e) => updateForm({ slug: e.target.value })}
                      className="glass-input h-10 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block form-label mb-1.5">Industry *</label>
                  <Input
                    placeholder="e.g., Digital Marketing"
                    value={form.industry}
                    onChange={(e) => updateForm({ industry: e.target.value })}
                    className="glass-input h-10 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Target Audience */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 heading-brutal">
                  Target Audience
                </h2>
                <p className="text-xs text-white/40">
                  Configure detailed target markets, exclusions, gender ratios, and income profiles
                </p>
              </div>

              {/* Regions Selector */}
              <div className="space-y-2">
                <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                  1. Target Regions *
                </span>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => {
                    const isSelected = form.targetAudience.regions.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleAudienceItem("regions", r.id)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
                          isSelected
                            ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:text-white"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Countries Selector (Drill-down) */}
              {form.targetAudience.regions.length > 0 && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                    2. Specific Countries (Optional)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableCountries.map((c) => {
                      const isSelected = form.targetAudience.countries.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleAudienceItem("countries", c.id)}
                          className={`rounded-lg border px-3 py-1.5 text-[10px] text-left font-medium transition-all ${
                            isSelected
                              ? "bg-[#00d4ff]/10 border-[#00d4ff]/25 text-[#00d4ff]"
                              : "bg-white/[0.01] border-white/[0.04] text-white/40 hover:text-white"
                          }`}
                        >
                          <span className="block font-bold">{c.label}</span>
                          <span className="block text-[8px] text-white/20 uppercase font-mono mt-0.5">{c.region}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Excluded Markets */}
              <div className="space-y-2">
                <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                  3. Exclude Markets / Countries
                </span>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Spain, Brazil, Asia"
                    value={excludedCountryInput}
                    onChange={(e) => setExcludedCountryInput(e.target.value)}
                    className="glass-input h-9 text-xs flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddExcludedCountry}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs h-9 px-4 font-bold"
                  >
                    Exclude
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.targetAudience.excludedCountries.map((ex) => (
                    <span
                      key={ex}
                      className="rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] text-red-400 font-mono font-bold flex items-center gap-1.5"
                    >
                      {ex}
                      <button
                        onClick={() => handleRemoveExcludedCountry(ex)}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Genders ratio slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">Gender distribution</span>
                  <span className="text-xs text-[#00ff88] font-mono font-bold">
                    {form.targetAudience.genders.men}% Men / {form.targetAudience.genders.women}% Women
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.targetAudience.genders.men}
                  onChange={(e) => {
                    const men = parseInt(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        genders: { men, women: 100 - men }
                      }
                    }));
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
                />
                <div className="flex justify-between text-[8px] text-white/30 font-mono">
                  <span>100% MEN</span>
                  <span>50/50 BALANCED</span>
                  <span>100% WOMEN</span>
                </div>
              </div>

              {/* Socio-economic split */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">Socio-Economic Split</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={balanceSocioEconomic}
                      className="text-[9px] font-mono text-purple-400 hover:text-purple-300 underline"
                    >
                      Reset default (Balanced)
                    </button>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      socioEconomicTotal === 100
                        ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      Total: {socioEconomicTotal}% (Requires 100%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "ab", label: "A/B (Luxury / High Class)", color: "#00ff88" },
                    { key: "cplus", label: "C+ (Premium / Upper Mid)", color: "#00d4ff" },
                    { key: "c", label: "C (Middle Class / Mass)", color: "#a855f7" },
                    { key: "de", label: "D/E (Low Cost / Lower Class)", color: "#f43f5e" },
                  ].map((tier) => (
                    <div key={tier.key} className="glass p-3 rounded-xl border border-white/[0.04] space-y-2">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-white/60">{tier.label}</span>
                        <span className="text-white font-bold">{(form.targetAudience.socioEconomic as any)[tier.key]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(form.targetAudience.socioEconomic as any)[tier.key]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setForm((prev) => ({
                            ...prev,
                            targetAudience: {
                              ...prev.targetAudience,
                              socioEconomic: {
                                ...prev.targetAudience.socioEconomic,
                                [tier.key]: val
                              }
                            }
                          }));
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Age generations */}
              <div className="space-y-3">
                <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                  Target Generations *
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "gen_z", label: "Gen Z", desc: "Ages 12-27" },
                    { id: "millennials", label: "Millennials", desc: "Ages 28-43" },
                    { id: "gen_x", label: "Gen X", desc: "Ages 44-59" },
                    { id: "boomers", label: "Boomers", desc: "Ages 60+" },
                  ].map((gen) => {
                    const isSelected = form.targetAudience.generations.includes(gen.id);
                    return (
                      <button
                        key={gen.id}
                        type="button"
                        onClick={() => toggleAudienceItem("generations", gen.id)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 text-center ${
                          isSelected
                            ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:text-white"
                        }`}
                      >
                        <span className="block font-bold">{gen.label}</span>
                        <span className="block text-[8px] text-white/20 mt-0.5">{gen.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Platforms & Formats */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 heading-brutal">
                  Platforms & Formats
                </h2>
                <p className="text-xs text-white/40">
                  Select your channels, choose formats, and view TACT best practices
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Platform selector */}
                <div className="space-y-3">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                    Select Channels *
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map((platform) => {
                      const isSelected = form.platforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => toggleArrayItem("platforms", platform.id)}
                          className={`flex items-center gap-2.5 rounded-xl border p-3.5 transition-all duration-300 text-left ${
                            isSelected
                              ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                              : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:text-white"
                          }`}
                        >
                          <platform.icon className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold">{platform.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Platform details */}
                <div className="space-y-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 max-h-[360px] overflow-y-auto pr-1">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                    Configure Formats & Focus
                  </span>

                  {form.platforms.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-10 font-sans">
                      Select at least one channel on the left to configure active formats.
                    </p>
                  ) : (
                    form.platforms.map((platformId) => {
                      const details = PLATFORM_DETAILS_MAP[platformId];
                      const platformInfo = PLATFORMS.find(p => p.id === platformId);
                      if (!details || !platformInfo) return null;

                      const selectedFormats = form.platformDetails[platformId]?.formats || [];

                      return (
                        <div key={platformId} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2.5">
                          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                            <platformInfo.icon className="h-3.5 w-3.5 text-[#00ff88]" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{platformInfo.label}</span>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[8px] font-bold text-[#00d4ff] uppercase tracking-wider font-mono">TACT Focus Guideline</span>
                            <p className="text-[10px] text-white/50 leading-relaxed font-sans">{details.focus}</p>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider font-mono">Active Formats</span>
                            <div className="flex flex-wrap gap-1">
                              {details.formats.map((fmt) => {
                                const isFormatSelected = selectedFormats.includes(fmt.id);
                                return (
                                  <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => togglePlatformFormat(platformId, fmt.id)}
                                    className={`rounded px-2 py-1 text-[9px] font-mono border transition-all ${
                                      isFormatSelected
                                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400 font-bold"
                                        : "bg-white/[0.02] border-white/[0.04] text-white/30 hover:text-white"
                                    }`}
                                  >
                                    {fmt.label}
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
            </div>
          )}

          {/* Step 3: Content Verticals */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 heading-brutal">
                  Content Verticals
                </h2>
                <p className="text-xs text-white/40">
                  Select your content verticals. We propose topics with examples matching your niche.
                </p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {VERTICALS.map((vertical) => {
                  const colorMap: Record<string, string> = {
                    blue: "border-[#00ff88]/20 bg-[#00ff88]/5 text-[#00ff88]",
                    yellow: "border-[#ffaa00]/20 bg-[#ffaa00]/5 text-[#ffaa00]",
                    purple: "border-purple-500/20 bg-purple-500/5 text-purple-400",
                    green: "border-[#00cc6a]/20 bg-[#00cc6a]/5 text-[#00cc6a]",
                    red: "border-[#ff3366]/20 bg-[#ff3366]/5 text-[#ff3366]",
                    pink: "border-pink-500/20 bg-pink-500/5 text-pink-400",
                  };
                  const isActive = form.contentVerticals.includes(vertical.id);
                  return (
                    <button
                      key={vertical.id}
                      type="button"
                      onClick={() => toggleArrayItem("contentVerticals", vertical.id)}
                      className={`w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-300 ${
                        isActive
                          ? `${colorMap[vertical.color]} shadow-[0_0_16px_rgba(0,0,0,0.2)]`
                          : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:text-white"
                      }`}
                    >
                      <vertical.icon className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-white">{vertical.label}</span>
                        <p className="text-[10px] text-white/40 leading-relaxed font-sans">{vertical.desc}</p>
                        <p className="text-[9px] text-[#00d4ff] font-mono italic">{vertical.example}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Tone of Voice */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 heading-brutal">
                  Tone of Voice
                </h2>
                <p className="text-xs text-white/40">
                  How should TACT write? Generate tone suggested by AI based on targets.
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block form-label text-xs">Voice persona guidelines *</label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggestTone}
                    disabled={generatingTone || !form.name || !form.industry}
                    className="border-[#00ff88]/20 bg-[#00ff88]/5 text-[#00ff88] hover:bg-[#00ff88]/10 text-xs gap-2 font-mono h-8 rounded-xl transition-all duration-300"
                  >
                    {generatingTone ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    IA Tone Suggestor
                  </Button>
                </div>
                <textarea
                  rows={5}
                  placeholder="e.g., Cercano, juguetón y premium. Explicamos temas complejos con metáforas simples y humor inteligente. Hablamos en español directo a profesionales..."
                  value={form.toneOfVoice}
                  onChange={(e) => updateForm({ toneOfVoice: e.target.value })}
                  className="w-full rounded-xl glass-input px-4 py-3 text-xs outline-none resize-none"
                />
              </div>
              <div>
                <p className="text-[9px] text-white/30 mb-2.5 font-semibold font-mono uppercase tracking-[0.12em]">
                  Quick tone tags (Click to append)
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Divertido y fresco",
                    "Elite de lujo",
                    "Humorístico e irónico",
                    "Altamente educativo",
                    "Formal profesional",
                    "Directo al grano",
                    "Inspiracional emotivo",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        updateForm({
                          toneOfVoice: form.toneOfVoice
                            ? form.toneOfVoice + ", " + preset.toLowerCase()
                            : preset.toLowerCase(),
                        })
                      }
                      className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-white/45 hover:text-[#00ff88] hover:border-[#00ff88]/20 hover:bg-[#00ff88]/5 transition-all duration-300"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & AI Audit */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 heading-brutal">
                  Review & AI Strategy Audit
                </h2>
                <p className="text-xs text-white/40">
                  Review your setup or request a critique from TACT Strategy Consultant to optimize settings
                </p>
              </div>

              {/* AI Strategic Audit Box */}
              <div className="rounded-2xl border border-[#00ff88]/15 bg-[#00ff88]/5 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#00ff88] animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">IA Strategy Audit Challenge</span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAuditStrategy}
                    disabled={auditing}
                    className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold text-xs h-8 px-4 rounded-xl shadow-[0_0_12px_rgba(0,255,136,0.15)]"
                  >
                    {auditing ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    ) : (
                      "Audit Configuration"
                    )}
                  </Button>
                </div>

                {auditRecommendations.length > 0 ? (
                  <div className="space-y-3.5 pt-2 animate-fade-in">
                    <p className="text-[10px] text-white/50 font-sans italic">
                      TACT Chief Strategist analyzed your settings and challenges your setup with these actions:
                    </p>
                    <div className="space-y-2.5">
                      {auditRecommendations.map((rec) => {
                        const isChecked = appliedRecommendations.includes(rec.id);
                        return (
                          <div
                            key={rec.id}
                            onClick={() => toggleRecommendation(rec.id)}
                            className={`rounded-xl border p-3.5 cursor-pointer text-left transition-all ${
                              isChecked
                                ? "bg-purple-500/10 border-purple-500/25"
                                : "bg-white/[0.01] border-white/[0.04] opacity-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                                isChecked ? "bg-purple-500 border-purple-400 text-white" : "border-white/20"
                              }`}>
                                {isChecked && <Check className="h-2.5 w-2.5" />}
                              </div>
                              <span className="text-xs font-bold text-white">{rec.title}</span>
                            </div>
                            <p className="text-[10px] text-white/50 mt-1 pl-6.5 font-sans leading-relaxed">
                              {rec.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      onClick={applyAuditRecommendations}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs py-2 rounded-xl"
                    >
                      Apply Checked Audit Adjustments
                    </Button>
                  </div>
                ) : (
                  <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                    Press &quot;Audit Configuration&quot; to review for audience-channel inconsistencies, target splits, and tone guidelines.
                  </p>
                )}
              </div>

              {/* Form Review Summary */}
              <div className="space-y-4 pt-1 text-xs">
                <ReviewSection title="Brand Details">
                  <p className="text-white font-bold text-xs">{form.name || "—"}</p>
                  <p className="text-[11px] text-white/40 font-mono">
                    {form.industry} · tact.app/{form.slug || generateSlug(form.name)}
                  </p>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />
                
                <ReviewSection title="Target Audience">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-white/30">Regions:</span> {form.targetAudience.regions.join(", ")}
                    </div>
                    <div>
                      <span className="text-white/30">Countries:</span> {form.targetAudience.countries.join(", ") || "None (Region Focus)"}
                    </div>
                    <div>
                      <span className="text-white/30">Gender:</span> {form.targetAudience.genders.men}% Men / {form.targetAudience.genders.women}% Women
                    </div>
                    <div>
                      <span className="text-white/30">Generations:</span> {form.targetAudience.generations.join(", ")}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-white/30">Exclusions:</span> {form.targetAudience.excludedCountries.join(", ") || "None"}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-white/30">Socio-Economic:</span> A/B (Luxury) {form.targetAudience.socioEconomic.ab}%, C+ (Premium) {form.targetAudience.socioEconomic.cplus}%, C (Mass) {form.targetAudience.socioEconomic.c}%, D/E (Low) {form.targetAudience.socioEconomic.de}%
                    </div>
                  </div>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />

                <ReviewSection title="Platforms & Formats">
                  <div className="space-y-2">
                    {form.platforms.map((platformId) => {
                      const formats = form.platformDetails[platformId]?.formats || [];
                      return (
                        <div key={platformId} className="flex items-center gap-2 text-[11px]">
                          <span className="rounded bg-[#00ff88]/10 px-2 py-0.5 text-[#00ff88] uppercase font-mono font-bold">
                            {platformId}
                          </span>
                          <span className="text-white/50">
                            Formats: {formats.join(", ") || "None selected"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />

                <ReviewSection title="Content Verticals">
                  <div className="flex flex-wrap gap-1">
                    {form.contentVerticals.map((v) => (
                      <span
                        key={v}
                        className="rounded bg-purple-500/10 px-2 py-0.5 text-purple-400 font-mono text-[10px]"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />

                <ReviewSection title="Tone of Voice Guidelines">
                  <p className="text-[11px] text-white/60 leading-relaxed italic">{form.toneOfVoice || "—"}</p>
                </ReviewSection>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="text-white/35 hover:text-white/70 disabled:opacity-20 transition-all duration-300 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed() || (step === 1 && socioEconomicTotal !== 100)}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 glow-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.15)] rounded-xl text-xs"
            >
              Continue
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300 glow-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.15)] rounded-xl text-xs"
            >
              {submitting ? (
                "Saving config..."
              ) : (
                <>
                  {isEditing ? "Save & Return" : "Launch TACT"}
                  <Send className="h-3.5 w-3.5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-1.5 font-mono">
        {title}
      </p>
      {children}
    </div>
  );
}
