import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Wand2, 
  BookOpen, 
  Sliders, 
  Share2, 
  Check, 
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  HelpCircle,
  TrendingUp,
  Lightbulb,
  Layers,
  MousePointerClick,
  X
} from "lucide-react";
import { STYLES_DATABASE } from "./data";
import { generateDynamicPrompt } from "./promptEngine";
import { PromptStyle } from "./types";
import BlogDrawer from "./components/BlogDrawer";
import FaqAccordion from "./components/FaqAccordion";
import PromptOutput from "./components/PromptOutput";
import LegalDrawer from "./components/LegalDrawer";

// 5 Core visible Quick Inspiration cards below the input field that instantly populate
const QUICK_INSPIRATIONS = [
  { label: "Cyberpunk City 🌆", text: "neon street racer winding down raw rain-slicked Tokyo alleyways", style: "cyberpunk" },
  { label: "Anime Warrior 🌸", text: "katana fighter standing tall under heavy pink cherry blossom drift", style: "anime" },
  { label: "Luxury Car 🏎️", text: "sleek carbon-fiber electric concept coupe floating in interstellar mist", style: "luxury" },
  { label: "Futuristic Robot 🤖", text: "bionic humanoid android reading an ancient leather book under candlelight", style: "general" },
  { label: "Fantasy Castle 🏰", text: "majestic quartz crystal fortress perched above foggy floating sky islands", style: "fantasy" }
];

// Refined clickable Trending Prompts
const TRENDING_PROMPTS = [
  {
    title: "Cinematic Portrait",
    emoji: "📸",
    subject: "grizzled mountain explorer staring deeply into camera, face wet with snow, heavy atmospheric snowstorm background",
    style: "realistic",
    desc: "Vivid photography with dramatic side light."
  },
  {
    title: "Fantasy Dragon",
    emoji: "✨",
    subject: "mythical ancient gemstone-scaled dragon coiling around celestial mountain peak, solar halo glow",
    style: "fantasy",
    desc: "Epic concept painting with magical twilight mist."
  },
  {
    title: "Neon Tokyo",
    emoji: "🏮",
    subject: "neon cybernetic street racer standing leaning on customized heavy motorcycle, rain-slicked pavement reflections",
    style: "cyberpunk",
    desc: "Neon pink-cyan backlight with escaping smog."
  },
  {
    title: "Anime Girl",
    emoji: "🌸",
    subject: "anime student girl with headphones sitting on a rustic bench next to a sunny railway platform at golden hour",
    style: "anime",
    desc: "Kyoto animation vibe with warm sun beams."
  },
  {
    title: "Luxury Interior",
    emoji: "💎",
    subject: "minimalist marble lounge penthouse overlooking sweeping sunset sea, floor-to-ceiling glass panel windows",
    style: "architecture",
    desc: "High-end Architectural Digest photography look."
  }
];

