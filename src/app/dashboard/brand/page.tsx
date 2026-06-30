"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "blog", label: "Blog" },
  { id: "linkedin", label: "LinkedIn" },
];

const VERTICALS = [
  { id: "education", label: "Education" },
  { id: "curiosity", label: "Curiosity" },
  { id: "inspiration", label: "Inspiration" },
  { id: "authority", label: "Authority" },
  { id: "sale", label: "Sale" },
  { id: "entertainment", label: "Entertainment" },
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Spain", "Italy", "Brazil", "Mexico", 
  "Portugal", "Netherlands", "Japan", "India", "Nigeria", 
  "South Africa", "UAE", "Singapore"
];

export default function BrandGuidelinesPage() {
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newMarket, setNewMarket] = useState("");

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
      const res = await fetch(`/api/brands/${brand.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const addMarket = () => {
    if (!newMarket || form.markets.includes(newMarket)) return;
    setForm((prev) => ({
      ...prev,
      markets: [...prev.markets, newMarket],
    }));
    setNewMarket("");
  };

  const removeMarket = (market: string) => {
    setForm((prev) => ({
      ...prev,
      markets: prev.markets.filter((m) => m !== market),
    }));
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
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow flex items-center gap-3">
            Brand Guidelines
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            Manage your brand identity, tone of voice, and publishing channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-[#00ff88] font-semibold bg-[#00ff88]/10 border border-[#00ff88]/20 px-3 py-2 rounded-xl animate-fade-in">
              <CheckCircle className="h-4 w-4" /> Saved Successfully!
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
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
        {/* Left Column: Core Identity & Tone */}
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
            <div>
              <label className="block form-label mb-2">URL Slug (read-only)</label>
              <Input
                value={brand.slug}
                disabled
                className="glass-input opacity-45 cursor-not-allowed"
              />
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
                rows={6}
                value={form.toneOfVoice}
                onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
                placeholder="Describe your brand's voice and guidelines..."
                className="w-full rounded-xl glass-input px-4 py-3 text-sm outline-none resize-none"
              />
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

        {/* Right Column: Channels & Verticals */}
        <div className="space-y-6">
          {/* Target Markets */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Globe className="h-4 w-4 text-purple-400" /> Target Markets
            </h3>
            <div className="flex gap-2">
              <select
                value={newMarket}
                onChange={(e) => setNewMarket(e.target.value)}
                className="flex-1 rounded-xl glass-select px-3 py-2 text-sm"
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Button onClick={addMarket} className="bg-purple-500 hover:bg-purple-600 text-white">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {form.markets.map((m) => (
                <Badge
                  key={m}
                  variant="outline"
                  className="rounded-lg bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-xs text-white/70 font-mono flex items-center gap-1.5"
                >
                  {m}
                  <button
                    onClick={() => removeMarket(m)}
                    className="text-white/30 hover:text-white/80 transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Layers className="h-4 w-4 text-[#ffaa00]/60" /> Platforms
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORMS.map((p) => {
                const isActive = form.platforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleArrayItem("platforms", p.id)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold text-center transition-all duration-300 ${
                      isActive
                        ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]"
                        : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
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
