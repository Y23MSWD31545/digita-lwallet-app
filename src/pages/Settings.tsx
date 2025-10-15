import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Lock, Moon, Sun, LogOut, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "next-themes"; // REQUIRED IMPORT

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, clearUser } = useUser();
  const { theme, setTheme } = useTheme(); // Hook to manage theme state
  
  // Determine if the dark mode switch should be checked (handles 'system' setting)
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleLogout = () => {
    // Clear user context and local mock data
    clearUser(); 
    localStorage.removeItem("walletBalance");
    localStorage.removeItem("transactions");
    localStorage.removeItem("mockUserCredentials");
    
    toast({
        title: "Logged out",
        description: "Your session has ended.",
    });

    navigate("/login", { replace: true });
  };
  
  const handleThemeToggle = (checked: boolean) => {
    // Set theme based on the switch state
    setTheme(checked ? "dark" : "light");
    toast({
        title: "Theme changed",
        description: `Switched to ${checked ? "Dark" : "Light"} mode.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.fullName || "Guest User"}</p>
                <p className="text-xs text-muted-foreground">{user?.username ? `${user.username}@paywallet.com` : "Not logged in"}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </Card>
        </motion.div>
        
        <Separator className="bg-muted" />

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">General</h2>
          
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="security" className="flex items-center gap-3 cursor-pointer">
                <Lock size={20} className="text-muted-foreground" />
                Security & PIN
              </Label>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} className="text-muted-foreground" /> : <Sun size={20} className="text-muted-foreground" />}
                Dark Mode
              </Label>
              <Switch 
                id="theme-toggle" 
                checked={isDarkMode} 
                onCheckedChange={handleThemeToggle} 
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="currency" className="flex items-center gap-3">
                <DollarSign size={20} className="text-muted-foreground" />
                Currency
              </Label>
              <p className="text-sm text-foreground font-medium">INR (₹)</p>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">About</h2>
          
          <Card className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
                <p className="text-muted-foreground">Version</p>
                <p className="text-foreground font-medium">1.0.0</p>
            </div>
            <div className="flex justify-between">
                <p className="text-muted-foreground">Licenses</p>
                <Button variant="link" size="sm" className="h-auto p-0">View</Button>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-12 text-lg"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
