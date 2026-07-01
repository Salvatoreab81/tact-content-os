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

  const [form, setForm] = useState({
    name: "",
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
              targetAudience: current.target_audience || current.targetAudience || {
                genders: [],
                generations: [],
                socioEconomic: "medium",
                markets: current.markets || []
              },
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
      // Sync markets root list with targetAudience markets
      const payload = {
        ...form,
        markets: form.targetAudience.markets,
      };

      const res = await fetch(`/api/brands/${brand.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving brand details:", err);
    } finally {
      setSaving(false);
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
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8 select-none">
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
          <div className="glass p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Globe className="h-4 w-4 text-purple-400" /> Target Audience Demographics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Gender target */}
              <div className="space-y-2">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">Gender Group</span>
                <div className="flex gap-2">
                  {["both", "men", "women"].map((g) => {
                    const isSelected = form.targetAudience.genders.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleAudienceItem("genders", g)}
                        className={`rounded-lg px-3 py-1.5 font-bold capitalize transition-all ${
                          isSelected
                            ? "bg-purple-500/10 border border-purple-500/25 text-purple-400"
                            : "bg-white/[0.02] border border-white/[0.06] text-white/35"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Economic level */}
              <div className="space-y-2">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">Socio-Economic Tier</span>
                <div className="flex gap-2">
                  {["medium", "high", "luxury"].map((t) => {
                    const isSelected = form.targetAudience.socioEconomic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => selectSocioEconomic(t)}
                        className={`rounded-lg px-3 py-1.5 font-bold capitalize transition-all ${
                          isSelected
                            ? "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400"
                            : "bg-white/[0.02] border border-white/[0.06] text-white/35"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Generations target */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">Target Generations</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "gen_z", label: "Gen Z" },
                  { id: "millennials", label: "Millennials" },
                  { id: "gen_x", label: "Gen X" },
                  { id: "boomers", label: "Boomers" },
                ].map((gen) => {
                  const isSelected = form.targetAudience.generations.includes(gen.id);
                  return (
                    <button
                      key={gen.id}
                      type="button"
                      onClick={() => toggleAudienceItem("generations", gen.id)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88]"
                          : "bg-white/[0.02] border border-white/[0.06] text-white/40"
                      }`}
                    >
                      {gen.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Markets List */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">Markets & Geographic Focus</span>
              <div className="flex flex-wrap gap-1.5">
                {form.targetAudience.markets.map((m) => (
                  <Badge
                    key={m}
                    variant="outline"
                    className="rounded-lg bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs text-white/70 font-mono flex items-center gap-1.5"
                  >
                    {m}
                    <button
                      onClick={() => toggleAudienceItem("markets", m)}
                      className="text-white/30 hover:text-white/80 transition-colors"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Intelligence & Learning Card */}
          <div className="glass p-6 space-y-4">
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
            <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-1">
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
        </div>

        {/* Right Column: Channels, Active Formats & Focus Guidelines */}
        <div className="space-y-6">
          {/* Platforms & Formats Details */}
          <div className="glass p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Layers className="h-4 w-4 text-[#ffaa00]/60" /> Channels & Formats
            </h3>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
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
    </div>
  );
}
