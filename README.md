# NutriTrackPro

A comprehensive nutrition and fitness tracking application built with React, TypeScript, and MongoDB.

## Features

- **User Authentication**: Secure login and registration system
- **Food Diary**: Track your daily food intake with calorie counting
- **Exercise Tracking**: Log your workouts and track calories burned
- **Dashboard**: Visualize your nutrition and fitness data
- **Body Metrics**: Track your weight, height, and other body measurements
- **Theme Customization**: Choose from multiple themes to personalize your experience
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Integration**: Secure and scalable data storage

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: Express session with MongoDB store
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NutriTrackPro.git
   cd NutriTrackPro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MongoDB:
   - Ensure MongoDB is running locally on port 27017, or
   - Update the connection string in `server/config.ts` to point to your MongoDB instance

4. Start the development servers:
   ```bash
   # Start both frontend and backend with a single command
   npm run dev
   
   # Or start them separately if needed
   npm run dev:server  # Backend only
   npm run dev:client  # Frontend only
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000 (or http://localhost:3001 if port 3000 is already in use)

## MongoDB Integration

The application uses MongoDB for data storage with the following collections:

- **Users**: User accounts and profile information
- **FoodEntries**: Food diary entries with nutritional information
- **Exercises**: Workout logs with calories burned

The MongoDB connection is configured in `server/config.ts` and implemented in `server/mongo-storage.ts`.

### Data Migration

If you're migrating from the file-based storage to MongoDB, you can use the migration script:

```bash
npm run migrate:mongo
```

## Security Features

- Secure session management with MongoDB store
- Password hashing for user authentication
- CORS protection for API endpoints
- HTTP-only cookies for session management
- Environment-based security settings

## Deployment

### Production Build

```bash
# Build the frontend and backend
npm run build

# Start the production server
npm start
```

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `MONGO_LOCAL_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret for session encryption
- `CORS_ORIGIN`: Allowed CORS origin

## Troubleshooting

### Port Already in Use

If you see an "EADDRINUSE" error:

1. The server will automatically try to use port 3001 if port 3000 is already in use
2. You can manually kill Node.js processes before starting the server:
   ```bash
   # On Windows
   taskkill /F /IM node.exe
   
   # On Linux/macOS
   pkill node
   ```

### MongoDB Connection Issues

If you have trouble connecting to MongoDB:

1. Ensure MongoDB is installed and running
2. Check the connection string in `server/config.ts`
3. Verify that port 27017 is not blocked by a firewall

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Lucide Icons](https://lucide.dev/) for the icon set
- [MongoDB](https://www.mongodb.com/) for the database 
