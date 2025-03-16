import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme-context"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { themeId } = useTheme();
  
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md p-1 text-muted-foreground",
        themeId === 'bold' ? "bg-[#2A2A42] border border-[rgba(124,77,255,0.3)]" :
        themeId === 'dark' ? "bg-[#252525] border border-[rgba(0,188,212,0.3)]" :
        themeId === 'calm' ? "bg-[#D6EAFF] border border-[rgba(33,150,243,0.3)]" :
        themeId === 'fresh' ? "bg-[#F0F8F0] border border-[rgba(76,175,80,0.3)]" :
        themeId === 'natural' ? "bg-[#F5F8E8] border border-[rgba(139,195,74,0.3)]" :
        themeId === 'minimal' ? "bg-[#F5F7F9] border border-[rgba(69,90,100,0.2)]" :
        "bg-muted border border-[rgba(var(--border-rgb),var(--border-opacity))]",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { themeId } = useTheme();
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        // Default state
        "hover:bg-background/50 hover:text-foreground",
        // Hover effects based on theme
        themeId === 'bold' ? "hover:bg-[#3A2A7E]/30 hover:text-white hover:scale-105" :
        themeId === 'dark' ? "hover:bg-[#1E1E1E]/70 hover:text-white hover:scale-105" :
        themeId === 'calm' ? "hover:bg-[#2196F3]/20 hover:text-[#1A237E] hover:scale-105" :
        themeId === 'fresh' ? "hover:bg-[#4CAF50]/20 hover:text-[#1B5E20] hover:scale-105" :
        themeId === 'natural' ? "hover:bg-[#8BC34A]/20 hover:text-[#33691E] hover:scale-105" :
        themeId === 'minimal' ? "hover:bg-[#455A64]/20 hover:text-[#263238] hover:scale-105" :
        "hover:bg-background/50 hover:text-foreground",
        // Active state based on theme
        themeId === 'bold' ? "data-[state=active]:bg-[#3A2A7E] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(124,77,255,0.5)]" :
        themeId === 'dark' ? "data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(0,188,212,0.3)]" :
        themeId === 'calm' ? "data-[state=active]:bg-[#2196F3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(33,150,243,0.3)]" :
        themeId === 'fresh' ? "data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(76,175,80,0.3)]" :
        themeId === 'natural' ? "data-[state=active]:bg-[#8BC34A] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(139,195,74,0.3)]" :
        themeId === 'minimal' ? "data-[state=active]:bg-[#455A64] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(69,90,100,0.2)]" :
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
