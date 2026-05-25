import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { FAQ_DATA } from "../data";

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("q1");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4" id="faq-accordion-container">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-brand" />
        <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">Frequently Asked Questions</h3>
      </div>

      <div className="grid gap-3">
        {FAQ_DATA.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div 
              key={item.id}
              className="rounded-xl border border-white/10 bg-black/40 overflow-hidden transition-all duration-200"
              id={`faq-item-${item.id}`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                id={`faq-header-${item.id}`}
              >
                <span className="font-sans font-medium text-slate-200 text-sm md:text-base pr-4">
                  {item.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brand shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {/* Collapsed content */}
              <div 
                className={`transition-all duration-200 overflow-hidden ${
                  isOpen ? "max-h-60 border-t border-white/10" : "max-h-0"
                }`}
                id={`faq-body-${item.id}`}
              >
                <p className="px-5 py-4 text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
