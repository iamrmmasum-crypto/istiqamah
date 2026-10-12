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
    { id: "d5", name: "📰 Newspaper & Reading (9:00–9:30 AM)", category: "Study & Work", reward: 2.0 },
    { id: "d6", name: "🥗 Breakfast & Rest (9:30–10:00 AM)", category: "Health & Routine", reward: 2.0 },
    { id: "d7", name: "📝 Deep Study - Session 2 (10:00 AM–12:00 PM)", category: "Study & Work", reward: 6.0 },
    { id: "d8", name: "🚿 Bath & Grooming (12:00–1:00 PM)", category: "Health & Routine", reward: 2.0 },
    { id: "d9", name: "🌞 Dhuhr Prayer [Jummah on Fri] (1:00 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d10", name: "🛏️ Afternoon Nap / Qaylulah (2:00–4:00 PM)", category: "Health & Routine", reward: 3.0 },
    { id: "d11", name: "🌤️ Asr Prayer (4:15 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d12", name: "🌇 Maghrib Prayer (5:45 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d13", name: "🌙 Isha Prayer & Reflection (7:45 PM)", category: "Spiritual", reward: 5.0 },
    { id: "d14", name: "💧 Drink 2.5L+ Water (All Day)", category: "Health & Routine", reward: 2.0 },
    { id: "d15", name: "🛡️ Screen Purity & Chastity / No Porn (All Day)", category: "Self-Discipline", reward: 10.0 },
    { id: "d16", name: "😴 Night Sleep on Time (11:30 PM–12:00 AM)", category: "Health & Routine", reward: 4.0 }
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
let currentYear = 2026;
let currentMonth = 9; // 0 = Jan, 9 = Oct
let soundEnabled = true;

// Key for LocalStorage
const STORAGE_KEY = "istiqamah_tracker_state_2026";
let trackerState = loadState();

function loadState() {
  const defaults = {
    checks: {},
    weeklyChecks: {},
    monthlyChecks: {},
    oneOffChecks: {},
    reportName: "My habits",
    startDate: "Jan 1, 2026"
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
          startDate: parsed.startDate || "Jan 1, 2026"
        };
      }
    } catch (e) {}
  }
  return defaults;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
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
    rowPctHtml += `<th id="th-pct-day-${d}" style="background:#F1F5F9; color:#1E293B;">0%</th>`;
  }
  rowPctHtml += `</tr>`;

  // 3. HEADER ROW 3: Weekdays (Wed, Thu, Fri...)
  let rowDaysHtml = `<tr class="row-days"><th class="th-habit-name" style="background:#F8FAFC;"></th>`;
  for (let d = 1; d <= totalDays; d++) {
    const dayOfWeek = (firstDay + d - 1) % 7;
    const wkClass = getWeekClassForDay(d);
    rowDaysHtml += `<th class="${wkClass}">${WEEKDAY_NAMES[dayOfWeek]}</th>`;
  }
  rowDaysHtml += `</tr>`;

  // 4. HEADER ROW 4: Date numbers (1, 2, 3...)
  let rowNumsHtml = `<tr class="row-date-nums"><th class="th-habit-name" style="background:#F8FAFC;"></th>`;
  for (let d = 1; d <= totalDays; d++) {
    const wkClass = getWeekClassForDay(d);
    rowNumsHtml += `<th class="${wkClass}">${d}</th>`;
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
      const key = `${currentYear}-${currentMonth}-${habit.id}-${d}`;
      const checked = trackerState.checks[key] ? "checked" : "";
      tbodyHtml += `<td><input type="checkbox" class="sheet-check" data-habit="${habit.id}" data-day="${d}" ${checked}></td>`;
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
    footRewHtml += `<td id="foot-day-rew-${d}">$0</td>`;
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

  // Weekly habits
  const weeklyTbody = document.getElementById("weekly-habits-tbody");
  let wHtml = "";
  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    const cat = getCategoryMeta(wHabit.category);
    wHtml += `<tr>`;
    wHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${wHabit.name}</td>`;
    for (let wk = 1; wk <= 5; wk++) {
      if (wk <= numWeeks) {
        const key = `${currentYear}-${currentMonth}-${wHabit.id}-wk${wk}`;
        const checked = trackerState.weeklyChecks[key] ? "checked" : "";
        wHtml += `<td class="center"><input type="checkbox" class="sheet-check weekly-check" data-habit="${wHabit.id}" data-week="${wk}" ${checked}></td>`;
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
      mHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${mHabit.name}</td>`;
      mHtml += `<td class="center"><input type="checkbox" class="sheet-check monthly-check" data-habit="${mHabit.id}" ${checked}></td>`;
    } else {
      mHtml += `<td></td><td></td>`;
    }

    if (oTask) {
      const key = `${currentYear}-${currentMonth}-${oTask.id}`;
      const checked = trackerState.oneOffChecks[key] ? "checked" : "";
      mHtml += `<td style="background:#F8FAFC;">${oTask.name}</td>`;
      mHtml += `<td class="center"><input type="checkbox" class="sheet-check oneoff-check" data-task="${oTask.id}" ${checked}></td>`;
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
  const totalDailyPossible = daysInMonth * totalHabits;

  for (let d = 1; d <= daysInMonth; d++) {
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
  const totalWeeklyPossible = HABIT_DATABASE.weeklyHabits.length * numWeeks;

  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    for (let wk = 1; wk <= numWeeks; wk++) {
      const key = `${year}-${month}-${wHabit.id}-wk${wk}`;
      if (trackerState.weeklyChecks[key]) {
        weeklyChecked++;
        weeklyEarned += wHabit.reward;
      }
    }
  });

  let monthlyEarned = 0;
  let monthlyChecked = 0;
  const totalMonthlyPossible = HABIT_DATABASE.monthlyHabits.length;

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
      const avg = weekCounts[w] > 0 ? Math.round(weekSums[w] / weekCounts[w]) : 0;
      footWk.innerText = `${avg}%`;
    }
  }

  // 2. Weekly Habits
  let weeklyTotalEarned = 0;
  let totalWeeklyChecked = 0;
  const totalWeeklyPossible = HABIT_DATABASE.weeklyHabits.length * numWeeks;

  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    let hEarned = 0;
    for (let wk = 1; wk <= numWeeks; wk++) {
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
  const overallCompletion = totalPossibleDaily > 0 ? Math.round((totalCheckedDaily / totalPossibleDaily) * 100) : 0;

  const kpiCompletionEl = document.getElementById("kpi-completion-rate");
  if (kpiCompletionEl) kpiCompletionEl.innerText = `${overallCompletion}%`;
  const kpiTotalEl = document.getElementById("kpi-total-earned");
  if (kpiTotalEl) kpiTotalEl.innerText = `$${totalCombinedEarned.toFixed(2)}`;

  const repName = trackerState.reportName || "My habits";
  const bannerEl = document.getElementById("banner-subtext");
  if (bannerEl) {
    bannerEl.innerText = `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 \u2014 '${repName}' for ${MONTH_NAMES[currentMonth]} ${currentYear}`;
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

  // Initial Renders
  renderDailyMatrix();
  renderSubTrackers();
  renderYearlyView();
  renderFieldsAndRewards();
});
