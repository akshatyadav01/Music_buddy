import React from "react";
import { Link, useLocation } from "wouter";
import { Home, ListMusic, Upload, Library, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("wavvy_auth");
    window.location.reload();
  };

  const navItems = [
    { icon: Home, label: "Library", href: "/" },
    { icon: ListMusic, label: "Queue", href: "/queue" },
    { icon: Library, label: "Playlists", href: "/playlists" },
    { icon: Upload, label: "Upload", href: "/upload" },
  ];

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar h-[calc(100vh-90px)] hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">Wavvy</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
              location === item.href 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}>
              <item.icon className="w-5 h-5 opacity-70" />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5 opacity-70" />
          Lock Sanctuary
        </button>
      </div>
    </div>
  );
}

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Library", href: "/" },
    { icon: ListMusic, label: "Queue", href: "/queue" },
    { icon: Library, label: "Playlists", href: "/playlists" },
    { icon: Upload, label: "Upload", href: "/upload" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-background/80 backdrop-blur-xl flex items-center justify-around z-40 pb-safe">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <div className={cn(
            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
            location === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}>
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
