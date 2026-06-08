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
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row pt-28 pb-12 px-4 md:px-8">
        <div className="flex-1 flex flex-col md:flex-row bg-card/30 backdrop-blur-3xl border border-border rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(255,255,255,0.02)] relative">
          
          {/* Ambient Background Glow */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Sidebar */}
          <aside className="relative z-10 w-full md:w-64 border-r border-border/50 p-6 md:p-8 space-y-8 bg-muted/20">
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Documentation</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/docs" className="flex items-center gap-3 text-foreground/70 hover:text-foreground font-medium px-4 py-3 rounded-xl hover:bg-muted/80 transition-all">
                  <BookOpen className="w-4 h-4" />
                  <span>Introduction</span>
                </Link>
                <Link href="/docs/quickstart" className="flex items-center gap-3 text-foreground/70 hover:text-foreground font-medium px-4 py-3 rounded-xl hover:bg-muted/80 transition-all">
                  <Zap className="w-4 h-4" />
                  <span>Quickstart</span>
                </Link>
                <Link href="/docs/configuration" className="flex items-center gap-3 text-foreground/70 hover:text-foreground font-medium px-4 py-3 rounded-xl hover:bg-muted/80 transition-all">
                  <Settings className="w-4 h-4" />
                  <span>Configuration</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="relative z-10 flex-1 p-8 md:p-12 lg:p-16 max-w-4xl">
            <div className="prose prose-zinc dark:prose-invert prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors prose-img:rounded-2xl max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
