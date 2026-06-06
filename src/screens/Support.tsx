import { useState } from "react";

interface Props { onHome: () => void; fadeIn: boolean; }

const PHONE = "+8801811596076";

const METHODS = [
  {
    id: "bkash",
    toast: `বিকাশ নম্বরটি কপি হয়েছে! অনুগ্রহ করে আপনার বিকাশ অ্যাপ থেকে সেন্ড মানি করুন।`,
    bg: "#E2136E",
    shine: "rgba(255,120,180,.22)",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg" className="pay-logo-svg" aria-label="bKash">
        {/* Stylised bKash wordmark */}
        <text x="60" y="36" textAnchor="middle"
          fontFamily="'Arial Rounded MT Bold','Arial Black',sans-serif"
          fontWeight="900" fontSize="32" fill="#ffffff" letterSpacing="-1">
          bKash
        </text>
      </svg>
    ),
  },
  {
    id: "nagad",
    toast: `নগদ নম্বরটি কপি হয়েছে! অনুগ্রহ করে আপনার নগদ অ্যাপ থেকে সেন্ড মানি করুন।`,
    bg: "linear-gradient(135deg,#F7941D 0%,#e07010 100%)",
    shine: "rgba(255,210,100,.25)",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg" className="pay-logo-svg" aria-label="Nagad">
        <text x="60" y="36" textAnchor="middle"
          fontFamily="'Arial Rounded MT Bold','Arial Black',sans-serif"
          fontWeight="900" fontSize="32" fill="#ffffff" letterSpacing="-0.5">
          nagad
        </text>
      </svg>
    ),
  },
];

export function Support({ onHome, fadeIn }: Props) {
  const [toast,  setToast]  = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (method: typeof METHODS[0]) => {
    navigator.clipboard?.writeText(PHONE).catch(() => {});
    setCopied(method.id);
    setToast(method.toast);
    setTimeout(() => { setToast(null); setCopied(null); }, 4000);
  };

  return (
    <div className={`screen simple-content-screen ${fadeIn ? "visible" : ""}`}>

      {/* ── Topbar ── */}
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title"><span className="topbar-om">ॐ</span> অনুদান</div>
        <div className="topbar-spacer" />
      </div>

      {/* ── Toast ── */}
      <div className={`donate-toast ${toast ? "donate-toast--visible" : ""}`}>
        <i className="fa-solid fa-circle-check donate-toast-icon" />
        <span>{toast}</span>
      </div>

      <div className="sc-scroll">
        <div className="sc-inner pay-inner">

          {/* ── Header ── */}
          <div className="sc-header">
            <div className="sc-om">ॐ</div>
            <h2 className="sc-heading">অনুদান করুন</h2>
            <div className="sc-heading-under" />
          </div>

          {/* ── Description ── */}
          <p className="donate-desc">
            এই অ্যাপের সমস্ত কনটেন্ট সবার জন্য সম্পূর্ণ ফ্রি। অ্যাপটির রক্ষণাবেক্ষণ ও নতুন ফিচার যুক্ত করার কাজে আপনিও আপনার স্বেচ্ছামূলক অনুদান দিয়ে আমাদের সাহায্য করতে পারেন।
          </p>

          {/* ── Phone number display ── */}
          <div className="pay-phone-row">
            <i className="fa-solid fa-mobile-screen-button" />
            <span>{PHONE}</span>
          </div>

          {/* ── Brand Logo Cards ── */}
          <div className="pay-grid">
            {METHODS.map(m => (
              <button
                key={m.id}
                className={`pay-card ${copied === m.id ? "pay-card--copied" : ""}`}
                style={{ background: m.bg } as React.CSSProperties}
                onClick={() => handleCopy(m)}
                aria-label={`${m.id} অনুদান`}
              >
                {/* Shine overlay */}
                <div className="pay-card-shine" style={{ background: m.shine }} />

                {/* Logo */}
                <div className="pay-logo-wrap">
                  {m.logo}
                </div>

                {/* Copied indicator */}
                <div className={`pay-copied-badge ${copied === m.id ? "pay-copied-badge--show" : ""}`}>
                  <i className="fa-solid fa-check" /> কপি হয়েছে
                </div>

                {/* Tap hint */}
                {copied !== m.id && (
                  <div className="pay-tap-hint">
                    <i className="fa-regular fa-copy" /> ট্যাপ করে কপি করুন
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ── Note ── */}
          <div className="donate-note">
            <i className="fa-solid fa-heart" />
            আপনার প্রতিটি অনুদান গীতার প্রচারে কাজে লাগবে। হরে কৃষ্ণ!
          </div>

        </div>
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>
    </div>
  );
}
