// server/index.ts
import express from "express";
import path from "path";
import session2 from "express-session";
import cors from "cors";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/mongo-storage.ts
import mongoose, { Schema, model } from "mongoose";
import MongoStore from "connect-mongo";

// server/config.ts
var mongoConfig = {
  // Local MongoDB connection string
  localUri: process.env.MONGO_LOCAL_URI || "mongodb://localhost:27017/NutriTrackPro",
  // Use the same URI for both Atlas and local for simplicity
  atlasUri: process.env.MONGO_LOCAL_URI || "mongodb://localhost:27017/NutriTrackPro",
  // Database name
  dbName: process.env.MONGO_DB_NAME || "NutriTrackPro",
  // Session settings
  session: {
    secret: process.env.SESSION_SECRET || "nutritrack-secret-key-for-development",
    ttl: 14 * 24 * 60 * 60,
    // 14 days
    autoRemove: "native"
  }
};
var serverConfig = {
  port: process.env.PORT || 3e3,
  environment: process.env.NODE_ENV || "development"
};

// server/mongo-storage.ts
var UserSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number },
  weight: { type: Number },
  age: { type: Number },
  gender: { type: String },
  activityLevel: { type: String }
}, { timestamps: true });
var ExerciseSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });
var FoodEntrySchema = new Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, required: true },
  mealType: { type: String, required: true }
}, { timestamps: true });
var UserModel = model("User", UserSchema);
var ExerciseModel = model("Exercise", ExerciseSchema);
var FoodEntryModel = model("FoodEntry", FoodEntrySchema);
var CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 }
});
var CounterModel = model("Counter", CounterSchema);
async function getNextSequence(name) {
  const counter = await CounterModel.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
var MongoStorage = class {
  sessionStore;
  isConnected = false;
  connectionUri;
  constructor() {
    this.connectionUri = mongoConfig.localUri;
    this.sessionStore = MongoStore.create({
      mongoUrl: this.connectionUri,
      ttl: mongoConfig.session.ttl,
      autoRemove: mongoConfig.session.autoRemove
    });
    this.connect();
  }
  async connect() {
    try {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(this.connectionUri, {
        dbName: mongoConfig.dbName
      });
      console.log("Connected to MongoDB successfully");
      this.isConnected = true;
      await this.initializeCounters();
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      console.error("Please make sure MongoDB is installed and running locally.");
      throw error;
    }
  }
  async initializeCounters() {
    try {
      await CounterModel.findByIdAndUpdate(
        "userId",
        { $setOnInsert: { seq: 1 } },
        { upsert: true, new: true }
      );
      await CounterModel.findByIdAndUpdate(
        "exerciseId",
        { $setOnInsert: { seq: 1 } },
        { upsert: true, new: true }
      );
      await CounterModel.findByIdAndUpdate(
        "foodEntryId",
        { $setOnInsert: { seq: 1 } },
        { upsert: true, new: true }
      );
      console.log("MongoDB counters initialized successfully");
    } catch (error) {
      console.error("Error initializing counters:", error);
      throw error;
    }
  }
  async getUser(id) {
    try {
      const user = await UserModel.findOne({ id });
      return user ? user.toObject() : void 0;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }
  async getUserByUsername(username) {
    try {
      const user = await UserModel.findOne({ username });
      return user ? user.toObject() : void 0;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }
  async createUser(insertUser) {
    try {
      const id = await getNextSequence("userId");
      const newUser = new UserModel({ ...insertUser, id });
      await newUser.save();
      return newUser.toObject();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async updateUserMetrics(id, metrics) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { id },
        { $set: metrics },
        { new: true }
      );
      if (!user) {
        throw new Error("User not found");
      }
      return user.toObject();
    } catch (error) {
      console.error("Error updating user metrics:", error);
      throw error;
    }
  }
  async addExercise(userId, exercise) {
    try {
      const id = await getNextSequence("exerciseId");
      const newExercise = new ExerciseModel({ ...exercise, id, userId });
      await newExercise.save();
      return newExercise.toObject();
    } catch (error) {
      console.error("Error adding exercise:", error);
      throw error;
    }
  }
  async getExercises(userId, startDate, endDate) {
    try {
      const exercises2 = await ExerciseModel.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      });
      return exercises2.map((exercise) => exercise.toObject());
    } catch (error) {
      console.error("Error getting exercises:", error);
      throw error;
    }
  }
  async addFoodEntry(userId, entry) {
    try {
      const id = await getNextSequence("foodEntryId");
      const newEntry = new FoodEntryModel({ ...entry, id, userId });
      await newEntry.save();
      return newEntry.toObject();
    } catch (error) {
      console.error("Error adding food entry:", error);
      throw error;
    }
  }
  async getFoodEntries(userId, startDate, endDate) {
    try {
      const entries = await FoodEntryModel.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      });
      return entries.map((entry) => entry.toObject());
    } catch (error) {
      console.error("Error getting food entries:", error);
      throw error;
    }
  }
  async deleteFoodEntry(id, userId) {
    try {
      const result = await FoodEntryModel.deleteOne({ id, userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting food entry:", error);
      throw error;
    }
  }
  async getAllUsers() {
    try {
      const users2 = await UserModel.find();
      return users2.map((user) => user.toObject());
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }
};
var mongoStorage = new MongoStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function verifyToken(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "nutritrack-secret-key-for-development",
    resave: false,
    saveUninitialized: false,
    store: mongoStorage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      httpOnly: true
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await mongoStorage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await mongoStorage.getUser(id);
      if (!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await mongoStorage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await mongoStorage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        res.json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  height: real("height"),
  weight: real("weight"),
  age: integer("age"),
  gender: text("gender"),
  activityLevel: text("activity_level")
});
var exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  caloriesBurned: integer("calories_burned").notNull(),
  date: timestamp("date").notNull()
});
var foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  date: timestamp("date").notNull(),
  mealType: text("meal_type").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var updateUserMetricsSchema = createInsertSchema(users).pick({
  height: true,
  weight: true,
  age: true,
  gender: true,
  activityLevel: true
});
var insertExerciseSchema = z.object({
  type: z.string().min(1),
  duration: z.number().min(0),
  caloriesBurned: z.number().min(0),
  date: z.string().transform((val) => new Date(val))
});
var insertFoodEntrySchema = z.object({
  name: z.string().min(1),
  calories: z.number().min(0),
  mealType: z.string().min(1),
  date: z.string().transform((val) => new Date(val))
});

