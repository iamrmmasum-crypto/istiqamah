// ===================================================
// ISTIQĀMAH (ٱلِاسْتِقَامَة) - INTERACTIVE CLIENT SCRIPT
// ===================================================

const HABIT_DATABASE = {
  categories: [
    { name: "Spiritual", color: "#10B981", textColor: "#FFFFFF" },
    { name: "Study & Work", color: "#3B82F6", textColor: "#FFFFFF" },
    { name: "Health & Routine", color: "#F59E0B", textColor: "#1E293B" },
    { name: "Mindfulness", color: "#8B5CF6", textColor: "#FFFFFF" },
    { name: "Self-Discipline", color: "#EC4899", textColor: "#FFFFFF" }
  ],
  dailyHabits: [
    { id: "d1", name: "☀️ Early Wake Up (4:45 AM)", category: "Health & Routine", reward: 3.0 },
    { id: "d2", name: "🌅 Fajr Prayer (5:00 AM)", category: "Spiritual", reward: 5.0 },
    { id: "d3", name: "🧘 Meditation & Morning Dhikr (5:30 AM)", category: "Mindfulness", reward: 3.0 },
    { id: "d4", name: "📚 Deep Study - Session 1 (6:00–9:00 AM)", category: "Study & Work", reward: 8.0 },
    { id: "d5", name: "📰 News & Knowledge Reading (9:00–9:30 AM)", category: "Study & Work", reward: 2.0 },
    { id: "d6", name: "🥗 Healthy Breakfast & Rest (9:30–10:00 AM)", category: "Health & Routine", reward: 2.0 },
    { id: "d7", name: "📝 Deep Study - Session 2 (10:00 AM–12:00 PM)", category: "Study & Work", reward: 6.0 },
    { id: "d8", name: "🚿 Bath, Grooming & Prep (12:00–1:00 PM)", category: "Health & Routine", reward: 2.0 },
    { id: "d9", name: "🌞 Dhuhr Prayer [Jummah on Fri] (1:00 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d10", name: "🛏️ Sunnah Qaylulah / Power Nap (1:45–2:30 PM)", category: "Health & Routine", reward: 3.0 },
    { id: "d11", name: "📚 Deep Study - Session 3 (2:30–3:30 PM)", category: "Study & Work", reward: 5.0 },
    { id: "d12", name: "🌤️ Asr Prayer (3:45 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d13", name: "🏃 Daily Movement & Outdoor Sun (4:00–4:45 PM)", category: "Health & Routine", reward: 4.0 },
    { id: "d14", name: "📱 Controlled Social Media (4:45–5:15 PM)", category: "Self-Discipline", reward: 3.0 },
    { id: "d15", name: "🌇 Maghrib Prayer & Evening Dhikr (5:15 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d16", name: "🌙 Isha Prayer & Reflection (7:15 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d17", name: "📖 Growth Reading & Knowledge (7:45–9:00 PM)", category: "Mindfulness", reward: 4.0 },
    { id: "d18", name: "🍽️ Healthy Dinner & Family Time (9:00–9:45 PM)", category: "Health & Routine", reward: 3.0 },
    { id: "d19", name: "📵 Digital Sunset / Screen Curfew (10:00 PM)", category: "Self-Discipline", reward: 5.0 },
    { id: "d20", name: "🛡️ Screen Purity & Chastity / No Porn (All Day)", category: "Self-Discipline", reward: 10.0 },
    { id: "d21", name: "💧 Drink 2.5L+ Pure Water (All Day)", category: "Health & Routine", reward: 2.0 },
    { id: "d22", name: "😴 Sleep on Time & Wudu (10:30–11:00 PM)", category: "Health & Routine", reward: 4.0 }
  ],
  weeklyHabits: [
    { id: "w1", name: "🕌 Jummah Prayer & Surah Al-Kahf (Friday)", category: "Spiritual", reward: 10.0 },
    { id: "w2", name: "📖 Weekly Quran & Islamic Lecture", category: "Spiritual", reward: 5.0 },
    { id: "w3", name: "🏃 5km Run / Outdoor Fitness Session", category: "Health & Routine", reward: 5.0 },
    { id: "w4", name: "👨‍👩‍👧 Family Quality Time & Silat ar-Rahim", category: "Mindfulness", reward: 5.0 },
    { id: "w5", name: "🧹 Room & Digital Workspace Deep Clean", category: "Health & Routine", reward: 5.0 },
    { id: "w6", name: "📊 Weekly Habit Audit & Next Week Planning", category: "Study & Work", reward: 5.0 }
  ],
  monthlyHabits: [
    { id: "m1", name: "🌙 Fast 3 White Days (Ayyam al-Beed)", category: "Spiritual", reward: 20.0 },
    { id: "m2", name: "📚 Finish Reading 1 Complete Book", category: "Study & Work", reward: 25.0 },
    { id: "m3", name: "🤝 Sadaqah & Charitable Giving", category: "Spiritual", reward: 15.0 },
    { id: "m4", name: "📈 Monthly Financial & Savings Audit", category: "Study & Work", reward: 15.0 },
    { id: "m5", name: "🎯 Goals & Self-Accountability Review", category: "Mindfulness", reward: 10.0 }
  ],
  oneOffTasks: [
    { id: "o1", name: "🩺 Annual Health & Dental Checkup" },
    { id: "o2", name: "📁 Backup Digital Storage & Study Notes" },
    { id: "o3", name: "🤲 Set Intentions & Du'a List for Quarter" }
  ]
};

// ===================================================
// SWOT ANALYSIS TEMPLATE (قُوَّة، ضَعْف، فُرَص، مَخَاطِر)
// ===================================================
const DEFAULT_SWOT = {
  strengths: [
    { id: "s1", text: "5 Daily Prayers strictly on time with Sunnah Dhikr", tag: "Spiritual" },
    { id: "s2", text: "Disciplined 6-hour Deep Study Sessions (1, 2, and 3)", tag: "Study" },
    { id: "s3", text: "Consistent early morning wake-up at 4:45 AM before Fajr", tag: "Routine" },
    { id: "s4", text: "Screen Purity & Chastity commitment (zero tolerance)", tag: "Self-Discipline" }
  ],
  weaknesses: [
    { id: "w1", text: "Temptation to stretch social media beyond 5:15 PM Maghrib", tag: "Discipline" },
    { id: "w2", text: "Water hydration dip during high-intensity study blocks", tag: "Health" },
    { id: "w3", text: "Slight delay adhering to 10:00 PM digital curfew / screen sunset", tag: "Routine" }
  ],
  opportunities: [
    { id: "o1", text: "Golden 3-hour morning window (6:00–9:00 AM) for deep work", tag: "Career" },
    { id: "o2", text: "Fasting 3 White Days (Ayyam al-Beed) for spiritual elevation", tag: "Spiritual" },
    { id: "o3", text: "Post-Isha (7:45–9:00 PM) growth reading & Quran reflection", tag: "Mindfulness" },
    { id: "o4", text: "Weekly 5km outdoor run / fitness session for stamina", tag: "Health" }
  ],
  threats: [
    { id: "t1", text: "Late-night screen stimulation disrupting 10:30 PM sleep", tag: "Environment" },
    { id: "t2", text: "Burnout fatigue if Sunnah Qaylulah (1:45–2:30 PM) is skipped", tag: "Energy" },
    { id: "t3", text: "Unplanned social interruptions during scheduled study blocks", tag: "Focus" }
  ]
};

// Application State
const _initialNow = new Date();
const _initYear = _initialNow.getFullYear();
let currentYear = (_initYear >= 2026 && _initYear <= 2036) ? _initYear : 2026;
let currentMonth = (_initYear >= 2026 && _initYear <= 2036) ? _initialNow.getMonth() : 0;
let soundEnabled = true;
let currentLang = localStorage.getItem("istiqamah_lang") || "en";

// Key for LocalStorage
const STORAGE_KEY = "istiqamah_tracker_state_2026";
let trackerState = loadState();

// ===================================================
// FIREBASE FIRESTORE CLOUD VAULT (LIFETIME STORAGE)
// ===================================================
const firebaseConfig = {
  apiKey: "AIzaSyABy9Iy1g6AEBb_Jhgu2FpZvigKtvaSd0A",
  authDomain: "istiqamah-tracker-adc12.firebaseapp.com",
  projectId: "istiqamah-tracker-adc12",
  storageBucket: "istiqamah-tracker-adc12.firebasestorage.app",
  messagingSenderId: "252739933577",
  appId: "1:252739933577:web:fde1b6a19f61c12677bd58",
  measurementId: "G-XHKMB46MNZ"
};

let db = null;
let currentPinHash = localStorage.getItem("istiqamah_pin_hash") || null;
let firestoreUnsub = null;
let syncDebounceTimer = null;
let isRemoteUpdate = false;
let cloudSyncState = "disconnected"; // "synced", "syncing", "disconnected", "offline"

function initFirebase() {
  try {
    if (typeof firebase !== "undefined" && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    } else if (typeof firebase !== "undefined") {
      db = firebase.firestore();
    }
  } catch (err) {
    console.warn("Firebase initialization warning:", err);
  }
}

async function hashPin(pin) {
  const clean = (pin || "").trim();
  if (!clean) return "";
  try {
    if (window.crypto && crypto.subtle) {
      const enc = new TextEncoder();
      const data = enc.encode("istiqamah_salt_v1_" + clean);
      const hashBuf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
    }
  } catch (e) {}
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i);
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(16);
}

function updateCloudStatus(status, text) {
  cloudSyncState = status;
  const btn = document.getElementById("btn-cloud-status");
  const icon = document.getElementById("cloud-status-icon");
  const txt = document.getElementById("cloud-status-text");
  if (!btn || !icon || !txt) return;

  btn.classList.remove("synced", "syncing", "offline");
  if (status === "synced") {
    btn.classList.add("synced");
    icon.innerText = "🟢";
    txt.innerText = text || "Cloud Synced";
  } else if (status === "syncing") {
    btn.classList.add("syncing");
    icon.innerText = "🔄";
    txt.innerText = text || "Syncing...";
  } else if (status === "offline") {
    btn.classList.add("offline");
    icon.innerText = "⚠️";
    txt.innerText = text || "Offline";
  } else {
    icon.innerText = "☁️";
    txt.innerText = text || "Enter PIN";
  }
}

