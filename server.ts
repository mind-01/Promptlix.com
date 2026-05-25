import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Lazy-initialized Gemini API client to prevent startup crash if API key is missing
let aiClient: GoogleGenAI | null = null;
let lastUsedKey: string | null = null;
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
  }
  // Re-initialize client if key changes while server is running
  if (!aiClient || key !== lastUsedKey) {
    lastUsedKey = key;
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is healthy" });
  });

  // Full backend API endpoint to enhance prompts using Gemini server-side
  app.post("/api/enhance", async (req, res) => {
    try {
      const { subject, style, promptLength, language, negativeEnabled, selectedOptionWords } = req.body;
      
      if (!subject || typeof subject !== "string" || subject.trim() === "") {
         res.status(400).json({ error: "Subject prompt is required" });
         return;
      }

      const ai = getGeminiClient();
      
      // Construct system instructions
      const systemInstruction = 
        `You are an expert AI prompt engineer specialized in crafting elegant, artistic, and highly effective image generator prompts for tools like Midjourney, Stable Diffusion, Leonardo AI, and DALL-E 3.\n` +
        `Your task is to take a simple subject/concept and turn it into a majestic, descriptive, professional-grade prompt.\n` +
        `Guidelines:\n` +
        `- Maintain the core subject provided by the user but elevate it with rich, evocative visual storytelling, specific artistic mediums, concrete textures, and refined camera systems.\n` +
        `- STRICTLY avoid cheap keyword stuffing or long comma-separated tag clouds. Write in smooth, fluid, sentence-like cinematic descriptions (e.g., 'A fluffy calico kitten curled asleep beside a rain-streaked library window in a warm, amber-lit study' instead of 'cat, rain window, cozy room, highly detailed photo, 8k masterpiece').\n` +
        `- Avoid cliché buzzwords like 'photorealistic', 'hyperrealistic', 'beautiful' or repeated intensive words like 'ultra', 'premium', 'masterpiece', 'luxurious'. Limit any such intensive modifiers to at most one occurrence in the entire output.\n` +
        `- Adaptation & Subject Awareness: Let the visual mood feel entirely organic to the subject. Cozy subjects (like a cat, a cup, a quiet cabin) should feature cozy, soft, natural lighting, organic textures, and intimate scenery. High-octane subjects (like supercars, cyberpunk cities) can utilize neon reflections, glossy finishes, and bold compositions. Do not apply inappropriate themes like metal gloss or high luxury trims to animals or tranquil nature.\n` +
        `- Maintain exquisite camera and lighting details but blend them naturally into the flow of the sentences.\n` +
        `- Do not wrap your response in quotes, markdown code blocks, or extra preambles. Output ONLY the enhanced prompt text itself.\n` +
        `- Respect the requested style, prompt length, and language if specified. If language is not English, output the enhanced prompt in that language.`;

      const lengthInstruction = 
        promptLength === "short" ? "MUST be between 50 and 80 words. Create an atmospheric, highly focused single scene with natural, elegant flow." :
        promptLength === "long" ? "MUST be between 140 and 220 words. Craft a highly detailed storybook vignette, detailing micro-textures, intricate backgrounds, lighting shifts, and rich atmospheric storytelling." :
        "MUST be between 80 and 140 words. Deliver a beautifully balanced visual description and complete scenery setting.";

      const inputData = 
        `Subject: ${subject}\n` +
        `Style/Theme: ${style || "General/3D cinematic"}\n` +
        `Selected modifier keywords to incorporate: ${selectedOptionWords && selectedOptionWords.length > 0 ? selectedOptionWords.join(", ") : "none"}\n` +
        `Prompt Length requirement: ${lengthInstruction}\n` +
        `Language to output: ${language || "English"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: inputData,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.85,
        }
      });

      const enhanced = response.text?.trim() || "";

      // Generate a matching negative prompt contextually as well if requested!
      let negativePrompt = "blurry, low quality, distorted, extra limbs, bad anatomy, deformed, watermark, signature";
      if (negativeEnabled) {
        try {
          const negResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Generate a detailed comma-separated list of negative prompts (elements to avoid) to prevent bad outcomes for an image of: "${subject}" in style "${style}". Output ONLY comma-separated words.`,
            config: {
              systemInstruction: "You represent negative prompt generators. Output only 10-15 keywords or short phrases to avoid, separated by commas. No intro, no quotes, no explanation.",
              temperature: 0.5,
            }
          });
          if (negResponse.text) {
            negativePrompt = negResponse.text.trim();
          }
        } catch (e) {
          // Fallback to default
        }
      }

      res.json({
        enhancedPrompt: enhanced,
        negativePrompt: negativePrompt
      });

    } catch (error: any) {
      // Collect all potential error string facets safely first before printing to console.error
      let errorDetail = "";
      try {
        if (error) {
          errorDetail += " " + (error.message || "");
          errorDetail += " " + (error.status || "");
          errorDetail += " " + (error.code || "");
          errorDetail += " " + String(error);
          errorDetail += " " + JSON.stringify(error);
        }
      } catch (e) {
        if (error && error.message) {
          errorDetail += " " + error.message;
        }
      }
      
      const errorStrSearch = errorDetail.toLowerCase();
      const isLeaked = errorStrSearch.includes("leaked") || errorStrSearch.includes("leak") || errorStrSearch.includes("leaks");
      const isPermissionDenied = errorStrSearch.includes("permission_denied") || 
                                 errorStrSearch.includes("403") || 
                                 errorStrSearch.includes("permission") ||
                                 errorStrSearch.includes("unauthorized") ||
                                 errorStrSearch.includes("api_key_invalid");
      const isQuotaExceeded = errorStrSearch.includes("429") ||
                              errorStrSearch.includes("resource_exhausted") ||
                              errorStrSearch.includes("quota") ||
                              errorStrSearch.includes("rate") ||
                              errorStrSearch.includes("limit");

      if (isLeaked) {
        console.warn("Gemini safety intercept: Your Gemini API key was reported as leaked. Intercepted gracefully and switched to Offline Backup Formulas.");
        res.status(403).json({
          error: "Your Gemini API key was reported as leaked. Please open the Settings menu (gear icon in the top-right corner), select 'Secrets', and provide a new, valid 'GEMINI_API_KEY' to restore Smart AI features. In the meantime, the application has automatically switched to high-fidelity Offline Backup Formulas so you can keep working!"
        });
        return;
      }

      if (isPermissionDenied) {
        console.warn("Gemini safety intercept: Your Gemini API key was reported as permission denied or invalid.");
        res.status(403).json({
          error: "Permission Denied: Your Gemini API key is inactive, unauthorized, or invalid. Please check your 'GEMINI_API_KEY' under Settings > Secrets to ensure it has correct permissions."
        });
        return;
      }

      if (isQuotaExceeded) {
        console.warn("Gemini safety intercept: Gemini API free tier rate limit or daily quota exceeded.");
        res.status(429).json({
          error: "API Quota Exceeded (429): You have exceeded your Gemini API quota limit. If you are using the free tier, the Google AI Studio limit is typically 20 requests per day for this model. We have automatically activated high-fidelity dynamic Offline Backup Formulas so you can keep crafting magnificent prompts without interruption! You can also check your billing details or retry later."
        });
        return;
      }

      // Only print standard, unexpected, non-credential errors to console.error
      console.error("Gemini enhancement error:", error);
      res.status(500).json({ error: error?.message || String(error) || "Failed to generate prompt via AI" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
