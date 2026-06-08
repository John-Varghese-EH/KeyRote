"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden relative font-sans">
          <header className="absolute top-0 z-50 w-full p-6 flex justify-between items-center">
            <div className="font-bold tracking-tight">KeyRote</div>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 space-y-6">
            <span className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Server Error
            </span>
            <div className="text-6xl md:text-8xl font-black tracking-tighter text-foreground/20 select-none">
              500
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Something went wrong.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              We're experiencing an internal error and our team has been automatically notified. This is not your fault.
            </p>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => reset()}
                className="rounded-xl bg-foreground text-background px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <Link 
                href="/"
                className="rounded-xl border border-border bg-transparent px-6 py-3 font-semibold hover:bg-muted transition-colors"
              >
                Go Home
              </Link>
            </div>
            
            {error.digest && (
              <p className="text-xs text-muted-foreground font-mono mt-8 p-2 bg-muted rounded-md">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
