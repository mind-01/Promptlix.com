import { StyleConfig, FAQItem } from "./types";

export const STYLES_DATABASE: Record<string, StyleConfig> = {
  general: {
    id: "general",
    name: "General Masterpiece",
    emoji: "🎨",
    tagline: "Multipurpose prompt optimizer",
    description: "Versatile booster suited for an assortment of general subjects, illustrations, and digital arts.",
    placeholder: "e.g., a cute orange cat sitting on a table",
    seoTitle: "AI Prompt Enhancer - Convert Keywords to Masterpiece Art",
    seoKeywords: ["ai prompt builder", "midjourney parameters generator", "stable diffusion template manager", "dall-e optimizer"],
    tips: [
      "Use descriptive nouns instead of generic terms (e.g., 'husky dog' instead of 'dog').",
      "Incorporate textures and ambient lighting elements.",
      "Mention a specific artistic medium if you want a non-photographic result."
    ],
    localKeywords: {
      scenery: ["dreamy background", "soft misty atmosphere", "highly detailed surroundings", "clean minimalist studio backdrop"],
      lighting: ["volumetric warm setting", "cinematic lighting", "rim glow", "soft window illumination"],
      styles: ["contemporary digital illustration", "octane render style", "concept fine art paper", "sleek modern design"],
      cameras: ["medium shot", "clean vector layout", "crisp high resolution focus"]
    },
    samplePrompts: [
      { input: "cat", output: "An adorable fluffy orange cat curled up asleep on a rustic wooden table, soft morning window light, high detailed cozy room atmosphere, conceptual illustration, pastel color palette, 8k resolution" },
      { input: "mystic sword", output: "Legendary crystal-embedded broadsword stuck inside an ancient stone, glowing cyan runes, dark enchanted cavern filled with floating dust particles, cinematic backlighting, highly detailed fantasy concept art" }
    ]
  },
  anime: {
    id: "anime",
    name: "Anime & Manga",
    emoji: "🌸",
    tagline: "Vibrant Studio Ghibli & modern style",
    description: "Specially formulated parameters targeting cell-shading, rich background colors, and illustrative linework.",
    placeholder: "e.g., futuristic sword fighter standing under cherry blossoms",
    seoTitle: "Anime AI Prompt Generator - Studio Ghibli & Modern Manga Prompts",
    seoKeywords: ["anime prompt converter", "studio ghibli prompt generator", "makoto shinkai style keywords", "anime image prompt builder"],
    tips: [
      "Referencing famous anime directors (e.g. Makoto Shinkai, Hayao Miyazaki) creates incredible background scenery.",
      "Specify cell-shading, key visual, or detailed digital sketch to lock in the material texture.",
      "Add weather states like 'drizzle', 'golden hour', or 'sun beams partition' to elevate atmosphere."
    ],
    localKeywords: {
      scenery: ["under a heavy shower of pink cherry blossoms", "idyllic floating sky islands", "bustling pastel-hued futuristic Tokyo street", "Studio Ghibli style green hills"],
      lighting: ["Makoto Shinkai inspired sky lighting", "dramatic sunset golden hour glow", "soft cell-shaded lighting and vibrant highlights", "diffuse day light shine-through"],
      styles: ["modern Kyoto Animation style", "cyberpunk anime key visual", "exquisite detailed anime illustration", "watercolor painting manga cover"],
      cameras: ["dramatic wide-angle lens perspective", "high-angle epic establishing shot", "retro film grain texture cell", "focused detailed close-up shot"]
    },
    samplePrompts: [
      { input: "girl holding umbrella", output: "Stunning anime sketch of a schoolgirl holding a blue umbrella, standing on a rainy Tokyo street at dusk, neon reflection puddle, vibrant sky, Makoto Shinkai atmosphere, highly detailed illustration, 8k illustration" },
      { input: "dragon on cloud", output: "Ancient majestic watercolor wind dragon coiling around celestial clouds, vibrant pastel hues, Hayao Miyazaki inspired, legendary digital manga visual style, stunning details" }
    ]
  },
  realistic: {
    id: "realistic",
    name: "Fine Photography",
    emoji: "📷",
    tagline: "Aesthetic photographic accuracy",
    description: "Configures real camera mechanics, focal lengths, aperture, shutter speeds, and legendary medium formats.",
    placeholder: "e.g., grizzled sea captain staring into the camera",
    seoTitle: "Realistic Prompt Generator - High Fidelity Camera Prompts",
    seoKeywords: ["realistic prompt optimizer", "photographic prompt maker", "midjourney photo realism keywords", "8k portrait camera builder"],
    tips: [
      "Specify real, legendary professional cameras (e.g., Sony α7R V, Hasselblad H6D-100c, Leica M11).",
      "Mention exact lens parameters (e.g., 85mm f/1.4 lens, 35mm street photography lens).",
      "Incorporate realistic skin texturing keywords: 'natural skin pores, fine peach fuzz, delicate crow's feet, detailed moisture'."
    ],
    localKeywords: {
      scenery: ["weathered wilderness background", "shallow depth of field blur studio", "misty rainy outdoor morning setting", "raw urban street environment"],
      lighting: ["split lighting setup", "harsh cinematic contrast shadows", "soft volumetric natural sunlight rays", "ambient ring lighting close-up"],
      styles: ["national geographic award-winning photography style", "street fashion editorial look", "candid documentary raw style", "high-fashion editorial portrait"],
      cameras: ["shot on Hasselblad 100c camera", "85mm prime lens f/1.2 portrait", "35mm analog film photograph fine grain", "macro detail with sharp focus"]
    },
    samplePrompts: [
      { input: "samurai", output: "An elderly battle-scarred samurai warrior standing in rain, close-up portrait, high detailed weathered steel armor, shot on Leica M11, 50mm f/1.4 lens, natural dramatic side-lighting, razor-sharp textures, award-winning photography" },
      { input: "elderly baker", output: "Candid medium portrait of an elderly french baker dusted with flour, holding freshly baked baguettes, warm oven glow illumination, shot on Sony α7R V, 85mm focal setting, fine depth of field, authentic morning bakery studio, 8k resolution" }
    ]
  },
  cinematic: {
    id: "cinematic",
    name: "Cinematic Film",
    emoji: "🎬",
    tagline: "Hollywood grade action & anamorphic lens",
    description: "Adds volumetric smoke, dark grading, anamorphic highlights, letterboxing, and dramatic motion tension.",
    placeholder: "e.g., astronauts entering a deep glowing obsidian cave",
    seoTitle: "Cinematic Prompt Generator - Movie Aesthetic & Color Grade Build",
    seoKeywords: ["cinematic prompt generator", "hollywood style prompt builder", "sci-fi movie prompt keywords", "letterboxed film generator"],
    tips: [
      "Design scenes based on dramatic color theories (e.g., 'teal and orange aesthetic', 'neon amber tint').",
      "Use dramatic lighting titles: 'volumetric light beams', 'lens flare', 'crepuscular rays'.",
      "Add widescreen aspect ratio keywords or references to IMAX and anamorphic lenses."
    ],
    localKeywords: {
      scenery: ["futuristic alien spaceship landing pad", "narrow damp medieval alleyway", "sweeping post-apocalyptic desert canyons", "steamy neon-drenched cyberpunk metropolis"],
      lighting: ["dramatic dual-tone neon backlight", "intense volumetric smoke & shafts of light", "low-key high-contrast film-noir lighting", "moody golden light with lens flares"],
      styles: ["directed by Roger Deakins aesthetic", "1980s epic sci-fi blockbuster", "neo-noir cinematic masterpiece", "high budget IMAX 70mm cinematic capture"],
      cameras: ["anamorphic lens format aspect", "sweeping wide-angle cinematic shot", "stabilized steadycam tracking movie freeze-frame", "shallow depth of field, immersive movie look"]
    },
    samplePrompts: [
      { input: "astronaut planet", output: "An astronaut looking out over an ocean of liquid gold, colossal gas giant planet rising on the horizon, cinematic color grade, teal and gold mood, volumetric cosmic dust, shot on IMAX 70mm lens, Roger Deakins style lighting, intense atmosphere, masterpiece style" },
      { input: "detective classic", output: "Moody hardboiled detective walking through dense fog under a single flickering streetlamp, trench coat wet with sweat, 1940s classic noir film-still, low-key lighting, anamorphic lens flare, smoke floating across camera frame" }
    ]
  },
  logo: {
    id: "logo",
    name: "Logo & Vector",
    emoji: "📐",
    tagline: "Flat icon design & typography",
    description: "Enforces neat high-contrast flat shapes, negative space, vector layouts, and clean brand styles.",
    placeholder: "e.g., stylized roaring lion crest",
    seoTitle: "Logo Prompt Generator - Vector & Icon Flat Design Prompts",
    seoKeywords: ["logo builder prompt generator", "flat vector prompt maker", "minimalist icon maker", "branding prompt designer"],
    tips: [
      "Specify 'flat vector style', 'minimalist design', and 'clean solid coloring' as primary criteria.",
      "Add parameters to prevent unwanted gradient fills if you prefer plain elements.",
      "Explicitly mention 'isolated on solid white background' to ensure clean clipping paths."
    ],
    localKeywords: {
      scenery: ["perfectly isolated on solid white background", "flat black negative space backdrop", "clean solid high-contrast canvas", "minimalist branding presentation sheet"],
      lighting: ["flat studio lighting, zero gradients", "subtle clean vector drop shadow", "even global vector illumination", "high-contrast solid coloring"],
      styles: ["minimalist flat vector graphics", "modern corporate geometric mascot branding", "sleek line-art icon design", "luxurious metallic gold emblem crest"],
      cameras: ["front view direct symmetrical alignment", "symmetrical clean blueprint layout", "crisp vector tracing contours", "high professional graphic asset render"]
    },
    samplePrompts: [
      { input: "coffee mug", output: "Minimalist flat vector logo of a piping hot coffee mug, steam forming a subtle brain symbol, dual-tone indigo and saffron colors, clean geometric curves, isolated on solid white background, vector asset, graphic designer showcase" },
      { input: "fox", output: "Geometric origami-inspired fox face, sleek lines, flat design icon, modern luxury branding aesthetic, crimson and deep charcoal palette, symmetry, isolated on neutral grey ground, high vector output" }
    ]
  },
  fantasy: {
    id: "fantasy",
    name: "Enchanted Fantasy",
    emoji: "✨",
    tagline: "Magical atmosphere & mythical creatures",
    description: "Adds spellwork glows, crystal formations, ethereal backlighting, and mystical environments.",
    placeholder: "e.g., ancient druid temple hollow tree",
    seoTitle: "Fantasy Prompt Generator - Mythical World-Building Prompts",
    seoKeywords: ["fantasy prompt generator", "mythical world keywords maker", "dnd prompt builder", "magical prompt elements"],
    tips: [
      "Incorporate words for magical glowing dusts, sparkling elements, or floating runic scripts.",
      "Use fantasy materials: 'runic obsidian', 'glowing bismuth', 'elven gold leaf', 'bioluminescent moss'.",
      "Name mythical themes or famous illustrator styles."
    ],
    localKeywords: {
      scenery: ["inside a giant glowing bioluminescent mushroom forest", "floating celestial castle bridge", "misty lake surrounded by sleeping glowing spirits", "ruined crystal castle throne room"],
      lighting: ["ethereal magical bioluminescence glow", "dramatic moonlit beams glistening on mist", "warm glowing sparks and celestial runes emission", "enchanted golden hour twilight shine"],
      styles: ["high fantasy digital painting masterpiece", "epic dnd landscape concept art", "celestial oil-painting splash vector", "delicate storybook watercolor illustration"],
      cameras: ["epic wide panoramic landscape angle", "mystical low angle shot", "high detailed magic atmosphere zoom", "cinematic panoramic render"]
    },
    samplePrompts: [
      { input: "castle over cliff", output: "Ethereal quartz crystal castle perched on a sheer rocky cliffside, waterfalls cascading into the sky, sparkling golden clouds during twin sunrise, magical bioluminescent rivers pulsing below, epic concept scene, high fantasy painting, masterpiece detail, 8k rendering" }
    ]
  },
  luxury: {
    id: "luxury",
    name: "Premium Luxury",
    emoji: "💎",
    tagline: "High fashion & glamorous luxury",
    description: "Utilizes satin textures, obsidian, golden highlights, and exquisite jewelry accents.",
    placeholder: "e.g., sleek modern sports car parked outside villa",
    seoTitle: "Premium Luxury Prompt Optimizer - Elegant & Glamorous Visuals",
    seoKeywords: ["luxury rendering prompt builder", "vogue style fashion prompts", "glamorous branding prompt maker", "hasselblad luxury interior design"],
    tips: [
      "Incorporate high-end materials like 'gilded brass', 'polished white marble', 'heavy plush velvet', 'brushed obsidian'.",
      "Describe subtle rich items: 'sleek champagne gold trims', 'minimalist modern architecture lines'.",
      "Mention premium magazines like 'Vogue Editorial', 'Architectural Digest style photoshoot'."
    ],
    localKeywords: {
      scenery: ["inside a sleek modern luxury penthouse with sweeping ocean vistas", "exquisite minimal black marble lounge", "framed by dramatic architectural glass columns", "modernist concrete terrace overlooking dusk lake"],
      lighting: ["glistening warm ambient spotlights", "soft indirect designer light accent", "dramatic sunset golden twilight entering double-height glazing", "editorial fashion studio lighting"],
      styles: ["Vogue high-end editorial fashion standard", "Architectural Digest interior showcase design", "luxurious minimalist modern aesthetic", "hyper-premium studio product render"],
      cameras: ["shot on Hasselblad Master photographic rig", "elegantly composed architectural wide shot", "editorial close-up focus with high textural fidelity", "clean symmetrical presentation view"]
    },
    samplePrompts: [
      { input: "crystal perfume bottle", output: "Exquisite geometric crystal perfume bottle resting on solid black obsidian, liquid amber essence shimmering inside, warm indirect spotlights bouncing off gold trims, Vogue editorial presentation, high-contrast, razor-sharp studio focus" }
    ]
  },
  architecture: {
    id: "architecture",
    name: "Architectural Wonders",
    emoji: "🏛️",
    tagline: "Modernist structure & nature blending",
    description: "Focuses on blueprint symmetries, wood paneling, raw concrete, and dramatic glazing panels.",
    placeholder: "e.g., eco-friendly treehouse built on redwood",
    seoTitle: "Architectural Prompt Generator - Elegant House & Building Renderings",
    seoKeywords: ["architecture render prompt templates", "brutalist building prompt generator", "modernist interior prompt builder", "urban design render keywords"],
    tips: [
      "Detail building materials: 'raw board-formed concrete', 'warm teak wood panels', 'bronze architectural profiles', 'brushed titanium'.",
      "Use architectural movements: 'Mid-century Modern', 'Eco-brutalism', 'Deconstructivism', 'Scandinavian Minimalism'.",
      "Include natural landscaping like 'integrated weeping ferns, native tall grasses, reflecting pool'."
    ],
    localKeywords: {
      scenery: ["nestled into a steep forested rocky ridge of absolute tranquility", "flanked by massive sheer rock face and a black glass pool", "blended with mossy concrete terraces and old redwoods", "overlooking a foggy pine fjord landscape at twilight"],
      lighting: ["crisp dramatic morning light reflecting on water", "warm interior lighting glowing through floor-to-ceiling plate glass", "soft misty daylight diffusing through canopy foliage", "golden hour twilight shadows highlighting architectural angles"],
      styles: ["Eco-brutalist custom masterpiece design", "Scandinavian modernist spatial concept art", "haute residential architectural render", "minimalist organic architectural structure"],
      cameras: ["epic 35mm wide-angle perspective architectural photo", "perfectly level professional shift lens capture", "candid architectural layout close-up", "high-end drone establishing shot of building"]
    },
    samplePrompts: [
      { input: "scandinavian villa", output: "An organic Scandinavian villa combining black charred timber and exposed structural concrete, large floor-to-ceiling glass walls exposing a warm minimal wooden fireplace inside, perched above foggy pine trees near a Norwegian fjord, soft dawn twilight lighting, award-winning architectural digest photography" }
    ]
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk Tech",
    emoji: "🏮",
    tagline: "Neon-noir streets & augmented hackers",
    description: "Configures neon reflections, damp moody streets, retro-future cyberware, and holographic billboards.",
    placeholder: "e.g., cybernetic street racer inspecting their cyberdeck",
    seoTitle: "Cyberpunk Prompt Generator - Futuristic Neon-Noir Key Words",
    seoKeywords: ["cyberpunk prompt maker", "neon noir street prompt builder", "futurist technology generator", "augmented character prompt creator"],
    tips: [
      "Combine opposing elements: 'high tech, low life' (e.g. glowing microchips under rusted rain gutters).",
      "Mention color pairings: 'neon magenta, chemical green, phosphor yellow, electric cyan'.",
      "Describe atmospheric grime: 'drizzle rain, wet asphalt puddles, dense chemical smog, steam escaping sewer grates'."
    ],
    localKeywords: {
      scenery: ["damp labyrinthine alleyway filled with neon billboard glares", "high-tech underground server terminal room", "rooftop terrace with view of towering carbon megastructures", "crowded futuristic midnight market with food stalls"],
      lighting: ["chemical green and bright magenta neon illumination", "harsh spotlights cutting through electrical smog and steam", "flickering cyan backlight from holographic displays", "puddle reflections bouncing electric light streams"],
      styles: ["neo-noir cyberpunk aesthetic masterpiece", "cybernetic cyberpunk game concept splash art", "retro-future cassette-futurism scene", "gritty low-life high-tech cinematic frame"],
      cameras: ["dynamic low-angle shot, cinematic lenses", "anamorphic cinematic capture with flare", "macro close-up on neon reflection in bionic optic-eye", "crisp high shutter-speed tracking capture"]
    },
    samplePrompts: [
      { input: "street rider", output: "A cybernetically augmented girl sitting atop her customized sleek electric motorcycle, wet neon-drenched Tokyo back-alley, steam rising from metal grates, holographic cyber-dragon ads floating in dense violet chemical smoke, high-contrast, anamorphic lens flares, masterpiece sci-fi rendering" }
    ]
  }
};

