import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { BarChart3, CalendarRange, Home, LogOut, User2, Dumbbell, Ruler, ChevronLeft, ChevronRight, Settings, Brain, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import ApiKeyConfig from "./api-key-config";
import { useState, useEffect } from "react";
import MetricsModal from "./metrics-modal";
import ThemeSwitcher from "./theme-switcher";
import UserProfile from "./user-profile";
import "./nav-sidebar.css";

// Define navigation items separately for better control
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/food-diary", label: "Food Diary", icon: CalendarRange },
  { href: "/exercise-diary", label: "Exercise Diary", icon: Dumbbell },
];

export default function NavSidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  
  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);
  
  // Save collapsed state to localStorage and update main content class
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    
    // Add or remove the sidebar-collapsed class from the main element
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (newState) {
        mainElement.classList.add('sidebar-collapsed');
      } else {
        mainElement.classList.remove('sidebar-collapsed');
      }
    }
  };
  
  // Apply sidebar-collapsed class to main on initial load
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement && collapsed) {
      mainElement.classList.add('sidebar-collapsed');
    }
  }, [collapsed]);

  // Handle navigation without causing animation glitches
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    if (location === href) {
      e.preventDefault(); // Prevent navigation if already on the page
    }
  };

  // Render a navigation item
  const renderNavItem = (item: { href: string; label: string; icon: any }, index: number) => {
    const { href, label, icon: Icon } = item;
    return (
      <div 
        key={href}
        className={cn(
          "nav-item",
          location === href && "active",
          `nav-item-${index + 1}` // Add index-based class for targeting specific items
        )}
        title={collapsed ? label : undefined}
      >
        <Link href={href} onClick={(e) => handleNavigation(e, href)}>
          <div className="nav-item-content">
            <Icon className="nav-item-icon" size={collapsed ? 20 : 20} />
            <span>{label}</span>
          </div>
        </Link>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className={cn("nav-sidebar", collapsed && "collapsed")}>
      <div className="nav-sidebar-header">
        <h2 className="nav-sidebar-logo">
          {collapsed ? "CT" : "CalTracker"}
        </h2>
        <div 
          className="toggle-sidebar" 
          onClick={toggleSidebar}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </div>
      </div>

      <div className="nav-sidebar-content">
        <nav className="nav-sidebar-nav">
          {navItems.map((item, index) => renderNavItem(item, index))}
        </nav>
      </div>

      <div className="nav-sidebar-footer">
        <div 
          className="user-profile" 
          onClick={() => setUserProfileOpen(true)}
          title={collapsed ? `${user.username} (click to edit profile)` : undefined}
        >
          <div className="user-avatar">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="user-info">
            <span className="user-name">{user.username}</span>
            <span className="user-role">Member</span>
          </div>
        </div>
        <div className="footer-actions">
          <button 
            className="footer-button"
            onClick={() => setMetricsModalOpen(true)}
            title={collapsed ? "Edit Body Metrics" : undefined}
          >
            <Ruler className="footer-button-icon" size={collapsed ? 18 : 16} />
            <span>Edit Body Metrics</span>
          </button>
          
          <button 
            className="footer-button"
            onClick={() => setThemeModalOpen(true)}
            title={collapsed ? "Themes" : undefined}
          >
            <Palette className="footer-button-icon" size={collapsed ? 18 : 16} />
            <span>Themes</span>
          </button>
          
          <button 
            className="footer-button"
            onClick={() => setApiKeyModalOpen(true)}
            title={collapsed ? "AI Settings" : undefined}
          >
            <Brain className="footer-button-icon" size={collapsed ? 18 : 16} />
            <span>AI Settings</span>
          </button>
          
          <button 
            className="footer-button"
            onClick={() => logoutMutation.mutate()}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="footer-button-icon" size={collapsed ? 18 : 16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      <MetricsModal 
        open={metricsModalOpen} 
        onOpenChange={setMetricsModalOpen} 
      />
      
      <UserProfile 
        open={userProfileOpen}
        onOpenChange={setUserProfileOpen}
      />
      
      <ThemeSwitcher 
        open={themeModalOpen}
        onOpenChange={setThemeModalOpen}
      />
      
      <ApiKeyConfig 
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
      />
    </div>
  );
}