function connectCloudSync(pinHash) {
  initFirebase();
  if (!db || !pinHash) {
    updateCloudStatus("disconnected");
    return;
  }
  if (firestoreUnsub) {
    firestoreUnsub();
    firestoreUnsub = null;
  }

  updateCloudStatus("syncing");
  const docRef = db.collection("vaults").doc(pinHash);

  firestoreUnsub = docRef.onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      if (data && !isRemoteUpdate) {
        trackerState = {
          checks: { ...trackerState.checks, ...(data.checks || {}) },
          weeklyChecks: { ...trackerState.weeklyChecks, ...(data.weeklyChecks || {}) },
          monthlyChecks: { ...trackerState.monthlyChecks, ...(data.monthlyChecks || {}) },
          oneOffChecks: { ...trackerState.oneOffChecks, ...(data.oneOffChecks || {}) },
          swot: data.swot || trackerState.swot || JSON.parse(JSON.stringify(DEFAULT_SWOT)),
          reportName: data.reportName || trackerState.reportName || "My habits",
          startDate: data.startDate || trackerState.startDate || "Jan 1, 2026"
        };
        saveLocalOnly();
        renderDailyMatrix();
        renderSubTrackers();
        renderYearlyView();
        renderSwotView();
      }
      updateCloudStatus("synced");
    } else {
      // First time initialization for this PIN in Firestore!
      isRemoteUpdate = true;
      docRef.set({
        checks: trackerState.checks,
        weeklyChecks: trackerState.weeklyChecks,
        monthlyChecks: trackerState.monthlyChecks,
        oneOffChecks: trackerState.oneOffChecks,
        swot: trackerState.swot || DEFAULT_SWOT,
        reportName: trackerState.reportName,
        startDate: trackerState.startDate,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        updateCloudStatus("synced");
        showToast("✨ Cloud Vault initialized with your lifetime habits!");
      }).catch(err => {
        console.error("Firestore init error:", err);
        updateCloudStatus("offline");
      }).finally(() => {
        setTimeout(() => { isRemoteUpdate = false; }, 300);
      });
    }
  }, (err) => {
    console.error("Firestore onSnapshot error:", err);
    updateCloudStatus("offline");
  });
}

function loadState() {
  const defaults = {
    checks: {},
    weeklyChecks: {},
    monthlyChecks: {},
    oneOffChecks: {},
    swot: JSON.parse(JSON.stringify(DEFAULT_SWOT)),
    reportName: "My habits",
    startDate: "Nov 15, 2026"
  };
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return {
          checks: parsed.checks || {},
          weeklyChecks: parsed.weeklyChecks || {},
          monthlyChecks: parsed.monthlyChecks || {},
          oneOffChecks: parsed.oneOffChecks || {},
          swot: (parsed.swot && parsed.swot.strengths) ? parsed.swot : JSON.parse(JSON.stringify(DEFAULT_SWOT)),
          reportName: parsed.reportName || "My habits",
          startDate: parsed.startDate || "Nov 15, 2026"
        };
      }
    } catch (e) {}
  }
  return defaults;
}

function saveLocalOnly() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
}

function saveState() {
  saveLocalOnly();

  // If connected to Firestore Cloud Vault, push changes in real-time
  if (db && currentPinHash) {
    updateCloudStatus("syncing");
    clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      isRemoteUpdate = true;
      const docRef = db.collection("vaults").doc(currentPinHash);
      docRef.set({
        checks: trackerState.checks,
        weeklyChecks: trackerState.weeklyChecks,
        monthlyChecks: trackerState.monthlyChecks,
        oneOffChecks: trackerState.oneOffChecks,
        swot: trackerState.swot || DEFAULT_SWOT,
        reportName: trackerState.reportName,
        startDate: trackerState.startDate,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true }).then(() => {
        updateCloudStatus("synced");
      }).catch((err) => {
        console.error("Firestore push error:", err);
        updateCloudStatus("offline");
      }).finally(() => {
        setTimeout(() => { isRemoteUpdate = false; }, 300);
      });
    }, 400);
  }
}

// Procedural Audio Synthesizer (Lazy-loaded to comply with browser autoplay policies)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

function playBeep(isCheck) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (isCheck) {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.08); // E4
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (err) {}
}

// Calendar helpers
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayWeekday(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
}

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const MONTH_NAMES_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];
const MONTH_NAMES = MONTH_NAMES_EN;

const WEEKDAY_NAMES_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
const WEEKDAY_NAMES = WEEKDAY_NAMES_EN;

function getMonthName(monthIdx) {
  return currentLang === "bn" ? MONTH_NAMES_BN[monthIdx] : MONTH_NAMES_EN[monthIdx];
}
function getWeekdayName(dayIdx) {
  return currentLang === "bn" ? WEEKDAY_NAMES_BN[dayIdx] : WEEKDAY_NAMES_EN[dayIdx];
}

