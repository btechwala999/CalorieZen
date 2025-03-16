import NavSidebar from "@/components/nav-sidebar";
import FoodEntry from "@/components/food-entry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodEntry as FoodEntryType } from "@shared/schema";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Trash2, Apple } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeleteFoodEntry } from "@/components/delete-food-entry";

export default function FoodDiary() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startDate = startOfDay(selectedDate);
  const endDate = endOfDay(selectedDate);

  const { data: foodEntries, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/food-entries", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/food-entries?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return res.json();
    },
    // Ensure entries are always fetched when the component mounts
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Safely create meal type entries
  const mealTypeEntries = {
    breakfast: foodEntries ? foodEntries.filter(entry => entry?.mealType?.toLowerCase() === "breakfast") : [],
    lunch: foodEntries ? foodEntries.filter(entry => entry?.mealType?.toLowerCase() === "lunch") : [],
    dinner: foodEntries ? foodEntries.filter(entry => entry?.mealType?.toLowerCase() === "dinner") : [],
    snack: foodEntries ? foodEntries.filter(entry => entry?.mealType?.toLowerCase() === "snack") : [],
  };

  // Safely calculate total calories
  const totalCalories = foodEntries ? foodEntries.reduce((sum, entry) => sum + (entry?.calories || 0), 0) : 0;

  // Handle date change safely
  const handleDateChange = (dateString: string) => {
    try {
      const newDate = parseISO(dateString);
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  };

  // Add delete mutation
  const deleteFoodEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await fetch(`/api/food-entries/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete food entry");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Delete error:", error);
        throw error;
      }
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
      
      // Explicitly refetch the data
      refetch();
      
      toast({
        title: "Success",
        description: "Food entry deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete food entry",
        variant: "destructive",
      });
    },
  });

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this food entry?")) {
      deleteFoodEntryMutation.mutate(id);
    }
  };

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Food Diary</h1>
              <p className="text-muted-foreground">
                Track your daily food intake with AI-powered calorie estimation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs defaultValue="diary" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="diary" className="flex-1 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Diary
                </span>
              </TabsTrigger>
              <TabsTrigger value="add" className="flex-1 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  <Apple className="h-4 w-4" />
                  Add Food
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="diary" className="space-y-4 max-h-[calc(100vh-250px)] overflow-auto pr-2">
              <FoodDiaryContent 
                date={selectedDate} 
                onDeleteEntry={handleDeleteEntry} 
                isDeleting={deleteFoodEntryMutation.isPending}
              />
            </TabsContent>
            <TabsContent value="add" className="overflow-visible">
              <FoodEntry selectedDate={selectedDate} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

interface FoodDiaryContentProps {
  date: Date;
  onDeleteEntry: (id: string) => void;
  isDeleting: boolean;
}

function FoodDiaryContent({ date, onDeleteEntry, isDeleting }: FoodDiaryContentProps) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const { data: foodEntries = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/food-entries", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/food-entries?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return res.json();
    },
    // Ensure entries are always fetched when the component mounts
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // State to track locally deleted entries
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<string[]>([]);

  // Function to handle local deletion
  const handleLocalDelete = (id: string) => {
    setLocallyDeletedIds(prev => [...prev, id]);
  };

  // Filter out locally deleted entries
  const filteredEntries = foodEntries.filter(entry => !locallyDeletedIds.includes(entry.id.toString()));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Error loading food entries
      </div>
    );
  }

  if (!filteredEntries || filteredEntries.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No food entries for this date
      </div>
    );
  }

  // Group food entries by meal type
  const entriesByMealType: Record<string, any[]> = {};
  filteredEntries.forEach((entry: any) => {
    const mealType = entry.mealType || "other";
    if (!entriesByMealType[mealType]) {
      entriesByMealType[mealType] = [];
    }
    entriesByMealType[mealType].push(entry);
  });

  // Calculate total calories
  const totalCalories = filteredEntries.reduce(
    (sum: number, entry: any) => sum + (entry.calories || 0),
    0
  );

  return (
    <div className="space-y-6">
      <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
        <CardHeader className="pb-2">
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Your calorie intake for {format(date, "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalories} calories</div>
        </CardContent>
      </Card>

      {Object.entries(entriesByMealType).map(([mealType, entries]) => (
        <Card key={mealType} style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
          <CardHeader className="pb-2">
            <CardTitle className="capitalize">{mealType}</CardTitle>
            <CardDescription>
              {entries.reduce((sum: number, entry: any) => sum + (entry.calories || 0), 0)} calories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {entries.map((entry: any) => (
                <div key={entry.id} className="flex justify-between items-center py-2 border-b" style={{ borderBottomColor: 'rgba(var(--border-rgb), var(--border-opacity))' }}>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.calories} calories
                    </div>
                  </div>
                  <DeleteFoodEntry 
                    entryId={entry.id.toString()} 
                    onSuccess={() => refetch()}
                    onDelete={handleLocalDelete}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
