import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { themes } from "@/lib/themes";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Palette } from "lucide-react";

interface ThemeSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ThemeSwitcher({ open, onOpenChange }: ThemeSwitcherProps) {
  const { themeId, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose a Theme</DialogTitle>
          <DialogDescription>
            Select a theme to customize the look and feel of your application.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.entries(themes).map(([id, theme]) => (
            <div
              key={id}
              className={`
                p-4 rounded-lg cursor-pointer transition-all hover:scale-105 duration-300
                ${themeId === id ? 'ring-2 ring-offset-2 scale-105' : 'hover:shadow-lg'}
              `}
              style={{
                backgroundColor: theme.colors.cardBackground,
                color: theme.colors.cardBackgroundContrast,
                borderRadius: theme.borderRadius,
                boxShadow: themeId === id ? theme.boxShadow : 'none',
                border: `1px solid ${theme.colors.border}`,
              }}
              onClick={() => {
                setTheme(id);
                onOpenChange(false);
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="text-base font-bold" style={{ color: theme.colors.cardBackgroundContrast }}>
                  {theme.name}
                </div>
                <div className="text-sm" style={{ color: theme.colors.mutedText }}>
                  {theme.description}
                </div>
                <div className="flex gap-2 mt-3">
                  {['primary', 'secondary', 'accent'].map((colorKey) => {
                    const bgColor = theme.colors[colorKey as keyof typeof theme.colors];
                    const textColor = theme.colors[`${colorKey}Contrast` as keyof typeof theme.colors];
                    return (
                      <div
                        key={colorKey}
                        className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-xs font-bold"
                        style={{ 
                          backgroundColor: bgColor,
                          color: textColor,
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        {colorKey.charAt(0).toUpperCase()}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.colors.border }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: theme.colors.mutedText }}>
                      Border Radius
                    </span>
                    <span className="text-xs" style={{ color: theme.colors.cardBackgroundContrast }}>
                      {theme.borderRadius}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-medium" style={{ color: theme.colors.mutedText }}>
                      Font
                    </span>
                    <span className="text-xs" style={{ color: theme.colors.cardBackgroundContrast }}>
                      {theme.fontFamily.split(',')[0].replace(/['"]/g, '')}
                    </span>
                  </div>
                </div>
                
                {themeId === id && (
                  <div 
                    className="mt-2 text-center py-1 rounded-md text-sm font-medium"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryContrast
                    }}
                  >
                    Active
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 