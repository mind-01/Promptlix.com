import { useState } from "react";
import { BookOpen, X, ChevronRight, Clock, Check, Copy } from "lucide-react";
import { BLOG_GUIDES } from "../data";

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogDrawer({ isOpen, onClose }: BlogDrawerProps) {
  const [activeArticle, setActiveArticle] = useState<typeof BLOG_GUIDES[0] | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="blog-drawer-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        id="blog-drawer-backdrop"
      />

      {/* Drawer Panel */}
      <div 
        className="relative w-full max-w-2xl h-full bg-[#0F0F0F] border-l border-white/10 text-[#F5F5F5] flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300"
        id="blog-drawer-panel"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-brand" />
            <h2 className="font-display text-lg font-black tracking-widest uppercase">PROMPT ACADEMY</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors"
            id="blog-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeArticle ? (
            <div className="space-y-4" id="article-list-container">
              <p className="text-white/60 text-xs uppercase tracking-wider font-mono">
                Unlock professional-level prompt engineering techniques. Select an editorial guide to learn core Midjourney codes and Leonardo tips.
              </p>
              
              <div className="grid gap-4">
                {BLOG_GUIDES.map((guide, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveArticle(guide)}
                    className="p-6 rounded-xl border border-white/10 bg-black/40 hover:bg-black hover:border-brand cursor-pointer transition-all flex flex-col justify-between group"
                    id={`blog-card-${idx}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                        <span className="px-2.5 py-0.5 rounded text-[10px] bg-brand/10 text-brand font-mono font-black tracking-widest uppercase">
                          {guide.category}
                        </span>
                        <span className="flex items-center gap-1 text-white/30 font-mono text-[10px]">
                          <Clock className="w-3.5 h-3.5" />
                          {guide.readTime.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-lg text-white group-hover:text-brand transition-colors uppercase tracking-tight">
                        {guide.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-2 line-clamp-2 font-sans">
                        {guide.snippet}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand mt-4 group-hover:translate-x-1 transition-transform">
                      Read full guide &rarr;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6" id="article-view-container">
              <button 
                onClick={() => setActiveArticle(null)}
                className="text-xs text-brand hover:underline transition-all flex items-center gap-1 font-black uppercase tracking-wider mb-2"
                id="back-to-articles-btn"
              >
                &larr; Back to all articles
              </button>

              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-[10px] text-white/40 mb-2 font-mono uppercase">
                  <span className="px-2 py-0.5 rounded bg-brand/10 text-brand font-black">
                    {activeArticle.category}
                  </span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
                <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
                  {activeArticle.title}
                </h1>
              </div>

              {/* Guide Content */}
              <div className="text-white/80 text-sm leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                {activeArticle.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={index} className="text-white font-display font-black text-base uppercase tracking-wider pt-4 border-t border-white/10">
                        {paragraph.replace('###', '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <ul key={index} className="list-disc pl-5 space-y-2 mt-2">
                        {paragraph.split('\n').map((li, liIdx) => (
                          <li key={liIdx} className="text-white/80">
                            {li.replace('-', '').trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>

              {/* Utility Tip Callout box */}
              <div className="bg-black p-5 rounded-xl border border-white/10 space-y-3">
                <span className="text-[10px] text-brand font-black uppercase tracking-[0.2em] block">Academy Parameter Hack</span>
                <p className="text-xs text-white/60 leading-normal font-sans">
                  Inject variables like <code className="text-brand font-mono">--ar 16:9 --v 6.1 --stylize 300</code> at the conclusion of your generator window to instruct Midjourney with master scales.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopy("--ar 16:9 --v 6.1 --s 250", "param")}
                    className="flex-1 py-2 rounded bg-white/5 border border-white/10 text-xs font-mono text-white hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {copiedText === "param" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <span>--ar 16:9 --v 6.1</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
