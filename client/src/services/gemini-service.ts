import { GoogleGenerativeAI } from "@google/generative-ai";

// Local storage key for the API key
const API_KEY_STORAGE_KEY = "gemini-api-key";

// Fallback API key (your provided key)
const FALLBACK_API_KEY = "AIzaSyBBodNj8zoM4LkTO-ROUOeE80zgKQlqpR8";

// Get API key from localStorage if available, otherwise use fallback
const getApiKey = (): string => {
  try {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (key && key.trim() && key.length > 10) {
      console.log("Using API key from localStorage");
      return key;
    } else {
      console.log("Using fallback API key");
      return FALLBACK_API_KEY;
    }
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    console.log("Using fallback API key due to error");
    return FALLBACK_API_KEY;
  }
};

// Check if API key is configured
const isApiKeyConfigured = (): boolean => {
  return true; // Always return true since we have a fallback
};

// Initialize the Gemini API safely
const getGenAI = (): GoogleGenerativeAI | null => {
  try {
    const key = getApiKey();
    console.log("Initializing Gemini API with key");
    return new GoogleGenerativeAI(key);
  } catch (e) {
    console.error("Error initializing Gemini API:", e);
    return null;
  }
};

// Function to check if the API is available
export function isGeminiAvailable(): boolean {
  return true; // Always return true since we have a fallback
}

// Function to get a demo response when API is not available
function getDemoResponse(type: 'calories' | 'exercise' | 'chat'): any {
  switch (type) {
    case 'calories':
      return {
        calories: 150,
        protein: 2,
        carbs: 30,
        fat: 0,
        isDemo: true
      };
    case 'exercise':
      return {
        recommendations: "This is a demo response. To get real AI-powered recommendations, please configure your Gemini API key.",
        isDemo: true
      };
    case 'chat':
      return {
        response: "This is a demo response. To enable the AI chatbot, please configure your Gemini API key in the application settings.",
        isDemo: true
      };
  }
}

// Helper function to safely parse JSON
function safeJsonParse(text: string): any {
  try {
    // First try to extract JSON using regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON object found, try parsing the whole text
    return JSON.parse(text);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null;
  }
}

/**
 * Get calorie information for a food item
 * @param foodName The name of the food item
 * @param portion The portion size (optional)
 * @returns An object containing the estimated calories and nutritional information
 */
export async function getFoodCalories(foodName: string, portion?: string): Promise<{ 
  calories: number;
  error?: string;
  isDemo?: boolean;
}> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      console.error("Failed to initialize Gemini API for food calories");
      return { 
        ...getDemoResponse('calories'),
        error: "Failed to initialize Gemini API."
      };
    }

    try {
      console.log("Making Gemini API request for food calories");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0 flash" });
      
      const portionText = portion ? ` (${portion})` : '';
      const prompt = `
      tell me the exact calories in ${foodName} of ${portionText}, give only calorie number, no text allowed in response
        Return ONLY a JSON object with the following format:
        {
          "calories": [number of calories],
        }
        
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Received response from Gemini API for food calories");
      
      // Parse the JSON response
      const nutritionData = safeJsonParse(text);
      
      if (!nutritionData) {
        console.error("Failed to parse nutrition data from:", text);
        return { 
          calories: 0,
          error: "Could not parse nutritional information from the response."
        };
      }
      
      return {
        calories: nutritionData.calories || 0,
      };
    } catch (apiError) {
      console.error("Gemini API error for food calories:", apiError);
      
      // Check for specific API errors
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      if (errorMessage.includes("API key")) {
        return { 
          ...getDemoResponse('calories'),
          error: "Invalid API key. Please check your Gemini API key and try again."
        };
      }
      
      if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
        return { 
          ...getDemoResponse('calories'),
          error: "API quota exceeded. Please try again later."
        };
      }
      
      return { 
        ...getDemoResponse('calories'),
        error: "An error occurred with the Gemini API. Please try again later."
      };
    }
  } catch (error) {
    console.error("Error getting food calories:", error);
    return { 
      ...getDemoResponse('calories'),
      error: "An error occurred while fetching nutritional information."
    };
  }
}

/**
 * Get exercise recommendations based on user goals
 * @param goal The user's fitness goal
 * @param preferences Any exercise preferences or limitations
 * @returns Exercise recommendations
 */
export async function getExerciseRecommendations(
  goal: string,
  preferences?: string
): Promise<{ recommendations: string; error?: string; isDemo?: boolean }> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      return { 
        ...getDemoResponse('exercise'),
        error: "Failed to initialize Gemini API."
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0 flash" });
      
      const preferencesText = preferences ? ` My preferences/limitations are: ${preferences}.` : '';
      const prompt = `
        Please recommend exercises for the following fitness goal: ${goal}.${preferencesText}
        Provide 3-5 specific exercises, with brief descriptions of how they help achieve the goal.
        Format your response as a bulleted list.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { recommendations: response.text() };
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      
      // Check for specific API errors
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      if (errorMessage.includes("API key")) {
        return { 
          ...getDemoResponse('exercise'),
          error: "Invalid API key. Please check your Gemini API key and try again."
        };
      }
      
      if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
        return { 
          ...getDemoResponse('exercise'),
          error: "API quota exceeded. Please try again later."
        };
      }
      
      return { 
        ...getDemoResponse('exercise'),
        error: "An error occurred with the Gemini API. Please try again later."
      };
    }
  } catch (error) {
    console.error("Error getting exercise recommendations:", error);
    return { 
      ...getDemoResponse('exercise'),
      error: "An error occurred while fetching exercise recommendations."
    };
  }
}

/**
 * Get a response from the AI chatbot
 * @param message The user's message
 * @param context Optional context about the user (e.g., their goals, dietary restrictions)
 * @returns The chatbot's response
 */
export async function getChatbotResponse(
  message: string,
  context?: string
): Promise<{ response: string; error?: string; isDemo?: boolean }> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      return { 
        ...getDemoResponse('chat'),
        error: "Failed to initialize Gemini API."
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0 flash" });
      
      const contextText = context ? `Context about me: ${context}. ` : '';
      const prompt = `
        ${contextText}I'm using a nutrition and fitness tracking app. Please respond to my question or request:
        "${message}"
        
        Provide a helpful, concise response related to nutrition, fitness, or health. If my question is unrelated to these topics, 
        politely redirect me to health and fitness related questions.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { response: response.text() };
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      
      // Check for specific API errors
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      if (errorMessage.includes("API key")) {
        return { 
          ...getDemoResponse('chat'),
          error: "Invalid API key. Please check your Gemini API key and try again."
        };
      }
      
      if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
        return { 
          ...getDemoResponse('chat'),
          error: "API quota exceeded. Please try again later."
        };
      }
      
      return { 
        ...getDemoResponse('chat'),
        error: "An error occurred with the Gemini API. Please try again later."
      };
    }
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return { 
      ...getDemoResponse('chat'),
      error: "An error occurred while fetching the chatbot response."
    };
  }
} 