export const FAQ_DATA: FAQItem[] = [
  {
    id: "q1",
    question: "What is an AI prompt enhancer?",
    answer: "An AI prompt enhancer is an optimization utility that translates basic, raw descriptions into rich, context-aware imagery guidelines. By adding explicit parameters like medium specs, specific lighting directions, camera lenses, and creative modifiers, it bridges the gap between a vague idea and pristine artistic execution."
  },
  {
    id: "q2",
    question: "How does prompt optimization work?",
    answer: "Our tool processes your simple subject using high-fidelity local parameter models or raw Google Gemini AI contextual analysis. It structures your query to follow advanced image generator syntax—appending precise stylistic highlights, volumetric light details, environments, and clean negative filters that prevent unwanted pixel distortions."
  },
  {
    id: "q3",
    question: "Is this tool free?",
    answer: "Yes, Promptlix is 100% free to use. You can toggle between ultra-fast Local Formula generation and state-of-the-art 'Smart Enhancement' (powered by Gemini AI) to build, refine, and copy as many prompts as you need."
  },
  {
    id: "q4",
    question: "Which AI tools support these prompts?",
    answer: "The optimized instructions generated here are highly compatible with all industry-leading text-to-image AI systems, including Midjourney (v6.1), DALL-E 3, Stable Diffusion (SDXL/Pony), Leonardo AI, Adobe Firefly, and FLUX."
  }
];

