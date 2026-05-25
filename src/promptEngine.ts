import { PromptStyle } from "./types";

interface PromptEngineInput {
  subject: string;
  style: PromptStyle;
  promptLength: "short" | "medium" | "long";
  language: string;
  negativeEnabled: boolean;
  environment?: string;
  lighting?: string;
  camera?: string;
  customModifiers?: string[];
  renderQuality?: "standard" | "masterpiece" | "cinematic-raw";
}

// Global random selection helper
function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

// Compute accurate word counts
function getWordCount(str: string): number {
  return str.split(/\s+/).filter(Boolean).length;
}

// Deduplicate and limit intensive keyword spam (Anti-AI-Slop filter)
function cleanAndLimitAdjectives(text: string): string {
  // Normalize duplicates, clean spaces, and redundant trailing commas
  let clean = text
    .replace(/,(\s*,)+/g, ",")
    .replace(/\s+/g, " ")
    .replace(/,\s*\./g, ".")
    .trim();

  // Words that can cause buzzword fatigue or overstuffing
  const intensityMap = [
    { words: ["ultra-hd", "ultra high", "ultra", "hyper"], target: "finely detailed" },
    { words: ["masterpiece", "outstanding masterpiece", "masterworks"], target: "work of craftsmanship" },
    { words: ["luxurious", "premium", "luxury", "opulent"], target: "high-end" },
    { words: ["photorealistic", "hyperrealistic", "realistic photo"], target: "realistic" },
    { words: ["stunning", "gorgeous", "beautiful", "breath-taking"], target: "striking" }
  ];

  for (const group of intensityMap) {
    let occurrenceCount = 0;
    // Walk through and replace duplicates, leaving at most one
    for (const phrase of group.words) {
      const escaped = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      
      clean = clean.replace(regex, (match) => {
        occurrenceCount++;
        if (occurrenceCount > 1) {
          // Replace second occurrence with simpler alternative or empty
          return occurrenceCount % 2 === 0 ? group.target : "";
        }
        return match;
      });
    }
  }

  // Final trim in case of empty spots or consecutive commas left behind
  return clean
    .replace(/,(\s*,)+/g, ",")
    .replace(/\s+,\s+/g, ", ")
    .replace(/,\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

// Identify subject types to prevent cross-contamination (e.g. putting sleek chrome loops on a kitten)
function getSubjectCategory(subject: string): "animal" | "character" | "vehicle" | "place" | "scifi" | "fantasy" | "general" {
  const s = subject.toLowerCase();

  if (s.includes("cyber") || s.includes("robot") || s.includes("android") || s.includes("scifi") || s.includes("hologram") || s.includes("futuristic") || s.includes("spaceship")) {
    return "scifi";
  }
  if (s.includes("car") || s.includes("supercar") || s.includes("vehicle") || s.includes("motorcycle") || s.includes("engine") || s.includes("drive")) {
    return "vehicle";
  }
  if (s.includes("magic") || s.includes("fantasy") || s.includes("wizard") || s.includes("spell") || s.includes("dragon") || s.includes("castle") || s.includes("fairy") || s.includes("mythical")) {
    return "fantasy";
  }
  if (s.includes("cat") || s.includes("kitten") || s.includes("dog") || s.includes("puppy") || s.includes("wolf") || s.includes("fox") || s.includes("lion") || s.includes("bird") || s.includes("animal")) {
    return "animal";
  }
  if (s.includes("city") || s.includes("street") || s.includes("house") || s.includes("interior") || s.includes("temple") || s.includes("mountain") || s.includes("valley") || s.includes("landscape")) {
    return "place";
  }
  if (s.includes("samurai") || s.includes("warrior") || s.includes("man") || s.includes("woman") || s.includes("girl") || s.includes("detective") || s.includes("character") || s.includes("portrait") || s.includes("person")) {
    return "character";
  }
  return "general";
}

// Compile custom parameters organically into a paragraph structure
function formatCustomParameter(label: string, value: string | undefined, template: string): string {
  if (!value || value.trim() === "") return "";
  return template.replace("{value}", value.trim());
}

export function generateDynamicPrompt(input: PromptEngineInput): {
  prompt: string;
  negative: string;
} {
  const subject = input.subject.trim();
  const category = getSubjectCategory(subject);

  // 1. Dynamic category-specific sensory vocabulary pools (The scene builders)
  const sensoryPools = {
    animal: {
      actions: [
        "curled up peacefully sleeping with subtle breathing motion",
        "watching with wide, curious eyes that reflect golden ambient light",
        "resting quietly, completely relaxed, basking in a silent serene moment",
        "looking ahead with an alert, majestic gaze full of intelligence"
      ],
      environments: [
        "in a cozy, candlelit study filled with vintage leather books and soft cushions",
        "beside a warm, glowing rustic stone fireplace casting amber shadows",
        "on a rain-slicked glass sill of a quiet bay window overlooking a dark green garden",
        "under the protective shadow of moss-covered ancient roots in a tranquil forest"
      ],
      backdrops: [
        "A soft morning mist drifts outside, rendering the ambient world beautifully calm.",
        "The background fades into gentle, cream-colored textures and delicate wood finishes.",
        "Potted flowering ferns and trailing green vines cascade softly in the distance.",
        "A peaceful afternoon storm hums in the distance, enriching the indoor sanctuary vibes."
      ],
      textures: [
        "Every whisker and soft tuft of delicate fur is clearly illuminated.",
        "The gentle textures of hand-woven cotton yarn and soft fabrics are tangibly felt.",
        "A glowing, eye-safe warmth highlights the intricate pattern along its skin and coat.",
        "The scene displays remarkable detail in the organic wooden grain of the nearby desk floors."
      ]
    },
    character: {
      actions: [
        "standing in deep, quiet reflection, looking slightly off-center",
        "gazing towards the distant mist-capped hills with heroic resolve",
        "paused in a natural, candid posture that commands cinematic presence",
        "clad in weathered robes that carry the rich, tactile dust of a long journey"
      ],
      environments: [
        "among the towering, ivy-strewn pillars of a forgotten dry stone cathedral",
        "against the cold, sweeping peaks of a snow-dusted highland path at twilight",
        "under a narrow, copper-lanterned alleyway glistening under light autumn rain",
        "inside a quiet wood-paneled archive illuminated by a single warm copper desk-lamp"
      ],
      backdrops: [
        "Low-lying morning fog rolls through the scenery, framing the outline in striking contrast.",
        "Delicate dust particles drift silently on the air currents, reflecting warm beams of light.",
        "A rich architectural backdrop adds an impressive layer of geometric depth to the view.",
        "In the background, transient soft silhouettes of evergreen trees rise against the clouds."
      ],
      textures: [
        "The hand-stitched threads of the heavy wool coat and weathered leather elements are extremely detailed.",
        "Soft, realistic skin pores, fine hair strands, and subtle fabric fibers stand out with natural clarity.",
        "Reflections of ambient lights glint beautifully on metal clasps and bronze trim accents.",
        "The composition frames the subject with absolute precision, utilizing positive space masterfully."
      ]
    },
    vehicle: {
      actions: [
        "parked with sharp geometric precision, catching local ambient focus",
        "gliding effortlessly down a damp, black asphalt curve, leaving subtle energy trails",
        "showcased under a sweeping, brutalist concrete pavilion designed with sleek lines",
        "poised cleanly on a high-elevation overlook overlooking the city lights below"
      ],
      environments: [
        "outside a modern, glass-fronted desert architectural villa at early dusk",
        "inside a dark luxury design hangar lit by overhead floating light bars",
        "along a rain-soaked ocean cliffs highway reflecting deep purple sunset colors",
        "adjacent to a clean minimalist cedar gallery under soft, overcast morning clouds"
      ],
      backdrops: [
        "The sharp lines of the landscape underscore the vehicle's dynamic proportions.",
        "Distant towering buildings and dark mountains create a grand, sweeping depth of field.",
        "The ground surface is glossy with fresh rain, mirroring every brake light and panel curve.",
        "A serene evening atmospheric haze hangs low, blending the horizon with deep blue twilight."
      ],
      textures: [
        "Light dances beautifully off the glossy hand-polished metallic surfaces and carbon-fiber contours.",
        "The rich premium finishes of the alloy rims and dark glass elements are tangibly clear.",
        "Brushed silver trims and dark leather cabin details are briefly visible in the low cabin glow.",
        "Every geometric contour and ventilation grill is rendered with immaculate modern balance."
      ]
    },
    scifi: {
      actions: [
        "surrounded by floating, semi-transparent blue holographic displays",
        "interfacing with intricate computational wall grids that pulse with green indicators",
        "framed by soaring, matte glass skyscrapers and endless overhead monorail corridors",
        "resting quietly amidst a dense maze of glowing optical fiber bundles and copper tubes"
      ],
      environments: [
        "inside the dim, neon-lit control deck of a long-range atmospheric cruiser",
        "tucked in a high-tech workshop filled with retro-wave cassette-futurist machines",
        "perched over a wet cyberpunk alleyway glistening with reflection of red neon advertisements",
        "within a pristine, white-enameled server core that glows with cyan cooling grids"
      ],
      backdrops: [
        "Floating virtual terminals and chemical steam vents paint a rich cinematic sci-fi canvas.",
        "The background complex of vertical architecture stretches into a dizzying neon depth.",
        "Digital scanning lines and glowing metrics scatter low-frequency ambient glare through the air.",
        "An imposing metal hangar bay ceiling frames the visual structure with solid strength."
      ],
      textures: [
        "Micro bionic segments, golden circuit paths, and matte carbon panels are fully clear.",
        "Holographic light rays scatter delicately off micro moisture steam droplets floating in mid-air.",
        "The cold, reflective sheen of polished cybernetic limbs stands out in high contrast.",
        "The glowing interface elements project interactive geometric symbols directly into local space."
      ]
    },
    fantasy: {
      actions: [
        "bathed in shimmering, pastel star-dust and celestial particles",
        "hovering gently near ancient runic stone circles that hum with blue energy",
        "channeling soft bioluminescent light through swirling magical patterns",
        "perched with natural elegance upon a crystalline structure overlooking misty chasms"
      ],
      environments: [
        "within a deep, whimsical fairytale forest filled with glowing velvet mushrooms",
        "beside a legendary floating ivory tower that touches the peak of sunset clouds",
        "inside a mystical cavern pool reflecting swirling emerald water lights and quartz columns",
        "on a high high-altitude elven bridge surrounded by golden falling leaves"
      ],
      backdrops: [
        "Ethereal pastel winds ripple through the scene, leaving sparkling trails of dreamlike gold.",
        "A giant crescent moon and faint twin stars hang suspended in a deep cosmic violet sky.",
        "Eldritch foliage glows gently with low-wattage lavender fire, highlighting secret paths.",
        "Waterfall curtains cascade quietly into ancient jade basins in the misty valleys below."
      ],
      textures: [
        "Intricate runic carvings and delicate silver filigree glisten with enchanted light.",
        "The ethereal textures of shimmering silk capes and crystal edges are deeply textured.",
        "A delicate aura of cosmic energy wraps the subject, softening the sharp focus edges.",
        "Every crystal cluster and ancient brick mortar pattern is beautifully visible under the starlight."
      ]
    },
    place: {
      actions: [
        "showcasing remarkable spatial symmetries and breathtaking structural scale",
        "peacefully integrated into a majestic sheer canyon valley above rushing rivers",
        "tucked into a high pine forest ridge under a canopy of drifting low cloud layers",
        "exhibiting clean mid-century geometric balances with majestic outdoor integration"
      ],
      environments: [
        "situated beautifully along a quiet, tree-crested valley bay with deep blue reflecting waters",
        "overlooking a grand, timeless desert plateau dotted with ancient flat-top mesas",
        "nestled inside a tranquil mossy bamboo forest in Kyoto at early morning light",
        "perched alongside a dramatic volcanic ridge facing the raw power of sunset waves"
      ],
      backdrops: [
        "The sweeping backdrop extends to infinity, with staggered ridges fading in a smoky blue atmospheric haze.",
        "Architectural shapes blend effortlessly with native stones and ancient redwood trunks.",
        "Golden shafts of evening sunbeams slice sideways through the high mountain canopy.",
        "The sky overhead is a pristine canvas of slow-creeping high cirrus clouds and amber gradients."
      ],
      textures: [
        "The contrasting textures of clean raw board-formed cement, solid teak timbers, and glass are vivid.",
        "Every layered stone tile and damp leaf on the forest path has genuine physical substance.",
        "Subtle moisture glaze on stone steps and weathered wood textures enrich the spatial mood.",
        "The wide-angle perspective conveys a deep respect for physical scale, balance, and clean composition."
      ]
    },
    general: {
      actions: [
        "presented in a beautifully harmonious, professional-grade artistic setup",
        "captured with clean focus and an immersive attention to tactile surface details",
        "artistically framed by generous, balanced negative space that guides focus key-center",
        "immersed in a rich, evocative atmosphere that feels highly narrative and natural"
      ],
      environments: [
        "inside a quiet, minimalist modern workshop filled with soft afternoon shadows",
        "against an elegant, dark obsidian-colored backdrop featuring soft golden accents",
        "in an open-air sunlit courtyard surrounded by subtle warm clay textures",
        "resting inside a clean contemporary gallery space illuminated by a single warm direct spotlight"
      ],
      backdrops: [
        "The colors transition smoothly between cool teal and warm, sun-kissed copper tones.",
        "A delicate, atmospheric haze softens the perspective, creating an elegant visual depth.",
        "Minimalist shadows stretch gracefully across the frame, building beautiful visual rhythm.",
        "The surrounding items are neatly arranged to accentuate the core theme without clutter."
      ],
      textures: [
        "Every single tactile detail, surface texture, and gradient shade is rendered beautifully.",
        "Soft ambient illumination wraps the contours cleanly, emphasizing structural forms.",
        "Subtle micro-texture details give the entire scene a touch of high-concept visual craftsmanship.",
        "Sensory elements combine cleanly to convey a distinct sense of artistic quality."
      ]
    }
  };

  const pool = sensoryPools[category] || sensoryPools.general;

  // Select random parts
  const action = pickRandom(pool.actions);
  const environment = formatCustomParameter("environment", input.environment, "specifically situated {value}") || pickRandom(pool.environments);
  const backdrop = pickRandom(pool.backdrops);
  const textures = pickRandom(pool.textures);

  // 2. Build custom parameter sentences (Lighting, Camera, Modifiers)
  // If user selected lighting, integrate it smoothly into a realistic sentence!
  let lightSentence = "";
  if (input.lighting) {
    lightSentence = `The entire space is bathed in ${input.lighting.toLowerCase()}, painting the scene with dramatic highlights and soft deep shadows.`;
  } else {
    const generalLightings = [
      "The scene is illuminated by soft volumetric golden hour light cutting sideways through the air.",
      "A dramatic dual-tone lavender and warm amber lighting casts gorgeous rim light paths.",
      "Gentle, diffused morning light spills from the side, exposing rich realistic textures.",
      "Low-key dramatic side-lighting paints the scene, casting long, clean, atmospheric shadows."
    ];
    lightSentence = pickRandom(generalLightings);
  }

  // If user selected camera, integrate it smoothly
  let cameraSentence = "";
  if (input.camera) {
    cameraSentence = `This visually striking moment is captured using a ${input.camera}, optimizing depth of field and color parameters.`;
  } else {
    // Style-specific camera setups
    const cameraSetups = {
      realistic: "Shot on film, 85mm f/1.4 lens, crisp details, incredibly shallow depth of field, natural skin pores, and soft cream background rendering.",
      anime: "Crafted as a professional anime production print cell, featuring clean hand-drawn key visuals, vibrant color keys, and elegant cel-shading.",
      cinematic: "Recorded on an anamorphic widescreen cinematic lens, complete with dramatic teal-amber grading and subtle film grain.",
      logo: "Designed as a clean, high-contrast balanced logo graphic with mathematically level geometric contours over a solid corporate background.",
      fantasy: "Rendered as an ethereal fairytale illustration, using rich pastel washes, delicate brushwork, and magical bioluminescence glows.",
      luxury: "Shot as a high-fashion cover photograph, utilizing premium styling, Hasselblad 100c medium-format crispness, and exquisite fabric textures.",
      architecture: "Captured as an level architectural shift-lens showcase photo with perfect vertical lines and beautiful interior-outdoor lighting.",
      cyberpunk: "Captured as a neon-noir cinematography still, using high-contrast lighting, soft chemical smog, and glowing street puddles.",
      general: "Exquisitely captured in a highly balanced artistic frame, employing gorgeous cinematic atmosphere and perfect focus."
    };
    cameraSentence = cameraSetups[input.style] || cameraSetups.general;
  }

  // Render Quality Sentence
  let qualitySentence = "";
  if (input.renderQuality === "masterpiece") {
    qualitySentence = "The composition emphasizes pristine textures, delicate surfaces, and masterfully arranged scenery.";
  } else if (input.renderQuality === "cinematic-raw") {
    qualitySentence = "The image presents an unedited analog film texture, containing authentic grain, organic lighting, and high-fidelity depth.";
  } else {
    qualitySentence = "The render is clean, beautifully weighted, and reveals high-quality color harmony.";
  }

  // Custom modifiers from UI (blend them)
  let modifiersSentence = "";
  if (input.customModifiers && input.customModifiers.length > 0) {
    const joinedMods = input.customModifiers.join(", ");
    modifiersSentence = `The composition is enriched with details of ${joinedMods}.`;
  }

  // 3. Assemble and budget according to Word Count limits!
  // Short: 50–80 words (Usually about 3 balanced visual sentences)
  // Medium: 80–140 words (Usually about 5-6 rich visual sentences)
  // Long: 140–220 words (Full immersive storytelling paragraph, 8-10 rich sentences)
  
  let finalPrompt = "";
  const sentenceList: string[] = [];

  // Core Subject & action & environment
  const firstSentence = `${subject} ${action}, ${environment}.`;
  sentenceList.push(firstSentence);

  // Add parts sequentially and watch the budget closely
  sentenceList.push(lightSentence);
  sentenceList.push(backdrop);
  sentenceList.push(cameraSentence);
  sentenceList.push(textures);
  sentenceList.push(qualitySentence);
  if (modifiersSentence) {
    sentenceList.push(modifiersSentence);
  }

  // Compile paragraphs iteratively checking length constraints
  if (input.promptLength === "short") {
    // We want 50 to 80 words. Let's slice the first 3-4 sentences to fit the budget.
    const tempWords: string[] = [];
    for (const sent of sentenceList) {
      tempWords.push(sent);
      const currentCount = getWordCount(tempWords.join(" "));
      if (currentCount >= 52) {
        break;
      }
    }
    
    // In case physically too short, pad with a beautiful general atmospheric sentence
    let currentText = tempWords.join(" ");
    let count = getWordCount(currentText);
    if (count < 50) {
      const padSentence = "The surrounding composition emphasizes serene visual elegance and highly balanced atmospheric framing.";
      currentText += " " + padSentence;
    }
    
    // If it overshoots 80, cleanly truncate sentences
    count = getWordCount(currentText);
    if (count > 80) {
      const sents = currentText.split(/(?<=\.)\s+/);
      let shortText = "";
      for (const s of sents) {
        if (getWordCount(shortText + " " + s) <= 80) {
          shortText += (shortText ? " " : "") + s;
        } else {
          break;
        }
      }
      finalPrompt = shortText;
    } else {
      finalPrompt = currentText;
    }

  } else if (input.promptLength === "long") {
    // We want 140 to 220 words.
    // Let's combine all standard sentences and append rich literary atmosphere to guarantee it reaches the threshold elegantly!
    let currentText = sentenceList.join(" ");
    let count = getWordCount(currentText);

    if (count < 150) {
      // Add storytelling details explicitly to guarantee high quality and word budget
      const storyBits = {
        animal: "Every element in this sanctuary is designed to nurture quiet contemplation and absolute peacefulness, creating a rich visual cocoon. The viewer can almost sense the soft warmth of the room and the peaceful rhythm of silence.",
        character: "The character's stance bridges a silent dialogue between the rugged, ancient soil below and the infinite sky above. Visual depth is staggering, capturing a profound cinematic chapter lost in the sands of time.",
        vehicle: "The sleek, high-end aerodynamic architecture commands attention, transforming raw geometry into flowing sculpture. Ambient reflections shimmer across the body panels to underscore its premium, high-speed engineering.",
        scifi: "Complex bionic data paths paint a highly glowing cybernetic network onto the surroundings, highlighting the deep technical marvels of this futuristic grid. Micro light leaks drift gently through high-tech copper components.",
        fantasy: "Whimsical golden runes swirl quietly in place, creating a beautiful magical current that gently bends nearby light beams. Each sparkling stardust cluster dances in perfect visual harmony in the pale blue moonlight.",
        place: "The surrounding structures reflect the deep, level philosophy of organic architectural design, beautifully letting elements of stone and wood speak for themselves. The entire layout breathes in harmony with local landscapes.",
        general: "This stunning design presents an exquisite visual statement, arranging tones, soft light gradients, and rich physical textures in perfect aesthetic union. The final display establishes a masterfully level artistic tone."
      };
      
      currentText += " " + storyBits[category];
      currentText += " The camera focus remains pristine, leaving secondary details to melt away beautifully.";
    }

    // Now, let's strictly clip if it pushes past 220 words
    count = getWordCount(currentText);
    if (count > 220) {
      const sents = currentText.split(/(?<=\.)\s+/);
      let longText = "";
      for (const s of sents) {
        if (getWordCount(longText + " " + s) <= 220) {
          longText += (longText ? " " : "") + s;
        } else {
          break;
        }
      }
      finalPrompt = longText;
    } else {
      finalPrompt = currentText;
    }

  } else {
    // Medium: 80 to 140 words
    let currentText = [firstSentence, lightSentence, backdrop, cameraSentence, textures].join(" ");
    let count = getWordCount(currentText);

    if (count < 85) {
      currentText += ` ${qualitySentence}`;
      if (modifiersSentence) {
        currentText += ` ${modifiersSentence}`;
      }
    }

    count = getWordCount(currentText);
    if (count < 85) {
      currentText += " It represents a highly balanced and visually striking work of digital craftsmanship, complete with organic depth.";
    }

    // Strict clipping if past 140
    count = getWordCount(currentText);
    if (count > 140) {
      const sents = currentText.split(/(?<=\.)\s+/);
      let medText = "";
      for (const s of sents) {
        if (getWordCount(medText + " " + s) <= 140) {
          medText += (medText ? " " : "") + s;
        } else {
          break;
        }
      }
      finalPrompt = medText;
    } else {
      finalPrompt = currentText;
    }
  }

  // Clean-up and strip repetitive buzzwords
  finalPrompt = cleanAndLimitAdjectives(finalPrompt);

  // Localized translation annotation (if user selected another language)
  if (input.language && input.language !== "English") {
    // Since we are offline, prepend a high-quality localized tag to help prompt processors translate dynamically
    finalPrompt = `${finalPrompt} [Translated beautifully into ${input.language}]`;
  }

  // 4. Resolve clean, non-cluttered Negative Prompt
  let negPrompt = "";
  if (input.negativeEnabled) {
    const negativePresets = {
      logo: "unrealistic shading, complex gradients, photorealistic camera shadows, typography, text labels, watermark noise, blurry borders",
      anime: "realistic photo, blurry 3d render, deformed face anatomy, missing limbs, bad proportions, watermark tags, extra digits",
      realistic: "blurry, low contrast, distorted eyes, extra hands, missing face elements, amateur drawing, artist signature watermark, vectors, cartoon overlays",
      cinematic: "low quality film frame, cartoonish illustrations, harsh lens distortions, text subtitles, visible logos, flat lighting",
      general: "blurry, dark contrast, distorted fingers, extra limbs, bad proportions, text labels, watermark noise, drawings"
    };
    negPrompt = negativePresets[input.style] || negativePresets.general;
  }

  return {
    prompt: finalPrompt,
    negative: negPrompt
  };
}
