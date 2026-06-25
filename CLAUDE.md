# WC 2026 Bracket Challenge

## What This Is
A World Cup 2026 bracket challenge web app for 25 players. Replaces a manual Excel-based system. Players predict match scores, earn points, and compete on a leaderboard. Admin (the friend running the challenge) can manually update scores and post news.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Supabase (Postgres, Auth via magic link, Realtime, Edge Functions, RLS)
- **Deploy target**: Vercel
- **Score API**: football-data.org (free tier, needs API key)

## Supabase Project
- **ID**: `epphtwzblamzhxuayjjv`
- **URL**: `https://epphtwzblamzhxuayjjv.supabase.co`
- **Region**: us-east-1
- **Org**: `tudfgbvsswiesfmymfwb`

## Database Schema

### Tables
- **profiles**: id (uuid, FK auth.users), full_name, nickname, email (unique), is_admin, is_paid, avatar_url, created_at
- **matches**: id, match_number (unique), stage (group|r32|r16|qf|sf|third|final), group_letter, match_date, match_time, home_team, away_team, home_score, away_score, status (scheduled|live|finished), point_multiplier (default 1), api_match_id, venue, created_at
- **predictions**: id, player_id (FK profiles), match_id (FK matches), predicted_home (>=0), predicted_away (>=0), points_earned (default 0), submitted_at, updated_at, is_locked (default false)
- **deadlines**: id, stage, deadline_utc, description
- **bonus_questions**: id, question_text, points_value (default 5), correct_answer, is_resolved (default false)
- **bonus_answers**: id, player_id (FK profiles), question_id (FK bonus_questions), answer_text, points_earned (default 0), submitted_at
- **chat_messages**: id, player_id (FK profiles), message (<=500 chars), created_at
- **news_feed**: id, title, body, source_url, is_auto (default false), created_at

### Functions
- **calculate_points(p_home, p_away, a_home, a_away, multiplier)**: Immutable. Returns 3*mult (exact score), 1*mult (correct winner/draw), or 0.
- **recalculate_match_scores()**: BEFORE UPDATE trigger on matches. When home_score/away_score are set, recalculates points_earned on all predictions for that match. Auto-sets status to 'finished' if scores set while status='scheduled'.
- **handle_new_user()**: AFTER INSERT trigger on auth.users. Auto-creates a profile row.
- **lock_predictions_for_stage(stage_name)**: Locks all predictions for a given stage.

### Views
- **leaderboard**: Joins profiles + predictions + bonus_answers. Computes total_points, match_points, bonus_points, exact_scores, correct_winners, per-stage breakdowns (group/r32/r16/qf/sf/final), rank. Excludes admins.

### Realtime
Enabled on: matches, predictions, chat_messages, news_feed

### RLS
All tables have RLS enabled. Public SELECT on everything. Writes restricted to own data (auth.uid() = player_id). Admin-only write on matches, deadlines, bonus_questions, news_feed.

## Seeded Data
- 104 matches: 72 group (Groups A-L, 6 matches each), 16 R32, 8 R16, 4 QF, 2 SF, 1 Third, 1 Final
- Match 1 (Mexico 2-0 South Africa) and Match 2 (Korea Republic 2-1 Czech Republic) are marked finished
- R32 matches have seed labels like "1E vs 3rd A/B/C/D/F", R16+ are "TBD vs TBD"
- 7 deadlines (group through final)
- 3 bonus questions (Americas QF teams, Golden Boot, tournament podium)

## Scoring
- **0 pts**: Wrong winner
- **2 pts**: Correct winner/draw but wrong score
- **3 pts**: Exact score match
- **Multiplier**: point_multiplier column on matches (default 1, knockout multiplier TBD)
- **Bonus**: 5 pts each for 3 bonus questions
- **Prize split**: 50% / 35% / 15% for top 3

