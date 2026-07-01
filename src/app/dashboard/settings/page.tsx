"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, Cpu, Loader2, Key, Globe, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

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

const TRANSLATIONS = {
  en: {
    title: "Settings",
    desc: "Configure system parameters and AI settings",
    saved: "Saved Successfully!",
    saving: "Saving...",
    saveBtn: "Save Settings",
    aiSettings: "AI Generation Settings",
    modelLabel: "OpenRouter AI Model",
    modelDesc: "Choose the model to use for social media content generation. Free models are great for testing, while cheap models offer higher reliability and speed.",
    apiKeyLabel: "Platform API Keys",
    openRouterKey: "OpenRouter API Key",
    openRouterDesc: "Your secure API key for generating AI content and insights.",
    dbStatus: "Firebase Database Status",
    connected: "Connected (Cloud Firestore)",
    languageLabel: "Language & Appearance",
    languageDesc: "Choose your preferred dashboard language and theme.",
  },
  es: {
    title: "Configuración",
    desc: "Configura parámetros del sistema y ajustes de IA",
    saved: "¡Guardado con éxito!",
    saving: "Guardando...",
    saveBtn: "Guardar Configuración",
    aiSettings: "Ajustes de Generación de IA",
    modelLabel: "Modelo de IA (OpenRouter)",
    modelDesc: "Elige el modelo para generar contenido y estrategia. Los gratuitos son buenos para pruebas, los baratos ofrecen más confiabilidad.",
    apiKeyLabel: "Llaves de API (Plataforma)",
    openRouterKey: "OpenRouter API Key",
    openRouterDesc: "Tu llave segura para la generación de contenido e insights.",
    dbStatus: "Estado de la Base de Datos (Firebase)",
    connected: "Conectado (Cloud Firestore)",
    languageLabel: "Idioma y Apariencia",
    languageDesc: "Elige tu idioma preferido y tema visual.",
  }
};

export default function SettingsPage() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.0-flash-exp:free");
  const [apiKey, setApiKey] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load language preference
    const savedLang = localStorage.getItem("tact_lang");
    if (savedLang === "es" || savedLang === "en") setLang(savedLang);

    async function loadBrand() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const brands = await res.json();
          if (brands && brands.length > 0) {
            const activeBrand = brands[0];
            setBrandSlug(activeBrand.slug);
            if (activeBrand.openrouter_model) setSelectedModel(activeBrand.openrouter_model);
            if (activeBrand.openrouter_api_key) setApiKey(activeBrand.openrouter_api_key);
          }
        }
      } catch (err) {
        console.error("Error loading brand:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrand();
  }, []);

  const handleLanguageChange = (newLang: "en" | "es") => {
    setLang(newLang);
    localStorage.setItem("tact_lang", newLang);
  };

  const handleSave = async () => {
    if (!brandSlug) return;
    setSaving(true);
    setSaveSuccess(false);
    
    try {
      const res = await fetch(`/api/brands/${brandSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openrouterModel: selectedModel,
          openrouterApiKey: apiKey
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-[var(--neon)] animate-spin" />
      </div>
    );
  }

  const t = TRANSLATIONS[lang];

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight heading-glow flex items-center gap-3">
            {t.title}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-3 font-medium">
            {t.desc}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]/20 px-3 py-2 rounded-xl animate-fade-in">
              <CheckCircle className="h-4 w-4" /> {t.saved}
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t.saving}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> {t.saveBtn}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Model Card */}
        <div className="lg:col-span-2 glass p-6 space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2 heading-brutal border-b border-[var(--border)] pb-4">
            <Cpu className="h-4 w-4 text-[var(--neon)]/80" /> {t.aiSettings}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block form-label">{t.modelLabel}</label>
              <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                {t.modelDesc}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all duration-300 ${
                        isSelected
                          ? "bg-[var(--neon)]/10 border-[var(--neon)]/30 text-[var(--neon)] shadow-[0_0_15px_rgba(0,113,227,0.1)] dark:shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                          : "bg-[var(--hover-bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-foreground hover:border-[var(--foreground)]/20"
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <p className="text-sm font-bold heading-brutal">
                          {model.name}
                        </p>
                        <p className="text-xs opacity-70">
                          {model.desc}
                        </p>
                        <p className="text-[10px] font-mono opacity-50 pt-1">
                          ID: {model.id}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                          model.badge === "Free"
                            ? "bg-[var(--neon)]/10 text-[var(--neon)] border-[var(--neon)]/20"
                            : model.badge === "Preview"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                              : "bg-[var(--neon-secondary)]/10 text-[var(--neon-secondary)] border-[var(--neon-secondary)]/20"
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

        {/* Right Sidebar Configs */}
        <div className="space-y-6">
          <div className="glass p-6 space-y-5">
            <h3 className="text-sm font-bold flex items-center gap-2 heading-brutal border-b border-[var(--border)] pb-4">
              <Globe className="h-4 w-4 text-[var(--neon)]" /> {t.languageLabel}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">{t.languageDesc}</p>
            
            <div className="flex items-center bg-[var(--input)] p-1 rounded-xl border border-[var(--border)]">
              <button
                onClick={() => handleLanguageChange("en")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === "en" ? "bg-background text-foreground shadow-sm" : "text-[var(--text-muted)] hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange("es")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === "es" ? "bg-background text-foreground shadow-sm" : "text-[var(--text-muted)] hover:text-foreground"
                }`}
              >
                ES
              </button>
            </div>

            <div className="flex items-center bg-[var(--input)] p-1 rounded-xl border border-[var(--border)]">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all ${
                  theme === "light" ? "bg-background text-foreground shadow-sm" : "text-[var(--text-muted)] hover:text-foreground"
                }`}
                title="Light Mode"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all ${
                  theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-[var(--text-muted)] hover:text-foreground"
                }`}
                title="Dark Mode"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all ${
                  theme === "system" ? "bg-background text-foreground shadow-sm" : "text-[var(--text-muted)] hover:text-foreground"
                }`}
                title="System Theme"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>

          </div>

          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 heading-brutal border-b border-[var(--border)] pb-4">
              <Key className="h-4 w-4 text-purple-500" /> {t.apiKeyLabel}
            </h3>
            
            <div className="space-y-4 pt-1">
              <div>
                <label className="form-label">
                  {t.openRouterKey}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="glass-input font-mono text-sm"
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-2">{t.openRouterDesc}</p>
              </div>

              <div className="h-px bg-[var(--border)] my-4" />

              <div>
                <p className="form-label">{t.dbStatus}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--neon-secondary)] animate-pulse" />
                  <span className="text-xs text-[var(--text-muted)] font-semibold font-mono">{t.connected}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