export const BLOG_GUIDES = [
  {
    title: "Midjourney v6.1 Ultra Prompting Guide",
    category: "Midjourney",
    readTime: "4 min read",
    snippet: "Unlock pristine details in Midjourney v6.1. Learn to structure prompts, regulate stylization parameters, and implement correct photographic cameras and ratios.",
    content: "Midjourney v6.1 processes descriptive text with unparalleled attention to natural grammar. Unlike older v4/v5 versions which preferred 'comma separated keywords', v6.1 excels with organic descriptive sentences.\n\n### Key Formulas:\n1. **Subject Description**: Define the character/object precisely, including materials and garments (e.g., 'A woman wearing a rugged linen utility trenchcoat').\n2. **Atmosphere & Lights**: Use natural modifiers ('dramatic side-lighting', 'early twilight morning haze').\n3. **Production Context**: Specify the media medium and lenses ('shot on 35mm photographic film', '--ar 16:9').\n\n### Essential Parameters:\n- `--stylize 250` (or `--s 250`): Controls how creative the engine gets. 100 is neutral, 1000 is maximum beauty.\n- `--chaos 15` (or `--c 15`): Introduces structural changes to variations. Excellent for finding unique angles.\n- `--weird 50` (or `--w 50`): Adds avant-garde elements for surrealistic art."
  },
  {
    title: "Leonardo AI Prompt Secrets for Photorealism",
    category: "Leonardo AI",
    readTime: "3 min read",
    snippet: "Master Leonardo's Alchemy pipeline and photorealism engines. Learn which keywords lock in correct skin texturing and atmospheric shadows.",
    content: "Leonardo AI features extremely strong lighting models like XL Alchemy and Lightning-Fast SDXL variants. To retrieve true photorealism, you must manipulate secondary parameters.\n\n### Perfecting Portraits in Leonardo:\n- **Contrast & Volume**: Invoke 'split portrait lighting, dramatic rim light, and high-specular reflective texture'.\n- **Microdetails**: Specify human features specifically ('natural micro-pores, fine light fuzz, realistic iris reflection, weathered fabric fibers').\n- **Alchemy Config**: Turn on 'Contrast Boost' and use the 'Photo' or 'Cinematic' preset models. Always pair your principal prompt with a detailed negative prompt stack containing '3d render, plastic skin, rubberized hair' to strip away digital artifacts."
  },
  {
    title: "Understanding Negative Prompts: Strip Out Glitches",
    category: "General Guide",
    readTime: "3 min read",
    snippet: "Why is your AI art generating deformed figures or noisy artifacts? Understand how negative prompts isolate and banish digital defects.",
    content: "A negative prompt acts as a boundary filter. It subtracts undesirable noise from the latent space vectors, keeping your final image crisp and clean.\n\n### Essential Negative Blocks:\n- **For Portraits**: 'blurry, deformed eyes, double eyelids, fused teeth, plastic skin, doll texture, bad anatomy, floating limbs'.\n- **For Vector & Logos**: 'realistic render, photographic shading, photographic noise, camera lens flare, complex gradients, text labels, background grid'.\n- **For Landscapes**: 'oversaturated colors, high compression ruins, low contrast, text watermark, artist signature, timestamp overlay'."
  }
];
