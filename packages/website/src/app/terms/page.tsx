import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and Acceptable Use Policy for KeyRote.",
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 md:px-12 prose prose-zinc dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><strong>Last Updated:</strong> June 2026 | <strong>Effective:</strong> June 2026</p>

      <h2>1. Acceptance</h2>
      <p>By accessing KeyRote ("Service") at https://john-varghese-eh.github.io/KeyRote, operated by KeyRote Systems ("Company"), you agree to these Terms. If you disagree, do not use the Service.</p>

      <h2>2. Description of Service</h2>
      <p>KeyRote provides a zero-downtime API Key Rotation and Load Balancer proxy.</p>

      <h2>3. User Accounts</h2>
      <ul>
        <li>Must be 18+ (or 13+ with parental consent).</li>
        <li>You are responsible for account security. Notify security@keyrote.dev on unauthorized access.</li>
        <li>Provide accurate registration information.</li>
      </ul>

      <h2>4. Acceptable Use — You agree NOT to:</h2>
      <ul>
        <li>Use for unlawful purposes</li>
        <li>Attempt unauthorized system access</li>
        <li>Transmit malware or malicious code</li>
        <li>Scrape, mine, or harvest data beyond rate limits</li>
      </ul>

      <h2>5. Disclaimers & Limitation of Liability</h2>
      <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, KEYROTE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>

      <h2>6. Governing Law</h2>
      <p>Governed by the laws of our operating jurisdiction. Disputes via binding arbitration before litigation.</p>

      <h2>7. Contact</h2>
      <p>KeyRote Systems | <a href="mailto:security@keyrote.dev">security@keyrote.dev</a></p>
    </div>
  );
}
