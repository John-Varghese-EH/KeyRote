import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { KeyRound, Activity, AlertTriangle, FileText, Search, Bell, User, Heart, Coffee } from "lucide-react";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyRote Proxy Dashboard",
  description: "Enterprise API Key Rotation Proxy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background flex text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-sidebar/50 backdrop-blur-md flex flex-col relative z-20">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-xl tracking-tight bg-gradient-to-br from-blue-500 to-cyan-400 bg-clip-text text-transparent">KeyRote</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-1.5">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 px-3">Main Menu</div>
              <Link href="/" className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium transition-colors border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm">Overview</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              </Link>
              <Link href="/errors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Error Logs</span>
              </Link>
              <Link href="/audit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Audit Trails</span>
              </Link>
            </nav>
            
            {/* John Varghese Attribution & Support */}
            <div className="px-4 py-4 border-t border-border/50 bg-muted/20">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 px-2">Developer</div>
              <div className="bg-card border border-border rounded-xl p-3 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-white/20">
                    JV
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-none mb-1 text-foreground">John Varghese</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Security Engineer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.15-3.7s-1.2-.38-3.9 1.5a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.4 5.4 0 0 0-.15 3.7A5.5 5.5 0 0 0 3.3 9.4c0 5.22 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path><path d="M3 19s1-1 3-1"></path></svg>
                  </a>
                  <a href="https://linkedin.com/in/john-varghese" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="LinkedIn">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="https://buymeacoffee.com/johnvarghese" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted text-emerald-500 hover:text-emerald-400 transition-colors ml-auto flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2" title="Support the project">
                    <Coffee className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">Support</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-between items-center bg-sidebar">
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest font-bold">KeyRote v1.0</div>
              <ThemeToggle />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            
            {/* Top Navigation */}
            <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-muted-foreground text-sm w-64 focus-within:ring-2 focus-within:ring-ring transition-shadow">
                <Search className="w-4 h-4" />
                <span className="opacity-70">Search...</span>
                <div className="ml-auto flex items-center gap-1">
                  <kbd className="bg-background border border-border px-1.5 rounded text-[10px] font-mono font-bold">⌘</kbd>
                  <kbd className="bg-background border border-border px-1.5 rounded text-[10px] font-mono font-bold">K</kbd>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-background"></span>
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-border flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              </div>
            </header>

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
