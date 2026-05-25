import { useState } from "react";
import { Copy, Check, Sparkles, Wand2, ShieldAlert, Zap } from "lucide-react";

interface PromptOutputProps {
  enhancedPrompt: string;
  negativePrompt: string;
  isGenerating: boolean;
  styleName: string;
  isAiEnhanced: boolean;
  tips: string[];
}

export default function PromptOutput({
  enhancedPrompt,
  negativePrompt,
  isGenerating,
  styleName,
  isAiEnhanced,
  tips
}: PromptOutputProps) {
  const [copiedEnhanced, setCopiedEnhanced] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const handleCopyEnhanced = () => {
    if (!enhancedPrompt) return;
    navigator.clipboard.writeText(enhancedPrompt);
    setCopiedEnhanced(true);
    setTimeout(() => setCopiedEnhanced(false), 2000);
  };

  const handleCopyNegative = () => {
    if (!negativePrompt) return;
    navigator.clipboard.writeText(negativePrompt);
    setCopiedNegative(true);
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  if (!enhancedPrompt && !isGenerating) {
    return (
      <div 
        className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 p-6 md:p-8 text-center shadow-2xl backdrop-blur-xl transition-all"
        id="output-empty-state"
      >
        {/* Subtle decorative glowing spot */}
        <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center">
          {/* Animated AI Onboarding Icon */}
          <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 shadow-lg shadow-black/60">
            <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
            <div className="absolute -inset-0.5 rounded-2xl border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </div>

          <h4 className="font-sans font-extrabold text-white text-base tracking-tight">
            Your enhanced AI prompt will appear here…
          </h4>
          
          <p className="text-zinc-400 text-xs mt-2 max-w-sm leading-relaxed">
            Enter your basic thought on the left, pick a preset style, and hit <strong className="text-emerald-400">Enhance</strong> to watch our engine generate premium cinematic coordinates instantly.
          </p>

          {/* Interactive Ghosted Prompt Preview Card */}
          <div className="mt-6 w-full rounded-xl border border-white/5 bg-black/40 p-4 text-left select-none relative group">
            <span className="absolute top-2.5 right-3 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
              Live Preview Demo
            </span>
            <div className="space-y-2">
              <div className="h-2 w-1/3 rounded bg-zinc-900" />
              <div className="font-mono text-[11px] leading-relaxed text-zinc-600">
                <span>masterpiece digital illustration of </span>
                <span className="text-emerald-500/40 font-medium">your subject</span>
                <span>, ultra highly detailed, </span>
                <span className="text-blue-500/40 font-medium">85mm professional lens</span>
                <span>, volumetric mist atmosphere, gorgeous golden hour cinematic lighting, unreal engine 5 render, trending on artstation...</span>
              </div>
            </div>
          </div>

          {/* Prompting Advice Tagline */}
          <div className="mt-5 flex items-center gap-1.5 px-3 py-1 bg-zinc-900/60 rounded-full border border-white/5">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Engines Ready: Gemini AI + Local Formulas
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Highlights important keywords or tags cleanly and organically
  const renderText = () => {
    if (!enhancedPrompt) return "";
    
    // Pattern of words to highlight (expanded to ensure premium highlighting of artistic terms)
    const highlightKeywords = [
      "hasselblad", "leica", "sony", "85mm", "35mm", "f/1.4", "f/1.2", 
      "8k", "photorealistic", "highly detailed", "cinematic", "masterpiece",
      "volumetric", "key visual", "vector", "flat vector", "origami-inspired",
      "neon", "cyberpunk", "anime sketch", "illustration", "makoto shinkai",
      "hayao miyazaki", "roger deakins", "shutter-speed", "unreal engine 5",
      "octane render", "luxurious", "scandinavian", "vogue editorial", "national geographic"
    ];

    return enhancedPrompt.split(", ").map((phrase, idx, arr) => {
      const phraseLower = phrase.toLowerCase();
      const needsHighlight = highlightKeywords.some(keyword => phraseLower.includes(keyword));

      return (
        <span key={idx}>
          {needsHighlight ? (
            <span className="text-emerald-400 font-semibold bg-emerald-500/5 px-1 py-0.5 rounded border border-emerald-400/10 inline-block my-0.5">
              {phrase}
            </span>
          ) : (
            <span className="text-zinc-200">
              {phrase}
            </span>
          )}
          {idx < arr.length - 1 ? <span className="text-zinc-650 font-mono select-none">, </span> : ""}
        </span>
      );
    });
  };

  return (
    <div className="space-y-5" id="prompt-output-section">
      {/* Enhanced Prompt Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden relative shadow-2xl backdrop-blur-md">
        
        {/* Output Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-widest text-zinc-300 font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              OPTIMIZED PROMPT
            </span>
            {isAiEnhanced ? (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-400 font-black tracking-wider uppercase flex items-center gap-1 border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5" /> AI ENHANCED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-amber-500/15 text-amber-400 font-black tracking-wider uppercase flex items-center gap-1 border border-amber-500/20">
                <Zap className="w-2.5 h-2.5" /> BACKUP ENGINE
              </span>
            )}
          </div>
          
          <span className="text-[10px] font-mono text-zinc-500 font-medium">
            {enhancedPrompt ? enhancedPrompt.length : 0} characters
          </span>
        </div>

        {/* Output Text Block */}
        <div className="p-6 pb-24 relative bg-zinc-950/20 min-h-[160px] flex flex-col justify-between">
          {isGenerating ? (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-3 z-20">
              <span className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#10B981] animate-pulse">Transmuting Idea...</span>
            </div>
          ) : null}

          <div className="font-sans text-[15px] leading-relaxed tracking-normal select-all selection:bg-emerald-500 selection:text-black break-words">
            {renderText()}
          </div>

          {/* Floated/fixed Copy Button inside text block (Bottom Right) */}
          {!isGenerating && enhancedPrompt && (
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={handleCopyEnhanced}
                className="px-5 py-2.5 bg-emerald-400 text-black hover:bg-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
                id="copy-enhanced-prompt-btn"
              >
                {copiedEnhanced ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 stroke-[2.5px]" />
                    <span>Copy Enhanced Prompt</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Negative Prompt Block */}
      {negativePrompt && (
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden relative shadow-md">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-zinc-400" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-400 font-extrabold">
                NEGATIVE TAGS (STIMULI EXCLUSIONS)
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">
              {negativePrompt.length} chars
            </span>
          </div>

          <div className="p-4 bg-zinc-950/30 relative pb-16 min-h-[80px]">
            {isGenerating ? (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Updating exclusions...</span>
              </div>
            ) : null}
            <p className="text-zinc-400 font-mono text-xs leading-relaxed select-all selection:bg-zinc-800 break-words">
              {negativePrompt}
            </p>

            {/* Floated absolute Copy Button for Negative Prompt */}
            {!isGenerating && negativePrompt && (
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  onClick={handleCopyNegative}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
                  id="copy-negative-prompt-btn"
                >
                  {copiedNegative ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
