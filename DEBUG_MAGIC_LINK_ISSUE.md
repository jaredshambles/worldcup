# Magic Link Authentication Issue - Diagnosis & Solution

## Problem
When attempting to send a magic link via `signInWithOtp()`, Supabase returns:
```
{
  "code": 500,
  "error_code": "unexpected_failure",
  "msg": "Database error finding user",
  "error_id": "019ebd31-34bf-7598-adfa-d1dc317f697c"
}
```

## Root Cause
The `handle_new_user()` trigger (which auto-creates a profile when a new auth user is created) is failing due to **RLS policy restrictions**. When Supabase's auth system tries to create a new user, the trigger can't insert into the `profiles` table because the RLS policies are blocking it.

## Why RLS is Breaking This
The `handle_new_user` trigger runs with the `authenticator` role, NOT as the authenticated user. Therefore:
- ❌ Policies that check `auth.uid() = user_id` don't apply
- ❌ The new policy "Allow auth trigger to create profiles" for authenticated users doesn't help
- ✅ Need a policy that allows the trigger to insert without user checks

## Solution
Replace the RLS policy on `profiles` table with one that allows the trigger to work:

### Step 1: Go to Supabase Dashboard
1. Project: `epphtwzblamzhxuayjjv`
2. Navigate to: **SQL Editor** → **New Query**

### Step 2: Disable RLS Temporarily & Check
```sql
-- Check current policies
SELECT schemaname, tablename, policyname, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY tablename, policyname;
```

### Step 3: Fix the RLS Policy
```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "Allow auth trigger to create profiles" ON profiles;

-- Create a proper policy that allows the trigger to work
CREATE POLICY "Allow service role and trigger to insert"
ON profiles FOR INSERT
WITH CHECK (true);

-- Keep existing SELECT/UPDATE policies for users
CREATE POLICY "Users can view all profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (true);
```

### Step 4: Test the Magic Link
1. Go to http://localhost:3000/login (or Vercel URL)
2. Enter email: `jaredardine@gmail.com`
3. Click "Send Magic Link"
4. Check:
   - ✓ No error message displayed
   - ✓ "Check your email" message appears
   - ✓ Email arrives in inbox
   - ✓ Click link redirects to /auth/callback
   - ✓ Profile is created in database
   - ✓ Logged in and redirected to /dashboard

## Alternative: Use Supabase CLI Locally
If you have the Supabase CLI installed:

```bash
cd wc-bracket
supabase migration new fix_auth_trigger
# Edit the new migration file with the SQL above
supabase migration up
supabase db push  # Push to remote
```

## Quick Verification
Run this query in Supabase SQL Editor to verify profiles table exists:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

You should see: id, full_name, nickname, email, is_admin, is_paid, avatar_url, created_at

## Prevention for Future
- Always allow `WITH CHECK (true)` for INSERT policies if a trigger needs to create rows
- Test auth flows after RLS changes
- Consider using Supabase's built-in AFTER INSERT trigger templates as reference