// ===================================================
// I18N BILINGUAL SYSTEM (ENGLISH ⇄ বাংলা)
// ===================================================
const I18N = {
  en: {
    lang_btn: "বাংলা",
    nav_monthly: "Monthly Habits",
    nav_yearly: "Yearly View (2026–2036)",
    nav_fields: "Fields & Categories",
    nav_rewards: "Reward Selector",
    nav_swot: "SWOT Analysis",
    banner_monthly_title: "ٱلِاسْتِقَامَة — MONTHLY HABITS",
    summary_label: "SUMMARY",
    edit_range: "EDIT RANGE",
    view_from: "View from",
    completion_rate: "COMPLETION RATE",
    complete_to_date: "Complete to date:",
    reward_economy: "REWARD ECONOMY",
    total_earned_to_date: "Total earned to date:",
    month_view: "MONTH VIEW",
    week_prefix: "Week",
    daily_habits: "Daily habits",
    daily_completed_pct: "Daily completed (%)",
    week_completed_pct: "Week completed (%):",
    daily_reward_earned: "Daily reward earned ($):",
    today_badge: "Today",
    locked_past_date: "Locked: Past date ({day} {month}) - View Only",
    weekly_habits_title: "WEEKLY HABITS",
    weekly_badge: "Weeks 1 – 5",
    weekly_tasks_th: "Weekly tasks",
    earned_th: "Earned",
    weekly_progress: "Weekly Progress:",
    monthly_habits_title: "MONTHLY HABITS & ONE-OFF TASKS",
    monthly_badge: "Monthly Milestones",
    monthly_habits_th: "Monthly habits",
    status_th: "Status",
    oneoff_tasks_th: "One-off tasks for this month",
    done_th: "Done",
    monthly_tasks_done: "Monthly Tasks Done:",
    yearly_banner_title: "ٱلِاسْتِقَامَة — ANNUAL CONSISTENCY HEATMAPS",
    swot_banner_title: "ٱلِاسْتِقَامَة — PERSONAL SWOT ANALYSIS",
    swot_banner_sub: "Strategic Self-Audit & Habit Alignment Framework",
    swot_audit_title: "Habit & Character Audit",
    swot_audit_desc: "Analyze your internal habits (Strengths & Weaknesses) and external dynamics (Opportunities & Threats) to sustain true Istiqāmah.",
    btn_auto_audit: "Auto-Audit From Habits",
    btn_add_factor: "Add Factor",
    btn_reset_template: "Reset Template",
    btn_sound_on: "Sound: ON",
    btn_sound_off: "Sound: OFF",
    btn_download_excel: "Download Excel (.xlsx)",
    btn_reset_month: "Reset Month",
    cloud_synced: "Cloud Synced",
    cloud_syncing: "Syncing...",
    cloud_offline: "Offline"
  },
  bn: {
    lang_btn: "English",
    nav_monthly: "মাসিক অভ্যাস",
    nav_yearly: "বার্ষিক ভিউ (২০২৬–২০৩৬)",
    nav_fields: "ক্যাটাগরি ও ব্যাকআপ",
    nav_rewards: "রিওয়ার্ড সিলেক্টর",
    nav_swot: "সোয়াট অ্যানালাইসিস",
    banner_monthly_title: "ٱلِاسْتِقَامَة — মাসিক অভ্যাস",
    summary_label: "সারাংশ",
    edit_range: "রেঞ্জ নির্বাচন",
    view_from: "মাস নির্বাচন",
    completion_rate: "সম্পন্নের হার",
    complete_to_date: "আজ পর্যন্ত সম্পন্ন:",
    reward_economy: "অর্জিত রিওয়ার্ড",
    total_earned_to_date: "সর্বমোট অর্জিত:",
    month_view: "মাসিক ভিউ",
    week_prefix: "সপ্তাহ",
    daily_habits: "দৈনিক অভ্যাসসমূহ",
    daily_completed_pct: "দৈনিক সম্পন্ন (%)",
    week_completed_pct: "সপ্তাহ সম্পন্ন (%):",
    daily_reward_earned: "দৈনিক অর্জিত রিওয়ার্ড ($):",
    today_badge: "আজ",
    locked_past_date: "লক করা: পূর্ববর্তী তারিখ ({day} {month}) - শুধু দেখার জন্য",
    weekly_habits_title: "সাপ্তাহিক অভ্যাসসমূহ",
    weekly_badge: "সপ্তাহ ১ – ৫",
    weekly_tasks_th: "সাপ্তাহিক কাজসমূহ",
    earned_th: "অর্জিত",
    weekly_progress: "সাপ্তাহিক অগ্রগতি:",
    monthly_habits_title: "মাসিক অভ্যাস ও এককালীন কাজসমূহ",
    monthly_badge: "মাসিক মাইলফলক",
    monthly_habits_th: "মাসিক অভ্যাসসমূহ",
    status_th: "স্ট্যাটাস",
    oneoff_tasks_th: "চলতি মাসের এককালীন কাজসমূহ",
    done_th: "সম্পন্ন",
    monthly_tasks_done: "মাসিক কাজ সম্পন্ন:",
    yearly_banner_title: "ٱلِاسْتِقَامَة — বার্ষিক ধারাবাহিকতা হিটম্যাপ",
    swot_banner_title: "ٱلِاسْتِقَامَة — ব্যক্তিগত সোয়াট অ্যানালাইসিস",
    swot_banner_sub: "কৌশলগত আত্ম-অডিট ও অভ্যাস বিন্যাস ফ্রেমওয়ার্ক",
    swot_audit_title: "অভ্যাস ও চরিত্র অডিট",
    swot_audit_desc: "ধারাবাহিক ইস্তিকামাহ বজায় রাখতে আপনার অভ্যন্তরীণ অভ্যাস (শক্তি ও দুর্বলতা) এবং বাহ্যিক সুযোগ ও ঝুঁকি বিশ্লেষণ করুন।",
    btn_auto_audit: "অভ্যাস থেকে অটো-অডিট",
    btn_add_factor: "নতুন বিষয় যোগ",
    btn_reset_template: "টেমপ্লেট রিসেট",
    btn_sound_on: "সাউন্ড: চালু",
    btn_sound_off: "সাউন্ড: বন্ধ",
    btn_download_excel: "এক্সেল ডাউনলোড (.xlsx)",
    btn_reset_month: "মাস রিসেট",
    cloud_synced: "ক্লাউড সিঙ্কড",
    cloud_syncing: "সিঙ্ক হচ্ছে...",
    cloud_offline: "অফলাইন"
  },
  habits_bn: {
    // Daily Habits
    "d1": "☀️ ভোর ৪:৪৫-এ ঘুম থেকে ওঠা",
    "d2": "🌅 ফজর নামাজ (৫:০০ AM)",
    "d3": "🧘 ধ্যান ও সকালের যিকির (৫:৩০ AM)",
    "d4": "📚 ডিপ স্টাডি - সেশন ১ (৬:০০–৯:০০ AM)",
    "d5": "📰 খবর ও জ্ঞানমূলক পাঠ (৯:০০–৯:৩০ AM)",
    "d6": "🥗 স্বাস্থ্যকর সকালের নাস্তা (৯:৩০–১০:০০ AM)",
    "d7": "📝 ডিপ স্টাডি - সেশন ২ (১০:০০ AM–১২:০০ PM)",
    "d8": "🚿 গোসল ও ব্যক্তিগত প্রস্তুতি (১২:০০–১:০০ PM)",
    "d9": "🌞 জোহর নামাজ [শুক্রবারে জুমুআ] (১:০০ PM)",
    "d10": "🛏️ সুন্নতি কায়লুলাহ / পাওয়ার ন্যাপ (১:৪৫–২:৩০ PM)",
    "d11": "📚 ডিপ স্টাডি - সেশন ৩ (২:৩০–৩:৩০ PM)",
    "d12": "🌤️ আসর নামাজ (৩:৪৫ PM)",
    "d13": "🏃 শারীরিক ব্যায়াম ও রোদ গ্রহণ (৪:০০–৪:৪৫ PM)",
    "d14": "📱 নিয়ন্ত্রিত সোশ্যাল মিডিয়া (৪:৪৫–৫:১৫ PM)",
    "d15": "🌇 মাগরিব নামাজ ও সন্ধ্যার যিকির (৫:১৫ PM)",
    "d16": "🌙 এশা নামাজ ও আত্মবিশ্লেষণ (৭:১৫ PM)",
    "d17": "📖 গঠনমূলক পাঠ ও জ্ঞানার্জন (৭:৪৫–৯:০০ PM)",
    "d18": "🍽️ স্বাস্থ্যকর রাতের খাবার ও পরিবার (৯:০০–৯:৪৫ PM)",
    "d19": "📵 ডিজিটাল স্ক্রিন কার্ফু (১০:০০ PM)",
    "d20": "🛡️ দৃষ্টি ও স্ক্রিন পবিত্রতা / নো পর্ন (সারাদিন)",
    "d21": "💧 ২.৫ লিটার+ বিশুদ্ধ পানি পান (সারাদিন)",
    "d22": "😴 ওজুসহ সময়মতো ঘুম (১০:৩০–১১:০০ PM)",
    // Weekly Habits
    "w1": "🕌 জুমুআ নামাজ ও সূরা আল-কাহাফ (শুক্রবার)",
    "w2": "📖 সাপ্তাহিক কুরআন তেলাওয়াত ও ইসলামী লেকচার",
    "w3": "🏃 ৫ কিমি দৌড় / ফিটনেস সেশন",
    "w4": "👨‍👩‍👧 পরিবারের সাথে গুণগত সময় ও আত্মীয়তার সম্পর্ক",
    "w5": "🧹 ঘর ও ডিজিটাল ওয়ার্কস্পেস পরিচ্ছন্নকরণ",
    "w6": "📊 সাপ্তাহিক অভ্যাস অডিট ও পরিকল্পনা",
    // Monthly Habits
    "m1": "🌙 আইয়ামে বীজের ৩টি রোজা পালন",
    "m2": "📚 ১টি পূর্ণাঙ্গ বই পড়ে শেষ করা",
    "m3": "🤝 সাদাকাহ ও দান-খয়রাত",
    "m4": "📈 মাসিক আর্থিক হিসাব ও সঞ্চয় অডিট",
    "m5": "🎯 লক্ষ্য ও আত্মজবাবদিহিতা পর্যালোচনা",
    // One-Off Tasks
    "o1": "🩺 বার্ষিক স্বাস্থ্য ও ডেন্টাল চেকআপ",
    "o2": "📁 ডিজিটাল স্টোরেজ ও স্টাডি নোট ব্যাকআপ",
    "o3": "🤲 ত্রৈমাসিক নিয়ত ও দোয়ার তালিকা তৈরি"
  },
  categories_bn: {
    "Spiritual": "আধ্যাত্মিক",
    "Study & Work": "পড়াশোনা ও কাজ",
    "Health & Routine": "স্বাস্থ্য ও রুটিন",
    "Mindfulness": "মননশীলতা",
    "Self-Discipline": "আত্মনিয়ন্ত্রণ"
  },
  swot_en: {
    "s1": "5 Daily Prayers strictly on time with Sunnah Dhikr",
    "s2": "Disciplined 6-hour Deep Study Sessions (1, 2, and 3)",
    "s3": "Consistent early morning wake-up at 4:45 AM before Fajr",
    "s4": "Screen Purity & Chastity commitment (zero tolerance)",
    "w1": "Temptation to stretch social media beyond 5:15 PM Maghrib",
    "w2": "Water hydration dip during high-intensity study blocks",
    "w3": "Slight delay adhering to 10:00 PM digital curfew / screen sunset",
    "o1": "Golden 3-hour morning window (6:00–9:00 AM) for deep work",
    "o2": "Fasting 3 White Days (Ayyam al-Beed) for spiritual elevation",
    "o3": "Post-Isha (7:45–9:00 PM) growth reading & Quran reflection",
    "o4": "Weekly 5km outdoor run / fitness session for stamina",
    "t1": "Late-night screen stimulation disrupting 10:30 PM sleep",
    "t2": "Burnout fatigue if Sunnah Qaylulah (1:45–2:30 PM) is skipped",
    "t3": "Unplanned social interruptions during scheduled study blocks"
  },
  swot_bn: {
    "s1": "৫ ওয়াক্ত নামাজ জামাত ও সুন্নাহসহ সময়মতো আদায়",
    "s2": "সুশৃঙ্খল ৬ ঘণ্টার ৩টি গভীর স্টাডি সেশন (১, ২, ৩)",
    "s3": "নিয়মিত ফজরের পূর্বে ভোর ৪:৪৫-এ ঘুম থেকে ওঠা",
    "s4": "দৃষ্টি ও স্ক্রিনের কঠোর পবিত্রতা / নো পর্ন কমিটমেন্ট",
    "w1": "মাগরিবের (৫:১৫ PM) আগে অপ্রয়োজনে অতিরিক্ত সোশ্যাল মিডিয়া ব্রাউজিং",
    "w2": "টানা পড়ার সময় পর্যাপ্ত বিশুদ্ধ পানি পান না করা",
    "w3": "রাত ১০:০০ টার ডিজিটাল স্ক্রিন কার্ফু মানতে মাঝে মাঝে দেরি হওয়া",
    "o1": "সকালের ৩ ঘণ্টার গোল্ডেন আওয়ার (৬:০০–৯:০০ AM) পড়াশোনায় সেরা আউটপুট",
    "o2": "আইয়ামে বীজের ৩টি সুন্নতি রোজা রেখে আত্মশুদ্ধি অর্জন",
    "o3": "এশার পর (৭:৪৫–৯:০০ PM) কুরআন তাদাব্বুর ও গঠনমূলক বই পাঠ",
    "o4": "সাপ্তাহিক ৫ কিমি দৌড় ও ফিটনেস দিয়ে শারীরিক স্ট্যামিনা বৃদ্ধি",
    "t1": "দেরি করে মোবাইল ব্যবহার করে রাত ১০:৩০ টার ঘুম ব্যাহত হওয়া",
    "t2": "দুপুরের সুন্নতি কায়লুলাহ (১:৪৫–২:৩০ PM) মিস হলে বিকেলের ক্লান্তি ও বার্নআউট",
    "t3": "পড়ার সময় ডিজিটাল নোটিফিকেশন ও অপ্রত্যাশিত সামাজিক ব্যাঘাত"
  },
  swot_tags_bn: {
    "Spiritual": "আধ্যাত্মিক",
    "Study": "পড়াশোনা",
    "Routine": "রুটিন",
    "Self-Discipline": "আত্মনিয়ন্ত্রণ",
    "Discipline": "আত্মনিয়ন্ত্রণ",
    "Health": "স্বাস্থ্য",
    "Career": "ক্যারিয়ার",
    "Mindfulness": "মননশীলতা",
    "Environment": "পরিবেশ",
    "Energy": "শারীরিক শক্তি",
    "Focus": "মনোযোগ",
    "General": "সাধারণ"
  }
};

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  return dict[key] || I18N.en[key] || key;
}

function getHabitName(habit) {
  if (!habit) return "";
  if (currentLang === "bn" && I18N.habits_bn[habit.id]) {
    return I18N.habits_bn[habit.id];
  }
  return habit.name;
}

function getCategoryName(catName) {
  if (currentLang === "bn" && I18N.categories_bn[catName]) {
    return I18N.categories_bn[catName];
  }
  return catName;
}

function getSwotItemText(item) {
  if (!item) return "";
  if (currentLang === "bn") {
    if (I18N.swot_bn[item.id]) return I18N.swot_bn[item.id];
  } else {
    if (I18N.swot_en[item.id]) return I18N.swot_en[item.id];
  }
  return item.text;
}

function getSwotItemTag(tag) {
  if (!tag) return currentLang === "bn" ? "সাধারণ" : "General";
  if (currentLang === "bn" && I18N.swot_tags_bn[tag]) {
    return I18N.swot_tags_bn[tag];
  }
  return tag;
}

function getWeekClassForDay(day) {
  if (day <= 7) return "bg-wk1";
  if (day <= 14) return "bg-wk2";
  if (day <= 21) return "bg-wk3";
  if (day <= 28) return "bg-wk4";
  return "bg-wk5";
}

function getCategoryMeta(catName) {
  return HABIT_DATABASE.categories.find(c => c.name === catName) || { color: "#CBD5E1", textColor: "#000000" };
}

