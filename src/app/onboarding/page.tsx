"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  { title: "Brand Basics", icon: Building2 },
  { title: "Tone of Voice", icon: MessageSquare },
  { title: "Markets", icon: Globe },
  { title: "Platforms", icon: Layers },
  { title: "Content Verticals", icon: Hash },
  { title: "Review", icon: Send },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera },
  { id: "facebook", label: "Facebook", icon: Users },
  { id: "tiktok", label: "TikTok", icon: Gamepad2 },
  { id: "youtube", label: "YouTube", icon: Video },
  { id: "blog", label: "Blog", icon: PenLine },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase },
];

const VERTICALS = [
  { id: "education", label: "Education", icon: GraduationCap, color: "blue" },
  { id: "curiosity", label: "Curiosity", icon: Lightbulb, color: "yellow" },
  {
    id: "inspiration",
    label: "Inspiration",
    icon: Award,
    color: "purple",
  },
  { id: "authority", label: "Authority", icon: Building2, color: "green" },
  { id: "sale", label: "Sale", icon: ShoppingCart, color: "red" },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: Smile,
    color: "pink",
  },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "Portugal",
  "Netherlands",
  "Japan",
  "India",
  "Nigeria",
  "South Africa",
  "UAE",
  "Singapore",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    industry: "",
    toneOfVoice: "",
    markets: [] as string[],
    platforms: [] as string[],
    contentVerticals: [] as string[],
  });

  const updateForm = (patch: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const toggleArrayItem = (field: "markets" | "platforms" | "contentVerticals", item: string) => {
    updateForm({
      [field]: form[field].includes(item)
        ? form[field].filter((i) => i !== item)
        : [...form[field], item],
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.name.trim().length > 0 && form.industry.trim().length > 0;
      case 1:
        return form.toneOfVoice.trim().length > 0;
      case 2:
        return form.markets.length > 0;
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
      await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || generateSlug(form.name),
        }),
      });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              T
            </div>
            <span className="text-lg font-bold text-white">TACT</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Set up your brand
          </h1>
          <p className="text-sm text-gray-500">
            Tell us about your brand to get personalized content
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    i < step
                      ? "bg-blue-600 text-white"
                      : i === step
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "bg-white/[0.05] text-gray-600"
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
                    className={`hidden sm:block w-8 lg:w-16 h-px mx-1 transition-colors duration-300 ${
                      i < step ? "bg-blue-600" : "bg-white/[0.08]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600 font-medium">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-gray-600 font-medium">
              {STEPS[step].title}
            </span>
          </div>
        </div>

        {/* Step content */}
        <Card className="bg-gray-900/50 border-white/[0.06]">
          <CardContent className="p-6 sm:p-8">
            {/* Step 0: Brand Basics */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Brand Basics
                  </h2>
                  <p className="text-sm text-gray-500">
                    Start with your brand&apos;s core information
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Brand Name *
                    </label>
                    <Input
                      placeholder="e.g., HUEHUE"
                      value={form.name}
                      onChange={(e) => {
                        updateForm({
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }}
                      className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL Slug
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">tact.app/</span>
                      <Input
                        placeholder="huehue"
                        value={form.slug}
                        onChange={(e) => updateForm({ slug: e.target.value })}
                        className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Industry *
                    </label>
                    <Input
                      placeholder="e.g., Pet Accessories"
                      value={form.industry}
                      onChange={(e) => updateForm({ industry: e.target.value })}
                      className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Tone of Voice */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Tone of Voice
                  </h2>
                  <p className="text-sm text-gray-500">
                    How should your brand sound?
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Describe your brand&apos;s voice *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g., Friendly and playful, using humor and emojis. We speak to pet parents like friends, sharing tips and heartwarming moments..."
                    value={form.toneOfVoice}
                    onChange={(e) =>
                      updateForm({ toneOfVoice: e.target.value })
                    }
                    className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none resize-none transition-colors"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-3 font-medium uppercase tracking-wider">
                    Quick presets
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
                        onClick={() =>
                          updateForm({
                            toneOfVoice: form.toneOfVoice
                              ? form.toneOfVoice + ", " + preset.toLowerCase()
                              : preset.toLowerCase(),
                          })
                        }
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.06] transition-all"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Markets */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Target Markets
                  </h2>
                  <p className="text-sm text-gray-500">
                    Where do your customers live?
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country}
                      onClick={() => toggleArrayItem("markets", country)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        form.markets.includes(country)
                          ? "bg-blue-600/15 border-blue-500/30 text-blue-400"
                          : "bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.12]"
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
                {form.markets.length > 0 && (
                  <p className="text-xs text-gray-600">
                    {form.markets.length} market
                    {form.markets.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Platforms */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Platforms
                  </h2>
                  <p className="text-sm text-gray-500">
                    Where will you publish content?
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() =>
                        toggleArrayItem("platforms", platform.id)
                      }
                      className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition-all duration-200 ${
                        form.platforms.includes(platform.id)
                          ? "bg-blue-600/15 border-blue-500/30 text-blue-400"
                          : "bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.12]"
                      }`}
                    >
                      <platform.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">
                        {platform.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Content Verticals */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Content Verticals
                  </h2>
                  <p className="text-sm text-gray-500">
                    What types of content will you create?
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {VERTICALS.map((vertical) => {
                    const colorMap: Record<string, string> = {
                      blue: "bg-blue-600/15 border-blue-500/30 text-blue-400",
                      yellow:
                        "bg-yellow-600/15 border-yellow-500/30 text-yellow-400",
                      purple:
                        "bg-purple-600/15 border-purple-500/30 text-purple-400",
                      green:
                        "bg-green-600/15 border-green-500/30 text-green-400",
                      red: "bg-red-600/15 border-red-500/30 text-red-400",
                      pink: "bg-pink-600/15 border-pink-500/30 text-pink-400",
                    };
                    const isActive = form.contentVerticals.includes(vertical.id);
                    return (
                      <button
                        key={vertical.id}
                        onClick={() =>
                          toggleArrayItem("contentVerticals", vertical.id)
                        }
                        className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition-all duration-200 ${
                          isActive
                            ? colorMap[vertical.color]
                            : "bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.12]"
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Review & Submit
                  </h2>
                  <p className="text-sm text-gray-500">
                    Check everything looks good
                  </p>
                </div>
                <div className="space-y-4">
                  <ReviewSection title="Brand">
                    <p className="text-white font-medium">
                      {form.name || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {form.industry} · {form.slug || generateSlug(form.name)}
                    </p>
                  </ReviewSection>
                  <Separator className="bg-white/[0.06]" />
                  <ReviewSection title="Tone of Voice">
                    <p className="text-sm text-gray-300">
                      {form.toneOfVoice || "—"}
                    </p>
                  </ReviewSection>
                  <Separator className="bg-white/[0.06]" />
                  <ReviewSection title="Markets">
                    <div className="flex flex-wrap gap-1.5">
                      {form.markets.map((m) => (
                        <span
                          key={m}
                          className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-gray-400"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </ReviewSection>
                  <Separator className="bg-white/[0.06]" />
                  <ReviewSection title="Platforms">
                    <div className="flex flex-wrap gap-1.5">
                      {form.platforms.map((p) => (
                        <span
                          key={p}
                          className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400 capitalize"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </ReviewSection>
                  <Separator className="bg-white/[0.06]" />
                  <ReviewSection title="Content Verticals">
                    <div className="flex flex-wrap gap-1.5">
                      {form.contentVerticals.map((v) => (
                        <span
                          key={v}
                          className="rounded-md bg-purple-500/10 px-2 py-1 text-xs text-purple-400 capitalize"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </ReviewSection>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="text-gray-500 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? (
                "Setting up..."
              ) : (
                <>
                  Launch TACT
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
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}
