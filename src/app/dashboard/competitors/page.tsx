"use client";

import { useState, useEffect } from "react";
import { Radar, Plus, Trash2, Sparkles, Loader2, Save, TrendingUp, DollarSign, ArrowUpRight, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Competitor {
  id: string;
  name: string;
  url: string;
  prices: string;
  promotions: string;
  topPerforming: string;
  failedContent: string;
  trends: string;
  notes: string;
}

const TRANSLATIONS = {
  en: {
    title: "Competitor Intelligence",
    desc: "Track market rivals, extract ROI/ROT insights, and discover content gaps.",
    addCompetitor: "Add Competitor",
    analyzeBtn: "Analyze Market & ROI Insights",
    analyzing: "Analyzing...",
    saveBtn: "Save Data",
    saving: "Saving...",
    saved: "Saved!",
    insightsTitle: "AI Strategic Insights",
    insightsDesc: "ROI, ROT, and Market Positioning",
    emptyCompetitors: "No competitors tracked yet. Add one to start analyzing the market.",
    fields: {
      name: "Competitor Name",
      url: "Website / Profile URL",
      prices: "Pricing Strategy (What are they charging?)",
      promotions: "Current Promotions / Offers",
      topPerforming: "Top Content (What converts/engages for them?)",
      failedContent: "Failed Experiments (What did they try that flopped?)",
      trends: "Observed Trends / Market Shifts",
      notes: "Additional Notes",
    },
    remove: "Remove"
  },
  es: {
    title: "Inteligencia Competitiva",
    desc: "Rastrea rivales de mercado, extrae insights de ROI/ROT y descubre brechas de contenido.",
    addCompetitor: "Agregar Competidor",
    analyzeBtn: "Analizar Mercado e Insights de ROI",
    analyzing: "Analizando...",
    saveBtn: "Guardar Datos",
    saving: "Guardando...",
    saved: "¡Guardado!",
    insightsTitle: "Insights Estratégicos de IA",
    insightsDesc: "Posicionamiento de Mercado, ROI y ROT",
    emptyCompetitors: "No hay competidores rastreados aún. Agrega uno para empezar.",
    fields: {
      name: "Nombre del Competidor",
      url: "Sitio Web / Perfil",
      prices: "Estrategia de Precios (¿Cuánto cobran?)",
      promotions: "Promociones / Ofertas Actuales",
      topPerforming: "Contenido Estrella (¿Qué les funciona/convierte?)",
      failedContent: "Experimentos Fallidos (¿Qué intentaron y fracasó?)",
      trends: "Tendencias Observadas",
      notes: "Notas Adicionales",
    },
    remove: "Eliminar"
  }
};

export default function CompetitorsPage() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [brand, setBrand] = useState<any>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [insights, setInsights] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("tact_lang");
    if (savedLang === "es" || savedLang === "en") setLang(savedLang);

    async function loadBrand() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const brands = await res.json();
          if (brands && brands.length > 0) {
            const activeBrand = brands[0];
            setBrand(activeBrand);
            
            // Parse existing competitor data
            if (activeBrand.competitor_research) {
              try {
                const parsed = JSON.parse(activeBrand.competitor_research);
                if (parsed.competitors && Array.isArray(parsed.competitors)) {
                  setCompetitors(parsed.competitors);
                  setInsights(parsed.insights || "");
                } else {
                  // Fallback if it's an old string format
                  setCompetitors([{
                    id: Date.now().toString(),
                    name: "Legacy Notes",
                    url: "", prices: "", promotions: "", topPerforming: "", failedContent: "", trends: "",
                    notes: activeBrand.competitor_research
                  }]);
                }
              } catch (e) {
                // If it's not JSON, it's the old raw string
                setCompetitors([{
                  id: Date.now().toString(),
                  name: "Legacy Notes",
                  url: "", prices: "", promotions: "", topPerforming: "", failedContent: "", trends: "",
                  notes: activeBrand.competitor_research
                }]);
              }
            }
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

  const addCompetitor = () => {
    const newComp: Competitor = {
      id: Date.now().toString(),
      name: "", url: "", prices: "", promotions: "", topPerforming: "", failedContent: "", trends: "", notes: ""
    };
    setCompetitors([newComp, ...competitors]);
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  const updateCompetitor = (id: string, field: keyof Competitor, value: string) => {
    setCompetitors(competitors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async (updatedInsights = insights) => {
    if (!brand) return;
    setSaving(true);
    setSaveSuccess(false);
    
    const payload = JSON.stringify({
      competitors,
      insights: updatedInsights
    });

    try {
      const res = await fetch(`/api/brands/${brand.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorResearch: payload
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving competitors:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!brand || competitors.length === 0) return;
    setAnalyzing(true);
    
    try {
      const res = await fetch("/api/generate/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brand.name,
          industry: brand.industry,
          targetAudience: brand.target_audience,
          apiKey: brand.openrouter_api_key,
          model: brand.openrouter_model,
          lang: lang,
          competitors: competitors
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.insights) {
          setInsights(data.insights);
          // Auto-save after analysis
          await handleSave(data.insights);
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  const t = TRANSLATIONS[lang];

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow flex items-center gap-3">
            <Radar className="h-8 w-8 text-[#00ff88]" />
            {t.title}
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            {t.desc}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-[#00ff88] font-semibold bg-[#00ff88]/10 border border-[#00ff88]/20 px-3 py-2 rounded-xl animate-fade-in">
              <CheckCircle className="h-4 w-4" /> {t.saved}
            </span>
          )}
          <Button
            onClick={() => handleSave(insights)}
            disabled={saving || analyzing}
            className="bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {t.saveBtn}
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || competitors.length === 0}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all glow-sm hover:scale-[1.03]"
          >
            {analyzing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t.analyzing}</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> {t.analyzeBtn}</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Competitors List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white heading-brutal">Competitors</h2>
            <Button onClick={addCompetitor} size="sm" className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-mono text-xs rounded-xl">
              <Plus className="h-3.5 w-3.5 mr-1" /> {t.addCompetitor}
            </Button>
          </div>

          {competitors.length === 0 ? (
            <div className="glass p-8 text-center rounded-2xl border-dashed border-white/20">
              <Radar className="h-8 w-8 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">{t.emptyCompetitors}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {competitors.map((comp) => (
                <div key={comp.id} className="glass p-6 rounded-2xl space-y-5 relative group border-l-4 border-l-transparent hover:border-l-[#00ff88] transition-all">
                  
                  <button 
                    onClick={() => removeCompetitor(comp.id)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase font-mono mb-1.5">{t.fields.name}</label>
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => updateCompetitor(comp.id, "name", e.target.value)}
                        placeholder="E.g. Apple"
                        className="w-full bg-black/40 border border-white/[0.08] rounded-xl p-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff88]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase font-mono mb-1.5">{t.fields.url}</label>
                      <input
                        type="text"
                        value={comp.url}
                        onChange={(e) => updateCompetitor(comp.id, "url", e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-black/40 border border-white/[0.08] rounded-xl p-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff88]/50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-green-400/80 uppercase font-mono mb-1.5">
                        <DollarSign className="h-3 w-3" /> {t.fields.prices}
                      </label>
                      <textarea
                        value={comp.prices}
                        onChange={(e) => updateCompetitor(comp.id, "prices", e.target.value)}
                        placeholder="High ticket? Freemium?"
                        className="w-full h-20 bg-black/40 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 resize-y"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-orange-400/80 uppercase font-mono mb-1.5">
                        <Sparkles className="h-3 w-3" /> {t.fields.promotions}
                      </label>
                      <textarea
                        value={comp.promotions}
                        onChange={(e) => updateCompetitor(comp.id, "promotions", e.target.value)}
                        placeholder="Black Friday 50% off..."
                        className="w-full h-20 bg-black/40 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 resize-y"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-purple-400/80 uppercase font-mono mb-1.5">
                        <TrendingUp className="h-3 w-3" /> {t.fields.topPerforming}
                      </label>
                      <textarea
                        value={comp.topPerforming}
                        onChange={(e) => updateCompetitor(comp.id, "topPerforming", e.target.value)}
                        placeholder="Reels about feature X got 1M views..."
                        className="w-full h-24 bg-black/40 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 resize-y"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-red-400/80 uppercase font-mono mb-1.5">
                        <AlertOctagon className="h-3 w-3" /> {t.fields.failedContent}
                      </label>
                      <textarea
                        value={comp.failedContent}
                        onChange={(e) => updateCompetitor(comp.id, "failedContent", e.target.value)}
                        placeholder="They tried a podcast but stopped after 3 episodes..."
                        className="w-full h-24 bg-black/40 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 resize-y"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: ROI Insights & Analytics */}
        <div className="xl:col-span-1">
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#00ff88]" />
              <h2 className="text-lg font-bold text-white heading-brutal">{t.insightsTitle}</h2>
            </div>
            
            <div className="glass p-6 rounded-2xl min-h-[400px] border border-[#00ff88]/20 bg-[#00ff88]/[0.02]">
              {insights ? (
                <div 
                  className="prose prose-invert prose-sm max-w-none prose-headings:text-[#00ff88] prose-headings:font-bold prose-headings:font-mono prose-headings:uppercase prose-a:text-[#00ff88] prose-strong:text-white"
                  dangerouslySetInnerHTML={{
                    __html: insights
                      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n- (.*)/g, '<li>$1</li>')
                  }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                  <ArrowUpRight className="h-10 w-10 mb-4" />
                  <p className="text-sm font-medium">{t.insightsDesc}</p>
                  <p className="text-[10px] mt-2 font-mono uppercase tracking-wider">Awaiting Analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
