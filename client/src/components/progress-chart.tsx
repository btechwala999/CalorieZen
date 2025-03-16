import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Exercise, FoodEntry } from "@shared/schema";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export default function ProgressChart() {
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(subDays(new Date(), 7));

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", { start: startDate.toISOString(), end: endDate.toISOString() }],
  });

  const { data: foodEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", { start: startDate.toISOString(), end: endDate.toISOString() }],
  });

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, "MM/dd");
    
    const dayExercises = exercises.filter(
      (e) => format(new Date(e.date), "MM/dd") === dateStr
    );
    const dayFoodEntries = foodEntries.filter(
      (f) => format(new Date(f.date), "MM/dd") === dateStr
    );

    return {
      date: dateStr,
      caloriesIn: dayFoodEntries.reduce((sum, entry) => sum + entry.calories, 0),
      caloriesOut: dayExercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0),
    };
  }).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCaloriesIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCaloriesOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="caloriesIn"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorCaloriesIn)"
                name="Calories In"
              />
              <Area
                type="monotone"
                dataKey="caloriesOut"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorCaloriesOut)"
                name="Calories Burned"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
