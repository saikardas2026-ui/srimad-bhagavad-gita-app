import { useState, useEffect, useRef } from "react";
import "./index.css";
import { initAdMob, showBanner } from "./admob";
import { CHAPTERS } from "./data";
import { ChapterList }  from "./screens/ChapterList";
import { ChapterReader } from "./screens/ChapterReader";
import { AlarmClock }   from "./screens/AlarmClock";
import { GitaMahatmya } from "./screens/GitaMahatmya";
import { MahatmyaShankar } from "./screens/MahatmyaShankar";
import { MahatmyaVaraha }  from "./screens/MahatmyaVaraha";
import { MahatmyaPadma }   from "./screens/MahatmyaPadma";
import { Dictionary }   from "./screens/Dictionary";
import { Quotes }       from "./screens/Quotes";
import { Quiz }         from "./screens/Quiz";
import { Support }      from "./screens/Support";
import { About }        from "./screens/About";

type Screen =
  | "splash" | "guru-vandana" | "gita-dhyanam"
  | "dashboard"
  | "chapter-list" | "chapter-reader"
  | "alarm" | "mahatmya" | "mahatmya-shankar" | "mahatmya-varaha" | "mahatmya-padma"
  | "dict" | "quotes" | "quiz" | "donate" | "about";

const BASE = import.meta.env.BASE_URL;

const MENU_ITEMS = [
  { id: "chapters",  label: "অধ্যায় সমূহ",    sub: "18 Chapters",        icon: "fa-solid fa-book-open",        comingSoon: false },
  { id: "mahatmya",  label: "গীতা মাহাত্ম্য",  sub: "Gita Mahatmya",      icon: "fa-solid fa-om",               comingSoon: false },
  { id: "dict",      label: "শব্দার্থ",         sub: "Word Meanings",      icon: "fa-solid fa-book",             comingSoon: true  },
  { id: "clock",     label: "রিমাইন্ডার",      sub: "Alarms & Reminders", icon: "fa-solid fa-bell",             comingSoon: true  },
  { id: "quotes",    label: "অমৃত বাণী",        sub: "Nectar of Wisdom",   icon: "fa-solid fa-quote-right",      comingSoon: true  },
  { id: "quiz",      label: "জ্ঞানমূলক প্রশ্ন", sub: "Knowledge Quiz",    icon: "fa-solid fa-circle-question",  comingSoon: true  },
  // { id: "donate",  label: "অনুদান",          sub: "Support Us",         icon: "fa-solid fa-hand-holding-heart", comingSoon: false },
  { id: "about",     label: "পরিচিতি",         sub: "About",              icon: "fa-solid fa-circle-info",      comingSoon: false },
];

// Content shown inside the Coming Soon modal — keyed by menu item id
const COMING_SOON_CONTENT: Record<string, {
  title: string; icon: string; text: string; sub: string;
}> = {
  clock: {
    title: "রিমাইন্ডার ও অ্যালার্ম",
    icon:  "fa-solid fa-bell",
    text:  "অ্যালার্ম ও শান্ত সুরের রিমাইন্ডার সিস্টেম —",
    sub:   "Alarm & Serene Tone Reminder System — Coming Soon!",
  },
  dict: {
    title: "শব্দার্থ",
    icon:  "fa-solid fa-book",
    text:  "গীতার প্রতিটি শ্লোকের শব্দার্থ ও সরল ব্যাখ্যা —",
    sub:   "Word meanings & simple explanations for every Gita verse — Coming Soon!",
  },
  quotes: {
    title: "অমৃত বাণী",
    icon:  "fa-solid fa-quote-right",
    text:  "মহাপুরুষদের অমূল্য অমৃত বাণী ও বাণী চিরন্তনী —",
    sub:   "Timeless nectar words of the great sages — Coming Soon!",
  },
  quiz: {
    title: "জ্ঞানমূলক প্রশ্ন",
    icon:  "fa-solid fa-circle-question",
    text:  "গীতা ও সনাতন ধর্ম বিষয়ক কুইজ ও জ্ঞানমূলক প্রশ্ন —",
    sub:   "Quiz & knowledge questions on Gita & Sanatan Dharma — Coming Soon!",
  },
};

