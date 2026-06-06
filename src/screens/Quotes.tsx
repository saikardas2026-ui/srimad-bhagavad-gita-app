// ── Add your quotes here when ready ───────────────────────────────────────
// Example: { sanskrit: "কর্মণ্যেবাধিকারস্তে...", bengali: "নিজের কর্তব্য...", source: "গীতা ২.৪৭" }
const QUOTES: { sanskrit: string; bengali: string; source: string }[] = [
  // ← Paste your quotes here
];

interface Props { onHome: () => void; fadeIn: boolean; }

export function Quotes({ onHome, fadeIn }: Props) {
  return (
    <div className={`screen simple-content-screen ${fadeIn ? "visible" : ""}`}>
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title">
          <span className="topbar-om">ॐ</span> অমৃত বাণী
        </div>
        <div className="topbar-spacer" />
      </div>

      <div className="sc-scroll">
        {QUOTES.length === 0 ? (
          <div className="screen-coming-soon">
            <i className="fa-solid fa-quote-right scs-icon" />
            <p className="scs-title">অমৃত বাণী শীঘ্রই আসছে</p>
          </div>
        ) : (
          <div className="quotes-grid">
            {QUOTES.map((q, i) => (
              <div key={i} className="quote-card">
                <div className="quote-card-top">
                  <span className="quote-om-small">ॐ</span>
                </div>
                {q.sanskrit && <p className="quote-sanskrit">{q.sanskrit}</p>}
                <p className="quote-bengali">"{q.bengali}"</p>
                <div className="quote-divider" />
                <span className="quote-source">— {q.source}</span>
                <div className="quote-card-corner tl" />
                <div className="quote-card-corner tr" />
                <div className="quote-card-corner bl" />
                <div className="quote-card-corner br" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>
    </div>
  );
}
