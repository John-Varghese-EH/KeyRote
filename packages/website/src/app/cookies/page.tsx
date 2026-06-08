import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie and tracking preference policy for KeyRote.",
};

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 md:px-12 prose prose-zinc dark:prose-invert">
      <h1>Cookie Policy</h1>
      <p><strong>Last Updated:</strong> June 2026</p>

      <h2>What Are Cookies?</h2>
      <p>Small text files stored on your device to help websites remember preferences and understand usage.</p>

      <h2>Cookies We Use</h2>

      <h3>1. Strictly Necessary (Always Active)</h3>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>session_id</td><td>Authentication</td><td>Session</td></tr>
          <tr><td>keyrote_cc</td><td>Stores your preferences</td><td>1 year</td></tr>
        </tbody>
      </table>

      <h3>2. Analytics (Consent Required)</h3>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Provider</th></tr></thead>
        <tbody>
          <tr><td>_ga, _ga_*</td><td>Google Analytics</td><td>Google</td></tr>
        </tbody>
      </table>

      <h3>3. Functional (Consent Required)</h3>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>theme_pref</td><td>Dark/light mode</td></tr>
        </tbody>
      </table>

      <h2>Managing Preferences</h2>
      <p>You can manage your preferences using the "Manage Preferences" button on our cookie banner.</p>
      
      <p><strong>Contact:</strong> <a href="mailto:security@keyrote.dev">security@keyrote.dev</a></p>
    </div>
  );
}
