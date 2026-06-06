import { useState } from "react";

// ── Add your words and meanings here when ready ────────────────────────────
// Example entry: { word: "অর্জুন", meaning: "পাণ্ডবদের তৃতীয় পুত্র..." }
const DICT_ENTRIES: { word: string; meaning: string }[] = [
  // ← Paste your entries here
];

interface Props { onHome: () => void; fadeIn: boolean; }

export function Dictionary({ onHome, fadeIn }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? DICT_ENTRIES.filter(e => e.word.includes(query) || e.meaning.includes(query))
    : DICT_ENTRIES;

  return (
    <div className={`screen simple-content-screen ${fadeIn ? "visible" : ""}`}>
      {/* Top bar */}
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title">
          <span className="topbar-om">ॐ</span> শব্দার্থ কোষ
        </div>
        <div className="topbar-spacer" />
      </div>

      {/* Search bar */}
      <div className="dict-search-bar">
        <i className="fa-solid fa-magnifying-glass dict-search-icon" />
        <input
          className="dict-search-input"
          type="text"
          placeholder="শব্দ খুঁজুন..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className="dict-clear-btn" onClick={() => setQuery("")}>
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="sc-scroll">
        <div className="dict-list">
          {DICT_ENTRIES.length === 0 && !query && (
            <div className="dict-coming-soon">
              <i className="fa-solid fa-book-open dict-cs-icon" />
              <p className="dict-cs-title">শব্দার্থ কোষ শীঘ্রই আসছে</p>
            </div>
          )}
          {query && filtered.length === 0 && (
            <div className="dict-empty">কোনো শব্দ পাওয়া যায়নি।</div>
          )}
          {filtered.map((entry, i) => (
            <div key={i} className="dict-entry">
              <div className="dict-word">
                <span className="dict-word-num">{i + 1}.</span>
                <span className="dict-word-text">{entry.word}</span>
              </div>
              <div className="dict-meaning">{entry.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>
    </div>
  );
}