export default function App() {
  // Active Preset Controller
  const [activeStyle, setActiveStyle] = useState<PromptStyle>("general");
  
  // Custom SEO syncing via URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && Object.keys(STYLES_DATABASE).includes(cat)) {
      setActiveStyle(cat as PromptStyle);
    }
  }, []);

  const handleStyleChange = (styleId: PromptStyle) => {
    setActiveStyle(styleId);
    const url = new URL(window.location.href);
    url.searchParams.set("category", styleId);
    window.history.pushState({}, "", url.toString());
  };

  // State bindings aligned with model requests
  const [subject, setSubject] = useState("");
  const [promptLength, setPromptLength] = useState<"short" | "medium" | "long">("medium");
  const [language, setLanguage] = useState("English");
  const [negativeEnabled, setNegativeEnabled] = useState(true);
  const [environment, setEnvironment] = useState("");
  const [lighting, setLighting] = useState("");
  const [camera, setCamera] = useState("");
  const [customModifiers, setCustomModifiers] = useState<string[]>([]);
  const [renderQuality, setRenderQuality] = useState<"standard" | "masterpiece" | "cinematic-raw">("masterpiece");
  
  // Output states
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUsedEngine, setLastUsedEngine] = useState<"local" | "ai">("local");

  // Advanced-hidden Engine Selector: Users default to Smart AI Enhancement
  const [useAi, setUseAi] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Layout presentation controls
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<"privacy" | "terms" | "contact">("privacy");

  const openLegalTab = (tab: "privacy" | "terms" | "contact") => {
    setLegalInitialTab(tab);
    setLegalOpen(true);
  };

  // Retrieve current active config preset
  const activeConfig = STYLES_DATABASE[activeStyle] || STYLES_DATABASE.general;

  // Clear secondary mods when style is updated to ensure non-contamination
  useEffect(() => {
    setCustomModifiers([]);
    setEnvironment("");
    setLighting("");
    setCamera("");
  }, [activeStyle]);

  // Dynamic SEO handler for title tags, descriptions and dynamically generated canonical injection
  useEffect(() => {
    if (activeConfig) {
      document.title = `${activeConfig.seoTitle || "AI Prompt Enhancer"} | Promptlix`;
      
      // Update dynamic page meta description for scraper bot readability
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `${activeConfig.description || activeConfig.tagline}. Optimized for Midjourney, Stable Diffusion, and DALL-E 3 on Promptlix.`);

      // Update dynamic canonical link tag
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      const canonicalURL = `${window.location.origin}${window.location.pathname}?category=${activeStyle}`;
      canonicalLink.setAttribute('href', canonicalURL);
    }
  }, [activeStyle, activeConfig]);

  // Handle clickable quick pre-fill tags
  const handleSelectTrending = (item: any) => {
    setSubject(item.text || item.subject || "");
    handleStyleChange(item.style as PromptStyle);
    setApiError(null);
    
    // Focus textarea for comfortable user experience
    const inputEl = document.getElementById("prompt-subject-input");
    if (inputEl) {
      inputEl.focus();
    }
  };

  // Copy share link
  const handleShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?category=${activeStyle}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Fun surprise mode
  const handleSurpriseMe = () => {
    const subjects = [
      "sleek matte-black electric supercar parked outside sci-fi brutalist glass villa",
      "glistening mechanical owl with golden clockwork gears perched in deep dark forest",
      "gothic stone observatory cathedral tucked inside a massive shining celestial comet outline",
      "cybernetic samurai kitten carrying katana walking through cozy rainy retro streets",
      "elven forest princess sipping tea next to a mystical bioluminescent river under twin stars"
    ];
    const lightings = [
      "volumetric moody rim-lit glow",
      "dual-tone violet and phosphor amber highlights",
      "epic golden hour backlit beams"
    ];
    const styles: PromptStyle[] = ["realistic", "anime", "cinematic", "fantasy", "cyberpunk"];
    
    const chosenSub = subjects[Math.floor(Math.random() * subjects.length)];
    const chosenLight = lightings[Math.floor(Math.random() * lightings.length)];
    const chosenStyle = styles[Math.floor(Math.random() * styles.length)];

    setSubject(chosenSub);
    setLighting(chosenLight);
    handleStyleChange(chosenStyle);
    setApiError(null);
  };

  const toggleModifier = (mod: string) => {
    if (customModifiers.includes(mod)) {
      setCustomModifiers(customModifiers.filter(m => m !== mod));
    } else {
      setCustomModifiers([...customModifiers, mod]);
    }
  };

  // Transmutation Workflow 
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!subject.trim()) {
      setApiError("Please list your raw visual idea or choose an inspiration first.");
      return;
    }
    
    setApiError(null);
    setIsGenerating(true);

    if (useAi) {
      try {
        const payload = {
          subject,
          style: activeConfig.name,
          promptLength,
          language,
          negativeEnabled,
          selectedOptionWords: [
            environment ? `environment: ${environment}` : "",
            lighting ? `lighting: ${lighting}` : "",
            camera ? `camera profile: ${camera}` : "",
            renderQuality === "masterpiece" ? "masterpiece look, 8k resolution detailed" : "",
            renderQuality === "cinematic-raw" ? "raw cinematic rendering, shot on 35mm film" : "",
            ...customModifiers
          ].filter(Boolean)
        };

        const res = await fetch("/api/enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server status ${res.status}`);
        }

        const data = await res.json();
        
        // Append Render Quality keywords to AI result for extra richness
        let finalPromptResult = data.enhancedPrompt;
        if (renderQuality === "masterpiece" && !finalPromptResult.toLowerCase().includes("masterpiece")) {
          finalPromptResult += ", 8k resolution, cinematic atmosphere, masterpiece lighting";
        } else if (renderQuality === "cinematic-raw" && !finalPromptResult.toLowerCase().includes("hasselblad")) {
          finalPromptResult += ", cinematic raw contrast, shot on Hasselblad, --style raw --v 6.1";
        }

        setEnhancedPrompt(finalPromptResult);
        setNegativePrompt(negativeEnabled ? data.negativePrompt : "");
        setLastUsedEngine("ai");
      } catch (error: any) {
        const errStr = String(error).toLowerCase();
        let message = "Prompt enhancement temporarily unavailable. Automatically switched to our high-fidelity dynamic Offline Backup Formulas so you can keep crafting majestic prompts with zero interruptions!";
        let isExpectedError = false;
        
        if (errStr.includes("403") || errStr.includes("permission") || errStr.includes("forbidden") || errStr.includes("leaked") || errStr.includes("unauthorized") || errStr.includes("api key")) {
          isExpectedError = true;
          message = "Prompt enhancement temporarily unavailable. The active AI API key under Settings is inactive or unauthorized. We have automatically activated our high-fidelity dynamic Offline Backup Formulas so you can continue working smoothly!";
        } else if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("limit") || errStr.includes("exhausted") || errStr.includes("rate")) {
          isExpectedError = true;
          message = "Prompt enhancement temporarily unavailable. The daily AI dynamic quota limit was reached. We have automatically activated our high-fidelity dynamic Offline Backup Formulas so you can keep crafting magnificent prompts without interruption!";
        }
        
        if (isExpectedError) {
          console.warn("AI Optimization handled gracefully: Switched to high-fidelity Offline Backup engine.", errStr);
        } else {
          console.error("AI Optimization query failed:", error);
        }
        
        setApiError(message);
        generateLocalFallback();
      } finally {
        setIsGenerating(false);
      }
    } else {
      generateLocalFallback();
      setIsGenerating(false);
    }
  };

  // Offline high-fidelity formulas compilation
  const generateLocalFallback = () => {
    const { prompt, negative } = generateDynamicPrompt({
      subject,
      style: activeStyle,
      promptLength,
      language,
      negativeEnabled,
      environment,
      lighting,
      camera,
      customModifiers,
      renderQuality
    });

    setEnhancedPrompt(prompt);
    setNegativePrompt(negative);
    setLastUsedEngine("local");
  };

  // Categories Visibility config
  const MAIN_PRESETS: { key: PromptStyle; label: string; emoji: string }[] = [
    { key: "realistic", label: "Photography", emoji: "📷" },
    { key: "anime", label: "Anime & Manga", emoji: "🌸" },
    { key: "cinematic", label: "Cinematic Film", emoji: "🎬" },
    { key: "fantasy", label: "Enchanted Fantasy", emoji: "✨" },
    { key: "logo", label: "Vector Logo", emoji: "📐" }
  ];

  const SECONDARY_PRESETS_KEYS: PromptStyle[] = ["general", "luxury", "architecture", "cyberpunk"];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col pb-24 sm:pb-0 selection:bg-emerald-500 selection:text-black" id="app-root">
      
      {/* 🔮 ULTRA-CLEAN STICKY GLASS HEADER */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-3 p-4 sm:px-6 lg:px-8 transition-all" id="main-header">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo element */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleStyleChange("general")}>
            <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/15 active:scale-95 transition-all duration-350 group-hover:shadow-emerald-400/30" id="header-logo-badge">
              {/* Glassmorphic inner bezel frame */}
              <div className="absolute inset-0.5 rounded-[10px] bg-zinc-950 flex items-center justify-center group-hover:bg-[#111] transition-all">
                <span className="font-display font-black text-base tracking-tighter bg-gradient-to-br from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center select-none" style={{ textShadow: "0 0 10px rgba(16,185,129,0.25)" }}>
                  P
                </span>
              </div>
              {/* Subtle top-right tech-indicator dot */}
              <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                Prompt<span className="text-emerald-400 font-extrabold">lix</span>
              </h1>
              <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 block tracking-normal mt-0.5">
                AI Prompt Enhancer
              </span>
            </div>
          </div>

          {/* Action pills in header */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setBlogOpen(true)}
              className="px-3.5 py-1.5 border border-white/5 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl text-[10px] uppercase tracking-wider font-extrabold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              id="blog-trigger-btn"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Academy</span>
            </button>

            <button
              onClick={handleShareLink}
              className="px-3.5 py-1.5 border border-white/5 bg-zinc-900/40 hover:bg-zinc-900 rounded-xl text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              id="share-link-btn"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 🚀 COMPACT HERO BANNER (Top/Bottom padding significantly reduced to bring input above page fold) */}
      <section className="relative overflow-hidden bg-[#070707] border-b border-white/5 pt-8 pb-7 px-4 text-center" id="seo-hero-banner">
        {/* Sleek radial background elements */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-3.5">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/10 text-[10px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> AI Prompt Generator
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3.5xl text-white tracking-tight uppercase" id="hero-title">
            AI Prompt Enhancer
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed" id="hero-subtitle">
            Turn simple ideas into cinematic, detailed and professional AI image prompts instantly.
          </p>

          {/* Optimized SEO Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1.5 opacity-60" id="seo-tag-clouds">
            {["AI Prompt Generator", "AI Prompt Enhancer", "AI Image Prompt Generator", "Midjourney Prompts", "Cinematic AI Prompts"].map((keyword, i) => (
              <span key={i} className="text-[9px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5 hover:text-emerald-400 transition-colors">
                {keyword}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* 🛠️ MAIN APPLICATION WORKSPACE */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main-content">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: CONTROLS CONFIGURATOR (7 Cols) */}
          <form onSubmit={handleGenerate} className="lg:col-span-7 space-y-5" id="generator-form">
            
            {/* STEP 1: PROMPT INPUT */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0D0D] space-y-4 shadow-xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-800/10 blur-xl pointer-events-none" />

              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-400 text-black text-[10px] font-extrabold flex items-center justify-center">1</div>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-white">Describe Your Raw Idea</h3>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-white/5">
                  Step 1 of 2
                </span>
              </div>

              {/* Advanced soft glow Textarea block */}
              <div className="relative group">
                <textarea
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (apiError) setApiError(null);
                  }}
                  id="prompt-subject-input"
                  placeholder="Describe your idea… e.g. cinematic samurai standing in rain"
                  className="w-full h-28 bg-[#060606] border border-white/5 focus:border-emerald-500/40 rounded-xl p-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 transition-all resize-none placeholder-zinc-650 leading-relaxed shadow-inner"
                />
                
                {subject && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubject("");
                      setApiError(null);
                    }}
                    className="absolute right-3.5 bottom-3.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-white/5 text-[9px] uppercase font-mono text-zinc-400 hover:text-white cursor-pointer transition-colors"
                    id="clear-subject-btn"
                  >
                    Clear Input
                  </button>
                )}
              </div>

              {/* STEP 1.5: MORE VISIBLE COMPACT PROMPT INSPIRATIONS */}
              <div className="space-y-2 pt-1" id="examples-wrapper">
                <span className="text-[9.5px] font-semibold text-zinc-500 uppercase tracking-wider block flex items-center gap-1 bg-zinc-950/40 px-2 py-1 rounded border border-white/5 w-fit">
                  <Lightbulb className="w-3 h-3 text-emerald-400" />
                  <span>Popular Visual Inspirations (Click to pre-fill):</span>
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_INSPIRATIONS.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectTrending(item)}
                      className="px-3 py-1.5 text-xs rounded-xl bg-[#141414] hover:bg-zinc-800 hover:border-zinc-700 hover:text-white border border-white/5 text-zinc-300 cursor-pointer transition-all active:scale-95 flex items-center gap-1 font-medium font-sans"
                      id={`example-chip-${index}`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* STEP 2: PREMIUM SELECTOR CARDS GRID */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0D0D] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-400 text-black text-[10px] font-extrabold flex items-center justify-center">2</div>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-white">Choose Preset Style</h3>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  {activeConfig.name} Selected
                </span>
              </div>

              {/* Interactive style selection grid featuring 5 premium card buttons */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5" id="style-tabs-container">
                {MAIN_PRESETS.map((preset) => {
                  const isSelected = activeStyle === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handleStyleChange(preset.key)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden group flex flex-col justify-between min-h-[75px] ${
                        isSelected 
                          ? "bg-white border-white text-black font-black shadow-lg shadow-white/5 transform scale-[1.01]" 
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                      id={`style-btn-${preset.key}`}
                    >
                      <span className="text-xl leading-none">{preset.emoji}</span>
                      
                      <div className="mt-2.5">
                        <span className="block font-sans font-bold uppercase tracking-wider text-[10px] truncate leading-none">
                          {preset.label}
                        </span>
                      </div>

                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Preset Styles Dropdown */}
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Need more specific genre formulas?</span>
                </div>

                <div className="relative min-w-[170px]" id="more-style-container">
                  <select
                    value={SECONDARY_PRESETS_KEYS.includes(activeStyle) ? activeStyle : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) handleStyleChange(val as PromptStyle);
                    }}
                    className={`w-full py-1.5 px-3 bg-zinc-900 border border-white/10 rounded-lg text-[10px] uppercase font-bold tracking-wider outline-none text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer appearance-none ${
                      SECONDARY_PRESETS_KEYS.includes(activeStyle) ? "bg-white/10 font-black border-emerald-500/30 text-emerald-400" : ""
                    }`}
                    id="more-styles-dropdown"
                  >
                    <option value="" disabled className="bg-zinc-950 text-zinc-500">
                      {SECONDARY_PRESETS_KEYS.includes(activeStyle) 
                        ? `⚙️ ${activeConfig.name.toUpperCase().substring(0, 15)}`
                        : "➕ More Style Presets..."}
                    </option>
                    {SECONDARY_PRESETS_KEYS.map((key) => {
                      const item = STYLES_DATABASE[key];
                      return (
                        <option key={key} value={key} className="bg-zinc-950 text-white font-sans text-xs">
                          {item.emoji} {item.name.replace("Engine", "")}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Style mode subtitle tagline */}
              <div className="flex items-start gap-1 p-1 bg-zinc-950/20 rounded">
                <span className="text-zinc-500 text-xs mt-0.5">•</span>
                <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                  <span className="text-emerald-400 font-bold uppercase">{activeConfig.name} Active</span> — {activeConfig.tagline}. {activeConfig.description}
                </p>
              </div>
            </div>

            {/* COMPOSITE API MESSAGES OR FALLBACK NOTIFICATIONS */}
            {apiError && (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 relative flex items-start gap-3.5 shadow-lg shadow-black/40 transition-all duration-300" id="api-error-card">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Info className="w-4.5 h-4.5 shrink-0" />
                </div>
                <div className="space-y-1.5 flex-1 pr-6">
                  <span className="inline-block text-[9.5px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Engine Update
                  </span>
                  <p className="text-xs text-amber-200 leading-relaxed font-medium">
                    {apiError}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApiError(null)}
                  className="absolute top-3 right-3 p-1 rounded-md text-amber-400/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Dismiss message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 3: HIGH-IMPACT NEON ACTION CTA BUTTON (Pulsing neon glow borders) */}
            <div className="relative pt-1" id="submit-button-container">
              <button
                type="submit"
                disabled={isGenerating || !subject.trim()}
                className="w-full py-4 bg-[#00FF41] text-black font-extrabold text-sm uppercase tracking-widest hover:bg-[#39ff68] active:scale-[0.99] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed select-none shadow-xl shadow-emerald-500/10"
                id="submit-prompt-btn"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Transmuting Art Coordinates...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 stroke-[2.5px]" />
                    <span>✨ Enhance Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* STEP 4: COLLAPSIBLE ADVANCED SETTINGS ACCORDION */}
            <div className="border border-white/5 rounded-2xl bg-zinc-950/40 overflow-hidden shadow-md" id="advanced-settings-wrapper">
              
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-wider cursor-pointer bg-[#0D0D0D]/90 transition-all border-b border-white/5"
                id="advanced-toggle-btn"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-zinc-500" />
                  <span>Configure Advanced Settings (Optional options)</span>
                </div>
                {isAdvancedOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isAdvancedOpen && (
                <div className="p-5 sm:p-6 space-y-5 bg-zinc-950/40" id="advanced-expanded-panel">
                  
                  {/* Select option variables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Background Backdrop option */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Environment / Background Setting
                      </label>
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 p-2.5 text-xs rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase font-mono cursor-pointer"
                        id="environment-select"
                      >
                        <option value="" className="bg-zinc-950">Auto-generate Backdrop</option>
                        <option value="rainy cobblestone street at dusk" className="bg-zinc-950">Rainy Cobblestone Street</option>
                        <option value="surrounded by bioluminescent forest glow" className="bg-zinc-950">Bioluminescent Forest</option>
                        <option value="foggy mountains under misty cloud layers" className="bg-zinc-950">Misty High Peaks</option>
                        <option value="sleek minimalist studio with backlighting shadow" className="bg-zinc-950 font-sans">Minimal Studio Backdrop</option>
                        <option value="deep cosmic interstellar dust nebula backdrop" className="bg-zinc-950">Interstellar Cosmic Nebula</option>
                        <option value="sunny seaside beach with soft shallow turquoise waves" className="bg-zinc-950">Tropical Turquoise Sea</option>
                      </select>
                    </div>

                    {/* Scene lighting preset */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Target Lighting Tone
                      </label>
                      <select
                        value={lighting}
                        onChange={(e) => setLighting(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 p-2.5 text-xs rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase font-mono cursor-pointer"
                        id="lighting-select"
                      >
                        <option value="" className="bg-zinc-950">Auto-generate Lighting</option>
                        <option value="cinematic split volumetric warm shadows" className="bg-zinc-950">Volumetric Warm Beams</option>
                        <option value="neon magenta and phosphor green dual-light gradient" className="bg-zinc-950">Neon Cyber Dual-Tone</option>
                        <option value="early dawn golden-hour rim backlit glow" className="bg-zinc-950">Golden Hour Rim Lighting</option>
                        <option value="moody low-key light casting heavy drop-shadows" className="bg-zinc-950 font-sans">Classic Noir Dramatic</option>
                        <option value="even soft diffuse studio lighting with ring specular" className="bg-zinc-950 font-sans">Soft Even Studio Lighting</option>
                      </select>
                    </div>

                    {/* Camera profile option */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Lens Setting / Camera Aspect
                      </label>
                      <select
                        value={camera}
                        onChange={(e) => setCamera(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 p-2.5 text-xs rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase font-mono cursor-pointer"
                        id="camera-select"
                      >
                        <option value="" className="bg-zinc-950">Auto-generate lens spec</option>
                        <option value="shot on Hasselblad medium format rig, sharp details" className="bg-zinc-950">Hasselblad 100c Portrait</option>
                        <option value="85mm prime lens f/1.4 portrait compression setting" className="bg-zinc-950">85mm Prime Portrait (f/1.4)</option>
                        <option value="anamorphic 35mm lens with wide aspect crop flare" className="bg-zinc-950">Anamorphic Widescreen 35mm</option>
                        <option value="symmetrical direct architectural camera alignment grid" className="bg-zinc-950">Symmetrical Line-up</option>
                        <option value="macro hyper detailed focus with crystal clear depth" className="bg-zinc-950">Macro Close-Up Focus</option>
                      </select>
                    </div>

                    {/* Destination Prompt Language */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Destination Prompt Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 p-2.5 text-xs rounded-xl text-zinc-300 focus:outline-none focus:border-emerald-500 uppercase font-mono cursor-pointer"
                        id="language-select"
                      >
                        <option value="English" className="bg-zinc-950">English (Recommended)</option>
                        <option value="Traditional Hindi" className="bg-zinc-950">Hindi (हिंदी)</option>
                        <option value="Spanish" className="bg-zinc-950">Spanish (Español)</option>
                        <option value="Japanese" className="bg-zinc-950">Japanese (日本語)</option>
                        <option value="French" className="bg-zinc-950">French (Français)</option>
                        <option value="German" className="bg-zinc-950">German (Deutsch)</option>
                      </select>
                    </div>

                  </div>

                  {/* Length and Negatives option */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                    
                    {/* Prompt length settings */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Prompt Narrative Length
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1.5 rounded-xl border border-white/5 text-[10px]">
                        {(["short", "medium", "long"] as const).map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setPromptLength(l)}
                            className={`py-1.5 rounded-lg uppercase tracking-wider font-extrabold cursor-pointer transition-colors ${
                              promptLength === l 
                                ? "bg-zinc-800 text-white font-bold" 
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                            id={`length-btn-${l}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Negative toggle option */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Clean Anomalies (Banned Artifacts)
                      </label>
                      <button
                        type="button"
                        onClick={() => setNegativeEnabled(!negativeEnabled)}
                        className="w-full h-[41px] flex items-center justify-between px-3.5 bg-zinc-900 border border-white/5 rounded-xl text-xs text-zinc-300 hover:border-zinc-500 select-none cursor-pointer transition-all"
                      >
                        <span>Enable Negative Prompting</span>
                        <div className={`w-7 h-4 rounded-full p-0.5 transition-colors relative ${negativeEnabled ? "bg-[#00FF41]" : "bg-zinc-800"}`}>
                          <div className={`w-3 h-3 rounded-full transition-transform ${negativeEnabled ? "translate-x-3 bg-black" : "translate-x-0 bg-zinc-500"}`} />
                        </div>
                      </button>
                    </div>

                  </div>

                  {/* Render Quality presets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                    
                    {/* Render quality state option */}
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Prompt Render Quality
                      </label>
                      <select
                        value={renderQuality}
                        onChange={(e: any) => setRenderQuality(e.target.value)}
                        className="w-full bg-[#111] border border-white/5 p-2.5 text-xs rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase font-mono cursor-pointer"
                        id="render-quality-select"
                      >
                        <option value="standard" className="bg-zinc-950 font-sans">Standard Grid Draft</option>
                        <option value="masterpiece" className="bg-zinc-950 font-sans">Masterpiece Ultra-HD (Optimized)</option>
                        <option value="cinematic-raw" className="bg-zinc-950 font-sans">Cinematic Raw Hasselblad Format</option>
                      </select>
                    </div>

                    {/* Modifiers tags keywords selector */}
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono gap-1">
                        Category Modifier Tags (Pick to add):
                      </label>
                      <div className="flex flex-wrap gap-1" id="modifier-chips-container">
                        {Object.values(activeConfig.localKeywords).flatMap(array => array).slice(0, 4).map((keyword, i) => {
                          const isSelected = customModifiers.includes(keyword);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleModifier(keyword)}
                              className={`px-2 py-1 rounded-lg text-[9px] uppercase font-bold border transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-white border-white text-black" 
                                  : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              }`}
                              id={`modifier-btn-${i}`}
                            >
                              {isSelected ? "✓" : "+"} {keyword.replace("surrounded by ", "").substring(0, 16)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* REMOVED TECHNICAL CONFUSION ENGINE SELECTION (Moved completely inside advanced panels layout) */}
                  <div className="space-y-1.5 col-span-1 md:col-span-2 pt-3 border-t border-white/5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                      Optimization Processing Engine
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-white/5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => { setUseAi(true); setApiError(null); }}
                        className={`py-2 rounded-lg uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                          useAi 
                            ? "bg-emerald-400 text-black shadow-lg shadow-emerald-400/10" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                        id="toggle-ai-engine-btn"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Smart AI Enhancement</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUseAi(false); setApiError(null); }}
                        className={`py-2 rounded-lg uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                          !useAi 
                            ? "bg-zinc-800 text-white" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                        id="toggle-local-engine-btn"
                      >
                        <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Offline Formula Templates</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Random custom mock parameters link */}
            <div className="flex items-center justify-end text-right pr-1">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="text-[10px] text-zinc-500 hover:text-white uppercase font-mono tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer bg-zinc-900/40 p-2 py-1.5 rounded-lg border border-white/5 hover:border-white/10"
                id="surprise-alternative-link"
              >
                <span>Don't know what to write? Generate surprise ideas 🎲</span>
              </button>
            </div>

          </form>

          {/* COLUMN 2: OUTPUT OUTCOMES (5 Cols) */}
          <section className="lg:col-span-5 space-y-6" id="output-sidebar">
            
            {/* Display Outcomes section */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-mono font-extrabold tracking-widest uppercase block mb-1">
                03. Transmuted Output Result
              </span>
              <PromptOutput 
                enhancedPrompt={enhancedPrompt}
                negativePrompt={negativePrompt}
                isGenerating={isGenerating}
                styleName={activeConfig.name}
                isAiEnhanced={lastUsedEngine === "ai"}
                tips={activeConfig.tips}
              />
            </div>

            {/* QUICK ASPECT RATIOS SECTION CHEATSHEETS */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0D0D] space-y-4 shadow-xl text-left">
              <h4 className="font-display font-black text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Aspect Ratios (Midjourney)</span>
              </h4>
              
              <p className="text-[11px] text-zinc-400 leading-normal">
                Append prompt options below: copy aspect tags cleanly at the termination of your final image render.
              </p>

              <div className="grid gap-2 text-[11px] font-mono" id="aspect-codes-wrapper">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-zinc-400 uppercase">16:9 Landscape (SaaS / Cinematic)</span>
                  <code className="text-emerald-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-white/5">--ar 16:9</code>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-zinc-400 uppercase">9:16 Vertical (Mobile Reel / TikTok)</span>
                  <code className="text-emerald-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-white/5">--ar 9:16</code>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-zinc-400 uppercase">4:5 Portrait (Instagram Post)</span>
                  <code className="text-emerald-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-white/5">--ar 4:5</code>
                </div>
              </div>
            </div>

          </section>

        </div>

        {/* ⚡ 12. NEW TRENDING PROMPTS SECTION (Grid cards for high SEO, engagement & click generation) */}
        <section className="mt-10 border-t border-white/5 pt-10" id="trending-prompts-section">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h4 className="font-display font-extrabold text-[13px] uppercase text-white tracking-widest">
              Trending Prompt Ideas
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5" id="trending-items-grid">
            {TRENDING_PROMPTS.map((item, key) => (
              <div
                key={key}
                onClick={() => handleSelectTrending(item)}
                className="p-4 rounded-xl bg-[#0D0D0D] border border-white/5 hover:border-emerald-500/30 hover:bg-[#111111] cursor-pointer transition-all duration-200 flex flex-col justify-between group text-left shadow-lg"
                id={`trending-card-${key}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl p-1 bg-zinc-950 rounded-lg">{item.emoji}</span>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-extrabold">Active</span>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed italic font-sans">
                      "{item.subject}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] text-[#00FF41] font-mono uppercase tracking-wider">
                    {item.desc.substring(0, 20)}
                  </span>
                  <div className="w-5 h-5 rounded bg-zinc-950 group-hover:bg-emerald-400 group-hover:text-black text-zinc-500 flex items-center justify-center transition-colors">
                    <MousePointerClick className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📚 11. NEW "HOW IT WORKS" ONBOARDING SECTION */}
        <section className="mt-14 border-t border-white/5 pt-10" id="how-it-works-section-block">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest font-bold">Simple 3-Step Flow</span>
            <h3 className="font-display font-medium text-lg md:text-xl text-white uppercase tracking-tight">How It Works</h3>
            <p className="text-zinc-400 text-xs leading-relaxed leading-normal">
              Promptlix strips technical anxiety from art models. Build professional art descriptions in seconds:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            {/* Step 1 card */}
            <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/5 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-sm font-extrabold text-white mb-4">
                  01
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">01. Write or Pick Idea</h4>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                Enter your core subject, or simply select one of our clickable visual prompt inspiration helper chips to start instantly.
              </p>
            </div>

            {/* Step 2 card */}
            <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/5 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-sm font-extrabold text-[#00FF41] mb-4">
                  02
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">02. Choose Preset Style</h4>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                Select from our primary styled card templates like Photography, Cinematic Film, Anime, or Enchanted Fantasy.
              </p>
            </div>

            {/* Step 3 card */}
            <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/5 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-sm font-extrabold text-white mb-4">
                  03
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">03. Generate art copy</h4>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                Click "Enhance Prompt". Our tool will generate optimized rendering tags and exact camera settings ready to be copied.
              </p>
            </div>

          </div>
        </section>

        {/* 📚 13. FAQ SECTION (Detailed SEO Accordion Columns) */}
        <section className="mt-14 border-t border-white/5 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="academy-faq-section-wrapper">
          
          {/* FAQ Column Accordion */}
          <div className="lg:col-span-7">
            <FaqAccordion />
          </div>

          {/* Quick guide aspects cheatsheet */}
          <div className="lg:col-span-5 p-5 rounded-2xl border border-white/5 bg-[#0D0D0D] space-y-4 shadow-lg text-left">
            <h4 className="font-display font-medium text-xs uppercase tracking-wider text-zinc-250 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Prompting Best Practices</span>
            </h4>
            
            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              AI Engines process parameters cleanly when listed at the absolute termination of your instructions. Use these professional guidelines:
            </p>

            <ul className="space-y-2 text-[11px] font-sans text-zinc-400 list-disc pl-4 leading-relaxed">
              <li>Keep subject description as the main phrase.</li>
              <li>Toggle <strong className="text-emerald-400">Negative Prompting</strong> for complex humanoid skins.</li>
              <li>Avoid high-contrast text overlay unless generating geometric vector logos.</li>
              <li>Refer back to the <button onClick={() => setBlogOpen(true)} className="text-[#00FF41] underline font-bold cursor-pointer">Learning Academy</button> for camera settings lessons.</li>
            </ul>
            
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block">Formula Quality Preset:</span>
              <span className="text-[10px] text-zinc-300 font-mono uppercase block pt-1 font-bold">Enabled: Standard Draft + Masterpiece Super-Res</span>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-[#070707] border-t border-white/5 py-10 text-center" id="main-footer">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          {/* Brand Name */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              Prompt<span className="text-emerald-400 font-extrabold">lix</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Professional AI Prompt Enhancer for cinematic, realistic and creative AI image generation.
          </p>

          {/* Styled category links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-zinc-500 text-xs font-medium">
            <button type="button" onClick={() => handleStyleChange("anime")} className="hover:text-emerald-400 transition-colors cursor-pointer">Anime</button>
            <span className="text-zinc-800 select-none">•</span>
            <button type="button" onClick={() => handleStyleChange("cinematic")} className="hover:text-emerald-400 transition-colors cursor-pointer">Cinematic</button>
            <span className="text-zinc-800 select-none">•</span>
            <button type="button" onClick={() => handleStyleChange("realistic")} className="hover:text-emerald-400 transition-colors cursor-pointer">Realistic</button>
            <span className="text-zinc-800 select-none">•</span>
            <button type="button" onClick={() => handleStyleChange("realistic")} className="hover:text-emerald-400 transition-colors cursor-pointer">Photography</button>
            <span className="text-zinc-800 select-none">•</span>
            <button type="button" onClick={() => handleStyleChange("fantasy")} className="hover:text-emerald-400 transition-colors cursor-pointer">Concept Art</button>
          </div>

          {/* Trust and Legal pages links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-zinc-500 text-xs font-medium pt-1">
            <button type="button" onClick={() => openLegalTab("privacy")} className="hover:text-emerald-400 transition-colors cursor-pointer" id="footer-privacy-link">Privacy Policy</button>
            <span className="text-zinc-800 select-none">•</span>
            <button type="button" onClick={() => openLegalTab("terms")} className="hover:text-emerald-400 transition-colors cursor-pointer" id="footer-terms-link">Terms</button>
            <span className="text-zinc-800 select-none">•</span>
            <button type="button" onClick={() => openLegalTab("contact")} className="hover:text-emerald-400 transition-colors cursor-pointer" id="footer-contact-link">Contact</button>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-zinc-600 font-mono pt-1">
            © {new Date().getFullYear()} Promptlix. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 📱 14. MOBILE STICKY FLOATING CTA BUTTON FOOTER (Extremely convenient on mobile viewports!) */}
      {subject.trim() && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-zinc-950/90 border-t border-white/10 backdrop-blur-md flex items-center justify-between gap-3 block sm:hidden z-30 animate-in slide-in-from-bottom duration-300">
          <div className="truncate flex-1">
            <p className="text-[8px] text-zinc-400 font-mono uppercase tracking-wider">Active Preset</p>
            <p className="text-xs text-white truncate font-extrabold font-mono mt-0.5">{activeConfig.emoji} {activeConfig.name.toUpperCase()}</p>
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="px-5 py-3 bg-[#00FF41] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all outline-none"
            id="mobile-sticky-enhance-btn"
          >
            {isGenerating ? "Transmuting..." : "ENHANCE ⚡"}
          </button>
        </div>
      )}

      {/* SLIDE-OVER KNOWLEDGE BASE LEARNING ACADEMY */}
      <BlogDrawer isOpen={blogOpen} onClose={() => setBlogOpen(false)} />

      {/* SECURE TRUST AND LEGAL CONCIERGE PAGES DRAWER */}
      <LegalDrawer isOpen={legalOpen} onClose={() => setLegalOpen(false)} initialTab={legalInitialTab} />

    </div>
  );
}