// server/routes.ts
function setupRoutes(app2) {
  app2.post("/api/user/metrics", verifyToken, async (req, res) => {
    try {
      const metrics = updateUserMetricsSchema.parse(req.body);
      const user = await mongoStorage.updateUserMetrics(req.user.id, metrics);
      res.json(user);
    } catch (error) {
      console.error("Error updating user metrics:", error);
      res.status(500).json({ message: "Failed to update user metrics" });
    }
  });
  app2.post("/api/exercises", verifyToken, async (req, res) => {
    try {
      const exercise = insertExerciseSchema.parse(req.body);
      const result = await mongoStorage.addExercise(req.user.id, exercise);
      res.json(result);
    } catch (error) {
      console.error("Error adding exercise:", error);
      res.status(500).json({ message: "Failed to add exercise" });
    }
  });
  app2.get("/api/exercises", verifyToken, async (req, res) => {
    try {
      const start = new Date(req.query.start);
      const end = new Date(req.query.end);
      const exercises2 = await mongoStorage.getExercises(req.user.id, start, end);
      res.json(exercises2);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });
  app2.post("/api/food-entries", verifyToken, async (req, res) => {
    try {
      const entry = insertFoodEntrySchema.parse(req.body);
      const result = await mongoStorage.addFoodEntry(req.user.id, entry);
      res.json(result);
    } catch (error) {
      console.error("Error adding food entry:", error);
      res.status(500).json({ message: "Failed to add food entry" });
    }
  });
  app2.get("/api/food-entries", verifyToken, async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate) : /* @__PURE__ */ new Date();
      const endDate = req.query.endDate ? new Date(req.query.endDate) : /* @__PURE__ */ new Date();
      const entries = await mongoStorage.getFoodEntries(req.user.id, startDate, endDate);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching food entries:", error);
      res.status(500).json({ message: "Failed to fetch food entries" });
    }
  });
  app2.delete("/api/food-entries/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const success = await mongoStorage.deleteFoodEntry(numericId, req.user.id);
      if (!success) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      res.json({ message: "Food entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting food entry:", error);
      res.status(500).json({ message: "Failed to delete food entry" });
    }
  });
  app2.post("/api/gemini", verifyToken, async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      );
      const data = await response.json();
      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return res.json({ response: generatedText });
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return res.status(500).json({ error: "Failed to generate response" });
    }
  });
}

// server/index.ts
var app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(session2({
  secret: mongoConfig.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: mongoConfig.session.ttl * 1e3 },
  store: mongoStorage.sessionStore
}));
app.use(express.static(path.join(__dirname, "../client/build")));
setupAuth(app);
setupRoutes(app);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
var PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${serverConfig.environment} mode`);
});