## App Structure (src/)
```
app/
  page.tsx              # Home/leaderboard (server component)
  layout.tsx            # Root layout with Nav
  globals.css           # Dark theme CSS variables
  login/page.tsx        # Magic link auth
  auth/callback/route.ts # Auth redirect handler
  dashboard/
    page.tsx            # Server: auth guard, data fetch
    DashboardClient.tsx # Stats, stage breakdown, recent results, upcoming, bonus
  predictions/
    page.tsx            # Server: auth guard, data fetch
    PredictionsClient.tsx # Stage tabs, per-match score inputs, bonus tab
  schedule/page.tsx     # All matches grouped by date
  bracket/
    page.tsx            # Server: knockout matches + group standings calc
    BracketView.tsx     # Groups/knockout toggle view
  head-to-head/
    page.tsx            # Server: auth guard
    H2HClient.tsx       # Player picker, side-by-side comparison
  news/page.tsx         # Chronological news feed
  chat/
    page.tsx            # Server: initial messages fetch
    ChatClient.tsx      # Realtime chat with Supabase subscription
  admin/
    page.tsx            # Server: admin guard
    AdminClient.tsx     # Match scores, players, bonus resolver, news posting
components/
  Nav.tsx               # Auth-aware nav with mobile hamburger
  DeadlineBanner.tsx    # Live countdown to next deadline
  LeaderboardTable.tsx  # Expandable rows with stage breakdown
lib/
  types.ts              # All TypeScript interfaces + STAGE_LABELS/STAGE_ORDER
  supabase/
    client.ts           # Browser client (createBrowserClient)
    server.ts           # Server client (createServerClient with cookies)
    middleware.ts        # Session refresh + route protection
middleware.ts           # Next.js middleware entry point
```

## What's Done
1. Supabase schema fully deployed (tables, functions, triggers, views, RLS, realtime)
2. All 104 matches seeded with dates, times, teams, group letters
3. Deadlines and bonus questions seeded
4. Full Next.js app with all pages listed above
5. Auth flow (magic link + callback + middleware protection)
6. Dark theme CSS

## What Remains

### Task 1: First Run Setup
- Run `npm install` in wc-bracket/
- Run `npm run dev` and fix any TypeScript/build errors
- The code was written without a build step, so there may be import issues or type mismatches to resolve

### Task 2: Supabase Edge Function for Live Score Sync
Build an Edge Function that:
- Calls football-data.org API (v4) to fetch today's World Cup match results
- Maps API matches to our matches table via api_match_id or team name matching
- Updates home_score, away_score, status on matches (which triggers recalculate_match_scores)
- Should run on a cron (every 5 min during match days) or be manually invocable
- Needs FOOTBALL_DATA_API_KEY as a Supabase secret
- The api_match_id column on matches is ready for this mapping but not yet populated

### Task 3: Deadline Auto-Locking
Build logic (Edge Function or cron) that:
- Checks deadlines table
- When deadline_utc passes, calls lock_predictions_for_stage() for that stage
- Could also be handled client-side (the prediction form already checks deadlines) but server-side enforcement is needed

### Task 4: Player Data Import
- The source spreadsheet has 25 players with emails and nicknames in the PLAYER INFO sheet
- Need to either: invite them via Supabase Auth, or pre-create profiles and let them claim via magic link
- Some players already submitted predictions as PDFs (in Player Brackets folder) that could be bulk-imported

### Task 5: Email Notifications (Nice to Have)
- Supabase Edge Function + Resend/SendGrid for deadline reminders and score updates

### Task 6: Deploy to Vercel
- Connect GitHub repo to Vercel
- Set env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Verify build succeeds

### Task 7: Polish & Testing
- Responsive testing on mobile
- Error states and loading skeletons
- Empty states for pages with no data yet
- "Who called it" feed showing correct predictions after each match
- Shareable prediction cards
- PDF bracket export

## Source Data
The original `2026 WC MASTER SHEET.xlsx` is in the parent directory. It contains:
- GROUP A-L sheets with the 360-column prediction grid
- BRACKET sheet with full schedule and knockout structure
- PLAYER INFO sheet with emails and nicknames
- Player Brackets folder with ~25 PDF prediction sheets
