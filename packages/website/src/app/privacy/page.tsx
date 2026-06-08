import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: June 8, 2026</p>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>
            KeyRote is an open-source, self-hosted API Key Rotation and Load Balancer proxy. As a self-hosted tool, 
            <strong> we do not collect, store, or transmit any of your telemetry, API keys, or payload data.</strong>
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground">1. Data Collection</h2>
          <p>
            Because you deploy KeyRote on your own infrastructure (such as your own Node.js server, Docker container, or Cloudflare Worker), 
            all data processed by KeyRote remains entirely within your environment. We do not have access to your server logs, Redis instances, or API requests.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">2. Upstream Providers</h2>
          <p>
            KeyRote acts as a transparent proxy. When you use KeyRote, your payloads are forwarded directly to the upstream AI providers 
            (e.g., OpenAI, Anthropic, Google Gemini). You are subject to the respective privacy policies of those third-party providers regarding 
            how they handle the data you send them.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">3. Security</h2>
          <p>
            Your API keys are stored in your own `.env` configuration or environment variables, and active states are stored in your own Redis instance. 
            We strongly recommend securing your Redis instance and ensuring your `PROXY_SECRET` and `ADMIN_SECRET` are kept confidential.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">4. Changes to this Policy</h2>
          <p>
            As an open-source project, any changes to how KeyRote operates will be fully visible in the public GitHub repository. 
            If any opt-in telemetry is ever introduced in the future, it will be clearly documented and disabled by default.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">5. Contact</h2>
          <p>
            For any questions or concerns regarding this privacy policy, please open an issue on our GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
}
