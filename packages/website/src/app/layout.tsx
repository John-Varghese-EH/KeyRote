import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Star } from "lucide-react";
import Script from "next/script";
import { CookieConsent } from "@/components/cookie-consent";

async function getGithubStars() {
  try {
    const res = await fetch("https://api.github.com/repos/John-Varghese-EH/KeyRote", { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

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
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyRote | API Key Rotation Proxy",
    description: "Zero-downtime API Key Rotation and Load Balancer proxy.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stars = await getGithubStars();
  return (
    <html lang="en" suppressHydrationWarning>
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
        <CookieConsent />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Floating Navigation Header */}
          <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto bg-black/20 dark:bg-black/40 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-black/10 dark:border-white/10 shadow-lg">
              <Link href="/" className="font-bold text-base md:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                KeyRote
              </Link>
            </div>
            <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-3 md:gap-4 px-3 md:px-4 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md text-sm font-medium">
                <Link href="/docs" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                  Docs
                </Link>
                <a href="https://github.com/John-Varghese-EH/KeyRote" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 fill-current hidden sm:block" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  <span className="flex items-center gap-1 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 sm:w-3 sm:h-3 fill-current group-hover:text-yellow-500 transition-colors" />
                    <span>{stars !== null ? stars : "Star"}</span>
                  </span>
                  <span className="hidden sm:inline w-[1px] h-3 bg-black/20 dark:bg-white/20"></span>
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Star us</span>
                </a>
              </div>
              <ThemeToggle />
            </div>
          </header>
          
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}


