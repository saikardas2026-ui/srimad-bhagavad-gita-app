import { toBengaliNum } from "../data";

interface Props {
  onHome: () => void;
  onBack: () => void;
  fadeIn: boolean;
}

const SHANKAR_VERSES: { sanskrit: string; bengali: string; label?: string }[] = [
  {
    sanskrit: "গীতাশাস্ত্রমিদং পুণ্যং যঃ পঠেৎ প্রযতঃ পুমান্।\nবিষ্ণোঃ পদমবাপ্নোতি ভয়শোকাদিবর্জিতঃ।।১।।",
    bengali: "শ্রীমদ্ভগবদ্গীতার নির্দেশকে যথাযথভাবে অনুসরণ করতে পারলে, অতি সহজেই সমস্ত ভয় ও উদ্বেগ থেকে মুক্ত হওয়া যায়। এই জীবনে ভয় ও শোকাদি বর্জিত হয়ে পরবর্তী চিন্ময় স্বরূপ অর্জন করা যায়।",
  },
  {
    sanskrit: "গীতাধ্যায়নশীলস্য প্রাণায়ামপরস্য চ।\nনৈব সন্তি হি পাপানি পূর্বজন্মকৃতানি চ।।২।।",
    bengali: "কেউ যদি আন্তরিকভাবে এবং অত্যন্ত গুরুত্ব সহকারে ভগবদ্গীতা পাঠ করে, তা হলে ভগবানের করুণায় তার অতীতের সমস্ত পাপকর্মের ফল তাকে প্রভাবিত করে না।",
  },
  {
    sanskrit: "মলিনে মোচনং পুংসাং জলস্নানং দিনে দিনে।\nসকৃদ্ গীতামৃতস্নানং সংসারমলনাশনম্।।৩।।",
    bengali: "প্রতিদিন জলে স্নান করে মানুষ নিজেকে পরিচ্ছন্ন করতে পারে, কিন্তু কেউ যদি ভগবদ্গীতার গঙ্গাজলে একটি বারও স্নান করে, তা হলে তার জড় জীবনের মলিনতা একেবারেই বিনষ্ট হয়ে যায়।",
  },
  {
    sanskrit: "গীতা সুগীতা কর্তব্যা কিমন্যৈঃ শাস্ত্রবিস্তরৈঃ।\nযা স্বয়ং পদ্মনাভস্য মুখপদ্মাদ্ বিনিঃসৃতা।।৪।।",
    bengali: "যেহেতু ভগবদ্গীতার বাণী স্বয়ং পরম পুরুষোত্তম ভগবানের মুখনিঃসৃত বাণী, তাই এই গ্রন্থ পাঠ করলে আর অন্য কোনো বৈদিক সাহিত্য পড়বার দরকার হয় না। গভীর নিষ্ঠা ও আন্তরিকতার সঙ্গে নিয়মিত ভগবদ্গীতা পাঠ করলে মানুষ ভগবানের সান্নিধ্য লাভ করতে পারে।",
  },
  {
    sanskrit: "ভারতামৃতসর্বস্বং বিষ্ণুবক্ত্রাদ্ বিনিঃসৃতম্।\nগীতাগঙ্গোদকং পীত্বা পুনর্জন্ম ন বিদ্যতে।।৫।।",
    bengali: "গঙ্গাজল পান করলে অবধারিতভাবে মুক্তি পাওয়া যায়, আর যিনি ভগবদ্গীতার পুণ্য পীযূষ পান করেছেন, তাঁর কথা আর কি বলবার আছে? ভগবদ্গীতা হচ্ছে মহাভারতের অমৃতরস, যা আদিবিষ্ণু ভগবান শ্রীকৃষ্ণের মুখ থেকে নিঃসৃত। ভগবদ্গীতা পরম পুরুষোত্তম ভগবান শ্রীকৃষ্ণের মুখনিঃসৃত, তাই যিনি এই গীতামৃত পান করেছেন তাঁর পুনর্জন্ম হয় না।",
  },
  {
    sanskrit: "সর্বোপনিষদো গাবো দোগ্ধা গোপালনন্দনঃ।\nপার্থো বৎসঃ সুধীর্ভোক্তা দুগ্ধং গীতামৃতং মহৎ।।৬।।",
    bengali: "এই গীতোপনিষদ্ ভগবদ্গীতা সমস্ত উপনিষদের সারাতিসার এবং তা ঠিক একটি গাভীর মতো, আর রাখালবালকরূপে প্রসিদ্ধ ভগবান শ্রীকৃষ্ণই এই গাভীকে দোহন করেছেন। অর্জুন যেন গোবৎসের মতো এবং জ্ঞানীগুণী ও শুদ্ধচিত্ত ব্যক্তিরাই হলেন এই দুগ্ধের—অর্থাৎ মহান গীতামৃতের—ভোক্তা।",
  },
  {
    sanskrit: "একং শাস্ত্রং দেবকীপুত্রগীতম্\nএকো দেবো দেবকীপুত্র এব।\nএকো মন্ত্রস্তস্য নামানি যানি\nকর্মাপ্যেকং তস্য দেবস্য সেবা।।৭।।",
    bengali: "বর্তমান জগতে মানুষ আকুলভাবে আকাঙ্ক্ষা করছে একটি শাস্ত্রের, একক ভগবানের, একটি ধর্মের এবং একটি বৃত্তির। সারা পৃথিবীর মানুষের জন্য সেই একক শাস্ত্র হোক দেবকীপুত্র শ্রীকৃষ্ণের ভগবদ্গীতা; সমগ্র বিশ্বের একক ভগবান হোন দেবকীপুত্র শ্রীকৃষ্ণ; তাঁর পবিত্র নামই হোক একক মন্ত্র এবং তাঁর সেবাই হোক একমাত্র কর্তব্য কর্ম।",
  },
  {
    label: "মহা-মন্ত্র",
    sanskrit: "হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে।\nহরে রাম হরে রাম রাম রাম হরে হরে।।",
    bengali: "মহা-মন্ত্র কীর্তনের মাধ্যমে পরমেশ্বরের সেবা করাই প্রতিটি মানুষের একমাত্র পরম কর্ম ও ধর্ম।",
  },
];


