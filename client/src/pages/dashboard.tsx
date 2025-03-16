import NavSidebar from "@/components/nav-sidebar";
import ProgressChart from "@/components/progress-chart";
import { useQuery } from "@tanstack/react-query";
import { Exercise, FoodEntry } from "@shared/schema";
import { startOfDay, endOfDay, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Dumbbell, Apple } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import NutritionInsights from "@/components/nutrition-insights";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth();
  const startDate = startOfDay(selectedDate);
  const endDate = endOfDay(selectedDate);

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/exercises?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      return res.json();
    },
  });

  const { data: foodEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/food-entries?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      return res.json();
    },
  });

  const totalCaloriesIn = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalCaloriesBurned = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
  const netCalories = totalCaloriesIn - totalCaloriesBurned;

  // Calculate TDEE if user has metrics
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
  const calorieBalance = tdee > 0 ? netCalories - tdee : 0;
  const isCalorieSurplus = calorieBalance > 0;

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Track your daily progress and manage your health goals
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories Consumed</CardTitle>
                  <Apple className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCaloriesIn}</div>
                  <p className="text-xs text-muted-foreground">Today's total intake</p>
                </CardContent>
              </Card>

              <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                  <Dumbbell className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCaloriesBurned}</div>
                  <p className="text-xs text-muted-foreground">From exercises today</p>
                </CardContent>
              </Card>

              <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Calories</CardTitle>
                  <Activity className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{netCalories}</div>
                  <p className="text-xs text-muted-foreground">Consumed minus burned</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {tdee > 0 && (
                <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                  <CardHeader>
                    <CardTitle>Calorie Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Daily Calorie Target (TDEE)</span>
                        <span className="font-semibold">{tdee} calories</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Net Calories Today</span>
                        <span className="font-semibold">{netCalories} calories</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Balance</span>
                        <span className={`font-semibold ${isCalorieSurplus ? 'text-red-500' : 'text-green-500'}`}>
                          {isCalorieSurplus ? '+' : ''}{calorieBalance} calories
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          {isCalorieSurplus 
                            ? `You're ${calorieBalance} calories over your daily target.` 
                            : calorieBalance === 0 
                              ? "You're exactly at your daily target." 
                              : `You're ${Math.abs(calorieBalance)} calories under your daily target.`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <NutritionInsights 
                caloriesConsumed={totalCaloriesIn}
                caloriesBurned={totalCaloriesBurned}
                netCalories={netCalories}
              />
            </div>

            <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
              <CardHeader>
                <CardTitle>Date Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
