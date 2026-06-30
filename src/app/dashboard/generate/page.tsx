"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Camera,
  Users,
  Video,
  Briefcase,
  PenLine,
  Gamepad2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "facebook", label: "Facebook", icon: Users },
  { value: "tiktok", label: "TikTok", icon: Gamepad2 },
  { value: "youtube", label: "YouTube", icon: Video },
  { value: "blog", label: "Blog", icon: PenLine },
  { value: "linkedin", label: "LinkedIn", icon: Briefcase },
];

const verticalOptions = [
  "Education",
  "Curiosity",
  "Inspiration",
  "Authority",
  "Sale",
  "Entertainment",
];

const sampleGenerated = [
  {
    title: "5 Ways to Keep Your Pet Active This Summer ☀️🐕",
    caption:
      "Summer is here and your furry friend needs extra love! 🐾\n\nHere are 5 tips to keep your pet happy and healthy:\n\n1️⃣ Early morning walks before the heat\n2️⃣ Interactive puzzle toys for indoor play\n3️⃣ Frozen treat recipes (pup-approved!)\n4️⃣ Water play sessions in the backyard\n5️⃣ Shade and hydration stations\n\nWhich tip are you trying first? Tell us below! 👇\n\n#PetParent #DogLife #SummerPets #HUEHUE #PetTips",
    hashtags: "#PetParent #DogLife #SummerPets #HUEHUE #PetTips",
    type: "Carousel Post",
  },
  {
    title: "Behind the Scenes: How We Design Pet Accessories 🎨",
    caption:
      "Ever wondered what goes into making your pet's favorite gear? 🤔\n\nOur design process:\n✅ Listen to pet parents' needs\n✅ Source sustainable materials\n✅ Test with real pets (the hardest critics!)\n✅ Iterate until purr-fect\n\nQuality you can trust. Love your pet deserves. ❤️\n\n#BehindTheScenes #HUEHUE #PetAccessories #SustainablePet",
    hashtags:
      "#BehindTheScenes #HUEHUE #PetAccessories #SustainablePet",
    type: "Reel Script",
  },
];

