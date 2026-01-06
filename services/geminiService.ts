import { GoogleGenAI, Type } from "@google/genai";
import { CurrencyCode, ConversionResponse, HistoryResponse } from "../types";

/**
 * Performs a real-time currency conversion using Google Search Grounding.
 */
export const convertCurrencyWithGenAI = async (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<ConversionResponse> => {
  // Use the exclusively provided API Key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-3-flash-preview for optimal speed and search grounding performance
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    I need to convert ${amount} ${from} to ${to}.
    1. Search for the current real-time exchange rate for ${from} to ${to}.
    2. Calculate the converted amount.
    3. Provide a response in this specific format:
       "RESULT_RATE: [Exchange Rate Number]"
       "RESULT_TOTAL: [Total Converted Amount Number]"
       "SUMMARY: [A natural language sentence describing the conversion and the current rate source date]"
       "INSIGHTS: [Two brief bullet points about recent trends or news affecting this currency pair]"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Search Grounding
        temperature: 0.7,
      },
    });

    const text = response.text || "Sorry, I couldn't retrieve the data.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const rateMatch = text.match(/RESULT_RATE:\s*([\d,.]+)/);
    const totalMatch = text.match(/RESULT_TOTAL:\s*([\d,.]+)/);
    
    const displayHtml = text
      .replace(/RESULT_RATE:.*\n?/, '')
      .replace(/RESULT_TOTAL:.*\n?/, '')
      .replace('SUMMARY:', '')
      .replace('INSIGHTS:', '\n\n**Market Insights:**')
      .trim();

    return {
      rateText: displayHtml,
      exchangeRate: rateMatch ? rateMatch[1] : undefined,
      calculatedAmount: totalMatch ? totalMatch[1] : undefined,
      groundingChunks: groundingChunks,
    };
  } catch (error: any) {
    console.error("Gemini Conversion Error:", error);
    throw new Error("Failed to convert currency. Please ensure the system API configuration is correct.");
  }
};

/**
 * Fetches historical trend data using internal model knowledge.
 */
export const getHistoricalTrends = async (
  from: CurrencyCode,
  to: CurrencyCode,
  compareFrom?: CurrencyCode,
  compareTo?: CurrencyCode
): Promise<HistoryResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview"; 

  const isComparing = !!(compareFrom && compareTo);

  const prompt = isComparing 
    ? `Generate a JSON dataset representing the daily exchange rate closing values for two pairs:
       1. ${from} to ${to} (field: data)
       2. ${compareFrom} to ${compareTo} (field: compareData)
       For the past 14 days.
       The data should be realistic based on your training data.
       Provide a brief 1-sentence analysis for each trend.`
    : `Generate a JSON dataset representing the daily exchange rate closing values for ${from} to ${to} for the past 14 days.
       The data should be realistic based on your training data.
       Also provide a brief 1-sentence analysis of the trend.`;

  const schemaProperties: any = {
    data: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "YYYY-MM-DD" },
          rate: { type: Type.NUMBER },
        },
        required: ["date", "rate"],
      },
    },
    analysis: { type: Type.STRING },
  };

  if (isComparing) {
    schemaProperties.compareData = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "YYYY-MM-DD" },
          rate: { type: Type.NUMBER },
        },
        required: ["date", "rate"],
      },
    };
    schemaProperties.compareAnalysis = { type: Type.STRING };
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaProperties,
          required: isComparing ? ["data", "analysis", "compareData", "compareAnalysis"] : ["data", "analysis"],
        },
      },
    });

    const cleanText = (response.text || "{}").replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanText);
    return result as HistoryResponse;
  } catch (error: any) {
    console.error("Gemini History Error:", error);
    return { data: [], analysis: "Could not load historical data." };
  }
};