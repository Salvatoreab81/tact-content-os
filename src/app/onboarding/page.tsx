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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (!data.authenticated) {
            router.push("/login");
            return;
          }
        } else {
          router.push("/login");
          return;
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
        return;
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
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
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] font-bold text-base shadow-[0_0_24px_rgba(0,255,136,0.12)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,255,136,0.2)]">
              T
            </div>
            <span className="text-xl font-bold text-white heading-brutal">TACT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3 heading-glow">
            Set up your brand
          </h1>
          <p className="text-sm text-white/45 font-medium">
            Tell us about your brand to get personalized content
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
                    className={`hidden sm:block w-8 lg:w-16 h-px mx-1 transition-all duration-300 ${
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
                    placeholder="e.g., HUEHUE"
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
                      placeholder="huehue"
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
                    placeholder="e.g., Pet Accessories"
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
                <label className="block form-label mb-2">
                  Describe your brand&apos;s voice *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g., Friendly and playful, using humor and emojis. We speak to pet parents like friends, sharing tips and heartwarming moments..."
                  value={form.toneOfVoice}
                  onChange={(e) =>
                    updateForm({ toneOfVoice: e.target.value })
                  }
                  className="w-full rounded-xl glass-input px-4 py-3 text-sm outline-none resize-none"
                />
              </div>
              <div>
                <p className="text-[10px] text-white/30 mb-3 font-semibold font-mono uppercase tracking-[0.12em]">
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
                      className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/45 hover:text-[#00ff88] hover:border-[#00ff88]/25 hover:bg-[#00ff88]/5 transition-all duration-300"
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
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Target Markets
                </h2>
                <p className="text-sm text-white/40">
                  Where do your customers live?
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => toggleArrayItem("markets", country)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      form.markets.includes(country)
                        ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                        : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {form.markets.length > 0 && (
                <p className="text-xs text-white/30 font-mono">
                  {form.markets.length} market
                  {form.markets.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* Step 3: Platforms */}
          {step === 3 && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 heading-brutal">
                  Platforms
                </h2>
                <p className="text-sm text-white/40">
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
                    className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all duration-300 ${
                      form.platforms.includes(platform.id)
                        ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                        : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
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
                    yellow:
                      "bg-[#ffaa00]/10 border-[#ffaa00]/25 text-[#ffaa00]",
                    purple:
                      "bg-purple-500/10 border-purple-500/25 text-purple-400",
                    green:
                      "bg-[#00cc6a]/10 border-[#00cc6a]/25 text-[#00cc6a]",
                    red: "bg-[#ff3366]/10 border-[#ff3366]/25 text-[#ff3366]",
                    pink: "bg-pink-500/10 border-pink-500/25 text-pink-400",
                  };
                  const isActive = form.contentVerticals.includes(vertical.id);
                  return (
                    <button
                      key={vertical.id}
                      onClick={() =>
                        toggleArrayItem("contentVerticals", vertical.id)
                      }
                      className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all duration-300 ${
                        isActive
                          ? colorMap[vertical.color]
                          : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
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
                <ReviewSection title="Markets">
                  <div className="flex flex-wrap gap-1.5">
                    {form.markets.map((m) => (
                      <span
                        key={m}
                        className="rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 text-xs text-white/50 font-mono"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </ReviewSection>
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <ReviewSection title="Platforms">
                  <div className="flex flex-wrap gap-1.5">
                    {form.platforms.map((p) => (
                      <span
                        key={p}
                        className="rounded-lg bg-[#00ff88]/8 border border-[#00ff88]/12 px-3 py-1.5 text-xs text-[#00ff88] capitalize font-mono"
                      >
                        {p}
                      </span>
                    ))}
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
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="text-white/35 hover:text-white/70 disabled:opacity-20 transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
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
      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-2.5 font-mono">
        {title}
      </p>
      {children}
    </div>
  );
}
