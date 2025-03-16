import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  height: real("height"),
  weight: real("weight"),
  age: integer("age"),
  gender: text("gender"),
  activityLevel: text("activity_level"),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  caloriesBurned: integer("calories_burned").notNull(),
  date: timestamp("date").notNull(),
});

export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  date: timestamp("date").notNull(),
  mealType: text("meal_type").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const updateUserMetricsSchema = createInsertSchema(users).pick({
  height: true,
  weight: true,
  age: true,
  gender: true,
  activityLevel: true,
});

export const insertExerciseSchema = z.object({
  type: z.string().min(1),
  duration: z.number().min(0),
  caloriesBurned: z.number().min(0),
  date: z.string().transform((val) => new Date(val)),
});

export const insertFoodEntrySchema = z.object({
  name: z.string().min(1),
  calories: z.number().min(0),
  mealType: z.string().min(1),
  date: z.string().transform((val) => new Date(val)),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type FoodEntry = typeof foodEntries.$inferSelect;
export type UpdateUserMetrics = z.infer<typeof updateUserMetricsSchema>;
