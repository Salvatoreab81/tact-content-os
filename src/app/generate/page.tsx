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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          Generate Content
          <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400">
            AI
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create AI-powered content for your brand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-white/[0.06]">
          <CardHeader className="border-b border-white/[0.06] pb-4">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Campaign
              </label>
              <select
                value={form.campaign}
                onChange={(e) =>
                  setForm({ ...form, campaign: e.target.value })
                }
                className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 text-sm text-white outline-none cursor-pointer"
              >
                <option value="">Select campaign</option>
                <option value="summer">Summer Collection</option>
                <option value="holiday">Holiday Campaign</option>
                <option value="brand">Brand Awareness</option>
                <option value="product">Product Launch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {platformOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() =>
                      setForm({ ...form, platform: p.value })
                    }
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all ${
                      form.platform === p.value
                        ? "bg-blue-600/15 border-blue-500/30 text-blue-400"
                        : "bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]"
                    }`}
                  >
                    <p.icon className="h-4 w-4" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Content Vertical
              </label>
              <div className="flex flex-wrap gap-2">
                {verticalOptions.map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm({ ...form, vertical: v })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      form.vertical === v
                        ? "bg-purple-600/15 border-purple-500/30 text-purple-400"
                        : "bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Topic / Theme
              </label>
              <Input
                placeholder="e.g., Summer pet care tips"
                value={form.topic}
                onChange={(e) =>
                  setForm({ ...form, topic: e.target.value })
                }
                className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !form.topic}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
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
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-4">
          {generating && (
            <Card className="bg-gray-900/50 border-white/[0.06]">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                    <Sparkles className="h-5 w-5 text-blue-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Creating your content...
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Our AI is crafting the perfect post
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!generating && generated.length === 0 && (
            <Card className="bg-gray-900/50 border-white/[0.06]">
              <CardContent className="p-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20">
                    <Sparkles className="h-7 w-7 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    Your generated content will appear here
                  </p>
                  <p className="text-xs text-gray-600 max-w-sm">
                    Configure your settings and click Generate to create
                    AI-powered content for your brand
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {generated.map((item, i) => (
            <Card
              key={i}
              className="bg-gray-900/50 border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400">
                      {item.type}
                    </span>
                    <CardTitle className="text-sm font-semibold text-white">
                      {item.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.caption, i)}
                      className="p-1.5 rounded-md hover:bg-white/[0.06] text-gray-600 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-1.5 rounded-md hover:bg-white/[0.06] text-gray-600 hover:text-white transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {item.caption}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">
                    {item.caption.split(" ").length} words
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-white h-7"
                      onClick={() => handleCopy(item.caption, i)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 h-7 border-0"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Publish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
