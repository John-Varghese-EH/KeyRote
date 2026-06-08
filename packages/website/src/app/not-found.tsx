"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      <header className="absolute top-0 z-50 w-full p-6 flex justify-end">
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="space-y-6 max-w-2xl"
        >
          <div className="relative">
            <h1 className="text-[10rem] md:text-[15rem] font-black tracking-tighter text-foreground/5 select-none leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Page Not Found.
              </h2>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
            The page you are looking for has either been moved or doesn't exist. Let's get you back to the gateway.
          </p>

          <div className="pt-8 flex flex-col items-center gap-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 justify-center rounded-2xl bg-foreground text-background px-8 py-4 font-semibold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>

            <form action="/search" method="get" className="flex items-center w-full max-w-sm mt-4 border border-border rounded-xl overflow-hidden bg-background/50 backdrop-blur">
              <input 
                type="search" 
                name="q" 
                placeholder="Search KeyRote..." 
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm"
              />
              <button type="submit" className="px-4 py-3 bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors">
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm text-muted-foreground">
              <span className="opacity-70">Popular:</span>
              <Link href="/docs" className="hover:text-foreground hover:underline transition-all">Docs</Link>
              <Link href="https://github.com/John-Varghese-EH/KeyRote" className="hover:text-foreground hover:underline transition-all">GitHub</Link>
              <Link href="/privacy" className="hover:text-foreground hover:underline transition-all">Privacy</Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
