import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Brain, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getChatbotResponse, isGeminiAvailable } from "@/services/gemini-service";
import { Alert, AlertDescription } from "./ui/alert";

interface NutritionInsightsProps {
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
}

export default function NutritionInsights({ caloriesConsumed, caloriesBurned, netCalories }: NutritionInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user");
      return res.json();
    },
  });

  // Check if there's enough food data to generate meaningful insights
  const hasEnoughData = () => {
    return caloriesConsumed > 0;
  };

  const fetchInsights = async () => {
    if (!user) return;
    
    // Check if there's enough data to generate insights
    if (!hasEnoughData()) {
      setError("Not enough food data to generate insights. Please add some food entries to your diary first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Calculate TDEE based on user metrics
      let tdee = 0;
      if (user.weight && user.height && user.age && user.gender) {
        // Calculate BMR
        let bmr = 0;
        if (user.gender === "male") {
          bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
        } else {
          bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
        }
        
        // Apply activity multiplier
        const activityMultipliers: Record<string, number> = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          veryActive: 1.9,
        };
        
        tdee = Math.round(bmr * (activityMultipliers[user.activityLevel || "sedentary"] || 1.2));
      }
      
      // Prepare prompt for Gemini API
      const prompt = `
        As a nutrition expert, provide personalized insights based on the following data:
        - Calories consumed today: ${caloriesConsumed}
        - Calories burned from exercise: ${caloriesBurned}
        - Net calories: ${netCalories}
        - Estimated daily calorie needs (TDEE): ${tdee || "Unknown"}
        
        Please provide:
        1. A brief analysis of their current calorie balance
        2. Whether they're on track with their estimated needs
        3. One practical tip to improve their nutrition
        
        Keep your response concise (max 150 words) and conversational.
      `;
      
      // Use the client-side Gemini service instead of making a server-side API call
      const result = await getChatbotResponse(prompt);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setInsights(result.response);
    } catch (err: any) {
      console.error("Error fetching insights:", err);
      
      // Check if the error is related to the API key
      if (!isGeminiAvailable() || (err.message && err.message.includes("API key"))) {
        setError("Gemini API key not configured. Please add your API key in the settings.");
      } else {
        setError("Failed to generate insights. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch insights when component mounts or when calorie data changes significantly
  useEffect(() => {
    if (user && !insights && !loading) {
      fetchInsights();
    }
  }, [user, caloriesConsumed, caloriesBurned, netCalories]);

  // Fallback content when API key is not configured
  const getFallbackInsights = () => {
    if (!hasEnoughData()) {
      return "Add some food entries to your diary to get nutrition insights.";
    }
    
    let message = "";
    
    if (tdee > 0) {
      const calorieBalance = netCalories - tdee;
      if (calorieBalance > 300) {
        message = `You're consuming more calories (${netCalories}) than your estimated needs (${tdee}). Consider reducing portion sizes or increasing physical activity.`;
      } else if (calorieBalance < -300) {
        message = `You're consuming fewer calories (${netCalories}) than your estimated needs (${tdee}). Make sure you're getting enough nutrition to support your body's needs.`;
      } else {
        message = `Your calorie intake (${netCalories}) is well-balanced with your estimated needs (${tdee}). Keep up the good work!`;
      }
    } else {
      message = `You've consumed ${caloriesConsumed} calories and burned ${caloriesBurned} through exercise today. Complete your body metrics to get more personalized insights.`;
    }
    
    return message;
  };
  
  // Calculate TDEE for fallback insights
  const calculateTDEE = () => {
    if (!user || !user.weight || !user.height || !user.age || !user.gender) {
      return 0;
    }
    
    // Calculate BMR
    let bmr = 0;
    if (user.gender === "male") {
      bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
    } else {
      bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
    }
    
    // Apply activity multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    
    return Math.round(bmr * (activityMultipliers[user.activityLevel || "sedentary"] || 1.2));
  };
  
  const tdee = calculateTDEE();

  return (
    <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Nutrition Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasEnoughData() ? (
          <Alert className="bg-muted border-amber-500" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Add some food entries to your diary to get personalized nutrition insights.
            </AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Analyzing your nutrition data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="mb-4">{getFallbackInsights()}</p>
            <Button onClick={fetchInsights} variant="outline" size="sm" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
              Try Again
            </Button>
          </div>
        ) : insights ? (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line">{insights}</div>
            <div className="mt-4 text-right">
              <Button onClick={fetchInsights} variant="outline" size="sm" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                Refresh Insights
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground mb-4">No insights available yet.</p>
            <p className="mb-4">{getFallbackInsights()}</p>
            <Button onClick={fetchInsights} variant="outline" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
              Generate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 