// Date Locking Helpers (Tracking starts today: Nov 15, 2026; past dates blocked)
function isDateBeforeToday(year, month, day) {
  const target = new Date(year, month, day, 0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

function isDateToday(year, month, day) {
  const today = new Date();
  return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
}

function isMonthBeforeCurrent(year, month) {
  const today = new Date();
  const currentY = today.getFullYear();
  const currentM = today.getMonth();
  return year < currentY || (year === currentY && month < currentM);
}

// ===================================================
// ACTIVE MONTH WEEKS CONFIGURATION
// ===================================================
function getMonthWeeksConfig(totalDays) {
  const pfx = t("week_prefix");
  const weeks = [
    { name: `${pfx} 1 (%)`, start: 1, end: 7, class: "bg-wk1" },
    { name: `${pfx} 2 (%)`, start: 8, end: 14, class: "bg-wk2" },
    { name: `${pfx} 3 (%)`, start: 15, end: 21, class: "bg-wk3" },
    { name: `${pfx} 4 (%)`, start: 22, end: 28, class: "bg-wk4" }
  ];
  if (totalDays >= 29) {
    weeks.push({ name: `${pfx} 5 (%)`, start: 29, end: totalDays, class: "bg-wk5" });
  }
  return weeks;
}

// ===================================================
// RENDER DAILY MATRIX
// ===================================================
function renderDailyMatrix() {
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayWeekday(currentYear, currentMonth);
  const thead = document.getElementById("daily-matrix-thead");
  const tbody = document.getElementById("daily-matrix-tbody");
  const tfoot = document.getElementById("daily-matrix-tfoot");

  const weeks = getMonthWeeksConfig(totalDays);

  // 1. HEADER ROW 1: Week Banners
  let rowWeeksHtml = `<tr class="row-weeks"><th class="th-habit-name">${t("daily_habits")}</th>`;
  weeks.forEach(w => {
    const span = w.end - w.start + 1;
    rowWeeksHtml += `<th colspan="${span}" class="${w.class}">${w.name}</th>`;
  });
  rowWeeksHtml += `</tr>`;

  // 2. HEADER ROW 2: Daily completed (%)
  let rowPctHtml = `<tr class="row-completed-pct"><th class="th-habit-name" style="background:#F8FAFC; color:#64748B;">${t("daily_completed_pct")}</th>`;
  for (let d = 1; d <= totalDays; d++) {
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const isToday = isDateToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-locked" : (isToday ? "col-today" : "");
    rowPctHtml += `<th id="th-pct-day-${d}" class="${extraClass}" style="background:#F1F5F9; color:#1E293B;">0%</th>`;
  }
  rowPctHtml += `</tr>`;

  // 3. HEADER ROW 3: Weekdays (Wed, Thu, Fri...)
  let rowDaysHtml = `<tr class="row-days"><th class="th-habit-name" style="background:#F8FAFC;"></th>`;
  for (let d = 1; d <= totalDays; d++) {
    const dayOfWeek = (firstDay + d - 1) % 7;
    const wkClass = getWeekClassForDay(d);
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const isToday = isDateToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-locked" : (isToday ? "col-today" : "");
    rowDaysHtml += `<th class="${wkClass} ${extraClass}">${getWeekdayName(dayOfWeek)}${isToday ? `<span class="col-today-badge">${t("today_badge")}</span>` : ''}</th>`;
  }
  rowDaysHtml += `</tr>`;

  // 4. HEADER ROW 4: Date numbers (1, 2, 3...)
  let rowNumsHtml = `<tr class="row-date-nums"><th class="th-habit-name" style="background:#F8FAFC;"></th>`;
  for (let d = 1; d <= totalDays; d++) {
    const wkClass = getWeekClassForDay(d);
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const isToday = isDateToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-locked" : (isToday ? "col-today" : "");
    rowNumsHtml += `<th class="${wkClass} ${extraClass}">${d}</th>`;
  }
  rowNumsHtml += `</tr>`;

  thead.innerHTML = rowWeeksHtml + rowPctHtml + rowDaysHtml + rowNumsHtml;

  // 5. BODY: Habit rows
  let tbodyHtml = "";
  HABIT_DATABASE.dailyHabits.forEach(habit => {
    const cat = getCategoryMeta(habit.category);
    tbodyHtml += `<tr>`;
    tbodyHtml += `<td class="td-habit-name" style="background:${cat.color}; color:${cat.textColor};">${getHabitName(habit)}</td>`;

    for (let d = 1; d <= totalDays; d++) {
      const isPast = isDateBeforeToday(currentYear, currentMonth, d);
      const isToday = isDateToday(currentYear, currentMonth, d);
      const key = `${currentYear}-${currentMonth}-${habit.id}-${d}`;
      const checked = trackerState.checks[key] ? "checked" : "";

      if (isPast) {
        tbodyHtml += `<td class="td-past-locked" title="${t('locked_past_date').replace('{day}', d).replace('{month}', getMonthName(currentMonth))}"><input type="checkbox" class="sheet-check" data-habit="${habit.id}" data-day="${d}" aria-label="${getHabitName(habit)} - Day ${d} (Locked)" ${checked} disabled></td>`;
      } else {
        const todayClass = isToday ? "td-today" : "";
        tbodyHtml += `<td class="${todayClass}"><input type="checkbox" class="sheet-check" data-habit="${habit.id}" data-day="${d}" aria-label="${getHabitName(habit)} - Day ${d}" ${checked}></td>`;
      }
    }
    tbodyHtml += `</tr>`;
  });
  tbody.innerHTML = tbodyHtml;

  // 6. FOOTER: Week completed %, Daily reward earned ($)
  let footWkPctHtml = `<tr class="row-week-pct"><td class="tfoot-label bold">${t("week_completed_pct")}</td>`;
  weeks.forEach((w, idx) => {
    const span = w.end - w.start + 1;
    footWkPctHtml += `<td colspan="${span}" id="foot-wk-pct-${idx + 1}" class="${w.class}">0%</td>`;
  });
  footWkPctHtml += `</tr>`;

  let footRewHtml = `<tr class="row-daily-reward"><td class="tfoot-label bold">${t("daily_reward_earned")}</td>`;
  for (let d = 1; d <= totalDays; d++) {
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-locked" : "";
    footRewHtml += `<td id="foot-day-rew-${d}" class="${extraClass}">$0</td>`;
  }
  footRewHtml += `</tr>`;

  tfoot.innerHTML = footWkPctHtml + footRewHtml;

  // Bind change listeners
  tbody.querySelectorAll(".sheet-check").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const habitId = e.target.getAttribute("data-habit");
      const day = e.target.getAttribute("data-day");
      const key = `${currentYear}-${currentMonth}-${habitId}-${day}`;
      trackerState.checks[key] = e.target.checked;
      saveState();
      playBeep(e.target.checked);
      recalculateMetrics();
      renderYearlyView();
    });
  });

  recalculateMetrics();
}

