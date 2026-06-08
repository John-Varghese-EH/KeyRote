import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and Data Processing Agreement for KeyRote.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 md:px-12 prose prose-zinc dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated:</strong> June 2026 | <strong>Data Controller:</strong> KeyRote Systems</p>
      
      <h2>1. Information We Collect</h2>
      <h3>1.1 You Provide</h3>
      <ul>
        <li>Account data (name, email, hashed password, profile)</li>
        <li>Communications (support tickets, feedback)</li>
        <li>Payment data (billing address only — card data via Stripe)</li>
      </ul>

      <h3>1.2 Automatically Collected</h3>
      <ul>
        <li>Usage data (pages, clicks, referring URLs)</li>
        <li>Device data (IP, browser, OS, device IDs)</li>
        <li>Cookies and tracking (see Cookie Policy)</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Legal Basis (GDPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Provide the Service</td><td>Contract performance</td></tr>
          <tr><td>Account communications</td><td>Contract performance</td></tr>
          <tr><td>Marketing (opt-in only)</td><td>Consent</td></tr>
          <tr><td>Analytics & improvement</td><td>Legitimate interests</td></tr>
        </tbody>
      </table>

      <h2>3. How We Share Information</h2>
      <p>We do NOT sell your data. We share only with service providers, for legal requirements, or business transfers.</p>

      <h2>4. Your Rights</h2>
      <p><strong>GDPR (EU/UK):</strong> Access, Rectification, Erasure, Restriction, Portability, Object, Withdraw Consent.<br />
      <strong>CCPA (California):</strong> Know, Delete, Opt-out of sale, Non-discrimination.</p>
      <p>To exercise rights: email <a href="mailto:security@keyrote.dev">security@keyrote.dev</a></p>

      <h2>5. Security</h2>
      <p>TLS/HTTPS, AES-256 at rest, access controls, regular audits, least-privilege principle.</p>
    </div>
  );
}
