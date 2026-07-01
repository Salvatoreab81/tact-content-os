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
  AlertTriangle,
  Info,
  AlertCircle,
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
  { id: "education", label: "Education", icon: GraduationCap, color: "blue", desc: "Educational information, tutorials, and helpful guides to solve specific problems.", example: "Post: '3 Shopify conversion hacks' or 'How typography affects your sales.'" },
  { id: "curiosity", label: "Curiosity", icon: Lightbulb, color: "yellow", desc: "Fun facts, behind-the-scenes insights, and out-of-the-box reflections.", example: "Post: 'Did you know changing this button color boosted clicks by 20%? Here is why.'" },
  { id: "inspiration", label: "Inspiration", icon: Award, color: "purple", desc: "Motivational stories, powerful quotes, and success cases connecting with user emotions.", example: "Post: 'Our founder's journey: from a garage to designing custom jewelry for celebrities.'" },
  { id: "authority", label: "Authority", icon: Building2, color: "green", desc: "Statistics, credentials, certifications, and why you are the ideal industry expert.", example: "Post: 'Our audited workflow that cut delivery times in half in 2025.'" },
  { id: "sale", label: "Sale", icon: ShoppingCart, color: "red", desc: "Direct offers, product launches, and clear commercial calls to action.", example: "Post: 'Our new PetJewels collection is finally here. Get 15% off today only!'" },
  { id: "entertainment", label: "Entertainment", icon: Smile, color: "pink", desc: "Meme marketing, industry humor, and lighthearted interactions.", example: "Post: 'When your dog gives you that look because they don't have their premium collar yet [Meme]'" },
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

const VERTICALS_TRANSLATIONS: Record<string, { desc: string; example: string }> = {
  education: {
    desc: "Información educativa, tutoriales y guías útiles para resolver problemas.",
    example: "Post: '3 hacks para optimizar conversión en Shopify' o 'Cómo la tipografía afecta tus ventas.'"
  },
  curiosity: {
    desc: "Datos curiosos, detrás de escenas y reflexiones fuera de lo común.",
    example: "Post: '¿Sabías que cambiar el color de este botón aumentó 20% los clics? Te explicamos el porqué.'"
  },
  inspiration: {
    desc: "Historias motivacionales, citas poderosas y casos de éxito que conectan con emociones.",
    example: "Post: 'El viaje de nuestra fundadora: de un garaje a diseñar joyas para celebridades.'"
  },
  authority: {
    desc: "Estadísticas, acreditaciones, certificaciones y por qué eres el experto ideal.",
    example: "Post: 'Nuestra metodología auditada que redujo tiempos de entrega a la mitad en 2025.'"
  },
  sale: {
    desc: "Ofertas directas, lanzamientos de producto y llamados a la acción comerciales claros.",
    example: "Post: 'Nuestra nueva colección PetJewels ya está disponible. 15% de descuento hoy.'"
  },
  entertainment: {
    desc: "Meme marketing, tendencias, humor del nicho e interacciones divertidas.",
    example: "Post: 'Cuando tu perro te mira con cara de \"¿dónde está mi collar premium?\" [Meme]'"
  }
};

