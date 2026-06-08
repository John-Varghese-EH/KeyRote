"use client";

import { useEffect, useState } from "react";
import { ServerCrash, Key, Activity, Clock, Terminal } from "lucide-react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/proxy/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-slate-400 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div> Loading health data...</div>;
  }

  if (!health || health.error) {
    return (
      <div className="p-10">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 flex items-center gap-3">
          <ServerCrash className="w-6 h-6" />
          <div>
            <h2 className="font-semibold text-lg text-red-300">Proxy Connection Failed</h2>
            <p className="text-sm opacity-80">Make sure the KeyRote proxy is running on port 3000 and ADMIN_SECRET is configured.</p>
          </div>
        </div>
      </div>
    );
  }

  const ratio = health.healthyKeyCount / (health.totalKeyCount || 1);
  const statusColor = ratio > 0.5 ? 'text-emerald-400' : ratio > 0 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">System Overview</h1>
        <p className="text-slate-400">Real-time status of upstream API keys and proxy routing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center gap-3 text-slate-400">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium">Total Keys</h3>
          </div>
          <div className="text-4xl font-bold text-white">{health.totalKeyCount}</div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all ${ratio > 0.5 ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'}`}></div>
          <div className="flex items-center gap-3 text-slate-400">
            <Activity className={`w-5 h-5 ${statusColor}`} />
            <h3 className="font-medium">Healthy Pool</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <div className={`text-4xl font-bold ${statusColor}`}>{health.healthyKeyCount}</div>
            <div className="text-slate-500 font-medium">available</div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center gap-3 text-slate-400">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-medium">In Cooldown</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-amber-400">{health.totalKeyCount - health.healthyKeyCount}</div>
            <div className="text-slate-500 font-medium">recovering</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Detailed Key State</h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Key Prefix</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Usage Count</th>
                <th className="px-6 py-4 font-medium">Cooldown Until</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {health.states.map((state: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-300">...{state.key.slice(-4)}</td>
                  <td className="px-6 py-4">
                    {state.healthy ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Rate Limited
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-400">
                    {state.usageCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {state.cooldownUntil ? new Date(state.cooldownUntil).toLocaleTimeString() : <span className="opacity-50">—</span>}
                  </td>
                </tr>
              ))}
              {health.states.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No keys configured in the pool.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Quick Integration</h2>
        </div>
        <p className="text-slate-400 mb-6">Replace your direct upstream base URL with KeyRote. KeyRote handles the `429` rate limits behind the scenes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OpenAI Python Example */}
          <div className="glass-card overflow-hidden flex flex-col">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              Python (OpenAI SDK)
            </div>
            <div className="p-4 bg-slate-950/50 flex-1">
              <pre className="text-sm font-mono text-emerald-300 overflow-x-auto">
                <code>
{`from openai import OpenAI
import os

client = OpenAI(
    # 1. Point to KeyRote Proxy instead of OpenAI directly
    base_url="http://localhost:3000/proxy",
    
    # 2. Use your PROXY_SECRET here
    api_key=os.environ.get("PROXY_SECRET"), 
)

# Request will hit KeyRote and be proxied to OpenAI automatically.
chat_completion = client.chat.completions.create(
    messages=[{"role": "user", "content": "Hello"}],
    model="gpt-4o",
)`}
                </code>
              </pre>
            </div>
          </div>

          {/* cURL Example */}
          <div className="glass-card overflow-hidden flex flex-col">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              cURL
            </div>
            <div className="p-4 bg-slate-950/50 flex-1">
              <pre className="text-sm font-mono text-blue-300 overflow-x-auto">
                <code>
{`curl -X POST http://localhost:3000/proxy \\
  -H "Authorization: Bearer <YOUR_PROXY_SECRET>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "target": "https://api.openai.com/v1/chat/completions",
    "payload": {
      "model": "gpt-4o",
      "messages": [{"role": "user", "content": "Hello"}]
    }
  }'`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
