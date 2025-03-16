import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { getFoodCalories } from "@/services/gemini-service";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AiFoodSearchProps {
  onFoodSelect: (foodData: {
    name: string;
    calories: number;
    portion?: string;
  }) => void;
}

export default function AiFoodSearch({ onFoodSelect }: AiFoodSearchProps) {
  const [foodName, setFoodName] = useState("");
  const [portion, setPortion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!foodName.trim()) {
      setError("Food name is required");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const result = await getFoodCalories(foodName, portion);
      
      if (result.error && !result.isDemo) {
        setError(result.error);
        return;
      }
      
      onFoodSelect({
        name: foodName,
        calories: result.calories,
        portion: portion || undefined,
      });
      
      // Show nutritional info in toast
      toast({
        title: `${foodName} ${portion ? `(${portion})` : ''}`,
        description: `Calories: ${result.calories} | Protein: ${result.protein || '?'}g | Carbs: ${result.carbs || '?'}g | Fat: ${result.fat || '?'}g`,
      });
      
      // Clear the inputs
      setFoodName("");
      setPortion("");
    } catch (error) {
      console.error("Error in AI food search:", error);
      setError("Failed to get food information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI Food Search</h3>
        <div className="text-xs text-muted-foreground">Powered by Gemini AI</div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="food-name">Food Name</Label>
        <Input
          id="food-name"
          placeholder="e.g., Apple, Chicken Breast, Pizza"
          value={foodName}
          onChange={(e) => {
            setFoodName(e.target.value);
            if (error) setError(null);
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="portion">Portion (optional)</Label>
        <Input
          id="portion"
          placeholder="e.g., 100g, 1 cup, 1 slice"
          value={portion}
          onChange={(e) => setPortion(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleSearch} 
        disabled={isLoading || !foodName.trim()} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Get Nutrition Info
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Enter a food item to get AI-estimated nutritional information. Results are approximate.
      </p>
    </div>
  );
} 