export default function GeneratePage() {
  const [form, setForm] = useState({
    campaign: "",
    platform: "",
    vertical: "",
    topic: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [publishingIndex, setPublishingIndex] = useState<number | null>(null);
  const [publishedIndices, setPublishedIndices] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || data || []);
        }
      } catch (err) {
        console.error("Error loading campaigns:", err);
      }
    }
    fetchCampaigns();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated([]);
    setError(null);
    setPublishedIndices([]);

    const model = localStorage.getItem("tact_openrouter_model") || "google/gemini-2.0-flash-exp:free";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: form.platform,
          vertical: form.vertical,
          topic: form.topic,
          model: model
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGenerated(Array.isArray(data) ? data : [data]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to generate content. Please verify your OpenRouter API key.");
      }
    } catch (err) {
      console.error("Error calling generate api:", err);
      setError("Network error calling generation service.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (item: any, index: number) => {
    setPublishingIndex(index);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: "1",
          campaignId: form.campaign || null,
          platform: form.platform || item.type?.toLowerCase().split(" ")[0] || "instagram",
          contentType: item.type || "Post",
          contentVertical: form.vertical || "General",
          title: item.title,
          caption: item.caption,
          scheduled_date: new Date().toLocaleDateString("sv-SE"), // YYYY-MM-DD local format
        }),
      });

      if (res.ok) {
        setPublishedIndices((prev) => [...prev, index]);
      } else {
        alert("Failed to save content piece to database.");
      }
    } catch (err) {
      console.error("Error publishing content:", err);
    } finally {
      setPublishingIndex(null);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow flex items-center gap-3">
          Generate Content
          <span className="neon-badge">AI</span>
        </h1>
        <p className="text-sm text-white/50 mt-3 font-medium">
          Create AI-powered content for your brand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 glass glass-accent-top p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-5 border-b border-white/[0.06]">
            <Sparkles className="h-4 w-4 text-[#00ff88]/70" />
            <h2 className="text-sm font-bold text-white heading-brutal">
              Generation Settings
            </h2>
          </div>

          <div>
            <label className="block form-label mb-2.5">Campaign</label>
            <select
              value={form.campaign}
              onChange={(e) =>
                setForm({ ...form, campaign: e.target.value })
              }
              className="w-full rounded-xl glass-select px-3 py-2.5 text-sm cursor-pointer"
            >
              <option value="">Select campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block form-label mb-2.5">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {platformOptions.map((p) => (
                <button
                  key={p.value}
                  onClick={() =>
                    setForm({ ...form, platform: p.value })
                  }
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 text-xs font-medium transition-all duration-300 ${
                    form.platform === p.value
                      ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                      : "bg-white/[0.04] border-white/[0.08] text-white/35 hover:text-white/70 hover:border-white/[0.15]"
                  }`}
                >
                  <p.icon className="h-4 w-4" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block form-label mb-2.5">
              Content Vertical
            </label>
            <div className="flex flex-wrap gap-2">
              {verticalOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setForm({ ...form, vertical: v })}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    form.vertical === v
                      ? "bg-purple-500/10 border-purple-500/25 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.08)]"
                      : "bg-white/[0.04] border-white/[0.08] text-white/35 hover:text-white/70 hover:border-white/[0.15]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block form-label mb-2.5">
              Topic / Theme
            </label>
            <Input
              placeholder="e.g., Summer pet care tips"
              value={form.topic}
              onChange={(e) =>
                setForm({ ...form, topic: e.target.value })
              }
              className="glass-input h-11"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !form.topic}
            className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] hover:from-[#00cc6a] hover:to-[#00b8e0] text-[#0a0a1a] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 glow-sm hover:scale-[1.02] shadow-[0_0_24px_rgba(0,255,136,0.2)] h-12 rounded-xl"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-5">
          {error && (
            <div className="glass p-5 border border-red-500/20 rounded-xl bg-red-500/5">
              <p className="text-sm font-bold text-red-400">Generation Error</p>
              <p className="text-xs text-white/60 mt-1">{error}</p>
            </div>
          )}

          {generating && (
            <div className="glass p-14 text-center">
              <div className="flex flex-col items-center gap-5">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-[#00ff88] animate-spin" />
                  <Sparkles className="h-5 w-5 text-[#00ff88]/60 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Creating your content...
                  </p>
                  <p className="text-xs text-white/30 mt-1.5">
                    Our AI is crafting the perfect post
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-[#00ff88] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!generating && generated.length === 0 && (
            <div className="glass p-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/6 border border-[#00ff88]/10">
                  <Sparkles className="h-8 w-8 text-[#00ff88]/35" />
                </div>
                <p className="text-sm font-bold text-white/45">
                  Your generated content will appear here
                </p>
                <p className="text-xs text-white/25 max-w-sm">
                  Configure your settings and click Generate to create
                  AI-powered content for your brand
                </p>
              </div>
            </div>
          )}

          {generated.map((item, i) => (
            <div
              key={i}
              className="glass glass-hover transition-all duration-300"
            >
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="cyan-badge">
                      {item.type}
                    </span>
                    <h3 className="text-sm font-bold text-white heading-brutal">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.caption, i)}
                      className="p-2 rounded-xl hover:bg-white/[0.06] text-white/25 hover:text-[#00ff88]/70 transition-all duration-300"
                      title="Copy"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-[#00ff88]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-2 rounded-xl hover:bg-white/[0.06] text-white/25 hover:text-[#00d4ff]/70 transition-all duration-300"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5">
                  <p className="text-sm text-white/65 whitespace-pre-wrap leading-relaxed">
                    {item.caption}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-[10px] text-white/25 font-mono uppercase tracking-[0.1em]">
                    {item.caption.split(" ").length} words
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-white/35 hover:text-white/70 h-8 transition-colors duration-300 rounded-xl"
                      onClick={() => handleCopy(item.caption, i)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePublish(item, i)}
                      disabled={publishedIndices.includes(i) || publishingIndex === i}
                      className={`text-xs h-8 border-0 font-mono transition-all duration-300 rounded-xl ${
                        publishedIndices.includes(i)
                          ? "bg-[#00d4ff]/10 text-[#00d4ff] cursor-default"
                          : "bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/15"
                      }`}
                    >
                      {publishingIndex === i ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Publishing...
                        </>
                      ) : publishedIndices.includes(i) ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-1" />
                          Publish
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
