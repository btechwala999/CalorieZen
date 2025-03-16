import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import session from "express-session";
import cors from "cors";
import { setupRoutes } from "./routes";
import { mongoStorage } from "./mongo-storage";
import { setupAuth } from "./auth";
import { serverConfig, mongoConfig } from "./config";

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors(serverConfig.cors));

// Session configuration
app.use(session({
  secret: mongoConfig.session.secret,
  resave: mongoConfig.session.resave || false,
  saveUninitialized: mongoConfig.session.saveUninitialized || false,
  cookie: mongoConfig.session.cookie || { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: mongoConfig.session.ttl * 1000 
  },
  store: mongoStorage.sessionStore
}));

// Setup authentication
setupAuth(app);

// Setup routes
setupRoutes(app);

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../dist/public')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
}

// Start server with error handling for port in use
const PORT = serverConfig.port;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${serverConfig.environment} mode`);
  console.log(`API is available at http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('Frontend development server should be running at http://localhost:5173');
  }
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    // Try using the next port
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`Server running on port ${newPort} in ${serverConfig.environment} mode`);
      console.log(`API is available at http://localhost:${newPort}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Frontend development server should be running at http://localhost:5173');
      }
    });
  } else {
    console.error('Server error:', err);
  }
});