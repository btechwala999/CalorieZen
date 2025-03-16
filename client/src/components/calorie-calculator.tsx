import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserMetricsSchema, UpdateUserMetrics } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function CalorieCalculator() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<UpdateUserMetrics>({
    resolver: zodResolver(updateUserMetricsSchema),
    defaultValues: {
      height: user?.height || undefined,
      weight: user?.weight || undefined,
      age: user?.age || undefined,
      gender: user?.gender || undefined,
      activityLevel: user?.activityLevel || "sedentary",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        height: user.height || undefined,
        weight: user.weight || undefined,
        age: user.age || undefined,
        gender: user.gender || undefined,
        activityLevel: user.activityLevel || "sedentary",
      });
    }
  }, [user, form]);

  const updateMetricsMutation = useMutation({
    mutationFn: async (data: UpdateUserMetrics) => {
      try {
        const res = await apiRequest("POST", "/api/user/metrics", data);
        return res.json();
      } catch (error) {
        console.error("Error updating metrics:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Success",
        description: "Your metrics have been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update metrics",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateUserMetrics) => {
    // Ensure all numeric values are properly converted to numbers
    const formattedData = {
      ...data,
      height: data.height ? Number(data.height) : undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      age: data.age ? Number(data.age) : undefined,
    };
    
    updateMetricsMutation.mutate(formattedData);
  };

  const calculateBMR = () => {
    const values = form.getValues();
    if (!values.weight || !values.height || !values.age || !values.gender) return 0;

    try {
      const weight = Number(values.weight);
      const height = Number(values.height);
      const age = Number(values.age);

      // Harris-Benedict Formula
      if (values.gender === "male") {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
    } catch (error) {
      console.error("Error calculating BMR:", error);
      return 0;
    }
  };

  const calculateTDEE = () => {
    try {
      const bmr = calculateBMR();
      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
      };
      
      const level = form.getValues("activityLevel") || "sedentary";
      return Math.round(bmr * (activityMultipliers[level] || 1.2));
    } catch (error) {
      console.error("Error calculating TDEE:", error);
      return 0;
    }
  };

  // Check if we have enough data to show the calorie calculation
  const canCalculateCalories = () => {
    const values = form.getValues();
    return Boolean(values.weight && values.height && values.age && values.gender);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your Daily Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          field.onChange(value);
                        }}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          field.onChange(value);
                        }}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          field.onChange(value);
                        }}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Light Exercise (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate Exercise (3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                        <SelectItem value="veryActive">Very Active (intense exercise daily)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={updateMetricsMutation.isPending}>
              {updateMetricsMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Metrics
            </Button>
          </form>
        </Form>

        {canCalculateCalories() && (
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <p className="text-lg font-semibold">
              Your Daily Calorie Needs: {calculateTDEE()} calories
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your metrics and activity level
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