// ===================================================
// RENDER SUB TRACKERS (WEEKLY & MONTHLY)
// ===================================================
function renderSubTrackers() {
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const numWeeks = totalDays >= 29 ? 5 : 4;
  const isPastMonth = isMonthBeforeCurrent(currentYear, currentMonth);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // Weekly habits
  const weeklyTbody = document.getElementById("weekly-habits-tbody");
  let wHtml = "";
  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    const cat = getCategoryMeta(wHabit.category);
    wHtml += `<tr>`;
    wHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${getHabitName(wHabit)}</td>`;
    for (let wk = 1; wk <= 5; wk++) {
      if (wk <= numWeeks) {
        const wEndDay = wk === 1 ? 7 : (wk === 2 ? 14 : (wk === 3 ? 21 : (wk === 4 ? 28 : totalDays)));
        const isPastWeek = isDateBeforeToday(currentYear, currentMonth, wEndDay);
        const isCurrentWeek = (currentYear === todayYear && currentMonth === todayMonth && todayDate >= (wEndDay - 6) && todayDate <= wEndDay);
        const key = `${currentYear}-${currentMonth}-${wHabit.id}-wk${wk}`;
        const checked = trackerState.weeklyChecks[key] ? "checked" : "";

        if (isPastWeek) {
          wHtml += `<td class="center td-past-locked" title="Locked: Past week - View Only"><input type="checkbox" class="sheet-check weekly-check" ${checked} disabled></td>`;
        } else {
          const wkClass = isCurrentWeek ? "td-today" : "";
          wHtml += `<td class="center ${wkClass}"><input type="checkbox" class="sheet-check weekly-check" data-habit="${wHabit.id}" data-week="${wk}" aria-label="${getHabitName(wHabit)} - Week ${wk}" ${checked}></td>`;
        }
      } else {
        wHtml += `<td class="center text-muted" style="background:#F8FAFC;">—</td>`;
      }
    }
    wHtml += `<td class="center green bold" id="w-earned-${wHabit.id}">$0.00</td>`;
    wHtml += `</tr>`;
  });
  weeklyTbody.innerHTML = wHtml;

  weeklyTbody.querySelectorAll(".weekly-check").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const habitId = e.target.getAttribute("data-habit");
      const wk = e.target.getAttribute("data-week");
      const key = `${currentYear}-${currentMonth}-${habitId}-wk${wk}`;
      trackerState.weeklyChecks[key] = e.target.checked;
      saveState();
      playBeep(e.target.checked);
      recalculateMetrics();
      renderYearlyView();
    });
  });

  // Monthly habits & One-offs
  const monthlyTbody = document.getElementById("monthly-habits-tbody");
  let mHtml = "";
  const maxRows = Math.max(HABIT_DATABASE.monthlyHabits.length, HABIT_DATABASE.oneOffTasks.length);

  for (let i = 0; i < maxRows; i++) {
    const mHabit = HABIT_DATABASE.monthlyHabits[i];
    const oTask = HABIT_DATABASE.oneOffTasks[i];

    mHtml += `<tr>`;
    if (mHabit) {
      const cat = getCategoryMeta(mHabit.category);
      const key = `${currentYear}-${currentMonth}-${mHabit.id}`;
      const checked = trackerState.monthlyChecks[key] ? "checked" : "";
      if (isPastMonth) {
        mHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${getHabitName(mHabit)}</td>`;
        mHtml += `<td class="center td-past-locked" title="Locked: Past month - View Only"><input type="checkbox" class="sheet-check monthly-check" ${checked} disabled></td>`;
      } else {
        mHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${getHabitName(mHabit)}</td>`;
        mHtml += `<td class="center"><input type="checkbox" class="sheet-check monthly-check" data-habit="${mHabit.id}" aria-label="${getHabitName(mHabit)}" ${checked}></td>`;
      }
    } else {
      mHtml += `<td></td><td></td>`;
    }

    if (oTask) {
      const key = `${currentYear}-${currentMonth}-${oTask.id}`;
      const checked = trackerState.oneOffChecks[key] ? "checked" : "";
      if (isPastMonth) {
        mHtml += `<td style="background:#F8FAFC;">${getHabitName(oTask)}</td>`;
        mHtml += `<td class="center td-past-locked" title="Locked: Past month - View Only"><input type="checkbox" class="sheet-check oneoff-check" ${checked} disabled></td>`;
      } else {
        mHtml += `<td style="background:#F8FAFC;">${getHabitName(oTask)}</td>`;
        mHtml += `<td class="center"><input type="checkbox" class="sheet-check oneoff-check" data-task="${oTask.id}" aria-label="${getHabitName(oTask)}" ${checked}></td>`;
      }
    } else {
      mHtml += `<td></td><td></td>`;
    }
    mHtml += `</tr>`;
  }
  monthlyTbody.innerHTML = mHtml;

  monthlyTbody.querySelectorAll(".monthly-check").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const habitId = e.target.getAttribute("data-habit");
      const key = `${currentYear}-${currentMonth}-${habitId}`;
      trackerState.monthlyChecks[key] = e.target.checked;
      saveState();
      playBeep(e.target.checked);
      recalculateMetrics();
      renderYearlyView();
    });
  });

  monthlyTbody.querySelectorAll(".oneoff-check").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const taskId = e.target.getAttribute("data-task");
      const key = `${currentYear}-${currentMonth}-${taskId}`;
      trackerState.oneOffChecks[key] = e.target.checked;
      saveState();
      playBeep(e.target.checked);
      recalculateMetrics();
      renderYearlyView();
    });
  });
}

// ===================================================
// CALCULATION HELPER (FOR ANY MONTH)
// ===================================================
function getMonthStats(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const numWeeks = daysInMonth >= 29 ? 5 : 4;
  const totalHabits = HABIT_DATABASE.dailyHabits.length;

  let dailyEarned = 0;
  let dailyChecked = 0;
  let totalDailyPossible = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const isPast = isDateBeforeToday(year, month, d);
    if (!isPast) {
      totalDailyPossible += totalHabits;
    }
    HABIT_DATABASE.dailyHabits.forEach(habit => {
      const key = `${year}-${month}-${habit.id}-${d}`;
      if (trackerState.checks[key]) {
        dailyChecked++;
        dailyEarned += habit.reward;
      }
    });
  }

  let weeklyEarned = 0;
  let weeklyChecked = 0;
  let totalWeeklyPossible = 0;

  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    for (let wk = 1; wk <= numWeeks; wk++) {
      const wEndDay = wk === 1 ? 7 : (wk === 2 ? 14 : (wk === 3 ? 21 : (wk === 4 ? 28 : daysInMonth)));
      const isPastWeek = isDateBeforeToday(year, month, wEndDay);
      if (!isPastWeek) {
        totalWeeklyPossible++;
      }
      const key = `${year}-${month}-${wHabit.id}-wk${wk}`;
      if (trackerState.weeklyChecks[key]) {
        weeklyChecked++;
        weeklyEarned += wHabit.reward;
      }
    }
  });

  let monthlyEarned = 0;
  let monthlyChecked = 0;
  const isPastMonth = isMonthBeforeCurrent(year, month);
  const totalMonthlyPossible = isPastMonth ? 0 : HABIT_DATABASE.monthlyHabits.length;

  HABIT_DATABASE.monthlyHabits.forEach(mHabit => {
    const key = `${year}-${month}-${mHabit.id}`;
    if (trackerState.monthlyChecks[key]) {
      monthlyChecked++;
      monthlyEarned += mHabit.reward;
    }
  });

  const totalPossible = totalDailyPossible + totalWeeklyPossible + totalMonthlyPossible;
  const totalChecked = dailyChecked + weeklyChecked + monthlyChecked;
  const completionPct = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;
  const dailyCompletionPct = totalDailyPossible > 0 ? Math.round((dailyChecked / totalDailyPossible) * 100) : 0;
  const totalEarned = dailyEarned + weeklyEarned + monthlyEarned;

  return {
    dailyChecked,
    dailyEarned,
    dailyCompletionPct,
    weeklyChecked,
    weeklyEarned,
    totalWeeklyPossible,
    monthlyChecked,
    monthlyEarned,
    totalEarned,
    completionPct
  };
}

// Compute total rewards earned all-time across all years & frequencies
function computeAllTimeTotalEarned() {
  let allEarned = 0;

  // 1. Daily
  Object.keys(trackerState.checks).forEach(k => {
    if (trackerState.checks[k]) {
      const parts = k.split("-");
      const habitId = parts[2];
      const habit = HABIT_DATABASE.dailyHabits.find(h => h.id === habitId);
      if (habit) allEarned += habit.reward;
    }
  });

  // 2. Weekly
  Object.keys(trackerState.weeklyChecks).forEach(k => {
    if (trackerState.weeklyChecks[k]) {
      const parts = k.split("-");
      const habitId = parts[2];
      const habit = HABIT_DATABASE.weeklyHabits.find(h => h.id === habitId);
      if (habit) allEarned += habit.reward;
    }
  });

  // 3. Monthly
  Object.keys(trackerState.monthlyChecks).forEach(k => {
    if (trackerState.monthlyChecks[k]) {
      const parts = k.split("-");
      const habitId = parts[2];
      const habit = HABIT_DATABASE.monthlyHabits.find(h => h.id === habitId);
      if (habit) allEarned += habit.reward;
    }
  });

  return allEarned;
}

// ===================================================
// RECALCULATE METRICS & TALLIES FOR CURRENT MONTH
// ===================================================
function recalculateMetrics() {
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const totalHabits = HABIT_DATABASE.dailyHabits.length;
  const weeks = getMonthWeeksConfig(totalDays);
  const numWeeks = totalDays >= 29 ? 5 : 4;

  let monthTotalDailyEarned = 0;
  let totalCheckedDaily = 0;
  const totalPossibleDaily = totalDays * totalHabits;

  // 1. Daily tallies
  const weekSums = new Array(weeks.length).fill(0);
  const weekCounts = new Array(weeks.length).fill(0);

  for (let d = 1; d <= totalDays; d++) {
    let dayChecked = 0;
    let dayEarned = 0;
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);

    HABIT_DATABASE.dailyHabits.forEach(habit => {
      const key = `${currentYear}-${currentMonth}-${habit.id}-${d}`;
      if (trackerState.checks[key]) {
        dayChecked++;
        dayEarned += habit.reward;
      }
    });

    const dayPct = totalHabits > 0 ? Math.round((dayChecked / totalHabits) * 100) : 0;
    const thPct = document.getElementById(`th-pct-day-${d}`);
    if (thPct) thPct.innerText = `${dayPct}%`;

    const footRew = document.getElementById(`foot-day-rew-${d}`);
    if (footRew) footRew.innerText = `$${dayEarned.toFixed(0)}`;

    monthTotalDailyEarned += dayEarned;
    totalCheckedDaily += dayChecked;

    // Week bucket
    let wkIndex = 0;
    if (d <= 7) wkIndex = 0;
    else if (d <= 14) wkIndex = 1;
    else if (d <= 21) wkIndex = 2;
    else if (d <= 28) wkIndex = 3;
    else wkIndex = 4;

    if (wkIndex < weeks.length) {
      weekSums[wkIndex] += dayPct;
      weekCounts[wkIndex]++;
    }
  }

  // Week averages
  for (let w = 0; w < weeks.length; w++) {
    const footWk = document.getElementById(`foot-wk-pct-${w + 1}`);
    if (footWk) {
      const wEndDay = (w === 0 ? 7 : (w === 1 ? 14 : (w === 2 ? 21 : (w === 3 ? 28 : totalDays))));
      const isPastWk = isDateBeforeToday(currentYear, currentMonth, wEndDay);
      if (isPastWk) {
        footWk.innerText = "🔒";
      } else {
        const avg = weekCounts[w] > 0 ? Math.round(weekSums[w] / weekCounts[w]) : 0;
        footWk.innerText = `${avg}%`;
      }
    }
  }

  // 2. Weekly Habits
  let weeklyTotalEarned = 0;
  let totalWeeklyChecked = 0;
  let totalWeeklyPossible = 0;

  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    let hEarned = 0;
    for (let wk = 1; wk <= numWeeks; wk++) {
      const wEndDay = wk === 1 ? 7 : (wk === 2 ? 14 : (wk === 3 ? 21 : (wk === 4 ? 28 : totalDays)));
      const isPastWeek = isDateBeforeToday(currentYear, currentMonth, wEndDay);
      if (!isPastWeek) {
        totalWeeklyPossible++;
      }
      const key = `${currentYear}-${currentMonth}-${wHabit.id}-wk${wk}`;
      if (trackerState.weeklyChecks[key]) {
        hEarned += wHabit.reward;
        totalWeeklyChecked++;
      }
    }
    const earnedCell = document.getElementById(`w-earned-${wHabit.id}`);
    if (earnedCell) earnedCell.innerText = `$${hEarned.toFixed(2)}`;
    weeklyTotalEarned += hEarned;
  });

  const weeklyPct = totalWeeklyPossible > 0 ? Math.round((totalWeeklyChecked / totalWeeklyPossible) * 100) : 0;
  const weeklyPctEl = document.getElementById("weekly-progress-percent");
  if (weeklyPctEl) weeklyPctEl.innerText = `${weeklyPct}%`;
  const weeklyTotalRewEl = document.getElementById("weekly-total-reward");
  if (weeklyTotalRewEl) weeklyTotalRewEl.innerText = `$${weeklyTotalEarned.toFixed(2)}`;

  // 3. Monthly Habits & One-offs
  let monthlyHabitsEarned = 0;
  HABIT_DATABASE.monthlyHabits.forEach(mHabit => {
    const key = `${currentYear}-${currentMonth}-${mHabit.id}`;
    if (trackerState.monthlyChecks[key]) {
      monthlyHabitsEarned += mHabit.reward;
    }
  });
  const monthlyTasksRewEl = document.getElementById("monthly-tasks-reward");
  if (monthlyTasksRewEl) monthlyTasksRewEl.innerText = `$${monthlyHabitsEarned.toFixed(2)}`;

  let oneOffCheckedCount = 0;
  HABIT_DATABASE.oneOffTasks.forEach(oTask => {
    const key = `${currentYear}-${currentMonth}-${oTask.id}`;
    if (trackerState.oneOffChecks[key]) oneOffCheckedCount++;
  });
  const oneOffStatusEl = document.getElementById("oneoff-tasks-status");
  if (oneOffStatusEl) {
    oneOffStatusEl.innerText = `${oneOffCheckedCount} / ${HABIT_DATABASE.oneOffTasks.length} completed`;
  }

  // 4. Overall Monthly Totals
  const totalCombinedEarned = monthTotalDailyEarned + weeklyTotalEarned + monthlyHabitsEarned;
  const monthStats = getMonthStats(currentYear, currentMonth);
  const overallCompletion = monthStats.completionPct;

  const kpiCompletionEl = document.getElementById("kpi-completion-rate");
  if (kpiCompletionEl) kpiCompletionEl.innerText = `${overallCompletion}%`;
  const kpiTotalEl = document.getElementById("kpi-total-earned");
  if (kpiTotalEl) kpiTotalEl.innerText = `$${totalCombinedEarned.toFixed(2)}`;

  const repName = trackerState.reportName || (currentLang === "bn" ? "আমার অভ্যাস" : "My habits");
  const bannerEl = document.getElementById("banner-subtext");
  if (bannerEl) {
    const isPast = isMonthBeforeCurrent(currentYear, currentMonth);
    const mName = getMonthName(currentMonth);
    if (isPast) {
      bannerEl.innerHTML = currentLang === "bn"
        ? `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 — '${repName}' (${mName} ${currentYear}) <span class="locked-badge-banner">🔒 পূর্ববর্তী মাস (লক করা)</span>`
        : `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 — '${repName}' for ${mName} ${currentYear} <span class="locked-badge-banner">🔒 Past Month (Locked)</span>`;
    } else {
      bannerEl.innerHTML = currentLang === "bn"
        ? `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 — '${repName}' (${mName} ${currentYear}) <span style="font-size:11px; color:#10B981; font-weight:700; margin-left:8px;">📍 শুরু: ১৫ নভেম্বর ২০২৬</span>`
        : `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 — '${repName}' for ${mName} ${currentYear} <span style="font-size:11px; color:#10B981; font-weight:700; margin-left:8px;">📍 Started Nov 15, 2026</span>`;
    }
  }
}

// ===================================================
// YEARLY VIEW RENDERER (DYNAMIC REAL-TIME DATA)
// ===================================================
function renderYearlyView() {
  const container = document.getElementById("yearly-months-container");
  if (!container) return;

  let html = "";
  let yearlyEarnedSum = 0;
  let yearlyPctSum = 0;

  MONTH_NAMES_EN.forEach((_, idx) => {
    const isCurrent = idx === currentMonth;
    const stats = getMonthStats(currentYear, idx);
    const mName = getMonthName(idx);

    yearlyEarnedSum += stats.totalEarned;
    yearlyPctSum += stats.completionPct;

    const activeText = isCurrent ? (currentLang === "bn" ? "চলতি" : "ACTIVE") : "";
    const compLabel = currentLang === "bn" ? "মাসিক সম্পন্ন:" : "Monthly Completion:";
    const rewLabel = currentLang === "bn" ? "অর্জিত রিওয়ার্ড:" : "Rewards Accumulated:";

    html += `
      <div class="year-month-card ${isCurrent ? 'active-month' : ''}" data-month="${idx}" style="cursor: pointer;" title="Click to view ${mName}">
        <div class="year-month-header" style="background: ${isCurrent ? '#2563EB' : '#475569'};">
          <h5>${mName.toUpperCase()}</h5>
          <span style="font-size:10px; font-weight:700;">${activeText}</span>
        </div>
        <div class="year-month-body">
          <div class="stat-row">
            <span class="text-muted">${compLabel}</span>
            <span class="bold">${stats.completionPct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${stats.completionPct}%;"></div>
          </div>
          <div class="stat-row mt-2">
            <span class="text-muted">${rewLabel}</span>
            <span class="bold green">$${stats.totalEarned.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add click to jump to month
  container.querySelectorAll(".year-month-card").forEach(card => {
    card.addEventListener("click", () => {
      const targetMonth = parseInt(card.getAttribute("data-month"));
      currentMonth = targetMonth;
      const monthPicker = document.getElementById("month-picker");
      if (monthPicker) monthPicker.value = currentMonth;
      renderDailyMatrix();
      renderSubTrackers();
      renderYearlyView();
      // Switch tab to monthly
      const monthlyTabBtn = document.getElementById("tab-monthly-btn");
      if (monthlyTabBtn) monthlyTabBtn.click();
      showToast(`Switched to ${MONTH_NAMES[currentMonth]} ${currentYear}`);
    });
  });

  // Annual Compound KPI Updates
  const annualAvgCompletion = Math.round(yearlyPctSum / 12);
  const yearlyCompEl = document.getElementById("yearly-completion-rate");
  if (yearlyCompEl) yearlyCompEl.innerText = `${annualAvgCompletion}%`;

  const yearlyEarnedEl = document.getElementById("yearly-total-earned");
  if (yearlyEarnedEl) yearlyEarnedEl.innerText = `$${yearlyEarnedSum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Total All-Time Earned Vault
  const allTimeTotal = computeAllTimeTotalEarned();
  const vaultEl = document.getElementById("rewards-vault-total");
  if (vaultEl) vaultEl.innerText = `$${allTimeTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ===================================================
// FIELDS & REWARD TABLES RENDERER
// ===================================================
function renderFieldsAndRewards() {
  // Categories config
  const catList = document.getElementById("categories-config-list");
  if (catList) {
    let catHtml = "";
    HABIT_DATABASE.categories.forEach(cat => {
      const dailyCount = HABIT_DATABASE.dailyHabits.filter(h => h.category === cat.name).length;
      const weeklyCount = HABIT_DATABASE.weeklyHabits.filter(h => h.category === cat.name).length;
      const monthlyCount = HABIT_DATABASE.monthlyHabits.filter(h => h.category === cat.name).length;
      const countLabel = currentLang === "bn"
        ? `${dailyCount}টি দৈনিক · ${weeklyCount}টি সাপ্তাহিক · ${monthlyCount}টি মাসিক`
        : `${dailyCount} Daily · ${weeklyCount} Weekly · ${monthlyCount} Monthly`;

      catHtml += `
        <div class="category-config-item">
          <div class="cat-config-header">
            <span class="cat-chip" style="background:${cat.color}; color:${cat.textColor};">${getCategoryName(cat.name)}</span>
            <span class="text-muted text-sm ml-auto">${countLabel}</span>
          </div>
        </div>
      `;
    });
    catList.innerHTML = catHtml;
  }

  // Reward settings table
  const rewardTbody = document.getElementById("rewards-settings-tbody");
  if (rewardTbody) {
    let rHtml = "";
    const maxRows = Math.max(HABIT_DATABASE.dailyHabits.length, HABIT_DATABASE.weeklyHabits.length, HABIT_DATABASE.monthlyHabits.length);

    for (let i = 0; i < maxRows; i++) {
      const dH = HABIT_DATABASE.dailyHabits[i];
      const wH = HABIT_DATABASE.weeklyHabits[i];
      const mH = HABIT_DATABASE.monthlyHabits[i];

      rHtml += `<tr>`;
      rHtml += `<td class="bold">${dH ? `<span class="badge-soft" style="background:${getCategoryMeta(dH.category).color}; color:${getCategoryMeta(dH.category).textColor}; padding:2px 6px; border-radius:3px;">${getCategoryName(dH.category)}</span>` : '—'}</td>`;
      rHtml += `<td>${dH ? getHabitName(dH) : '—'}</td>`;
      rHtml += `<td class="green bold">${dH ? '$' + dH.reward.toFixed(2) : '—'}</td>`;
      rHtml += `<td>${wH ? getHabitName(wH) : '—'}</td>`;
      rHtml += `<td class="green bold">${wH ? '$' + wH.reward.toFixed(2) : '—'}</td>`;
      rHtml += `<td>${mH ? getHabitName(mH) : '—'}</td>`;
      rHtml += `<td class="green bold">${mH ? '$' + mH.reward.toFixed(2) : '—'}</td>`;
      rHtml += `</tr>`;
    }
    rewardTbody.innerHTML = rHtml;
  }

  // Bind static field inputs
  const repNameInput = document.getElementById("report-name-input");
  if (repNameInput) {
    repNameInput.value = trackerState.reportName || "My habits";
    repNameInput.addEventListener("input", (e) => {
      trackerState.reportName = e.target.value;
      saveState();
      recalculateMetrics();
    });
  }

  const repStartDate = document.getElementById("report-start-date");
  if (repStartDate) {
    repStartDate.value = trackerState.startDate || "Jan 1, 2026";
    repStartDate.addEventListener("input", (e) => {
      trackerState.startDate = e.target.value;
      saveState();
    });
  }
}

// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  const msgEl = document.getElementById("toast-message");
  if (msgEl) msgEl.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

// Update year globally across pickers
function updateYear(newYear) {
  currentYear = parseInt(newYear);

  const monthlyYearPicker = document.getElementById("monthly-year-picker");
  if (monthlyYearPicker) monthlyYearPicker.value = currentYear;

  const yearPicker = document.getElementById("year-picker");
  if (yearPicker) yearPicker.value = currentYear;

  const bannerSub = document.getElementById("yearly-banner-sub");
  if (bannerSub) {
    bannerSub.innerText = `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 — 'Habits ${currentYear}' through '${currentYear + 10}'`;
  }

  renderDailyMatrix();
  renderSubTrackers();
  renderYearlyView();
  showToast(`Year range set to ${currentYear}`);
}

// ===================================================
// SWOT ANALYSIS LOGIC & RENDERING
// ===================================================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderSwotView() {
  if (!trackerState.swot) {
    trackerState.swot = JSON.parse(JSON.stringify(DEFAULT_SWOT));
  }
  const quadrants = ["strengths", "weaknesses", "opportunities", "threats"];

  quadrants.forEach(quad => {
    const listEl = document.getElementById(`swot-list-${quad}`);
    const countEl = document.getElementById(`swot-count-${quad}`);
    const items = trackerState.swot[quad] || [];

    if (countEl) countEl.innerText = items.length;
    if (!listEl) return;

    if (items.length === 0) {
      const emptyMsg = currentLang === "bn"
        ? `<span>এখনও কোনো বিষয় যুক্ত করা হয়নি।<br>নতুন বিষয় লিখতে <strong>+</strong> অথবা <strong>নতুন বিষয় যোগ</strong> বোতামে ক্লিক করুন।</span>`
        : `<span>No factors recorded yet.<br>Click <strong>+</strong> or <strong>Add Factor</strong> to log one.</span>`;
      listEl.innerHTML = `<div class="swot-empty-hint">${emptyMsg}</div>`;
      return;
    }

    let html = "";
    items.forEach(item => {
      const cleanText = escapeHtml(getSwotItemText(item));
      const cleanTag = escapeHtml(getSwotItemTag(item.tag));
      const delTitle = currentLang === "bn" ? "মুছে ফেলুন" : "Delete factor";
      html += `
        <div class="swot-item">
          <div class="swot-item-body">
            <span class="swot-item-bullet">•</span>
            <span class="swot-item-text">${cleanText}</span>
            <span class="swot-tag">${cleanTag}</span>
          </div>
          <button class="swot-delete-btn" data-quad="${quad}" data-id="${item.id}" title="${delTitle}">🗑️</button>
        </div>
      `;
    });
    listEl.innerHTML = html;
  });

  // Attach delete handlers
  document.querySelectorAll(".swot-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const quad = btn.getAttribute("data-quad");
      const id = btn.getAttribute("data-id");
      if (trackerState.swot && trackerState.swot[quad]) {
        trackerState.swot[quad] = trackerState.swot[quad].filter(i => i.id !== id);
        saveState();
        playBeep(false);
        renderSwotView();
        showToast(currentLang === "bn" ? "সোয়াট থেকে বিষয়টি সরানো হয়েছে।" : "Factor removed from SWOT.");
      }
    });
  });
}