export function MahatmyaShankar({ onHome, onBack, fadeIn }: Props) {
  return (
    <div className={`screen simple-content-screen ${fadeIn ? "visible" : ""}`}>
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left" /><span>ফিরুন</span>
        </button>
        <div className="topbar-title"><span className="topbar-om">ॐ</span> গীতা-মাহাত্ম্য</div>
        <button className="topbar-home-btn" style={{ marginLeft: "auto" }} onClick={onHome}>
          <i className="fa-solid fa-house" />
        </button>
      </div>

      <div className="sc-scroll">
        <div className="sc-inner">

          {/* ── Section 1: Shankaracharya ── */}
          <div className="sc-header">
            <div className="sc-om">ॐ</div>
            <h2 className="sc-heading">শ্রী শঙ্করাচার্য প্রণীত গীতা-মাহাত্ম্য</h2>
            <div className="sc-heading-under" />
            <p className="sc-subtext">সবচেয়ে বিখ্যাত ৭টি মূল শ্লোক ও অনুবাদ</p>
          </div>

          {SHANKAR_VERSES.map((v, i) => (
            <div key={`sh-${i}`} className="verse-card">
              <div className="verse-number-badge">
                <span className="verse-num-inner">
                  {v.label ?? `শ্লোক ${toBengaliNum(i + 1)}`}
                </span>
              </div>
              <div className="verse-sanskrit">{v.sanskrit}</div>
              <div className="verse-divider" />
              <div className="verse-bengali-label">অনুবাদ</div>
              <div className="verse-bengali">{v.bengali}</div>
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
