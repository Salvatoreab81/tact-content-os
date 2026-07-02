"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sparkles, Globe, Key, Cpu, ArrowRight, Check, Monitor, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODELS = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)" },
  { id: "nvidia/nemotron-3-ultra-550b-a55b:free", name: "Nvidia Nemotron 3 Ultra (Free)" },
  { id: "tencent/hy3-preview", name: "Tencent Hunyuan 3 (Preview)" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat V3 (Cheap)" },
  { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash" },
];

export default function SetupWizard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  const [lang, setLang] = useState<"en" | "es">("en");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  useEffect(() => {
    setMounted(true);
    // Auto-detect browser language
    const browserLang = navigator.language.startsWith("es") ? "es" : "en";
    setLang(browserLang);
  }, []);

  const handleFinish = () => {
    // Save system preferences locally so Onboarding can read them when creating the brand
    localStorage.setItem("tact_lang", lang);
    localStorage.setItem("tact_setup_api_key", apiKey);
    localStorage.setItem("tact_setup_model", selectedModel);
    
    // Redirect to Brand Onboarding
    router.push("/onboarding");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen aurora-bg flex flex-col items-center justify-center p-4">
      
      {/* Dynamic Header */}
      <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 text-[var(--neon)] font-bold text-2xl shadow-[0_0_40px_rgba(0,113,227,0.2)] dark:shadow-[0_0_40px_rgba(0,255,136,0.2)] mb-6">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight heading-glow mb-3">
          {lang === "en" ? "System Setup" : "Configuración del Sistema"}
        </h1>
        <p className="text-[var(--text-muted)] font-medium text-lg">
          {lang === "en" ? "Let's configure your environment." : "Preparemos tu entorno de trabajo."}
        </p>
      </div>

      {/* Wizard Card */}
      <div className="glass w-full max-w-xl p-8 sm:p-12 relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Step 1: Locale & Appearance */}
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold heading-brutal flex justify-center items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                {lang === "en" ? "Preferences" : "Preferencias"}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Language */}
              <div className="space-y-3">
                <label className="form-label">{lang === "en" ? "Interface Language" : "Idioma de la Interfaz"}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLang("en")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      lang === "en" ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)] shadow-sm" : "border-[var(--border)] bg-[var(--input)] text-[var(--text-muted)] hover:border-[var(--foreground)]/20"
                    }`}
                  >
                    <span className="block font-bold">English</span>
                  </button>
                  <button
                    onClick={() => setLang("es")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      lang === "es" ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)] shadow-sm" : "border-[var(--border)] bg-[var(--input)] text-[var(--text-muted)] hover:border-[var(--foreground)]/20"
                    }`}
                  >
                    <span className="block font-bold">Español</span>
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <label className="form-label">{lang === "en" ? "Appearance" : "Apariencia Visual"}</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 flex flex-col items-center gap-2 rounded-xl border transition-all ${
                      theme === "light" ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)]" : "border-[var(--border)] bg-[var(--input)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-xs font-bold">{lang === "en" ? "Light" : "Claro"}</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 flex flex-col items-center gap-2 rounded-xl border transition-all ${
                      theme === "dark" ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)]" : "border-[var(--border)] bg-[var(--input)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-xs font-bold">{lang === "en" ? "Dark" : "Oscuro"}</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`p-4 flex flex-col items-center gap-2 rounded-xl border transition-all ${
                      theme === "system" ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)]" : "border-[var(--border)] bg-[var(--input)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs font-bold">System</span>
                  </button>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full btn-primary h-12 text-md">
              {lang === "en" ? "Continue" : "Continuar"} <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: API & AI Engine */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold heading-brutal flex justify-center items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-500" />
                {lang === "en" ? "AI Engine" : "Motor de IA"}
              </h2>
            </div>

            <div className="space-y-6">
              {/* API Key */}
              <div className="space-y-3">
                <label className="form-label flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  {lang === "en" ? "OpenRouter API Key" : "Llave API de OpenRouter"}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="glass-input font-mono text-sm py-3"
                />
                <p className="text-xs text-[var(--text-muted)]">
                  {lang === "en" ? "Your secure API key connects TACT to the top AI models." : "Tu llave segura conecta TACT con los mejores modelos de IA."}
                </p>
              </div>

              {/* Model */}
              <div className="space-y-3">
                <label className="form-label">
                  {lang === "en" ? "Primary AI Model" : "Modelo de IA Principal"}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-[var(--ring)] transition-all cursor-pointer appearance-none"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-background text-foreground">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-[var(--border)] bg-transparent text-foreground h-12">
                {lang === "en" ? "Back" : "Atrás"}
              </Button>
              <Button onClick={handleFinish} className="flex-[2] btn-primary h-12 text-md">
                {lang === "en" ? "Start Brand Config" : "Iniciar Config. de Marca"} <Check className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2 mt-8">
        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[var(--neon)]' : 'bg-[var(--border)]'}`} />
        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[var(--neon)]' : 'bg-[var(--border)]'}`} />
      </div>
    </div>
  );
}