function openSwotModal(defaultQuadrant = "strengths") {
  const modal = document.getElementById("swot-modal");
  const quadSelect = document.getElementById("swot-input-quadrant");
  const textInput = document.getElementById("swot-input-text");
  const tagInput = document.getElementById("swot-input-tag");
  if (!modal) return;
  if (quadSelect) quadSelect.value = defaultQuadrant;
  if (textInput) textInput.value = "";
  if (tagInput) tagInput.value = "";
  modal.classList.add("active");
  setTimeout(() => textInput && textInput.focus(), 100);
}

function closeSwotModal() {
  const modal = document.getElementById("swot-modal");
  if (modal) modal.classList.remove("active");
}

function saveSwotFactorFromModal() {
  const quadSelect = document.getElementById("swot-input-quadrant");
  const textInput = document.getElementById("swot-input-text");
  const tagInput = document.getElementById("swot-input-tag");

  const quad = quadSelect ? quadSelect.value : "strengths";
  const text = textInput ? textInput.value.trim() : "";
  const tag = tagInput ? tagInput.value.trim() : "General";

  if (!text) {
    alert("Please enter a factor or habit description.");
    return;
  }

  if (!trackerState.swot) trackerState.swot = JSON.parse(JSON.stringify(DEFAULT_SWOT));
  if (!trackerState.swot[quad]) trackerState.swot[quad] = [];

  trackerState.swot[quad].push({
    id: quad[0] + "_" + Date.now(),
    text: text,
    tag: tag || "General"
  });

  saveState();
  playBeep(true);
  closeSwotModal();
  renderSwotView();
  showToast(`Added to ${quad.toUpperCase()}!`);
}

function autoAuditFromHabits() {
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const now = new Date();
  const todayDay = (currentYear === now.getFullYear() && currentMonth === now.getMonth()) ? now.getDate() : totalDays;
  const daysEvaluated = Math.max(1, todayDay);

  let addedStrengths = 0;
  let addedWeaknesses = 0;

  if (!trackerState.swot) trackerState.swot = JSON.parse(JSON.stringify(DEFAULT_SWOT));
  if (!trackerState.swot.strengths) trackerState.swot.strengths = [];
  if (!trackerState.swot.weaknesses) trackerState.swot.weaknesses = [];

  HABIT_DATABASE.dailyHabits.forEach(habit => {
    let checkedCount = 0;
    for (let d = 1; d <= daysEvaluated; d++) {
      const key = `${currentYear}-${currentMonth}-${habit.id}-${d}`;
      if (trackerState.checks[key]) checkedCount++;
    }
    const pct = Math.round((checkedCount / daysEvaluated) * 100);
    const shortName = habit.name.split("(")[0].trim();

    // If >= 75% consistency -> Strength
    if (pct >= 75) {
      const exists = trackerState.swot.strengths.some(s => s.text.includes(shortName));
      if (!exists) {
        trackerState.swot.strengths.push({
          id: "s_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          text: `High consistency: ${habit.name} (${pct}% completed this month)`,
          tag: habit.category
        });
        addedStrengths++;
      }
    } else if (pct < 45 && daysEvaluated >= 3) {
      // If < 45% after at least 3 days -> Weakness
      const exists = trackerState.swot.weaknesses.some(w => w.text.includes(shortName));
      if (!exists) {
        trackerState.swot.weaknesses.push({
          id: "w_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          text: `Needs reinforcement: ${habit.name} (only ${pct}% completed)`,
          tag: habit.category
        });
        addedWeaknesses++;
      }
    }
  });

  saveState();
  playBeep(true);
  renderSwotView();
  showToast(`⚡ Auto-Audit: Evaluated ${daysEvaluated} days. +${addedStrengths} Strengths, +${addedWeaknesses} Weaknesses!`);
}

