export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  text: string;
  mutedText: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  primaryContrast: string;
  secondaryContrast: string;
  accentContrast: string;
  backgroundContrast: string;
  cardBackgroundContrast: string;
};

export type Theme = {
  name: string;
  description: string;
  colors: ThemeColors;
  borderRadius: string;
  fontFamily: string;
  boxShadow: string;
  isDark: boolean;
};

export const themes: Record<string, Theme> = {
  fresh: {
    name: "Fresh & Vibrant",
    description: "Energetic, fresh, and motivating",
    colors: {
      primary: "#4CAF50",
      secondary: "#009688",
      accent: "#FF9800",
      background: "#F5F7FA",
      cardBackground: "#FFFFFF",
      text: "#333333",
      mutedText: "#666666",
      border: "rgba(224, 224, 224, 0.5)",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
      info: "#2196F3",
      primaryContrast: "#FFFFFF",
      secondaryContrast: "#FFFFFF",
      accentContrast: "#000000",
      backgroundContrast: "#333333",
      cardBackgroundContrast: "#333333",
    },
    borderRadius: "0.75rem",
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    isDark: false,
  },
  
  calm: {
    name: "Calm & Mindful",
    description: "Calm, peaceful, and focused",
    colors: {
      primary: "#2196F3",
      secondary: "#64B5F6",
      accent: "#81C784",
      background: "#E8F5FE",
      cardBackground: "#E3F2FD",
      text: "#1A237E",
      mutedText: "#3949AB",
      border: "rgba(187, 222, 251, 0.5)",
      success: "#81C784",
      warning: "#FFD54F",
      error: "#E57373",
      info: "#64B5F6",
      primaryContrast: "#FFFFFF",
      secondaryContrast: "#000000",
      accentContrast: "#000000",
      backgroundContrast: "#1A237E",
      cardBackgroundContrast: "#1A237E",
    },
    borderRadius: "0.5rem",
    fontFamily: "'Nunito', system-ui, sans-serif",
    boxShadow: "0 2px 8px rgba(33, 150, 243, 0.15)",
    isDark: false,
  },
  
  bold: {
    name: "Bold & Motivational",
    description: "Energetic, motivational, and gym-like",
    colors: {
      primary: "#7C4DFF",
      secondary: "#FF4081",
      accent: "#FFEB3B",
      background: "#1A1A2E",
      cardBackground: "#2A2A42",
      text: "#FFFFFF",
      mutedText: "#BDBDBD",
      border: "rgba(63, 63, 95, 0.4)",
      success: "#00E676",
      warning: "#FFAB00",
      error: "#FF1744",
      info: "#00B0FF",
      primaryContrast: "#FFFFFF",
      secondaryContrast: "#FFFFFF",
      accentContrast: "#000000",
      backgroundContrast: "#FFFFFF",
      cardBackgroundContrast: "#FFFFFF",
    },
    borderRadius: "0.625rem",
    fontFamily: "'Montserrat', system-ui, sans-serif",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    isDark: true,
  },
  
  natural: {
    name: "Natural & Organic",
    description: "Natural, wholesome, and earthy",
    colors: {
      primary: "#8BC34A",
      secondary: "#795548",
      accent: "#FFC107",
      background: "#FFFDE7",
      cardBackground: "#FFFFFF",
      text: "#3E2723",
      mutedText: "#6D4C41",
      border: "rgba(220, 237, 200, 0.5)",
      success: "#689F38",
      warning: "#FFA000",
      error: "#D32F2F",
      info: "#0288D1",
      primaryContrast: "#000000",
      secondaryContrast: "#FFFFFF",
      accentContrast: "#000000",
      backgroundContrast: "#3E2723",
      cardBackgroundContrast: "#3E2723",
    },
    borderRadius: "1rem",
    fontFamily: "'Quicksand', system-ui, sans-serif",
    boxShadow: "0 2px 12px rgba(121, 85, 72, 0.1)",
    isDark: false,
  },
  
  minimal: {
    name: "Minimalist & Clean",
    description: "Professional, clean, and distraction-free",
    colors: {
      primary: "#455A64",
      secondary: "#78909C",
      accent: "#FF5722",
      background: "#F9FAFB",
      cardBackground: "#FFFFFF",
      text: "#263238",
      mutedText: "#546E7A",
      border: "rgba(236, 239, 241, 0.6)",
      success: "#43A047",
      warning: "#FB8C00",
      error: "#E53935",
      info: "#039BE5",
      primaryContrast: "#FFFFFF",
      secondaryContrast: "#FFFFFF",
      accentContrast: "#FFFFFF",
      backgroundContrast: "#263238",
      cardBackgroundContrast: "#263238",
    },
    borderRadius: "0.5rem",
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    isDark: false,
  },
  
  dark: {
    name: "Dark Mode Professional",
    description: "Sophisticated, modern, and tech-forward",
    colors: {
      primary: "#0288D1",
      secondary: "#00BCD4",
      accent: "#FFC107",
      background: "#121212",
      cardBackground: "#1E1E1E",
      text: "#E0E0E0",
      mutedText: "#9E9E9E",
      border: "rgba(51, 51, 51, 0.4)",
      success: "#00C853",
      warning: "#FFD600",
      error: "#FF1744",
      info: "#00B0FF",
      primaryContrast: "#FFFFFF",
      secondaryContrast: "#000000",
      accentContrast: "#000000",
      backgroundContrast: "#E0E0E0",
      cardBackgroundContrast: "#E0E0E0",
    },
    borderRadius: "0.625rem",
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
    isDark: true,
  },
}; 