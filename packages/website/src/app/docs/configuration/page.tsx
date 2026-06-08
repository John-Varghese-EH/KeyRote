import Link from "next/link";

export default function DocsConfiguration() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Configuration</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Learn how to add API keys and integrate your applications with the KeyRote proxy.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">Adding API Keys via Dashboard</h2>
        <p className="text-foreground/80 leading-relaxed">
          The easiest way to manage your API keys is through the built-in dashboard.
          Navigate to <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">http://localhost:3000</code> in your browser and log in with your Admin Secret.
          From there, you can add, remove, and monitor the health of your provider keys.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">Application Integration</h2>
        <p className="text-foreground/80 leading-relaxed">
          To use KeyRote, replace your provider's base URL with your KeyRote proxy URL.
          You must also pass your <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">PROXY_SECRET</code> in the Authorization header.
        </p>
        
        <div className="bg-[#0D0D0D] text-zinc-300 p-6 rounded-2xl overflow-x-auto text-sm font-mono border border-white/5 shadow-xl">
          <pre>
            <code className="text-pink-400">const</code> response = <code className="text-pink-400">await</code> fetch(<span className="text-green-300">"http://localhost:8080/proxy"</span>, {"{"}{"\n"}
            {"  "}method: <span className="text-green-300">"POST"</span>,{"\n"}
            {"  "}headers: {"{"}{"\n"}
            {"    "}<span className="text-green-300">"Content-Type"</span>: <span className="text-green-300">"application/json"</span>,{"\n"}
            {"    "}<span className="text-green-300">"Authorization"</span>: <span className="text-green-300">"Bearer YOUR_PROXY_SECRET"</span>{"\n"}
            {"  "}{"}"},{"\n"}
            {"  "}body: JSON.stringify({"{"}{"\n"}
            {"    "}target: <span className="text-green-300">"https://api.openai.com/v1/chat/completions"</span>,{"\n"}
            {"    "}payload: {"{"}{"\n"}
            {"      "}model: <span className="text-green-300">"gpt-4o"</span>,{"\n"}
            {"      "}messages: [{"{"} role: <span className="text-green-300">"user"</span>, content: <span className="text-green-300">"Hello!"</span> {"}"}]{"\n"}
            {"    "}{"}"}{"\n"}
            {"  "}{"}"}){"\n"}
            {"}"});
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight border-b border-border/50 pb-2">Advanced: Redis Configuration</h2>
        <p className="text-foreground/80 leading-relaxed">
          By default, KeyRote expects a Redis instance running at <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">redis://localhost:6379</code>.
          You can override this by setting the <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">UPSTASH_REDIS_REST_URL</code> and <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">UPSTASH_REDIS_REST_TOKEN</code> if you are deploying to an edge environment like Cloudflare Workers.
        </p>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <Link 
          href="/docs/quickstart" 
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          ← Quickstart
        </Link>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-xl bg-foreground text-background px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