const TRANSLATIONS = {
  en: {
    editBrandConfig: "Edit Brand Config",
    setUpBrand: "Set up your brand",
    adjustTargets: "Adjust your targets, platforms, and formats",
    tellUsBrand: "Tell us about your brand to get personalized content",
    step: "Step",
    of: "of",
    // Step 0: Basics
    brandBasics: "Brand Basics",
    startBasics: "Start with your brand's core information",
    brandName: "Brand Name *",
    urlSlug: "URL Slug",
    industry: "Industry *",
    // Step 1: Target Audience
    targetAudience: "Target Audience",
    configureTargets: "Configure detailed target markets, exclusions, gender ratios, and income profiles",
    targetRegions: "1. Target Regions *",
    specificCountries: "2. Specific Countries (Optional)",
    excludeMarkets: "3. Exclude Markets / Countries",
    genderDistribution: "Gender distribution",
    men: "Men",
    women: "Women",
    socioEconomicFocus: "Socio-Economic Focus",
    selectAll: "Select All (Wide Target)",
    targetGenerations: "Target Generations *",
    // Step 2: Platforms & Formats
    platformsFormats: "Platforms & Formats",
    selectChannels: "Select Channels *",
    configureFormats: "Configure Formats & Focus",
    activeFormats: "Active Formats",
    tactFocusGuideline: "TACT Focus Guideline",
    // Step 3: Content Verticals
    contentVerticals: "Content Verticals",
    defineMix: "Define your content mix (Select 2-4 primary topics)",
    primaryTopics: "Primary Topics",
    examplePost: "Example Post",
    // Step 4: Tone of Voice
    toneOfVoice: "Tone of Voice",
    brandPersona: "Describe your brand's voice and personality guidelines",
    iaToneSuggestor: "AI Tone Suggestor",
    quickToneTags: "Quick tone tags (Click to append)",
    // Step 5: Review
    reviewAudit: "Review & AI Strategy Audit",
    reviewSetup: "Review your setup or request a critique from TACT Strategy Consultant to optimize settings",
    aiAuditChallenge: "AI Strategy Audit Challenge",
    auditConfiguration: "Audit Configuration",
    auditing: "Auditing...",
    applyChecked: "Apply Checked Audit Adjustments",
    pressAudit: "Press \"Audit Configuration\" to review for audience-channel inconsistencies, target splits, and tone guidelines.",
    // Navigation
    back: "Back",
    continue: "Continue",
    savingConfig: "Saving config...",
    saveReturn: "Save & Return",
    launchTact: "Launch TACT",
  },
  es: {
    editBrandConfig: "Editar Configuración de Marca",
    setUpBrand: "Configura tu marca",
    adjustTargets: "Ajusta tus objetivos, plataformas y formatos",
    tellUsBrand: "Cuéntanos sobre tu marca para recibir contenido personalizado",
    step: "Paso",
    of: "de",
    // Step 0: Basics
    brandBasics: "Datos Básicos de Marca",
    startBasics: "Comienza con la información principal de tu marca",
    brandName: "Nombre de la Marca *",
    urlSlug: "Slug de URL",
    industry: "Industria *",
    // Step 1: Target Audience
    targetAudience: "Audiencia Objetivo",
    configureTargets: "Configura mercados objetivos, exclusiones, géneros y nivel socioeconómico",
    targetRegions: "1. Regiones Objetivo *",
    specificCountries: "2. Países Específicos (Opcional)",
    excludeMarkets: "3. Excluir Mercados / Países",
    genderDistribution: "Distribución de Género",
    men: "Hombres",
    women: "Mujeres",
    socioEconomicFocus: "Enfoque Socioeconómico",
    selectAll: "Seleccionar Todos (Objetivo Amplio)",
    targetGenerations: "Generaciones Objetivo *",
    // Step 2: Platforms & Formats
    platformsFormats: "Plataformas y Formatos",
    selectChannels: "Seleccionar Canales *",
    configureFormats: "Configurar Formatos y Enfoque",
    activeFormats: "Formatos Activos",
    tactFocusGuideline: "Pauta de Enfoque TACT",
    // Step 3: Content Verticals
    contentVerticals: "Verticales de Contenido",
    defineMix: "Define tu mezcla de contenido (Selecciona de 2 a 4 temas primarios)",
    primaryTopics: "Temas Primarios",
    examplePost: "Ejemplo de Publicación",
    // Step 4: Tone of Voice
    toneOfVoice: "Tono de Voz",
    brandPersona: "Describe la personalidad y el tono de voz de tu marca",
    iaToneSuggestor: "Sugeridor de Tono IA",
    quickToneTags: "Etiquetas de tono rápido (Click para agregar)",
    // Step 5: Review
    reviewAudit: "Revisión y Auditoría Estratégica IA",
    reviewSetup: "Revisa tu configuración o solicita una crítica del Consultor de Estrategia TACT para optimizar",
    aiAuditChallenge: "Reto de Auditoría Estratégica IA",
    auditConfiguration: "Auditar Configuración",
    auditing: "Auditando...",
    applyChecked: "Aplicar Ajustes Auditados Seleccionados",
    pressAudit: "Presiona \"Auditar Configuración\" para analizar inconsistencias entre audiencias y canales, splits y tono.",
    // Navigation
    back: "Atrás",
    continue: "Continuar",
    savingConfig: "Guardando configuración...",
    saveReturn: "Guardar y Regresar",
    launchTact: "Lanzar TACT",
  }
};

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
  const [auditError, setAuditError] = useState("");
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
        socioEconomic: ["ab", "cplus", "c", "de"]
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
    setAuditError("");
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
        if (data.recommendations && data.recommendations.length > 0) {
          setAuditRecommendations(data.recommendations);
          // Auto-select all recommendations by default
          setAppliedRecommendations(data.recommendations.map((r: any) => r.id));
        } else {
          setAuditError("No se encontraron sugerencias. ¡Tu configuración actual parece sólida!");
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setAuditError(errData.error || "Fallo al comunicar con la IA de TACT. Intente de nuevo.");
      }
    } catch (err: any) {
      console.error("AI Audit error:", err);
      setAuditError(err.message || "Error de red al conectar con el servicio.");
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
        const errorData = await res.json().catch(() => ({}));
        console.error("Save failed:", errorData.error);
        alert(`Error al guardar configuración: ${errorData.error || "Error interno del servidor"}`);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`Error de red al guardar: ${err.message}`);
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

  const stepsList = STEPS.map((s, i) => {
    const titles = [
      lang === "en" ? "Brand Basics" : "Datos de Marca",
      lang === "en" ? "Target Audience" : "Audiencia Objetivo",
      lang === "en" ? "Platforms & Formats" : "Plataformas y Formatos",
      lang === "en" ? "Content Verticals" : "Verticales de Contenido",
      lang === "en" ? "Tone of Voice" : "Tono de Voz",
      lang === "en" ? "Review & Audit" : "Revisión y Auditoría"
    ];
    return { ...s, title: titles[i] };
  });

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 select-none">
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
              <Check className="h-3.5 w-3.5" />
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
            {isEditing ? t("editBrandConfig") : t("setUpBrand")}
          </h1>
          <p className="text-xs text-white/45 font-medium">
            {isEditing ? t("adjustTargets") : t("tellUsBrand")}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06] rounded-full mb-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-600 ease-out"
              style={{
                width: `${((step + 1) / stepsList.length) * 100}%`,
                background: "linear-gradient(90deg, #00ff88, #00d4ff)",
                boxShadow: "0 0 16px rgba(0,255,136,0.3)",
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-4">
            {stepsList.map((s, i) => (
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
                {i < stepsList.length - 1 && (
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
              {t("step")} {step + 1} {t("of")} {stepsList.length}
            </span>
            <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
              {stepsList[step].title}
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
                  {t("brandBasics")}
                </h2>
                <p className="text-xs text-white/40">
                  {t("startBasics")}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block form-label mb-1.5">{t("brandName")}</label>
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
                  <label className="block form-label mb-1.5">{t("urlSlug")}</label>
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
                  <label className="block form-label mb-1.5">{t("industry")}</label>
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
                  {t("targetAudience")}
                </h2>
                <p className="text-xs text-white/40">
                  {t("configureTargets")}
                </p>
              </div>

              {/* Regions Selector */}
              <div className="space-y-2">
                <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                  {t("targetRegions")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => {
                    const isSelected = form.targetAudience.regions.includes(r.id);
                    const regionLabel = lang === "es" ? (r.id === "latam" ? "América Latina" : r.id === "north_america" ? "Norteamérica" : r.id === "europe" ? "Europa" : r.id === "apac" ? "Asia-Pacífico" : "Medio Oriente") : r.label;
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
                        {regionLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Countries Selector (Drill-down) */}
              {form.targetAudience.regions.length > 0 && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                    {t("specificCountries")}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableCountries.map((c) => {
                      const isSelected = form.targetAudience.countries.includes(c.id);
                      const countryLabel = lang === "es" ? (c.id === "United States" ? "Estados Unidos" : c.id === "United Kingdom" ? "Reino Unido" : c.label) : c.label;
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
                          <span className="block font-bold">{countryLabel}</span>
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
                  {t("excludeMarkets")}
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
                    {lang === "en" ? "Exclude" : "Excluir"}
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
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">{t("genderDistribution")}</span>
                  <span className="text-xs text-[#00ff88] font-mono font-bold">
                    {form.targetAudience.genders.men}% {lang === "en" ? "Men" : "Hombres"} / {form.targetAudience.genders.women}% {lang === "en" ? "Women" : "Mujeres"}
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
                  <span>100% {lang === "en" ? "MEN" : "HOMBRES"}</span>
                  <span>50/50 {lang === "en" ? "BALANCED" : "EQUILIBRADO"}</span>
                  <span>100% {lang === "en" ? "WOMEN" : "MUJERES"}</span>
                </div>
              </div>

              {/* Socio-economic select */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">{t("socioEconomicFocus")}</span>
                  <button
                    type="button"
                    onClick={balanceSocioEconomic}
                    className="text-[9px] font-mono text-purple-400 hover:text-purple-300 underline"
                  >
                    {t("selectAll")}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "ab", label: "A/B (Luxury / Alto)", labelEn: "A/B (Luxury / High)", desc: "Consumidores de lujo y alto nivel adquisitivo", descEn: "Luxury and high purchasing power consumers" },
                    { id: "cplus", label: "C+ (Premium)", labelEn: "C+ (Premium)", desc: "Clase media alta con preferencia por lo premium", descEn: "Upper middle class with premium preference" },
                    { id: "c", label: "C (Clase Media)", labelEn: "C (Middle Class)", desc: "Mercado masivo con foco en relación calidad-precio", descEn: "Mass market focused on quality-price value" },
                    { id: "de", label: "D/E (Bajo Costo)", labelEn: "D/E (Low Cost)", desc: "Consumidores con presupuesto muy ajustado", descEn: "Consumers with very tight budgets" },
                  ].map((tier) => {
                    const isSelected = form.targetAudience.socioEconomic.includes(tier.id);
                    const tierLabel = lang === "en" ? tier.labelEn : tier.label;
                    const tierDesc = lang === "en" ? tier.descEn : tier.desc;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          const current = form.targetAudience.socioEconomic;
                          const updated = current.includes(tier.id)
                            ? current.filter((t) => t !== tier.id)
                            : [...current, tier.id];
                          setForm((prev) => ({
                            ...prev,
                            targetAudience: {
                              ...prev.targetAudience,
                              socioEconomic: updated
                            }
                          }));
                        }}
                        className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                          isSelected
                            ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400"
                            : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:text-white"
                        }`}
                      >
                        <span className="block font-bold text-xs">{tierLabel}</span>
                        <span className="block text-[9px] text-white/30 mt-1 leading-normal font-sans">{tierDesc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age generations */}
              <div className="space-y-3">
                <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                  {t("targetGenerations")}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "gen_z", label: "Gen Z", desc: "Ages 12-27" },
                    { id: "millennials", label: "Millennials", desc: "Ages 28-43" },
                    { id: "gen_x", label: "Gen X", desc: "Ages 44-59" },
                    { id: "boomers", label: "Boomers", desc: "Ages 60+" },
                  ].map((gen) => {
                    const isSelected = form.targetAudience.generations.includes(gen.id);
                    const genDesc = lang === "es" ? gen.desc.replace("Ages", "Edades") : gen.desc;
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
                        <span className="block text-[8px] text-white/20 mt-0.5">{genDesc}</span>
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
                  {t("platformsFormats")}
                </h2>
                <p className="text-xs text-white/40">
                  {lang === "en"
                    ? "Select your channels, choose formats, and view TACT best practices"
                    : "Selecciona tus canales, elige formatos y ve las mejores prácticas de TACT"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Platform selector */}
                <div className="space-y-3">
                  <span className="text-[9px] text-white/30 font-semibold font-mono uppercase tracking-[0.15em]">
                    {t("selectChannels")}
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
                    {t("configureFormats")}
                  </span>

                  {form.platforms.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-10 font-sans">
                      {lang === "en"
                        ? "Select at least one channel on the left to configure active formats."
                        : "Selecciona al menos un canal a la izquierda para configurar formatos activos."}
                    </p>
                  ) : (
                    form.platforms.map((platformId) => {
                      const details = PLATFORM_DETAILS_MAP[platformId];
                      const platformInfo = PLATFORMS.find(p => p.id === platformId);
                      if (!details || !platformInfo) return null;

                      const selectedFormats = form.platformDetails[platformId]?.formats || [];
                      const localizedFocus = lang === "es" && PLATFORM_TRANSLATIONS[platformId]?.focus
                        ? PLATFORM_TRANSLATIONS[platformId].focus
                        : details.focus;

                      return (
                        <div key={platformId} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2.5">
                          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                            <platformInfo.icon className="h-3.5 w-3.5 text-[#00ff88]" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{platformInfo.label}</span>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[8px] font-bold text-[#00d4ff] uppercase tracking-wider font-mono">{t("tactFocusGuideline")}</span>
                            <p className="text-[10px] text-white/50 leading-relaxed font-sans">{localizedFocus}</p>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider font-mono">{t("activeFormats")}</span>
                            <div className="flex flex-wrap gap-1">
                              {details.formats.map((fmt) => {
                                const isFormatSelected = selectedFormats.includes(fmt.id);
                                const localizedLabel = lang === "es" && PLATFORM_TRANSLATIONS[platformId]?.formats[fmt.id]
                                  ? PLATFORM_TRANSLATIONS[platformId].formats[fmt.id]
                                  : fmt.label;
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
                                    {localizedLabel}
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
                  {t("contentVerticals")}
                </h2>
                <p className="text-xs text-white/40">
                  {lang === "en"
                    ? "Select your content verticals. We propose topics with examples matching your niche."
                    : "Selecciona tus verticales de contenido. Proponemos temas con ejemplos adaptados a tu nicho."}
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
                  const localizedDesc = lang === "es" && VERTICALS_TRANSLATIONS[vertical.id]?.desc
                    ? VERTICALS_TRANSLATIONS[vertical.id].desc
                    : vertical.desc;
                  const localizedExample = lang === "es" && VERTICALS_TRANSLATIONS[vertical.id]?.example
                    ? VERTICALS_TRANSLATIONS[vertical.id].example
                    : vertical.example;
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
                        <p className="text-[10px] text-white/40 leading-relaxed font-sans">{localizedDesc}</p>
                        <p className="text-[9px] text-[#00d4ff] font-mono italic">{localizedExample}</p>
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
                  {t("toneOfVoice")}
                </h2>
                <p className="text-xs text-white/40">
                  {lang === "en"
                    ? "How should TACT write? Generate tone suggested by AI based on targets."
                    : "¿Cómo debería escribir TACT? Genera el tono de voz sugerido por la IA."}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block form-label text-xs">
                    {lang === "en" ? "Voice persona guidelines *" : "Pautas de personalidad de voz *"}
                  </label>
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
                    {t("iaToneSuggestor")}
                  </Button>
                </div>
                <textarea
                  rows={5}
                  placeholder={
                    lang === "en"
                      ? "e.g., Casual, educational, and direct. We explain complex technical details with simple metaphors and smart humor. We speak directly to professionals..."
                      : "ej., Cercano, juguetón y premium. Explicamos temas complejos con metáforas simples y humor inteligente. Hablamos directo a profesionales..."
                  }
                  value={form.toneOfVoice}
                  onChange={(e) => updateForm({ toneOfVoice: e.target.value })}
                  className="w-full rounded-xl glass-input px-4 py-3 text-xs outline-none resize-none"
                />
              </div>
              <div>
                <p className="text-[9px] text-white/30 mb-2.5 font-semibold font-mono uppercase tracking-[0.12em]">
                  {t("quickToneTags")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(lang === "en" ? [
                    "Playful and fresh",
                    "Luxury elite",
                    "Humorous and ironic",
                    "Highly educational",
                    "Formal professional",
                    "Direct to the point",
                    "Emotional inspirational"
                  ] : [
                    "Divertido y fresco",
                    "Elite de lujo",
                    "Humorístico e irónico",
                    "Altamente educativo",
                    "Formal profesional",
                    "Directo al grano",
                    "Inspiracional emotivo"
                  ]).map((preset) => (
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
                  {t("reviewAudit")}
                </h2>
                <p className="text-xs text-white/40">
                  {t("reviewSetup")}
                </p>
              </div>

              {/* AI Strategic Audit Box */}
              <div className="rounded-2xl border border-[#00ff88]/15 bg-[#00ff88]/5 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#00ff88] animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t("aiAuditChallenge")}</span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAuditStrategy}
                    disabled={auditing}
                    className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold text-xs h-8 px-4 rounded-xl shadow-[0_0_12px_rgba(0,255,136,0.15)]"
                  >
                    {auditing ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t("auditing")}
                      </span>
                    ) : (
                      t("auditConfiguration")
                    )}
                  </Button>
                </div>

                {auditError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 font-mono">
                    {lang === "en" ? "Audit error:" : "Error al auditar:"} {auditError}
                  </div>
                )}

                {auditRecommendations.length > 0 ? (
                  <div className="space-y-3.5 pt-2 animate-fade-in">
                    <p className="text-[10px] text-white/50 font-sans italic">
                      {lang === "en"
                        ? "TACT Chief Strategist analyzed your settings and challenges your setup with these actions:"
                        : "El estratega jefe de TACT analizó tu configuración y te desafía con estas acciones:"}
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
                      {lang === "en" ? "Apply Checked Audit Adjustments" : "Aplicar Ajustes Auditados Seleccionados"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                    {t("pressAudit")}
                  </p>
                )}
              </div>

              {/* Form Review Summary */}
              <div className="space-y-4 pt-1 text-xs">
                <ReviewSection title={lang === "en" ? "Brand Details" : "Detalles de Marca"}>
                  <p className="text-white font-bold text-xs">{form.name || "—"}</p>
                  <p className="text-[11px] text-white/40 font-mono">
                    {form.industry} · tact.app/{form.slug || generateSlug(form.name)}
                  </p>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />
                
                <ReviewSection title={lang === "en" ? "Target Audience" : "Audiencia Objetivo"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-white/30">{lang === "en" ? "Regions:" : "Regiones:"}</span> {form.targetAudience.regions.join(", ")}
                    </div>
                    <div>
                      <span className="text-white/30">{lang === "en" ? "Countries:" : "Países:"}</span> {form.targetAudience.countries.join(", ") || (lang === "en" ? "None (Region Focus)" : "Ninguno (Enfoque Regional)")}
                    </div>
                    <div>
                      <span className="text-white/30">{lang === "en" ? "Gender:" : "Género:"}</span> {form.targetAudience.genders.men}% {lang === "en" ? "Men" : "Hombres"} / {form.targetAudience.genders.women}% {lang === "en" ? "Women" : "Mujeres"}
                    </div>
                    <div>
                      <span className="text-white/30">{lang === "en" ? "Generations:" : "Generaciones:"}</span> {form.targetAudience.generations.map(g => g.replace("_", " ")).join(", ")}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-white/30">{lang === "en" ? "Exclusions:" : "Exclusiones:"}</span> {form.targetAudience.excludedCountries.join(", ") || (lang === "en" ? "None" : "Ninguno")}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-white/30">{lang === "en" ? "Socio-Economic Focus:" : "Nivel Socioeconómico:"}</span>{" "}
                      <span className="text-white font-bold capitalize">
                        {form.targetAudience.socioEconomic.join(", ") || (lang === "en" ? "All" : "Todos")}
                      </span>
                    </div>
                  </div>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />

                <ReviewSection title={lang === "en" ? "Platforms & Formats" : "Plataformas y Formatos"}>
                  <div className="space-y-2">
                    {form.platforms.map((platformId) => {
                      const formats = form.platformDetails[platformId]?.formats || [];
                      const localizedFormats = formats.map(fId => {
                        return lang === "es" && PLATFORM_TRANSLATIONS[platformId]?.formats[fId]
                          ? PLATFORM_TRANSLATIONS[platformId].formats[fId]
                          : fId;
                      });
                      return (
                        <div key={platformId} className="flex items-center gap-2 text-[11px]">
                          <span className="rounded bg-[#00ff88]/10 px-2 py-0.5 text-[#00ff88] uppercase font-mono font-bold">
                            {platformId}
                          </span>
                          <span className="text-white/50">
                            {lang === "en" ? "Formats:" : "Formatos:"} {localizedFormats.join(", ") || (lang === "en" ? "None selected" : "Ninguno seleccionado")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ReviewSection>
                <div className="h-px bg-white/[0.06]" />

                <ReviewSection title={lang === "en" ? "Content Verticals" : "Verticales de Contenido"}>
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

                <ReviewSection title={lang === "en" ? "Tone of Voice Guidelines" : "Pautas de Tono de Voz"}>
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
            {t("back")}
          </Button>
          {step < stepsList.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed() || (step === 1 && form.targetAudience.socioEconomic.length === 0)}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 glow-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.15)] rounded-xl text-xs"
            >
              {t("continue")}
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
                t("savingConfig")
              ) : (
                <>
                  {isEditing ? (lang === "en" ? "Save & Return" : "Guardar y Regresar") : (lang === "en" ? "Launch TACT" : "Lanzar TACT")}
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
