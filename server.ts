import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Health
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "KalaKriti", timestamp: new Date().toISOString() });
  });

  // AI Generate Listing from voice transcript or text description
  app.post("/api/gemini/generate-listing", async (req, res) => {
    try {
      const { description, categoryHint } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback heuristic response if key is not yet set
        return res.json({
          name: description.split(".")[0]?.slice(0, 45) || "Handcrafted Heritage Product",
          category: categoryHint || "Textiles & Weaving",
          materials: "Natural cotton, organic vegetable dyes",
          color: "Traditional earthen tones",
          craftTechnique: "Handwoven / Handcrafted",
          descriptionEnglish: `Exquisitely handcrafted by traditional Indian artisans. ${description}. Designed with authentic cultural motifs and made with sustainable, durable materials.`,
          descriptionHindi: `पारंपरिक भारतीय कारीगरों द्वारा हस्तनिर्मित। ${description}। प्रामाणिक सांस्कृतिक रूपांकनों के साथ टिकाऊ सामग्रियों से तैयार किया गया।`,
          tags: ["handmade", "authentic-craft", "traditional", "artisan-made", "sustainable", "kalakriti"],
          estimatedLaborHours: 14,
          careInstructions: "Dry clean or gentle hand wash in cold water with mild detergent.",
        });
      }

      const ai = getGemini();
      const prompt = `You are the lead product cataloger for KalaKriti, an authentic Indian artisanal marketplace empowering rural craftspeople.
Analyze this artisan's spoken or written product description:
"${description}"
${categoryHint ? `Category hint: "${categoryHint}"` : ""}

Extract and generate a complete, high-converting, respectful product listing in valid JSON.
The listing must respect traditional craftsmanship, highlight natural materials, and provide both polished English and Hindi descriptions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "A catchy, authentic product title (30-60 chars)" },
              category: { type: Type.STRING, description: "One of: Textiles & Weaving, Pottery & Ceramics, Jewelry, Woodwork, Metalwork, Home Decor, Paintings & Art" },
              materials: { type: Type.STRING, description: "Specific materials used e.g. Sheesham wood, Terracotta clay, Tussar silk" },
              color: { type: Type.STRING, description: "Dominant colors and finish" },
              craftTechnique: { type: Type.STRING, description: "The traditional craft technique e.g. Ajrakh block printing, Dokra casting, Dhokra, Madhubani" },
              descriptionEnglish: { type: Type.STRING, description: "2-4 evocative, professional sentences for online buyers explaining heritage, utility, and craft" },
              descriptionHindi: { type: Type.STRING, description: "Accurate, warm translation of the description in clear Hindi" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "5 to 8 searchable lowercase tags",
              },
              estimatedLaborHours: { type: Type.NUMBER, description: "Estimated hours of artisan labor" },
              careInstructions: { type: Type.STRING, description: "How to care for and maintain the item" },
            },
            required: ["name", "category", "materials", "craftTechnique", "descriptionEnglish", "descriptionHindi", "tags"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.error("Generate listing error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate listing" });
    }
  });

  // Multimodal AI Image Analysis for "Product Ready in 30 Seconds"
  app.post("/api/gemini/analyze-product-image", async (req, res) => {
    try {
      const { imageBase64, artisanCraft, artisanLocation } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Product image is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback realistic craft listing if API key is not present
        return res.json({
          name: "Handcrafted Heritage Artisan Craft",
          category: artisanCraft ? (artisanCraft.includes("Pashmina") || artisanCraft.includes("Weaving") ? "Textiles & Weaving" : artisanCraft.includes("Terracotta") || artisanCraft.includes("Clay") ? "Pottery & Ceramics" : artisanCraft.includes("Madhubani") ? "Paintings & Art" : artisanCraft.includes("Brass") ? "Metalwork" : artisanCraft.includes("Wood") ? "Woodwork" : "Home Decor") : "Home Decor",
          materials: "Authentic natural materials, organic mineral pigments",
          color: "Warm terracotta and natural artisan pigments",
          craftTechnique: artisanCraft || "Traditional Indian Handmade Technique",
          descriptionEnglish: "Exquisitely hand-crafted by master Indian artisans with time-honored heritage techniques. Built with sustainable raw materials and fine attention to cultural motifs, perfect for modern living and cultural connoisseurs.",
          descriptionHindi: "भारतीय मास्टर कारीगरों द्वारा पारंपरिक विरासत तकनीकों से निर्मित उत्कृष्ट हस्तशिल्प। प्राकृतिक और टिकाऊ सामग्रियों से बना यह उत्पाद आपके घर के लिए एक आदर्श सांस्कृतिक आभूषण है।",
          tags: ["handmade", "artisancrafted", "indianheritage", "sustainable", "kalakriti", "traditional"],
          suggestedPrice: 1850,
          minPrice: 1400,
          maxPrice: 2400,
          pricingReasoning: "Fair artisan remuneration based on 14+ hours of manual labor, natural raw materials, and fair-trade market benchmarks.",
          estimatedLaborHours: 14,
          careInstructions: "Wipe with a soft dry cloth. Keep away from excessive moisture and harsh chemicals.",
          quantity: 5,
        });
      }

      const ai = getGemini();

      let mimeType = "image/jpeg";
      let cleanBase64 = imageBase64;
      if (imageBase64.startsWith("data:")) {
        const parts = imageBase64.split(";base64,");
        mimeType = parts[0].replace("data:", "");
        cleanBase64 = parts[1];
      }

      const prompt = `You are the chief master curator and cataloging AI for KalaKriti, an Indian artisan marketplace.
Look at this uploaded photo of a handcrafted Indian artisanal product.
${artisanCraft ? `Artisan's primary craft domain: "${artisanCraft}"` : ""}
${artisanLocation ? `Artisan's location: "${artisanLocation}"` : ""}

Carefully examine the visual photo:
1. Identify what type of handcrafted item this is (e.g. Terracotta vase, Pashmina shawl, Madhubani painting, Brass idol, Blue pottery plate, Wood carving, Dhokra figurine, etc.).
2. Categorize it strictly into ONE of: "Textiles & Weaving", "Pottery & Ceramics", "Jewelry", "Woodwork", "Metalwork", "Home Decor", "Paintings & Art".
3. Identify visual materials (e.g., Terracotta clay, Brass alloy, Mulberry silk, Teak wood, Natural indigo, etc.).
4. Describe dominant colors and surface textures.
5. Identify craft technique (e.g., Handloom extra-weft, Lost-wax casting, Wheel-thrown and etched, Madhubani freehand, etc.).
6. Write a 2-3 sentence evocative, professional English customer-facing description.
7. Write an accurate, respectful Hindi translation of the description in natural Hindi (हिंदी विवरण).
8. Generate 6-8 relevant lowercase search tags.
9. Estimate a fair retail price in Indian Rupees (INR) that ensures living wages for the artisan, along with min and max recommended price.
10. Calculate estimated artisan labor hours and care instructions.

Output valid JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Authentic, appealing product name (30-60 characters)" },
              category: {
                type: Type.STRING,
                description: "Must be exactly one of: Textiles & Weaving, Pottery & Ceramics, Jewelry, Woodwork, Metalwork, Home Decor, Paintings & Art",
              },
              materials: { type: Type.STRING, description: "Specific handcrafted materials used" },
              color: { type: Type.STRING, description: "Dominant colors and finish" },
              craftTechnique: { type: Type.STRING, description: "Traditional craft technique" },
              descriptionEnglish: { type: Type.STRING, description: "Engaging 2-3 sentence product story in English" },
              descriptionHindi: { type: Type.STRING, description: "Natural, respectful Hindi description" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "6 to 8 lowercase search tags",
              },
              suggestedPrice: { type: Type.NUMBER, description: "Fair retail price in INR (integer, e.g. 1650)" },
              minPrice: { type: Type.NUMBER, description: "Minimum fair price in INR" },
              maxPrice: { type: Type.NUMBER, description: "Premium festive price in INR" },
              pricingReasoning: { type: Type.STRING, description: "1-2 sentence economic fair-trade breakdown" },
              estimatedLaborHours: { type: Type.NUMBER, description: "Hours of artisan handwork" },
              careInstructions: { type: Type.STRING, description: "Care & maintenance instructions" },
              quantity: { type: Type.NUMBER, description: "Recommended starting stock, e.g. 3 to 10" },
            },
            required: [
              "name",
              "category",
              "materials",
              "craftTechnique",
              "descriptionEnglish",
              "descriptionHindi",
              "tags",
              "suggestedPrice",
              "minPrice",
              "maxPrice",
              "pricingReasoning",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.error("Analyze product image error:", err);
      // Fallback
      return res.json({
        name: "Handcrafted Indian Artisan Item",
        category: "Home Decor",
        materials: "Natural handcrafted materials",
        color: "Earthen tones",
        craftTechnique: "Traditional Handmade Art",
        descriptionEnglish: "A masterpiece of traditional Indian handicraft, carefully shaped by master artisans with authentic cultural heritage motifs.",
        descriptionHindi: "पारंपरिक भारतीय हस्तशिल्प की एक उत्कृष्ट कृति, जिसे मास्टर कारीगरों द्वारा प्रामाणिक सांस्कृतिक रूपांकनों के साथ तैयार किया गया है।",
        tags: ["handmade", "artisan", "traditional", "indiancraft", "kalakriti"],
        suggestedPrice: 1650,
        minPrice: 1250,
        maxPrice: 2200,
        pricingReasoning: "Fair artisan wage based on manual crafting effort and authentic materials.",
        estimatedLaborHours: 12,
        careInstructions: "Handle with care. Clean gently with a soft dry cloth.",
        quantity: 5,
      });
    }
  });

  // AI Fair Price Suggestion
  app.post("/api/gemini/suggest-price", async (req, res) => {
    try {
      const { name, category, materials, craftTechnique, description } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          suggestedPrice: 1450,
          minPrice: 1100,
          maxPrice: 1850,
          reasoning: "Fair artisan price considering raw material cost, skilled hand labor (approx. 12-16 hours), and fair trade market value in India.",
          materialCostEstimate: 450,
          artisanLaborWage: 750,
          packagingAndPlatform: 250,
        });
      }

      const ai = getGemini();
      const prompt = `You are a fair-trade pricing economist specializing in Indian handicrafts for the KalaKriti marketplace.
Evaluate this product to recommend a fair retail price in Indian Rupees (INR) that guarantees good wages for the artisan while remaining attractive for urban and global buyers.

Product: "${name}"
Category: "${category}"
Materials: "${materials || "Handmade materials"}"
Technique: "${craftTechnique || "Traditional handcraft"}"
Description: "${description || ""}"

Calculate a transparent pricing breakdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedPrice: { type: Type.NUMBER, description: "Fair retail price in INR (integer)" },
              minPrice: { type: Type.NUMBER, description: "Minimum wholesale/discount price in INR" },
              maxPrice: { type: Type.NUMBER, description: "Premium festive/export price in INR" },
              reasoning: { type: Type.STRING, description: "2 sentences explaining the fair value calculation" },
              materialCostEstimate: { type: Type.NUMBER, description: "Estimated raw material cost in INR" },
              artisanLaborWage: { type: Type.NUMBER, description: "Direct artisan earnings for time and skill in INR" },
              packagingAndPlatform: { type: Type.NUMBER, description: "Estimated packaging, logistics buffer in INR" },
            },
            required: ["suggestedPrice", "minPrice", "maxPrice", "reasoning"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.error("Suggest price error:", err);
      return res.status(500).json({ error: err.message || "Failed to suggest price" });
    }
  });

  // AI Business Insights
  app.post("/api/gemini/insights", async (req, res) => {
    try {
      const { catalogSummary } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          insights: [
            "✨ Add detailed photos showing your crafting process to boost customer trust and increase conversion by 35%.",
            "📈 Festive demand is rising for handwoven textiles and home decor — prepare festive bundles with gift packaging.",
            "💰 Products priced with verified craft tags sell 2x faster when combined with direct artisan stories.",
          ],
        });
      }

      const ai = getGemini();
      const prompt = `You are KalaKriti's master artisan mentor. Based on this artisan's current catalog summary:
${catalogSummary || "Artisan with handcrafted items in textiles, pottery, and jewelry."}

Provide exactly 3 concise, encouraging, actionable business growth tips (under 25 words each) tailored to Indian handicrafts sales.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 concise actionable tips",
              },
            },
            required: ["insights"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.error("Insights error:", err);
      return res.status(500).json({ error: err.message || "Failed to get insights" });
    }
  });

  // Ask KalaKriti AI Chat
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history, userContext } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: `Namaste! I am KalaKriti AI, your digital craft mentor and shopping guide. Regarding your question on "${message}", KalaKriti provides direct marketplace access with UPI QR codes, fair-price guidance, studio photo enhancements via remove.bg, and live delivery tracking for every handmade treasure. How else can I assist your journey?`,
        });
      }

      const ai = getGemini();
      const systemInstruction = `You are "KalaKriti AI" (formerly Ask ShilpSetu AI, now proudly upgraded to Ask KalaKriti AI), a knowledgeable, empathetic, and encouraging assistant for the KalaKriti artisan marketplace platform.
KalaKriti empowers Indian artisans (weavers, potters, painters, metalworkers, woodcarvers) to connect directly with customers and B2B buyers.
Platform features include:
- Voice-to-text recording in multiple Indian languages (Hindi, Gujarati, English, Marathi, Tamil, etc.)
- Studio photo re-enhancement (keeping real product pictures intact while adding lighting/contrast and remove.bg background removal)
- UPI QR Code payment integration for direct digital payments
- Anti-self-purchase protections (artisans cannot purchase their own products)
- Dual notifications for buyers and sellers on every order
- Live courier delivery tracking with status stages and customer shipping details shown to artisans
- Artisan profile experience validation (non-negative)
Provide warm, professional, actionable responses (2 to 4 paragraphs or bullet points). If asked in Hindi or Hinglish, respond bilingual or respectfully in Hindi/English as appropriate.`;

      const prompt = `${userContext ? `User context: ${JSON.stringify(userContext)}\n` : ""}
Recent conversation: ${JSON.stringify(history || [])}
User message: "${message}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text || "I am here to help with your KalaKriti journey!" });
    } catch (err: any) {
      console.error("Chat error:", err);
      return res.status(500).json({ error: err.message || "Chat failed" });
    }
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: 3000 },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KalaKriti server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server start error:", err);
});
