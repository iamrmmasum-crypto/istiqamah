// ===================================================
// ISTIQĀMAH (ٱلِاسْتِقَامَة) - INTERACTIVE CLIENT SCRIPT
// ===================================================

const HABIT_DATABASE = {
  categories: [
    { name: "Creative", color: "#D98880", textColor: "#FFFFFF" },
    { name: "Career", color: "#F5B075", textColor: "#1E293B" },
    { name: "Fitness", color: "#FDE047", textColor: "#1E293B" },
    { name: "Financial", color: "#A7F3D0", textColor: "#1E293B" },
    { name: "Relationships", color: "#BAE6FD", textColor: "#1E293B" },
    { name: "Chores", color: "#DDD6FE", textColor: "#1E293B" }
  ],
  dailyHabits: [
    { id: "d1", name: "Practice painting", category: "Creative", reward: 10.0 },
    { id: "d2", name: "Learn guitar", category: "Creative", reward: 25.0 },
    { id: "d3", name: "Sketch at least once", category: "Creative", reward: 30.0 },
    { id: "d4", name: "Practice embroidery", category: "Creative", reward: 2.0 },
    { id: "d5", name: "Learn code", category: "Career", reward: 5.0 },
    { id: "d6", name: "Sync with virtual team", category: "Career", reward: 10.0 },
    { id: "d7", name: "Complete daily tasks by EOD", category: "Career", reward: 1.0 },
    { id: "d8", name: "Read all emails by EOD", category: "Career", reward: 1.5 },
    { id: "d9", name: "Stop work by 6pm", category: "Career", reward: 1.5 },
    { id: "d10", name: "Ride exercise bike for 5 mins", category: "Fitness", reward: 0.5 },
    { id: "d11", name: "Go to the gym", category: "Fitness", reward: 2.0 },
    { id: "d12", name: "Run one mile", category: "Fitness", reward: 2.0 },
    { id: "d13", name: "Check account", category: "Financial", reward: 0.5 },
    { id: "d14", name: "Save $50", category: "Financial", reward: 50.0 }
  ],
  weeklyHabits: [
    { id: "w1", name: "Paint a new landscape", category: "Creative", reward: 15.0 },
    { id: "w2", name: "Play one new song", category: "Creative", reward: 25.0 },
    { id: "w3", name: "Meet weekly deadlines", category: "Career", reward: 20.0 },
    { id: "w4", name: "Career reflection every Sunday", category: "Career", reward: 2.0 },
    { id: "w5", name: "Ride exercise bike for an hour", category: "Fitness", reward: 2.0 },
    { id: "w6", name: "Save 10% of earnings", category: "Financial", reward: 0.5 }
  ],
  monthlyHabits: [
    { id: "m1", name: "Host an art night", category: "Creative", reward: 15.0 },
    { id: "m2", name: "Memorize four songs", category: "Creative", reward: 25.0 },
    { id: "m3", name: "Attend a networking event", category: "Career", reward: 5.0 },
    { id: "m4", name: "Go to the gym 25 days", category: "Fitness", reward: 2.0 },
    { id: "m5", name: "Contribute to 401(K)", category: "Financial", reward: 0.5 }
  ],
  oneOffTasks: [
    { id: "o1", name: "Tidy up studio desk and organize brushes" },
    { id: "o2", name: "File quarterly expense receipts" },
    { id: "o3", name: "Schedule annual wellness checkup" }
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
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { }
  }
  return {
    checks: {}, // key format: `y-m-habitId-day` or `y-m-wId-wk` or `y-m-mId`
    weeklyChecks: {},
    monthlyChecks: {},
    oneOffChecks: {}
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
}

// Procedural Audio Synthesizer for Tactile Feedback
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(isCheck) {
  if (!soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    if (isCheck) {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (err) {}
}

// Days in month helper
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

// ===================================================
// RENDER DAILY MATRIX
// ===================================================
function renderDailyMatrix() {
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayWeekday(currentYear, currentMonth);
  const thead = document.getElementById("daily-matrix-thead");
  const tbody = document.getElementById("daily-matrix-tbody");
  const tfoot = document.getElementById("daily-matrix-tfoot");

  // Determine week groupings:
  // Week 1: Days 1-7
  // Week 2: Days 8-14
  // Week 3: Days 15-21
  // Week 4: Days 22-28
  // Week 5: Days 29..totalDays (or up to 31)
  const weeks = [
    { name: "Week 1 (%)", start: 1, end: 7, class: "bg-wk1" },
    { name: "Week 2 (%)", start: 8, end: 14, class: "bg-wk2" },
    { name: "Week 3 (%)", start: 15, end: 21, class: "bg-wk3" },
    { name: "Week 4 (%)", start: 22, end: 28, class: "bg-wk4" },
    { name: "Week 5 (%)", start: 29, end: totalDays, class: "bg-wk5" }
  ];

  // 1. HEADER ROW 1: Week Banners
  let rowWeeksHtml = `<tr class="row-weeks"><th class="th-habit-name">Daily habits</th>`;
  weeks.forEach(w => {
    const span = Math.max(1, w.end - w.start + 1);
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
    const cat = HABIT_DATABASE.categories.find(c => c.name === habit.category) || { color: "#CBD5E1", textColor: "#000" };
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
    const span = Math.max(1, w.end - w.start + 1);
    footWkPctHtml += `<td colspan="${span}" id="foot-wk-pct-${idx+1}" class="${w.class}">0%</td>`;
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
    });
  });

  recalculateMetrics();
}

function getWeekClassForDay(day) {
  if (day <= 7) return "bg-wk1";
  if (day <= 14) return "bg-wk2";
  if (day <= 21) return "bg-wk3";
  if (day <= 28) return "bg-wk4";
  return "bg-wk5";
}

// ===================================================
// RENDER SUB TRACKERS (WEEKLY & MONTHLY)
// ===================================================
function renderSubTrackers() {
  // Weekly habits
  const weeklyTbody = document.getElementById("weekly-habits-tbody");
  let wHtml = "";
  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    const cat = HABIT_DATABASE.categories.find(c => c.name === wHabit.category) || { color: "#CBD5E1", textColor: "#000" };
    wHtml += `<tr>`;
    wHtml += `<td style="background:${cat.color}; color:${cat.textColor}; font-weight:700;">${wHabit.name}</td>`;
    for (let wk = 1; wk <= 5; wk++) {
      const key = `${currentYear}-${currentMonth}-${wHabit.id}-wk${wk}`;
      const checked = trackerState.weeklyChecks[key] ? "checked" : "";
      wHtml += `<td class="center"><input type="checkbox" class="sheet-check weekly-check" data-habit="${wHabit.id}" data-week="${wk}" ${checked}></td>`;
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
      const cat = HABIT_DATABASE.categories.find(c => c.name === mHabit.category) || { color: "#CBD5E1", textColor: "#000" };
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
    });
  });
}

