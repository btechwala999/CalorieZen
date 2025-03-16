# CalorieZen

A comprehensive nutrition and fitness tracking application built with React, TypeScript, and MongoDB.

## Features

- **User Authentication**: Secure login and registration system with session management
- **Food Diary**: Track your daily food intake with detailed nutritional information
- **Exercise Tracking**: Log your workouts and track calories burned
- **Dashboard**: 
  - Visual representation of daily calorie intake and burn
  - Progress charts and statistics
  - Weekly and monthly summaries
- **Body Metrics**: 
  - Track weight, height, and BMI
  - Calculate BMR and TDEE
  - Set and monitor fitness goals
- **Theme Customization**: 
  - Multiple built-in themes (Fresh, Calm, Bold, Dark, Natural, Minimal)
  - Customizable UI elements
- **Responsive Design**: Fully responsive layout with collapsible sidebar
- **MongoDB Integration**: 
  - Secure data storage with MongoDB
  - Support for both local MongoDB and MongoDB Atlas
  - Automatic data migration tools

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI primitives for accessible components
- React Query for state management
- Recharts for data visualization
- Lucide React for icons
- React Hook Form for form handling

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Express session with MongoDB store
- Passport.js for authentication

## UI Components

The application uses a combination of:
- Custom-built React components styled with Tailwind CSS
- Radix UI primitives for accessible UI elements
- Lucide React icons for consistent iconography
- Recharts for data visualization components

### Theme System
The application includes a robust theming system with:
- Six predefined color schemes
- Dark and light mode support
- CSS variables for dynamic styling
- Tailwind CSS for utility-based styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

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

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   MONGO_LOCAL_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## MongoDB Configuration

The application supports both local MongoDB and MongoDB Atlas:

```typescript
// server/config.ts
export const mongoConfig = {
  localUri: process.env.MONGO_LOCAL_URI || "mongodb://localhost:27017/CalorieZen",
  atlasUri: process.env.MONGO_LOCAL_URI || "mongodb://localhost:27017/CalorieZen",
  dbName: process.env.MONGO_DB_NAME || "CalorieZen"
}
```

### Data Migration
To migrate existing data to MongoDB:
```bash
npm run migrate:mongo
```

## Available Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run dev:server`: Start only the backend server
- `npm run dev:client`: Start only the frontend development server
- `npm run build`: Build both frontend and backend for production
- `npm start`: Run the production server
- `npm run check`: Run TypeScript type checking
- `npm run migrate:mongo`: Run MongoDB data migration

## Security Features

- Secure session management with MongoDB store
- Password hashing with bcrypt
- HTTP-only cookies
- CORS protection
- Environment-based security settings
- Rate limiting on API endpoints

## Troubleshooting

### Port Conflicts
If port 3000 is in use, the server will automatically try port 3001. To manually free up ports:
```bash
# Windows
taskkill /F /IM node.exe

# Linux/macOS
pkill node
```

### MongoDB Connection Issues
1. Check MongoDB service status
2. Verify connection string in `.env` file
3. Ensure MongoDB port (27017) is accessible
4. Check MongoDB Atlas network access settings if using cloud hosting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide Icons](https://lucide.dev/) for the icon set
- [MongoDB](https://www.mongodb.com/) for the database
- [React Query](https://tanstack.com/query/latest) for data fetching
- [Recharts](https://recharts.org/) for charts and graphs 
