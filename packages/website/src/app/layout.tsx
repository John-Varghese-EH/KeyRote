import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Star, Coffee, Heart } from "lucide-react";
import Script from "next/script";
import { CookieConsent } from "@/components/cookie-consent";
import { Header } from "@/components/header";



const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://john-varghese-eh.github.io/KeyRote"),
  title: {
    default: "KeyRote | Enterprise API Key Rotation & Load Balancer",
    template: "%s | KeyRote",
  },
  description: "Zero-downtime API Key Rotation and Load Balancer proxy. Transparently handles 429 rate limits across OpenAI, Anthropic, Gemini, and all major LLM providers.",
  keywords: ["API key rotation", "load balancer", "LLM proxy", "rate limit bypass", "OpenAI proxy", "Anthropic proxy", "KeyRote", "developer tools"],
  authors: [{ name: "John Varghese (J0X)", url: "https://github.com/John-Varghese-EH" }],
  creator: "John Varghese (J0X)",
  publisher: "KeyRote",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "KeyRote | Enterprise API Key Rotation & Load Balancer",
    description: "Zero-downtime API Key Rotation and Load Balancer proxy. Transparently handles 429 rate limits across all major AI providers.",
    url: "https://john-varghese-eh.github.io/KeyRote",
    siteName: "KeyRote",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://john-varghese-eh.github.io/KeyRote/og-preview.png",
        width: 1200,
        height: 630,
        alt: "KeyRote - API Key Rotation Proxy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyRote | API Key Rotation Proxy",
    description: "Zero-downtime API Key Rotation and Load Balancer proxy.",
    images: ["https://john-varghese-eh.github.io/KeyRote/og-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="author" href="/KeyRote/humans.txt" />
        <link rel="sitemap" type="application/xml" href="/KeyRote/sitemap.xml" />
      </head>
      <body
        className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization", "Brand"],
                "@id": "https://john-varghese-eh.github.io/KeyRote/#organization",
                "name": "KeyRote",
                "url": "https://john-varghese-eh.github.io/KeyRote",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://john-varghese-eh.github.io/KeyRote/apple-icon.png",
                  "width": 180,
                  "height": 180
                },
                "description": "Enterprise-grade API Key Rotation & Load Balancer Proxy.",
                "founder": {
                  "@type": "Person",
                  "name": "John Varghese (J0X)",
                  "sameAs": ["https://github.com/John-Varghese-EH", "https://linkedin.com/in/John--Varghese"]
                },
                "contactPoint": [
                  { "@type": "ContactPoint", "contactType": "security", "email": "security@keyrote.dev" }
                ],
                "sameAs": ["https://github.com/John-Varghese-EH/KeyRote"]
              },
              {
                "@type": "WebSite",
                "@id": "https://john-varghese-eh.github.io/KeyRote/#website",
                "url": "https://john-varghese-eh.github.io/KeyRote",
                "name": "KeyRote",
                "publisher": { "@id": "https://john-varghese-eh.github.io/KeyRote/#organization" }
              },
              {
                "@type": "SoftwareApplication",
                "name": "KeyRote",
                "operatingSystem": "Any",
                "applicationCategory": "DeveloperApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
              }
            ]
          })
        }} />
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                personalization_storage: 'denied',
                security_storage: 'granted',
                wait_for_update: 500
              });
              gtag('set', 'ads_data_redaction', true);
              gtag('set', 'url_passthrough', true);
            `,
          }}
        />
        <CookieConsent />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          
          <main>{children}</main>

          <footer className="w-full pt-10 pb-10 md:pb-20 px-6 md:px-12 bg-background border-t border-border relative overflow-hidden mt-auto">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-12 gap-x-8 gap-y-8 md:gap-y-12 relative z-10">
              <div className="space-y-6 col-span-2 sm:col-span-4 md:col-span-5 lg:col-span-4">
                <h4 className="text-3xl font-black tracking-tighter text-foreground bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">KeyRote.</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Enterprise-grade API Key Rotation & Load Balancer. Transparently handles rate limits across all major AI providers.
                </p>
                <div className="pt-2 space-y-4">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> By John Varghese (J0X)
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-muted-foreground">
                    <a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium p-2 -ml-2 rounded-lg hover:bg-muted">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/john--varghese" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-muted">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 md:col-start-7 lg:col-start-6">
                <h4 className="font-bold text-foreground tracking-tight">Resources</h4>
                <ul className="space-y-3">
                  <li><a href="https://github.com/John-Varghese-EH/KeyRote" className="hover:text-foreground text-muted-foreground transition-colors text-sm font-medium">GitHub Repository</a></li>
                  <li><a href="https://github.com/John-Varghese-EH/KeyRote/issues" className="hover:text-foreground text-muted-foreground transition-colors text-sm font-medium">Issue Tracker</a></li>
                  <li><Link href="/docs" className="hover:text-foreground text-muted-foreground transition-colors text-sm font-medium">Documentation</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                <h4 className="font-bold text-foreground tracking-tight">Legal</h4>
                <ul className="space-y-3">
                  <li><Link href="/privacy" className="hover:text-foreground text-muted-foreground transition-colors text-sm font-medium">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground text-muted-foreground transition-colors text-sm font-medium">Terms of Service</Link></li>
                </ul>
              </div>

              <div className="space-y-4 col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-10 mt-6 md:mt-0">
                <h4 className="font-bold text-foreground tracking-tight flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-500" />
                  Support KeyRote
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Building and maintaining KeyRote takes countless sleepless nights. If this open-source project saved your production environment from 429s, please consider supporting. It truly keeps the dream alive! 🙏
                </p>
                <div className="space-y-3">
                  <a href="https://buymeacoffee.com/johnvarghese" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#FFDD00] text-black font-bold rounded-xl hover:bg-[#FFDD00]/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#FFDD00]/10 border border-[#FFDD00]/50">
                    <Coffee className="w-5 h-5 fill-current" />
                    Buy me a coffee
                  </a>
                  <div className="grid grid-cols-3 gap-2">
                    <a href="https://patreon.com/johnvarghese" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-2 px-1 bg-[#FF424D] text-white font-medium rounded-lg hover:bg-[#FF424D]/90 transition-all hover:scale-[1.02] active:scale-95 text-[11px] sm:text-xs border border-[#FF424D]/50" title="Support on Patreon">
                      Patreon
                    </a>
                    <a href="https://github.com/sponsors/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-2 px-1 bg-zinc-800 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 text-[11px] sm:text-xs border border-border" title="GitHub Sponsors">
                      GitHub
                    </a>
                    <a href="upi://pay?pa=johnvarghese@noxpay" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-2 px-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 text-[11px] sm:text-xs border border-blue-500/50" title="NoxPay UPI">
                      NoxPay
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div>&copy; {new Date().getFullYear()} KeyRote. All rights reserved.</div>
              <div className="flex items-center gap-1.5">
                Licensed under <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">AGPL-3.0</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}


