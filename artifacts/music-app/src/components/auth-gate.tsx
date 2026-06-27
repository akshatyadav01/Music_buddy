import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("wavvy_auth") === "1";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "tendercoco") {
      localStorage.setItem("wavvy_auth", "1");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Wavvy</h1>
          <p className="text-muted-foreground mt-2">Your private sanctuary.</p>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-4 ${error ? 'animate-shake' : ''}`}>
          <Input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`h-12 bg-card border-card-border text-center text-lg ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            autoFocus
          />
          <Button type="submit" className="w-full h-12 text-lg font-medium">
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}
