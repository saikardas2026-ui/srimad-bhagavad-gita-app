import { CHAPTERS, toBengaliNum } from "../data";

interface Props {
  onSelect: (chapterNum: number) => void;
  onHome:   () => void;
  fadeIn:   boolean;
}

export function ChapterList({ onSelect, onHome, fadeIn }: Props) {
  return (
    <div className={`screen chapter-list-screen ${fadeIn ? "visible" : ""}`}>

      {/* Top bar — title lives here exactly like the original */}
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" />
          <span>হোম</span>
        </button>
        <div className="cl-topbar-title">
          <span className="cl-topbar-line1">
            <span className="cl-topbar-om">ॐ</span> নমো ভগবতে বাসুদেবায়
          </span>
          <span className="cl-topbar-line2">অধ্যায় সমূহ</span>
        </div>
        <div className="topbar-spacer" />
      </div>

      {/* Chapter cards */}
      <div className="cl-scroll">
        <div className="cl-list">
          {CHAPTERS.map((ch) => (
            <button key={ch.num} className="chapter-card" onClick={() => onSelect(ch.num)}>
              <div className="chapter-num-badge">
                <span>{ch.bengaliNum}</span>
              </div>
              <div className="chapter-info">
                <span className="chapter-ordinal">{ch.ordinal} অধ্যায়</span>
                <span className="chapter-name">{ch.name}</span>
                <span className="chapter-verse-count">
                  শ্লোক সংখ্যা: {toBengaliNum(ch.verses)}
                </span>
              </div>
              <i className="fa-solid fa-chevron-right chapter-arrow" />
            </button>
          ))}
        </div>
      </div>

      {/* AdMob */}
      <div className="admob-placeholder">
        <span className="admob-label">
          <i className="fa-solid fa-rectangle-ad" /> Advertisement
        </span>
      </div>
    </div>
  );
}
