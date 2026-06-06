import { useState, useEffect, useRef, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;

const TONES = [
  { id: "sur1", label: "Tone - 1", file: "alarm_sur1.mp3", icon: "fa-solid fa-music" },
  { id: "sur2", label: "Tone - 2", file: "alarm_sur2.mp3", icon: "fa-solid fa-music" },
  { id: "sur3", label: "Tone - 3", file: "alarm_sur3.mp3", icon: "fa-solid fa-music" },
  { id: "sur4", label: "Tone - 4", file: "alarm_sur4.mp3", icon: "fa-solid fa-music" },
  { id: "sur5", label: "Tone - 5", file: "alarm_sur5.mp3", icon: "fa-solid fa-music" },
  { id: "sur6", label: "Tone - 6", file: "alarm_sur6.mp3", icon: "fa-solid fa-music" },
];

const HOURS            = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES          = Array.from({ length: 12 }, (_, i) => i * 5);
const AMPM_LIST        = ["AM", "PM"];
const DAY_LABELS       = ["S","M","T","W","T","F","S"];
const SNOOZE_DURATIONS = [5, 10, 15];
const SNOOZE_COUNTS    = [1, 2, 3];
const RING_DURATION_MS = 45_000; // auto-stop ringing after 45 s
const ITEM_H           = 52;

type AlarmPhase = "idle" | "ringing" | "snoozed";

function pad2(n: number) { return String(n).padStart(2, "0"); }

/* ─────────────────────────────────────────────────────────────
   Wheel Picker
───────────────────────────────────────────────────────────── */
interface WheelProps {
  items: (string | number)[];
  value: string | number;
  onChange: (v: string | number) => void;
  format?: (v: string | number) => string;
  label: string;
}

function WheelPicker({ items, value, onChange, format, label }: WheelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipRef   = useRef(false);

  const idxOf = (v: string | number) => { const i = items.indexOf(v); return i < 0 ? 0 : i; };

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    skipRef.current = true;
    el.scrollTop = idxOf(value) * ITEM_H;
    requestAnimationFrame(() => { skipRef.current = false; });
  }, []);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const current = Math.round(el.scrollTop / ITEM_H);
    if (current !== idxOf(value)) {
      skipRef.current = true;
      el.scrollTo({ top: idxOf(value) * ITEM_H, behavior: "smooth" });
      setTimeout(() => { skipRef.current = false; }, 350);
    }
  }, [value]);

  const onScroll = useCallback(() => {
    if (skipRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const el = scrollRef.current; if (!el) return;
      const i = Math.round(el.scrollTop / ITEM_H);
      const c = Math.max(0, Math.min(items.length - 1, i));
      el.scrollTo({ top: c * ITEM_H, behavior: "smooth" });
      onChange(items[c]);
    }, 120);
  }, [items, onChange]);

  const clickItem = (i: number) => {
    const el = scrollRef.current; if (!el) return;
    el.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    onChange(items[i]);
  };

  return (
    <div className="wheel-col">
      <span className="wheel-label">{label}</span>
      <div className="wheel-outer">
        <div className="wheel-fade-top" />
        <div className="wheel-highlight" />
        <div className="wheel-fade-bot" />
        <div className="wheel-scroll" ref={scrollRef} onScroll={onScroll}>
          <div className="wheel-pad" />
          {items.map((item, i) => (
            <div key={String(item)} className={`wheel-item ${item === value ? "active" : ""}`} onClick={() => clickItem(i)}>
              {format ? format(item) : String(item)}
            </div>
          ))}
          <div className="wheel-pad" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AlarmClock Screen
───────────────────────────────────────────────────────────── */
interface Props { onHome: () => void; fadeIn: boolean; }

export function AlarmClock({ onHome, fadeIn }: Props) {
  /* ── Live clock ── */
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  /* ── Alarm config ── */
  const [hour,        setHour]        = useState<string | number>(6);
  const [minute,      setMinute]      = useState<string | number>(0);
  const [ampm,        setAmpm]        = useState<string | number>("AM");
  const [tone,        setTone]        = useState("sur1");
  const [alarmOn,     setAlarmOn]     = useState(false);
  const [repeatDays,  setRepeatDays]  = useState<Set<number>>(new Set());
  const [alarmName,   setAlarmName]   = useState("");
  const [vibrate,     setVibrate]     = useState(true);
  const [snoozeMins,  setSnoozeMins]  = useState(5);
  const [snoozeCount, setSnoozeCount] = useState(3);

  /* ── Alarm state machine ── */
  const [phase,        setPhase]        = useState<AlarmPhase>("idle");
  const [snoozeLeft,   setSnoozeLeft]   = useState(0);
  const [snoozeEndsAt, setSnoozeEndsAt] = useState<number | null>(null);
  const [snoozeCountdown, setSnoozeCountdown] = useState(0); // seconds

  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const autoStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Helper: stop audio ── */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null;
    }
    if (autoStopTimer.current) { clearTimeout(autoStopTimer.current); autoStopTimer.current = null; }
  };

  /* ── Helper: start ringing ── */
  const startRinging = useCallback((remainingSnoozeCycles: number) => {
    const sel = TONES.find(t => t.id === tone)!;
    const audio = new Audio(`${BASE}${sel.file}`);
    audio.loop = true; audio.volume = 0.9; audio.play().catch(() => {});
    audioRef.current = audio;
    setPhase("ringing");
    setSnoozeLeft(remainingSnoozeCycles);

    // Auto-stop after RING_DURATION_MS
    autoStopTimer.current = setTimeout(() => {
      stopAudio();
      if (remainingSnoozeCycles > 0) {
        // Enter snooze phase
        setPhase("snoozed");
        setSnoozeLeft(remainingSnoozeCycles - 1);
        setSnoozeEndsAt(Date.now() + snoozeMins * 60_000);
      } else {
        // All snooze cycles exhausted — go idle
        setPhase("idle");
        setAlarmOn(false);
      }
    }, RING_DURATION_MS);
  }, [tone, snoozeMins]);

  /* ── Watch clock: fire alarm ── */
  useEffect(() => {
    if (!alarmOn || phase !== "idle") return;
    const t = setInterval(() => {
      const n = new Date(); let h = n.getHours(); const m = n.getMinutes();
      const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
      if (h === Number(hour) && m === Number(minute) && ap === ampm) {
        startRinging(snoozeCount);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [alarmOn, phase, hour, minute, ampm, snoozeCount, startRinging]);

  /* ── Snooze countdown ticker ── */
  useEffect(() => {
    if (phase !== "snoozed" || snoozeEndsAt === null) return;
    const t = setInterval(() => {
      const remaining = Math.max(0, Math.round((snoozeEndsAt - Date.now()) / 1000));
      setSnoozeCountdown(remaining);
      if (remaining === 0) {
        clearInterval(t);
        setPhase("idle");       // briefly idle so the clock-watcher re-arms
        // Ring again immediately with remaining cycles
        setTimeout(() => startRinging(snoozeLeft), 200);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [phase, snoozeEndsAt, snoozeLeft, startRinging]);

  /* ── User actions ── */
  const doSetAlarm = () => { setAlarmOn(true); setPhase("idle"); showToast(); };
  const cancelAlarm = () => {
    stopAudio(); setAlarmOn(false); setPhase("idle");
    setSnoozeLeft(0); setSnoozeEndsAt(null);
  };

  /** User taps "Snooze" in popup — stops audio, schedules re-ring */
  const handleSnooze = () => {
    stopAudio();
    const remaining = snoozeLeft - 1;
    if (remaining >= 0) {
      setPhase("snoozed");
      setSnoozeLeft(remaining);
      setSnoozeEndsAt(Date.now() + snoozeMins * 60_000);
    } else {
      setPhase("idle"); setAlarmOn(false);
    }
  };

  /** User taps "Dismiss" — stop everything permanently */
  const handleDismiss = () => {
    stopAudio(); setPhase("idle"); setAlarmOn(false);
    setSnoozeLeft(0); setSnoozeEndsAt(null);
  };

  /* ── Toast ── */
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = () => {
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  };

  /* ── Tone dropdown ── */
  const [toneOpen, setToneOpen] = useState(false);
  const selectedToneLabel = TONES.find(t => t.id === tone)?.label ?? "Tone - 1";

  /* ── Repeat ── */
  const toggleDay = (d: number) => {
    setRepeatDays(prev => { const s = new Set(prev); s.has(d) ? s.delete(d) : s.add(d); return s; });
  };
  const repeatLabel = repeatDays.size === 0 ? "Never"
    : repeatDays.size === 7 ? "Every day"
    : repeatDays.size === 5 && ![0,6].some(d => repeatDays.has(d)) ? "Weekdays"
    : DAY_LABELS.filter((_, i) => repeatDays.has(i)).join(", ");

  /* ── Formatted clock ── */
  let curH = now.getHours(); const curM = now.getMinutes(); const curS = now.getSeconds();
  const curAP = curH >= 12 ? "PM" : "AM"; curH = curH % 12 || 12;
  const alarmTimeDisplay = `${hour}:${pad2(Number(minute))} ${ampm}`;

  /* ── Snooze badge label ── */
  const snoozeMin  = Math.floor(snoozeCountdown / 60);
  const snoozesSec = snoozeCountdown % 60;
  const snoozeTimerStr = `${pad2(snoozeMin)}:${pad2(snoozesSec)}`;

  return (
    <div className={`screen alarm-screen ${fadeIn ? "visible" : ""}`}>

      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title"><span className="topbar-om">ॐ</span> Clock &amp; Alarm</div>
        <div className="topbar-spacer" />
      </div>

      <div className="alarm-body">

        {/* ── Live Clock ── */}
        <div className="live-clock-card">
          <div className="live-clock-icon"><i className="fa-solid fa-clock" /></div>
          <div className="live-time">{`${curH}:${pad2(curM)}:${pad2(curS)}`}</div>
          <div className="live-ampm">{curAP}</div>
          {alarmOn && phase === "idle" && (
            <div className="alarm-active-badge">
              <i className="fa-solid fa-bell" />
              <span>Alarm set — {alarmTimeDisplay}{alarmName ? ` · ${alarmName}` : ""}</span>
            </div>
          )}
          {phase === "snoozed" && (
            <div className="alarm-active-badge alarm-snooze-badge">
              <i className="fa-solid fa-moon" />
              <span>Snoozed — rings in {snoozeTimerStr} · {snoozeLeft} snooze{snoozeLeft !== 1 ? "s" : ""} left</span>
            </div>
          )}
        </div>

        {/* ── Alarm Status Strip ── */}
        <div className="alarm-status-strip">
          {alarmOn || phase !== "idle" ? (
            <>
              <i className="fa-solid fa-bell alarm-status-icon active" />
              <span className="alarm-status-text active">
                Next Alarm: <strong>{alarmTimeDisplay}</strong>
                {alarmName ? <span className="alarm-status-name"> · {alarmName}</span> : null}
              </span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-bell-slash alarm-status-icon inactive" />
              <span className="alarm-status-text inactive">No Active Alarm</span>
            </>
          )}
        </div>

        {/* ── Alarm Settings Panel ── */}
        <div className="alarm-panel">
          <div className="alarm-panel-heading">
            <i className="fa-solid fa-bell" /><span>Alarm Settings</span>
          </div>

          {/* Wheel row */}
          <div className="wheel-row">
            <WheelPicker label="Hour"    items={HOURS}     value={hour}   onChange={setHour} />
            <div className="wheel-sep">:</div>
            <WheelPicker label="Minute"  items={MINUTES}   value={minute} onChange={setMinute} format={v => pad2(Number(v))} />
            <div className="wheel-sep-thin" />
            <WheelPicker label="AM / PM" items={AMPM_LIST} value={ampm}   onChange={setAmpm} />
          </div>

          <div className="alarm-divider" />

          {/* Repeat */}
          <div className="alarm-option-row">
            <div className="aopt-left">
              <i className="fa-solid fa-rotate aopt-icon" />
              <div className="aopt-text">
                <span className="aopt-title">Repeat</span>
                <span className="aopt-sub">{repeatLabel}</span>
              </div>
            </div>
            <div className="day-chips">
              {DAY_LABELS.map((lbl, i) => (
                <button key={i} className={`day-chip ${repeatDays.has(i) ? "on" : ""}`} onClick={() => toggleDay(i)}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="alarm-divider" />

          {/* Alarm name */}
          <div className="alarm-option-row alarm-option-row--col">
            <div className="aopt-left">
              <i className="fa-solid fa-tag aopt-icon" />
              <span className="aopt-title">Alarm name</span>
            </div>
            <input
              className="alarm-name-input"
              type="text"
              placeholder="e.g. Morning Prayer…"
              maxLength={40}
              value={alarmName}
              onChange={e => setAlarmName(e.target.value)}
            />
          </div>

          <div className="alarm-divider" />

          {/* Vibrate */}
          <div className="alarm-option-row">
            <div className="aopt-left">
              <i className="fa-solid fa-mobile-screen-button aopt-icon" />
              <div className="aopt-text">
                <span className="aopt-title">Vibrate</span>
                <span className="aopt-sub">{vibrate ? "On" : "Off"}</span>
              </div>
            </div>
            <button className={`gold-toggle ${vibrate ? "on" : ""}`} onClick={() => setVibrate(v => !v)}>
              <span className="gold-toggle-knob" />
            </button>
          </div>

          <div className="alarm-divider" />

          {/* Snooze */}
          <div className="alarm-option-row alarm-option-row--col">
            <div className="aopt-left">
              <i className="fa-solid fa-moon aopt-icon" />
              <span className="aopt-title">Snooze</span>
            </div>
            <div className="snooze-row">
              <span className="snooze-group-label">Duration</span>
              <div className="snooze-chips">
                {SNOOZE_DURATIONS.map(d => (
                  <button key={d} className={`snooze-chip ${snoozeMins === d ? "on" : ""}`} onClick={() => setSnoozeMins(d)}>
                    {d} min
                  </button>
                ))}
              </div>
              <span className="snooze-group-label" style={{ marginTop: ".35rem" }}>Times</span>
              <div className="snooze-chips">
                {SNOOZE_COUNTS.map(c => (
                  <button key={c} className={`snooze-chip ${snoozeCount === c ? "on" : ""}`} onClick={() => setSnoozeCount(c)}>
                    {c}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="alarm-divider" />

          {/* Tone dropdown */}
          <div className={`tone-dropdown ${toneOpen ? "open" : ""}`}>
            <button className="tone-dropdown-header" onClick={() => setToneOpen(o => !o)}>
              <div className="tone-dropdown-left">
                <i className="fa-solid fa-music tone-dd-icon" />
                <div className="tone-dd-text">
                  <span className="tone-dd-label">Select Alarm Tone</span>
                  <span className="tone-dd-current">{selectedToneLabel}</span>
                </div>
              </div>
              <i className={`fa-solid fa-chevron-down tone-dd-chevron ${toneOpen ? "rotated" : ""}`} />
            </button>
            <div className="tone-dropdown-body">
              <div className="tone-list">
                {TONES.map(t => (
                  <button key={t.id} className={`tone-item ${tone === t.id ? "selected" : ""}`}
                    onClick={() => { setTone(t.id); setToneOpen(false); }}>
                    <div className="tone-icon-wrap"><i className={`${t.icon} tone-icon`} /></div>
                    <div className="tone-info"><span className="tone-label">{t.label}</span></div>
                    {tone === t.id && <i className="fa-solid fa-circle-check tone-check" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="alarm-actions">
            {alarmOn || phase !== "idle" ? (
              <button className="alarm-cancel-btn" onClick={cancelAlarm}>
                <i className="fa-solid fa-bell-slash" /> Cancel Alarm
              </button>
            ) : (
              <button className="alarm-set-btn" onClick={doSetAlarm}>
                <i className="fa-solid fa-alarm-clock" /> Set Alarm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <div className={`alarm-toast ${toastVisible ? "visible" : ""}`}>
        <i className="fa-solid fa-circle-check alarm-toast-icon" />
        <span>Alarm set for <strong>{alarmTimeDisplay}</strong></span>
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>

      {/* ── Ringing Popup ── */}
      {phase === "ringing" && (
        <div className="alarm-popup-overlay">
          <div className="alarm-popup">
            <div className="popup-krishna-wrap">
              <img src={`${BASE}krishna.jpg`} alt="শ্রীকৃষ্ণ" className="popup-krishna-img"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="popup-krishna-fallback"><i className="fa-solid fa-om" /></div>
            </div>
            <div className="popup-ring-icon"><i className="fa-solid fa-bell popup-bell-icon" /></div>
            <div className="popup-title">হরে কৃষ্ণ!</div>
            {alarmName && <div className="popup-alarm-name">{alarmName}</div>}
            <div className="popup-time">{alarmTimeDisplay}</div>
            {snoozeLeft > 0 && (
              <div className="popup-snooze-info">
                Snooze {snoozeMins} min · {snoozeLeft} left
              </div>
            )}
            <div className="popup-btn-row">
              {snoozeLeft > 0 && (
                <button className="popup-snooze-btn" onClick={handleSnooze}>
                  <i className="fa-solid fa-moon" /> Snooze
                </button>
              )}
              <button className="popup-stop-btn" onClick={handleDismiss}>
                <i className="fa-solid fa-stop" /> Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
