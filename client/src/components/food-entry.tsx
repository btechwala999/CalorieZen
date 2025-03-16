import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { insertFoodEntrySchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { getStoredApiKey } from "@/components/api-key-config";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

// Fallback API key
const FALLBACK_API_KEY = "AIzaSyBBodNj8zoM4LkTO-ROUOeE80zgKQlqpR8";

type FoodEntryFormData = {
  name: string;
  calories: number;
  mealType: string;
  date: string;
};

interface FoodEntryProps {
  selectedDate?: Date;
}

export default function FoodEntry({ selectedDate = new Date() }: FoodEntryProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  
  const form = useForm<FoodEntryFormData>({
    defaultValues: {
      name: "",
      calories: 0,
      mealType: "breakfast",
      date: selectedDate.toISOString().slice(0, 16),
    },
  });

  const foodEntryMutation = useMutation({
    mutationFn: async (data: FoodEntryFormData) => {
      const res = await apiRequest("POST", "/api/food-entries", {
        ...data,
        date: new Date(data.date)
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries for the selected date
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
      
      queryClient.invalidateQueries({
        queryKey: ["/api/food-entries", startDate.toISOString(), endDate.toISOString()]
      });
      
      setFoodName("");
      setQuantity("");
      
      toast({
        title: "Success",
        description: "Food entry added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get API key from localStorage if available, otherwise use fallback
  const getApiKey = (): string => {
    try {
      const key = getStoredApiKey();
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

  // Function to directly calculate calories for common foods
  const calculateCalories = (food: string, qty?: string): number => {
    const foodLower = food.toLowerCase();
    
    // Special case for water
    if (foodLower.includes("water")) {
      return 0;
    }
    
    // Base calories for different food types
    let baseCalories = 100; // Default
    
    // Common foods
    if (foodLower.includes("apple")) baseCalories = 95;
    else if (foodLower.includes("banana")) baseCalories = 105;
    else if (foodLower.includes("orange")) baseCalories = 62;
    else if (foodLower.includes("pizza")) baseCalories = 285;
    else if (foodLower.includes("burger")) baseCalories = 350;
    else if (foodLower.includes("rice")) baseCalories = 130;
    else if (foodLower.includes("bread")) baseCalories = 75;
    else if (foodLower.includes("chicken")) baseCalories = 165;
    else if (foodLower.includes("beef")) baseCalories = 250;
    else if (foodLower.includes("fish")) baseCalories = 136;
    else if (foodLower.includes("egg")) baseCalories = 78;
    else if (foodLower.includes("milk")) baseCalories = 42;
    else if (foodLower.includes("cheese")) baseCalories = 113;
    else if (foodLower.includes("yogurt")) baseCalories = 59;
    else if (foodLower.includes("pasta")) baseCalories = 131;
    else if (foodLower.includes("potato")) baseCalories = 163;
    else if (foodLower.includes("carrot")) baseCalories = 41;
    else if (foodLower.includes("broccoli")) baseCalories = 55;
    else if (foodLower.includes("spinach")) baseCalories = 23;
    else if (foodLower.includes("salad")) baseCalories = 33;
    else if (foodLower.includes("chocolate")) baseCalories = 546;
    else if (foodLower.includes("ice cream")) baseCalories = 207;
    else if (foodLower.includes("cookie")) baseCalories = 148;
    else if (foodLower.includes("cake")) baseCalories = 257;
    else if (foodLower.includes("pie")) baseCalories = 300;
    else if (foodLower.includes("donut")) baseCalories = 192;
    else if (foodLower.includes("soda")) baseCalories = 140;
    else if (foodLower.includes("juice")) baseCalories = 112;
    else if (foodLower.includes("coffee")) baseCalories = 2;
    else if (foodLower.includes("tea")) baseCalories = 2;
    else if (foodLower.includes("beer")) baseCalories = 154;
    else if (foodLower.includes("wine")) baseCalories = 123;
    else if (foodLower.includes("whiskey") || foodLower.includes("vodka")) baseCalories = 97;
    
    // Adjust for quantity if provided
    if (qty) {
      const qtyLower = qty.toLowerCase();
      const numMatch = qtyLower.match(/\d+/);
      if (numMatch) {
        const num = parseInt(numMatch[0], 10);
        if (num > 1) {
          return baseCalories * num;
        }
      }
      
      // Adjust for common measurements
      if (qtyLower.includes("cup")) {
        return Math.round(baseCalories * 2);
      } else if (qtyLower.includes("tablespoon") || qtyLower.includes("tbsp")) {
        return Math.round(baseCalories * 0.1);
      } else if (qtyLower.includes("teaspoon") || qtyLower.includes("tsp")) {
        return Math.round(baseCalories * 0.03);
      } else if (qtyLower.includes("gram") || qtyLower.includes("g")) {
        const grams = numMatch ? parseInt(numMatch[0], 10) : 100;
        return Math.round(baseCalories * (grams / 100));
      } else if (qtyLower.includes("ounce") || qtyLower.includes("oz")) {
        const ounces = numMatch ? parseInt(numMatch[0], 10) : 1;
        return Math.round(baseCalories * (ounces * 0.28));
      } else if (qtyLower.includes("pound") || qtyLower.includes("lb")) {
        const pounds = numMatch ? parseInt(numMatch[0], 10) : 1;
        return Math.round(baseCalories * (pounds * 4.5));
      } else if (qtyLower.includes("slice") || qtyLower.includes("piece")) {
        return Math.round(baseCalories * 0.8);
      }
    }
    
    return baseCalories;
  };

  const handleSearch = async () => {
    if (!foodName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a food name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the API key
      const apiKey = getApiKey();
      
      // Create a prompt that includes quantity if provided
      const foodWithQuantity = quantity ? `${quantity} of ${foodName}` : foodName;
      const promptText = `How many calories are in ${foodWithQuantity}? Provide ONLY a number as your answer, no text. For example, if it's 150 calories, just respond with 150.`;
      
      console.log("Sending prompt to Gemini:", promptText);
      
      try {
        // Make a direct call to Gemini API with improved parameters
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              topP: 0.1,
              topK: 16,
              maxOutputTokens: 20
            }
          })
        });

        const data = await response.json();
        console.log("API response:", JSON.stringify(data));
        
        // Check if the response contains an error
        if (data.error) {
          console.error("API error:", data.error);
          
          // Show specific error message based on error code
          if (data.error.code === 404) {
            toast({
              title: "API Error",
              description: "The Gemini API endpoint could not be found. Please check your configuration.",
              variant: "destructive",
            });
          } else if (data.error.code === 400) {
            toast({
              title: "API Error",
              description: "Bad request to Gemini API. Please check your API key and try again.",
              variant: "destructive",
            });
          } else if (data.error.code === 401 || data.error.code === 403) {
            toast({
              title: "API Error",
              description: "Authentication error with Gemini API. Please check your API key.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "API Error",
              description: `Error from Gemini API: ${data.error.message || "Unknown error"}`,
              variant: "destructive",
            });
          }
          
          throw new Error(data.error.message || "Unknown API error");
        }
        
        // Try to extract the calorie value from the response
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          const text = data.candidates[0].content.parts[0].text.trim();
          console.log("Raw response text:", text);
          
          // Try multiple approaches to extract the number
          let calories = 0;
          
          // 1. If the text is just a number
          if (/^\d+$/.test(text)) {
            calories = parseInt(text, 10);
            console.log("Extracted calories (direct number):", calories);
          } 
          // 2. If the text contains a number with "calories" or "kcal"
          else if (text.match(/(\d+)\s*(?:calories|kcal)/i)) {
            const match = text.match(/(\d+)\s*(?:calories|kcal)/i);
            calories = parseInt(match[1], 10);
            console.log("Extracted calories (with unit):", calories);
          }
          // 3. Just extract the first number in the text
          else {
            const match = text.match(/\d+/);
            if (match) {
              calories = parseInt(match[0], 10);
              console.log("Extracted calories (first number):", calories);
            } else {
              console.warn("No number found in response:", text);
              toast({
                title: "Parsing Error",
                description: "Could not extract calorie information from the API response.",
                variant: "destructive",
              });
              throw new Error("Could not parse calorie information from response");
            }
          }
          
          // Special case for water
          if (foodName.toLowerCase().includes("water")) {
            calories = 0;
            console.log("Water detected, setting calories to 0");
          }
          
          // Create the food name with quantity if provided
          const fullFoodName = quantity ? `${quantity} of ${foodName}` : foodName;

          // Submit the food entry
          foodEntryMutation.mutate({
            name: fullFoodName,
            calories: calories,
            mealType: selectedMealType,
            date: selectedDate.toISOString(),
          });
          
          toast({
            title: `${fullFoodName}`,
            description: `Estimated calories: ${calories}`,
          });
        } else {
          console.error("Unexpected response format:", data);
          toast({
            title: "API Error",
            description: "Received an unexpected response format from the API.",
            variant: "destructive",
          });
          throw new Error("Unexpected response format from API");
        }
      } catch (error) {
        console.error("API call error:", error);
        toast({
          title: "API Error",
          description: "Failed to get calorie information from the API. No entry was added.",
          variant: "destructive",
        });
        // Do not add any entry when API fails
      }
    } catch (error) {
      console.error("Error in food search:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry due to an error.",
        variant: "destructive",
      });
      // Do not add any entry when there's an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }} className="overflow-visible">
      <CardHeader>
        <CardTitle>Add Food with AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-visible">
        <div className="space-y-2">
          <FormLabel>Food Name</FormLabel>
          <Input
            placeholder="Enter food name (e.g., Apple, Pizza, Chicken Breast)"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Quantity</FormLabel>
          <Input
            placeholder="e.g., 100g, 1 cup, 2 slices"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Meal Type</FormLabel>
          <Select 
            value={selectedMealType} 
            onValueChange={setSelectedMealType}
          >
            <SelectTrigger style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
              {mealTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleSearch} 
          disabled={isLoading || !foodName.trim()} 
          className="w-full"
          style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating Calories...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Get Calories & Add to Diary
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Powered by Google Gemini AI. Calorie estimates are approximate.
        </p>
      </CardContent>
    </Card>
  );
}

