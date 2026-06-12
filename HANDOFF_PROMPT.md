# Claude Code Handoff Prompt

Copy everything below the line into Claude Code as your first message.

---

I'm handing off a partially-built World Cup 2026 bracket challenge app. Read `CLAUDE.md` in this directory first -- it has the full project context, schema, what's built, and what remains.

**Immediate priorities in order:**

1. **`npm install` and fix build errors.** The entire frontend was written in one pass without running a build. Run `npm run dev`, find and fix any TypeScript errors, import issues, or Tailwind v4 incompatibilities. The app uses Next.js 16, React 19, Tailwind v4, and @supabase/ssr.

2. **Build the football-data.org Edge Function for live score sync.** Create a Supabase Edge Function that fetches today's FIFA World Cup 2026 matches from football-data.org API v4, maps them to our `matches` table, and updates scores/status. The `recalculate_match_scores` trigger handles point recalculation automatically when match scores are updated. The `api_match_id` column exists on matches but isn't populated yet -- you'll need to either populate it by matching team names or fetch the competition's match list from the API and map by date+teams. Store the API key as a Supabase secret `FOOTBALL_DATA_API_KEY`. Make it invocable via HTTP (for admin manual trigger) and schedulable via cron.

3. **Add deadline auto-locking.** Create an Edge Function or pg_cron job that checks the `deadlines` table and calls `lock_predictions_for_stage()` when a deadline passes. The client already checks deadlines for UI locking, but server-side enforcement is needed.

4. **Deploy to Vercel.** The env vars needed are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already in `.env.local`).

The Supabase project ID is `epphtwzblamzhxuayjjv`. All tables, functions, triggers, views, RLS policies, and realtime subscriptions are already deployed and working. 104 matches are seeded (2 finished, 102 scheduled). 7 deadlines and 3 bonus questions are seeded.

Start with step 1.
