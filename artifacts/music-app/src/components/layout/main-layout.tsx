import React from "react";
import { Sidebar, BottomNav } from "./navigation";
import { Player } from "./player";
import { AuthGate } from "../auth-gate";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground selection:bg-primary/30">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-36 md:pb-24">
          <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
            {children}
          </div>
        </main>
        <BottomNav />
        <Player />
      </div>
    </AuthGate>
  );
}
