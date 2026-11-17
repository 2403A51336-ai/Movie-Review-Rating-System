import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_browser_window(title_text):
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 60)
    ax.axis('off')
    
    # Outer frame
    frame = patches.FancyBboxPatch((0, 0), 100, 60, boxstyle='round,pad=0', ec='#334155', fc='#0b0f19', lw=1.5)
    ax.add_patch(frame)
    
    # Browser top bar
    topbar = patches.Rectangle((0, 56), 100, 4, ec='#334155', fc='#1e293b', lw=1)
    ax.add_patch(topbar)
    
    # Window buttons
    ax.add_patch(patches.Circle((2.5, 58), 0.8, color='#ef4444'))
    ax.add_patch(patches.Circle((4.8, 58), 0.8, color='#f59e0b'))
    ax.add_patch(patches.Circle((7.1, 58), 0.8, color='#10b981'))
    
    # Address bar
    url_bar = patches.FancyBboxPatch((12, 56.7), 60, 2.6, boxstyle='round,pad=0.2', ec='#475569', fc='#0f172a', lw=0.8)
    ax.add_patch(url_bar)
    ax.text(14, 58, 'https://cinereview.local' + title_text, fontsize=7.5, color='#94a3b8', va='center')
    
    # Navbar
    nav = patches.Rectangle((0, 50.5), 100, 5.5, ec='#1e293b', fc='#0f172a', lw=1)
    ax.add_patch(nav)
    ax.text(4, 53.25, 'CINEREVIEW', fontsize=11, fontweight='bold', color='#f43f5e', va='center')
    ax.text(22, 53.25, 'Movies', fontsize=8, color='#e2e8f0', va='center')
    ax.text(30, 53.25, 'Trending', fontsize=8, color='#94a3b8', va='center')
    ax.text(40, 53.25, 'Watchlist', fontsize=8, color='#94a3b8', va='center')
    ax.text(50, 53.25, 'Search movies...', fontsize=7.5, color='#64748b', va='center')
    
    # User Profile Pill on right
    ax.add_patch(patches.FancyBboxPatch((84, 51.5), 13, 3.5, boxstyle='round,pad=0.3', ec='#ec4899', fc='#831843', lw=1))
    ax.text(90.5, 53.25, 'Sathvika B.', fontsize=7.5, fontweight='bold', color='#ffffff', ha='center', va='center')
    return fig, ax

