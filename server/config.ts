// MongoDB configuration
export const mongoConfig = {
  // Local MongoDB connection string
  localUri: process.env.MONGO_LOCAL_URI || "mongodb://localhost:27017/NutriTrackPro",
  
  // Use the same URI for both Atlas and local for simplicity
  atlasUri: process.env.MONGO_LOCAL_URI || "mongodb://localhost:27017/NutriTrackPro",
  
  // Database name
  dbName: process.env.MONGO_DB_NAME || "NutriTrackPro",
  
  // Session settings
  session: {
    secret: process.env.SESSION_SECRET || 'nutritrack-secret-key-' + Math.random().toString(36).substring(2, 15),
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native',
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side JS from reading the cookie
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
    },
    resave: false,
    saveUninitialized: false
  },
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  }
};

// Server configuration
export const serverConfig = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
};

// Export default configuration
export default {
  mongo: mongoConfig,
  server: serverConfig
}; 