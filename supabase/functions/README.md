# Supabase Edge Functions

## Functions

### sync-scores
Fetches today's FIFA World Cup 2026 matches from football-data.org API and updates match scores and status in the database.

**Trigger**: HTTP POST (can be called manually or via cron)
**Required Secrets**: `FOOTBALL_DATA_API_KEY`

### lock-deadline
Checks the deadlines table and locks predictions for stages whose deadlines have passed.

**Trigger**: HTTP POST (can be called manually or via cron)
**Required Secrets**: None (uses Supabase service role)

## Deployment

### 1. Set up secrets in Supabase

```bash
supabase secrets set FOOTBALL_DATA_API_KEY=your_api_key_here
```

Get your API key from https://www.football-data.org/

### 2. Deploy functions

```bash
supabase functions deploy sync-scores
supabase functions deploy lock-deadline
```

### 3. Set up cron jobs (optional)

In Supabase, you can schedule functions via pg_cron or by using an external cron service.

**Example cron schedule for sync-scores:**
- During match days: Every 5 minutes
- Command: `curl -X POST https://your-project.supabase.co/functions/v1/sync-scores -H "Authorization: Bearer YOUR_ANON_KEY"`

**Example cron schedule for lock-deadline:**
- Every hour
- Command: `curl -X POST https://your-project.supabase.co/functions/v1/lock-deadline -H "Authorization: Bearer YOUR_ANON_KEY"`

## Testing Locally

```bash
# Start Supabase local development
supabase start

# Deploy functions to local environment
supabase functions deploy sync-scores --no-verify-jwt

# Test the function
curl -X POST http://localhost:54321/functions/v1/sync-scores \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Notes

- The sync-scores function uses football-data.org API v4
- FIFA World Cup 2026 competition ID: 738
- Functions match API matches to database matches using:
  1. `api_match_id` column (if populated)
  2. Team name matching (fallback)
- The `recalculate_match_scores` trigger automatically recalculates points when scores are updated
