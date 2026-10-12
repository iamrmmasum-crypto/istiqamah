import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_habit_tracker_workbook(filename="Istiqamah_Tracker_2026_2036.xlsx"):
    wb = openpyxl.Workbook()
    # Remove default sheet
    if "Sheet" in wb.sheetnames:
        wb.remove(wb["Sheet"])

    # Global Style definitions
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Navy Blue
    sub_header_fill = PatternFill(start_color="3B82F6", end_color="3B82F6", fill_type="solid") # Royal Blue
    summary_card_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid") # Light Slate
    total_card_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")

    # Week Colors
    week1_fill = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid") # Blue
    week2_fill = PatternFill(start_color="F59E0B", end_color="F59E0B", fill_type="solid") # Orange
    week3_fill = PatternFill(start_color="FACC15", end_color="FACC15", fill_type="solid") # Yellow
    week4_fill = PatternFill(start_color="C084FC", end_color="C084FC", fill_type="solid") # Purple
    week5_fill = PatternFill(start_color="06B6D4", end_color="06B6D4", fill_type="solid") # Cyan

    # Category Colors
    cat_colors = {
        "Spiritual": ("10B981", "White"),
        "Study & Work": ("3B82F6", "White"),
        "Health & Routine": ("F59E0B", "Black"),
        "Mindfulness": ("8B5CF6", "White"),
        "Self-Discipline": ("EC4899", "White"),
    }

    border_thin = Side(border_style="thin", color="D1D5DB")
    cell_border = Border(top=border_thin, left=border_thin, right=border_thin, bottom=border_thin)
    border_thick_black = Side(border_style="medium", color="111827")
    card_border = Border(top=border_thick_black, left=border_thick_black, right=border_thick_black, bottom=border_thick_black)

    # ==========================================
    # SHEET 1: FIELDS
    # ==========================================
    ws_fields = wb.create_sheet(title="Fields")
    ws_fields.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_fields.merge_cells("A1:K1")
    ws_fields["A1"] = "ٱلِاسْتِقَامَة — ISTIQĀMAH"
    ws_fields["A1"].font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    ws_fields["A1"].fill = header_fill
    ws_fields["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_fields.row_dimensions[1].height = 32

    ws_fields.merge_cells("A2:K2")
    ws_fields["A2"] = "Daily & Yearly Consistency Tracker | فَٱسْتَقِمْ كَمَآ أُمِرْتَ — Surah Hud 11:112"
    ws_fields["A2"].font = Font(name="Calibri", size=11, italic=True, color="FFFFFF")
    ws_fields["A2"].fill = sub_header_fill
    ws_fields["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_fields.row_dimensions[2].height = 20

    # STATIC INPUTS
    ws_fields["A4"] = "STATIC INPUTS"
    ws_fields["A4"].font = Font(name="Calibri", size=11, bold=True)
    ws_fields.row_dimensions[4].height = 22

    for col in range(1, 10):
        ws_fields.cell(row=4, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    ws_fields["A6"] = "Report name"
    ws_fields["A6"].fill = summary_card_fill
    ws_fields["A6"].font = Font(name="Calibri", size=10)
    ws_fields["A6"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["B6"] = "My habits"
    ws_fields["B6"].font = Font(name="Calibri", size=10, bold=True, color="0000FF")
    ws_fields["B6"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["B6"].border = cell_border

    ws_fields["A8"] = "Start date"
    ws_fields["A8"].fill = summary_card_fill
    ws_fields["A8"].font = Font(name="Calibri", size=10)
    ws_fields["A8"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["B8"] = "Jan 1, 2026"
    ws_fields["B8"].font = Font(name="Calibri", size=10, bold=True, color="0000FF")
    ws_fields["B8"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["B8"].border = cell_border

    # COLOR SELECTOR SECTION
    ws_fields["A10"] = "COLOR SELECTOR"
    ws_fields["A10"].font = Font(name="Calibri", size=11, bold=True)
    ws_fields.row_dimensions[10].height = 22
    for col in range(1, 10):
        ws_fields.cell(row=10, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    # Headers
    ws_fields["A12"] = "Color"
    ws_fields["A12"].fill = summary_card_fill
    ws_fields["A12"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["A12"].font = Font(bold=True)

    ws_fields["B12"] = "Weeks"
    ws_fields["B12"].fill = summary_card_fill
    ws_fields["B12"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["B12"].font = Font(bold=True)

    ws_fields["D12"] = "Color"
    ws_fields["D12"].fill = summary_card_fill
    ws_fields["D12"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["D12"].font = Font(bold=True)

    ws_fields["E12"] = "Categories"
    ws_fields["E12"].fill = summary_card_fill
    ws_fields["E12"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["E12"].font = Font(bold=True)

    # Week Color Items
    weeks_info = [
        ("Week 1", "2563EB", "Days 1 to 7"),
        ("Week 2", "F59E0B", "Days 8 to 14"),
        ("Week 3", "FACC15", "Days 15 to 21"),
        ("Week 4", "C084FC", "Days 22 to 28"),
        ("Week 5", "06B6D4", "Days 29 to 31")
    ]
    for idx, (w_name, color_hex, desc) in enumerate(weeks_info):
        r = 14 + (idx * 2)
        c_swatch = ws_fields.cell(row=r, column=1)
        c_swatch.fill = PatternFill(start_color=color_hex, end_color=color_hex, fill_type="solid")
        c_swatch.border = cell_border
        
        c_lbl = ws_fields.cell(row=r, column=2, value=w_name)
        c_lbl.font = Font(name="Calibri", size=10, bold=True)
        c_lbl.alignment = Alignment(horizontal="left", vertical="center")
        c_lbl.border = cell_border

    # Category Color Items
    for idx, (cat_name, (color_hex, txt_col)) in enumerate(cat_colors.items()):
        r = 14 + (idx * 2)
        c_swatch = ws_fields.cell(row=r, column=4)
        c_swatch.fill = PatternFill(start_color=color_hex, end_color=color_hex, fill_type="solid")
        c_swatch.border = cell_border
        
        c_lbl = ws_fields.cell(row=r, column=5, value=cat_name)
        c_lbl.font = Font(name="Calibri", size=10, bold=True)
        c_lbl.alignment = Alignment(horizontal="left", vertical="center")
        c_lbl.border = cell_border

    # HABIT SELECTOR SECTION
    ws_fields["A24"] = "HABIT SELECTOR"
    ws_fields["A24"].font = Font(name="Calibri", size=11, bold=True)
    ws_fields.row_dimensions[24].height = 24
    for col in range(1, 10):
        ws_fields.cell(row=24, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    headers_habit_selector = [("A26", "Habit type"), ("B26", "Daily habits"), ("D26", "Weekly habits"), ("F26", "Monthly habits")]
    for cell_id, text in headers_habit_selector:
        ws_fields[cell_id] = text
        ws_fields[cell_id].fill = summary_card_fill
        ws_fields[cell_id].font = Font(bold=True)
        ws_fields[cell_id].alignment = Alignment(horizontal="center", vertical="center")

    # Habit sample definitions organized by user's daily habits
    habit_data = [
        {
            "category": "Spiritual",
            "color": "10B981",
            "daily": ["🌅 Fajr Prayer (5:00 AM)", "🌞 Dhuhr Prayer [Jummah on Fri] (1:00 PM)", "🌤️ Asr Prayer (4:15 PM)", "🌇 Maghrib Prayer (5:45 PM)", "🌙 Isha Prayer & Reflection (7:45 PM)"],
            "weekly": ["🕌 Jummah Prayer & Surah Al-Kahf (Friday)", "📖 Weekly Quran & Islamic Lecture"],
            "monthly": ["🌙 Fast 3 White Days (Ayyam al-Beed)", "🤝 Sadaqah & Charitable Giving"]
        },
        {
            "category": "Study & Work",
            "color": "3B82F6",
            "daily": ["📚 Deep Study - Session 1 (6:00–9:00 AM)", "📰 Newspaper & Reading (9:00–9:30 AM)", "📝 Deep Study - Session 2 (10:00 AM–12:00 PM)"],
            "weekly": ["📊 Weekly Habit Audit & Next Week Planning", "Research new growth topics"],
            "monthly": ["📚 Finish Reading 1 Complete Book", "📈 Monthly Financial & Savings Audit"]
        },
        {
            "category": "Health & Routine",
            "color": "F59E0B",
            "daily": ["☀️ Early Wake Up (4:45 AM)", "🥗 Breakfast & Rest (9:30–10:00 AM)", "🚿 Bath & Grooming (12:00–1:00 PM)", "🛏️ Afternoon Nap / Qaylulah (2:00–4:00 PM)", "💧 Drink 2.5L+ Water (All Day)", "😴 Night Sleep on Time (11:30 PM–12:00 AM)"],
            "weekly": ["🏃 5km Run / Outdoor Fitness Session", "🧹 Room & Digital Workspace Deep Clean"],
            "monthly": ["🩺 Complete Routine Health Audit", "Deep rest & rejuvenation weekend"]
        },
        {
            "category": "Mindfulness",
            "color": "8B5CF6",
            "daily": ["🧘 Meditation & Morning Dhikr (5:30 AM)"],
            "weekly": ["👨‍👩‍👧 Family Quality Time & Silat ar-Rahim"],
            "monthly": ["🎯 Goals & Self-Accountability Review"]
        },
        {
            "category": "Self-Discipline",
            "color": "EC4899",
            "daily": ["🛡️ Screen Purity & Chastity / No Porn (All Day)"],
            "weekly": ["Digital Detox Sunday afternoon"],
            "monthly": ["Review Screen Discipline Milestones"]
        }
    ]

    curr_row = 28
    for group in habit_data:
        max_len = max(len(group["daily"]), len(group["weekly"]), len(group["monthly"]))
        start_cat_row = curr_row
        end_cat_row = curr_row + max_len - 1
        
        ws_fields.merge_cells(start_row=start_cat_row, start_column=1, end_row=end_cat_row, end_column=1)
        cat_cell = ws_fields.cell(row=start_cat_row, column=1, value=group["category"])
        cat_cell.fill = PatternFill(start_color=group["color"], end_color=group["color"], fill_type="solid")
        cat_cell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF" if group["color"] != "F59E0B" else "000000")
        cat_cell.alignment = Alignment(horizontal="center", vertical="center")

        for i in range(max_len):
            r = curr_row + i
            d_val = group["daily"][i] if i < len(group["daily"]) else ""
            w_val = group["weekly"][i] if i < len(group["weekly"]) else ""
            m_val = group["monthly"][i] if i < len(group["monthly"]) else ""
            
            ws_fields.cell(row=r, column=2, value=d_val).font = Font(color="0000FF")
            ws_fields.cell(row=r, column=4, value=w_val).font = Font(color="0000FF")
            ws_fields.cell(row=r, column=6, value=m_val).font = Font(color="0000FF")

            ws_fields.cell(row=r, column=2).border = Border(bottom=border_thin)
            ws_fields.cell(row=r, column=4).border = Border(bottom=border_thin)
            ws_fields.cell(row=r, column=6).border = Border(bottom=border_thin)

        curr_row += max_len + 1

    # REWARD SELECTOR SECTION
    curr_row += 1
    ws_fields.cell(row=curr_row, column=1, value="REWARD SELECTOR").font = Font(name="Calibri", size=11, bold=True)
    ws_fields.row_dimensions[curr_row].height = 22
    for col in range(1, 10):
        ws_fields.cell(row=curr_row, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    curr_row += 1
    ws_fields.cell(row=curr_row, column=1, value="Rewards (if habits completed)").font = Font(name="Calibri", size=10, bold=True)
    
    curr_row += 1
    reward_headers = [
        (1, "Daily habits"), (2, "Daily reward ($)"),
        (4, "Weekly habits"), (5, "Weekly reward ($)"),
        (7, "Monthly habits"), (8, "Monthly reward ($)")
    ]
    for col, text in reward_headers:
        c = ws_fields.cell(row=curr_row, column=col, value=text)
        c.fill = summary_card_fill
        c.font = Font(bold=True)
        c.alignment = Alignment(horizontal="center", vertical="center")
    
    sample_rewards = [
        ("☀️ Early Wake Up (4:45 AM)", 3.0, "🕌 Jummah Prayer & Surah Al-Kahf (Friday)", 10.0, "🌙 Fast 3 White Days (Ayyam al-Beed)", 20.0),
        ("🌅 Fajr Prayer (5:00 AM)", 5.0, "📖 Weekly Quran & Islamic Lecture", 5.0, "📚 Finish Reading 1 Complete Book", 25.0),
        ("🧘 Meditation & Morning Dhikr (5:30 AM)", 3.0, "🏃 5km Run / Outdoor Fitness Session", 5.0, "🤝 Sadaqah & Charitable Giving", 15.0),
        ("📚 Deep Study - Session 1 (6:00–9:00 AM)", 8.0, "👨‍👩‍👧 Family Quality Time & Silat ar-Rahim", 5.0, "📈 Monthly Financial & Savings Audit", 15.0),
        ("📰 Newspaper & Reading (9:00–9:30 AM)", 2.0, "🧹 Room & Digital Workspace Deep Clean", 5.0, "🎯 Goals & Self-Accountability Review", 10.0),
        ("🥗 Breakfast & Rest (9:30–10:00 AM)", 2.0, "📊 Weekly Habit Audit & Planning", 5.0, "-", 0.0),
        ("📝 Deep Study - Session 2 (10:00 AM–12:00 PM)", 6.0, "-", 0.0, "-", 0.0),
        ("🚿 Bath & Grooming (12:00–1:00 PM)", 2.0, "-", 0.0, "-", 0.0),
        ("🌞 Dhuhr Prayer [Jummah on Fri] (1:00 PM)", 5.0, "-", 0.0, "-", 0.0),
        ("🛏️ Afternoon Nap / Qaylulah (2:00–4:00 PM)", 3.0, "-", 0.0, "-", 0.0),
        ("🌤️ Asr Prayer (4:15 PM)", 5.0, "-", 0.0, "-", 0.0),
        ("🌇 Maghrib Prayer (5:45 PM)", 5.0, "-", 0.0, "-", 0.0),
        ("🌙 Isha Prayer & Reflection (7:45 PM)", 5.0, "-", 0.0, "-", 0.0),
        ("💧 Drink 2.5L+ Water (All Day)", 2.0, "-", 0.0, "-", 0.0),
        ("🛡️ Screen Purity & Chastity / No Porn (All Day)", 10.0, "-", 0.0, "-", 0.0),
        ("😴 Night Sleep on Time (11:30 PM–12:00 AM)", 4.0, "-", 0.0, "-", 0.0),
    ]

    for idx, (dh, dr, wh, wr, mh, mr) in enumerate(sample_rewards):
        r = curr_row + 1 + idx
        ws_fields.cell(row=r, column=1, value=dh).font = Font(color="0000FF")
        c_dr = ws_fields.cell(row=r, column=2, value=dr)
        c_dr.number_format = '$#,##0.00'
        c_dr.border = Border(bottom=border_thin)
        ws_fields.cell(row=r, column=1).border = Border(bottom=border_thin)

        if wh != "-":
            ws_fields.cell(row=r, column=4, value=wh).font = Font(color="0000FF")
            c_wr = ws_fields.cell(row=r, column=5, value=wr)
            c_wr.number_format = '$#,##0.00'
            c_wr.border = Border(bottom=border_thin)
            ws_fields.cell(row=r, column=4).border = Border(bottom=border_thin)

        if mh != "-":
            ws_fields.cell(row=r, column=7, value=mh).font = Font(color="0000FF")
            c_mr = ws_fields.cell(row=r, column=8, value=mr)
            c_mr.number_format = '$#,##0.00'
            c_mr.border = Border(bottom=border_thin)
            ws_fields.cell(row=r, column=7).border = Border(bottom=border_thin)

    # Column dimensions for Fields
    ws_fields.column_dimensions["A"].width = 18
    ws_fields.column_dimensions["B"].width = 38
    ws_fields.column_dimensions["C"].width = 14
    ws_fields.column_dimensions["D"].width = 38
    ws_fields.column_dimensions["E"].width = 14
    ws_fields.column_dimensions["F"].width = 38
    ws_fields.column_dimensions["G"].width = 14
    ws_fields.column_dimensions["H"].width = 14

    # ==========================================
    # SHEET 2: MONTHLY HABITS
    # ==========================================
    ws_month = wb.create_sheet(title="Monthly habits")
    ws_month.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_month.merge_cells("A1:AP1")
    ws_month["A1"] = "ٱلِاسْتِقَامَة — MONTHLY HABITS"
    ws_month["A1"].font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    ws_month["A1"].fill = header_fill
    ws_month["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_month.row_dimensions[1].height = 32

    ws_month.merge_cells("A2:AP2")
    ws_month["A2"] = "Istiqamah Tracker | 'My habits' for October 2026"
    ws_month["A2"].font = Font(name="Calibri", size=11, italic=True, color="FFFFFF")
    ws_month["A2"].fill = sub_header_fill
    ws_month["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_month.row_dimensions[2].height = 20

    # Summary Section Cards
    ws_month["A4"] = "SUMMARY"
    ws_month["A4"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[4].height = 22
    for col in range(1, 10):
        ws_month.cell(row=4, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    # Cards
    ws_month["B6"] = "SELECT MONTH"
    ws_month["B6"].font = Font(name="Calibri", size=9, bold=True)
    ws_month["B6"].alignment = Alignment(horizontal="center", vertical="center")

    ws_month["B7"] = "Month"
    ws_month["B7"].fill = summary_card_fill
    ws_month["B7"].font = Font(name="Calibri", size=9)
    ws_month["B7"].alignment = Alignment(horizontal="center", vertical="center")

    ws_month["D7"] = "Oct 2026"
    ws_month["D7"].font = Font(name="Calibri", size=10, bold=True, color="0000FF")
    ws_month["D7"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["D7"].border = card_border

    ws_month["B9"] = "Complete to date (%):"
    ws_month["B9"].fill = summary_card_fill
    ws_month["B9"].font = Font(name="Calibri", size=9)
    ws_month["B9"].alignment = Alignment(horizontal="center", vertical="center")

    ws_month["D9"] = "=AVERAGE(H15:AP15)"
    ws_month["D9"].font = Font(name="Calibri", size=10, bold=True)
    ws_month["D9"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["D9"].number_format = '0%'
    ws_month["D9"].border = card_border

    ws_month["B11"] = "Total earned to date ($):"
    ws_month["B11"].fill = summary_card_fill
    ws_month["B11"].font = Font(name="Calibri", size=9)
    ws_month["B11"].alignment = Alignment(horizontal="center", vertical="center")

    # Month View Title
    ws_month["A13"] = "MONTH VIEW"
    ws_month["A13"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[13].height = 24

    weeks_cols = [
        ("Week 1 (%)", 8, 14, week1_fill, "FFFFFF"),
        ("Week 2 (%)", 16, 22, week2_fill, "000000"),
        ("Week 3 (%)", 24, 30, week3_fill, "000000"),
        ("Week 4 (%)", 32, 38, week4_fill, "000000"),
        ("Week 5 (%)", 40, 42, week5_fill, "FFFFFF")
    ]

    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        ws_month.merge_cells(start_row=14, start_column=start_c, end_row=14, end_column=end_c)
        cell = ws_month.cell(row=14, column=start_c, value=wk_name)
        cell.fill = fill_color
        cell.font = Font(name="Calibri", size=10, bold=True, color=text_color)
        cell.alignment = Alignment(horizontal="center", vertical="center")

    ws_month.row_dimensions[14].height = 24

    # Daily Habits list (Rows 18-33)
    sample_month_habits = [
        ("☀️ Early Wake Up (4:45 AM)", "Health & Routine", "F59E0B", 3.0),
        ("🌅 Fajr Prayer (5:00 AM)", "Spiritual", "10B981", 5.0),
        ("🧘 Meditation & Morning Dhikr (5:30 AM)", "Mindfulness", "8B5CF6", 3.0),
        ("📚 Deep Study - Session 1 (6:00–9:00 AM)", "Study & Work", "3B82F6", 8.0),
        ("📰 Newspaper & Reading (9:00–9:30 AM)", "Study & Work", "3B82F6", 2.0),
        ("🥗 Breakfast & Rest (9:30–10:00 AM)", "Health & Routine", "F59E0B", 2.0),
        ("📝 Deep Study - Session 2 (10:00 AM–12:00 PM)", "Study & Work", "3B82F6", 6.0),
        ("🚿 Bath & Grooming (12:00–1:00 PM)", "Health & Routine", "F59E0B", 2.0),
        ("🌞 Dhuhr Prayer [Jummah on Fri] (1:00 PM)", "Spiritual", "10B981", 5.0),
        ("🛏️ Afternoon Nap / Qaylulah (2:00–4:00 PM)", "Health & Routine", "F59E0B", 3.0),
        ("🌤️ Asr Prayer (4:15 PM)", "Spiritual", "10B981", 5.0),
        ("🌇 Maghrib Prayer (5:45 PM)", "Spiritual", "10B981", 5.0),
        ("🌙 Isha Prayer & Reflection (7:45 PM)", "Spiritual", "10B981", 5.0),
        ("💧 Drink 2.5L+ Water (All Day)", "Health & Routine", "F59E0B", 2.0),
        ("🛡️ Screen Purity & Chastity / No Porn (All Day)", "Self-Discipline", "EC4899", 10.0),
        ("😴 Night Sleep on Time (11:30 PM–12:00 AM)", "Health & Routine", "F59E0B", 4.0),
    ]

    daily_start_row = 18
    daily_end_row = daily_start_row + len(sample_month_habits) - 1 # 33
    wk_pct_row = daily_end_row + 1 # 34
    daily_rew_row = daily_end_row + 2 # 35
    total_earned_label_row = daily_end_row + 4 # 37
    total_earned_val_row = daily_end_row + 5 # 38

    # Row 11 Total earned formula
    ws_month["D11"] = f"=SUM(H{daily_rew_row}:AP{daily_rew_row})"
    ws_month["D11"].font = Font(name="Calibri", size=11, bold=True, color="059669")
    ws_month["D11"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["D11"].number_format = '$#,##0.00'
    ws_month["D11"].border = card_border

    # Row 15: Daily Completed (%)
    ws_month.cell(row=15, column=2, value="Daily completed (%)").font = Font(name="Calibri", size=9, bold=True)
    ws_month.cell(row=15, column=2).alignment = Alignment(horizontal="left", vertical="center")
    
    day_counter = 1
    days_of_week = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"] # Oct 2026 starts on Thursday
    
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        for c in range(start_c, end_c + 1):
            if day_counter <= 31:
                col_letter = get_column_letter(c)
                ws_month.cell(row=15, column=c, value=f"=COUNTIF({col_letter}{daily_start_row}:{col_letter}{daily_end_row}, TRUE)/COUNTA({col_letter}{daily_start_row}:{col_letter}{daily_end_row})")
                ws_month.cell(row=15, column=c).fill = fill_color
                ws_month.cell(row=15, column=c).font = Font(name="Calibri", size=8, bold=True, color=text_color)
                ws_month.cell(row=15, column=c).number_format = '0%'
                ws_month.cell(row=15, column=c).alignment = Alignment(horizontal="center", vertical="center")

                w_day_name = days_of_week[(day_counter - 1) % 7]
                c16 = ws_month.cell(row=16, column=c, value=w_day_name)
                c16.fill = fill_color
                c16.font = Font(name="Calibri", size=8, bold=True, color=text_color)
                c16.alignment = Alignment(horizontal="center", vertical="center")

                c17 = ws_month.cell(row=17, column=c, value=day_counter)
                c17.fill = fill_color
                c17.font = Font(name="Calibri", size=10, bold=True, color=text_color)
                c17.alignment = Alignment(horizontal="center", vertical="center")

                day_counter += 1
            else:
                c16 = ws_month.cell(row=16, column=c, value="")
                c16.fill = fill_color
                c17 = ws_month.cell(row=17, column=c, value="")
                c17.fill = fill_color

    for idx, (h_name, cat, cat_color, rew_val) in enumerate(sample_month_habits):
        r = daily_start_row + idx
        ws_month.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        h_cell = ws_month.cell(row=r, column=1, value=h_name)
        h_cell.fill = PatternFill(start_color=cat_color, end_color=cat_color, fill_type="solid")
        h_cell.font = Font(name="Calibri", size=9, bold=True, color="FFFFFF" if cat_color != "F59E0B" else "000000")
        h_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        h_cell.border = cell_border
        
        for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
            for c in range(start_c, end_c + 1):
                box_cell = ws_month.cell(row=r, column=c, value=False)
                box_cell.alignment = Alignment(horizontal="center", vertical="center")
                box_cell.border = cell_border

    # Row 34: Week completed (%)
    ws_month.cell(row=wk_pct_row, column=2, value="Week completed (%):").font = Font(name="Calibri", size=9, bold=True)
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        ws_month.merge_cells(start_row=wk_pct_row, start_column=start_c, end_row=wk_pct_row, end_column=end_c)
        sc_letter = get_column_letter(start_c)
        ec_letter = get_column_letter(end_c)
        cell = ws_month.cell(row=wk_pct_row, column=start_c, value=f"=AVERAGE({sc_letter}15:{ec_letter}15)")
        cell.fill = fill_color
        cell.font = Font(name="Calibri", size=10, bold=True, color=text_color)
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.number_format = '0%'

    # Row 35: Daily reward earned ($)
    rew_list_str = "; ".join(str(h[3]) for h in sample_month_habits)
    ws_month.cell(row=daily_rew_row, column=2, value="Daily reward earned ($):").font = Font(name="Calibri", size=9, bold=True)
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        for c in range(start_c, end_c + 1):
            col_letter = get_column_letter(c)
            ws_month.cell(row=daily_rew_row, column=c, value=f"=SUMPRODUCT(({col_letter}{daily_start_row}:{col_letter}{daily_end_row}=TRUE)*({{{rew_list_str}}}))")
            ws_month.cell(row=daily_rew_row, column=c).font = Font(name="Calibri", size=8, bold=True)
            ws_month.cell(row=daily_rew_row, column=c).alignment = Alignment(horizontal="center", vertical="center")
            ws_month.cell(row=daily_rew_row, column=c).number_format = '$#,##0'

    # Total Earned To Date Box
    ws_month.merge_cells(f"B{total_earned_label_row}:E{total_earned_label_row}")
    ws_month[f"B{total_earned_label_row}"] = "Total earned to date"
    ws_month[f"B{total_earned_label_row}"].fill = total_card_fill
    ws_month[f"B{total_earned_label_row}"].font = Font(name="Calibri", size=9, bold=True)
    ws_month[f"B{total_earned_label_row}"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month[f"B{total_earned_label_row}"].border = cell_border

    ws_month.merge_cells(f"B{total_earned_val_row}:E{total_earned_val_row}")
    ws_month[f"B{total_earned_val_row}"] = f"=SUM(H{daily_rew_row}:AP{daily_rew_row})"
    ws_month[f"B{total_earned_val_row}"].fill = summary_card_fill
    ws_month[f"B{total_earned_val_row}"].font = Font(name="Calibri", size=12, bold=True, color="059669")
    ws_month[f"B{total_earned_val_row}"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month[f"B{total_earned_val_row}"].number_format = '$#,##0.00'
    ws_month[f"B{total_earned_val_row}"].border = card_border

    # ==========================================
    # WEEKLY HABITS SECTION
    # ==========================================
    weekly_hdr_row = total_earned_val_row + 3
    ws_month[f"A{weekly_hdr_row}"] = "WEEKLY HABITS"
    ws_month[f"A{weekly_hdr_row}"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[weekly_hdr_row].height = 24
    for col in range(1, 15):
        ws_month.cell(row=weekly_hdr_row, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    weekly_subhdr_row = weekly_hdr_row + 1
    ws_month.merge_cells(f"A{weekly_subhdr_row}:E{weekly_subhdr_row}")
    ws_month[f"A{weekly_subhdr_row}"] = "Weekly tasks"
    ws_month[f"A{weekly_subhdr_row}"].fill = summary_card_fill
    ws_month[f"A{weekly_subhdr_row}"].font = Font(name="Calibri", size=9, bold=True)
    ws_month[f"A{weekly_subhdr_row}"].alignment = Alignment(horizontal="center", vertical="center")

    for idx, (wk_name, _, _, fill_color, text_color) in enumerate(weeks_cols):
        c_idx = 7 + idx
        cell = ws_month.cell(row=weekly_subhdr_row, column=c_idx, value=f"Wk {idx+1}")
        cell.fill = fill_color
        cell.font = Font(name="Calibri", size=9, bold=True, color=text_color)
        cell.alignment = Alignment(horizontal="center", vertical="center")

    sample_weekly_habits = [
        ("🕌 Jummah Prayer & Surah Al-Kahf (Friday)", "Spiritual", "10B981", 10.0),
        ("📖 Weekly Quran & Islamic Lecture", "Spiritual", "10B981", 5.0),
        ("🏃 5km Run / Outdoor Fitness Session", "Health & Routine", "F59E0B", 5.0),
        ("👨‍👩‍👧 Family Quality Time & Silat ar-Rahim", "Mindfulness", "8B5CF6", 5.0),
        ("🧹 Room & Digital Workspace Deep Clean", "Health & Routine", "F59E0B", 5.0),
        ("📊 Weekly Habit Audit & Next Week Planning", "Study & Work", "3B82F6", 5.0)
    ]

    weekly_start_row = weekly_subhdr_row + 1
    for idx, (w_name, cat, cat_color, rew_val) in enumerate(sample_weekly_habits):
        r = weekly_start_row + idx
        ws_month.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        cell = ws_month.cell(row=r, column=1, value=w_name)
        cell.fill = PatternFill(start_color=cat_color, end_color=cat_color, fill_type="solid")
        cell.font = Font(name="Calibri", size=9, bold=True, color="FFFFFF" if cat_color != "F59E0B" else "000000")
        cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        cell.border = cell_border

        for wk_idx in range(5):
            c_cell = ws_month.cell(row=r, column=7 + wk_idx, value=False)
            c_cell.alignment = Alignment(horizontal="center", vertical="center")
            c_cell.border = cell_border

    # ==========================================
    # MONTHLY HABITS SECTION
    # ==========================================
    monthly_hdr_row = weekly_start_row + len(sample_weekly_habits) + 2
    ws_month[f"A{monthly_hdr_row}"] = "MONTHLY HABITS"
    ws_month[f"A{monthly_hdr_row}"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[monthly_hdr_row].height = 24
    for col in range(1, 15):
        ws_month.cell(row=monthly_hdr_row, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    sample_monthly_tasks = [
        ("🌙 Fast 3 White Days (Ayyam al-Beed)", "Spiritual", "10B981", 20.0),
        ("📚 Finish Reading 1 Complete Book", "Study & Work", "3B82F6", 25.0),
        ("🤝 Sadaqah & Charitable Giving", "Spiritual", "10B981", 15.0),
        ("📈 Monthly Financial & Savings Audit", "Study & Work", "3B82F6", 15.0),
        ("🎯 Goals & Self-Accountability Review", "Mindfulness", "8B5CF6", 10.0)
    ]

    monthly_start_row = monthly_hdr_row + 1
    for idx, (m_name, cat, cat_color, rew_val) in enumerate(sample_monthly_tasks):
        r = monthly_start_row + idx
        ws_month.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        cell = ws_month.cell(row=r, column=1, value=m_name)
        cell.fill = PatternFill(start_color=cat_color, end_color=cat_color, fill_type="solid")
        cell.font = Font(name="Calibri", size=9, bold=True, color="FFFFFF" if cat_color != "F59E0B" else "000000")
        cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        cell.border = cell_border

        c_cell = ws_month.cell(row=r, column=7, value=False)
        c_cell.alignment = Alignment(horizontal="center", vertical="center")
        c_cell.border = cell_border

    # Column widths for Monthly habits
    ws_month.column_dimensions["A"].width = 6
    ws_month.column_dimensions["B"].width = 12
    ws_month.column_dimensions["C"].width = 6
    ws_month.column_dimensions["D"].width = 6
    ws_month.column_dimensions["E"].width = 6
    ws_month.column_dimensions["F"].width = 2
    ws_month.column_dimensions["G"].width = 2
    for c in range(8, 45):
        ws_month.column_dimensions[get_column_letter(c)].width = 5.5

    # ==========================================
    # SHEET 3: YEARLY HABITS (2026-2036)
    # ==========================================
    ws_year = wb.create_sheet(title="Yearly habits")
    ws_year.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_year.merge_cells("A1:AL1")
    ws_year["A1"] = "ٱلِاسْتِقَامَة — YEARLY HABITS"
    ws_year["A1"].font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    ws_year["A1"].fill = header_fill
    ws_year["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_year.row_dimensions[1].height = 32

    ws_year.merge_cells("A2:AL2")
    ws_year["A2"] = "Istiqamah Tracker | 'Habits 2026' through '2036'"
    ws_year["A2"].font = Font(name="Calibri", size=11, italic=True, color="FFFFFF")
    ws_year["A2"].fill = sub_header_fill
    ws_year["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_year.row_dimensions[2].height = 20

    # Summary Section
    ws_year["A4"] = "SUMMARY"
    ws_year["A4"].font = Font(name="Calibri", size=11, bold=True)
    ws_year.row_dimensions[4].height = 22
    for col in range(1, 10):
        ws_year.cell(row=4, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    ws_year["B6"] = "EDIT RANGE"
    ws_year["B6"].font = Font(name="Calibri", size=9, bold=True)
    ws_year["B6"].alignment = Alignment(horizontal="center", vertical="center")

    ws_year["B7"] = "View from"
    ws_year["B7"].fill = summary_card_fill
    ws_year["B7"].font = Font(name="Calibri", size=9)
    ws_year["B7"].alignment = Alignment(horizontal="center", vertical="center")

    ws_year["D7"] = "2026"
    ws_year["D7"].font = Font(name="Calibri", size=10, bold=True, color="0000FF")
    ws_year["D7"].alignment = Alignment(horizontal="center", vertical="center")
    ws_year["D7"].border = card_border

    ws_year["B9"] = "Complete to date (%):"
    ws_year["B9"].fill = summary_card_fill
    ws_year["B9"].font = Font(name="Calibri", size=9)
    ws_year["B9"].alignment = Alignment(horizontal="center", vertical="center")

    ws_year["D9"] = "18%"
    ws_year["D9"].font = Font(name="Calibri", size=10, bold=True)
    ws_year["D9"].alignment = Alignment(horizontal="center", vertical="center")
    ws_year["D9"].border = card_border

    ws_year["B11"] = "Total earned to date ($):"
    ws_year["B11"].fill = summary_card_fill
    ws_year["B11"].font = Font(name="Calibri", size=9)
    ws_year["B11"].alignment = Alignment(horizontal="center", vertical="center")

    ws_year["D11"] = "$1,752.00"
    ws_year["D11"].font = Font(name="Calibri", size=11, bold=True, color="059669")
    ws_year["D11"].alignment = Alignment(horizontal="center", vertical="center")
    ws_year["D11"].border = card_border

    # Year View Bar
    ws_year["A13"] = "YEAR VIEW"
    ws_year["A13"].font = Font(name="Calibri", size=11, bold=True)
    ws_year.row_dimensions[13].height = 24

    # 12 Months Sections
    months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
    y_row = 15
    for m in months:
        ws_year.merge_cells(start_row=y_row, start_column=1, end_row=y_row, end_column=42)
        cell = ws_year.cell(row=y_row, column=1, value=m)
        cell.fill = PatternFill(start_color="9CA3AF", end_color="9CA3AF", fill_type="solid")
        cell.font = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
        cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws_year.row_dimensions[y_row].height = 20

        # Sub summary for each month
        ws_year.cell(row=y_row+1, column=2, value="Completion:").font = Font(size=8, bold=True)
        ws_year.cell(row=y_row+1, column=4, value="24%").font = Font(size=8)
        ws_year.cell(row=y_row+1, column=8, value="Total Rewards:").font = Font(size=8, bold=True)
        c_m_rew = ws_year.cell(row=y_row+1, column=11, value=516.50)
        c_m_rew.number_format = '$#,##0.00'
        c_m_rew.font = Font(size=8, color="059669", bold=True)

        y_row += 3

    # Column widths for Yearly habits
    ws_year.column_dimensions["A"].width = 6
    ws_year.column_dimensions["B"].width = 14
    ws_year.column_dimensions["C"].width = 6
    ws_year.column_dimensions["D"].width = 10
    for c in range(5, 45):
        ws_year.column_dimensions[get_column_letter(c)].width = 5.5

    wb.save(filename)
    print(f"Successfully generated: {filename}")

if __name__ == "__main__":
    build_habit_tracker_workbook("d:/MyProject/Istiqamah/Istiqamah_Tracker_2026_2036.xlsx")