// ===================================================
// BILINGUAL LANGUAGE CONTROLLER (ENGLISH ⇄ বাংলা)
// ===================================================
function updateStaticTexts() {
  const langText = document.getElementById("lang-text");
  if (langText) langText.innerText = currentLang === "bn" ? "English" : "বাংলা";

  // Tabs
  const tabMonthly = document.getElementById("tab-monthly-btn");
  if (tabMonthly) tabMonthly.innerHTML = `<span class="tab-icon">📊</span> ${t("nav_monthly")}`;

  const tabYearly = document.getElementById("tab-yearly-btn");
  if (tabYearly) tabYearly.innerHTML = `<span class="tab-icon">📅</span> ${t("nav_yearly")}`;

  const tabFields = document.getElementById("tab-fields-btn");
  if (tabFields) tabFields.innerHTML = `<span class="tab-icon">⚙️</span> ${t("nav_fields")}`;

  const tabRewards = document.getElementById("tab-rewards-btn");
  if (tabRewards) tabRewards.innerHTML = `<span class="tab-icon">💰</span> ${t("nav_rewards")}`;

  const tabSwot = document.getElementById("tab-swot-btn");
  if (tabSwot) tabSwot.innerHTML = `<span class="tab-icon">🎯</span> ${t("nav_swot")}`;

  // Header buttons
  const btnAudio = document.getElementById("btn-audio-toggle");
  if (btnAudio) btnAudio.innerHTML = `<span id="audio-icon">${soundEnabled ? "🔊" : "🔇"}</span> ${soundEnabled ? t("btn_sound_on") : t("btn_sound_off")}`;

  const btnExcel = document.getElementById("btn-download-excel");
  if (btnExcel) btnExcel.innerHTML = `<span>📥</span> ${t("btn_download_excel")}`;

  const btnReset = document.getElementById("btn-reset-data");
  if (btnReset) btnReset.innerHTML = `<span>🔄</span> ${t("btn_reset_month")}`;

  // Month Picker Dropdown Options
  const monthPicker = document.getElementById("month-picker");
  if (monthPicker) {
    const selectedVal = monthPicker.value;
    for (let i = 0; i < 12; i++) {
      if (monthPicker.options[i]) {
        monthPicker.options[i].text = getMonthName(i);
      }
    }
    monthPicker.value = selectedVal;
  }

  // Monthly View Banners & KPI Labels
  const monthlyBannerH2 = document.querySelector("#view-monthly .banner-title-row h2");
  if (monthlyBannerH2) monthlyBannerH2.innerText = t("banner_monthly_title");

  const summaryLabel = document.querySelector(".summary-section-label");
  if (summaryLabel) summaryLabel.innerText = t("summary_label");

  const kpiLabels = document.querySelectorAll(".kpi-label");
  if (kpiLabels.length >= 3) {
    kpiLabels[0].innerText = t("edit_range");
    kpiLabels[1].innerText = t("completion_rate");
    kpiLabels[2].innerText = t("reward_economy");
  }

  const inputSubs = document.querySelectorAll(".kpi-stat-box .input-sub");
  if (inputSubs.length >= 2) {
    inputSubs[0].innerText = t("complete_to_date");
    inputSubs[1].innerText = t("total_earned_to_date");
  }
  const viewFromSub = document.querySelector(".kpi-input-box .input-sub");
  if (viewFromSub) viewFromSub.innerText = t("view_from");

  const monthViewH3 = document.querySelector(".section-title-bar h3");
  if (monthViewH3) monthViewH3.innerText = t("month_view");

  const legendChips = document.querySelectorAll(".matrix-legend .legend-chip");
  legendChips.forEach((chip, idx) => {
    chip.innerText = `${t("week_prefix")} ${idx + 1}`;
  });

  // Sub-trackers Headers
  const trackerHeaders = document.querySelectorAll(".tracker-card-header h4");
  if (trackerHeaders.length >= 2) {
    trackerHeaders[0].innerText = t("weekly_habits_title");
    trackerHeaders[1].innerText = t("monthly_habits_title");
  }
  const trackerBadges = document.querySelectorAll(".tracker-card-header .badge-soft");
  if (trackerBadges.length >= 2) {
    trackerBadges[0].innerText = t("weekly_badge");
    trackerBadges[1].innerText = t("monthly_badge");
  }

  const thWeeklyTask = document.querySelector("#weekly-habits-table .th-task");
  if (thWeeklyTask) thWeeklyTask.innerText = t("weekly_tasks_th");

  const thWeeklyRew = document.querySelector("#weekly-habits-table .th-rew");
  if (thWeeklyRew) thWeeklyRew.innerText = t("earned_th");

  const tdWeeklyProg = document.querySelector("#weekly-habits-table tfoot td:first-child");
  if (tdWeeklyProg) tdWeeklyProg.innerText = t("weekly_progress");

  const thMonthly = document.querySelectorAll("#monthly-habits-table thead th");
  if (thMonthly.length >= 4) {
    thMonthly[0].innerText = t("monthly_habits_th");
    thMonthly[1].innerText = t("status_th");
    thMonthly[2].innerText = t("oneoff_tasks_th");
    thMonthly[3].innerText = t("done_th");
  }

  const tdMonthlyDone = document.querySelector("#monthly-habits-table tfoot td:first-child");
  if (tdMonthlyDone) tdMonthlyDone.innerText = t("monthly_tasks_done");

  // Yearly View
  const yearlyBannerTitle = document.querySelector("#view-yearly .banner-title-row h2");
  if (yearlyBannerTitle) yearlyBannerTitle.innerText = t("yearly_banner_title");

  const yearlyBannerSub = document.getElementById("yearly-banner-sub");
  if (yearlyBannerSub) {
    yearlyBannerSub.innerText = currentLang === "bn"
      ? `ٱلِاسْتِقَامَة — অভ্যাস ${currentYear} থেকে ${currentYear + 10}`
      : `ٱلِاسْتِقَامَة — 'Habits ${currentYear}' through '${currentYear + 10}'`;
  }

  // SWOT View
  const swotBannerTitle = document.querySelector("#view-swot .banner-title-row h2");
  if (swotBannerTitle) swotBannerTitle.innerText = t("swot_banner_title");

  const swotBannerTag = document.querySelector("#view-swot .banner-tag");
  if (swotBannerTag) swotBannerTag.innerText = t("swot_banner_sub");

  const swotCtrlH3 = document.querySelector(".swot-control-info h3");
  if (swotCtrlH3) swotCtrlH3.innerText = t("swot_audit_title");

  const swotCtrlP = document.querySelector(".swot-control-info p");
  if (swotCtrlP) swotCtrlP.innerText = t("swot_audit_desc");

  const btnAutoAudit = document.getElementById("btn-swot-auto-audit");
  if (btnAutoAudit) btnAutoAudit.innerHTML = `<span>⚡</span> ${t("btn_auto_audit")}`;

  const btnAddFactor = document.getElementById("btn-swot-add-modal");
  if (btnAddFactor) btnAddFactor.innerHTML = `<span>➕</span> ${t("btn_add_factor")}`;

  const btnResetTemplate = document.getElementById("btn-swot-reset");
  if (btnResetTemplate) btnResetTemplate.innerHTML = `<span>🔄</span> ${t("btn_reset_template")}`;

  // SWOT 4 Quadrant Headers & Subtitles
  const swotH4s = document.querySelectorAll(".swot-card-header h4");
  if (swotH4s.length >= 4) {
    swotH4s[0].innerHTML = `${t("swot_strengths_title")} <span class="swot-arabic">قُوَّة</span>`;
    swotH4s[1].innerHTML = `${t("swot_weaknesses_title")} <span class="swot-arabic">ضَعْف</span>`;
    swotH4s[2].innerHTML = `${t("swot_opps_title")} <span class="swot-arabic">فُرَص</span>`;
    swotH4s[3].innerHTML = `${t("swot_threats_title")} <span class="swot-arabic">مَخَاطِر</span>`;
  }
  const swotSubs = document.querySelectorAll(".swot-card-header .swot-sub");
  if (swotSubs.length >= 4) {
    swotSubs[0].innerText = t("swot_strengths_sub");
    swotSubs[1].innerText = t("swot_weaknesses_sub");
    swotSubs[2].innerText = t("swot_opps_sub");
    swotSubs[3].innerText = t("swot_threats_sub");
  }

  // TOWS Strategy Matrix Section
  const towsH4 = document.querySelector(".swot-strategy-header h4");
  if (towsH4) towsH4.innerText = currentLang === "bn" ? "💡 ইস্তিকামাহ অ্যাকশন স্ট্র্যাটেজি মেট্রিক্স (TOWS)" : "💡 ISTIQĀMAH ACTION STRATEGY MATRIX (TOWS)";

  const towsP = document.querySelector(".swot-strategy-header p");
  if (towsP) towsP.innerText = currentLang === "bn" ? "সোয়াট বিশ্লেষণকে সুশৃঙ্খল দৈনিক পদক্ষেপে রূপান্তর করার কার্যকরী গাইডলাইন" : "How to synthesize your SWOT analysis into disciplined daily action";

  const stratTags = document.querySelectorAll(".strategy-card .strategy-tag");
  const stratH5s = document.querySelectorAll(".strategy-card h5");
  if (stratTags.length >= 4 && stratH5s.length >= 4) {
    if (currentLang === "bn") {
      stratTags[0].innerText = "SO কৌশল (ম্যাক্সি-ম্যাক্সি)";
      stratH5s[0].innerText = "শক্তি দিয়ে সুযোগ জয়";
      stratTags[1].innerText = "WO কৌশল (মিনি-ম্যাক্সি)";
      stratH5s[1].innerText = "সুযোগ দিয়ে দুর্বলতা দূর";
      stratTags[2].innerText = "ST কৌশল (ম্যাক্সি-মিনি)";
      stratH5s[2].innerText = "শক্তি দিয়ে ঝুঁকি প্রতিহত";
      stratTags[3].innerText = "WT কৌশল (মিনি-মিনি)";
      stratH5s[3].innerText = "সুরক্ষামূলক পদক্ষেপ";
    } else {
      stratTags[0].innerText = "SO Strategy (Maxi-Maxi)";
      stratH5s[0].innerText = "Capitalize with Strength";
      stratTags[1].innerText = "WO Strategy (Mini-Maxi)";
      stratH5s[1].innerText = "Overcome via Opportunity";
      stratTags[2].innerText = "ST Strategy (Maxi-Mini)";
      stratH5s[2].innerText = "Shield Against Threats";
      stratTags[3].innerText = "WT Strategy (Mini-Mini)";
      stratH5s[3].innerText = "Defensive Safeguards";
    }
  }

  // SWOT Modal
  const swotModalH3 = document.querySelector("#swot-modal .modal-header h3");
  if (swotModalH3) swotModalH3.innerText = currentLang === "bn" ? "সোয়াট ফ্যাক্টর যোগ করুন" : "Add SWOT Factor";

  const swotModalP = document.querySelector("#swot-modal .modal-header p");
  if (swotModalP) swotModalP.innerText = currentLang === "bn" ? "আপনার অভ্যাস ও আত্মশাসন নিরীক্ষা করার জন্য একটি কৌশলগত বিষয় যুক্ত করুন।" : "Record a strategic factor to audit your habit system and discipline.";

  const btnSwotSave = document.getElementById("btn-swot-save-item");
  if (btnSwotSave) btnSwotSave.innerHTML = `<span>💾</span> ${currentLang === "bn" ? "সংরক্ষণ করুন" : "Save Factor"}`;

  const btnSwotClose = document.getElementById("btn-swot-close-modal");
  if (btnSwotClose) btnSwotClose.innerText = currentLang === "bn" ? "বাতিল" : "Cancel";
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("istiqamah_lang", lang);
  updateStaticTexts();
  renderDailyMatrix();
  renderSubTrackers();
  renderYearlyView();
  renderFieldsAndRewards();
  renderSwotView();
  showToast(currentLang === "bn" ? "ভাষা বাংলায় পরিবর্তন করা হয়েছে।" : "Language switched to English.");
}

