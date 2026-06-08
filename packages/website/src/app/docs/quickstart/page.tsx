import Link from "next/link";

export default function DocsQuickstart() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Quickstart</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Get KeyRote up and running in less than 5 minutes using Docker.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">1. Clone the Repository</h2>
        <p className="text-foreground/80 leading-relaxed">
          First, clone the KeyRote repository to your local machine or server.
        </p>
        <div className="bg-zinc-950 text-zinc-300 p-4 rounded-xl overflow-x-auto text-sm font-mono border border-white/10 shadow-inner">
          <pre>
            <code>git clone https://github.com/John-Varghese-EH/KeyRote.git{"\n"}cd KeyRote</code>
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">2. Configure Environment</h2>
        <p className="text-foreground/80 leading-relaxed">
          Copy the example environment file and set your secure proxy secret. This secret ensures only you can use your proxy.
        </p>
        <div className="bg-zinc-950 text-zinc-300 p-4 rounded-xl overflow-x-auto text-sm font-mono border border-white/10 shadow-inner">
          <pre>
            <code>cp .env.example .env{"\n"}# Edit .env and set PROXY_SECRET="your-super-secret-key"</code>
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">3. Start Services</h2>
        <p className="text-foreground/80 leading-relaxed">
          Use Docker Compose to spin up the proxy server, dashboard, and Redis instance.
        </p>
        <div className="bg-zinc-950 text-zinc-300 p-4 rounded-xl overflow-x-auto text-sm font-mono border border-white/10 shadow-inner">
          <pre>
            <code>docker-compose up -d</code>
          </pre>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <Link 
          href="/docs" 
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          ← Introduction
        </Link>
        <Link 
          href="/docs/configuration" 
          className="inline-flex items-center justify-center rounded-xl bg-foreground text-background px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
        >
          Configuration →
        </Link>
      </div>
    </div>
  );
}
