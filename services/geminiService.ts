import { GoogleGenAI } from "@google/genai";
import { SearchResult, MapSource, SearchCriteria } from '../types';

// Initialize Gemini Client
// IMPORTANT: The API key MUST be provided via environment variable 'API_KEY'
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchFoodInDistrict = async (
  city: string, 
  district: string,
  criteria: SearchCriteria
): Promise<SearchResult> => {
  try {
    // Construct a specific prompt based on user criteria
    let criteriaText = "";
    if (criteria.cuisine !== 'All') {
      criteriaText += `- Cuisine Type: Focus specifically on ${criteria.cuisine}.\n`;
    }
    if (criteria.budget !== 'Any') {
      criteriaText += `- Price Range: Focus on ${criteria.budget} options.\n`;
    }
    if (criteria.minRating !== 'Any') {
        criteriaText += `- Minimum Google Maps Rating: ${criteria.minRating} stars or higher.\n`;
    }
    if (criteria.keyword.trim() !== "") {
      criteriaText += `- Special Request/Keyword: Must relate to "${criteria.keyword}".\n`;
    }

    const ratingPreference = criteria.minRating !== 'Any' ? `${criteria.minRating}+` : '4.0+';

    const prompt = `Please recommend 6-8 popular and highly-rated food spots (Google Maps ${ratingPreference} stars preferred) in ${city} ${district} (Taiwan). 
    
    User Preferences:
    ${criteriaText}
    
    For each recommendation:
    1. Provide the name.
    2. Give a brief description.
    3. Explain why it fits the criteria (if applicable).
    
    Ensure the response is helpful for a foodie tourist. 
    Use Traditional Chinese (Taiwan).
    If the specific criteria cannot be met perfectly, find the closest matches or best local alternatives and explain why.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Use Google Maps grounding to get real locations and links
        tools: [{ googleMaps: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "抱歉，暫時無法產生美食清單，請稍後再試。";
    
    // Extract Grounding Chunks (Google Maps Links)
    let mapSources: MapSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
        mapSources = groundingChunks
        .map((chunk: any) => {
            if (chunk.web) {
               return {
                   title: chunk.web.title,
                   uri: chunk.web.uri
               }
            }
            if (chunk.maps) {
                return {
                    title: chunk.maps.title || "Location on Map",
                    uri: chunk.maps.googleMapsUri || chunk.maps.uri, // Handle potential field variations
                    sourceId: chunk.maps.sourceId
                };
            }
            return null;
        })
        .filter((source: any): source is MapSource => source !== null);
    }

    return {
      text,
      mapSources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("搜尋失敗，請檢查網路或稍後再試。");
  }
};