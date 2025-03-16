import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from './themes';

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themeId: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Local storage key for the theme
const THEME_STORAGE_KEY = 'nutritrack-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>('fresh');
  
  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        setThemeId(savedTheme);
      }
    } catch (e) {
      console.error('Error loading theme from localStorage:', e);
    }
  }, []);
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
      
      // Apply theme to document
      const theme = themes[themeId];
      
      // Set data-theme attribute on root element
      document.documentElement.setAttribute('data-theme', themeId);
      
      // Apply base colors
      document.documentElement.style.setProperty('--primary', theme.colors.primary);
      document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
      document.documentElement.style.setProperty('--accent', theme.colors.accent);
      document.documentElement.style.setProperty('--background', theme.colors.background);
      document.documentElement.style.setProperty('--card-background', theme.colors.cardBackground);
      document.documentElement.style.setProperty('--text', theme.colors.text);
      document.documentElement.style.setProperty('--muted', theme.colors.mutedText);
      document.documentElement.style.setProperty('--border', theme.colors.border);
      
      // Set RGB values for border colors
      if (themeId === 'fresh') {
        document.documentElement.style.setProperty('--border-rgb', '224, 224, 224');
        document.documentElement.style.setProperty('--border-opacity', '0.5');
      } else if (themeId === 'calm') {
        document.documentElement.style.setProperty('--border-rgb', '187, 222, 251');
        document.documentElement.style.setProperty('--border-opacity', '0.5');
      } else if (themeId === 'bold') {
        document.documentElement.style.setProperty('--border-rgb', '63, 63, 95');
        document.documentElement.style.setProperty('--border-opacity', '0.5');
      } else if (themeId === 'natural') {
        document.documentElement.style.setProperty('--border-rgb', '220, 237, 200');
        document.documentElement.style.setProperty('--border-opacity', '0.5');
      } else if (themeId === 'minimal') {
        document.documentElement.style.setProperty('--border-rgb', '236, 239, 241');
        document.documentElement.style.setProperty('--border-opacity', '0.5');
      } else if (themeId === 'dark') {
        document.documentElement.style.setProperty('--border-rgb', '51, 51, 51');
        document.documentElement.style.setProperty('--border-opacity', '0.6');
      }
      
      // Apply contrast colors
      document.documentElement.style.setProperty('--primary-contrast', theme.colors.primaryContrast);
      document.documentElement.style.setProperty('--secondary-contrast', theme.colors.secondaryContrast);
      document.documentElement.style.setProperty('--accent-contrast', theme.colors.accentContrast);
      document.documentElement.style.setProperty('--background-contrast', theme.colors.backgroundContrast);
      document.documentElement.style.setProperty('--card-background-contrast', theme.colors.cardBackgroundContrast);
      
      // Apply other theme properties
      document.documentElement.style.setProperty('--radius', theme.borderRadius);
      document.documentElement.style.setProperty('--shadow', theme.boxShadow);
      document.documentElement.style.setProperty('--font-family', theme.fontFamily);
      
      // Apply background color to body
      document.body.style.backgroundColor = theme.colors.background;
      document.body.style.color = theme.colors.text;
      
      // Add/remove dark class to body for dark themes
      if (theme.isDark) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [themeId]);
  
  const setTheme = (newThemeId: string) => {
    if (themes[newThemeId]) {
      setThemeId(newThemeId);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ 
      currentTheme: themes[themeId], 
      setTheme,
      themeId
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 