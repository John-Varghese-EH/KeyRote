"use client";

import { useEffect, useState } from "react";
import { ServerCrash, Key, Activity, Clock, Terminal, Globe, Zap, ShieldCheck, HardDrive, Database, ArrowUpRight } from "lucide-react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"openai" | "deepseek" | "qwen" | "curl">("deepseek");

  useEffect(() => {
    Promise.all([
      fetch('/api/proxy/health').then(res => res.json()),
      fetch('/api/proxy/logs/status').then(res => res.json()).catch(() => null)
    ])
      .then(([healthData, telemetryData]) => {
        setHealth(healthData);
        if (telemetryData && !telemetryData.error) {
          setTelemetry(telemetryData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
          <span className="font-medium tracking-wide">Syncing state with KeyRote Edge...</span>
        </div>
      </div>
    );
  }

  if (!health || health.error) {
    return (
      <div className="h-full bg-background flex items-center justify-center p-10">
        <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-2xl">
              <ServerCrash className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Connection Failed</h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Unable to connect to the KeyRote proxy. Ensure the proxy is running on port 3000 and your <code className="text-red-500 dark:text-red-400 font-mono text-sm bg-red-500/10 px-1 rounded">ADMIN_SECRET</code> matches the configuration.
          </p>
        </div>
      </div>
    );
  }

  const ratio = health.healthyKeyCount / (health.totalKeyCount || 1);
  const statusColor = ratio > 0.5 ? 'text-emerald-500 dark:text-emerald-400' : ratio > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400';
  const statusBg = ratio > 0.5 ? 'bg-emerald-500/10' : ratio > 0 ? 'bg-amber-500/10' : 'bg-red-500/10';
  const statusBorder = ratio > 0.5 ? 'border-emerald-500/20' : ratio > 0 ? 'border-amber-500/20' : 'border-red-500/20';

  return (
    <div className="min-h-full bg-background text-foreground relative pb-24">
      {/* Ambient Backgrounds - Subdued for professional feel */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Proxy Overview</h1>
            </div>
            <p className="text-muted-foreground max-w-xl">Live telemetry of your API key rotation pool and rate-limit mitigation system.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-sm">
               <div className={`w-2 h-2 rounded-full ${ratio > 0.5 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
               <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proxy Online</span>
             </div>
          </div>
        </header>

        {/* Global Proxy Telemetry (New Feature) */}
        {telemetry && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Proxied</div>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-foreground">{telemetry.redisAuditCount?.toLocaleString() || '0'}</div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Live requests
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Storage Usage</div>
                <HardDrive className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-foreground">{telemetry.totalSizeMb?.toFixed(2) || '0'} <span className="text-lg text-muted-foreground">MB</span></div>
              <div className="text-xs text-muted-foreground mt-2">Across {telemetry.fileCount || 0} audit logs</div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-500/30 transition-colors md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">429 Errors Mitigated</div>
                <Terminal className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-black text-foreground">{telemetry.redisErrorCount?.toLocaleString() || '0'}</div>
                <div className="text-xs text-muted-foreground max-w-[200px] text-right">
                  KeyRote successfully intercepted and rotated keys for these rate limits.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl ring-1 ring-blue-500/20 text-blue-500 dark:text-blue-400">
                <Key className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Total Pool</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Configured API Keys</h3>
              <div className="text-4xl font-black tracking-tight text-foreground">{health.totalKeyCount}</div>
            </div>
          </div>

          <div className={`glass-card p-6 border-l-4 ${ratio > 0.5 ? 'border-l-emerald-500' : 'border-l-amber-500'} relative overflow-hidden group`}>
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${ratio > 0.5 ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : 'bg-red-500/5 group-hover:bg-red-500/10'}`}></div>
            <div className="flex items-center justify-between mb-8">
              <div className={`p-3 ${statusBg} rounded-xl ring-1 ${statusBorder} ${statusColor}`}>
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Active</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Healthy Keys Available</h3>
              <div className="flex items-baseline gap-2">
                <div className={`text-4xl font-black tracking-tight ${statusColor}`}>{health.healthyKeyCount}</div>
                <div className="text-muted-foreground font-medium text-sm">/ {health.totalKeyCount}</div>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full mt-4 overflow-hidden">
                <div className={`h-full ${ratio > 0.5 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(health.healthyKeyCount / (health.totalKeyCount || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/20 text-amber-500 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Recovering</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Currently in Cooldown</h3>
              <div className="text-4xl font-black tracking-tight text-amber-500 dark:text-amber-400">{health.totalKeyCount - health.healthyKeyCount}</div>
            </div>
          </div>
        </div>

        {/* Detailed State Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-muted-foreground" /> Upstream Key State Matrix
          </h2>
          
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Key Identifier</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Health Status</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Lifetime Usage</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Cooldown Ends</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {health.states.map((state: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-mono text-foreground font-medium flex items-center gap-3">
                        <Key className="w-3.5 h-3.5 text-muted-foreground" />
                        •••• {state.key.slice(-4)}
                      </td>
                      <td className="px-6 py-4">
                        {state.healthy ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                            429 Mitigating
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-muted-foreground text-sm">
                        {state.usageCount.toLocaleString()} <span className="text-muted-foreground/50 text-[10px]">REQS</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {state.cooldownUntil ? new Date(state.cooldownUntil).toLocaleTimeString() : <span className="opacity-30">—</span>}
                      </td>
                    </tr>
                  ))}
                  {health.states.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground text-sm">
                        No keys currently configured in the upstream pool.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Integration Guides */}
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" /> Client SDK Integration
          </h2>
          
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-muted/20 p-4 flex flex-col gap-1 border-r border-border">
              <button 
                onClick={() => setActiveTab("deepseek")}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${activeTab === 'deepseek' ? 'bg-background border border-border shadow-sm text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
              >
                DeepSeek
                {activeTab === 'deepseek' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
              </button>

              <button 
                onClick={() => setActiveTab("qwen")}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${activeTab === 'qwen' ? 'bg-background border border-border shadow-sm text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
              >
                Qwen
                {activeTab === 'qwen' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
              </button>

              <button 
                onClick={() => setActiveTab("openai")}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${activeTab === 'openai' ? 'bg-background border border-border shadow-sm text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
              >
                OpenAI
                {activeTab === 'openai' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
              </button>
            </div>

            {/* Code View - High Contrast Dark Mode Theme */}
            <div className="flex-1 p-0 relative bg-[#0d1117] flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                <span className="ml-3 text-xs font-mono text-slate-400">{
                  activeTab === 'deepseek' ? 'deepseek_proxy.py' :
                  activeTab === 'qwen' ? 'qwen_proxy.py' : 'openai_proxy.py'
                }</span>
              </div>
              
              <div className="p-6 overflow-x-auto flex-1">
                <pre className="text-[13px] font-mono leading-[1.7]">
                  {activeTab === 'deepseek' && (
                    <code className="text-[#e6edf3]">
                      <span className="text-[#ff7b72]">from</span> openai <span className="text-[#ff7b72]">import</span> OpenAI<br/>
                      <span className="text-[#ff7b72]">import</span> os<br/><br/>
                      <span className="text-[#8b949e]"># 1. Point to your KeyRote instance instead of api.deepseek.com</span><br/>
                      client = OpenAI(<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;base_url=<span className="text-[#a5d6ff]">"http://localhost:3000/proxy"</span>,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;api_key=os.environ.get(<span className="text-[#a5d6ff]">"PROXY_SECRET"</span>), <br/>
                      )<br/><br/>
                      <span className="text-[#8b949e]"># 2. KeyRote will transparently rotate your DeepSeek keys on 429 errors</span><br/>
                      response = client.chat.completions.create(<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;model=<span className="text-[#a5d6ff]">"deepseek-chat"</span>,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;messages=[{"{"}<span className="text-[#a5d6ff]">"role"</span>: <span className="text-[#a5d6ff]">"user"</span>, <span className="text-[#a5d6ff]">"content"</span>: <span className="text-[#a5d6ff]">"Explain quantum computing"</span>{"}"}],<br/>
                      )
                    </code>
                  )}
                  
                  {activeTab === 'qwen' && (
                    <code className="text-[#e6edf3]">
                      <span className="text-[#ff7b72]">from</span> openai <span className="text-[#ff7b72]">import</span> OpenAI<br/>
                      <span className="text-[#ff7b72]">import</span> os<br/><br/>
                      <span className="text-[#8b949e]"># 1. Point to your KeyRote instance instead of DashScope</span><br/>
                      client = OpenAI(<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;base_url=<span className="text-[#a5d6ff]">"http://localhost:3000/proxy"</span>,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;api_key=os.environ.get(<span className="text-[#a5d6ff]">"PROXY_SECRET"</span>), <br/>
                      )<br/><br/>
                      <span className="text-[#8b949e]"># 2. KeyRote handles API rotation and rate limiting smoothly</span><br/>
                      response = client.chat.completions.create(<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;model=<span className="text-[#a5d6ff]">"qwen-max"</span>,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;messages=[{"{"}<span className="text-[#a5d6ff]">"role"</span>: <span className="text-[#a5d6ff]">"user"</span>, <span className="text-[#a5d6ff]">"content"</span>: <span className="text-[#a5d6ff]">"Write a poem"</span>{"}"}],<br/>
                      )
                    </code>
                  )}

                  {activeTab === 'openai' && (
                    <code className="text-[#e6edf3]">
                      <span className="text-[#ff7b72]">from</span> openai <span className="text-[#ff7b72]">import</span> OpenAI<br/>
                      <span className="text-[#ff7b72]">import</span> os<br/><br/>
                      <span className="text-[#8b949e]"># 1. Point to KeyRote Proxy instead of OpenAI directly</span><br/>
                      client = OpenAI(<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;base_url=<span className="text-[#a5d6ff]">"http://localhost:3000/proxy"</span>,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;api_key=os.environ.get(<span className="text-[#a5d6ff]">"PROXY_SECRET"</span>), <br/>
                      )<br/><br/>
                      <span className="text-[#8b949e]"># 2. Request will hit KeyRote and be proxied seamlessly.</span><br/>
                      chat_completion = client.chat.completions.create(<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;messages=[{"{"}<span className="text-[#a5d6ff]">"role"</span>: <span className="text-[#a5d6ff]">"user"</span>, <span className="text-[#a5d6ff]">"content"</span>: <span className="text-[#a5d6ff]">"Hello"</span>{"}"}],<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;model=<span className="text-[#a5d6ff]">"gpt-4o"</span>,<br/>
                      )
                    </code>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
