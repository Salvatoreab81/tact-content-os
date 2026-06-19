"use client";

import { useState } from "react";
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
    hashtags: "#BehindTheScenes #HUEHUE #PetAccessories #SustainablePet",
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
  const [generated, setGenerated] = useState<typeof sampleGenerated>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated([]);
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2000));
    setGenerated(sampleGenerated);
    setGenerating(false);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight heading-brutal flex items-center gap-3">
          Generate Content
          <span className="neon-badge">
            AI
          </span>
        </h1>
        <p className="text-sm text-white/35 mt-2">
          Create AI-powered content for your brand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 glass p-5 space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
            <Sparkles className="h-4 w-4 text-[#00ff88]/70" />
            <h2 className="text-sm font-semibold text-white heading-brutal">Generation Settings</h2>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-white/30 mb-2 font-mono uppercase tracking-[0.15em]">
              Campaign
            </label>
            <select
              value={form.campaign}
              onChange={(e) =>
                setForm({ ...form, campaign: e.target.value })
              }
              className="w-full rounded-xl glass-select px-3 py-2.5 text-sm cursor-pointer"
            >
              <option value="">Select campaign</option>
              <option value="summer">Summer Collection</option>
              <option value="holiday">Holiday Campaign</option>
              <option value="brand">Brand Awareness</option>
              <option value="product">Product Launch</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-white/30 mb-2 font-mono uppercase tracking-[0.15em]">
              Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platformOptions.map((p) => (
                <button
                  key={p.value}
                  onClick={() =>
                    setForm({ ...form, platform: p.value })
                  }
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all duration-200 ${
                    form.platform === p.value
                      ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]"
                      : "bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/[0.12]"
                  }`}
                >
                  <p.icon className="h-4 w-4" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-white/30 mb-2 font-mono uppercase tracking-[0.15em]">
              Content Vertical
            </label>
            <div className="flex flex-wrap gap-2">
              {verticalOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setForm({ ...form, vertical: v })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    form.vertical === v
                      ? "bg-purple-500/10 border-purple-500/25 text-purple-400"
                      : "bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/[0.12]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-white/30 mb-2 font-mono uppercase tracking-[0.15em]">
              Topic / Theme
            </label>
            <Input
              placeholder="e.g., Summer pet care tips"
              value={form.topic}
              onChange={(e) =>
                setForm({ ...form, topic: e.target.value })
              }
              className="glass-input"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !form.topic}
            className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-[#050505] font-semibold disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 glow-sm hover:scale-[1.02]"
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
        <div className="lg:col-span-3 space-y-4">
          {generating && (
            <div className="glass p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-10 w-10 text-[#00ff88] animate-spin" />
                  <Sparkles className="h-5 w-5 text-[#00ff88]/60 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Creating your content...
                  </p>
                  <p className="text-xs text-white/25 mt-1">
                    Our AI is crafting the perfect post
                  </p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!generating && generated.length === 0 && (
            <div className="glass p-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff88]/6 border border-[#00ff88]/10">
                  <Sparkles className="h-7 w-7 text-[#00ff88]/40" />
                </div>
                <p className="text-sm font-medium text-white/40">
                  Your generated content will appear here
                </p>
                <p className="text-xs text-white/20 max-w-sm">
                  Configure your settings and click Generate to create
                  AI-powered content for your brand
                </p>
              </div>
            </div>
          )}

          {generated.map((item, i) => (
            <div
              key={i}
              className="glass glass-hover transition-all duration-200"
            >
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-500/8 border border-purple-500/12 px-2 py-0.5 text-[10px] font-medium text-purple-400 font-mono">
                      {item.type}
                    </span>
                    <h3 className="text-sm font-semibold text-white heading-brutal">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.caption, i)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/20 hover:text-white/60 transition-all duration-200"
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
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/20 hover:text-white/60 transition-all duration-200"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <p className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed">
                    {item.caption}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-white/20 font-mono uppercase tracking-wider">
                    {item.caption.split(" ").length} words
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-white/30 hover:text-white/60 h-7 transition-colors duration-200"
                      onClick={() => handleCopy(item.caption, i)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/15 h-7 border-0 font-mono transition-all duration-200"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Publish
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