function toggleLanguage() {
  const newLang = currentLang === "bn" ? "en" : "bn";
  setLanguage(newLang);
}

// ===================================================
// EVENT LISTENERS & INITIALIZATION
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize language UI
  updateStaticTexts();

  const btnLangToggle = document.getElementById("btn-lang-toggle");
  if (btnLangToggle) {
    btnLangToggle.addEventListener("click", toggleLanguage);
  }
  // Tab Switching
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      const targetEl = document.getElementById(`view-${target}`);
      if (targetEl) targetEl.classList.add("active");

      if (target === "yearly") {
        renderYearlyView();
      } else if (target === "rewards") {
        renderYearlyView(); // Updates total vault amount
      } else if (target === "swot") {
        renderSwotView();
      }
    });
  });

  // Month Picker
  const monthPicker = document.getElementById("month-picker");
  if (monthPicker) {
    monthPicker.value = currentMonth;
    monthPicker.addEventListener("change", (e) => {
      currentMonth = parseInt(e.target.value);
      renderDailyMatrix();
      renderSubTrackers();
      renderYearlyView();
      showToast(`Switched to ${MONTH_NAMES[currentMonth]} ${currentYear}`);
    });
  }

  // Monthly Year Picker (on Month view)
  const monthlyYearPicker = document.getElementById("monthly-year-picker");
  if (monthlyYearPicker) {
    monthlyYearPicker.value = currentYear;
    monthlyYearPicker.addEventListener("change", (e) => {
      updateYear(e.target.value);
    });
  }

  // Year Picker (on Yearly view)
  const yearPicker = document.getElementById("year-picker");
  if (yearPicker) {
    yearPicker.value = currentYear;
    yearPicker.addEventListener("change", (e) => {
      updateYear(e.target.value);
    });
  }

  // Sound Toggle
  const btnAudio = document.getElementById("btn-audio-toggle");
  if (btnAudio) {
    btnAudio.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      btnAudio.innerHTML = `<span id="audio-icon">${soundEnabled ? "🔊" : "🔇"}</span> Sound: ${soundEnabled ? "ON" : "OFF"}`;
      showToast(`Audio feedback: ${soundEnabled ? "Enabled" : "Disabled"}`);
      if (soundEnabled) {
        playBeep(true);
      }
    });
  }

  // Reset Month
  const btnReset = document.getElementById("btn-reset-data");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm(`Are you sure you want to clear all checked habits and tasks for ${MONTH_NAMES[currentMonth]} ${currentYear}?`)) {
        const prefix = `${currentYear}-${currentMonth}-`;
        Object.keys(trackerState.checks).forEach(k => {
          if (k.startsWith(prefix)) delete trackerState.checks[k];
        });
        Object.keys(trackerState.weeklyChecks).forEach(k => {
          if (k.startsWith(prefix)) delete trackerState.weeklyChecks[k];
        });
        Object.keys(trackerState.monthlyChecks).forEach(k => {
          if (k.startsWith(prefix)) delete trackerState.monthlyChecks[k];
        });
        Object.keys(trackerState.oneOffChecks).forEach(k => {
          if (k.startsWith(prefix)) delete trackerState.oneOffChecks[k];
        });
        saveState();
        renderDailyMatrix();
        renderSubTrackers();
        renderYearlyView();
        showToast("Month data cleared.");
      }
    });
  }

  // Download Excel (.xlsx) file
  const btnDownload = document.getElementById("btn-download-excel");
  if (btnDownload) {
    btnDownload.addEventListener("click", () => {
      showToast("ٱلِاسْتِقَامَة — Downloading Istiqamah Tracker spreadsheet...");
      const link = document.createElement("a");
      link.href = "Istiqamah_Tracker_2026_2036.xlsx";
      link.download = "Istiqamah_Tracker_2026_2036.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Export JSON Backup
  const btnExportBackup = document.getElementById("btn-export-backup");
  if (btnExportBackup) {
    btnExportBackup.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trackerState, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `istiqamah_backup_${currentYear}_${MONTH_NAMES[currentMonth].toLowerCase()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Habits backup exported as JSON.");
    });
  }

  // Import JSON Backup
  const btnImportBackup = document.getElementById("btn-import-backup");
  const fileImportBackup = document.getElementById("file-import-backup");
  if (btnImportBackup && fileImportBackup) {
    btnImportBackup.addEventListener("click", () => {
      fileImportBackup.value = "";
      fileImportBackup.click();
    });

    fileImportBackup.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        try {
          const parsed = JSON.parse(readEvent.target.result);
          if (parsed && typeof parsed === "object") {
            trackerState = {
              checks: parsed.checks || {},
              weeklyChecks: parsed.weeklyChecks || {},
              monthlyChecks: parsed.monthlyChecks || {},
              oneOffChecks: parsed.oneOffChecks || {},
              swot: (parsed.swot && parsed.swot.strengths) ? parsed.swot : JSON.parse(JSON.stringify(DEFAULT_SWOT)),
              reportName: parsed.reportName || "My habits",
              startDate: parsed.startDate || "Jan 1, 2026"
            };
            saveState();
            renderDailyMatrix();
            renderSubTrackers();
            renderYearlyView();
            renderSwotView();
            showToast("Backup restored successfully!");
          } else {
            alert("Invalid backup JSON format.");
          }
        } catch (err) {
          alert("Failed to parse backup file: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // PIN Modal Controls & Cloud Vault Auth
  function openPinModal() {
    const modal = document.getElementById("pin-modal");
    const input = document.getElementById("master-pin-input");
    if (modal) modal.classList.add("active");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 100);
    }
  }

  function closePinModal() {
    const modal = document.getElementById("pin-modal");
    if (modal) modal.classList.remove("active");
  }

  const btnCloudStatus = document.getElementById("btn-cloud-status");
  if (btnCloudStatus) {
    btnCloudStatus.addEventListener("click", () => {
      if (currentPinHash) {
        if (confirm("Currently synced with Firestore. Click OK to unlock with a different Master PIN, or Cancel to stay connected.")) {
          openPinModal();
        }
      } else {
        openPinModal();
      }
    });
  }

  const btnSubmitPin = document.getElementById("btn-submit-pin");
  const masterPinInput = document.getElementById("master-pin-input");
  if (btnSubmitPin && masterPinInput) {
    const handlePinSubmit = async () => {
      const pin = masterPinInput.value.trim();
      if (!pin) {
        alert("Please enter a Master PIN (e.g. 1234).");
        return;
      }
      const hash = await hashPin(pin);
      currentPinHash = hash;
      localStorage.setItem("istiqamah_pin_hash", hash);
      closePinModal();
      showToast("Connecting to Firestore Vault...");
      connectCloudSync(hash);
    };

    btnSubmitPin.addEventListener("click", handlePinSubmit);
    masterPinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handlePinSubmit();
      }
    });
  }

  const btnCancelPin = document.getElementById("btn-cancel-pin");
  if (btnCancelPin) {
    btnCancelPin.addEventListener("click", () => {
      closePinModal();
      showToast("Working in local mode.");
    });
  }

  const btnToggleEye = document.getElementById("btn-toggle-pin-visibility");
  if (btnToggleEye && masterPinInput) {
    btnToggleEye.addEventListener("click", () => {
      if (masterPinInput.type === "password") {
        masterPinInput.type = "text";
        btnToggleEye.innerText = "🙈";
      } else {
        masterPinInput.type = "password";
        btnToggleEye.innerText = "👁️";
      }
    });
  }

  // Auto-connect to Cloud Sync if PIN hash exists, else open PIN prompt
  if (currentPinHash) {
    connectCloudSync(currentPinHash);
  } else {
    setTimeout(() => {
      openPinModal();
    }, 450);
  }

  // Initial Renders
  renderDailyMatrix();
  renderSubTrackers();
  renderYearlyView();
  renderFieldsAndRewards();
  renderSwotView();

  // SWOT Event Listeners
  const btnSwotAutoAudit = document.getElementById("btn-swot-auto-audit");
  if (btnSwotAutoAudit) {
    btnSwotAutoAudit.addEventListener("click", autoAuditFromHabits);
  }

  const btnSwotAddModal = document.getElementById("btn-swot-add-modal");
  if (btnSwotAddModal) {
    btnSwotAddModal.addEventListener("click", () => openSwotModal("strengths"));
  }

  const btnSwotReset = document.getElementById("btn-swot-reset");
  if (btnSwotReset) {
    btnSwotReset.addEventListener("click", () => {
      if (confirm("Reset SWOT Analysis to the default high-performance Istiqamah template?")) {
        trackerState.swot = JSON.parse(JSON.stringify(DEFAULT_SWOT));
        saveState();
        playBeep(false);
        renderSwotView();
        showToast("SWOT Analysis reset to default template.");
      }
    });
  }

  document.querySelectorAll(".btn-swot-quick-add").forEach(btn => {
    btn.addEventListener("click", () => {
      const quad = btn.getAttribute("data-quadrant") || "strengths";
      openSwotModal(quad);
    });
  });

  const btnSwotSave = document.getElementById("btn-swot-save-item");
  if (btnSwotSave) {
    btnSwotSave.addEventListener("click", saveSwotFactorFromModal);
  }

  const btnSwotClose = document.getElementById("btn-swot-close-modal");
  if (btnSwotClose) {
    btnSwotClose.addEventListener("click", closeSwotModal);
  }

  const swotTextInput = document.getElementById("swot-input-text");
  if (swotTextInput) {
    swotTextInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveSwotFactorFromModal();
      }
    });
  }
});
