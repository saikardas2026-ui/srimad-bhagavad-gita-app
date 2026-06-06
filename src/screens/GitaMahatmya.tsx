export type MahatmyaSection = "shankar" | "varaha" | "padma";

interface Props {
  onHome: () => void;
  fadeIn: boolean;
  onSelect: (section: MahatmyaSection) => void;
}

const ITEMS: { id: MahatmyaSection; num: string; title: string; icon: string }[] = [
  {
    id: "shankar",
    num: "১",
    title: "১. শ্রী শঙ্করাচার্য প্রণীত গীতা-মাহাত্ম্য",
    icon: "fa-solid fa-om",
  },
  {
    id: "varaha",
    num: "২",
    title: "২. শ্রীল ব্যাসদেব কৃত গীতা-মাহাত্ম্য",
    icon: "fa-solid fa-scroll",
  },
  {
    id: "padma",
    num: "৩",
    title: "৩. শ্রীবৈষ্ণবীয় তন্ত্রসারে গীতা-মাহাত্ম্য",
    icon: "fa-solid fa-book-open",
  },
];

export function GitaMahatmya({ onHome, fadeIn, onSelect }: Props) {
  return (
    <div className={`screen chapter-list-screen ${fadeIn ? "visible" : ""}`}>
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title"><span className="topbar-om">ॐ</span> গীতা মাহাত্ম্য</div>
        <div className="topbar-spacer" />
      </div>

      <div className="cl-scroll">
        <div className="mh-index-inner">
          <div className="sc-header" style={{ marginBottom: "1.6rem" }}>
            <div className="sc-om">ॐ</div>
            <h2 className="sc-heading">গীতা মাহাত্ম্য সূচিপত্র</h2>
            <div className="sc-heading-under" />
            <p className="sc-subtext">শ্রীমদ্ভগবদ্গীতার মহিমা ও গুরুত্ব</p>
          </div>

          <div className="mh-index-list">
            {ITEMS.map(item => (
              <button key={item.id} className="mh-index-card" onClick={() => onSelect(item.id)}>
                <div className="mh-index-badge">
                  <i className={item.icon} />
                </div>
                <div className="mh-index-text">
                  <span className="mh-index-title">{item.title}</span>
                </div>
                <i className="fa-solid fa-chevron-right mh-index-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>
    </div>
  );
}
