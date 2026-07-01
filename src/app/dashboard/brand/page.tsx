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

export default function BrandGuidelinesPage() {
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Memories / Brand Intelligence state
  const [memories, setMemories] = useState<any[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [newMemory, setNewMemory] = useState({ title: "", content: "", category: "strategy" });
  const [addingMemory, setAddingMemory] = useState(false);

  // Version History State
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedHistoryVer, setSelectedHistoryVer] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
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
    async function fetchBrandData() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const brands = await res.json();
          if (brands && brands.length > 0) {
            const current = brands[0]; // Fetch first brand
            setBrand(current);
            setForm({
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
        // Refresh history list
        const histRes = await fetch("/api/brands/history");
        if (histRes.ok) {
          const data = await histRes.json();
          setHistoryList(data || []);
        }
      }
    } catch (err) {
      console.error("Error saving brand details:", err);
    } finally {
      setSaving(false);
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
        // Refresh page completely to load restored guidelines
        window.location.reload();
      }
    } catch (err) {
      console.error("Restore failed:", err);
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow flex items-center gap-3">
            Brand Guidelines
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            Manage your brand identity, tone of voice, demographics, and channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/onboarding">
            <Button
              type="button"
              variant="outline"
              className="border-[#00ff88]/20 bg-[#00ff88]/5 text-[#00ff88] hover:bg-[#00ff88]/10 font-bold transition-all duration-300 rounded-xl text-xs gap-2"
            >
              <Sparkles className="h-4 w-4" /> Re-run Setup Wizard
            </Button>
          </Link>

          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-[#00ff88] font-semibold bg-[#00ff88]/10 border border-[#00ff88]/20 px-3 py-2 rounded-xl animate-fade-in">
              <CheckCircle className="h-4 w-4" /> Saved!
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)] rounded-xl"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Guidelines
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
              <Building2 className="h-4 w-4 text-[#00d4ff]/60" /> Core Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block form-label mb-2">Brand Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block form-label mb-2">Industry</label>
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
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <MessageSquare className="h-4 w-4 text-[#00ff88]/60" /> Tone of Voice
            </h3>
            <div>
              <label className="block form-label mb-2">Voice & Persona Guidelines</label>
              <textarea
                rows={5}
                value={form.toneOfVoice}
                onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
                placeholder="Describe your brand's voice and guidelines..."
                className="w-full rounded-xl glass-input px-4 py-3 text-sm outline-none resize-none"
              />
            </div>
          </div>

          {/* Target Audience / Segmentation Card */}
          <div className="glass p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Globe className="h-4 w-4 text-purple-400" /> Target Audience Demographics
            </h3>

            {/* Geographic Markets */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">Markets & Geographic Focus</span>
              <div className="flex flex-wrap gap-1.5">
                {form.targetAudience.regions.map((reg) => (
                  <Badge
                    key={reg}
                    variant="outline"
                    className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs text-cyan-400 font-mono capitalize"
                  >
                    Region: {reg}
                  </Badge>
                ))}
                {form.targetAudience.countries.map((m) => (
                  <Badge
                    key={m}
                    variant="outline"
                    className="rounded-lg bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs text-white/70 font-mono"
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Excluded Markets */}
            {form.targetAudience.excludedCountries?.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-white/[0.04]">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono">Excluded Markets</span>
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
                  <span className="text-white/40">Gender Distribution</span>
                  <span className="text-[#00ff88]">
                    {form.targetAudience.genders.men}% Men / {form.targetAudience.genders.women}% Women
                  </span>
                </div>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10 w-full shadow-inner">
                  <div style={{ width: `${form.targetAudience.genders.men}%` }} className="bg-[#00ff88]" />
                  <div style={{ width: `${form.targetAudience.genders.women}%` }} className="bg-purple-500" />
                </div>
                <div className="flex justify-between text-[9px] text-white/30 font-mono">
                  <span>Hombres</span>
                  <span>Mujeres</span>
                </div>
              </div>

              {/* Generations target */}
              <div className="space-y-2">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono block">Target Generations</span>
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

            {/* Socio-Economic split progress bars */}
            <div className="space-y-3.5 pt-4 border-t border-white/[0.04]">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">Socio-Economic Split</span>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { key: "ab", label: "A/B (Luxury / High)", color: "bg-[#00ff88]" },
                  { key: "cplus", label: "C+ (Premium)", color: "bg-[#00d4ff]" },
                  { key: "c", label: "C (Mass Market)", color: "bg-purple-500" },
                  { key: "de", label: "D/E (Low Cost)", color: "bg-rose-500" },
                ].map((tier) => {
                  const val = (form.targetAudience.socioEconomic as any)[tier.key] || 0;
                  return (
                    <div key={tier.key} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/50">{tier.label}</span>
                        <span className="text-white font-bold">{val}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full">
                        <div style={{ width: `${val}%` }} className={`h-full ${tier.color}`} />
                      </div>
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
              <Layers className="h-4 w-4 text-[#ffaa00]/60" /> Channels & Formats
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {form.platforms.length === 0 ? (
                <p className="text-xs text-white/35 text-center py-6">
                  No active channels. Go through Onboarding setup to configure active publishing channels.
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
                        <span className="text-[8px] font-bold text-[#00d4ff] uppercase tracking-wider font-mono">Tact strategist guideline</span>
                        <p className="text-[10px] text-white/50 leading-relaxed font-sans">{details.focus}</p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider font-mono">Active Formats</span>
                        <div className="flex flex-wrap gap-1">
                          {details.formats.map((fmt) => {
                            const isFmtActive = formatsSelected.includes(fmt.id);
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

          {/* Content Verticals */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Hash className="h-4 w-4 text-pink-400" /> Content Verticals
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {VERTICALS.map((v) => {
                const isActive = form.contentVerticals.includes(v.id);
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
                    {v.label}
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
          <Sparkles className="h-4 w-4 text-purple-400" /> Brand Intelligence & Agent Memory
        </h3>
        <p className="text-xs text-white/40 leading-relaxed">
          This repository acts as the long-term memory for Hermes. Hermes logs performance insights, campaign learnings, and target audience feedback here, keeping all content strategically aligned.
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
