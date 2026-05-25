export type PromptStyle = "general" | "anime" | "realistic" | "cinematic" | "logo" | "fantasy" | "luxury" | "architecture" | "cyberpunk";

export interface StyleConfig {
  id: PromptStyle;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  placeholder: string;
  seoTitle: string;
  seoKeywords: string[];
  tips: string[];
  localKeywords: {
    scenery: string[];
    lighting: string[];
    styles: string[];
    cameras: string[];
  };
  samplePrompts: {
    input: string;
    output: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PromptOption {
  subject: string;
  style: PromptStyle;
  length: "short" | "medium" | "long";
  language: string;
  negativeEnabled: boolean;
  environment: string;
  lighting: string;
  camera: string;
  extraModifiers: string[];
}
