"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

const STORAGE_KEY = "keyrote_cc";
const VERSION = "1";

type Prefs = { analytics: boolean; functional: boolean; marketing: boolean };

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [prefs, setPrefs] = useState<Prefs>({
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || saved.v !== VERSION) {
        setShowBanner(true);
      } else {
        setPrefs(saved.p);
        applyGtag(saved.p);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const applyGtag = (p: Prefs) => {
    // @ts-ignore
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // @ts-ignore
      window.gtag("consent", "update", {
        analytics_storage: p.analytics ? "granted" : "denied",
        ad_storage: p.marketing ? "granted" : "denied",
        ad_user_data: p.marketing ? "granted" : "denied",
        ad_personalization: p.marketing ? "granted" : "denied",
        functionality_storage: p.functional ? "granted" : "denied",
        personalization_storage: p.functional ? "granted" : "denied",
      });
    }
  };

  const savePrefs = (p: Prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: VERSION, ts: Date.now(), p }));
    setPrefs(p);
    applyGtag(p);
    setShowBanner(false);
    setShowModal(false);
  };

  const acceptAll = () => savePrefs({ analytics: true, functional: true, marketing: true });
  const rejectAll = () => savePrefs({ analytics: false, functional: false, marketing: false });

  if (!mounted) return null;

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
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
        `}
      </Script>

      {/* Banner */}
      {showBanner && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie Consent"
          className="fixed bottom-0 left-0 right-0 z-[99999] bg-zinc-950 text-zinc-200 p-5 border-t border-zinc-800 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] font-sans text-sm"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[260px]">
              <strong className="text-[0.95rem] block mb-1">🍪 We use cookies</strong>
              <p className="m-0 opacity-85 leading-relaxed">
                We use cookies to enhance your experience, analyze traffic, and personalize content.
                By clicking "Accept All" you consent to our use of cookies.{" "}
                <Link href="/cookies" className="text-white underline decoration-white/30 hover:decoration-white transition-all">
                  Cookie Policy
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={rejectAll}
                className="px-4 py-2 border border-zinc-700 bg-transparent text-zinc-300 rounded-md cursor-pointer text-sm hover:bg-zinc-900 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 border border-white/20 bg-transparent text-white rounded-md cursor-pointer text-sm hover:bg-white/10 transition-colors"
              >
                Manage Preferences
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2 border-none bg-white text-black rounded-md cursor-pointer text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100000] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-950 rounded-xl max-w-lg w-full p-8 text-zinc-200 border border-zinc-800 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="m-0 mb-2 text-xl font-bold">Cookie Preferences</h2>
            <p className="opacity-75 text-sm m-0 mb-6">
              Manage your cookie preferences below.
            </p>

            <div className="flex justify-between items-start p-4 bg-zinc-900 rounded-lg mb-3">
              <div>
                <strong className="text-sm">Strictly Necessary</strong>
                <p className="m-0 mt-1 opacity-65 text-xs">Auth, security, basic functions.</p>
              </div>
              <span className="bg-green-950 text-green-400 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4">
                Always On
              </span>
            </div>

            <div className="flex justify-between items-start p-4 bg-zinc-900 rounded-lg mb-3">
              <div>
                <strong className="text-sm">Analytics</strong>
                <p className="m-0 mt-1 opacity-65 text-xs">Google Analytics, clarity.</p>
              </div>
              <label className="relative inline-block w-11 h-6 flex-shrink-0 ml-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                />
                <span className="absolute inset-0 bg-zinc-700 rounded-full transition-colors peer-checked:bg-white before:content-[''] before:absolute before:w-[18px] before:h-[18px] before:left-[3px] before:bottom-[3px] before:bg-white peer-checked:before:bg-black before:rounded-full before:transition-transform peer-checked:before:translate-x-5"></span>
              </label>
            </div>

            <div className="flex justify-between items-start p-4 bg-zinc-900 rounded-lg mb-3">
              <div>
                <strong className="text-sm">Functional</strong>
                <p className="m-0 mt-1 opacity-65 text-xs">Theme, language preferences.</p>
              </div>
              <label className="relative inline-block w-11 h-6 flex-shrink-0 ml-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={prefs.functional}
                  onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                />
                <span className="absolute inset-0 bg-zinc-700 rounded-full transition-colors peer-checked:bg-white before:content-[''] before:absolute before:w-[18px] before:h-[18px] before:left-[3px] before:bottom-[3px] before:bg-white peer-checked:before:bg-black before:rounded-full before:transition-transform peer-checked:before:translate-x-5"></span>
              </label>
            </div>

            <div className="flex justify-between items-start p-4 bg-zinc-900 rounded-lg mb-6">
              <div>
                <strong className="text-sm">Marketing</strong>
                <p className="m-0 mt-1 opacity-65 text-xs">Advertising & retargeting.</p>
              </div>
              <label className="relative inline-block w-11 h-6 flex-shrink-0 ml-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                />
                <span className="absolute inset-0 bg-zinc-700 rounded-full transition-colors peer-checked:bg-white before:content-[''] before:absolute before:w-[18px] before:h-[18px] before:left-[3px] before:bottom-[3px] before:bg-white peer-checked:before:bg-black before:rounded-full before:transition-transform peer-checked:before:translate-x-5"></span>
              </label>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-zinc-700 bg-transparent text-zinc-400 rounded-md cursor-pointer text-sm hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => savePrefs(prefs)}
                className="px-5 py-2 border-none bg-white text-black rounded-md cursor-pointer text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
