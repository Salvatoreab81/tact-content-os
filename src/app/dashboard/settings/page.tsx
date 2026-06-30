"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Save, CheckCircle, Cpu, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODELS = [
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash (Free)",
    desc: "Google's fast, multimodal model. Free and high quality.",
    badge: "Free",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    name: "Nvidia Nemotron 3 Ultra (Free)",
    desc: "Large language model by Nvidia. Free for testing.",
    badge: "Free",
  },
  {
    id: "tencent/hy3-preview",
    name: "Tencent Hunyuan 3 (Preview)",
    desc: "Tencent's preview model. Powerful and versatile.",
    badge: "Preview",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat V3 (Cheap)",
    desc: "DeepSeek's flagship conversational model. Extremely low cost.",
    badge: "Ultra-Cheap",
  },
  {
    id: "deepseek/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    desc: "DeepSeek's upcoming fast model. High throughput.",
    badge: "Preview",
  },
];

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.0-flash-exp:free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tact_openrouter_model");
    if (saved) {
      setSelectedModel(saved);
    }
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    // Save to localStorage
    localStorage.setItem("tact_openrouter_model", selectedModel);
    
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow flex items-center gap-3">
            Settings
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            Configure system parameters and AI settings
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
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Model Card */}
        <div className="lg:col-span-2 glass p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
            <Cpu className="h-4 w-4 text-[#00ff88]/60" /> AI Generation Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block form-label mb-3">OpenRouter AI Model</label>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">
                Choose the model to use for social media content generation. Free models are great for testing, while cheap models offer higher reliability and speed.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all duration-300 ${
                        isSelected
                          ? "bg-[#00ff88]/10 border-[#00ff88]/25 text-[#00ff88]"
                          : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/[0.15]"
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <p className="text-sm font-bold text-white heading-brutal">
                          {model.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {model.desc}
                        </p>
                        <p className="text-[10px] font-mono text-white/30 pt-1">
                          ID: {model.id}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                          model.badge === "Free"
                            ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20"
                            : model.badge === "Preview"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}
                      >
                        {model.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* API Credentials Info Card */}
        <div className="space-y-6">
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Settings className="h-4 w-4 text-purple-400" /> Platform API Keys
            </h3>
            
            <div className="space-y-3.5 pt-1">
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">OpenRouter API Status</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-xs text-white/70 font-semibold font-mono">Active (Configured in .env)</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">Firebase Database Status</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-xs text-white/70 font-semibold font-mono">Connected (Cloud Firestore)</span>
                </div>
              </div>
              
              <div className="h-px bg-white/[0.06] my-4" />
              
              <p className="text-xs text-white/35 leading-relaxed">
                API credentials are read directly from the host system environment (<code className="bg-white/10 px-1 py-0.5 rounded font-mono">.env</code>). To change credentials, modify the environment file and restart the server.
              </p>
            </div>
          </div>

          {/* Onboarding Setup Card */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal border-b border-white/[0.06] pb-4">
              <Building2 className="h-4 w-4 text-cyan-400" /> Brand Setup & Onboarding
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Need to set up a new brand profile or redefine your content strategist parameters? Launch the interactive onboarding sequence again.
            </p>
            <div className="pt-2">
              <Link href="/onboarding">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition-all duration-300 rounded-xl text-xs">
                  Re-run Brand Onboarding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
