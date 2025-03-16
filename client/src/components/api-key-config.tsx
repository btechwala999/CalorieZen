import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Settings, Check, Copy, ExternalLink, Info, Brain } from "lucide-react";
import { isGeminiAvailable } from "@/services/gemini-service";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Local storage key for the API key
const API_KEY_STORAGE_KEY = "gemini-api-key";

export function getStoredApiKey(): string {
  try {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    console.log("Retrieved API key from localStorage:", key ? "Found key" : "No key found");
    return key || "";
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return "";
  }
}

export function setStoredApiKey(apiKey: string): boolean {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    console.log("API key saved to localStorage");
    
    // Verify the key was saved correctly
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey !== apiKey) {
      console.error("API key verification failed. Saved:", savedKey, "Expected:", apiKey);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Error saving to localStorage:", e);
    return false;
  }
}

interface ApiKeyConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApiKeyConfig({ open, onOpenChange }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Load the API key when the component mounts
  useEffect(() => {
    const storedKey = getStoredApiKey();
    setApiKey(storedKey);
    setIsConfigured(isGeminiAvailable());
  }, []);

  const handleSave = () => {
    setError(null);
    
    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }
    
    // Basic validation for Gemini API key format
    if (!apiKey.startsWith("AI") || apiKey.length < 10) {
      setError("Invalid API key format. Gemini API keys typically start with 'AI' and are longer.");
      return;
    }
    
    const success = setStoredApiKey(apiKey);
    
    if (!success) {
      setError("Failed to save API key. LocalStorage might be disabled.");
      return;
    }
    
    setIsSaved(true);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved successfully. The page will reload to apply changes.",
    });
    
    setTimeout(() => {
      setIsSaved(false);
      onOpenChange(false);
      
      // Use a safer approach to reload
      try {
        // Force a full page reload to ensure the API key is picked up
        window.location.href = window.location.pathname + "?reload=" + Date.now();
      } catch (e) {
        console.error("Error during navigation:", e);
        // Fallback to simple reload if needed
        window.location.reload();
      }
    }, 1500);
  };

  const handleCopyInstructions = () => {
    try {
      navigator.clipboard.writeText(
        "1. Go to https://aistudio.google.com/app/apikey\n" +
        "2. Sign in with your Google account\n" +
        "3. Click 'Create API key' button\n" +
        "4. Copy the generated API key (starts with 'AI')\n" +
        "5. Paste it in the API Key field and click Save"
      );
      toast({
        title: "Copied to clipboard",
        description: "Instructions have been copied to your clipboard.",
      });
    } catch (e) {
      console.error("Error copying to clipboard:", e);
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gemini API Configuration</DialogTitle>
          <DialogDescription>
            Configure your Google Gemini API key to enable AI features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isGeminiAvailable() && !error && (
            <Alert className={cn("border-amber-500 bg-amber-50 text-amber-900")}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>AI Features Disabled</AlertTitle>
              <AlertDescription>
                AI features are currently running in demo mode. Add your API key to enable full functionality.
              </AlertDescription>
            </Alert>
          )}
          
          {isGeminiAvailable() && !error && (
            <Alert className={cn("border-green-500 bg-green-50 text-green-900")}>
              <Check className="h-4 w-4" />
              <AlertTitle>API Key Configured</AlertTitle>
              <AlertDescription>
                Your API key is configured. AI features should be working.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How to get an API key</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal pl-4 space-y-1">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center">Google AI Studio <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API key" button</li>
                <li>Copy the generated API key (starts with "AI")</li>
                <li>Paste it below and click Save</li>
              </ol>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs" 
                onClick={handleCopyInstructions}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy Instructions
              </Button>
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-muted">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your API key is stored only in your browser's local storage and is never sent to our servers.
              The key is used directly from your browser to communicate with Google's Gemini API.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key (starts with AI...)"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={isSaved || !apiKey.trim()}
            className="gap-2"
            style={{ border: '1px solid rgba(var(--border-rgb), var(--border-opacity))' }}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 