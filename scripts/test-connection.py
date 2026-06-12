#!/usr/bin/env python3
"""Test Supabase connection and display database stats."""

import os
import sys

try:
    from supabase import create_client
except ImportError:
    print("Error: supabase not installed. Run: pip install supabase")
    sys.exit(1)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars required")
    print("\nSet them with:")
    print('  export SUPABASE_URL="https://epphtwzblamzhxuayjjv.supabase.co"')
    print('  export SUPABASE_SERVICE_KEY="your-service-key-here"')
    sys.exit(1)

print(f"Connecting to {SUPABASE_URL}...")

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # Test connection by fetching match count
    matches_response = supabase.table('matches').select('count', count='exact').execute()
    matches_count = matches_response.count or 0

    profiles_response = supabase.table('profiles').select('count', count='exact').execute()
    profiles_count = profiles_response.count or 0

    predictions_response = supabase.table('predictions').select('count', count='exact').execute()
    predictions_count = predictions_response.count or 0

    print("\n✅ Connection successful!\n")
    print("Database statistics:")
    print(f"  Matches:     {matches_count}")
    print(f"  Profiles:    {profiles_count}")
    print(f"  Predictions: {predictions_count}")

    if matches_count == 0:
        print("\n⚠️  No matches found. Make sure the database was seeded.")
    elif profiles_count == 0:
        print("\n✓ Ready to import player profiles and predictions!")
        print("  Run: python scripts/import-player-brackets.py")
    else:
        print(f"\n✓ Found {profiles_count} existing player profiles")

except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    print("\nChecklist:")
    print("  - Verify SUPABASE_URL is correct")
    print("  - Verify SUPABASE_SERVICE_KEY is correct (from Settings > API)")
    print("  - Check that the Supabase project is active")
    sys.exit(1)
