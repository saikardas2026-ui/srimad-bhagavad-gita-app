import { useState } from "react";
import { Chapter, toBengaliNum, getVerseContent } from "../data";

interface Props {
  chapter: Chapter;
  onHome:  () => void;
  onBack:  () => void;
  fadeIn:  boolean;
}

export function ChapterReader({ chapter, onHome, onBack, fadeIn }: Props) {
  const VERSES_PER_PAGE = 2;
  const totalPages = Math.ceil(chapter.verses / VERSES_PER_PAGE);

  const [page,        setPage]        = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const goNext = () => {
    if (showSummary) return;
    if (page >= totalPages - 1) {
      setShowSummary(true);
    } else {
      setPage((p) => p + 1);
      window.scrollTo?.({ top: 0 });
    }
  };

  const goPrev = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (page > 0) {
      setPage((p) => p - 1);
      window.scrollTo?.({ top: 0 });
    }
  };

  const verseStart = page * VERSES_PER_PAGE + 1;
  const verseEnd   = Math.min(verseStart + VERSES_PER_PAGE - 1, chapter.verses);

  const isFirstPage = page === 0 && !showSummary;
  const isLastItem  = showSummary;

  const pageLabel = showSummary
    ? "সারসংক্ষেপ"
    : verseStart === verseEnd
      ? `শ্লোক ${toBengaliNum(verseStart)} / ${toBengaliNum(chapter.verses)}`
      : `শ্লোক ${toBengaliNum(verseStart)} ও ${toBengaliNum(verseEnd)} / ${toBengaliNum(chapter.verses)}`;

  return (
    <div className={`screen reader-screen ${fadeIn ? "visible" : ""}`}>
      {/* Top bar */}
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" />
          <span>হোম</span>
        </button>
        <div className="reader-topbar-title">
          <span className="topbar-om">ॐ</span>
          <span>{chapter.ordinal} অধ্যায় — {chapter.name}</span>
        </div>
        <button className="topbar-back-btn" onClick={onBack}>
          <i className="fa-solid fa-list" />
          <span>তালিকা</span>
        </button>
      </div>

      {/* Page label */}
      <div className="reader-page-label">
        <span className="page-label-text">{pageLabel}</span>
      </div>

      {/* Scrollable content */}
      <div className="reader-content">
        {showSummary ? (
          <div className="summary-card">
            {chapter.num === 1 ? (
              <div className="summary-body-real">
                <ul className="summary-bullet-list">
                  <li className="summary-bullet">
                    <strong>🔸 কৌরবদের অন্তরের ভয়:</strong>
                    কুরুক্ষেত্রের ময়দানে পাণ্ডবদের দিব্য শঙ্খধ্বনিতে কৌরবদের মনে ভয় ধরে যায়। দুর্যোধন নিজের অধর্মের কারণে ভেতরে ভেতরে দুর্বল হয়ে পড়েন।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 অর্জুনের মোহ ও বিষাদ:</strong>
                    দুই পক্ষের মাঝে রথ রেখে অর্জুন যখন নিজের দাদু, গুরু ও ভাইদের শত্রুরূপে দেখেন, তখন তাঁর মন তীব্র মায়ায় জড়িয়ে যায়। শোকে তাঁর হাত থেকে গাণ্ডীব ধনু খসে পড়ে।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 যুদ্ধ ত্যাগের বাহানা:</strong>
                    অর্জুন যুক্তি দেন যে, স্বজনদের হত্যা করে রাজ্যসুখ ভোগ করার চেয়ে ভিক্ষা করা ভালো। কুলক্ষয় ও সমাজ ধ্বংসের ভয়ে তিনি যুদ্ধ না করার সিদ্ধান্ত নেন।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 মানসিক ভেঙে পড়া:</strong>
                    চরম মানসিক অবসাদ ও বিষণ্ণতায় ভেঙে পড়ে অর্জুন তাঁর তীর-ধনুক ত্যাগ করে রথের পেছনে বসে পড়েন।
                  </li>
                </ul>
                <div className="summary-lesson-box">
                  <span className="summary-lesson-icon">💡</span>
                  <div className="summary-lesson-text">
                    <strong>মূল শিক্ষা:</strong> জীবনের কঠিন পরিস্থিতিতে মানুষ যখন মোহগ্রস্ত হয়ে নিজের কর্তব্য ভুলে পালিয়ে বাঁচতে চায়—অর্জুনের এই অবস্থা ঠিক আমাদের সেই মানসিক দ্বন্দ্বের প্রতীক।
                  </div>
                </div>
                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার অর্জুনবিষাদযোগ নামক প্রথম অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 3 ? (
              <div className="summary-body-real">
                <ul className="summary-bullet-list">
                  <li className="summary-bullet">
                    <strong>🔸 কর্ম না করে থাকা অসম্ভব:</strong>
                    ভগবান শ্রীকৃষ্ণ বলেন, এই সংসারে কোনো মানুষই এক মুহূর্তের জন্যও কাজ না করে থাকতে পারে না। প্রকৃতির গুণের কারণে সবাই কোনো না কোনো কাজ করতে বাধ্য। তাই বাহ্যিকভাবে কাজ ত্যাগ করে মনে মনে বিষয়ের চিন্তা করাটা ভণ্ডামি বা মিথ্যাচার।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 লোকসংগ্রহ বা সামাজিক দায়িত্ব:</strong>
                    সমাজের শ্রেষ্ঠ বা আদর্শ ব্যক্তিরা যেভাবে চলেন, সাধারণ মানুষও তাঁদেরই অনুসরণ করে। তাই সমাজকে সঠিক পথ দেখানোর জন্য (লোকশিক্ষার উদ্দেশ্যে) আসক্তিহীন হয়ে নিজের কর্তব্য কর্ম করে যেতে হবে।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 স্বধর্ম পালনের গুরুত্ব:</strong>
                    ভালোভাবে করা অন্যের কর্তব্য বা ধর্মের চেয়ে, সামান্য ত্রুটি থাকলেও নিজের স্বভাবজাত কর্তব্য (স্বধর্ম) পালন করা অনেক ভালো। নিজের কর্তব্য করতে করতে মৃত্যু হওয়াও শ্রেয়, কিন্তু অন্যের পথ অন্ধভাবে অনুকরণ করা বিপজ্জনক।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 প্রধান শত্রু 'কাম' ও 'ক্রোধ':</strong>
                    মানুষ ইচ্ছা না করলেও মনের ভেতরে থাকা তীব্র ভোগবাসনা (কাম) ও রাগ (ক্রোধ) তাকে পাপে লিপ্ত করে। এই কাম মানুষের ইন্দ্রিয়, মন ও বুদ্ধিকে আশ্রয় করে আসল জ্ঞানকে ঢেকে রাখে। নিজের আত্মিক শক্তির দ্বারা এই শত্রুকে জয় করতে হবে।
                  </li>
                </ul>
                <div className="summary-lesson-box">
                  <span className="summary-lesson-icon">💡</span>
                  <div className="summary-lesson-text">
                    <strong>মূল শিক্ষা:</strong> সমাজ বা সংসার থেকে পালিয়ে বাঁচা ধর্ম নয়। ফলের আশা এবং অহংকার ত্যাগ করে নিজের দায়িত্ব ও কর্তব্য পালন করাই হলো আসল কর্মযোগ।
                  </div>
                </div>
                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার কর্মযোগ নামক তৃতীয় অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 2 ? (
              <div className="summary-body-real">
                <ul className="summary-bullet-list">
                  <li className="summary-bullet">
                    <strong>🔸 শ্রীকৃষ্ণের ধমক ও অর্জুনের আত্মসমর্পণ:</strong>
                    অর্জুনকে শোকে ভেঙে পড়তে দেখে শ্রীকৃষ্ণ প্রথমে তাকে কাপুরুষতা ত্যাগ করার ধমক দেন। অর্জুন যখন বুঝতে পারেন নিজের বুদ্ধিতে তিনি পথ পাচ্ছেন না, তখন তিনি নিজেকে শ্রীকৃষ্ণের 'শিষ্য' ঘোষণা করে তাঁর শরণাগত হন।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 আত্মার অমরত্ব (সাংখ্য জ্ঞান):</strong>
                    শ্রীকৃষ্ণ অর্জুনকে পরম জ্ঞান দিয়ে বলেন—দেহ নশ্বর কিন্তু ভেতরে থাকা আত্মা অমর, অবিনাশী। মানুষ যেমন পুরোনো পোশাক বদলে নতুন পোশাক পরে, আত্মাও তেমনি পুরোনো দেহ ত্যাগ করে নতুন দেহ ধারণ করে। তাই মৃত্যুর জন্য শোক করা বৃথা।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 কর্মযোগ (ফলের আশা ছাড়া কাজ):</strong>
                    ভগবান বলেন, ক্ষত্রিয় হিসেবে যুদ্ধ করা অর্জুনের স্বধর্ম। তবে কর্ম করার সময় ফলের আশা করা যাবে না (কর্মণ্যেবাধিকারস্তে মা ফলেষু কদাচন)। লাভ-ক্ষতি, জয়-পরাজয়কে সমান জ্ঞান করে কর্তব্য পালন করাই হলো আসল যোগ।
                  </li>
                  <li className="summary-bullet">
                    <strong>🔸 স্থিতপ্রজ্ঞ মানুষের লক্ষণ:</strong>
                    অর্জুনের প্রশ্নের জবাবে শ্রীকৃষ্ণ বলেন—যিনি সমস্ত কামনা-বাসনা ত্যাগ করে সুখে-দুঃখে, সুখ্যাতি-নিন্দায় অবিচলিত থাকেন এবং যাঁর ইন্দ্রিয়সমূহ সম্পূর্ণ নিজের বশে থাকে, তিনিই হলেন 'স্থিতপ্রজ্ঞ' বা স্থির বুদ্ধিসম্পন্ন মানুষ।
                  </li>
                </ul>
                <div className="summary-lesson-box">
                  <span className="summary-lesson-icon">💡</span>
                  <div className="summary-lesson-text">
                    <strong>মূল শিক্ষা:</strong> আসক্তি ও ফলের আশা ত্যাগ করে, মনকে সুখে-দুঃখে স্থির রেখে নিজের কর্তব্য কর্ম করে যাওয়াই হলো জীবনের আসল চাবিকাঠি।
                  </div>
                </div>
                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার সাংখ্য-যোগ নামক দ্বিতীয় অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 4 ? (
              <div className="summary-body-real">
                <div className="summary-section-title">চতুর্থ অধ্যায়: জ্ঞানযোগ (সারসংক্ষেপ)</div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 পরম উপদেশের পরম্পরা ও অবতার তত্ত্ব:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণ জানান, এই পরম জ্ঞান তিনি সৃষ্টির শুরুতে সূর্যদেবকে দিয়েছিলেন। সময়ের সাথে তা হারিয়ে যাওয়ায় প্রিয় বন্ধু ও ভক্ত অর্জুনকে তিনি আবার তা বললেন। ভগবান তাঁর অবতার রহস্য উন্মোচন করে বলেন — যখনই ধর্মের গ্লানি হয়, তখনই সাধুদের রক্ষা ও পাপীদের বিনাশ করতে তিনি যুগে যুগে আবির্ভূত হন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 কর্ম ও অকর্মের সূক্ষ্ম পার্থক্য:</span>
                  <span className="summary-item-desc">কোনটি কাজ (কর্ম) আর কোনটি অকাজ (অকর্ম) — তা অনেক জ্ঞানী ব্যক্তিও ভুল করেন। যিনি ফলের আশা ছেড়ে কাজ করেন, তিনি সব কাজ করেও আসলে কর্মবন্ধনে জড়ান না। আর যিনি কাজ ছেড়ে অলস বসে থাকেন, তিনিও এক ধরনের পাপ বা অকর্মই করছেন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 বিভিন্ন প্রকার যজ্ঞ ও গুরুসেবা:</span>
                  <span className="summary-item-desc">মানুষ তাঁর স্বভাব অনুযায়ী দ্রব্যদান, তপস্যা বা প্রাণায়ামের মাধ্যমে নানা ধরনের যজ্ঞ করে থাকে। তবে সবকিছুর চেয়ে 'জ্ঞানযজ্ঞ' হলো শ্রেষ্ঠ। এই পরম জ্ঞান লাভ করতে হলে তত্ত্বজ্ঞানী গুরুর কাছে বিনম্রভাবে গিয়ে সেবা ও প্রশ্নের মাধ্যমে তা শিখতে হয়।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 জ্ঞানাগ্নির শক্তি ও সংশয় নাশ:</span>
                  <span className="summary-item-desc">জ্ঞান হলো এক পবিত্র নৌকার মতো, যা দিয়ে একজন বড় পাপীও পাপের সমুদ্র পার হতে পারে। জ্ঞানরূপ আগুন মানুষের সমস্ত কর্মের ফলকে পুড়িয়ে ছাই করে দেয়। তাই মনের ভেতরের সব সন্দেহ বা সংশয়কে জ্ঞানের তলোয়ার দিয়ে কেটে নিষ্কাম কর্মে যুক্ত হতে হবে।</span>
                </div>

                <div className="summary-blockquote">
                  <strong>💡 মূল শিক্ষা:</strong> পরম জ্ঞানই মানুষের মন থেকে সব সন্দেহ দূর করে। আর সেই তত্ত্বজ্ঞান মনে রেখে ফলের আশা ছাড়া কাজ করলে কোনো কাজই মানুষকে সংসারে বেঁধে রাখতে পারে না।
                </div>

                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার জ্ঞানযোগ নামক চতুর্থ অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 5 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 সন্ন্যাস বনাম নিষ্কাম কর্মযোগ:</span>
                  <span className="summary-item-desc">অর্জুনের প্রশ্নের উত্তরে শ্রীকৃষ্ণ পরিষ্কার করে দেন যে — সব কাজ ছেড়ে দেওয়া (সন্ন্যাস) এবং ফলের আশা ছাড়া কাজ করা (কর্মযোগ) দুটি পথই মুক্তি দেয়। তবে সাধারণ মানুষের জন্য কাজ ছেড়ে দেওয়ার চেয়ে সংসারে থেকে নিষ্কামভাবে দায়িত্ব পালন করা অনেক সহজ ও শ্রেষ্ঠ।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 পণ্ডিতদের সমদৃষ্টি বা সমভাব:</span>
                  <span className="summary-item-desc">যাঁরা প্রকৃত জ্ঞানী বা পণ্ডিত, তাঁরা বিদ্যা-বিনয়সম্পন্ন ব্রাহ্মণ, গাভী, হাতি, কুকুর এমনকি চণ্ডালের মধ্যেও একই পরমাত্মার রূপ দর্শন করেন। সুখ-দুঃখ বা প্রিয়-অপ্রিয় জিনিসে চঞ্চল না হয়ে মনকে সমতায় রাখাই হলো ব্রহ্মে স্থিত হওয়ার লক্ষণ।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ক্ষণস্থায়ী ভোগ ও কাম-ক্রোধের বেগ:</span>
                  <span className="summary-item-desc">ইন্দ্রিয় ও জাগতিক বিষয়ের সংযোগ থেকে যে সুখ বা ভোগ আসে, তা ক্ষণস্থায়ী এবং শেষ পর্যন্ত দুঃখের কারণ হয়। তাই বুদ্ধিমান মানুষ এতে মগ্ন হন না। মৃত্যুর আগে যিনি মনের ভেতরের কাম ও ক্রোধের তীব্র উত্তেজনা বা বেগকে সহ্য ও দমন করতে পারেন, তিনিই প্রকৃত সুখী।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 পরম শান্তি ও মুক্তির চাবিকাঠি:</span>
                  <span className="summary-item-desc">ভগবানকে সমস্ত যজ্ঞ ও তপস্যার পরম ভোক্তা, মহাবিশ্বের মালিক এবং জগতের প্রতিটি জীবের অকৃত্রিম বন্ধু (সুহৃদ) বলে যিনি মনে-প্রাণে বিশ্বাস করেন, সমস্ত জাগতিক কোলাহলের মাঝেও তিনি অন্তরের পরম শান্তি লাভ করেন।</span>
                </div>

                <div className="summary-blockquote">
                  <strong>💡 মূল শিক্ষা:</strong> পদ্মপাতা যেমন জলে থেকেও জলে ভেজে না, ঠিক তেমনি সমস্ত কর্মের ফল ঈশ্বরে অর্পণ করে আসক্তিহীন হয়ে কাজ করলে কোনো পাপ বা পুণ্য মানুষকে স্পর্শ করতে পারে না।
                </div>

                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার কর্মসন্ন্যাসযোগ নামক পঞ্চম অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 9 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 রাজবিদ্যা ও রাজগুহ্য জ্ঞান:</span>
                  <span className="summary-item-desc">এই অধ্যায়ে শ্রীকৃষ্ণ অর্জুনকে সবচেয়ে গোপনীয় ও পরম পবিত্র আধ্যাত্মিক জ্ঞান প্রদান করেছেন। এই জ্ঞান সব বিদ্যার রাজা এবং এটি উপলব্ধি করা অত্যন্ত সহজ। তবে ঈশ্বরের এই পরম ধর্মে যাদের শ্রদ্ধা নেই, তারা জন্ম-মৃত্যুর চক্র থেকে মুক্তি পায় না।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 সৃষ্টির পেছনে ঈশ্বরের মায়াশক্তি:</span>
                  <span className="summary-item-desc">সমগ্র বিশ্ব চরাচর ঈশ্বরের অদৃশ্য বা অপ্রকাশিত রূপের দ্বারা ব্যাপ্ত হয়ে আছে। মহান বায়ু যেমন সর্বদা আকাশে অবস্থান করেও আকাশ থেকে আলাদা, তেমনি সমস্ত জীব ঈশ্বরে অবস্থান করেও তাঁর সাথে লিপ্ত নয়। ঈশ্বরেরই পরিচালনায় তাঁর প্রকৃতি (মায়া) এই জগৎ বারবার সৃষ্টি ও ধ্বংস করে।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অন্য দেবতা ও পরমেশ্বরের পূজা:</span>
                  <span className="summary-item-desc">জাগতিক কামনার বশে যারা অন্য দেব-দেবীর পূজা করেন, তাদের সেই পূজা আসলে অবিধিপূর্বক পরমেশ্বরেরই পূজা হয়; কারণ সব যজ্ঞের একমাত্র ভোক্তা ও ফলদাতা হলেন তিনি নিজে। তবে দেবপূজকগণ দেবলোকে যান, আর ঈশ্বরের একনিষ্ঠ ভক্তগণ সরাসরি পরম গতিতে ভগবানকেই লাভ করেন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অনন্য ভক্তি ও শরণাগতি:</span>
                  <span className="summary-item-desc">ঈশ্বর কোনো দামি রাজকীয় উপহার চান না; অত্যন্ত ভক্তিভরে সামান্য একটি পাতা, ফুল, ফল বা একটু জল অর্পণ করলেই তিনি তা আনন্দের সাথে গ্রহণ করেন। এমনকি কোনো মহাপাপী মানুষও যদি অন্য সব ছেড়ে একনিষ্ঠভাবে ভগবানের শরণাপন্ন হন, তবে তিনিও সাধু হয়ে যান এবং পরম শান্তি লাভ করেন।</span>
                </div>

                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: "ন মে ভক্তঃ প্রণশ্যতি" — অর্থাৎ ভগবানের ভক্তের কখনো বিনাশ বা অধঃপতন হয় না। নিজের মন, বুদ্ধি ও সব কর্ম ঈশ্বরের উদ্দেশ্যে অর্পণ করে তাঁর অনন্য ভক্ত হওয়াই হলো এই অধ্যায়ের মূল শিক্ষা।
                </blockquote>

                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার রাজবিদ্যারাজগুহ্যযোগ নামক নবম অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 10 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 পরমেশ্বরের আদিহীন স্বরূপ:</span>
                  <span className="summary-item-desc">এই অধ্যায়ের শুরুতে শ্রীকৃষ্ণ অর্জুনকে জানান যে, দেবতা বা মহর্ষিগণ কেউই তাঁর আদি বা প্রভাবের কথা জানেন না, কারণ তিনি সবার আদি উৎস। জগতের বুদ্ধি, জ্ঞান, সুখ-দুঃখ, ভয়-অভয় ইত্যাদি সমস্ত মানসিক ভাব ভগবানের থেকেই উৎপন্ন হয়।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অনন্য ভক্তির ফল:</span>
                  <span className="summary-item-desc">যাঁরা ঈশ্বরকে সর্বশক্তির উৎস জেনে অনন্য মনে তাঁর কথা কীর্তন ও আলোচনা করেন, ভগবান নিজ কৃপায় তাঁদের অন্তরে আত্মজ্ঞানরূপ প্রদীপ জ্বালিয়ে অজ্ঞানের সব অন্ধকার দূর করে দেন এবং তাঁদের পরম বুদ্ধিযোগ দান করেন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অর্জুনের স্তুতি ও বিনীত প্রার্থনা:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণের মহিমা শুনে অর্জুন তাঁকে পরম ব্রহ্ম ও পরম ধাম বলে স্বীকার করেন। অর্জুন বিনীতভাবে অনুরোধ করেন যে, ভগবান যেন তাঁর সেই সমস্ত দিব্য বিভূতি বা ঐশ্বর্যের কথা বিস্তারিতভাবে বলেন, যার দ্বারা তিনি এই সমগ্র জগৎ ব্যাপ্ত করে আছেন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ভগবানের অনন্ত বিভূতি বা ঐশ্বর্য:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণ জানান যে তাঁর ঐশ্বর্যের কোনো শেষ নেই, তাই তিনি প্রধান কিছু বিভূতির কথা বলেন। তিনি সমস্ত জীবের অন্তরে থাকা পরমাত্মা। তিনি আদিত্যদের মধ্যে বিষ্ণু, জ্যোতিষ্কদের মধ্যে সূর্য, রুদ্রদের মধ্যে শঙ্কর, পর্বতদের মধ্যে সুমেরু এবং বৃক্ষদের মধ্যে অশ্বত্থ। জগতের সমস্ত সুন্দর, বিজয়ী ও শক্তিশালী বস্তুই তাঁর তেজের এক একটি কণা মাত্র।</span>
                </div>

                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: সমগ্র ব্রহ্মাণ্ডে যা কিছু পরম ঐশ্বর্যশালী, সুন্দর এবং শক্তিশালী — সে সবই ভগবানের বিভূতি বা তেজের একটি সামান্য অংশ মাত্র। ঈশ্বর তাঁর একটিমাত্র অংশ দ্বারা এই সমগ্র জগৎকে ধারণ করে আছেন।
                </blockquote>

                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার বিভূতিযোগ নামক দশম অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 11 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 দিব্যচক্ষু লাভ ও বিশ্বরূপ দর্শন:</span>
                  <span className="summary-item-desc">এই অধ্যায়ে অর্জুনের বিশেষ প্রার্থনায় শ্রীকৃষ্ণ তাঁকে অলৌকিক 'দিব্যচক্ষু' দান করেন এবং নিজের পরম ঐশ্বর্যময় বিশ্বরূপ প্রদর্শন করেন। সেই রূপে অর্জুন একই সাথে হাজার সূর্যের তেজ, অসংখ্য মুখ, চোখ ও অস্ত্র এবং সমগ্র মহাবিশ্বকে ভগবানের এক শরীরে অবলোকন করেন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 মহাকাল রূপে কৌরবদের বিনাশ:</span>
                  <span className="summary-item-desc">অর্জুন দেখতে পান যে ভীষ্ম, দ্রোণ, কর্ণ ও কৌরব রাজারা তীব্র বেগে শ্রীকৃষ্ণের প্রলয়ঙ্কারী মুখের আগুনে পুড়ে ধ্বংস হয়ে যাচ্ছেন। ভগবান জানান যে তিনি লোকক্ষয়কারী 'মহাকাল'; অর্জুন যুদ্ধ না করলেও শত্রুপক্ষের কেউ বাঁচবে না, তাই অর্জুনকে কেবল নিমিত্তমাত্র হয়ে যুদ্ধ করার নির্দেশ দেন।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অর্জুনের ক্ষমা প্রার্থনা ও শান্ত রূপের দর্শন:</span>
                  <span className="summary-item-desc">ভগবানের এই ভীষণ উগ্র রূপ দেখে অর্জুন ভীত হয়ে পড়েন। অতীতে কৃষ্ণকে সাধারণ বন্ধু ভেবে করা সব ভুলের জন্য তিনি বিনীতভাবে ক্ষমা চান। অর্জুনের অনুরোধে শ্রীকৃষ্ণ তাঁর উগ্র রূপ সংবরণ করে পুনরায় তাঁর মনোহর চতুর্ভুজ এবং শান্ত দ্বিভুজ মানুষী রূপ ধারণ করে অর্জুনকে আশ্বস্ত করেন।</span>
                </div>

                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: কোনো বেদ পাঠ, তপস্যা বা যজ্ঞের মাধ্যমে ঈশ্বরের এই পরম স্বরূপ দেখা সম্ভব নয়। একমাত্র 'অনন্য ভক্তি' বা সম্পূর্ণ অহংকারহীন একনিষ্ঠ শরণাগতির মাধ্যমেই কেবল ভগবানকে লাভ করা সম্ভব।
                </blockquote>

                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার বিশ্বরূপদর্শনযোগ নামক একাদশ অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 8 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ব্রহ্ম, অধ্যাত্ম ও কর্মের সংজ্ঞা:</span>
                  <span className="summary-item-desc">অর্জুনের প্রশ্নের উত্তরে শ্রীকৃষ্ণ পরিষ্কার করেন যে — যাঁর কোনো বিনাশ নেই তিনিই 'ব্রহ্ম'। জীবের অন্তরের দিব্য স্বভাবই হলো 'অধ্যাত্ম'। আর সৃষ্টি ও তার কল্যাণের জন্য যে ত্যাগ বা যজ্ঞ, তাকেই বলা হয় 'কর্ম'।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অন্তিমকালের চিন্তা ও গতি:</span>
                  <span className="summary-item-desc">মানুষ সারা জীবন যা চিন্তা করে, মৃত্যুর সময়েও তার মনে সেই ভাবটিই প্রধান হয়ে ওঠে। আর শেষ মুহূর্তে যে চিন্তা করতে করতে মানুষ দেহত্যাগ করে, পরজন্মে সে সেই গতিই লাভ করে। তাই মৃত্যুর সময়ে যিনি একমাত্র ভগবানকে স্মরণ করেন, তিনি সরাসরি মুক্তি বা পরম ধাম লাভ করেন।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ওংকার জপ ও মন নিয়ন্ত্রণ:</span>
                  <span className="summary-item-desc">মৃত্যুর সময়ে পরম গতি পাওয়ার জন্য যোগীগণ সমস্ত ইন্দ্রিয় সংযত করে এবং প্রাণবায়ুকে মস্তকে স্থির করে ব্রহ্মের প্রতীক একাক্ষর 'ওঁ' (ওংকার) ধ্বনি উচ্চারণ করতে করতে দেহত্যাগ করেন। সর্বদা ঈশ্বরে মগ্ন থাকা মানুষের জন্য তাঁকে লাভ করা অত্যন্ত সহজ।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 দুই শাশ্বত গতি (শুক্ল ও কৃষ্ণ):</span>
                  <span className="summary-item-desc">জগতে দেহত্যাগের দুটি চিরন্তন মার্গ রয়েছে। একটি হলো প্রকাশময় বা 'শুক্ল গতি' (উত্তরায়ণ), যার মাধ্যমে দেহত্যাগ করলে জীব চিরতরে মুক্তি পায়। অন্যটি হলো অন্ধকারময় বা 'কৃষ্ণ গতি' (দক্ষিণায়ণ), যার মাধ্যমে সাকাম কর্মীরা পুণ্যফল ভোগ করে আবার পৃথিবীতে ফিরে আসেন।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: জীবনকে এমনভাবে গড়ে তুলতে হবে যাতে সব কাজের মাঝেও মন ঈশ্বরের চরণে যুক্ত থাকে। সর্বদা ভগবানের নাম স্মরণ রাখলে মৃত্যুর সময়েও মন চঞ্চল হয় না এবং খুব সহজেই পরম ধাম লাভ করা যায়।
                </blockquote>
                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার অক্ষরব্রহ্মযোগ নামক অষ্টম অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 7 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অপরা ও পরা প্রকৃতি:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণ অর্জুনকে তাঁর দুই প্রকার শক্তির কথা জানান। মাটি, জল, আগুন, বাতাস, আকাশ, মন, বুদ্ধি ও অহংকার — এই আটটি হলো তাঁর জড় বা 'অপরা প্রকৃতি'। আর এর চেয়ে শ্রেষ্ঠ তাঁর আরেকটি চেতন রূপ হলো 'পরা প্রকৃতি', যা জীবাত্মা রূপে পুরো বিশ্বকে সচল ও ধারণ করে রেখেছে।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 দুস্তর মায়াজাল ও মুক্তি:</span>
                  <span className="summary-item-desc">ঈশ্বরের এই ত্রিগুণময়ী (সত্ত্ব, রজ, তম) মায়াকে অতিক্রম করা মানুষের পক্ষে অত্যন্ত কঠিন। এই মায়ার মোহে পড়েই মানুষ আসল ঈশ্বরকে চিনতে ভুল করে। তবে যারা পরম নিষ্ঠা নিয়ে একমাত্র ভগবানের শরণাপন্ন হন, তাঁরা খুব সহজেই এই মায়াজাল পার হয়ে যান।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 চার প্রকার ভক্তের স্বভাব:</span>
                  <span className="summary-item-desc">জগতে চার প্রকার পুণ্যবান মানুষ ভগবানের ভজনা করেন — আর্ত (বিপদে পড়া মানুষ), জিজ্ঞাসু (তত্ত্ব জানতে ইচ্ছুক), অর্থার্থী (সুখ-সম্পদপ্রত্যাশী) এবং জ্ঞানী। এদের মধ্যে নিষ্কাম 'জ্ঞানী' ভক্তই শ্রেষ্ঠ, কারণ তিনি ফলের আশা না করে ঈশ্বরকে নিজের আত্মা ভেবে ভালোবাসেন।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অন্য দেব-দেবী ও একাত্মতা:</span>
                  <span className="summary-item-desc">জাগতিক কামনার বশে যারা অন্য দেব-দেবীর পূজা করেন, তাঁরা সাময়িক বা ক্ষণস্থায়ী ফল পান। কিন্তু আসলে সব দেবতার শক্তির উৎস ও ফলদাতা হলেন পরমেশ্বর নিজে। সবশেষে বহু জন্মের পুণ্যফলে মানুষ বুঝতে পারে যে — সবকিছুর মূলেই পরমেশ্বর (বাসুদেব) বিরাজ করছেন।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: এই মহাবিশ্বের সবকিছুই সুতোয় মণির মতো ঈশ্বরের সাথে গেঁথে আছে। মায়ার ওপারে গিয়ে সবকিছুতে পরমেশ্বরের রূপ দর্শন করা এবং মৃত্যুর সময়েও তাঁকে স্মরণ করাই হলো প্রকৃত জ্ঞান।
                </blockquote>
                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার জ্ঞানবিজ্ঞানযোগ নামক সপ্তম অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 6 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 মনকে বন্ধুর মতো ব্যবহার:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণ বলেন, মনই মানুষের বন্ধু আবার মনই শত্রু। যিনি মনকে জয় করেছেন মন তাঁর বন্ধু, আর যে মনের দাসে পরিণত হয়েছে মন তার সবচেয়ে বড় শত্রু। ধ্যানের মাধ্যমে মনকে শান্ত করতে হবে।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ধ্যানের সঠিক পদ্ধতি:</span>
                  <span className="summary-item-desc">ধ্যান করার জন্য নির্জন ও পবিত্র স্থান নির্বাচন করতে হবে। আসন খুব উঁচু বা নিচু হবে না। শরীর ও ঘাড় সোজা রেখে স্থির হয়ে বসতে হবে। পরিমিত আহার, পরিমিত ঘুম এবং নিয়মিত অভ্যাসের মাধ্যমেই যোগ সিদ্ধ হয়।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 মন নিয়ন্ত্রণের উপায়:</span>
                  <span className="summary-item-desc">অর্জুন যখন বললেন মন বাতাসের মতো চঞ্চল, তখন কৃষ্ণ সমাধান দিলেন — 'অভ্যাস' এবং 'বৈরাগ্যের' (আসক্তিহীনতা) দ্বারা এই চঞ্চল মনকেও বশ করা সম্ভব।</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-heading">🔸 যোগভ্রষ্টের গতি:</span>
                  <span className="summary-item-desc">যদি কেউ যোগ শুরু করে সফল হতে না পারে বা মারা যায়, তবে তার সৎ কাজ কখনো বৃথা যায় না। সে পুনরায় পবিত্র বা জ্ঞানী পরিবারে জন্ম নিয়ে আগের জন্মের সংস্কার থেকে আবার সাধনা শুরু করার সুযোগ পায়।</span>
                </div>

                <div className="summary-blockquote">
                  <strong>💡 মূল শিক্ষা:</strong> নিজেকে চিনে মনের ওপর নিয়ন্ত্রণ আনাই হলো প্রকৃত শান্তি। সবকিছুর মাঝে ঈশ্বরকে দেখা এবং ঈশ্বরের মাঝে নিজেকে খুঁজে পাওয়াই যোগের আসল লক্ষ্য।
                </div>

                <div className="summary-colophon">
                  ইতি শ্রীমদ্ভগবদ্গীতার আত্মসংযমযোগ নামক ষষ্ঠ অধ্যায় সমাপ্ত।
                </div>
              </div>
            ) : chapter.num === 12 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 সাকার ও নিরাকার উপাসনার পার্থক্য:</span>
                  <span className="summary-item-desc">এই অধ্যায়ের শুরুতে অর্জুনের প্রশ্নের জবাবে শ্রীকৃষ্ণ পরিষ্কার করেন যে সাকার ও নিরাকার দুইভাবেই ঈশ্বরকে পাওয়া যায়। তবে নিরাকার ব্রহ্মের সাধনা দেহধারী মানুষের জন্য অত্যন্ত কঠিন ও কষ্টদায়ক। তাই ঈশ্বরের সাকার রূপের অনন্য ভক্তিই সবচেয়ে সহজ ও শ্রেষ্ঠ পথ।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ভক্তির স্তরভেদ ও পরম শান্তি:</span>
                  <span className="summary-item-desc">যদি কেউ সরাসরি ভগবানে মন স্থির করতে না পারেন, তবে তাঁর জন্য ধাপে ধাপে পথ বাতলে দেওয়া হয়েছে—প্রথমে অভ্যাসযোগ, তাতে ব্যর্থ হলে ভগবানের জন্য কর্ম করা, আর তাও না পারলে সমস্ত কর্মের ফলের আশা ত্যাগ করা। কারণ কর্মফল ত্যাগের মাধ্যমেই পরম শান্তি আসে।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ভগবানের প্রিয় ভক্তের গুণাবলী:</span>
                  <span className="summary-item-desc">ভগবান শ্রীকৃষ্ণ তাঁর প্রিয় ভক্তের লক্ষণগুলো বর্ণনা করেছেন। যিনি অহংকারহীন, দয়ালু, সুখ-দুঃখে সমান, মান-অপমানে অবিচল, যা পান তাতেই সন্তুষ্ট এবং যাঁর দ্বারা কোনো জীব কষ্ট পায় না — তিনিই ভগবানের সবচেয়ে প্রিয় ভক্ত।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: সমস্ত জাগতিক আসক্তি এবং কর্মের ফলের আশা ত্যাগ করে, পরম শ্রদ্ধার সাথে ঈশ্বরের চরণে নিজেকে সমর্পণ করাই হলো ভক্তিযোগের মূল শিক্ষা।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার ভক্তিযোগ নামক দ্বাদশ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : chapter.num === 13 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 প্রকৃতি ও পুরুষের তত্ত্ব:</span>
                  <span className="summary-item-desc">এই অংশে শ্রীকৃষ্ণ জানান যে প্রকৃতি ও পুরুষ উভয়ই অনাদি। আমাদের জড় শরীর এবং ইন্দ্রিয়ের সমস্ত কাজ প্রকৃতি থেকে উৎপন্ন গুণের দ্বারা ঘটে। আর আত্মা বা পুরুষ কেবল সেই সুখ-দুঃখের সাক্ষী ও ভোক্তা হয়। প্রকৃতির গুণের আসক্তির কারণেই জীবকে বারবার সংসারে জন্ম নিতে হয়।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 সর্বত্র ঈশ্বরের দর্শন:</span>
                  <span className="summary-item-desc">যিনি এই নশ্বর শরীরের ভেতরে অবিনশ্বর আত্মাকে এবং সমস্ত জীবের অন্তরে সমভাবে বিরাজমান পরমেশ্বরকে দেখতে পান, তিনিই প্রকৃত জ্ঞানী। আত্মা আকাশের মতো সূক্ষ্ম ও আসক্তিহীন, তাই সে শরীরে থাকলেও কোনো পাপ-পুণ্যের কর্মে লিপ্ত হয় না।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 জ্ঞানচক্ষুর দ্বারা মুক্তি:</span>
                  <span className="summary-item-desc">একটি সূর্য যেমন পুরো জগৎকে আলো দেয়, তেমনি আত্মা একা পুরো শরীরকে চেতনা দিয়ে সচল রাখে। যাঁরা জড় শরীর এবং চেতন আত্মার এই পার্থক্য জ্ঞানচক্ষু দিয়ে উপলব্ধি করেন, তাঁরা প্রকৃতির মায়া থেকে মুক্ত হয়ে পরম গতি লাভ করেন।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: আমাদের এই নশ্বর শরীর এবং অবিনশ্বর আত্মার পার্থক্যকে চিনে, প্রকৃতির গুণের আসক্তি থেকে মুক্ত হয়ে সর্বত্র এক পরমেশ্বরের উপস্থিতি অনুভব করাই মোক্ষ লাভের একমাত্র উপায়।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার ক্ষেত্র-ক্ষেত্রজ্ঞবিভাগযোগ নামক ত্রয়োদশ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : chapter.num === 14 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 প্রকৃতির তিন গুণের বন্ধন ও গতি:</span>
                  <span className="summary-item-desc">এই অধ্যায়ে শ্রীকৃষ্ণ সত্ত্ব, রজ ও তম গুণের আসল রহস্য পরিষ্কার করেছেন। সত্ত্বগুণ মানুষকে সুখ ও জ্ঞানে, রজগুণ লোভ ও কর্মের ব্যস্ততায় এবং তমোগুণ অলসতা ও মোহাচ্ছন্নতায় আবদ্ধ করে। মৃত্যুর সময় কোন গুণ প্রবল তার ওপর নির্ভর করে জীব উচ্চলোক, মানবলোক বা অধোলোকে জন্ম নেয়।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 গুণাতীত মানুষের লক্ষণ:</span>
                  <span className="summary-item-desc">অর্জুনের প্রশ্নের উত্তরে ভগবান জানান যে, যিনি প্রকৃতির এই তিন গুণের খেলায় বিচলিত হন না, সুখ-দুঃখ, মান-অপমান, শত্রু-মিত্র এবং সোনা ও মাটিতে সমান ভাব রাখেন, তিনিই গুণাতীত। তিনি উদাসীনের মতো থাকেন কিন্তু নিষ্ক্রিয় নন — তিনি আত্মস্বরূপে সর্বদা অটল।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 মুক্তির একমাত্র সহজ পথ:</span>
                  <span className="summary-item-desc">প্রকৃতির এই তিন মায়াবী গুণকে নিজের শক্তিতে পার হওয়া অসম্ভব। কিন্তু যিনি সমস্ত অহংকার ভুলে একনিষ্ঠ ও অনন্য ভক্তিযোগের মাধ্যমে পরমেশ্বর শ্রীকৃষ্ণের শরণাগত হন, তিনি খুব সহজেই এই তিন গুণ অতিক্রম করে ব্রহ্মভাব বা পরম মুক্তি লাভ করেন।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: প্রকৃতির তিন গুণের মায়া কাটিয়ে গুণাতীত হওয়াই মানব জীবনের পরম লক্ষ্য।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার গুণত্রয়বিভাগযোগ নামক চতুর্দশ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : chapter.num === 15 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 সংসার বৃক্ষ ও বৈরাগ্যের কুঠার:</span>
                  <span className="summary-item-desc">এই অধ্যায়ে শ্রীকৃষ্ণ জড় সংসারকে একটি উল্টো অশ্বত্থ গাছের সাথে তুলনা করেছেন। মানুষ কাম-বাসনার শিকড়ে এই গাছে আটকে থাকে। তীব্র বৈরাগ্য ও আসক্তিহীনতার কুঠার দিয়ে এই মায়ার গাছ কেটে সেই পরম পদের সন্ধান করতে হবে, যেখান থেকে আর কখনো ফিরে আসতে হয় না।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ক্ষর, অক্ষর ও পুরুষোত্তম রহস্য:</span>
                  <span className="summary-item-desc">ভগবান জানান যে নশ্বর শরীর হলো 'ক্ষর' এবং অবিনশ্বর আত্মা হলো 'অক্ষর'। কিন্তু তিনি নিজে এই ক্ষর ও অক্ষর—উভয়ের অতীত এবং পরম অধিপতি, তাই তিনি 'পুরুষোত্তম' বা শ্রেষ্ঠ পুরুষ। ঈশ্বরকে এই পুরুষোত্তম হিসেবে জানলেই মানুষ সর্বজ্ঞ হয় এবং সর্বতোভাবে তাঁর ভজনা করে।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 অন্তর্যামী ও সর্বব্যাপী ঈশ্বর:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণই সূর্যের তেজ, চন্দ্রের শীতলতা এবং মাটির ধারণ শক্তি। তিনি সমস্ত জীবের অন্তরে জঠরাগ্নি রূপে খাদ্য হজম করেন এবং হৃদয়স্থ পরমাত্মা রূপে স্মৃতি ও জ্ঞান দান করেন। তিনিই বেদের আদি উৎস এবং বেদান্তের একমাত্র লক্ষ্য।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: জড় জগতের মোহ ত্যাগ করে শ্রীকৃষ্ণই পরম পুরুষোত্তম—এই ধ্রুব সত্য উপলব্ধি করে তাঁর চরণে শরণাগত হওয়াই মানব জীবনের পরম সার্থকতা।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার পুরুষোত্তমযোগ নামক পঞ্চদশ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : chapter.num === 16 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 দৈবী ও আসুরী সম্পদের পার্থক্য:</span>
                  <span className="summary-item-desc">এই অধ্যায়ে শ্রীকৃষ্ণ মানুষের ভেতরের ভালো ও মন্দ স্বভাবের পরিচয় দিয়েছেন। ভয়হীনতা, সত্য, দয়া ও অহংকারহীনতার মতো দৈবী গুণগুলো মানুষকে মুক্তির দিকে নিয়ে যায়। অন্যদিকে দম্ভ, অহংকার ও নিষ্ঠুরতার মতো আসুরী গুণগুলো মানুষকে বন্ধন ও পতনের দিকে টেনে নামায়।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 আসুরী মানুষের পতন ও পরিণতি:</span>
                  <span className="summary-item-desc">আসুরী স্বভাবের মানুষেরা ঈশ্বরকে মানে না এবং মনে করে কাম-ভোগই জীবনের একমাত্র লক্ষ্য। তারা অন্যায়ভাবে অর্থ কামায় এবং লোক দেখানোর জন্য ভন্ডামি করে। এইরকম হিংস্র ও অহংকারী মানুষেরা নিজেদের ও অন্যের মধ্যে ঈশ্বরকে দ্বেষ করে, ফলে তারা জন্ম জন্ম ধরে আসুরী যোনিতে পতিত হয়।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 নরকের তিন শত্রু ও শাস্ত্রের গুরুত্ব:</span>
                  <span className="summary-item-desc">কাম, ক্রোধ ও লোভ হলো নরকের তিনটি প্রধান প্রবেশদ্বার, যা মানুষের বিবেককে ধ্বংস করে। এই তিনটিকে ত্যাগ করে শাস্ত্রের নিয়ম মেনে জীবন পরিচালনা করলে মানুষ শান্তি ও পরম মোক্ষ লাভ করতে পারে।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: কাম, ক্রোধ ও লোভ ত্যাগ করে শাস্ত্রসম্মত পবিত্র জীবন যাপন করাই মুক্তির একমাত্র পথ।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার দৈবাসুরসম্পদ্বিভাগযোগ নামক ষোড়শ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : chapter.num === 17 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 তিন গুণের শ্রদ্ধা, আহার ও যজ্ঞ:</span>
                  <span className="summary-item-desc">এই অধ্যায়ে শ্রীকৃষ্ণ পরিষ্কার করেছেন যে মানুষের স্বভাবের ভেতরের গুণ অনুযায়ী তার সবকিছু নিয়ন্ত্রিত হয়। সাত্ত্বিক মানুষেরা দেবতাদের পূজা করে এবং আয়ু ও স্বাস্থ্যবর্ধক রসালো খাবার খায়, রাজসিকেরা যক্ষ-রাক্ষসের পূজা করে ও ঝাল-তীব্র খাবার পছন্দ করে, আর তামসিকেরা ভূত-প্রেতের পূজা করে এবং বাসি-পচা খাবার খায়। একইভাবে সাত্ত্বিক যজ্ঞ ফলের আশা ছাড়া, রাজসিক যজ্ঞ লোক দেখানোর জন্য এবং তামসিক যজ্ঞ শ্রদ্ধাহীন ও বিধিহীন।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 তপস্যা ও দানের স্তরভেদ:</span>
                  <span className="summary-item-desc">শ্রীকৃষ্ণ শরীর, বাণী ও মনের তিন প্রকার তপস্যার কথা বলেছেন। দেবতা-গুরু পূজা ও অহিংসা শারীরিক তপস্যা, সত্য ও প্রিয় কথা বলা বাণীর তপস্যা এবং মনকে শান্ত রাখা মনের তপস্যা। ফলের আশা ছাড়া পবিত্র মনে যোগ্য পাত্রে দান করা হলো সাত্ত্বিক দান, প্রতিদানের আশায় দান রাজসিক এবং অযোগ্য পাত্রে অবজ্ঞার সাথে দান তামসিক।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 ওঁ তৎ সৎ-এর মহিমা:</span>
                  <span className="summary-item-desc">ঈশ্বরের তিনটি পবিত্র নাম 'ওঁ', 'তৎ' ও 'সৎ' দিয়ে সমস্ত শুভ কর্মকে ঈশ্বরের উদ্দেশ্যে সমর্পণ করতে হয়। 'ওঁ' দিয়ে শুভ কাজ শুরু করা হয়, 'তৎ' দিয়ে মোক্ষের আকাঙ্ক্ষায় কর্ম করা হয় এবং 'সৎ' সত্য ও মঙ্গলময় কর্মের প্রতীক। শ্রদ্ধা ছাড়া যে কোনো কাজ—যজ্ঞ, দান বা তপস্যা—সবই 'অসৎ' এবং ইহলোকে বা পরলোকে কোনো উপকারে আসে না।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: প্রতিটি কাজ—আহার, যজ্ঞ, তপস্যা ও দান—যেন পরম শ্রদ্ধার সাথে সাত্ত্বিকভাবে এবং ঈশ্বরে সমর্পিত চিত্তে করা হয়; শ্রদ্ধাহীন কোনো কাজেরই প্রকৃত ফল নেই।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার শ্রদ্ধাত্রয়বিভাগযোগ নামক সপ্তদশ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : chapter.num === 18 ? (
              <div className="summary-body-real">
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 সংন্যাস ও ত্যাগের আসল স্বরূপ:</span>
                  <span className="summary-item-desc">এই শেষ অধ্যায়ে শ্রীকৃষ্ণ পরিষ্কার করেন যে, সমস্ত কর্ম ছেড়ে জঙ্গল বা ঘরে অলস বসে থাকার নাম সংন্যাস নয়। যজ্ঞ, দান ও তপস্যার মতো পবিত্র কাজ কখনো ছাড়া উচিত নয়। আসক্তি ও ফলের আশা ছাড়া নিজের স্বাভাবিক দায়িত্ব ও কর্তব্য কর্ম পালন করাই হলো সাত্ত্বিক ত্যাগ।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 স্বভাবজাত কর্ম ও বর্ণপ্রথা:</span>
                  <span className="summary-item-desc">মানুষের গুণ ও কর্মের ওপর ভিত্তি করে সমাজকে চার ভাগে ভাগ করা হয়েছে—ব্রাহ্মণ, ক্ষত্রিয়, বৈশ্য ও শূদ্র। নিজের স্বভাবজাত কাজ ছোট বা ত্রুটিপূর্ণ মনে হলেও তা ছেড়ে অন্যের কাজ করা উচিত নয়। নিজের স্বাভাবিক কর্মকে ঈশ্বরের পূজা মনে করে সম্পাদন করলেই পরম সিদ্ধি আসে।</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-heading">🔸 শরণাগতির চূড়ান্ত মহিমা ও গীতামাহাত্ম্য:</span>
                  <span className="summary-item-desc">ভগবান অর্জুনকে সমস্ত সংশয় ও জাগতিক ধর্মের চিন্তা ভুলে একমাত্র তাঁর চরণে সম্পূর্ণ আত্মসমর্পণ (শরণাগতি) করার নির্দেশ দিয়েছেন। গীতার শেষ শ্লোকে সঞ্জয় ধৃতরাষ্ট্রকে স্পষ্ট জানিয়ে দেন যে, যেখানে কর্মশক্তি (অর্জুন) এবং ঈশ্বরের দিব্য শক্তি ও নীতি (শ্রীকৃষ্ণ) একসাথে মিলিত হয়, সেখানে জয়, উন্নতি ও ঐশ্বর্য নিশ্চিত।</span>
                </div>
                <blockquote className="summary-lesson">
                  💡 মূল শিক্ষা: অহংকার ও ফলের আশা ত্যাগ করে, নিজের নির্ধারিত কর্তব্য কর্মের মাধ্যমে সর্বদা পরমেশ্বরের আরাধনা করা এবং সর্বতোভাবে ঈশ্বরের চরণে নিজেকে সঁপে দেওয়াই হলো গীতার চূড়ান্ত ও পরম শিক্ষা।
                </blockquote>
                <div className="summary-colophon">ইতি শ্রীমদ্ভগবদ্গীতার মোক্ষসংন্যাসযোগ নামক অষ্টাদশ অধ্যায় সমাপ্ত।</div>
              </div>
            ) : (
              <div className="summary-body" contentEditable suppressContentEditableWarning
                data-placeholder="এই অধ্যায়ের সারাংশ ও মূল শিক্ষা এখানে পেস্ট করুন..." />
            )}
          </div>
        ) : (
          <>
            {Array.from({ length: verseEnd - verseStart + 1 }, (_, i) => {
              const vNum = verseStart + i;
              const content = getVerseContent(chapter.num, vNum);
              return (
                <div key={vNum} className="verse-card">
                  {content.speaker && (
                    <div className="verse-speaker">{content.speaker}</div>
                  )}
                  <div className="verse-number-badge">
                    <span className="verse-num-inner">শ্লোক {toBengaliNum(vNum)}</span>
                  </div>
                  <div className="verse-sanskrit">{content.sanskrit}</div>
                  <div className="verse-divider" />
                  <div className="verse-bengali-label">অনুবাদ</div>
                  <div className="verse-bengali">{content.bengali}</div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Navigation — counter centred, arrows grouped right */}
      <div className="reader-nav">
        <div className="reader-nav-dots">
          {toBengaliNum(page + 1)}/{toBengaliNum(totalPages)}
        </div>
        <div className="reader-nav-arrows">
          <button
            className={`reader-nav-btn prev-btn ${isFirstPage ? "disabled" : ""}`}
            onClick={goPrev}
            disabled={isFirstPage}
            aria-label="পূর্ববর্তী শ্লোক"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button
            className={`reader-nav-btn next-btn ${isLastItem ? "disabled" : ""}`}
            onClick={goNext}
            disabled={isLastItem}
            aria-label={showSummary ? "শেষ" : page >= totalPages - 1 ? "সারসংক্ষেপ" : "পরবর্তী শ্লোক"}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
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
