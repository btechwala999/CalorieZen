import NavSidebar from "@/components/nav-sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, Apple, Dumbbell } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { currentTheme, themeId } = useTheme();
  
  // Determine if we're using a dark theme
  const isDarkTheme = currentTheme.isDark;
  
  // Set overlay color based on theme
  const overlayColor = isDarkTheme ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  
  // Set card background color based on theme
  const cardBgColor = (() => {
    if (themeId === 'bold') return '#3A2A7E'; // Rich purple background for bold theme
    if (themeId === 'dark') return '#1E1E1E';
    if (themeId === 'calm') return '#E3F2FD'; // Light blue background for calm theme
    return currentTheme.colors.cardBackground;
  })();
  
  // Set card gradient for bold theme
  const cardGradient = (() => {
    if (themeId === 'bold') return 'linear-gradient(135deg, #3A2A7E, #6C4DFF)';
    return 'none';
  })();
  
  // Set main feature card background color based on theme (for the three main containers)
  const mainFeatureCardBgColor = (() => {
    if (themeId === 'bold') return '#4A3A8E'; // Even richer purple background for bold theme
    return cardBgColor; // Default to regular card background color for other themes
  })();
  
  // Set main feature card gradient for bold theme (for the three main containers)
  const mainFeatureCardGradient = (() => {
    if (themeId === 'bold') return 'linear-gradient(135deg, #4A3A8E, #7C4DFF)';
    return cardGradient; // Default to regular card gradient for other themes
  })();
  
  // Set card text color based on theme
  const cardTextColor = (() => {
    if (themeId === 'bold' || themeId === 'dark') return '#FFFFFF';
    if (themeId === 'calm') return '#1A237E'; // Dark blue text for calm theme
    return currentTheme.colors.text;
  })();
  
  // Set glow colors based on theme
  const glowColor = (() => {
    if (themeId === 'bold') return '0 0 25px rgba(124, 77, 255, 0.8), 0 0 50px rgba(124, 77, 255, 0.5)';
    if (themeId === 'dark') return '0 0 15px rgba(2, 136, 209, 0.5), 0 0 30px rgba(2, 136, 209, 0.3)';
    if (themeId === 'calm') return '0 0 15px rgba(33, 150, 243, 0.5), 0 0 30px rgba(33, 150, 243, 0.3)';
    return '0 4px 12px rgba(0, 0, 0, 0.1)';
  })();
  
  // Set card border color based on theme
  const cardBorderColor = (() => {
    if (themeId === 'calm') return 'rgba(33, 150, 243, 0.5)'; // More visible blue border for calm theme
    if (themeId === 'bold') return 'rgba(124, 77, 255, 0.5)'; // More visible purple border
    return `rgba(var(--border-rgb), 0.5)`;
  })();
  
  // Set main feature card border color based on theme
  const mainFeatureCardBorderColor = (() => {
    if (themeId === 'calm') return 'rgba(33, 150, 243, 0.5)'; // More visible blue border for calm theme
    if (themeId === 'bold') return 'rgba(124, 77, 255, 0.5)'; // More visible purple border
    return `rgba(var(--border-rgb), 0.5)`;
  })();
  
  // Set card border width based on theme - make all themes have a visible border
  const cardBorderWidth = (() => {
    return '1px';
  })();
  
  // Set main feature card border width based on theme - make all themes have a visible border
  const mainFeatureCardBorderWidth = (() => {
    return '1px';
  })();
  
  // Set quick tips card background color based on theme
  const quickTipsCardBgColor = (() => {
    if (themeId === 'bold') return '#3A2A7E'; // Rich purple background for bold theme
    if (themeId === 'dark') return '#252525'; // Slightly lighter than the main dark background
    if (themeId === 'calm') return '#D6EAFF'; // Lighter blue for calm theme
    if (themeId === 'fresh') return '#F0F8F0'; // Light green tint for fresh theme
    if (themeId === 'natural') return '#F5F8E8'; // Light earthy tone for natural theme
    if (themeId === 'minimal') return '#F5F7F9'; // Very light gray for minimal theme
    return currentTheme.colors.cardBackground;
  })();
  
  // Set quick tips card gradient for each theme
  const quickTipsCardGradient = (() => {
    if (themeId === 'bold') return 'linear-gradient(135deg, #3A2A7E, #6C4DFF)';
    if (themeId === 'dark') return 'linear-gradient(135deg, #252525, #303030)';
    if (themeId === 'calm') return 'linear-gradient(135deg, #D6EAFF, #E3F2FD)';
    if (themeId === 'fresh') return 'linear-gradient(135deg, #F0F8F0, #FFFFFF)';
    if (themeId === 'natural') return 'linear-gradient(135deg, #F5F8E8, #FFFFFF)';
    if (themeId === 'minimal') return 'linear-gradient(135deg, #F5F7F9, #FFFFFF)';
    return 'none';
  })();
  
  // Set quick tips card border color based on theme
  const quickTipsCardBorderColor = (() => {
    if (themeId === 'bold') return 'rgba(124, 77, 255, 0.5)'; // More visible purple border for bold theme
    if (themeId === 'dark') return 'rgba(0, 188, 212, 0.5)'; // More visible cyan border for dark theme
    if (themeId === 'calm') return 'rgba(33, 150, 243, 0.5)'; // More visible blue border for calm theme
    if (themeId === 'fresh') return 'rgba(76, 175, 80, 0.5)'; // More visible green border for fresh theme
    if (themeId === 'natural') return 'rgba(139, 195, 74, 0.5)'; // More visible light green border for natural theme
    if (themeId === 'minimal') return 'rgba(69, 90, 100, 0.4)'; // More visible blue-gray border for minimal theme
    return `rgba(var(--border-rgb), 0.5)`;
  })();
  
  // Set quick tips card shadow based on theme
  const quickTipsCardShadow = (() => {
    if (themeId === 'bold') return '0 8px 20px rgba(0, 0, 0, 0.3)';
    if (themeId === 'dark') return '0 8px 20px rgba(0, 0, 0, 0.4)';
    if (themeId === 'calm') return '0 8px 20px rgba(33, 150, 243, 0.3)';
    if (themeId === 'fresh') return '0 8px 20px rgba(76, 175, 80, 0.3)';
    if (themeId === 'natural') return '0 8px 20px rgba(139, 195, 74, 0.3)';
    if (themeId === 'minimal') return '0 8px 20px rgba(0, 0, 0, 0.2)';
    return '0 8px 20px rgba(0, 0, 0, 0.3)';
  })();
  
  // Set quick tips card border width based on theme - make all themes have a visible border
  const quickTipsCardBorderWidth = (() => {
    return '1px';
  })();
  
  // Set quick tips card hover class based on theme
  const quickTipsCardHoverClass = (() => {
    // Use the same hover effect for all themes (similar to bold theme)
    return 'hover:scale-105 hover:shadow-xl';
  })();
  
  // Set quick tips card text color based on theme
  const quickTipsCardTextColor = (() => {
    if (themeId === 'bold') return '#FFFFFF';
    if (themeId === 'dark') return '#E0E0E0';
    if (themeId === 'calm') return '#1A237E';
    if (themeId === 'fresh') return '#333333';
    if (themeId === 'natural') return '#3E2723';
    if (themeId === 'minimal') return '#263238';
    return currentTheme.colors.text;
  })();
  
  // Set quick tips card muted text color based on theme
  const quickTipsCardMutedTextColor = (() => {
    if (themeId === 'bold') return 'rgba(255, 255, 255, 0.7)';
    if (themeId === 'dark') return 'rgba(224, 224, 224, 0.7)';
    if (themeId === 'calm') return 'rgba(26, 35, 126, 0.7)';
    if (themeId === 'fresh') return 'rgba(51, 51, 51, 0.7)';
    if (themeId === 'natural') return 'rgba(62, 39, 35, 0.7)';
    if (themeId === 'minimal') return 'rgba(38, 50, 56, 0.7)';
    return currentTheme.colors.mutedText;
  })();
  
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to CalTracker</h1>
            <p className="text-muted-foreground mb-8">
              Track your nutrition and fitness journey all in one place
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/dashboard">
                <div className="relative rounded-lg overflow-hidden transition-all hover:scale-105 duration-300">
                  <Card 
                    className="h-full border-0"
                    style={{ 
                      backgroundColor: mainFeatureCardBgColor,
                      backgroundImage: mainFeatureCardGradient,
                      color: cardTextColor,
                      transition: 'all 0.3s ease',
                      borderColor: mainFeatureCardBorderColor,
                      borderWidth: mainFeatureCardBorderWidth,
                      boxShadow: themeId === 'bold' ? '0 8px 20px rgba(0, 0, 0, 0.3)' : 'none'
                    }}
                  >
                    <CardHeader className="relative z-10">
                      <Activity className="h-8 w-8 text-green-500 mb-2" />
                      <CardTitle style={{ color: cardTextColor }}>Dashboard</CardTitle>
                      <CardDescription style={{ color: `${cardTextColor}80` }}>
                        View your calorie intake and exercise summary
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <div 
                    className="absolute inset-0 transition-opacity hover:opacity-0 duration-300" 
                    style={{ 
                      backgroundColor: overlayColor,
                      backgroundImage: isDarkTheme ? 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))' : 'none'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: glowColor,
                      borderRadius: 'inherit'
                    }}
                  ></div>
                </div>
              </Link>

              <Link href="/food-diary">
                <div className="relative rounded-lg overflow-hidden transition-all hover:scale-105 duration-300">
                  <Card 
                    className="h-full border-0"
                    style={{ 
                      backgroundColor: mainFeatureCardBgColor,
                      backgroundImage: mainFeatureCardGradient,
                      color: cardTextColor,
                      transition: 'all 0.3s ease',
                      borderColor: mainFeatureCardBorderColor,
                      borderWidth: mainFeatureCardBorderWidth,
                      boxShadow: themeId === 'bold' ? '0 8px 20px rgba(0, 0, 0, 0.3)' : 'none'
                    }}
                  >
                    <CardHeader className="relative z-10">
                      <Apple className="h-8 w-8 text-red-500 mb-2" />
                      <CardTitle style={{ color: cardTextColor }}>Food Diary</CardTitle>
                      <CardDescription style={{ color: `${cardTextColor}80` }}>
                        Log and track your daily meals
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <div 
                    className="absolute inset-0 transition-opacity hover:opacity-0 duration-300" 
                    style={{ 
                      backgroundColor: overlayColor,
                      backgroundImage: isDarkTheme ? 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))' : 'none'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: glowColor,
                      borderRadius: 'inherit'
                    }}
                  ></div>
                </div>
              </Link>

              <Link href="/exercise-diary">
                <div className="relative rounded-lg overflow-hidden transition-all hover:scale-105 duration-300">
                  <Card 
                    className="h-full border-0"
                    style={{ 
                      backgroundColor: mainFeatureCardBgColor,
                      backgroundImage: mainFeatureCardGradient,
                      color: cardTextColor,
                      transition: 'all 0.3s ease',
                      borderColor: mainFeatureCardBorderColor,
                      borderWidth: mainFeatureCardBorderWidth,
                      boxShadow: themeId === 'bold' ? '0 8px 20px rgba(0, 0, 0, 0.3)' : 'none'
                    }}
                  >
                    <CardHeader className="relative z-10">
                      <Dumbbell className="h-8 w-8 text-blue-500 mb-2" />
                      <CardTitle style={{ color: cardTextColor }}>Exercise Log</CardTitle>
                      <CardDescription style={{ color: `${cardTextColor}80` }}>
                        Record your workouts and burned calories
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <div 
                    className="absolute inset-0 transition-opacity hover:opacity-0 duration-300" 
                    style={{ 
                      backgroundColor: overlayColor,
                      backgroundImage: isDarkTheme ? 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))' : 'none'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: glowColor,
                      borderRadius: 'inherit'
                    }}
                  ></div>
                </div>
              </Link>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Quick Tips</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className={`transition-all duration-300 ${quickTipsCardHoverClass}`}
                  style={{ 
                    backgroundColor: quickTipsCardBgColor,
                    backgroundImage: quickTipsCardGradient,
                    color: quickTipsCardTextColor,
                    transition: 'all 0.3s ease',
                    borderColor: quickTipsCardBorderColor,
                    borderWidth: quickTipsCardBorderWidth,
                    boxShadow: quickTipsCardShadow
                  }}
                >
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2" style={{ color: quickTipsCardTextColor }}>Getting Started</h3>
                    <p className="text-muted-foreground" style={{ color: quickTipsCardMutedTextColor }}>
                      Begin by updating your profile with your height, weight, and activity
                      level in the Dashboard to get accurate calorie recommendations.
                    </p>
                  </CardContent>
                </Card>
                <Card 
                  className={`transition-all duration-300 ${quickTipsCardHoverClass}`}
                  style={{ 
                    backgroundColor: quickTipsCardBgColor,
                    backgroundImage: quickTipsCardGradient,
                    color: quickTipsCardTextColor,
                    transition: 'all 0.3s ease',
                    borderColor: quickTipsCardBorderColor,
                    borderWidth: quickTipsCardBorderWidth,
                    boxShadow: quickTipsCardShadow
                  }}
                >
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2" style={{ color: quickTipsCardTextColor }}>Track Consistently</h3>
                    <p className="text-muted-foreground" style={{ color: quickTipsCardMutedTextColor }}>
                      Log your meals and exercises daily to get the most accurate picture
                      of your health journey and progress.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
