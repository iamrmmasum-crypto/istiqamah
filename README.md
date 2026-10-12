# ٱلِاسْتِقَامَة — Istiqāmah Tracker (2026–2036)

> **«فَٱسْتَقِمْ كَمَآ أُمِرْتَ»**  
> *"So remain on a right course as you have been commanded."* — [Surah Hūd 11:112]

A Quranic-inspired habit tracking system and spreadsheet designed for consistency (*istiqāmah*), work-life barakah, and goal attainment for **2026 through 2036**.

---

## 🌟 Key Features

1. **Interactive Web Dashboard**:
   - Monthly habit matrix with dynamic calendar days for any year (2026–2036).
   - Multi-category color tagging (Spiritual & Deen, Health & Fitness, Knowledge & Skills, Work & Focus, Mindfulness).
   - Audio-tactile feedback upon habit completion.
   - Live completion rate, streak tracking, and reward gamification calculations.

2. **Excel Spreadsheet Generator (`Istiqamah_Tracker_2026_2036.xlsx`)**:
   - **Fields & Color Selector**: Configure habit names, categories, and custom color palettes.
   - **Monthly Habit Sheets**: 12 dedicated monthly trackers with daily checkboxes and formula-driven progress rings.
   - **Yearly Habit Summary**: Full 10-year view tracking consistency over time.
   - **Reward Selector**: Custom reward calculations to gamify personal habits and milestones.

3. **Multi-Year Support**:
   - Defaulted to **2026** and supports active tracking all the way through **2036**.

---

## 🚀 Live Demo & Usage

- **Live Web App**: [https://istiqamah-murex.vercel.app/](https://istiqamah-murex.vercel.app/)
- **Download Spreadsheet**: Open the web app and click **"Download Excel (.xlsx)"** to get your ready-to-use template.

---

## 📁 Repository Structure

```
.
├── index.html                           # Main web application dashboard
├── style.css                            # Clean, modern styling & color tokens
├── app.js                               # Interactive habit tracking & calculations
├── Istiqamah_Tracker_2026_2036.xlsx     # Generated Microsoft Excel template
├── generate_habit_tracker_excel.py      # Python script to regenerate the workbook
├── vercel.json                          # Vercel deployment configuration
└── README.md
```

---

## 🛠️ Regenerating the Excel Template Locally

```bash
pip install openpyxl
python generate_habit_tracker_excel.py
```
Outputs `Istiqamah_Tracker_2026_2036.xlsx`.
