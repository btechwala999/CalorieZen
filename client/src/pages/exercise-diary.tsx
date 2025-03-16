import NavSidebar from "@/components/nav-sidebar";
import ExerciseLog from "@/components/exercise-log";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "@shared/schema";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function ExerciseDiary() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = startOfDay(selectedDate);
  const endDate = endOfDay(selectedDate);

  const { data: exercises = [], isLoading, error } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/exercises?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      return res.json();
    },
  });

  // Group exercises by type
  const exercisesByType = exercises.reduce((acc, exercise) => {
    const type = exercise.type.toLowerCase();
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const totalCaloriesBurned = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
  const totalDuration = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Exercise Diary</h1>
              <p className="text-muted-foreground">
                Track your workouts and monitor your fitness progress
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Daily Log</CardTitle>
                    <Input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                      className="w-auto"
                      style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
                    />
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderBottomColor: 'rgba(var(--border-rgb), var(--border-opacity))' }}>
                          <TableHead className="w-[200px]">Exercise Type</TableHead>
                          <TableHead>Duration (min)</TableHead>
                          <TableHead className="text-right">Calories Burned</TableHead>
                          <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(exercisesByType).map(([type, exercises]) => (
                          exercises.map((exercise) => (
                            <TableRow key={exercise.id} style={{ borderBottomColor: 'rgba(var(--border-rgb), var(--border-opacity))' }}>
                              <TableCell className="font-medium capitalize">
                                {type}
                              </TableCell>
                              <TableCell>{exercise.duration}</TableCell>
                              <TableCell className="text-right">{exercise.caloriesBurned}</TableCell>
                              <TableCell className="text-right">
                                {format(new Date(exercise.date), "HH:mm")}
                              </TableCell>
                            </TableRow>
                          ))
                        ))}
                        {exercises.length === 0 && (
                          <TableRow style={{ borderBottomColor: 'rgba(var(--border-rgb), var(--border-opacity))' }}>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No exercises logged for this day
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    <div className="mt-4 pt-4 border-t" style={{ borderTopColor: 'rgba(var(--border-rgb), var(--border-opacity))' }}>
                      <p className="text-right font-semibold">
                        Total Calories Burned: {totalCaloriesBurned}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                  <CardHeader>
                    <CardTitle>Exercise Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(exercisesByType).map(([type, exercises]) => (
                        <div key={type} className="p-4 bg-secondary rounded-lg" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                          <p className="font-semibold capitalize">{type}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Duration:</span>
                              <span className="font-medium">
                                {exercises.reduce((sum, ex) => sum + ex.duration, 0)} min
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Calories:</span>
                              <span className="font-medium">
                                {exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/10 rounded-lg" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                        <p className="font-semibold">Total Duration</p>
                        <p className="text-2xl font-bold">{totalDuration}</p>
                        <p className="text-sm text-muted-foreground">minutes</p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-lg" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                        <p className="font-semibold">Total Calories Burned</p>
                        <p className="text-2xl font-bold">{totalCaloriesBurned}</p>
                        <p className="text-sm text-muted-foreground">calories</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <ExerciseLog selectedDate={selectedDate} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 