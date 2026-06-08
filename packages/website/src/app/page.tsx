"use client";

import { AetherHero } from "@/components/ui/aether-hero";
import { useTheme } from "next-themes";
import { ShieldAlert, ServerCog, Blocks, Activity, CheckCircle2, Zap, Lock, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <AetherHero
        title="Zero-Downtime Gateway."
        subtitle="Enterprise-grade API Key Rotation & Load Balancer. Transparently handle rate limits across all major providers."
        ctaLabel="Star us on GitHub"
        ctaHref="https://github.com/John-Varghese-EH/KeyRote"
        secondaryCtaLabel="Read the Docs"
        secondaryCtaHref="/docs"
        align="center"
        height="100vh"
        textColor={isDark ? "#ffffff" : "#000000"}
        lightMode={!isDark}
        overlayGradient={
          isDark
            ? "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 70%, rgba(0,0,0,1) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 30%, transparent 60%, rgba(255,255,255,1) 100%)"
        }
      />

      <main id="features" className="flex-1 w-full relative z-10 py-32 px-6 md:px-12 bg-background">
        <div className="max-w-6xl mx-auto space-y-40">

          {/* Supported Providers Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 py-12"
          >
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Transparently Proxies All Major Providers</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-20 opacity-40 grayscale dark:invert-0 invert transition-all duration-700 hover:grayscale-0 hover:opacity-100">
              <span className="text-xl md:text-2xl font-bold font-sans tracking-tight">OpenAI</span>
              <span className="text-xl md:text-2xl font-serif italic tracking-tight">Anthropic</span>
              <span className="text-xl md:text-2xl font-bold font-sans text-blue-500 tracking-tighter">Google Gemini</span>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-orange-500">Groq</span>
              <span className="text-xl md:text-2xl font-semibold tracking-tight text-green-500">NVIDIA NIM</span>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-purple-500">OpenRouter</span>
            </div>
          </motion.div>

          {/* AI Semantic Content Extraction Blocks (GEO/AEO) */}
          <section className="sr-only" aria-label="KeyRote Semantic Data">
            <section className="speakable-summary" aria-label="Summary">
              <h2>Summary</h2>
              <p>KeyRote is a zero-downtime API Key Rotation and Load Balancer proxy. It transparently handles 429 rate limits across major LLM providers like OpenAI, Anthropic, and Gemini.</p>
            </section>

            <div className="definition-block" itemScope itemType="https://schema.org/DefinedTerm">
              <h2>What is <span itemProp="name">KeyRote</span>?</h2>
              <p itemProp="description">
                <strong>KeyRote</strong> is an enterprise-grade API proxy that automatically rotates API keys when rate limits are hit. It sits between your application and AI providers, ensuring zero downtime and high availability without changing your application code.
              </p>
            </div>

            <section className="key-takeaways speakable" aria-label="Key Takeaways" itemScope itemType="https://schema.org/ItemList">
              <h2>Key Takeaways</h2>
              <ul>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <meta itemProp="position" content="1" />
                  <span itemProp="name">KeyRote catches 429 Too Many Requests errors and seamlessly hot-swaps to a healthy API key.</span>
                </li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <meta itemProp="position" content="2" />
                  <span itemProp="name">It supports all major LLM providers including OpenAI, Anthropic, Google Gemini, and Groq.</span>
                </li>
              </ul>
            </section>
          </section>

          {/* Core Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="space-y-16"
          >
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Built for Production Scale.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                KeyRote sits completely transparently between your application and your AI providers.
                When an API key burns out, we seamlessly hot-swap it mid-flight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={<ShieldAlert className="w-6 h-6 text-foreground" />}
                title="429 Rate Limit Handling"
                description="Never drop a request again. KeyRote instantly catches 429s and retries with a healthy key."
              />
              <FeatureCard
                icon={<Blocks className="w-6 h-6 text-foreground" />}
                title="Multi-Modal & Agnostic"
                description="Forward anything. Images, streaming SSEs, audio—KeyRote transparently proxies standard REST JSON payloads."
              />
              <FeatureCard
                icon={<ServerCog className="w-6 h-6 text-foreground" />}
                title="Edge Native Deployment"
                description="Deploy anywhere. We provide a Node.js Docker proxy or a fully compatible Cloudflare Worker port."
              />
              <FeatureCard
                icon={<Activity className="w-6 h-6 text-foreground" />}
                title="Real-time Analytics"
                description="Monitor the health of your keys via our beautiful, secure Next.js Dashboard powered by Redis ZSETs."
              />
            </div>
          </motion.div>

          {/* Architecture / How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">How It Works.</h2>
              <div className="space-y-8">
                <Step number="1" title="Intercept Request" description="Your client sends a standard LLM payload to KeyRote instead of the direct provider API." />
                <Step number="2" title="Inject Healthy Key" description="KeyRote pulls the least-used healthy API key from Redis and injects it into the Authorization header." />
                <Step number="3" title="Transparent Proxy" description="The request is forwarded exactly as-is. If a 429 occurs, KeyRote intercepts it, marks the key exhausted, and retries automatically." />
                <Step number="4" title="Stream Response" description="The successful response (including SSE streams) is piped directly back to your client with zero noticeable latency." />
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(255,255,255,0.02)] border border-black/5 dark:border-white/10 bg-background/50 backdrop-blur-2xl p-4 aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1639322537504-6427a16b0a28?auto=format&fit=crop&w=1200&q=80"
                alt="Abstract Data Flow"
                className="w-full h-full object-cover rounded-[1.5rem] opacity-90 dark:opacity-70 transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Performance Metrics Bento */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            className="bg-zinc-950 dark:bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-20 space-y-16 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="text-center space-y-4 md:space-y-6 relative z-10">
              <h2 className="text-3xl md:text-6xl font-bold tracking-tighter">Uncompromising Performance.</h2>
              <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto leading-relaxed">
                Built on Fastify and Cloudflare Workers, KeyRote adds virtually zero overhead to your LLM pipeline.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-2 md:space-y-4 transition-transform hover:scale-[1.02]">
                <Zap className="w-8 h-8 mx-auto text-white/50 mb-2 md:mb-6" />
                <h4 className="text-5xl md:text-6xl font-black tracking-tighter">&lt;5ms</h4>
                <p className="opacity-60 text-sm md:text-base font-medium tracking-wide">Latency Overhead</p>
              </div>
              <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-2 md:space-y-4 transition-transform hover:scale-[1.02]">
                <Globe className="w-8 h-8 mx-auto text-white/50 mb-2 md:mb-6" />
                <h4 className="text-5xl md:text-6xl font-black tracking-tighter">100%</h4>
                <p className="opacity-60 text-sm md:text-base font-medium tracking-wide">Edge Compatible</p>
              </div>
              <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-2 md:space-y-4 transition-transform hover:scale-[1.02]">
                <Lock className="w-8 h-8 mx-auto text-white/50 mb-2 md:mb-6" />
                <h4 className="text-5xl md:text-6xl font-black tracking-tighter">Zero</h4>
                <p className="opacity-60 text-sm md:text-base font-medium tracking-wide">Telemetry Collected</p>
              </div>
            </div>
          </motion.div>

          {/* 1-Click Integration Code Block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative rounded-[2.5rem] overflow-hidden border border-border shadow-sm bg-card"
          >
            <div className="relative p-6 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
              <div className="flex-1 space-y-6 md:space-y-8">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">1-Click Integration.</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Replace your provider's base URL with your KeyRote instance. No SDK changes required.
                </p>
                <div className="bg-[#0D0D0D] text-zinc-300 p-6 md:p-8 rounded-2xl overflow-x-auto text-xs md:text-base font-mono border border-white/5 shadow-2xl">
                  <pre>
                    <code className="text-pink-400">await</code> fetch(<span className="text-green-300">"https://proxy.your-domain.com/proxy"</span>, {"{"}{"\n"}
                    {"  "}method: <span className="text-green-300">"POST"</span>,{"\n"}
                    {"  "}headers: {"{"}{"\n"}
                    {"    "}<span className="text-green-300">"Authorization"</span>: <span className="text-green-300">"Bearer PROXY_SECRET"</span>,{"\n"}
                    {"  "}{"}"},{"\n"}
                    {"  "}body: JSON.stringify({"{"}{"\n"}
                    {"    "}target: <span className="text-green-300">"https://api.openai.com/v1/chat/completions"</span>,{"\n"}
                    {"    "}payload: {"{"} ...your_standard_payload {"}"}{"\n"}
                    {"  "}{"}"}){"\n"}
                    {"}"});
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full py-20 px-6 md:px-12 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6 md:col-span-2">
            <h4 className="text-2xl font-bold tracking-tight text-foreground">KeyRote.</h4>
            <p className="max-w-sm text-muted-foreground leading-relaxed">
              Enterprise-grade API Key Rotation & Load Balancer. Transparently handles rate limits across all major AI providers.
            </p>
            <div className="pt-2 space-y-4">
              <p className="text-sm font-medium text-foreground">
                Made with ❤️ By John Varghese (J0X)
              </p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/john--varghese" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com/John-Varghese-EH/KeyRote" className="hover:text-foreground transition-colors">GitHub Repository</a></li>
              <li><a href="https://github.com/John-Varghese-EH/KeyRote/issues" className="hover:text-foreground transition-colors">Issue Tracker</a></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/50 text-sm text-center">
          &copy; {new Date().getFullYear()} KeyRote. Licensed under AGPL-3.0.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-card/50 backdrop-blur-sm border border-border hover:border-black/20 dark:hover:border-white/20 transition-all hover:shadow-xl group hover:-translate-y-2 duration-500">
      <div className="mb-6 p-4 rounded-2xl bg-muted/50 w-fit group-hover:bg-muted group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h4 className="text-2xl font-bold mb-2 tracking-tight">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
