import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_habit_tracker_workbook(filename="Istiqamah_Tracker_2026_2036.xlsx"):
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    # Common Styles & Palette
    header_fill = PatternFill(start_color="1F2937", end_color="1F2937", fill_type="solid") # Dark slate
    sub_header_fill = PatternFill(start_color="4B5563", end_color="4B5563", fill_type="solid")
    summary_card_fill = PatternFill(start_color="F3F4F6", end_color="F3F4F6", fill_type="solid")
    total_card_fill = PatternFill(start_color="E5E7EB", end_color="E5E7EB", fill_type="solid")
    
    # Week Colors (Matching exact template screenshots)
    week1_fill = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid") # Royal Blue
    week2_fill = PatternFill(start_color="F59E0B", end_color="F59E0B", fill_type="solid") # Amber / Orange
    week3_fill = PatternFill(start_color="FACC15", end_color="FACC15", fill_type="solid") # Bright Yellow
    week4_fill = PatternFill(start_color="C084FC", end_color="C084FC", fill_type="solid") # Purple / Lavender
    week5_fill = PatternFill(start_color="06B6D4", end_color="06B6D4", fill_type="solid") # Cyan

    # Category Colors
    cat_colors = {
        "Creative": ("D98880", "White"),
        "Career": ("F5B075", "Black"),
        "Fitness": ("FDE047", "Black"),
        "Financial": ("A7F3D0", "Black"),
        "Relationships": ("BAE6FD", "Black"),
        "Chores": ("DDD6FE", "Black"),
        "Personal": ("FED7AA", "Black"),
        "Spiritual": ("FEF08A", "Black"),
        "Learn new skills": ("E2E8F0", "Black"),
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

    # Bottom line under Static Inputs
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

    ws_fields["E12"] = "Habit category"
    ws_fields["E12"].fill = summary_card_fill
    ws_fields["E12"].alignment = Alignment(horizontal="center", vertical="center")
    ws_fields["E12"].font = Font(bold=True)

    week_items = [
        ("Week 1", "2563EB"),
        ("Week 2", "F59E0B"),
        ("Week 3", "FACC15"),
        ("Week 4", "C084FC"),
        ("Week 5", "06B6D4")
    ]
    for idx, (wk_name, wk_hex) in enumerate(week_items):
        r = 13 + idx
        ws_fields.cell(row=r, column=1).fill = PatternFill(start_color=wk_hex, end_color=wk_hex, fill_type="solid")
        ws_fields.cell(row=r, column=2, value=wk_name).font = Font(color="0000FF", bold=True)
        ws_fields.cell(row=r, column=2).alignment = Alignment(horizontal="center", vertical="center")

    categories_list = [
        ("Creative", "D98880"),
        ("Career", "F5B075"),
        ("Fitness", "FDE047"),
        ("Financial", "A7F3D0"),
        ("Relationships", "BAE6FD"),
        ("Chores", "DDD6FE"),
        ("Personal", "FED7AA"),
        ("Spiritual", "FEF08A"),
        ("Learn new skills", "E2E8F0")
    ]
    for idx, (cat_name, cat_hex) in enumerate(categories_list):
        r = 13 + idx
        ws_fields.cell(row=r, column=4).fill = PatternFill(start_color=cat_hex, end_color=cat_hex, fill_type="solid")
        ws_fields.cell(row=r, column=5, value=cat_name).font = Font(color="0000FF", bold=True)
        ws_fields.cell(row=r, column=5).alignment = Alignment(horizontal="center", vertical="center")

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

    # Habit sample definitions (matching the template exactly)
    habit_data = [
        {
            "category": "Creative",
            "color": "D98880",
            "daily": ["Practice painting", "Learn guitar", "Read one chapter", "Write one chapter", "Sketch at least once", "Practice embroidery"],
            "weekly": ["Paint a new landscape", "Play one new song", "Finish 10 chapters", "Write three chapters", "Draw 1 still life", "Finish one shape"],
            "monthly": ["Host an art night", "Memorize four songs", "Read one book", "Edit 10 chapters", "Paint one sketch", "Finish one embroidery project"]
        },
        {
            "category": "Career",
            "color": "F5B075",
            "daily": ["Learn code", "Sync with virtual team", "Complete daily tasks by EOD", "Read all emails by EOD", "Stop work by 6pm"],
            "weekly": ["Work", "Max three meetings", "Meet weekly deadlines", "Read all emails in a week", "Finish work by Friday 4pm", "Career reflection every Sunday"],
            "monthly": ["Attend a networking event", "Research new growth area", "Meet or surpass KPIs", "Inbox zero", "Create new KPIs for next month"]
        },
        {
            "category": "Fitness",
            "color": "FDE047",
            "daily": ["Ride exercise bike for 5 mins", "Go to the gym", "Practice football", "Run one mile", "50 situps", "20 pushups / pullups", "50 squats"],
            "weekly": ["Ride exercise bike for an hour", "Go to the gym 5 times", "Practice football with friends", "Run five miles", "250 situps", "100 pushups / pullups", "250 squats"],
            "monthly": ["Ride exercise bike every day", "Go to the gym 25 days", "Play one scrimmage", "Run 20 miles", "1000 situps", "400 pushups / pullups", "1000 squats"]
        },
        {
            "category": "Financial",
            "color": "A7F3D0",
            "daily": ["Check account", "Save $50", "Only eat out once", "Check stock market", "Research investment property"],
            "weekly": ["Save 10% of earnings", "Save $500", "Only eat out on Saturday", "Buy one new stock", "Go to one listing"],
            "monthly": ["Contribute to 401(K)", "Save $2000", "Limit eating out to 5 days", "Buy five new stocks", "Make one offer"]
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
        cat_cell.font = Font(name="Calibri", size=11, bold=True)
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
    
    # Sample reward mappings
    sample_rewards = [
        ("Practice painting", 10.0, "Paint a new landscape", 15.0, "Host an art night", 15.0),
        ("Learn guitar", 25.0, "Play one new song", 25.0, "Memorize four songs", 25.0),
        ("Sketch at least once", 30.0, "Draw 1 still life", 30.0, "Paint one sketch", 30.0),
        ("Practice embroidery", 2.0, "Finish one shape", 2.0, "Finish one embroidery project", 2.0),
        ("Learn code", 5.0, "Work", 5.0, "Attend a networking event", 5.0),
        ("Sync with virtual team", 10.0, "Max three meetings", 10.0, "Research new growth area", 5.0),
        ("Complete daily tasks by EOD", 1.0, "Meet weekly deadlines", 20.0, "Meet or surpass KPIs", 5.0),
        ("Read all emails by EOD", 1.5, "Read all emails in a week", 10.0, "Inbox zero", 4.0),
        ("Stop work by 6pm", 1.5, "Finish work by Friday 4pm", 10.0, "Create new KPIs for next month", 2.0),
        ("Ride exercise bike for 5 mins", 0.5, "Career reflection every Sunday", 2.0, "Ride exercise bike every day", 2.0),
        ("Go to the gym", 2.0, "Ride exercise bike for an hour", 2.0, "Go to the gym 25 days", 2.0),
        ("Practice football", 2.0, "Go to the gym 5 times", 2.0, "Play one scrimmage", 5.0),
        ("Run one mile", 2.0, "Practice football with friends", 5.0, "Run 20 miles", 1.0),
        ("50 situps", 5.0, "Run five miles", 1.0, "1000 situps", 5.0),
        ("20 pushups / pullups", 1.0, "250 situps", 3.0, "400 pushups / pullups", 1.0),
        ("50 squats", 2.5, "100 pushups / pullups", 1.0, "1000 squats", 2.5),
        ("Check account", 0.5, "250 squats", 2.5, "Contribute to 401(K)", 0.5),
        ("Save $50", 50.0, "Save 10% of earnings", 0.5, "Save $2000", 50.0),
        ("Only eat out once", 10.0, "Save $500", 50.0, "Limit eating out to 5 days", 10.0),
        ("Check stock market", 25.0, "Only eat out on Saturday", 10.0, "Buy five new stocks", 25.0),
    ]

    for item in sample_rewards:
        curr_row += 1
        ws_fields.cell(row=curr_row, column=1, value=item[0])
        c2 = ws_fields.cell(row=curr_row, column=2, value=item[1])
        c2.number_format = '$#,##0.00'
        c2.font = Font(color="0000FF")

        ws_fields.cell(row=curr_row, column=4, value=item[2])
        c5 = ws_fields.cell(row=curr_row, column=5, value=item[3])
        c5.number_format = '$#,##0.00'
        c5.font = Font(color="0000FF")

        ws_fields.cell(row=curr_row, column=7, value=item[4])
        c8 = ws_fields.cell(row=curr_row, column=8, value=item[5])
        c8.number_format = '$#,##0.00'
        c8.font = Font(color="0000FF")

    # Column widths for Fields
    ws_fields.column_dimensions["A"].width = 24
    ws_fields.column_dimensions["B"].width = 22
    ws_fields.column_dimensions["C"].width = 4
    ws_fields.column_dimensions["D"].width = 24
    ws_fields.column_dimensions["E"].width = 22
    ws_fields.column_dimensions["F"].width = 4
    ws_fields.column_dimensions["G"].width = 26
    ws_fields.column_dimensions["H"].width = 20

    # ==========================================
    # SHEET 2: MONTHLY HABITS
    # ==========================================
    ws_month = wb.create_sheet(title="Monthly habits")
    ws_month.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_month.merge_cells("A1:AL1")
    ws_month["A1"] = "ٱلِاسْتِقَامَة — MONTHLY HABITS"
    ws_month["A1"].font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    ws_month["A1"].fill = header_fill
    ws_month["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_month.row_dimensions[1].height = 32

    ws_month.merge_cells("A2:AL2")
    ws_month["A2"] = "Istiqamah Tracker | 'My habits' for 'October 2026'"
    ws_month["A2"].font = Font(name="Calibri", size=11, italic=True, color="FFFFFF")
    ws_month["A2"].fill = sub_header_fill
    ws_month["A2"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_month.row_dimensions[2].height = 20

    # Summary Section
    ws_month["A4"] = "SUMMARY"
    ws_month["A4"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[4].height = 22
    for col in range(1, 10):
        ws_month.cell(row=4, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    ws_month["B6"] = "EDIT RANGE"
    ws_month["B6"].font = Font(name="Calibri", size=9, bold=True)
    ws_month["B6"].alignment = Alignment(horizontal="center", vertical="center")

    ws_month["B7"] = "View from"
    ws_month["B7"].fill = summary_card_fill
    ws_month["B7"].font = Font(name="Calibri", size=9)
    ws_month["B7"].alignment = Alignment(horizontal="center", vertical="center")
    
    ws_month["D7"] = "Oct 1, 2026"
    ws_month["D7"].font = Font(name="Calibri", size=10, bold=True, color="0000FF")
    ws_month["D7"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["D7"].border = card_border

    ws_month["B9"] = "Complete to date:"
    ws_month["B9"].fill = summary_card_fill
    ws_month["B9"].font = Font(name="Calibri", size=9)
    ws_month["B9"].alignment = Alignment(horizontal="center", vertical="center")

    ws_month["D9"] = "=AVERAGE(H13:AL13)"
    ws_month["D9"].font = Font(name="Calibri", size=10, bold=True)
    ws_month["D9"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["D9"].number_format = '0%'
    ws_month["D9"].border = card_border

    ws_month["B11"] = "Total earned to date:"
    ws_month["B11"].fill = summary_card_fill
    ws_month["B11"].font = Font(name="Calibri", size=9)
    ws_month["B11"].alignment = Alignment(horizontal="center", vertical="center")

    ws_month["D11"] = "=SUM(H27:AL27)"
    ws_month["D11"].font = Font(name="Calibri", size=11, bold=True, color="059669")
    ws_month["D11"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["D11"].number_format = '$#,##0.00'
    ws_month["D11"].border = card_border

    # Month View Title
    ws_month["A13"] = "MONTH VIEW"
    ws_month["A13"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[13].height = 24

    # Grid columns structure:
    # Column A-F: Habit Names & Category Indicators
    # Column H-N: Week 1 (7 days: Day 1-7)
    # Column P-V: Week 2 (7 days: Day 8-14)
    # Column X-AD: Week 3 (7 days: Day 15-21)
    # Column AF-AL: Week 4 (7 days: Day 22-28)
    # Column AN-AP: Week 5 (3 days: Day 29-31)

    weeks_cols = [
        ("Week 1 (%)", 8, 14, week1_fill, "FFFFFF"),
        ("Week 2 (%)", 16, 22, week2_fill, "000000"),
        ("Week 3 (%)", 24, 30, week3_fill, "000000"),
        ("Week 4 (%)", 32, 38, week4_fill, "000000"),
        ("Week 5 (%)", 40, 42, week5_fill, "FFFFFF")
    ]

    # Row 14: Week Header Banners
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        ws_month.merge_cells(start_row=14, start_column=start_c, end_row=14, end_column=end_c)
        cell = ws_month.cell(row=14, column=start_c, value=wk_name)
        cell.fill = fill_color
        cell.font = Font(name="Calibri", size=10, bold=True, color=text_color)
        cell.alignment = Alignment(horizontal="center", vertical="center")

    ws_month.row_dimensions[14].height = 24

    # Row 15: Daily Completed (%)
    ws_month.cell(row=15, column=2, value="Daily completed (%)").font = Font(name="Calibri", size=9, bold=True)
    ws_month.cell(row=15, column=2).alignment = Alignment(horizontal="left", vertical="center")
    
    # Days & Weekdays
    day_counter = 1
    days_of_week = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"] # Sample for Feb
    
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        for c in range(start_c, end_c + 1):
            if day_counter <= 28: # February 28 days
                # Daily completed % formula
                col_letter = get_column_letter(c)
                ws_month.cell(row=15, column=c, value=f"=COUNTIF({col_letter}18:{col_letter}25, TRUE)/COUNTA({col_letter}18:{col_letter}25)")
                ws_month.cell(row=15, column=c).fill = fill_color
                ws_month.cell(row=15, column=c).font = Font(name="Calibri", size=8, bold=True, color=text_color)
                ws_month.cell(row=15, column=c).number_format = '0%'
                ws_month.cell(row=15, column=c).alignment = Alignment(horizontal="center", vertical="center")

                # Weekday name (Row 16)
                w_day_name = days_of_week[(day_counter - 1) % 7]
                c16 = ws_month.cell(row=16, column=c, value=w_day_name)
                c16.fill = fill_color
                c16.font = Font(name="Calibri", size=8, bold=True, color=text_color)
                c16.alignment = Alignment(horizontal="center", vertical="center")

                # Day number (Row 17)
                c17 = ws_month.cell(row=17, column=c, value=day_counter)
                c17.fill = fill_color
                c17.font = Font(name="Calibri", size=10, bold=True, color=text_color)
                c17.alignment = Alignment(horizontal="center", vertical="center")

                day_counter += 1
            else:
                # Extra days (for months with 30 or 31 days)
                c16 = ws_month.cell(row=16, column=c, value="")
                c16.fill = fill_color
                c17 = ws_month.cell(row=17, column=c, value=day_counter if day_counter <= 31 else "")
                c17.fill = fill_color
                c17.font = Font(name="Calibri", size=10, bold=True, color=text_color)
                c17.alignment = Alignment(horizontal="center", vertical="center")
                day_counter += 1

    # Daily Habits list (Rows 18-25)
    sample_month_habits = [
        ("Practice painting", "Creative", "D98880", 10.0),
        ("Learn guitar", "Creative", "D98880", 25.0),
        ("Sketch at least once", "Creative", "D98880", 30.0),
        ("Practice embroidery", "Creative", "D98880", 2.0),
        ("Learn code", "Career", "F5B075", 5.0),
        ("Sync with virtual team", "Career", "F5B075", 10.0),
        ("Complete daily tasks by EOD", "Career", "F5B075", 1.0),
        ("Ride exercise bike for 5 mins", "Fitness", "FDE047", 0.5)
    ]

    for idx, (h_name, cat, cat_color, rew_val) in enumerate(sample_month_habits):
        r = 18 + idx
        # Category color block and name
        ws_month.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        h_cell = ws_month.cell(row=r, column=1, value=h_name)
        h_cell.fill = PatternFill(start_color=cat_color, end_color=cat_color, fill_type="solid")
        h_cell.font = Font(name="Calibri", size=9, bold=True)
        h_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        h_cell.border = cell_border
        
        # Checkbox cells across all weeks
        for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
            for c in range(start_c, end_c + 1):
                box_cell = ws_month.cell(row=r, column=c, value=False) # Boolean checkboxes in Excel
                box_cell.alignment = Alignment(horizontal="center", vertical="center")
                box_cell.border = cell_border

    # Bottom Rows:
    # Row 26: Week completed (%)
    ws_month.cell(row=26, column=2, value="Week completed (%):").font = Font(name="Calibri", size=9, bold=True)
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        ws_month.merge_cells(start_row=26, start_column=start_c, end_row=26, end_column=end_c)
        sc_letter = get_column_letter(start_c)
        ec_letter = get_column_letter(end_c)
        cell = ws_month.cell(row=26, column=start_c, value=f"=AVERAGE({sc_letter}15:{ec_letter}15)")
        cell.fill = fill_color
        cell.font = Font(name="Calibri", size=10, bold=True, color=text_color)
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.number_format = '0%'

    # Row 27: Daily reward earned ($)
    ws_month.cell(row=27, column=2, value="Daily reward earned ($):").font = Font(name="Calibri", size=9, bold=True)
    for wk_name, start_c, end_c, fill_color, text_color in weeks_cols:
        for c in range(start_c, end_c + 1):
            col_letter = get_column_letter(c)
            # Formula: count checked * reward amounts (simplified sumproduct / sum of checked habits)
            # In Excel formula:
            ws_month.cell(row=27, column=c, value=f"=SUMPRODUCT(({col_letter}18:{col_letter}25=TRUE)*({{10; 25; 30; 2; 5; 10; 1; 0.5}}))")
            ws_month.cell(row=27, column=c).font = Font(name="Calibri", size=8, bold=True)
            ws_month.cell(row=27, column=c).alignment = Alignment(horizontal="center", vertical="center")
            ws_month.cell(row=27, column=c).number_format = '$#,##0'

    # Total Earned To Date Box (Row 30)
    ws_month.merge_cells("B29:E29")
    ws_month["B29"] = "Total earned to date"
    ws_month["B29"].fill = total_card_fill
    ws_month["B29"].font = Font(name="Calibri", size=9, bold=True)
    ws_month["B29"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["B29"].border = cell_border

    ws_month.merge_cells("B30:E30")
    ws_month["B30"] = "=SUM(H27:AP27)"
    ws_month["B30"].fill = summary_card_fill
    ws_month["B30"].font = Font(name="Calibri", size=12, bold=True, color="059669")
    ws_month["B30"].alignment = Alignment(horizontal="center", vertical="center")
    ws_month["B30"].number_format = '$#,##0.00'
    ws_month["B30"].border = card_border

    # ==========================================
    # WEEKLY HABITS SECTION (Rows 33-42)
    # ==========================================
    ws_month["A33"] = "WEEKLY HABITS"
    ws_month["A33"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[33].height = 24
    for col in range(1, 15):
        ws_month.cell(row=33, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    ws_month.merge_cells("A34:E34")
    ws_month["A34"] = "Weekly tasks"
    ws_month["A34"].fill = summary_card_fill
    ws_month["A34"].font = Font(name="Calibri", size=9, bold=True)
    ws_month["A34"].alignment = Alignment(horizontal="center", vertical="center")

    for idx, (wk_name, _, _, fill_color, text_color) in enumerate(weeks_cols):
        c_idx = 7 + idx
        cell = ws_month.cell(row=34, column=c_idx, value=f"Wk {idx+1}")
        cell.fill = fill_color
        cell.font = Font(name="Calibri", size=9, bold=True, color=text_color)
        cell.alignment = Alignment(horizontal="center", vertical="center")

    sample_weekly_habits = [
        ("Paint a new landscape", "Creative", "D98880", 15.0),
        ("Play one new song", "Creative", "D98880", 25.0),
        ("Meet weekly deadlines", "Career", "F5B075", 20.0),
        ("Ride exercise bike for an hour", "Fitness", "FDE047", 2.0)
    ]

    for idx, (w_name, cat, cat_color, rew_val) in enumerate(sample_weekly_habits):
        r = 35 + idx
        ws_month.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        cell = ws_month.cell(row=r, column=1, value=w_name)
        cell.fill = PatternFill(start_color=cat_color, end_color=cat_color, fill_type="solid")
        cell.font = Font(name="Calibri", size=9, bold=True)
        cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        cell.border = cell_border

        for wk_idx in range(5):
            c_cell = ws_month.cell(row=r, column=7 + wk_idx, value=False)
            c_cell.alignment = Alignment(horizontal="center", vertical="center")
            c_cell.border = cell_border

    # ==========================================
    # MONTHLY HABITS SECTION (Rows 43-52)
    # ==========================================
    ws_month["A43"] = "MONTHLY HABITS"
    ws_month["A43"].font = Font(name="Calibri", size=11, bold=True)
    ws_month.row_dimensions[43].height = 24
    for col in range(1, 15):
        ws_month.cell(row=43, column=col).border = Border(bottom=Side(style="medium", color="000000"))

    sample_monthly_tasks = [
        ("Host an art night", "Creative", "D98880", 15.0),
        ("Memorize four songs", "Creative", "D98880", 25.0),
        ("Attend a networking event", "Career", "F5B075", 5.0),
        ("Go to the gym 25 days", "Fitness", "FDE047", 2.0)
    ]

    for idx, (m_name, cat, cat_color, rew_val) in enumerate(sample_monthly_tasks):
        r = 44 + idx
        ws_month.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        cell = ws_month.cell(row=r, column=1, value=m_name)
        cell.fill = PatternFill(start_color=cat_color, end_color=cat_color, fill_type="solid")
        cell.font = Font(name="Calibri", size=9, bold=True)
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
