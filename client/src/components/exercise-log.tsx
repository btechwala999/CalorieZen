import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExerciseSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { startOfDay, endOfDay } from "date-fns";

const exerciseTypes = [
  "Running",
  "Walking",
  "Cycling",
  "Swimming",
  "Weight Training",
  "Yoga",
  "HIIT",
  "Other",
];

type ExerciseFormData = {
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
};

interface ExerciseLogProps {
  selectedDate?: Date;
}

export default function ExerciseLog({ selectedDate = new Date() }: ExerciseLogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<ExerciseFormData>({
    defaultValues: {
      type: "running",
      duration: 0,
      caloriesBurned: 0,
      date: selectedDate.toISOString().slice(0, 16),
    },
  });

  const exerciseMutation = useMutation({
    mutationFn: async (data: ExerciseFormData) => {
      // Parse the form data through the schema to validate and transform
      const validatedData = insertExerciseSchema.parse(data);
      const res = await apiRequest("POST", "/api/exercises", validatedData);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries for the selected date
      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);
      
      queryClient.invalidateQueries({
        queryKey: ["/api/exercises", start.toISOString(), end.toISOString()]
      });
      
      form.reset({
        type: "running",
        duration: 0,
        caloriesBurned: 0,
        date: selectedDate.toISOString().slice(0, 16),
      });
      
      toast({
        title: "Success",
        description: "Exercise logged successfully",
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

  const onSubmit = (data: ExerciseFormData) => {
    try {
      exerciseMutation.mutate(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
      <CardHeader>
        <CardTitle>Log Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}>
                      {exerciseTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={0}
                      style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caloriesBurned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories Burned</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={0}
                      style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      value={field.value.slice(0, 16)}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (!isNaN(date.getTime())) {
                          field.onChange(date.toISOString());
                        }
                      }}
                      style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={exerciseMutation.isPending}
              style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
            >
              {exerciseMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Log Exercise
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
