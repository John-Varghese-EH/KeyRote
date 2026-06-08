import { ShieldAlert, ServerCog, Blocks } from "lucide-react";
import Link from "next/link";

export default function DocsIntroduction() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Introduction to KeyRote</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          KeyRote is an enterprise-grade API Key Rotation & Load Balancer. It transparently handles rate limits across all major AI providers so your application never drops a request.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">Why KeyRote?</h2>
        <p className="text-foreground/80 leading-relaxed">
          When scaling LLM applications, hitting the 429 Too Many Requests limit is inevitable. 
          Managing multiple API keys manually within your application code leads to messy, brittle logic.
          KeyRote solves this by acting as a transparent proxy. You send requests to KeyRote, and KeyRote 
          handles the key rotation, load balancing, and retry logic behind the scenes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-card border border-border/50 space-y-3">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          <h3 className="text-lg font-bold">Resilience</h3>
          <p className="text-sm text-muted-foreground">Instantly catches 429 errors and automatically retries the request with the next healthy API key in your pool.</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border/50 space-y-3">
          <ServerCog className="w-8 h-8 text-emerald-500" />
          <h3 className="text-lg font-bold">Edge Native</h3>
          <p className="text-sm text-muted-foreground">Deploys seamlessly on Cloudflare Workers for zero-latency overhead globally, or via a simple Docker container.</p>
        </div>
      </div>

      <div className="pt-8">
        <Link 
          href="/docs/quickstart" 
          className="inline-flex items-center justify-center rounded-xl bg-foreground text-background px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
        >
          Proceed to Quickstart
        </Link>
      </div>
    </div>
  );
}