# 1. Screen Home
fig, ax = create_browser_window('/')
hero = patches.FancyBboxPatch((4, 25), 92, 23, boxstyle='round,pad=0.5', ec='#374151', fc='#18181b', lw=1.2)
ax.add_patch(hero)
ax.add_patch(patches.Rectangle((7, 27), 13, 19, ec='#ec4899', fc='#27272a', lw=1.5))
ax.text(13.5, 36.5, 'DUNE: PART TWO\n[POSTER]', ha='center', va='center', fontsize=7, color='#fda4af')
ax.text(23, 44, 'SPOTLIGHT FEATURE', fontsize=7, fontweight='bold', color='#f43f5e')
ax.text(23, 40, 'Dune: Part Two (2024)', fontsize=14, fontweight='bold', color='#ffffff')
ax.text(23, 36.5, 'Sci-Fi | Adventure | 2h 46m  -  Director: Denis Villeneuve', fontsize=8, color='#cbd5e1')
ax.text(23, 32.5, 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators...', fontsize=7.5, color='#94a3b8')

ax.add_patch(patches.FancyBboxPatch((23, 27.5), 14, 3.2, boxstyle='round,pad=0.2', ec='#eab308', fc='#422006', lw=1))
ax.text(30, 29.1, 'TMDB 8.6/10', fontsize=7.5, fontweight='bold', color='#facc15', ha='center', va='center')

ax.add_patch(patches.FancyBboxPatch((39, 27.5), 18, 3.2, boxstyle='round,pad=0.2', ec='#a855f7', fc='#3b0764', lw=1))
ax.text(48, 29.1, 'CineReview 9.2/10', fontsize=7.5, fontweight='bold', color='#d8b4fe', ha='center', va='center')

ax.text(4, 21.5, 'TRENDING THIS WEEK', fontsize=9, fontweight='bold', color='#f8fafc')
cards = ['Oppenheimer\n8.9', 'Interstellar\n8.7', 'Spider-Verse\n8.8', 'Inception\n8.8', 'The Dark Knight\n9.0', 'Past Lives\n8.0']
for i, c in enumerate(cards):
    x = 4 + i * 15.5
    ax.add_patch(patches.FancyBboxPatch((x, 3), 14.5, 16.5, boxstyle='round,pad=0.3', ec='#334155', fc='#1e293b', lw=1))
    ax.add_patch(patches.Rectangle((x+1, 8), 12.5, 10.5, ec='#475569', fc='#0f172a'))
    ax.text(x+7.25, 13, '[Movie Poster]', ha='center', va='center', fontsize=6.5, color='#64748b')
    ax.text(x+7.25, 5.5, c, ha='center', va='center', fontsize=7, fontweight='bold', color='#e2e8f0')

plt.tight_layout()
plt.savefig('doc_assets/screen_home.png', bbox_inches='tight')
plt.close()

# 2. Screen Details
fig, ax = create_browser_window('/movies/693134')
ax.add_patch(patches.Rectangle((6, 12), 22, 34, ec='#f43f5e', fc='#18181b', lw=1.5))
ax.text(17, 29, 'DUNE: PART TWO\n[HD POSTER]', ha='center', va='center', fontsize=9, fontweight='bold', color='#fb7185')

ax.text(32, 42.5, 'Dune: Part Two (2024)', fontsize=16, fontweight='bold', color='#ffffff')
ax.text(32, 38.5, 'Release: March 1, 2024  |  Runtime: 166 min  |  Language: English', fontsize=8, color='#94a3b8')
ax.text(32, 35, 'Genres: Science Fiction, Adventure, Drama', fontsize=8, color='#cbd5e1')

ax.add_patch(patches.FancyBboxPatch((32, 23), 62, 9.5, boxstyle='round,pad=0.5', ec='#8b5cf6', fc='#1e1b4b', lw=1.5))
ax.text(34, 29.5, 'DUAL RATING ARCHITECTURE', fontsize=7.5, fontweight='bold', color='#c084fc')
ax.text(45, 26, 'TMDB Global Rating:\n8.6 / 10  (4,520 votes)', fontsize=8, fontweight='bold', color='#fbbf24', ha='center')
ax.text(75, 26, 'CineReview Community Score:\n9.2 / 10  (128 student reviews)', fontsize=8, fontweight='bold', color='#a855f7', ha='center')

ax.add_patch(patches.FancyBboxPatch((32, 14), 22, 5.5, boxstyle='round,pad=0.3', ec='#ec4899', fc='#be185d', lw=1.2))
ax.text(43, 16.75, '+ Add to Watchlist', fontsize=8.5, fontweight='bold', color='#ffffff', ha='center', va='center')

ax.add_patch(patches.FancyBboxPatch((56, 14), 22, 5.5, boxstyle='round,pad=0.3', ec='#3b82f6', fc='#1d4ed8', lw=1.2))
ax.text(67, 16.75, 'Write a Review', fontsize=8.5, fontweight='bold', color='#ffffff', ha='center', va='center')

ax.text(32, 7.5, 'Top Cast: Timothee Chalamet (Paul), Zendaya (Chani), Rebecca Ferguson (Lady Jessica)', fontsize=7.5, color='#94a3b8')

plt.tight_layout()
plt.savefig('doc_assets/screen_details.png', bbox_inches='tight')
plt.close()

# 3. Screen Review Modal
fig, ax = create_browser_window('/movies/693134#review')
modal = patches.FancyBboxPatch((15, 6), 70, 42, boxstyle='round,pad=0.8', ec='#f43f5e', fc='#18181b', lw=2)
ax.add_patch(modal)
ax.text(50, 44, 'Rate & Review "Dune: Part Two"', ha='center', va='center', fontsize=12, fontweight='bold', color='#ffffff')

ax.text(20, 39, 'Select Your Rating (1 to 10):', fontsize=8, fontweight='bold', color='#e2e8f0')
for r in range(1, 11):
    rx = 20 + (r-1) * 5.8
    bg = '#be185d' if r == 9 else '#27272a'
    tc = '#ffffff' if r == 9 else '#94a3b8'
    ax.add_patch(patches.FancyBboxPatch((rx, 34), 5, 3.5, boxstyle='round,pad=0.2', ec='#ec4899' if r==9 else '#3f3f46', fc=bg, lw=1))
    ax.text(rx+2.5, 35.75, str(r), ha='center', va='center', fontsize=8, fontweight='bold', color=tc)

ax.text(20, 30.5, 'Review Headline / Title:', fontsize=8, fontweight='bold', color='#e2e8f0')
ax.add_patch(patches.Rectangle((20, 26), 60, 3.2, ec='#52525b', fc='#09090b', lw=1))
ax.text(22, 27.6, 'A visual and auditory triumph of modern sci-fi cinema!', fontsize=7.5, color='#f43f5e')

ax.text(20, 22.5, 'Your In-Depth Review:', fontsize=8, fontweight='bold', color='#e2e8f0')
ax.add_patch(patches.Rectangle((20, 13), 60, 8, ec='#52525b', fc='#09090b', lw=1))
ax.text(22, 18.5, 'Denis Villeneuve delivers an operatic masterpiece. The sound design, cinematography,\nand pacing keep you captivated throughout the runtime. A benchmark for modern filmmaking.', fontsize=7.2, color='#cbd5e1')

ax.add_patch(patches.FancyBboxPatch((40, 8), 20, 3.8, boxstyle='round,pad=0.3', ec='#ec4899', fc='#e11d48', lw=1.2))
ax.text(50, 9.9, 'Submit Review', ha='center', va='center', fontsize=8.5, fontweight='bold', color='#ffffff')

plt.tight_layout()
plt.savefig('doc_assets/screen_review.png', bbox_inches='tight')
plt.close()

# 4. Screen Watchlist
fig, ax = create_browser_window('/watchlist')
ax.text(6, 44, 'My Personal Watchlist', fontsize=14, fontweight='bold', color='#ffffff')
ax.text(6, 40.5, 'Manage and organize movies you plan to watch (4 Movies Saved)', fontsize=8, color='#94a3b8')

w_movies = [
    ('Dune: Part Two (2024)', 'Rating: 8.6/10', 'Sci-Fi / Action'),
    ('Oppenheimer (2023)', 'Rating: 8.9/10', 'Biography / Drama'),
    ('Interstellar (2014)', 'Rating: 8.7/10', 'Sci-Fi / Adventure'),
    ('Past Lives (2023)', 'Rating: 8.0/10', 'Romance / Drama')
]

for idx, (m_title, m_rate, m_gen) in enumerate(w_movies):
    wx = 6 + idx * 22.5
    ax.add_patch(patches.FancyBboxPatch((wx, 6), 21, 31, boxstyle='round,pad=0.4', ec='#3b82f6', fc='#1e293b', lw=1.2))
    ax.add_patch(patches.Rectangle((wx+1.5, 15), 18, 20, ec='#475569', fc='#0f172a'))
    ax.text(wx+10.5, 25, '[Movie Poster]', ha='center', va='center', fontsize=7, color='#64748b')
    ax.text(wx+10.5, 12, m_title, ha='center', va='center', fontsize=7.2, fontweight='bold', color='#ffffff')
    ax.text(wx+10.5, 9.5, m_rate + ' | ' + m_gen, ha='center', va='center', fontsize=6.5, color='#93c5fd')
    ax.add_patch(patches.FancyBboxPatch((wx+3, 6.5), 15, 2.2, boxstyle='round,pad=0.2', ec='#ef4444', fc='#7f1d1d', lw=0.8))
    ax.text(wx+10.5, 7.6, 'Remove from Watchlist', ha='center', va='center', fontsize=6, color='#fca5a5')

plt.tight_layout()
plt.savefig('doc_assets/screen_watchlist.png', bbox_inches='tight')
plt.close()

# 5. Screen Admin Dashboard
fig, ax = create_browser_window('/admin')
ax.text(6, 44, 'Administrator Control & Moderation Panel', fontsize=13, fontweight='bold', color='#f43f5e')
ax.text(6, 40.5, 'Platform overview, live performance metrics, and community moderation', fontsize=8, color='#94a3b8')

kpis = [
    ('Total Users', '1,420', '+12% this week', '#3b82f6'),
    ('Community Reviews', '3,850', 'Verified submissions', '#8b5cf6'),
    ('Movies Cached', '450', 'TMDB + Curated', '#10b981'),
    ('Platform Avg Rating', '8.4 / 10', 'Healthy consensus', '#f59e0b')
]

for idx, (label, val, sub, col) in enumerate(kpis):
    kx = 6 + idx * 22.5
    ax.add_patch(patches.FancyBboxPatch((kx, 28), 21, 10, boxstyle='round,pad=0.4', ec=col, fc='#18181b', lw=1.2))
    ax.text(kx+2, 35.5, label, fontsize=7.5, color='#94a3b8')
    ax.text(kx+2, 31.5, val, fontsize=13, fontweight='bold', color=col)
    ax.text(kx+2, 29, sub, fontsize=6.5, color='#64748b')

ax.text(6, 23.5, 'Recent User Reviews Moderation Queue:', fontsize=8.5, fontweight='bold', color='#ffffff')
ax.add_patch(patches.Rectangle((6, 4), 88, 17.5, ec='#334155', fc='#111827', lw=1))

ax.text(8, 19, 'Movie Title', fontsize=7.5, fontweight='bold', color='#9ca3af')
ax.text(32, 19, 'User', fontsize=7.5, fontweight='bold', color='#9ca3af')
ax.text(46, 19, 'Rating', fontsize=7.5, fontweight='bold', color='#9ca3af')
ax.text(56, 19, 'Review Snippet', fontsize=7.5, fontweight='bold', color='#9ca3af')
ax.text(84, 19, 'Action', fontsize=7.5, fontweight='bold', color='#9ca3af')
ax.plot([6, 94], [17.5, 17.5], color='#374151', lw=0.8)

sample_rows = [
    ('Dune: Part Two', 'Bollam Sathvika', '9/10', 'Denis Villeneuve delivers an operatic masterpiece...'),
    ('Oppenheimer', 'Rahul Sharma', '10/10', 'Soundtrack and acting by Cillian Murphy was flawless...'),
    ('Past Lives', 'Ananya Patel', '8/10', 'Deeply emotional drama with subtle performances...')
]

for ri, (m, u, r, snip) in enumerate(sample_rows):
    ry = 14.5 - ri * 4.2
    ax.text(8, ry, m, fontsize=7.2, color='#ffffff')
    ax.text(32, ry, u, fontsize=7.2, color='#cbd5e1')
    ax.text(46, ry, r, fontsize=7.2, color='#facc15')
    ax.text(56, ry, snip[:38] + '...', fontsize=7, color='#94a3b8')
    ax.add_patch(patches.FancyBboxPatch((83, ry-1.2), 9, 2.5, boxstyle='round,pad=0.2', ec='#ef4444', fc='#991b1b', lw=0.8))
    ax.text(87.5, ry, 'Delete', ha='center', va='center', fontsize=6.5, color='#ffffff')

plt.tight_layout()
plt.savefig('doc_assets/screen_admin.png', bbox_inches='tight')
plt.close()
print('All 5 UI screens successfully written and generated!')
