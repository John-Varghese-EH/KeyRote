import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { KeyRound, Activity, AlertTriangle, FileText } from "lucide-react";

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
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-50 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/50 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">KeyRote</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-sm">Overview</span>
            </Link>
            <Link href="/errors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-sm">Error Logs</span>
            </Link>
            <Link href="/audit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-sm">Audit Trails</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 font-mono">v1.0.0-rc.1</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
