import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, BookOpen, Settings, Zap } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-border/50 md:min-h-[calc(100vh-4rem)] p-6 space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Documentation</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/docs" className="flex items-center gap-2 text-foreground/80 hover:text-foreground font-medium px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Introduction</span>
              </Link>
              <Link href="/docs/quickstart" className="flex items-center gap-2 text-foreground/80 hover:text-foreground font-medium px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Zap className="w-4 h-4" />
                <span>Quickstart</span>
              </Link>
              <Link href="/docs/configuration" className="flex items-center gap-2 text-foreground/80 hover:text-foreground font-medium px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Configuration</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
