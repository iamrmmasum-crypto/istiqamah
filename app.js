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
    { id: "d15", name: "🌇 Maghrib Prayer & Evening Dhikr (5:45 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d16", name: "🌙 Isha Prayer & Reflection (7:15 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d17", name: "📖 Growth Reading & Family Time (7:45–9:30 PM)", category: "Mindfulness", reward: 4.0 },
    { id: "d18", name: "📵 Digital Sunset / Screen Curfew (10:00 PM)", category: "Self-Discipline", reward: 5.0 },
    { id: "d19", name: "🛡️ Screen Purity & Chastity / No Porn (All Day)", category: "Self-Discipline", reward: 10.0 },
    { id: "d20", name: "💧 Drink 2.5L+ Pure Water (All Day)", category: "Health & Routine", reward: 2.0 },
    { id: "d21", name: "😴 Sleep on Time & Wudu (10:30–11:00 PM)", category: "Health & Routine", reward: 4.0 }
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

// Application State
const _initialNow = new Date();
const _initYear = _initialNow.getFullYear();
let currentYear = (_initYear >= 2026 && _initYear <= 2036) ? _initYear : 2026;
let currentMonth = (_initYear >= 2026 && _initYear <= 2036) ? _initialNow.getMonth() : 0;
let soundEnabled = true;

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
          reportName: data.reportName || trackerState.reportName || "My habits",
          startDate: data.startDate || trackerState.startDate || "Jan 1, 2026"
        };
        saveLocalOnly();
        renderDailyMatrix();
        renderSubTrackers();
        renderYearlyView();
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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const weeks = [
    { name: "Week 1 (%)", start: 1, end: 7, class: "bg-wk1" },
    { name: "Week 2 (%)", start: 8, end: 14, class: "bg-wk2" },
    { name: "Week 3 (%)", start: 15, end: 21, class: "bg-wk3" },
    { name: "Week 4 (%)", start: 22, end: 28, class: "bg-wk4" }
  ];
  if (totalDays >= 29) {
    weeks.push({ name: "Week 5 (%)", start: 29, end: totalDays, class: "bg-wk5" });
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
  let rowWeeksHtml = `<tr class="row-weeks"><th class="th-habit-name">Daily habits</th>`;
  weeks.forEach(w => {
    const span = w.end - w.start + 1;
    rowWeeksHtml += `<th colspan="${span}" class="${w.class}">${w.name}</th>`;
  });
  rowWeeksHtml += `</tr>`;

  // 2. HEADER ROW 2: Daily completed (%)
  let rowPctHtml = `<tr class="row-completed-pct"><th class="th-habit-name" style="background:#F8FAFC; color:#64748B;">Daily completed (%)</th>`;
  for (let d = 1; d <= totalDays; d++) {
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const isToday = isDateToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-blocked" : (isToday ? "col-today" : "");
    const initialText = isPast ? "🔒" : "0%";
    rowPctHtml += `<th id="th-pct-day-${d}" class="${extraClass}" style="background:#F1F5F9; color:#1E293B;">${initialText}</th>`;
  }
  rowPctHtml += `</tr>`;

  // 3. HEADER ROW 3: Weekdays (Wed, Thu, Fri...)
  let rowDaysHtml = `<tr class="row-days"><th class="th-habit-name" style="background:#F8FAFC;"></th>`;
  for (let d = 1; d <= totalDays; d++) {
    const dayOfWeek = (firstDay + d - 1) % 7;
    const wkClass = getWeekClassForDay(d);
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const isToday = isDateToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-blocked" : (isToday ? "col-today" : "");
    rowDaysHtml += `<th class="${wkClass} ${extraClass}">${WEEKDAY_NAMES[dayOfWeek]}${isToday ? '<span class="col-today-badge">Today</span>' : ''}</th>`;
  }
  rowDaysHtml += `</tr>`;

  // 4. HEADER ROW 4: Date numbers (1, 2, 3...)
  let rowNumsHtml = `<tr class="row-date-nums"><th class="th-habit-name" style="background:#F8FAFC;"></th>`;
  for (let d = 1; d <= totalDays; d++) {
    const wkClass = getWeekClassForDay(d);
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const isToday = isDateToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-blocked" : (isToday ? "col-today" : "");
    rowNumsHtml += `<th class="${wkClass} ${extraClass}">${d}</th>`;
  }
  rowNumsHtml += `</tr>`;

  thead.innerHTML = rowWeeksHtml + rowPctHtml + rowDaysHtml + rowNumsHtml;

  // 5. BODY: Habit rows
  let tbodyHtml = "";
  HABIT_DATABASE.dailyHabits.forEach(habit => {
    const cat = getCategoryMeta(habit.category);
    tbodyHtml += `<tr>`;
    tbodyHtml += `<td class="td-habit-name" style="background:${cat.color}; color:${cat.textColor};">${habit.name}</td>`;

    for (let d = 1; d <= totalDays; d++) {
      const isPast = isDateBeforeToday(currentYear, currentMonth, d);
      const isToday = isDateToday(currentYear, currentMonth, d);
      const key = `${currentYear}-${currentMonth}-${habit.id}-${d}`;
      const checked = trackerState.checks[key] ? "checked" : "";

      if (isPast) {
        tbodyHtml += `<td class="td-past-blocked" title="Locked: Past date prior to tracker start (Today)"><input type="checkbox" class="sheet-check" data-habit="${habit.id}" data-day="${d}" aria-label="${habit.name} - Day ${d} (Locked)" disabled></td>`;
      } else {
        const todayClass = isToday ? "td-today" : "";
        tbodyHtml += `<td class="${todayClass}"><input type="checkbox" class="sheet-check" data-habit="${habit.id}" data-day="${d}" aria-label="${habit.name} - Day ${d}" ${checked}></td>`;
      }
    }
    tbodyHtml += `</tr>`;
  });
  tbody.innerHTML = tbodyHtml;

  // 6. FOOTER: Week completed %, Daily reward earned ($)
  let footWkPctHtml = `<tr class="row-week-pct"><td class="tfoot-label bold">Week completed (%):</td>`;
  weeks.forEach((w, idx) => {
    const span = w.end - w.start + 1;
    footWkPctHtml += `<td colspan="${span}" id="foot-wk-pct-${idx + 1}" class="${w.class}">0%</td>`;
  });
  footWkPctHtml += `</tr>`;

  let footRewHtml = `<tr class="row-daily-reward"><td class="tfoot-label bold">Daily reward earned ($):</td>`;
  for (let d = 1; d <= totalDays; d++) {
    const isPast = isDateBeforeToday(currentYear, currentMonth, d);
    const extraClass = isPast ? "col-past-blocked" : "";
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
    wHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${wHabit.name}</td>`;
    for (let wk = 1; wk <= 5; wk++) {
      if (wk <= numWeeks) {
        const wEndDay = wk === 1 ? 7 : (wk === 2 ? 14 : (wk === 3 ? 21 : (wk === 4 ? 28 : totalDays)));
        const isPastWeek = isDateBeforeToday(currentYear, currentMonth, wEndDay);
        const isCurrentWeek = (currentYear === todayYear && currentMonth === todayMonth && todayDate >= (wEndDay - 6) && todayDate <= wEndDay);
        const key = `${currentYear}-${currentMonth}-${wHabit.id}-wk${wk}`;
        const checked = trackerState.weeklyChecks[key] ? "checked" : "";

        if (isPastWeek) {
          wHtml += `<td class="center td-past-blocked" title="Locked: Past week prior to tracker start"><input type="checkbox" class="sheet-check weekly-check" disabled></td>`;
        } else {
          const wkClass = isCurrentWeek ? "td-today" : "";
          wHtml += `<td class="center ${wkClass}"><input type="checkbox" class="sheet-check weekly-check" data-habit="${wHabit.id}" data-week="${wk}" aria-label="${wHabit.name} - Week ${wk}" ${checked}></td>`;
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
        mHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700; opacity:0.6;">${mHabit.name}</td>`;
        mHtml += `<td class="center td-past-blocked" title="Locked: Past month"><input type="checkbox" class="sheet-check monthly-check" disabled></td>`;
      } else {
        mHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${mHabit.name}</td>`;
        mHtml += `<td class="center"><input type="checkbox" class="sheet-check monthly-check" data-habit="${mHabit.id}" aria-label="${mHabit.name}" ${checked}></td>`;
      }
    } else {
      mHtml += `<td></td><td></td>`;
    }

    if (oTask) {
      const key = `${currentYear}-${currentMonth}-${oTask.id}`;
      const checked = trackerState.oneOffChecks[key] ? "checked" : "";
      if (isPastMonth) {
        mHtml += `<td style="background:#F8FAFC; opacity:0.6;">${oTask.name}</td>`;
        mHtml += `<td class="center td-past-blocked" title="Locked: Past month"><input type="checkbox" class="sheet-check oneoff-check" disabled></td>`;
      } else {
        mHtml += `<td style="background:#F8FAFC;">${oTask.name}</td>`;
        mHtml += `<td class="center"><input type="checkbox" class="sheet-check oneoff-check" data-task="${oTask.id}" aria-label="${oTask.name}" ${checked}></td>`;
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
    if (thPct) thPct.innerText = isPast ? "🔒" : `${dayPct}%`;

    const footRew = document.getElementById(`foot-day-rew-${d}`);
    if (footRew) footRew.innerText = isPast ? "—" : `$${dayEarned.toFixed(0)}`;

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

  const repName = trackerState.reportName || "My habits";
  const bannerEl = document.getElementById("banner-subtext");
  if (bannerEl) {
    const isPast = isMonthBeforeCurrent(currentYear, currentMonth);
    if (isPast) {
      bannerEl.innerHTML = `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 \u2014 '${repName}' for ${MONTH_NAMES[currentMonth]} ${currentYear} <span class="locked-badge-banner">🔒 Past Month (Locked)</span>`;
    } else {
      bannerEl.innerHTML = `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 \u2014 '${repName}' for ${MONTH_NAMES[currentMonth]} ${currentYear} <span style="font-size:11px; color:#10B981; font-weight:700; margin-left:8px;">📍 Started Nov 15, 2026</span>`;
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

  MONTH_NAMES.forEach((mName, idx) => {
    const isCurrent = idx === currentMonth;
    const stats = getMonthStats(currentYear, idx);

    yearlyEarnedSum += stats.totalEarned;
    yearlyPctSum += stats.completionPct;

    html += `
      <div class="year-month-card ${isCurrent ? 'active-month' : ''}" data-month="${idx}" style="cursor: pointer;" title="Click to view ${mName}">
        <div class="year-month-header" style="background: ${isCurrent ? '#2563EB' : '#475569'};">
          <h5>${mName.toUpperCase()}</h5>
          <span style="font-size:10px; font-weight:700;">${isCurrent ? 'ACTIVE' : ''}</span>
        </div>
        <div class="year-month-body">
          <div class="stat-row">
            <span class="text-muted">Monthly Completion:</span>
            <span class="bold">${stats.completionPct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${stats.completionPct}%;"></div>
          </div>
          <div class="stat-row mt-2">
            <span class="text-muted">Rewards Accumulated:</span>
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

      catHtml += `
        <div class="category-config-item">
          <div class="cat-config-header">
            <span class="cat-chip" style="background:${cat.color}; color:${cat.textColor};">${cat.name}</span>
            <span class="text-muted text-sm ml-auto">${dailyCount} Daily · ${weeklyCount} Weekly · ${monthlyCount} Monthly</span>
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
      rHtml += `<td class="bold">${dH ? `<span class="badge-soft" style="background:${getCategoryMeta(dH.category).color}; color:${getCategoryMeta(dH.category).textColor}; padding:2px 6px; border-radius:3px;">${dH.category}</span>` : '—'}</td>`;
      rHtml += `<td>${dH ? dH.name : '—'}</td>`;
      rHtml += `<td class="green bold">${dH ? '$' + dH.reward.toFixed(2) : '—'}</td>`;
      rHtml += `<td>${wH ? wH.name : '—'}</td>`;
      rHtml += `<td class="green bold">${wH ? '$' + wH.reward.toFixed(2) : '—'}</td>`;
      rHtml += `<td>${mH ? mH.name : '—'}</td>`;
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
// EVENT LISTENERS & INITIALIZATION
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
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
              reportName: parsed.reportName || "My habits",
              startDate: parsed.startDate || "Jan 1, 2026"
            };
            saveState();
            renderDailyMatrix();
            renderSubTrackers();
            renderYearlyView();
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
});
