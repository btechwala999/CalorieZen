# CalorieZen

CalorieZen is a comprehensive nutrition and fitness tracking application that helps users monitor their diet, track workouts, and receive AI-powered insights about their health and fitness journey. The application leverages Google's Gemini AI to provide personalized nutrition analysis and fitness recommendations.

## 🌟 Key Features

- **AI-Powered Nutrition Analysis**: Powered by Google's Gemini AI, the app provides detailed nutritional insights and personalized recommendations based on your food diary.
- **Fitness Assistant Chatbot**: An intelligent chatbot powered by Gemini AI that offers personalized fitness advice, workout recommendations, and answers to your health-related questions.
- **Food Diary**: Track your daily food intake with AI-assisted calorie estimation.
- **Exercise Diary**: Log and monitor your workout routines.
- **Interactive Dashboard**: View your nutrition summary, recent activities, and progress charts.
- **Body Metrics Tracking**: Record and monitor your weight, height, BMI, and other body measurements.
- **Calorie Calculator**: Calculate your daily calorie needs based on your metrics and activity level.
- **Customizable Themes**: Choose from multiple theme options for a personalized experience.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API Key (Required for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CalorieZen.git
   cd CalorieZen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Gemini API:
   - Obtain an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key in the application settings (via the API Key Config dialog)

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   This will start both the front-end and back-end servers:
   - Front-end: http://localhost:5173
   - Back-end: http://localhost:3000

## 🧠 Gemini AI Integration

CalorieZen integrates Google's Gemini AI through the following features:

- **AI Food Search**: Get instant calorie estimations for any food by typing its name
- **Nutrition Insights**: Receive personalized analysis of your eating patterns and nutritional balance
- **Fitness Assistant**: Chat with an AI assistant that provides tailored workout advice and nutrition tips
- **Contextual Recommendations**: Get suggestions based on your previous entries and personal metrics

The API key can be configured through the API Key Config dialog accessible from the navigation sidebar. A fallback API key is provided for demo purposes, but for the best experience, users should configure their own API key.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express
- **UI Components**: Radix UI primitives, shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: wouter
- **AI Integration**: Google Gemini API (@google/generative-ai)
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 📱 Application Structure

### Pages
- **Home**: Landing page with overview of the application
- **Dashboard**: Summary view with nutrition insights and recent activity
- **Food Diary**: Log and manage food entries with AI-assisted calorie estimation
- **Exercise Diary**: Track workouts and physical activities
- **Auth**: Login and registration functionality

### Key Components
- **AI Chatbot**: Interactive fitness and nutrition assistant
- **Nutrition Insights**: AI-powered dietary analysis
- **Food Entry**: Food logging with manual or AI-assisted options
- **Exercise Log**: Workout tracking and calorie burn calculation
- **Calorie Calculator**: BMR and TDEE calculator
- **API Key Config**: Management interface for the Gemini API key
- **NavSidebar**: Navigation menu with theme controls and user profile
- **Progress Chart**: Visual representation of nutritional data

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Themes**: Selection of color themes including light and dark options
- **Collapsible Sidebar**: Space-efficient navigation
- **Toast Notifications**: User feedback for actions
- **Interactive Charts**: Visual data representation
- **Modal Dialogs**: For configuration and data entry

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powering our intelligent features
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Recharts](https://recharts.org/) for the charting library 