// ===================================================
// RECALCULATE METRICS & TALLIES
// ===================================================
function recalculateMetrics() {
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const totalHabits = HABIT_DATABASE.dailyHabits.length;

  let monthTotalEarned = 0;
  let totalCheckedDaily = 0;
  let totalPossibleDaily = totalDays * totalHabits;

  // 1. Daily tallies
  const weekSums = [0, 0, 0, 0, 0];
  const weekCounts = [0, 0, 0, 0, 0];

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

    monthTotalEarned += dayEarned;
    totalCheckedDaily += dayChecked;

    // Week bucket
    let wkIndex = 0;
    if (d <= 7) wkIndex = 0;
    else if (d <= 14) wkIndex = 1;
    else if (d <= 21) wkIndex = 2;
    else if (d <= 28) wkIndex = 3;
    else wkIndex = 4;

    weekSums[wkIndex] += dayPct;
    weekCounts[wkIndex]++;
  }

  // Week averages
  for (let w = 0; w < 5; w++) {
    const footWk = document.getElementById(`foot-wk-pct-${w + 1}`);
    if (footWk) {
      const avg = weekCounts[w] > 0 ? Math.round(weekSums[w] / weekCounts[w]) : 0;
      footWk.innerText = `${avg}%`;
    }
  }

  // 2. Weekly Habits
  let weeklyTotalEarned = 0;
  let totalWeeklyChecked = 0;
  const totalWeeklyPossible = HABIT_DATABASE.weeklyHabits.length * 5;

  HABIT_DATABASE.weeklyHabits.forEach(wHabit => {
    let hEarned = 0;
    for (let wk = 1; wk <= 5; wk++) {
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
  document.getElementById("weekly-progress-percent").innerText = `${weeklyPct}%`;
  document.getElementById("weekly-total-reward").innerText = `$${weeklyTotalEarned.toFixed(2)}`;

  // 3. Monthly Habits & One-offs
  let monthlyHabitsEarned = 0;
  HABIT_DATABASE.monthlyHabits.forEach(mHabit => {
    const key = `${currentYear}-${currentMonth}-${mHabit.id}`;
    if (trackerState.monthlyChecks[key]) {
      monthlyHabitsEarned += mHabit.reward;
    }
  });
  document.getElementById("monthly-tasks-reward").innerText = `$${monthlyHabitsEarned.toFixed(2)}`;

  let oneOffCheckedCount = 0;
  HABIT_DATABASE.oneOffTasks.forEach(oTask => {
    const key = `${currentYear}-${currentMonth}-${oTask.id}`;
    if (trackerState.oneOffChecks[key]) oneOffCheckedCount++;
  });
  document.getElementById("oneoff-tasks-status").innerText = `${oneOffCheckedCount} / ${HABIT_DATABASE.oneOffTasks.length} done`;

  // 4. Overall Monthly Totals
  const totalCombinedEarned = monthTotalEarned + weeklyTotalEarned + monthlyHabitsEarned;
  const overallCompletion = totalPossibleDaily > 0 ? Math.round((totalCheckedDaily / totalPossibleDaily) * 100) : 0;

  document.getElementById("kpi-completion-rate").innerText = `${overallCompletion}%`;
  document.getElementById("kpi-total-earned").innerText = `$${totalCombinedEarned.toFixed(2)}`;
  document.getElementById("banner-subtext").innerText = `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 \u2014 'My habits' for ${MONTH_NAMES[currentMonth]} ${currentYear}`;
}

// ===================================================
// YEARLY VIEW RENDERER
// ===================================================
function renderYearlyView() {
  const container = document.getElementById("yearly-months-container");
  let html = "";
  
  MONTH_NAMES.forEach((mName, idx) => {
    const isCurrent = idx === currentMonth;
    const samplePct = [38, 42, 55, 60, 48, 70, 75, 65, 80, 85, 72, 68][idx];
    const sampleEarned = (samplePct * 18.5).toFixed(0);

    html += `
      <div class="year-month-card ${isCurrent ? 'active-month' : ''}">
        <div class="year-month-header" style="background: ${isCurrent ? '#2563EB' : '#475569'};">
          <h5>${mName.toUpperCase()}</h5>
          <span style="font-size:10px; font-weight:700;">${isCurrent ? 'ACTIVE' : ''}</span>
        </div>
        <div class="year-month-body">
          <div class="stat-row">
            <span class="text-muted">Monthly Completion:</span>
            <span class="bold">${samplePct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${samplePct}%;"></div>
          </div>
          <div class="stat-row mt-2">
            <span class="text-muted">Rewards Accumulated:</span>
            <span class="bold green">$${sampleEarned}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ===================================================
// FIELDS & REWARD TABLES RENDERER
// ===================================================
function renderFieldsAndRewards() {
  // Categories config
  const catList = document.getElementById("categories-config-list");
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

  // Reward settings table
  const rewardTbody = document.getElementById("rewards-settings-tbody");
  let rHtml = "";
  const maxRows = Math.max(HABIT_DATABASE.dailyHabits.length, HABIT_DATABASE.weeklyHabits.length, HABIT_DATABASE.monthlyHabits.length);

  for (let i = 0; i < maxRows; i++) {
    const dH = HABIT_DATABASE.dailyHabits[i];
    const wH = HABIT_DATABASE.weeklyHabits[i];
    const mH = HABIT_DATABASE.monthlyHabits[i];

    rHtml += `<tr>`;
    rHtml += `<td class="bold">${dH ? dH.category : (wH ? wH.category : (mH ? mH.category : ''))}</td>`;
    rHtml += `<td>${dH ? dH.name : '-'}</td>`;
    rHtml += `<td class="green bold">${dH ? '$' + dH.reward.toFixed(2) : '-'}</td>`;
    rHtml += `<td>${wH ? wH.name : '-'}</td>`;
    rHtml += `<td class="green bold">${wH ? '$' + wH.reward.toFixed(2) : '-'}</td>`;
    rHtml += `<td>${mH ? mH.name : '-'}</td>`;
    rHtml += `<td class="green bold">${mH ? '$' + mH.reward.toFixed(2) : '-'}</td>`;
    rHtml += `</tr>`;
  }
  rewardTbody.innerHTML = rHtml;
}

// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById("toast-notification");
  document.getElementById("toast-message").innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
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
      document.getElementById(`view-${target}`).classList.add("active");
    });
  });

  // Month Picker
  const monthPicker = document.getElementById("month-picker");
  monthPicker.addEventListener("change", (e) => {
    currentMonth = parseInt(e.target.value);
    renderDailyMatrix();
    renderSubTrackers();
    showToast(`Switched to ${MONTH_NAMES[currentMonth]} ${currentYear}`);
  });

  // Year Picker
  const yearPicker = document.getElementById("year-picker");
  yearPicker.addEventListener("change", (e) => {
    currentYear = parseInt(e.target.value);
    document.getElementById("yearly-banner-sub").innerText = `\u0671\u0644\u0650\u0627\u0633\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064e\u0629 — 'Habits ${currentYear}' through '${currentYear + 10}'`;
    renderDailyMatrix();
    renderSubTrackers();
    showToast(`Year range set to ${currentYear}`);
  });

  // Sound Toggle
  const btnAudio = document.getElementById("btn-audio-toggle");
  btnAudio.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    document.getElementById("audio-icon").innerText = soundEnabled ? "🔊" : "🔇";
    btnAudio.innerHTML = `<span id="audio-icon">${soundEnabled ? "🔊" : "🔇"}</span> Sound: ${soundEnabled ? "ON" : "OFF"}`;
    showToast(`Audio feedback: ${soundEnabled ? "Enabled" : "Disabled"}`);
  });

  // Reset Month
  document.getElementById("btn-reset-data").addEventListener("click", () => {
    if (confirm(`Are you sure you want to clear all checked habits for ${MONTH_NAMES[currentMonth]} ${currentYear}?`)) {
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
      saveState();
      renderDailyMatrix();
      renderSubTrackers();
      showToast("Month data cleared.");
    }
  });

  // Download Excel (.xlsx) file
  document.getElementById("btn-download-excel").addEventListener("click", () => {
    showToast("ٱلِاسْتِقَامَة — Downloading Istiqamah Tracker spreadsheet...");
    const link = document.createElement("a");
    link.href = "Istiqamah_Tracker_2026_2036.xlsx";
    link.download = "Istiqamah_Tracker_2026_2036.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Initial Renders
  renderDailyMatrix();
  renderSubTrackers();
  renderYearlyView();
  renderFieldsAndRewards();
});
