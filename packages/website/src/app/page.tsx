"use client";

import { AetherHero } from "@/components/ui/aether-hero";
import { useTheme } from "next-themes";
import { ShieldAlert, ServerCog, Blocks, Activity, CheckCircle2, Zap, Lock, Globe, BadgeDollarSign, ShieldCheck, Timer, RefreshCcw, XCircle, AlertCircle, MessageCircleQuestion, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What exactly does KeyRote do?",
    a: "KeyRote is a transparent, decentralized API proxy. It intercepts requests going to AI providers (like OpenAI), automatically injects the least-used healthy API key from your pool, and dynamically rotates keys if a 429 rate limit is hit?ensuring zero downtime."
  },
  {
    q: "Are my API keys and prompts secure?",
    a: "Absolutely. KeyRote is 100% self-hosted and open-source. Your API keys and sensitive prompt data never leave your environment. There is zero telemetry, zero logging by default, and no 3rd-party SaaS passing."
  },
  {
    q: "How does KeyRote handle 429 Too Many Requests errors?",
    a: "When KeyRote receives a 429 error from an AI provider, it intercepts the failure before it reaches your application. It immediately marks that specific key as 'exhausted', pulls a fresh key, and seamlessly retries the request using exponential backoff and jitter."
  },
  {
    q: "Can I deploy this on Edge infrastructure?",
    a: "Yes! KeyRote is built on modern, lightweight runtimes (like Fastify) and is fully compatible with Edge environments including Cloudflare Workers. This ensures decision routing happens in under ~2ms."
  },
  {
    q: "Which LLM providers are supported?",
    a: "KeyRote acts as a universal passthrough. It natively supports OpenAI, Anthropic, Google Gemini, DeepSeek, Qwen, Groq, NVIDIA NIM, and OpenRouter. You do not need to change your SDK-just point your base URL to your KeyRote instance."
  }
];

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const currentYear = new Date().getFullYear();

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

      <main id="features" className="flex-1 w-full relative z-10 py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-background overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-0 w-[80vw] h-[800px] bg-primary/5 blur-[150px] pointer-events-none z-[-1]" />
        <div className="absolute top-[30%] right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] pointer-events-none z-[-1]" />
        <div className="absolute bottom-[20%] left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] pointer-events-none z-[-1]" />

        <div className="max-w-6xl mx-auto space-y-24 md:space-y-32 relative z-10">

          {/* Supported Providers Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 py-12 relative overflow-hidden"
          >
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase relative z-10">Transparently Proxies All Major Providers</p>

            <div className="relative flex overflow-hidden group max-w-[100vw] mx-auto mask-image-gradient">
              <div
                className="flex whitespace-nowrap opacity-40 grayscale dark:invert-0 invert transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 w-max animate-marquee gap-3 md:gap-4"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="contents">
                    <span className="text-xl md:text-2xl font-bold font-sans tracking-tight">OpenAI</span>
                    <span className="text-xl md:text-2xl font-serif italic tracking-tight text-orange-400">Anthropic</span>
                    <span className="text-xl md:text-2xl font-bold font-sans text-blue-500 tracking-tighter">Google Gemini</span>
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">DeepSeek</span>
                    <span className="text-xl md:text-2xl font-semibold italic tracking-tighter text-indigo-500 dark:text-indigo-400">Qwen</span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-orange-500">Groq</span>
                    <span className="text-xl md:text-2xl font-semibold tracking-tight text-green-500">NVIDIA NIM</span>
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-purple-500">OpenRouter</span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-background to-transparent" />
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
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Built for Production Scale.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                KeyRote sits completely transparently between your application and your AI providers.
                When an API key burns out, we seamlessly hot-swap it mid-flight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={<ShieldAlert className="w-8 h-8 transition-colors duration-500 group-hover:text-red-500" />}
                colorClass="group-hover:bg-red-500/10 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                title="429 Rate Limit Handling"
                description="Never drop a request again. KeyRote instantly catches 429s and retries with a healthy key."
              />
              <FeatureCard
                icon={<Blocks className="w-8 h-8 transition-colors duration-500 group-hover:text-purple-500" />}
                colorClass="group-hover:bg-purple-500/10 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                title="Multi-Modal & Agnostic"
                description="Forward anything. Images, streaming SSEs, audio-KeyRote transparently proxies standard REST JSON payloads."
              />
              <FeatureCard
                icon={<ServerCog className="w-8 h-8 transition-colors duration-500 group-hover:text-emerald-500" />}
                colorClass="group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                title="Edge Native Deployment"
                description="Deploy anywhere. We provide a Node.js Docker proxy or a fully compatible Cloudflare Worker port."
              />
              <FeatureCard
                icon={<Activity className="w-8 h-8 transition-colors duration-500 group-hover:text-blue-500" />}
                colorClass="group-hover:bg-blue-500/10 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">How It Works.</h2>
              <div className="space-y-8 relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary/50 via-emerald-500/50 to-transparent z-0 hidden sm:block"></div>
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
            className="bg-zinc-950 dark:bg-zinc-900 text-white rounded-[2.5rem] p-6 md:p-16 space-y-10 md:space-y-16 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="text-center space-y-4 md:space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">Uncompromising Performance.</h2>
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

          {/* Why Choose KeyRote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="space-y-12 pb-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Why Choose KeyRote?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Unlock enterprise resilience without the enterprise price tag.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="p-8 md:p-10 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"><BadgeDollarSign className="w-24 h-24" /></div>
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 w-fit text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                  <BadgeDollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Cost Efficiency</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">Stop paying for expensive managed gateways that charge per request. KeyRote is open-source and can be hosted on a $5 VPS or for free on Cloudflare Workers, handling millions of requests at no extra cost.</p>
              </div>
              <div className="p-8 md:p-10 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"><ShieldCheck className="w-24 h-24" /></div>
                <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 w-fit text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Maximum Privacy</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">Unlike SaaS gateways, KeyRote runs in your own infrastructure. Your API keys and sensitive prompt data never leave your environment, ensuring strict compliance with HIPAA and GDPR requirements.</p>
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
            <div className="relative p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
              <div className="flex-1 space-y-6 md:space-y-8 w-full">
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

          {/* Expertise & Reinsurance: Load Balancer Mechanics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="space-y-8 md:space-y-12 pb-10 mt-20 md:mt-32"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Enterprise Load Balancing.</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                How KeyRote allows you to respond effectively to issues related to Load Balancers and AI API orchestration.
              </p>
            </div>
            <div className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-sm max-w-5xl mx-auto">
              <p className="text-lg leading-relaxed text-foreground">
                When scaling generative AI applications, the primary bottleneck is vendor rate limits (429 Too Many Requests). Relying on a single API key restricts throughput.
                <strong className="text-primary mx-1">KeyRote's decentralized load balancing architecture</strong> intercepts egress requests, evaluates the real-time quota status of your registered keys in a Redis or in-memory pool, and dynamically routes the request to the healthiest key.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="flex items-start gap-4 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg group hover:bg-background/80 transition-colors">
                  <div className="mt-1 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                    <div className="relative bg-blue-500/20 text-blue-500 p-2 rounded-xl"><Timer className="w-5 h-5" /></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1">Zero-Latency Routing</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Decision making occurs in under ~2ms using Edge-optimized runtimes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg group hover:bg-background/80 transition-colors">
                  <div className="mt-1 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="relative bg-emerald-500/20 text-emerald-500 p-2 rounded-xl"><RefreshCcw className="w-5 h-5" /></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1">Backoff Strategies</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Automatic exponential backoff and jitter for transient 500/502 errors from OpenAI/Anthropic.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comparison Matrix Removed */}

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="space-y-8 md:space-y-12 pb-10 mt-16 md:mt-24"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </motion.div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                  "@type": "Question",
                  "name": faq.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                  }
                }))
              })
            }}
          ></script>
        </div>
      </main>


    </div>
  );
}

