import React, { useState, useEffect } from "react";
import { Shield, FileText, Mail, X, Check, ArrowRight } from "lucide-react";

interface LegalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: "privacy" | "terms" | "contact";
}

export default function LegalDrawer({ isOpen, onClose, initialTab }: LegalDrawerProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "contact">(initialTab);
  
  // Contact Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync state when initialTab or open status changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    
    // Simulate API request safely
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in" id="legal-drawer-wrapper">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        id="legal-backdrop"
      />

      {/* Slide-over Drawer containing the legal documents and contact form */}
      <div 
        className="relative w-full max-w-xl h-full bg-[#0B0B0B] border-l border-white/5 text-[#EDEDED] flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300"
        id="legal-drawer-panel"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2">
            {activeTab === "privacy" && <Shield className="w-5 h-5 text-emerald-400" />}
            {activeTab === "terms" && <FileText className="w-5 h-5 text-emerald-400" />}
            {activeTab === "contact" && <Mail className="w-5 h-5 text-emerald-400" />}
            <span className="font-sans text-xs uppercase tracking-widest font-black text-white">
              {activeTab === "privacy" && "Privacy Guarantee"}
              {activeTab === "terms" && "Terms of Service"}
              {activeTab === "contact" && "Reach Promptlix Support"}
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            id="legal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-white/5 bg-[#0F0F0F] px-4">
          <button 
            type="button"
            onClick={() => { setActiveTab("privacy"); setIsSubmitted(false); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all ${activeTab === "privacy" ? "border-emerald-400 text-white font-black" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Privacy
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab("terms"); setIsSubmitted(false); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all ${activeTab === "terms" ? "border-emerald-400 text-white font-black" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Terms
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab("contact"); setIsSubmitted(false); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all ${activeTab === "contact" ? "border-emerald-400 text-white font-black" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Contact
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans text-xs md:text-sm leading-relaxed text-zinc-300">
          
          {/* PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-5 animate-in fade-in duration-250" id="privacy-content-block">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">Your Prompt Privacy is Fully Guarded</h3>
              <p>
                At Promptlix, we respect absolute data self-determination. We believe that your creative thoughts, text seeds, and artistic prompts belong completely to you.
              </p>
              
              <div className="space-y-3.5 pt-2">
                <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-emerald-400">1. Zero Client Logging</h4>
                  <p className="text-zinc-400 text-xs leading-normal">
                    We do not track, catalog, store or index the raw subject inputs or generated prompt texts that pass through our engine. Everything operates ephemerally in active state parameters.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-emerald-400">2. Secure Server Ingress</h4>
                  <p className="text-zinc-400 text-xs leading-normal">
                    Gemini AI calls are routed securely through fully private server-side proxy routes. No individual browser API tokens are ever exposed, leaked, or shared with generic databases.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-emerald-400">3. Standard Cookie-less Formula</h4>
                  <p className="text-zinc-400 text-xs leading-normal">
                    We employ zero trackers or non-essential persistent behavioral cookies. The user parameters and custom style preferences are kept solely within local client-side memory.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-500">
                Last updated: May 2026. If you have any questions, use the Contact tab to reach our team securely.
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-5 animate-in fade-in duration-250" id="terms-content-block">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">Clear & Humane Open Terms</h3>
              <p>
                Promptlix is built as a designer-first open-access tool. By operating the utility, you agree to these simple and transparent usage patterns:
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-emerald-400">1. Complete Output Rights</h4>
                  <p className="text-zinc-400 text-xs leading-normal">
                    Any customized prompt coordinates, tags, ratio settings, or styles generated using this application are 100% owned by you. You have the total free right to use them commercially, for personal art, or within prompt-sharing marketplaces.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-emerald-400">2. Permitted Channels</h4>
                  <p className="text-zinc-400 text-xs leading-normal">
                    Prompts optimized here are engineered to work elegantly on major generative models like Midjourney, Stable Diffusion, Leonardo, DALL-E 3, and Adobe Firefly. We maintain no affiliation with these parent platforms.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-emerald-400">3. "As-Is" Service Guarantee</h4>
                  <p className="text-zinc-400 text-xs leading-normal">
                    This utility is provided for prompt augmentation purposes. Because image models evolve quickly, we do not guarantee specific rendering results on third-party art engines.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-500">
                Operating with standard design freedom. Please use prompt parameters responsibly and respect community system guidelines.
              </div>
            </div>
          )}

          {/* CONTACT CONCIERGE FORM */}
          {activeTab === "contact" && (
            <div className="space-y-5 animate-in fade-in duration-250" id="contact-content-block">
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">Reach Our Team</h3>
                <p className="text-zinc-400">
                  Have feedback, feature requests, or business queries? Drop us a secure note below and we will get back to you within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/25 space-y-3 text-center animate-in zoom-in-95 duration-200" id="contact-success-box">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 stroke-[3px]" />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">Message Dispatched Securely!</h4>
                  <p className="text-zinc-300 text-xs max-w-xs mx-auto leading-relaxed">
                    Thank you for reaching out. Your design feedback is appreciated. Our support advocates will review your submission soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 pt-1" id="contact-form">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adrian Carter" 
                      className="w-full bg-[#060606] border border-white/5 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 rounded-xl p-3 text-xs md:text-sm font-medium text-white placeholder-zinc-700 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">Your Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. adrian@domain.com" 
                      className="w-full bg-[#060606] border border-white/5 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 rounded-xl p-3 text-xs md:text-sm font-medium text-white placeholder-zinc-700 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">Message details</label>
                    <textarea 
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or feedback..." 
                      className="w-full bg-[#060606] border border-white/5 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 rounded-xl p-3 text-xs md:text-sm font-medium text-white placeholder-zinc-700 outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !name || !email || !message}
                    className="w-full py-3 bg-emerald-400 text-black hover:bg-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/5 cursor-pointer active:scale-[0.99]"
                    id="contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <span>Submit Secure Note</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
