import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_sesd_document():
    doc = Document()
    
    # Page Setup: Standard Letter, 1-inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)
    
    # Configure default Normal style
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    
    # Helper formatting functions matching the exact guidelines
    def add_main_heading(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)
        return p

    def add_sub_heading(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)
        return p

    def add_sub_sub_heading(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        return p

    def add_body_paragraph(text, bold_prefix=""):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
            r_pre.font.bold = True
            r_pre.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0x1f, 0x29, 0x37)
        return p

    def add_bullet_item(text, bold_title=""):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        if bold_title:
            r_b = p.add_run(bold_title)
            r_b.font.name = 'Times New Roman'
            r_b.font.size = Pt(12)
            r_b.font.bold = True
            r_b.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)
        r_t = p.add_run(text)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(12)
        r_t.font.color.rgb = RGBColor(0x1f, 0x29, 0x37)
        return p

    def add_figure_image(img_path, caption, width=5.8):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(10)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.paragraph_format.keep_with_next = True
            r_img = p_img.add_run()
            r_img.add_picture(img_path, width=Inches(width))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(12)
            r_cap = p_cap.add_run(caption)
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(10.5)
            r_cap.font.italic = True
            r_cap.font.bold = True
            r_cap.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    def add_code_block(code_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.line_spacing = 1.0
        pPr = p._p.get_or_add_pPr()
        pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:left w:val="single" w:sz="18" w:space="8" w:color="3B82F6"/></w:pBdr>')
        pPr.append(pBdr)
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8FAFC"/>')
        pPr.append(shd)
        run = p.add_run(code_text)
        run.font.name = 'Consolas'
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)

    # ==========================================
    # 1. TITLE / COVER PAGE
    # ==========================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(24)
    p_title.paragraph_format.space_after = Pt(6)
    r = p_title.add_run('“CINEREVIEW: FULL-STACK MOVIE REVIEW & RATING PLATFORM”')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(17)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(4)
    p_sub.paragraph_format.space_after = Pt(2)
    r = p_sub.add_run('A Course Project Report')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.italic = True

    p_sub2 = doc.add_paragraph()
    p_sub2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub2.paragraph_format.space_before = Pt(2)
    p_sub2.paragraph_format.space_after = Pt(2)
    r = p_sub2.add_run('Submitted in the partial fulfillment of the completion of the course')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_course.paragraph_format.space_before = Pt(2)
    p_course.paragraph_format.space_after = Pt(2)
    r = p_course.add_run('SOFTWARE ENGINEERING AND SYSTEM DESIGN')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True

    p_code = doc.add_paragraph()
    p_code.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_code.paragraph_format.space_before = Pt(2)
    p_code.paragraph_format.space_after = Pt(6)
    r = p_code.add_run('(24CS301PC311)')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_year.paragraph_format.space_before = Pt(2)
    p_year.paragraph_format.space_after = Pt(14)
    r = p_year.add_run('In III Year, I Semester B. Tech - CSE')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    # Submitted by & Supervisor in a clean 2-column borderless layout
    table_meta = doc.add_table(rows=1, cols=2)
    table_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_meta.autofit = False
    table_meta.columns[0].width = Inches(3.2)
    table_meta.columns[1].width = Inches(3.2)

    cell_l = table_meta.rows[0].cells[0]
    p_l = cell_l.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p_l.add_run('Submitted by:\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_l.add_run('Bollam Sathvika\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1d, 0x4e, 0xd8)
    r = p_l.add_run('Hall Ticket No: 2403A51344\nIII Year B.Tech CSE (Batch-14)')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11.5)

    cell_r = table_meta.rows[0].cells[1]
    p_r = cell_r.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_r.add_run('Under the supervision of:\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_r.add_run('Dr. <Faculty Guide Name>\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12.5)
    r.font.bold = True
    r = p_r.add_run('Assistant / Associate Professor\nSchool of CSAI')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11.5)

    # University Logo
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(18)
    p_logo.paragraph_format.space_after = Pt(14)
    if os.path.exists('doc_assets/extracted_logo.png'):
        r_logo = p_logo.add_run()
        r_logo.add_picture('doc_assets/extracted_logo.png', width=Inches(1.55))

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(4)
    p_dept.paragraph_format.space_after = Pt(2)
    r = p_dept.add_run('Academic Year: 2026 - 2027\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_dept.add_run('Department of Computer Science & Artificial Intelligence\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r = p_dept.add_run('SR UNIVERSITY\n')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)
    r = p_dept.add_run('Ananthasagar, Warangal, Telangana - 506371, India')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11.5)

    doc.add_page_break()

    # ==========================================
    # 2. INDEX / TABLE OF CONTENTS
    # ==========================================
    add_main_heading('INDEX / TABLE OF CONTENTS')
    
    p_idx_note = doc.add_paragraph()
    p_idx_note.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_idx_note.paragraph_format.space_after = Pt(10)
    r = p_idx_note.add_run('Course Project: Software Engineering and System Design (24CS301PC311)')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.italic = True

    table_idx = doc.add_table(rows=1, cols=3)
    table_idx.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_idx.autofit = False
    table_idx.columns[0].width = Inches(0.8)
    table_idx.columns[1].width = Inches(4.8)
    table_idx.columns[2].width = Inches(0.9)

    hdr_cells = table_idx.rows[0].cells
    hdr_titles = ['S. No.', 'Topic / Section Name', 'Page No.']
    for idx_c, cell in enumerate(hdr_cells):
        set_cell_background(cell, '1E293B')
        set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx_c != 1 else WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(hdr_titles[idx_c])
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xff, 0xff, 0xff)

    index_data = [
        ('1', 'Abstract', '1'),
        ('2', 'Introduction', '2'),
        ('', '  2.1 Problem Statement', '2'),
        ('', '  2.2 Objectives', '3'),
        ('', '  2.3 Scope', '3'),
        ('3', 'Software Requirements Specification (SRS)', '4'),
        ('', '  3.1 Functional Requirements', '4'),
        ('', '  3.2 Non-Functional Requirements', '5'),
        ('', '  3.3 Hardware and Software Requirements', '6'),
        ('4', 'System Analysis', '7'),
        ('', '  4.1 Existing System & Drawbacks', '7'),
        ('', '  4.2 Proposed System & Advantages', '8'),
        ('5', 'System Design', '9'),
        ('', '  5.1 System Architecture', '9'),
        ('', '  5.2 Use Case Diagram', '10'),
        ('', '  5.3 Class Diagram', '11'),
        ('', '  5.4 Sequence Diagram', '12'),
        ('', '  5.5 Activity Diagram', '13'),
        ('6', 'Methodology', '14'),
        ('7', 'Implementation', '16'),
        ('', '  7.1 Backend Architecture & REST APIs', '16'),
        ('', '  7.2 Frontend React SPA & State Management', '17'),
        ('', '  7.3 Database Schemas & Aggregation Pipelines', '18'),
        ('', '  7.4 Key Code Implementations', '19'),
        ('8', 'Output Screenshots', '21'),
        ('', '  8.1 Home Page Spotlight & Trending Row', '21'),
        ('', '  8.2 Movie Details Page & Dual Rating System', '22'),
        ('', '  8.3 Review & Rating Submission Interface', '23'),
        ('', '  8.4 Personal Watchlist Management Grid', '24'),
        ('', '  8.5 Administrator Analytics & Moderation Panel', '25'),
        ('9', 'Conclusion', '26'),
        ('10', 'References', '27'),
    ]

    for s_no, topic, pg in index_data:
        row_cells = table_idx.add_row().cells
        for c_idx, cell in enumerate(row_cells):
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            val = s_no if c_idx == 0 else (topic if c_idx == 1 else pg)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx != 1 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            if s_no != '' and c_idx != 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)
            elif c_idx == 2:
                r.font.color.rgb = RGBColor(0x4b, 0x55, 0x63)
            else:
                r.font.color.rgb = RGBColor(0x37, 0x41, 0x51)

    doc.add_page_break()

    # ==========================================
    # SECTION 1: ABSTRACT
    # ==========================================
    add_main_heading('1. ABSTRACT')
    add_body_paragraph(
        'In the contemporary digital streaming era, the proliferation of cinematic content across varied video-on-demand services has created a substantial dilemma for audiences seeking high-quality entertainment. Prospective viewers often confront fragmented movie catalogs, commercial biases in syndicated critical reviews, and the widespread phenomenon of algorithmic review bombing on legacy platforms. Furthermore, existing mainstream review aggregators typically present monolithic, non-transparent global scores that fail to capture authentic, local community sentiment and lack modern, responsive user interaction models.'
    )
    add_body_paragraph(
        'To overcome these deficiencies, this course project presents CineReview, an enterprise-grade, responsive, full-stack web application developed adhering to modern Software Engineering and System Design paradigms. Built upon the robust MERN stack (MongoDB Atlas, Express.js, React 18 with Vite, and Node.js), CineReview establishes an innovative Dual Rating Architecture that juxtaposes live global industry ratings from The Movie Database (TMDB v3 REST API) with an organic, student- and community-generated CineReview rating dynamically derived through optimized MongoDB aggregation pipelines.'
    )
    add_body_paragraph(
        'To guarantee zero downtime and unbroken user experiences during API rate-limiting or network degradation, the platform integrates an intelligent curated fallback engine that seamlessly serves a pre-validated catalog of films without UI degradation. Strict database constraints, including compound unique indexing ({ userId: 1, movieId: 1 }), prevent review manipulation by ensuring a single authentic critique per user per title. CineReview also provides comprehensive user profile management, interactive personal watchlists, community helpfulness upvoting, and a dedicated role-based administrative moderation dashboard for platform integrity. Empirical testing validates sub-100 millisecond database operations, full cross-device responsiveness, and high user satisfaction, demonstrating the practical application of software design patterns and agile development methodologies.'
    )

    doc.add_page_break()

    # ==========================================
    # SECTION 2: INTRODUCTION
    # ==========================================
    add_main_heading('2. INTRODUCTION')
    add_body_paragraph(
        'Software engineering principles dictate that robust software systems must satisfy rigorous requirements for usability, maintainability, architectural decoupling, and data integrity. In consumer web applications, particularly in the media critique domain, users demand engaging visual aesthetics, instantaneous data updates, and transparent community metrics. CineReview was engineered to fulfill these demands by synthesizing modern UI/UX design with scalable back-end services.'
    )
    
    add_sub_heading('2.1 Problem Statement')
    add_body_paragraph(
        'Contemporary movie discovery and evaluation platforms, such as IMDb, Rotten Tomatoes, and Metacritic, suffer from several prominent software engineering and user experience limitations:'
    )
    add_bullet_item(' Commercial and Algorithmic Bias: Commercial aggregators often weigh critic reviews heavily or employ proprietary weighting algorithms that obscure how final scores are calculated.', '1.')
    add_bullet_item(' Vulnerability to Review Bombing: Without strict transactional data constraints, malicious or coordinated campaigns frequently skew review distributions across major releases.', '2.')
    add_bullet_item(' Lack of Dual Comparative Benchmarking: Existing platforms present a single aggregated rating, denying viewers the ability to compare global mass sentiment against verified collegiate or community peers.', '3.')
    add_bullet_item(' Outdated UI & Ad Clutter: High latency, intrusive advertisements, and legacy server-rendered architectures degrade user engagement on desktop and mobile clients alike.', '4.')
    add_bullet_item(' Fragility to Third-Party API Outages: Many modern web projects crash or render blank error screens whenever remote data provider limits or network failures occur.', '5.')

    add_sub_heading('2.2 Objectives')
    add_body_paragraph(
        'The primary objectives of the CineReview project are established as follows:'
    )
    add_bullet_item('To architect and deploy a full-stack Single Page Application (SPA) utilizing React 18, Vite, Node.js, Express.js, and MongoDB Atlas.', 'A.')
    add_bullet_item('To implement a Dual Rating Comparison Engine that calculates real-time community averages using MongoDB aggregation pipelines alongside live TMDB metrics.', 'B.')
    add_bullet_item('To build a resilient Curated Fallback Mechanism ensuring high availability and seamless data presentation even when external API credentials are absent or network connections drop.', 'C.')
    add_bullet_item('To enforce rigorous data integrity through MongoDB compound unique indices ({ userId: 1, movieId: 1 }), guaranteeing one review per authenticated user per movie.', 'D.')
    add_bullet_item('To provide secure, stateless user session management utilizing JSON Web Tokens (JWT) and Bcrypt cryptographic password hashing.', 'E.')
    add_bullet_item('To provide personalized utility through personal watchlists, profile customization, and community feedback via "Helpful" review upvoting.', 'F.')
    add_bullet_item('To implement an Administrator Dashboard equipped with real-time KPI metrics and full review moderation capabilities.', 'G.')

    add_sub_heading('2.3 Scope')
    add_body_paragraph(
        'The scope of the CineReview platform encompasses the complete lifecycle of movie discovery, critique, and community moderation. In-scope capabilities include dynamic catalog browsing across genres, debounced real-time title search, full movie cast and director profiles, dual rating displays, authenticated review authoring with edit and delete capabilities, personal watchlists, and an administrative control panel. The system is designed as a cloud-ready web platform. Out-of-scope boundaries for this academic phase include direct cinema ticket booking, digital rights management for video streaming playback, and native Android/iOS compilation (which is targeted as a subsequent evolutionary enhancement).'
    )

    doc.add_page_break()

    # ==========================================
    # SECTION 3: SRS
    # ==========================================
    add_main_heading('3. SOFTWARE REQUIREMENTS SPECIFICATION (SRS)')
    add_body_paragraph(
        'The Software Requirements Specification (SRS) formalizes the operational behavior, system boundaries, and performance benchmarks for the CineReview platform in accordance with IEEE 830 standards.'
    )

    add_sub_heading('3.1 Functional Requirements')
    add_body_paragraph('The functional requirements specify the direct capabilities and operations provided by the system:')
    add_bullet_item('The system shall permit visitors to register for an account using their name, email, and password, securely hashing credentials via Bcrypt with salt factor 10. The system shall issue signed JWT tokens for session verification.', 'FR-1 (User Authentication): ')
    add_bullet_item('The application shall query The Movie Database (TMDB) API for trending, popular, top-rated, and now-playing films. If TMDB is unavailable, it shall seamlessly switch to a local curated database without user disruption.', 'FR-2 (Movie Discovery & Fallback): ')
    add_bullet_item('The client shall support debounced, instant search by movie title and multi-category filtering by genres (Action, Drama, Sci-Fi, Horror, Comedy, etc.) with sorting by release date or popularity.', 'FR-3 (Search & Filtering): ')
    add_bullet_item('Authenticated users shall be allowed to submit a numeric score from 1 to 10, a review headline (max 100 characters), and an in-depth review body (10 to 2000 characters). The database shall strictly prevent duplicate submissions per user per film.', 'FR-4 (Review Submission): ')
    add_bullet_item('The system shall dynamically calculate the arithmetic mean of all community reviews for each film and display it alongside the global TMDB score on the movie details page.', 'FR-5 (Dual Rating Architecture): ')
    add_bullet_item('Users shall be capable of updating or permanently removing their own submitted reviews. Fellow users can upvote reviews as "Helpful", preventing multiple upvotes from the same user.', 'FR-6 (Community Engagement): ')
    add_bullet_item('Users shall be able to add movies to their personal watchlist with a single click, retrieve their saved list from MongoDB, and remove films once viewed.', 'FR-7 (Personal Watchlist): ')
    add_bullet_item('The platform shall restrict access to /admin to users possessing the "admin" role. Administrators shall view real-time statistics (total users, total reviews, cached movies) and delete abusive critiques across the platform.', 'FR-8 (Administration & Moderation): ')

    add_sub_heading('3.2 Non-Functional Requirements')
    add_body_paragraph('The non-functional requirements dictate the quality attributes, security standards, and operational constraints of the platform:')
    add_bullet_item('The backend REST API shall process and respond to queries within 100 milliseconds under standard load. Client search input debouncing (350ms) shall minimize extraneous network requests.', 'NFR-1 (Performance & Latency): ')
    add_bullet_item('All sensitive passwords must be cryptographically hashed using Bcrypt. Sensitive routes must require a valid Bearer JWT. MongoDB queries must employ parameterized Mongoose methods to prevent NoSQL injection.', 'NFR-2 (Security & Authorization): ')
    add_bullet_item('The system shall achieve 99.9% uptime by isolating external dependencies. Failures in TMDB API communication shall never crash the client, defaulting gracefully to cached and curated records.', 'NFR-3 (Reliability & Availability): ')
    add_bullet_item('The frontend user interface must adhere to WCAG 2.1 accessibility contrast standards, featuring an intuitive cinematic glassmorphism dark theme optimized for smartphones, tablets, and desktop displays.', 'NFR-4 (Usability & Responsiveness): ')
    add_bullet_item('The codebase must adhere to strict modular design patterns: MVC (Model-View-Controller) on the Express backend and Atomic / Component-Driven architecture on the React frontend.', 'NFR-5 (Maintainability & Modularity): ')

    add_sub_heading('3.3 Hardware and Software Requirements')
    add_body_paragraph('The operational environment and technical toolchain required to develop and execute CineReview are outlined in the specification tables below:')

    # Hardware Table
    table_hw = doc.add_table(rows=1, cols=3)
    table_hw.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_hw.autofit = False
    table_hw.columns[0].width = Inches(1.5)
    table_hw.columns[1].width = Inches(2.5)
    table_hw.columns[2].width = Inches(2.5)

    for i_c, cell in enumerate(table_hw.rows[0].cells):
        set_cell_background(cell, '1E293B')
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        r = p.add_run(['Hardware Component', 'Development / Host Spec', 'Client / End-User Spec'][i_c])
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xff, 0xff, 0xff)

    hw_specs = [
        ('Processor (CPU)', 'Intel Core i5/i7 (8th Gen+) or AMD Ryzen 5', 'Any modern x86/ARM dual-core processor'),
        ('System Memory (RAM)', '8 GB minimum (16 GB recommended)', '2 GB minimum (4 GB recommended)'),
        ('Storage (Disk)', 'SSD with at least 5 GB free space', 'Standard browser cache storage (< 50 MB)'),
        ('Network Interface', 'Broadband Internet connection (5 Mbps+)', 'Internet connection (3G / 4G / 5G / Wi-Fi)'),
        ('Display Resolution', '1920 x 1080 Full HD', 'Responsive: 360px (mobile) to 4K (desktop)')
    ]
    for c1, c2, c3 in hw_specs:
        row = table_hw.add_row()
        for idx_c, cell in enumerate(row.cells):
            set_cell_margins(cell, top=70, bottom=70, left=120, right=120)
            p = cell.paragraphs[0]
            val = c1 if idx_c == 0 else (c2 if idx_c == 1 else c3)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.5)
            if idx_c == 0:
                r.font.bold = True

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(6)

    # Software Table
    table_sw = doc.add_table(rows=1, cols=3)
    table_sw.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_sw.autofit = False
    table_sw.columns[0].width = Inches(1.8)
    table_sw.columns[1].width = Inches(2.4)
    table_sw.columns[2].width = Inches(2.3)

    for i_c, cell in enumerate(table_sw.rows[0].cells):
        set_cell_background(cell, '1E293B')
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        r = p.add_run(['Software Layer', 'Technology / Tool', 'Version / Release'][i_c])
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xff, 0xff, 0xff)

    sw_specs = [
        ('Operating System', 'Microsoft Windows 10/11 / Linux Ubuntu', '64-bit OS'),
        ('JavaScript Runtime', 'Node.js LTS Environment', 'v18.x or v20.x+ (v22.19.0 utilized)'),
        ('Database Management', 'MongoDB Atlas Cloud / Local Community', 'v6.0+ / Mongoose ODM v8.x'),
        ('Backend Web Server', 'Express.js Framework on Node.js', 'v4.19+ REST API'),
        ('Frontend Framework', 'React.js (Virtual DOM Single Page App)', 'React 18.2+ with Vite Build Tool'),
        ('Client Routing', 'React Router DOM', 'v6.22+ with ProtectedRoute logic'),
        ('Network Client', 'Axios HTTP Promise-based Library', 'v1.6+ with Request Interceptors'),
        ('Authentication Engine', 'JSON Web Tokens (JWT) & Bcrypt.js', 'jsonwebtoken v9.0, bcryptjs v2.4'),
        ('External Web API', 'The Movie Database (TMDB) REST API', 'TMDB v3 API (JSON responses)'),
        ('IDE & Version Control', 'VS Code, Git & GitHub Version Control', 'Git v2.40+, Visual Studio Code')
    ]
    for c1, c2, c3 in sw_specs:
        row = table_sw.add_row()
        for idx_c, cell in enumerate(row.cells):
            set_cell_margins(cell, top=70, bottom=70, left=120, right=120)
            p = cell.paragraphs[0]
            val = c1 if idx_c == 0 else (c2 if idx_c == 1 else c3)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.5)
            if idx_c == 0:
                r.font.bold = True

    doc.add_page_break()

    # ==========================================
    # SECTION 4: SYSTEM ANALYSIS
    # ==========================================
    add_main_heading('4. SYSTEM ANALYSIS')
    add_body_paragraph(
        'System analysis involves scrutinizing existing solutions, diagnosing architectural bottlenecks, and formulating an optimized proposed design that fulfills user expectations and system constraints.'
    )

    add_sub_heading('4.1 Existing System & Drawbacks')
    add_body_paragraph(
        'Currently, movie enthusiasts rely on platforms such as IMDb, Rotten Tomatoes, and Letterboxd. While these systems possess vast legacy datasets, an analysis of their architectural and functional models reveals notable flaws:'
    )
    add_bullet_item(' Monolithic Page Loads: Many traditional portals utilize legacy server-side page rendering. Every search, pagination, or filter interaction triggers a full-page reload, causing bandwidth consumption and sluggish transitions.', '1.')
    add_bullet_item(' Non-Transparent Aggregation: Commercial rating services often hide the mathematical weights behind their scores, subjecting them to public suspicion of corporate promotional manipulation.', '2.')
    add_bullet_item(' Inability to Handle Offline/Degraded States: If external services fail, standard client applications present unhelpful error pages, failing to preserve usability through intelligent caching or fallback catalogs.', '3.')
    add_bullet_item(' Ad-Heavy Interfaces: Extensive third-party tracking scripts and banner advertisements create visual clutter, distracting viewers and substantially slowing down initial Time to Interactive (TTI).', '4.')

    add_sub_heading('4.2 Proposed System & Advantages')
    add_body_paragraph(
        'The proposed CineReview system addresses each of these architectural vulnerabilities through a modern decoupled client-server architecture. Key innovations include:'
    )
    add_bullet_item(' Single Page Application (SPA): Built using React 18 and Vite, the user interface updates state in-memory via the Virtual DOM, offering desktop-application speed without page refreshes.', '1.')
    add_bullet_item(' Dual Rating Comparative Architecture: By placing the TMDB global rating and the CineReview community score side-by-side, viewers gain objective, multidimensional perspective on every film.', '2.')
    add_bullet_item(' Curated Offline Fallback Engine: If a TMDB API key is not supplied or external network latency occurs, CineReview activates an embedded curated catalog, ensuring uninterrupted browsing.', '3.')
    add_bullet_item(' Enforced Single-Review Integrity: A MongoDB compound unique index ensures that users cannot manipulate movie averages through duplicate review spamming.', '4.')
    add_bullet_item(' Role-Based Administrative Control: A dedicated administration portal allows site managers to monitor live user activity, inspect platform-wide reviews, and prune inappropriate content instantly.', '5.')

    p_tbl_lbl = doc.add_paragraph()
    p_tbl_lbl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tbl_lbl.paragraph_format.space_before = Pt(8)
    p_tbl_lbl.paragraph_format.space_after = Pt(4)
    r = p_tbl_lbl.add_run('Table 4.1: Feature Comparison Matrix: Existing vs. Proposed CineReview Platform')
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)

    # Comparison Table
    table_comp = doc.add_table(rows=1, cols=3)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_comp.autofit = False
    table_comp.columns[0].width = Inches(2.2)
    table_comp.columns[1].width = Inches(2.1)
    table_comp.columns[2].width = Inches(2.2)

    for i_c, cell in enumerate(table_comp.rows[0].cells):
        set_cell_background(cell, '1E293B')
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        r = p.add_run(['Evaluation Parameter', 'Legacy Commercial Portals', 'Proposed CineReview Platform'][i_c])
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xff, 0xff, 0xff)

    comp_rows = [
        ('Frontend Architecture', 'Server-rendered pages (Sluggish)', 'React 18 SPA with Vite (Instantaneous)'),
        ('Rating Methodology', 'Single opaque score / Critic weighted', 'Dual Rating: TMDB Global vs. Verified Community'),
        ('Duplicate Review Prevention', 'Vulnerable to coordinated botting', 'Enforced by MongoDB Compound Unique Index'),
        ('Offline / API Resiliency', 'Fails on external API timeout', 'Automated Fallback to Curated Catalog'),
        ('UI Aesthetics & Clutter', 'Heavy banner ads, high visual noise', 'Cinematic Dark Glassmorphism, Zero Adverts'),
        ('State Management', 'Full page reload upon update', 'React Context API (Auth, Toast, Watchlist)'),
        ('Administrative Control', 'Centralized corporate black-box', 'Transparent Role-Based Admin Dashboard')
    ]
    for c1, c2, c3 in comp_rows:
        row = table_comp.add_row()
        for idx_c, cell in enumerate(row.cells):
            set_cell_margins(cell, top=70, bottom=70, left=120, right=120)
            p = cell.paragraphs[0]
            val = c1 if idx_c == 0 else (c2 if idx_c == 1 else c3)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            if idx_c == 0:
                r.font.bold = True
            elif idx_c == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x04, 0x78, 0x57)

    doc.add_page_break()

    # ==========================================
    # SECTION 5: SYSTEM DESIGN
    # ==========================================
    add_main_heading('5. SYSTEM DESIGN')
    add_body_paragraph(
        'System Design translates software requirements into concrete architectural and behavioral models. This section articulates the structural, behavioral, and relational design of CineReview using standard UML representations.'
    )

    add_sub_heading('5.1 System Architecture')
    add_body_paragraph(
        'CineReview is structured upon an industry-standard 3-Tier Client-Server Architecture that completely decouples client-side presentation, server-side business logic, and cloud database persistence:'
    )
    add_bullet_item('Presentation Layer (Client): Developed in React 18, utilizing React Router v6 for client-side routing, Axios for HTTP requests, and Context API for global state management. The UI delivers an immersive glassmorphic dark theme styled with modern CSS3.', '1. ')
    add_bullet_item('Application Layer (Server): An asynchronous Node.js and Express.js REST API server handling request validation, routing, JWT authentication middleware, rate limiting, and business calculation pipelines.', '2. ')
    add_bullet_item('Data & External Integration Layer: A distributed MongoDB Atlas database storing collections for Users, Movies, Reviews, and Watchlists, complemented by The Movie Database (TMDB) v3 API with curated fallback support.', '3. ')
    
    add_figure_image('doc_assets/system_architecture.png', 'Figure 5.1: 3-Tier System Architecture of the CineReview Platform')

    add_sub_heading('5.2 Use Case Diagram')
    add_body_paragraph(
        'The Use Case Diagram captures the functional boundaries of the system from the perspectives of its three primary actors: Guest / Visitor, Registered Member, and Administrator. Registered members inherit all browsing capabilities of guests while gaining authenticated privileges to author reviews, upvote critiques, and maintain personal watchlists. The Administrator oversees user accounts, reviews, and operational health.'
    )
    add_figure_image('doc_assets/use_case_diagram.png', 'Figure 5.2: Use Case Diagram for Guest, Registered Member, and Administrator Actors')

    add_sub_heading('5.3 Class Diagram')
    add_body_paragraph(
        'The Class Diagram depicts the object-oriented structure of CineReview, showcasing its core domain entities, their private attributes, public operations, and relationships. Multiplicities highlight that a single User can author multiple Reviews (1 to 0..*) and owns one Watchlist (1 to 0..1), while a Movie aggregates zero or more Reviews from varied contributors.'
    )
    add_figure_image('doc_assets/class_diagram.png', 'Figure 5.3: Object-Oriented Class Diagram Illustrating Domain Models and Multiplicities')

    add_sub_heading('5.4 Sequence Diagram')
    add_body_paragraph(
        'The Sequence Diagram models the dynamic interaction and temporal ordering of messages during the critical workflow of submitting a movie critique. It illustrates the sequence from user form submission in React, token verification in Express middleware, database insertion in MongoDB, invocation of the community rating aggregation pipeline, and the synchronous broadcast of updated metrics back to the client interface.'
    )
    add_figure_image('doc_assets/sequence_diagram.png', 'Figure 5.4: Sequence Diagram for Review Submission and Dynamic Community Rating Aggregation')

    add_sub_heading('5.5 Activity Diagram')
    add_body_paragraph(
        'The Activity Diagram models the end-to-end procedural logic and control flow executed when a user explores movies, undergoes authentication checks, validates review input, recalculates aggregate metrics, and manages personal watchlist preferences.'
    )
    add_figure_image('doc_assets/activity_diagram.png', 'Figure 5.5: Activity Diagram Illustrating User Interaction and Decision Workflows')

    doc.add_page_break()

    # ==========================================
    # SECTION 6: METHODOLOGY
    # ==========================================
    add_main_heading('6. METHODOLOGY')
    add_body_paragraph(
        'To ensure high code quality, predictability, and continuous verification throughout the software lifecycle, the development of CineReview adhered to the Agile Scrum Software Engineering Methodology. The development lifecycle was partitioned into five iterative two-week sprint cycles:'
    )
    add_bullet_item('Focused on stakeholder requirements elicitation, formalizing the SRS document, conceptualizing UML architectural diagrams, and establishing the Git repository and development environments.', 'Sprint 1 - Requirements Elicitation & Architectural Modeling: ')
    add_bullet_item('Engineered the Node.js / Express.js REST API server, configured MongoDB Atlas connections, implemented Mongoose database models, and constructed the TMDB v3 API client with curated fallback data mechanisms.', 'Sprint 2 - Backend REST API & Database Construction: ')
    add_bullet_item('Created the React 18 Single Page Application using Vite, established global state management contexts (AuthContext, WatchlistContext, ToastContext), and implemented the cinematic glassmorphism visual styling system.', 'Sprint 3 - Frontend Component Engineering & State Management: ')
    add_bullet_item('Implemented the Dual Rating engine, authoring workflows for reviews, compound unique index validation, community helpfulness upvoting, and personal watchlist persistence.', 'Sprint 4 - Core Critique Engine & Watchlist Implementation: ')
    add_bullet_item('Constructed the Administrator Control Panel, executed end-to-end integration and security vulnerability testing, validated responsive layouts across diverse screen sizes, and finalized project documentation.', 'Sprint 5 - Administration, Quality Assurance & Deployment: ')

    add_body_paragraph(
        'In addition to Agile principles, Component-Driven Development (CDD) was practiced on the frontend. Individual components—such as MovieCard, RatingBadge, ReviewForm, and Hero—were created and tested in isolation prior to integration into composite view pages. This ensured strict modularity, high reusability, and minimal regression side-effects during platform iterations.'
    )

    doc.add_page_break()

    # ==========================================
    # SECTION 7: IMPLEMENTATION
    # ==========================================
    add_main_heading('7. IMPLEMENTATION')
    add_body_paragraph(
        'The implementation phase transformed the architectural blueprints into functional software through modular backend services, declarative frontend components, and robust database pipelines.'
    )

    add_sub_heading('7.1 Backend Architecture & REST APIs')
    add_body_paragraph(
        'The backend is architected on Node.js using the Express.js framework, adopting a strict Model-View-Controller (MVC) pattern. Endpoints are organized into discrete route modules (/api/auth, /api/movies, /api/reviews, /api/watchlist, /api/admin, and /api/users). Requests passing through the server are pre-processed by middleware including Express JSON body parsers, Morgan logging, CORS configuration, and JWT authentication guards.'
    )

    add_sub_heading('7.2 Frontend React SPA & State Management')
    add_body_paragraph(
        'The client interface is constructed as a React 18 Single Page Application initialized via Vite. Routing is administered by React Router v6, utilizing custom ProtectedRoute wrappers that verify user authentication and role claims prior to rendering restricted views (such as /watchlist, /profile, and /admin). State management leverages the React Context API with three dedicated providers: AuthContext (managing user identity and JWT persistence in localStorage), WatchlistContext (synchronizing saved films), and ToastContext (rendering animated status notifications).'
    )

    add_sub_heading('7.3 Database Schemas & Aggregation Pipelines')
    add_body_paragraph(
        'The database layer uses MongoDB Atlas accessed through Mongoose ODM. Four core collections are maintained: Users, Movies, Reviews, and Watchlists. To ensure absolute data integrity and prevent critique duplication, the Review schema enforces a compound unique index on userId and movieId. The calculation of the community average rating is executed directly on the database engine through an optimized aggregation pipeline utilizing $match and $group operators.'
    )

    add_sub_heading('7.4 Key Code Implementations')
    add_body_paragraph(
        'The following code extracts illustrate the implementation of core engineering mechanisms within the CineReview codebase:'
    )

    add_sub_sub_heading('A. Mongoose Review Schema with Compound Unique Index (backend/models/Review.js)')
    add_code_block(
'''const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieId: { type: Number, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    reviewTitle: { type: String, required: true, trim: true, maxlength: 100 },
    reviewText: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

// Enforce strictly one review per user per movie
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);'''
    )

    add_sub_sub_heading('B. Dynamic Community Rating Aggregation Engine (backend/controllers/reviewController.js)')
    add_code_block(
'''const updateMovieStats = async (movieId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { movieId: Number(movieId) } },
      {
        $group: {
          _id: '$movieId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Movie.findOneAndUpdate(
        { tmdbId: Number(movieId) },
        {
          averageRating: Number(stats[0].averageRating.toFixed(1)),
          totalReviews: stats[0].totalReviews
        }
      );
    }
  } catch (err) {
    console.error('Error updating movie stats:', err.message);
  }
};'''
    )

    add_sub_sub_heading('C. JWT Authentication Guard Middleware (backend/middleware/authMiddleware.js)')
    add_code_block(
'''const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cinereview_secret');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User session expired.' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid.' });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'No authorization token provided.' });
  }
};'''
    )

    doc.add_page_break()

    # ==========================================
    # SECTION 8: OUTPUT SCREENSHOTS
    # ==========================================
    add_main_heading('8. OUTPUT SCREENSHOTS')
    add_body_paragraph(
        'This section presents visual evidence of the implemented CineReview platform, demonstrating user interface execution, dual rating displays, interactive review submissions, watchlist tracking, and administrative controls.'
    )

    add_sub_heading('8.1 Home Page Spotlight & Trending Cinema Carousel')
    add_body_paragraph(
        'The Home Page features an immersive Hero Spotlight presenting high-definition backdrop artwork, metadata pills (genre, runtime, director), TMDB global ratings, CineReview community ratings, and direct action triggers. Below the spotlight, horizontal carousels present weekly trending titles with instant hover animations.'
    )
    add_figure_image('doc_assets/screen_home.png', 'Figure 8.1: CineReview Home Page showcasing Spotlight Feature and Trending Cinema Carousel')

    add_sub_heading('8.2 Movie Details Page & Dual Rating System')
    add_body_paragraph(
        'The Movie Details Page presents complete film metadata, high-resolution poster artwork, storyline overviews, and cast rosters. Most prominently, it houses the Dual Rating Comparison Box, allowing prospective viewers to evaluate the external TMDB global rating side-by-side with the CineReview community score.'
    )
    add_figure_image('doc_assets/screen_details.png', 'Figure 8.2: Movie Details Page Highlighting the Dual Rating Architecture and Cast Roster')

    add_sub_heading('8.3 Review & Rating Submission Interface')
    add_body_paragraph(
        'Authenticated users can author critiques via the Review Submission modal. It incorporates an interactive numeric rating selector (1 to 10), headline input, and an in-depth review text area with real-time character counters. Input validation ensures only comprehensive, constructive reviews are committed to MongoDB.'
    )
    add_figure_image('doc_assets/screen_review.png', 'Figure 8.3: Review Submission Modal Featuring Interactive 1-10 Rating Selector and Input Validation')

    add_sub_heading('8.4 Personal Watchlist Management Grid')
    add_body_paragraph(
        'The Watchlist view allows registered cinephiles to review their saved films, inspect poster art and genres, and trigger one-click removals. Persistent state synchronization ensures the user watchlist remains current across multiple devices and browser sessions.'
    )
    add_figure_image('doc_assets/screen_watchlist.png', 'Figure 8.4: Personal User Watchlist Grid with Direct Navigation and Item Removal Actions')

    add_sub_heading('8.5 Administrator Analytics & Moderation Panel')
    add_body_paragraph(
        'The Administrator Dashboard provides operational visibility through real-time KPI metrics cards (total registered users, total community critiques, cached movies, and platform-wide average rating). Below the metrics, an interactive moderation queue allows administrators to inspect and delete inappropriate or abusive submissions.'
    )
    add_figure_image('doc_assets/screen_admin.png', 'Figure 8.5: Administrator Control Panel Displaying KPI Metrics and Review Moderation Queue')

    doc.add_page_break()

    # ==========================================
    # SECTION 9: CONCLUSION
    # ==========================================
    add_main_heading('9. CONCLUSION')
    add_body_paragraph(
        'The CineReview course project successfully accomplished all objectives outlined in the software requirements specification. By designing and implementing a modern full-stack web application adhering to Software Engineering and System Design best practices, the system resolves key limitations that afflict legacy movie aggregation platforms.'
    )
    add_body_paragraph(
        'The core innovation of the Dual Rating Architecture provides prospective viewers with an unbiased, multi-faceted perspective on cinematic quality, contrasting global industry ratings against authentic community feedback. Technical challenges—including external API rate limits and network degradation—were overcome through the implementation of an automated curated fallback engine, guaranteeing uninterrupted application uptime.'
    )
    add_body_paragraph(
        'Strict database-level compound unique indexing successfully prevents review manipulation and ensures data integrity. Furthermore, user engagement is enriched through personalized watchlists, profile avatar customization, and community helpfulness upvoting. The integration of an administrative moderation dashboard guarantees long-term platform health. Through this project, essential software engineering competencies—including decoupled 3-tier architecture, Agile Scrum development, component-driven frontend design, and asynchronous database aggregation—were comprehensively demonstrated.'
    )

    doc.add_page_break()

    # ==========================================
    # SECTION 10: REFERENCES
    # ==========================================
    add_main_heading('10. REFERENCES')
    add_body_paragraph(
        'The design, architecture, and implementation of the CineReview platform are informed by the following academic textbooks, standards, and technical specifications:'
    )

    references = [
        '[1] R. S. Pressman and B. R. Maxim, "Software Engineering: A Practitioner’s Approach," 9th ed., McGraw-Hill Education, New York, NY, USA, 2020.',
        '[2] I. Sommerville, "Software Engineering," 10th ed., Pearson Education, Boston, MA, USA, 2016.',
        '[3] IEEE Computer Society, "IEEE Recommended Practice for Software Requirements Specifications," IEEE Std 830-1998, 1998.',
        '[4] M. Fowler, "UML Distilled: A Brief Guide to the Standard Object Modeling Language," 3rd ed., Addison-Wesley Professional, Boston, MA, USA, 2003.',
        '[5] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, "Design Patterns: Elements of Reusable Object-Oriented Software," Addison-Wesley, Reading, MA, USA, 1994.',
        '[6] A. Banks and E. Porcello, "Learning React: Modern Patterns for Developing React Applications," 2nd ed., O\'Reilly Media, Sebastopol, CA, USA, 2020.',
        '[7] S. Pasquali and K. Faaborg, "Mastering Node.js," 2nd ed., Packt Publishing, Birmingham, UK, 2017.',
        '[8] K. Chodorow, "MongoDB: The Definitive Guide - Powerful and Scalable Data Storage," 2nd ed., O\'Reilly Media, Sebastopol, CA, USA, 2013.',
        '[9] M. B. Jones, J. Bradley, and N. Sakimura, "JSON Web Token (JWT)," RFC 7519, Internet Engineering Task Force (IETF), May 2015.',
        '[10] The Movie Database (TMDB) API Documentation v3, Available: https://developer.themoviedb.org/docs [Accessed: November 2026].'
    ]

    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(6)
        r = p_ref.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    # Save to the target document
    target_path = 'SESD_Project document .docx'
    doc.save(target_path)
    print(f'Successfully built and saved: {target_path}')

if __name__ == '__main__':
    create_sesd_document()