function FeatureCard({ icon, title, description, colorClass = "group-hover:bg-muted" }: { icon: React.ReactNode, title: string, description: string, colorClass?: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border border-border/50 hover:border-black/20 dark:hover:border-white/20 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group hover:-translate-y-3 duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className={`mb-6 p-4 rounded-2xl bg-muted/50 w-fit transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 relative z-10 ${colorClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm relative z-10">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-6 items-start relative z-10">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.05)] flex items-center justify-center font-bold text-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className="relative z-10 text-foreground group-hover:scale-110 transition-transform duration-300">{number}</span>
      </div>
      <div>
        <h4 className="text-2xl font-bold mb-2 tracking-tight">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-card/40 backdrop-blur-md rounded-[1.5rem] border transition-all duration-300 overflow-hidden group ${isOpen ? 'border-primary/50 shadow-lg shadow-primary/20' : 'border-white/5 hover:border-white/10 shadow-sm hover:shadow-md'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 md:p-8 flex items-center justify-between gap-4 text-left focus:outline-none"
      >
        <h3 className="text-lg md:text-xl font-bold text-foreground relative z-10 pr-8">{question}</h3>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
          <Plus className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 md:p-8 pt-0">
              <p className="text-muted-foreground leading-relaxed relative z-10">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
