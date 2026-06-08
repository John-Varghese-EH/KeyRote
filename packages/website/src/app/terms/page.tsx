import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">Last Updated: June 8, 2026</p>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>
            KeyRote is an open-source software project distributed under the <strong>GNU Affero General Public License v3.0 (AGPL-3.0)</strong>. 
            By downloading, deploying, or utilizing the KeyRote software, you agree to the terms outlined in the AGPL-3.0 license.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground">1. License</h2>
          <p>
            KeyRote is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">2. No Warranty</h2>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">3. Usage Responsibilities</h2>
          <p>
            You are solely responsible for ensuring that your use of KeyRote complies with the Terms of Service of the upstream API providers (e.g., OpenAI, Anthropic, Google) you connect to. KeyRote is a tool for load balancing and rate limit handling; it is your responsibility to ensure your usage does not violate provider policies regarding automated proxying, account sharing, or rate limit circumvention.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">4. Source Code and Modifications</h2>
          <p>
            If you modify KeyRote and make it available over a network (as a service), the AGPL-3.0 license requires you to make your modified source code available to the users interacting with your service. Please review the full AGPL-3.0 text for complete compliance requirements.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">5. Governing Law</h2>
          <p>
            These terms shall be governed and construed in accordance with the standard interpretation of the GNU AGPL v3 license.
          </p>
        </div>
      </div>
    </div>
  );
}
