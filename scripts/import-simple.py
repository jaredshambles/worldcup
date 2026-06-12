#!/usr/bin/env python3
"""Simple bracket import - extracts whatever predictions are available from PDFs."""

import os
import re
from pathlib import Path

try:
    import pdfplumber
    from supabase import create_client
except ImportError:
    print("Error: Missing dependencies. Run: pip install pdfplumber supabase")
    exit(1)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars required")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
BRACKETS_DIR = Path(__file__).parent.parent.parent / 'Player Brackets'

def get_player_name(filename):
    name = re.sub(r'\.pdf$', '', filename, flags=re.IGNORECASE)
    name = re.sub(r'\s*copy\s*$', '', name, flags=re.IGNORECASE)
    return name.strip()

def extract_predictions(pdf_path):
    """Extract predictions from PDF.

    Lines have format: "1 Thu Jun 11, 2026 12:00 1 2"
    The last 2 digits are the prediction (home away).
    """
    predictions = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"

        lines = full_text.split('\n')
        for line in lines:
            line = line.strip()
            # Match lines starting with match number
            if line and re.match(r'^\d+\s', line):
                # Look for single-digit scores at end of line: "X Y" where X,Y are 0-9
                match = re.search(r'(\d)\s+(\d)\s*$', line)
                if match:
                    home = int(match.group(1))
                    away = int(match.group(2))
                    predictions.append((home, away))

        return predictions
    except Exception as e:
        print(f"    Error extracting PDF: {e}")
        return []

def main():
    print("Importing player brackets...\n")

    pdfs = sorted([f for f in BRACKETS_DIR.glob('*.pdf')])
    print(f"Found {len(pdfs)} PDFs\n")

    # Get matches and profiles
    matches_resp = supabase.table('matches').select('id, match_number').order('match_number').execute()
    matches = matches_resp.data

    profiles_resp = supabase.table('profiles').select('id, full_name, email').execute()
    existing_profiles = {p['email']: p['id'] for p in profiles_resp.data}

    print(f"Database: {len(matches)} matches, {len(existing_profiles)} existing profiles\n")

    success = 0
    for i, pdf in enumerate(pdfs, 1):
        name = get_player_name(pdf.name)
        email = f"{name.lower().replace(' ', '.')}@worldcup.local"

        print(f"{i}/{len(pdfs)}: {name}")

        # Get or create player
        player_id = existing_profiles.get(email)

        if not player_id:
            # Create user and profile
            try:
                user = supabase.auth.admin.create_user({
                    'email': email,
                    'password': email[:20],
                    'email_confirm': True
                })
                player_id = user.user.id
                print(f"  ✓ Created user")
            except Exception as e:
                if 'already exists' in str(e).lower():
                    # User exists, try to find them
                    try:
                        users = supabase.auth.admin.list_users()
                        for u in users.users:
                            if u.email == email:
                                player_id = u.id
                                print(f"  ✓ Found existing user")
                                break
                    except:
                        pass

                    if not player_id:
                        print(f"  ✗ Could not find user")
                        continue
                else:
                    print(f"  ✗ Failed to create user: {e}")
                    continue

            # Create or update profile
            try:
                supabase.table('profiles').upsert({
                    'id': player_id,
                    'full_name': name,
                    'nickname': name.split()[-1],
                    'email': email,
                    'is_admin': False,
                    'is_paid': True
                }, on_conflict='id').execute()
                print(f"  ✓ Profile ready")
            except Exception as e:
                print(f"  ✗ Profile error: {e}")
        else:
            print(f"  ✓ Using existing profile")

        # Extract and insert predictions
        predictions = extract_predictions(pdf)
        print(f"  Found {len(predictions)} predictions")

        if predictions:
            inserted = 0
            for j, (home, away) in enumerate(predictions[:len(matches)]):
                try:
                    supabase.table('predictions').upsert({
                        'player_id': player_id,
                        'match_id': matches[j]['id'],
                        'predicted_home': home,
                        'predicted_away': away,
                        'submitted_at': '2026-06-11T00:00:00Z'
                    }, on_conflict='player_id,match_id').execute()
                    inserted += 1
                except:
                    pass

            print(f"  ✓ Inserted {inserted}/{len(predictions)} predictions")
            success += 1
        print()

    print(f"\nDone! {success}/{len(pdfs)} players imported")

if __name__ == '__main__':
    main()
