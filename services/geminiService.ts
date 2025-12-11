
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult, MatchResult, NgoRequest } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Food Rescue Validator for a Zero Hunger charity platform. Your goal is to analyze images of food to facilitate quick donation logistics.

When provided with an image of food, you must:
1. Identify the Main Dish: What is the primary food item?
2. Estimate Quantity: Estimate how many people this could feed (e.g., "Feeds 4-5 people").
3. Estimate Weight: Provide a numeric estimate of the weight in kilograms (e.g., 2.5).
4. Categorize: Classify as "Veg", "Non-Veg", or "Vegan".
5. Freshness Check: Analyze visual cues (mold, discoloration, dryness, separation, texture). If the food looks spoiled, old, or unsafe, flag it immediately.
6. Safety Reasoning: Provide a specific reason for the safety decision (e.g. "Visible mold on bread", "Meat appears discolored", "Fresh and properly cooked").
7. Expiry Prediction: Estimate a safe consumption window (e.g., "Must be consumed within 4 hours").
8. Allergen Detection: Identify any potential allergens present (e.g., nuts, dairy, gluten, soy, shellfish, eggs). If no common allergens are detected, return an empty list.

CRITICAL: Return ONLY JSON.
`;

const LOGISTICS_SYSTEM_INSTRUCTION = `
You are a Logistics Matching Engine for a food donation platform. Your job is to compare a "Donation Offer" against an "NGO Request" and calculate a Match Score.

Rules for Matching:
1. Diet Compatibility: Universal Acceptance. All food types (Veg/Non-Veg/Vegan) are accepted by all NGOs. Do NOT penalize or lower the score for diet mismatches.
2. Quantity: If Donation quantity is < 10% of NGO need, Match Score is low (20).
3. Distance: Closer is better.
   - < 2km: High score boost
   - 2-10km: Moderate score
   - > 10km: Penalty

Output Format:
Return strict JSON only:
{
  "match_score": Integer (0-100),
  "reason": "Short explanation of the score",
  "recommended_action": "String (Approve / Reject / Manual Review)"
}
`;

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
  if (!navigator.onLine) {
    throw new Error("No Internet Connection");
  }

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("MISSING API KEY: VITE_GOOGLE_API_KEY is not set in .env.local");
    throw new Error("API Configuration Error: Missing VITE_GOOGLE_API_KEY. Please check your .env.local file and restart the server.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this food image according to the safety protocols."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            food_name: { type: Type.STRING, description: "Name of the dish" },
            category: { type: Type.STRING, description: "Veg, Non-Veg, or Vegan" },
            quantity_estimate: { type: Type.STRING, description: "Estimate of servings" },
            weight_kg: { type: Type.NUMBER, description: "Estimated weight in KG" },
            freshness_status: { type: Type.STRING, description: "Fresh, Suspicious, or Spoiled" },
            safety_flag: { type: Type.BOOLEAN, description: "True if safe to donate, false if unsafe" },
            safety_reason: { type: Type.STRING, description: "Specific explanation for the safety flag" },
            expiry_window: { type: Type.STRING, description: "Safe consumption window" },
            allergens: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of detected potential allergens"
            }
          },
          required: ["food_name", "category", "quantity_estimate", "freshness_status", "safety_flag", "safety_reason", "expiry_window", "allergens"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    return data as FoodAnalysisResult;
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    if (e.message?.includes("fetch")) {
      throw new Error("Network error: Please check your connection.");
    }
    throw new Error("Invalid response from AI");
  }
};

export const calculateLogisticsMatch = async (donation: FoodAnalysisResult, ngoRequest: NgoRequest): Promise<MatchResult> => {
  if (!navigator.onLine) {
    throw new Error("No Internet Connection");
  }

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("API Configuration Error: Missing VITE_GOOGLE_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const donationDataStr = JSON.stringify({
    item: donation.food_name,
    category: donation.category,
    quantity: donation.quantity_estimate,
    expiry: donation.expiry_window
  });

  const ngoDataStr = JSON.stringify(ngoRequest);

  const prompt = `
  Donation: ${donationDataStr}
  NGO Request: ${ngoDataStr}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        systemInstruction: LOGISTICS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            match_score: { type: Type.INTEGER, description: "Score from 0-100" },
            reason: { type: Type.STRING, description: "Explanation of the score calculation" },
            recommended_action: { type: Type.STRING, enum: ["Approve", "Reject", "Manual Review"] }
          },
          required: ["match_score", "reason", "recommended_action"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Logistics Engine");
    }

    return JSON.parse(response.text) as MatchResult;
  } catch (e) {
    throw new Error("Invalid logistics response");
  }
};