// Single continuous background track — no crossfading needed

export default function App() {
  const [screen,         setScreen]        = useState<Screen>("splash");
  const [splashVisible,  setSplashVisible] = useState(true);
  const [fadeIn,         setFadeIn]        = useState(false);
  const [activeChapter,  setActiveChapter] = useState<number>(1);
  // null = closed; string = id of the item whose Coming Soon modal is open
  const [comingSoonId,   setComingSoonId]  = useState<string | null>(null);

  // Audio state — drives FAB visual
  const [audioPlaying,  setAudioPlaying]  = useState(false);   // true = actively playing
  const [audioUnlocked, setAudioUnlocked] = useState(false);   // true = autoplay gate passed

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const userPausedRef  = useRef(false);   // user explicitly hit pause
  const unlockedRef    = useRef(false);   // mirrors audioUnlocked as ref (no stale closures)
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── helper: mark as unlocked in both ref and state ──
  const markUnlocked = () => {
    unlockedRef.current = true;
    setAudioUnlocked(true);
  };

  // ── helper: attempt play, respecting user-pause choice ──
  const tryPlay = () => {
    if (!audioRef.current || userPausedRef.current) return;
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    const src = `${BASE}bg-music.mp3`;
    const a = new Audio(src);
    a.loop = true; a.volume = 0.7; a.preload = "auto";
    audioRef.current = a;

    // Mirror the element's real play/pause state into React
    a.addEventListener("play",  () => setAudioPlaying(true));
    a.addEventListener("pause", () => setAudioPlaying(false));

    // Pre-buffer immediately so playback starts without a network delay
    a.load();

    // Attempt autoplay — succeeds on Android WebView / PWA / returning users
    a.play()
      .then(() => { markUnlocked(); })
      .catch(() => {
        // Browser blocked autoplay — wait for first user gesture
        const unlock = () => {
          if (unlockedRef.current) return;
          markUnlocked();
          if (audioRef.current && !userPausedRef.current) {
            audioRef.current.play().catch(() => {});
          }
        };
        ["touchstart", "touchend", "mousedown", "keydown"].forEach(evt =>
          document.addEventListener(evt, unlock, { once: true, passive: true })
        );
      });

    // Page Visibility API — pause when app goes to background, resume when visible
    const onVisibility = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else if (unlockedRef.current && !userPausedRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      a.pause(); a.src = "";
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // ── FAB click: toggle play / pause ──
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      userPausedRef.current = true;
      audioRef.current.pause();
    } else {
      userPausedRef.current = false;
      markUnlocked();
      audioRef.current.play().catch(() => {});
    }
  };

  // ── AdMob: initialize SDK and show banner on native Android ──
  useEffect(() => {
    initAdMob().then(() => showBanner()).catch(() => {});
  }, []);

  // ── Navigate away from splash (called by timer or tap) ──
  const advanceFromSplash = () => {
    if (splashTimerRef.current) { clearTimeout(splashTimerRef.current); splashTimerRef.current = null; }
    setSplashVisible(false);
    setTimeout(() => {
      setScreen("guru-vandana");
      setSplashVisible(true);
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 700);
  };

  // ── Splash tap: unlock audio then advance ──
  const handleSplashTap = () => {
    if (!unlockedRef.current && audioRef.current) {
      markUnlocked();
      if (!userPausedRef.current) audioRef.current.play().catch(() => {});
    }
    advanceFromSplash();
  };

  useEffect(() => {
    if (screen !== "splash") return;
    setFadeIn(true);
    splashTimerRef.current = setTimeout(advanceFromSplash, 3000);
    return () => { if (splashTimerRef.current) clearTimeout(splashTimerRef.current); };
  }, [screen]);

  const fadeTo = (next: Screen, beforeSwitch?: () => void) => {
    setFadeIn(false);
    setTimeout(() => {
      beforeSwitch?.();
      setScreen(next);
      setTimeout(() => setFadeIn(true), 50);
    }, 380);
  };

  const goHome = () => fadeTo("dashboard");

  const handleMenuClick = (id: string) => {
    if (COMING_SOON_CONTENT[id]) { setComingSoonId(id); return; }
    if (id === "chapters") fadeTo("chapter-list");
    if (id === "mahatmya") fadeTo("mahatmya");
    if (id === "donate")   fadeTo("donate");
    if (id === "about")    fadeTo("about");
  };

  const openChapter = (n: number) => {
    setActiveChapter(n);
    fadeTo("chapter-reader");
  };

  // ── 3-state audio FAB ──
  // waiting = autoplay blocked (pulsing ring)  |  playing = active  |  paused = user paused
  const fabState = audioPlaying ? "playing" : !audioUnlocked ? "waiting" : "paused";
  const AudioFab = (
    <button
      className={`mute-btn ${fabState}`}
      onClick={toggleAudio}
      aria-label={audioPlaying ? "সংগীত বন্ধ করুন" : "সংগীত চালু করুন"}
      title={audioPlaying ? "Pause music" : "Play music"}
    >
      {audioPlaying ? (
        /* Speaker with waves — currently playing */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : !audioUnlocked ? (
        /* Musical note — waiting for first tap */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ) : (
        /* Speaker off / play arrow — user paused */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="15" y1="9" x2="21" y2="15" /><line x1="15" y1="15" x2="21" y2="9" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="app-root">
      {AudioFab}

      {/* ── Splash ── */}
      {screen === "splash" && (
        <div
          className={`screen splash-screen ${splashVisible && fadeIn ? "visible" : ""}`}
          onClick={handleSplashTap}
          style={{ cursor: "pointer" }}
        >
          <div className="splash-bg">
            <img src={`${BASE}splash.jpg`} alt="" className="splash-img"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div className="splash-overlay" />
          </div>
          <div className="splash-content">
            <div className="om-symbol">ॐ</div>
            <h1 className="splash-title">শ্রীমদ্ভগবদ্গীতা</h1>
            <div className="title-divider">
              <span className="divider-line" /><span className="divider-gem">✦</span><span className="divider-line" />
            </div>
            <p className="splash-subtitle">কুরুক্ষেত্র সমরাঙ্গণে পরম উপদেশ</p>
            <div className="splash-tap-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
              স্পর্শ করে সংগীত শুরু করুন
            </div>
          </div>
        </div>
      )}

      {/* ── Guru Vandana ── */}
      {screen === "guru-vandana" && (
        <div className={`screen content-screen ${fadeIn ? "visible" : ""}`}>
          <div className="screen-inner">
            <div className="screen-header">
              <div className="small-om">ॐ</div>
              <h2 className="screen-heading">শ্রী গুরু বন্দনা</h2>
              <div className="heading-underline" />
            </div>

            <div className="gv-scroll">
              {/* ── Verse 1 ── */}
              <div className="gv-card">
                <div className="gv-card-title">১. শ্রীগুরু বন্দনা</div>
                <div className="gv-shloka">
                  অজ্ঞানতিমিরাদ্ধস্য জ্ঞানঞ্জনশলাকয়া।<br />
                  চক্ষুরুন্মীলিতং যেন তস্মৈ শ্রীগুরবে নমঃ।।
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  যিনি অজ্ঞতারূপ অন্ধকার দ্বারা অন্ধ হয়ে যাওয়া চোখের পাতা জ্ঞানরূপ অঞ্জনের (কাজল) কাঠি দিয়ে খুলে দিয়েছেন (অর্থাৎ যিনি দিব্যজ্ঞানের আলো দিয়ে ভেতরের চোখ ফুটিয়ে তুলেছেন), সেই শ্রীগুরুদেবকে আমি প্রণাম জানাই।
                </div>
              </div>

              {/* ── Verse 2 ── */}
              <div className="gv-card">
                <div className="gv-card-title">২. শ্রীকৃষ্ণ প্রণাম মন্ত্র</div>
                <div className="gv-shloka">
                  ওঁ কৃষ্ণায় বাসুদেবায় হরয়ে পরমাত্মনে।<br />
                  প্রণত ক্লেশনাশায় গোবিন্দায় নমো নমঃ।।
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  বসুদেবপুত্র শ্রীকৃষ্ণ, যিনি পরমাত্মা এবং সমস্ত পাপ ও দুঃখ হরণকারী, সেই শ্রীহরি গোবিন্দকে আমি প্রণাম জানাই। যিনি তাঁর চরণে শরণাগত ভক্তদের সমস্ত ক্লেশ বা কষ্ট দূর করেন, তাঁকে বারবার নমস্কার।
                </div>
              </div>

              {/* ── Verse 3 ── */}
              <div className="gv-card">
                <div className="gv-card-title">৩. সরস্বতী প্রণাম মন্ত্র</div>
                <div className="gv-shloka">
                  ওঁ সরস্বতী মহাভাগে বিদ্যে কমললোচনে।<br />
                  বিশ্বরূপে বিশালাক্ষী বিদ্যাং দেহি নমোঽস্তুতে।।
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  হে মহাভাগা, পদ্মের মতো চোখবিশিষ্ট, বিশ্বরূপা ও বিশাল চোখের অধিকারিণী জ্ঞানদাত্রী দেবী সরস্বতী! আপনি আমাকে বিদ্যা ও জ্ঞান দান করুন, আপনাকে আমি প্রণাম জানাই।
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="nav-btn primary-btn" onClick={() => fadeTo("gita-dhyanam")}>
                পরবর্তী
              </button>
            </div>
          </div>
          <div className="decorative-border" />
        </div>
      )}

      {/* ── Gita Dhyanam ── */}
      {screen === "gita-dhyanam" && (
        <div className={`screen content-screen ${fadeIn ? "visible" : ""}`}>
          <div className="screen-inner">
            <div className="screen-header">
              <div className="small-om">ॐ</div>
              <h2 className="screen-heading">গীতা ধ্যানম্</h2>
              <div className="heading-underline" />
            </div>

            <div className="gv-scroll">
              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ১</div>
                <div className="gv-shloka">
                  পার্থায় প্রতিবোধিতাং ভগবতা নারায়ণেন স্বয়ম্।<br />
                  ব্যাসেন গ্রথিতাং পুরাণমুনিনা মধ্যে মহাভারতম্।।<br />
                  অদ্বৈতামৃতবর্ষিণীং ভগবতীমষ্টাদশাধ্যায়িনীম্।<br />
                  অম্ব ত্বামনুসন্দধামি ভগবদ্গীতে ভবদ্বেষিণীম্ ॥১॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  স্বয়ং ভগবান নারায়ণ যা অর্জুনকে বুঝিয়েছিলেন, প্রাচীন মুনি ব্যাসদেব যা মহাভারতের মধ্যে গেঁথে দিয়েছেন—সেই অদ্বৈত-জ্ঞানরূপ অমৃতবর্ষণকারী, আঠারোটি অধ্যায়যুক্ত এবং সংসার-ভয় বিনাশকারী ভগবতী শ্রীমদ্ভগবদ্গীতাকে, হে মাতা, আমি তোমার ধ্যান করি।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ২</div>
                <div className="gv-shloka">
                  নমোহস্তু তে ব্যাস বিশালবুদ্ধে ফুল্লারবিন্দায়তপত্রনেত্র।<br />
                  যেন ত্বয়া ভারততৈলপূর্ণঃ প্রজ্বালিতো জ্ঞানময়ঃ প্রদীপঃ ॥২॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  প্রস্ফুটিত পদ্মফুলের মতো চোখ এবং বিশাল বৃদ্ধির অধিকারী হে মহর্ষি ব্যাসদেব! আপনাকে নমস্কার। আপনি মহাভারত রূপ তেলের দ্বারা এই সংসারে পরম জ্ঞানময় প্রদীপটি জ্বালিয়ে দিয়েছেন।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৩</div>
                <div className="gv-shloka">
                  প্রপন্নপারিজাতায় তোত্রবেত্রৈকপাণয়ে।<br />
                  জ্ঞানমুদ্রায় কৃষ্ণায় গীতামৃতদুহে নমঃ ॥৩॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  যিনি শরণাগত ভক্তদের জন্য পারিজাত বৃক্ষের মতো (কামনা পূরণকারী), যাঁর এক হাতে রথের চাবুক এবং অন্য হাত জ্ঞানমুদ্রায় শোভিত—সেই গীতারূপ অমৃত দোহনকারী শ্রীকৃষ্ণকে প্রণাম জানাই।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৪</div>
                <div className="gv-shloka">
                  সর্বোপনিষদো গাবো দোগ্ধা গোপালনন্দনঃ।<br />
                  পার্থো বৎসঃ সুধীর্ভোক্তা দুগ্ধং গীতামৃতং মহৎ ॥৪॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  সমস্ত উপনিষদ হলো গাভীস্বরূপ, আর গাভী দোহনকারী হলেন স্বয়ং গোপালনন্দন শ্রীকৃষ্ণ। অর্জুন হলেন বাছুর এবং জ্ঞানী ব্যক্তিরা হলেন এর ভোক্তা; আর এই মিলনের ফলে যে পরম দুধ পাওয়া গেছে, তা হলো গীতারূপ মহান অমৃত।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৫</div>
                <div className="gv-shloka">
                  বসুদেবসুতং দেবং কংসচাণূরমর্দনম্।<br />
                  দেবকীপরমানন্দং কৃষ্ণং বন্দে জগদ্গুরুম্ ॥৫॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  বসুদেবের পুত্র, কংস ও চাণূরের মতো অত্যাচারীদের ধ্বংসকারী, মাতা দেবকীর পরম আনন্দস্বরূপ এবং সমগ্র জগতের গুরু শ্রীকৃষ্ণকে আমি বন্দনা করি।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৬</div>
                <div className="gv-shloka">
                  ভীষ্মদ্রোণতটা জয়দ্রথজলা গান্ধারনীলোপলা।<br />
                  শল্যগ্রাহবতী কৃপেণ বহনী কর্ণেন বেলাকুলা ॥৬॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  কুরুক্ষেত্রের যুদ্ধরূপ নদীটির ভীষ্ম ও দ্রোণাচার্য ছিলেন দুই কূল বা তীর, জয়দ্রথ ছিল জল, শকুনি ছিল নীল পাথর, শল্য ছিল কুমির বা জলহস্তী, কৃপাচার্য ছিল নদীর তীব্র স্রোত এবং কর্ণ ছিলেন তার কূলপ্লাবী ঢেউ।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৭</div>
                <div className="gv-shloka">
                  অশ্বথামবিকর্ণঘোরমকরা দুর্যোধনাবর্তিনী।<br />
                  সৌতীর্ণা খলু পাণ্ডবৈ রণনদী কৈবর্তকে কেশবে ॥৭॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  অশ্বত্থামা ও বিকর্ণ ছিলেন সেই নদীর ভয়ঙ্কর হাঙ্গর বা মকর এবং দুর্যোধন ছিল তার প্রবল আবর্ত বা ঘূর্ণিস্রোত। পাণ্ডবরা এই ভয়ঙ্কর রণ-নদী অনায়াসেই পার হয়ে গিয়েছিলেন, কারণ তাদের কাণ্ডারী বা নৌকাচালক ছিলেন স্বয়ং শ্রীকৃষ্ণ।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৮</div>
                <div className="gv-shloka">
                  পারাশর্যবচঃসরোজমমলং গীতার্থগন্ধোৎকটং।<br />
                  নানাখ্যানককেশরং হরিকথাসম্বোধনাবধিতম্ ॥৮॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  পরাশর মুনির পুত্র ব্যাসদেবের বাণী থেকে উৎপন্ন মহাভারত হলো একটি নির্মল বা পবিত্র পদ্মফুল। গীতার গভীর বাণী হলো এর সুগন্ধ, এর ভেতরের নানা উপাখ্যান বা গল্প হলো তার পরাগ এবং ভগবান হরির কথাই হলো তার সম্পূর্ণ বিস্তার বা পরিধি।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ৯</div>
                <div className="gv-shloka">
                  লোকে সজ্জনষট্পদৈরহরহঃ পেপীয়মানং মুদা।<br />
                  ভূয়াদ্ভারতপঙ্কজং কলিমলপ্রধ্বংসি নঃ শ্রেয়সে ॥৯॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  এই পৃথিবীর ভালো বা সজ্জন মানুষেরা মৌমাছির মতো প্রতিদিন পরম আনন্দে এই মহাভারত-পদ্মের সুধা পান করেন। কলিযুগের সমস্ত পাপ ও মলিনতা ধ্বংসকারী এই পদ্ম আমাদের সবার পরম মঙ্গল করুক।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ১০</div>
                <div className="gv-shloka">
                  মূকং করোতি বাচালং পঙ্গুং লঙ্ঘয়তে গিরিম্।<br />
                  যৎকৃপা তমহং বন্দে পরমানন্দমাধবম্ ॥১০॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  যাঁর কৃপায় বোবা মানুষও চমৎকার কথা বলতে পারে এবং পঙ্গু (খোঁড়া) মানুষও দুর্গম পর্বত পার হয়ে যেতে পারে—সেই পরম আনন্দস্বরূপ মাধবকে (শ্রীকৃষ্ণ) আমি বন্দনা করি।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ১১</div>
                <div className="gv-shloka">
                  যং ব্রহ্মাবরুণেন্দ্ররুদ্রমরুতঃ স্তুন্বন্তি দিব্যৈঃ স্তবৈ-<br />
                  র্বেদ্যৈঃ সাঙ্গপদক্রমোপনিষদৈর্গায়ন্তি যং সামগাঃ ॥১১॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  ব্রহ্মা, বরুণ, ইন্দ্র, রুদ্র ও মরুতগণ দিব্য স্তোত্রের মাধ্যমে যাঁর স্তুতি করেন; সামবেদের গায়কেরা বেদ, উপনিষদ এবং এর বিভিন্ন অঙ্গ ও পাঠক্রমের মাধ্যমে যাঁর গান বা মহিমা কীর্তন করেন।
                </div>
              </div>

              <div className="gv-card">
                <div className="gv-card-title">শ্লোক ১২</div>
                <div className="gv-shloka">
                  ধ্যানাবস্থিততদ্গতেন মনসা পশ্যন্তি যং যোগিনো<br />
                  যস্যান্তং ন বিদুঃ সুরগণা দেবায় তস্মৈ নমঃ ॥১২॥
                </div>
                <div className="gv-divider" />
                <div className="gv-meaning-label">সরলার্থ</div>
                <div className="gv-meaning">
                  যোগীগণ ধ্যানের গভীরে একাগ্র মনে যাঁর দর্শন লাভ করেন এবং দেবতা বা অসুর—কোনো পক্ষই যাঁর মহিমার আদি ও অন্ত খুঁজে পান না—সেই পরম প্রকাশময় দেবতাকে আমি প্রণাম জানাই।
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="nav-btn primary-btn"
                onClick={() => fadeTo("dashboard")}>
                পরবর্তী
              </button>
            </div>
          </div>
          <div className="decorative-border" />
        </div>
      )}

      {/* ── Dashboard ── */}
      {screen === "dashboard" && (
        <div className={`screen dashboard-screen ${fadeIn ? "visible" : ""}`}>
          <header className="dash-header">
            <div className="dash-header-om">ॐ</div>
            <div className="dash-header-text">
              <h1 className="dash-title">শ্রীমদ্ভগবদ্গীতা</h1>
              <div className="dash-title-divider">
                <span className="divider-line" /><span className="divider-gem">✦</span><span className="divider-line" />
              </div>
              <p className="dash-subtitle">কুরুক্ষেত্র সমরাঙ্গণে পরম উপদেশ</p>
            </div>
          </header>
          <main className="dash-grid-wrap">
            <div className="dash-grid">
              {MENU_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`dash-card${item.comingSoon ? " coming-soon" : ""}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.comingSoon && (
                    <span className="dash-card-badge">শীঘ্রই</span>
                  )}
                  <div className="dash-card-icon-wrap">
                    <i className={`${item.icon} dash-card-icon`} />
                  </div>
                  <span className="dash-card-label">{item.label}</span>
                  <span className="dash-card-sub">{item.sub}</span>
                </button>
              ))}
            </div>
          </main>
          <div className="admob-placeholder">
            <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
          </div>
        </div>
      )}

      {/* ── Chapter List ── */}
      {screen === "chapter-list" && (
        <ChapterList onSelect={openChapter} onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── Chapter Reader ── */}
      {screen === "chapter-reader" && (
        <ChapterReader
          key={activeChapter}
          chapter={CHAPTERS[activeChapter - 1]}
          onHome={goHome}
          onBack={() => fadeTo("chapter-list")}
          fadeIn={fadeIn}
        />
      )}

      {/* ── Alarm ── */}
      {screen === "alarm" && (
        <AlarmClock onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── Gita Mahatmya Index ── */}
      {screen === "mahatmya" && (
        <GitaMahatmya
          onHome={goHome}
          fadeIn={fadeIn}
          onSelect={section => fadeTo(`mahatmya-${section}` as Screen)}
        />
      )}

      {/* ── Mahatmya: Shankaracharya ── */}
      {screen === "mahatmya-shankar" && (
        <MahatmyaShankar
          onHome={goHome}
          onBack={() => fadeTo("mahatmya")}
          fadeIn={fadeIn}
        />
      )}

      {/* ── Mahatmya: Varaha Purana ── */}
      {screen === "mahatmya-varaha" && (
        <MahatmyaVaraha
          onHome={goHome}
          onBack={() => fadeTo("mahatmya")}
          fadeIn={fadeIn}
        />
      )}

      {/* ── Mahatmya: Padma Purana ── */}
      {screen === "mahatmya-padma" && (
        <MahatmyaPadma
          onHome={goHome}
          onBack={() => fadeTo("mahatmya")}
          fadeIn={fadeIn}
        />
      )}

      {/* ── Dictionary ── */}
      {screen === "dict" && (
        <Dictionary onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── Quotes ── */}
      {screen === "quotes" && (
        <Quotes onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── Quiz ── */}
      {screen === "quiz" && (
        <Quiz onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── Support ── */}
      {screen === "donate" && (
        <Support onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── About ── */}
      {screen === "about" && (
        <About onHome={goHome} fadeIn={fadeIn} />
      )}

      {/* ── Coming Soon Modal — generic, driven by comingSoonId ── */}
      {comingSoonId && (() => {
        const cs = COMING_SOON_CONTENT[comingSoonId];
        if (!cs) return null;
        const close = () => setComingSoonId(null);
        return (
          <div
            className="coming-soon-overlay"
            onClick={e => { if (e.target === e.currentTarget) close(); }}
            role="dialog"
            aria-modal="true"
            aria-label="Coming Soon"
          >
            <div className="coming-soon-card">
              <div className="coming-soon-icon-wrap">
                <i className={cs.icon} />
              </div>
              <div className="coming-soon-title">{cs.title}</div>
              <div className="coming-soon-divider" />
              <p className="coming-soon-text">
                {cs.text}<br /><strong>শীঘ্রই আসছে!</strong>
              </p>
              <p className="coming-soon-sub">{cs.sub}</p>
              <button className="coming-soon-ok-btn" onClick={close}>
                ঠিক আছে
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
