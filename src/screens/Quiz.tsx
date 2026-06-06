// ── Add your questions here when ready ────────────────────────────────────
// Example: { q: "প্রশ্ন?", options: ["ক","খ","গ","ঘ"], answer: 0 }
// `answer` = index of correct option (0 = first, 1 = second, etc.)
const QUESTIONS: { q: string; options: string[]; answer: number }[] = [
  // ← Paste your questions here
];

interface Props { onHome: () => void; fadeIn: boolean; }

export function Quiz({ onHome, fadeIn }: Props) {
  return (
    <div className={`screen simple-content-screen ${fadeIn ? "visible" : ""}`}>
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title">
          <span className="topbar-om">ॐ</span> জ্ঞানমূলক প্রশ্ন
        </div>
        <div className="topbar-spacer" />
      </div>

      <div className="sc-scroll">
        <div className="quiz-wrap">
          {QUESTIONS.length === 0 ? (
            <div className="screen-coming-soon">
              <i className="fa-solid fa-circle-question scs-icon" />
              <p className="scs-title">জ্ঞান মূলক প্রশ্ন শীঘ্রই আসছে</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>
    </div>
  );
}
