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
  { title: "Tone of Voice", icon: MessageSquare },
  { title: "Target Audience", icon: Globe },
  { title: "Platforms & Formats", icon: Layers },
  { title: "Content Verticals", icon: Hash },
  { title: "Review", icon: Send },
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

const COUNTRIES_AND_REGIONS = [
  { id: "LATAM", label: "Latin America (LATAM)", type: "region" },
  { id: "NA", label: "North America (NA)", type: "region" },
  { id: "EU", label: "Europe (EU)", type: "region" },
  { id: "APAC", label: "Asia-Pacific (APAC)", type: "region" },
  { id: "Mexico", label: "Mexico", type: "country" },
  { id: "Colombia", label: "Colombia", type: "country" },
  { id: "Argentina", label: "Argentina", type: "country" },
  { id: "Chile", label: "Chile", type: "country" },
  { id: "Spain", label: "Spain", type: "country" },
  { id: "United States", label: "United States", type: "country" },
  { id: "United Kingdom", label: "United Kingdom", type: "country" },
];

const VERTICALS = [
  { id: "education", label: "Education", icon: GraduationCap, color: "blue" },
  { id: "curiosity", label: "Curiosity", icon: Lightbulb, color: "yellow" },
  { id: "inspiration", label: "Inspiration", icon: Award, color: "purple" },
  { id: "authority", label: "Authority", icon: Building2, color: "green" },
  { id: "sale", label: "Sale", icon: ShoppingCart, color: "red" },
  { id: "entertainment", label: "Entertainment", icon: Smile, color: "pink" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [existingSlug, setExistingSlug] = useState("");
  const [generatingTone, setGeneratingTone] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    industry: "",
    toneOfVoice: "",
    markets: [] as string[],
    platforms: [] as string[],
    contentVerticals: [] as string[],
    targetAudience: {
      genders: [] as string[],
      generations: [] as string[],
      socioEconomic: "medium",
      markets: [] as string[],
    },
    platformDetails: {} as Record<string, { formats: string[] }>
  });

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

        // Auth verified, load existing brand to edit
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
              targetAudience: b.target_audience || b.targetAudience || {
                genders: [],
                generations: [],
                socioEconomic: "medium",
                markets: b.markets || []
              },
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
        // Initialize default formats
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

  const toggleAudienceItem = (field: "genders" | "generations" | "markets", value: string) => {
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

  const selectSocioEconomic = (value: string) => {
    setForm((prev) => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        socioEconomic: value
      }
    }));
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
          presets: form.toneOfVoice.split(",").map(t => t.trim()).filter(Boolean),
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

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.name.trim().length > 0 && form.industry.trim().length > 0;
      case 1:
        return form.toneOfVoice.trim().length > 0;
      case 2:
        return form.targetAudience.markets.length > 0 && form.targetAudience.generations.length > 0;
      case 3:
        return form.platforms.length > 0;
      case 4:
        return form.contentVerticals.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Sync markets array at the root level for backwards compatibility
      const marketsRoot = form.targetAudience.markets;
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

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 select-none">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] font-bold text-base shadow-[0_0_24px_rgba(0,255,136,0.12)]">
              T
            </div>
            <span className="text-xl font-bold text-white heading-brutal">TACT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3 heading-glow">
            {isEditing ? "Edit Brand Config" : "Set up your brand"}
          </h1>
          <p className="text-sm text-white/45 font-medium">
            {isEditing ? "Adjust your targets, platforms, and formats" : "Tell us about your brand to get personalized content"}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06] rounded-full mb-7 overflow-hidden">
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
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 font-mono ${
                    i < step
                      ? "step-completed"
                      : i === step
                        ? "step-active"
                        : "step-pending"
                  }`}
                >
                  {i < step ? (
                    <Check className="h-3.5 w-3.5" />
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
            <span className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.1em]">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.1em]">
              {STEPS[step].title}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="glass glass-accent-top p-8 sm:p-10">
          {/* Step 0: Brand Basics */}
          {step === 0 && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Brand Basics
                </h2>
                <p className="text-sm text-white/40">
                  Start with your brand&apos;s core information
                </p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block form-label mb-2">
                    Brand Name *
                  </label>
                  <Input
                    placeholder="e.g., TACT OS"
                    value={form.name}
                    onChange={(e) => {
                      updateForm({
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    className="glass-input h-11"
                  />
                </div>
                <div>
                  <label className="block form-label mb-2">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/30 font-mono">tact.app/</span>
                    <Input
                      placeholder="tact-os"
                      value={form.slug}
                      onChange={(e) => updateForm({ slug: e.target.value })}
                      className="glass-input h-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="block form-label mb-2">
                    Industry *
                  </label>
                  <Input
                    placeholder="e.g., Digital Marketing"
                    value={form.industry}
                    onChange={(e) => updateForm({ industry: e.target.value })}
                    className="glass-input h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Tone of Voice */}
          {step === 1 && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Tone of Voice
                </h2>
                <p className="text-sm text-white/40">
                  How should your brand sound?
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block form-label">
                    Describe your brand&apos;s voice *
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
                    IA Generator
                  </Button>
                </div>
                <textarea
                  rows={5}
                  placeholder="e.g., Friendly and playful, using humor and emojis. We speak to pet parents like friends, sharing tips..."
                  value={form.toneOfVoice}
                  onChange={(e) =>
                    updateForm({ toneOfVoice: e.target.value })
                  }
                  className="w-full rounded-xl glass-input px-4 py-3 text-sm outline-none resize-none"
                />
              </div>
              <div>
                <p className="text-[10px] text-white/30 mb-3 font-semibold font-mono uppercase tracking-[0.12em]">
                  Quick presets (Click to add)
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Professional",
                    "Friendly",
                    "Playful",
                    "Inspirational",
                    "Witty",
                    "Authoritative",
                    "Casual",
                    "Luxurious",
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
                      className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/45 hover:text-[#00ff88] hover:border-[#00ff88]/25 hover:bg-[#00ff88]/5 transition-all duration-300"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Audience */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Target Audience
                </h2>
                <p className="text-sm text-white/40">
                  Define who your content strategist should target
                </p>
              </div>

              {/* Geographic Markets */}
              <div className="space-y-3">
                <p className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.12em]">
                  Geographic Markets & Regions *
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COUNTRIES_AND_REGIONS.map((item) => {
                    const isSelected = form.targetAudience.markets.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAudienceItem("markets", item.id)}
                        className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all duration-300 text-left ${
                          isSelected
                            ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                            : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
                        }`}
                      >
                        <span className="block font-bold">{item.label}</span>
                        <span className="block text-[8px] text-white/30 uppercase tracking-wider font-mono mt-0.5">{item.type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender */}
                <div className="space-y-3">
                  <p className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.12em]">
                    Gender Target
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "both", label: "Both" },
                      { id: "men", label: "Men" },
                      { id: "women", label: "Women" }
                    ].map((gender) => {
                      const isSelected = form.targetAudience.genders.includes(gender.id);
                      return (
                        <button
                          key={gender.id}
                          type="button"
                          onClick={() => toggleAudienceItem("genders", gender.id)}
                          className={`rounded-xl border py-2.5 text-xs font-medium transition-all duration-300 ${
                            isSelected
                              ? "bg-purple-500/10 border-purple-500/25 text-purple-400"
                              : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white"
                          }`}
                        >
                          {gender.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Socio-Economic */}
                <div className="space-y-3">
                  <p className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.12em]">
                    Socio-Economic Tier
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "medium", label: "Medium" },
                      { id: "high", label: "High" },
                      { id: "luxury", label: "Luxury" }
                    ].map((tier) => {
                      const isSelected = form.targetAudience.socioEconomic === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => selectSocioEconomic(tier.id)}
                          className={`rounded-xl border py-2.5 text-xs font-medium transition-all duration-300 ${
                            isSelected
                              ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400"
                              : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white"
                          }`}
                        >
                          {tier.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Age generations */}
              <div className="space-y-3">
                <p className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.12em]">
                  Age Generations *
                </p>
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
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-300 text-center ${
                          isSelected
                            ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]"
                            : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white"
                        }`}
                      >
                        <span className="block font-bold">{gen.label}</span>
                        <span className="block text-[9px] text-white/30 mt-0.5">{gen.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Platforms & Formats */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Platforms & Formats
                </h2>
                <p className="text-sm text-white/40">
                  Select your channels, choose formats, and view TACT best practices
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Platform selector */}
                <div className="space-y-3">
                  <p className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.12em]">
                    Select Channels *
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PLATFORMS.map((platform) => {
                      const isSelected = form.platforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => toggleArrayItem("platforms", platform.id)}
                          className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 text-left ${
                            isSelected
                              ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                              : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white"
                          }`}
                        >
                          <platform.icon className="h-5 w-5 shrink-0" />
                          <span className="text-xs font-bold">{platform.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected platform details */}
                <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 max-h-[380px] overflow-y-auto pr-1">
                  <p className="text-[10px] text-white/30 font-semibold font-mono uppercase tracking-[0.12em]">
                    Configure Formats & Focus
                  </p>

                  {form.platforms.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-10 font-sans">
                      Select at least one channel on the left to configure active formats and review strategist guidelines.
                    </p>
                  ) : (
                    form.platforms.map((platformId) => {
                      const details = PLATFORM_DETAILS_MAP[platformId];
                      const platformInfo = PLATFORMS.find(p => p.id === platformId);
                      if (!details || !platformInfo) return null;

                      const selectedFormats = form.platformDetails[platformId]?.formats || [];

                      return (
                        <div key={platformId} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                            <platformInfo.icon className="h-4 w-4 text-[#00ff88]" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{platformInfo.label}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-[#00d4ff] uppercase tracking-wider font-mono">TACT Focus Guideline</span>
                            <p className="text-[10px] text-white/50 leading-relaxed font-sans">{details.focus}</p>
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider font-mono">Active Formats</span>
                            <div className="flex flex-wrap gap-1.5">
                              {details.formats.map((fmt) => {
                                const isFormatSelected = selectedFormats.includes(fmt.id);
                                return (
                                  <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => togglePlatformFormat(platformId, fmt.id)}
                                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-mono border transition-all duration-300 ${
                                      isFormatSelected
                                        ? "bg-purple-500/10 border-purple-500/25 text-purple-400"
                                        : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white"
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

          {/* Step 4: Content Verticals */}
          {step === 4 && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Content Verticals
                </h2>
                <p className="text-sm text-white/40">
                  What types of content will you create?
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {VERTICALS.map((vertical) => {
                  const colorMap: Record<string, string> = {
                    blue: "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]",
                    yellow: "bg-[#ffaa00]/10 border-[#ffaa00]/25 text-[#ffaa00]",
                    purple: "bg-purple-500/10 border-purple-500/25 text-purple-400",
                    green: "bg-[#00cc6a]/10 border-[#00cc6a]/25 text-[#00cc6a]",
                    red: "bg-[#ff3366]/10 border-[#ff3366]/25 text-[#ff3366]",
                    pink: "bg-pink-500/10 border-pink-500/25 text-pink-400",
                  };
                  const isActive = form.contentVerticals.includes(vertical.id);
                  return (
                    <button
                      key={vertical.id}
                      type="button"
                      onClick={() =>
                        toggleArrayItem("contentVerticals", vertical.id)
                      }
                      className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all duration-300 ${
                        isActive
                          ? colorMap[vertical.color]
                          : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white"
                      }`}
                    >
                      <vertical.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">
                        {vertical.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Review & Submit
                </h2>
                <p className="text-sm text-white/40">
                  Check everything looks good
                </p>
              </div>
              <div className="space-y-5">
                <ReviewSection title="Brand">
                  <p className="text-white font-medium">
                    {form.name || "—"}
                  </p>
                  <p className="text-sm text-white/40">
                    {form.industry} · {form.slug || generateSlug(form.name)}
                  </p>
                </ReviewSection>
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                
                <ReviewSection title="Tone of Voice">
                  <p className="text-sm text-white/60">
                    {form.toneOfVoice || "—"}
                  </p>
                </ReviewSection>
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                <ReviewSection title="Target Audience Demographics">
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-white/40 font-mono">Markets: </span>
                      <span className="text-white font-bold">{form.targetAudience.markets.join(", ") || "None selected"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 font-mono">Genders: </span>
                      <span className="text-white font-bold">{form.targetAudience.genders.join(", ") || "All"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 font-mono">Generations: </span>
                      <span className="text-white font-bold">{form.targetAudience.generations.join(", ") || "All"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 font-mono">Economic Status: </span>
                      <span className="text-white font-bold capitalize">{form.targetAudience.socioEconomic}</span>
                    </div>
                  </div>
                </ReviewSection>
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                <ReviewSection title="Selected Platforms & Formats">
                  <div className="space-y-2">
                    {form.platforms.map((platformId) => {
                      const formats = form.platformDetails[platformId]?.formats || [];
                      return (
                        <div key={platformId} className="text-xs flex items-center gap-2">
                          <span className="rounded-lg bg-[#00ff88]/8 border border-[#00ff88]/12 px-2.5 py-1 text-[#00ff88] capitalize font-mono font-bold">
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
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                <ReviewSection title="Content Verticals">
                  <div className="flex flex-wrap gap-1.5">
                    {form.contentVerticals.map((v) => (
                      <span
                        key={v}
                        className="rounded-lg bg-purple-500/8 border border-purple-500/12 px-3 py-1.5 text-xs text-purple-400 capitalize font-mono"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </ReviewSection>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="text-white/35 hover:text-white/70 disabled:opacity-20 transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              {submitting ? (
                "Saving config..."
              ) : (
                <>
                  {isEditing ? "Save & Return" : "Launch TACT"}
                  <Send className="h-4 w-4 ml-2" />
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
      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-2.5 font-mono">
        {title}
      </p>
      {children}
    </div>
  );
}
