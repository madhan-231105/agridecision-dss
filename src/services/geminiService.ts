import { GoogleGenAI } from "@google/genai";

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please ensure it is set in the AI Studio Secrets panel.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function getCropRecommendation(soilData: any, weatherData: any) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As an Agricultural Decision Support System, analyze the following soil and weather data and recommend the top 3 optimal crops. 
    Provide the response in JSON format with fields: recommendations (array of objects with cropName, reason, expectedYield, and riskFactors).
    
    Soil Data: ${JSON.stringify(soilData)}
    Weather Data: ${JSON.stringify(weatherData)}`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getMarketAnalysis(cropName: string, region: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the market potential for ${cropName} in ${region}. 
    Provide a brief summary of price trends, demand, and a recommendation on whether to sell now or wait.
    Return JSON with fields: summary, trend (Up/Down/Stable), recommendation.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}
