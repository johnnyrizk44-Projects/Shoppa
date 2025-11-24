import { GoogleGenAI, Type } from "@google/genai";
import { Product, ProductCategory } from "../types";
import { getHealthLabel, generateMockPrices, calculateHealthRating } from "./shopService";

const GEMINI_API_KEY = process.env.API_KEY || '';

export const identifyProductFromImage = async (base64Data: string, mimeType: string): Promise<string | null> => {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API Key missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Identify this Australian packaged food product. Return ONLY the brand and product name (e.g. 'Arnott's Vita-Weat Crackers'). Do not include punctuation or extra words like 'The product is'. If you are unsure, just describe the food item (e.g. 'Canned Tuna')."
          }
        ]
      }
    });
    return response.text?.trim() || null;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
};

export const generateProductFromQuery = async (query: string): Promise<Product | null> => {
    if (!GEMINI_API_KEY) return null;

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Schema for structured output
    const schema = {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          name: { type: Type.STRING },
          size: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING, enum: Object.values(ProductCategory) },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              energykJ: { type: Type.NUMBER },
              sugarg: { type: Type.NUMBER },
              saturatedFatg: { type: Type.NUMBER },
              sodiummg: { type: Type.NUMBER },
              proteing: { type: Type.NUMBER },
              fiberg: { type: Type.NUMBER },
            }
          }
        },
        required: ["brand", "name", "size", "category", "nutrition", "description"]
    };

    const prompt = `
      Create a realistic product entry for an Australian packaged food item matching the search query: "${query}".
      Estimate typical nutritional values per 100g/ml for this type of product.
      Use real Australian brands if the query implies one (e.g. 'Cadbury', 'Smiths', 'John West'), otherwise use a generic but realistic brand.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const data = JSON.parse(response.text || "{}");
        if (!data.name) return null;

        const product: Product = {
            id: `ai_${Date.now()}`,
            name: data.name,
            brand: data.brand,
            size: data.size || "Standard",
            category: data.category as ProductCategory,
            image: `https://placehold.co/300x300?text=${encodeURIComponent(data.name)}`, // Fallback image
            description: data.description,
            nutrition: data.nutrition,
            prices: generateMockPrices(), // Attach random prices
        };

        // Pre-calculate health star rating
        product.healthStarRating = calculateHealthRating(product.nutrition);

        return product;

    } catch (e) {
        console.error("Gemini Generation Error:", e);
        return null;
    }
}

export const getHealthExplanation = async (product: Product): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "AI insights unavailable (Missing API Key).";
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  const rating = product.healthStarRating?.toFixed(1) || "?";
  const label = product.healthStarRating ? getHealthLabel(product.healthStarRating) : "Unknown";

  const prompt = `
    You are a helpful Australian nutritionist assistant for the ShopPA app.
    Explain why the product "${product.brand} ${product.name}" has a health rating of ${rating} stars (${label}).
    
    Nutritional Data (per 100g/ml):
    - Sugar: ${product.nutrition.sugarg}g
    - Saturated Fat: ${product.nutrition.saturatedFatg}g
    - Sodium: ${product.nutrition.sodiummg}mg
    - Protein: ${product.nutrition.proteing}g
    - Fiber: ${product.nutrition.fiberg}g

    Keep the explanation short (under 60 words), friendly, and practical for a shopper standing in an aisle. 
    Mention specifically what nutrients dragged the score down or boosted it.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI health insights at this moment.";
  }
};
