#!/usr/bin/env python3
"""
Import player bracket predictions from PDF files into Supabase.
Parses WorldCup 2026 bracket PDFs and extracts match score predictions.
"""

import os
import sys
import re
from pathlib import Path
import subprocess

try:
    import pdfplumber
except ImportError:
    print("Error: pdfplumber not installed. Install with: pip install pdfplumber supabase")
    sys.exit(1)

try:
    from supabase import create_client
except ImportError:
    print("Error: supabase not installed. Install with: pip install supabase")
    sys.exit(1)

# Supabase connection
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars required")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
BRACKETS_DIR = Path(__file__).parent.parent.parent / 'Player Brackets'

def parse_predictions_from_pdf(pdf_path):
    """Extract all match predictions from a PDF file."""
    predictions = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                full_text += page.extract_text() or ""

        # Find all lines that are just space-separated two-digit numbers
        # These represent match predictions
        lines = full_text.split('\n')
        for line in lines:
            line = line.strip()
            # Look for lines with multiple two-digit numbers separated by spaces
            if re.match(r'^(\d{2}\s+)+\d{2}$', line):
                # Extract all two-digit numbers from this line
                numbers = re.findall(r'\d{2}', line)

                # Convert pairs to (home, away) tuples
                for i in range(0, len(numbers), 2):
                    if i + 1 < len(numbers):
                        try:
                            home = int(numbers[i])
                            away = int(numbers[i + 1])
                            # Only add valid scores
                            if 0 <= home <= 9 and 0 <= away <= 9:
                                predictions.append((home, away))
                        except:
                            pass

        return predictions
    except Exception as e:
        print(f"  Error reading PDF: {e}")
        return []

def get_player_name_from_filename(filename):
    """Extract player name from PDF filename."""
    # Remove .pdf extension and "copy" suffix
    name = re.sub(r'\.pdf$', '', filename, flags=re.IGNORECASE)
    name = re.sub(r'\s*copy\s*', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s*copy\s*$', '', name, flags=re.IGNORECASE)
    return name.strip()

def import_brackets():
    """Main import function."""
    print("Starting bracket import...")

    # Get all PDF files
    pdf_files = sorted([f for f in BRACKETS_DIR.glob('*.pdf')])
    print(f"Found {len(pdf_files)} bracket PDFs")

    if not pdf_files:
        print(f"No PDFs found in {BRACKETS_DIR}")
        return

    # Get all matches from database
    matches_response = supabase.table('matches').select('id, match_number').order('match_number').execute()
    matches = matches_response.data
    print(f"Found {len(matches)} matches in database")

    if not matches:
        print("Error: No matches found in database")
        return

    # Track statistics
    total_files = len(pdf_files)
    successful = 0
    failed = 0

    # Import each bracket
    for pdf_file in pdf_files:
        filename = pdf_file.name
        print(f"\n{successful + failed + 1}/{total_files}: {filename}")

        try:
            player_name = get_player_name_from_filename(filename)
            print(f"  Player: {player_name}")

            # Parse predictions from PDF
            predictions = parse_predictions_from_pdf(pdf_file)
            print(f"  Found {len(predictions)} predictions")

            if len(predictions) == 0:
                print(f"  ⚠️  No predictions found")
                failed += 1
                continue

            if len(predictions) > len(matches):
                print(f"  ⚠️  Too many predictions ({len(predictions)} > {len(matches)}), truncating")
                predictions = predictions[:len(matches)]

            # Create profile email (simplified format)
            email = f"{player_name.lower().replace(' ', '.')}@worldcup.local"

            # Check if profile already exists
            profile_response = supabase.table('profiles').select('id').eq('email', email).execute()
            profile = profile_response.data[0] if profile_response.data else None

            player_id = profile['id'] if profile else None

            if not player_id:
                # Try to find by full_name instead
                profile_response = supabase.table('profiles').select('id').eq('full_name', player_name).execute()
                profile = profile_response.data[0] if profile_response.data else None
                player_id = profile['id'] if profile else None

            if not player_id:
                # Try to create auth user
                user_created = False
                try:
                    user_response = supabase.auth.admin.create_user({
                        'email': email,
                        'password': email.replace('@', '').replace('.', '')[:20],
                        'email_confirm': True,
                        'user_metadata': {'full_name': player_name}
                    })
                    player_id = user_response.user.id
                    user_created = True
                    print(f"  Created auth user: {player_id}")
                except Exception as e:
                    if 'already exists' in str(e).lower():
                        print(f"  User already exists")
                        # Try to find user by email in list
                        try:
                            users_list = supabase.auth.admin.list_users()
                            for u in users_list.users:
                                if u.email == email:
                                    player_id = u.id
                                    print(f"  Found existing user: {player_id}")
                                    break
                        except:
                            pass
                    else:
                        print(f"  Error creating user: {e}")
                        failed += 1
                        continue

                # Create or update profile with the auth user's ID
                if player_id:
                    try:
                        supabase.table('profiles').upsert({
                            'id': player_id,
                            'full_name': player_name,
                            'nickname': player_name.split()[-1],
                            'email': email,
                            'is_admin': False,
                            'is_paid': True,
                        }, on_conflict='id').execute()
                        if user_created:
                            print(f"  Created profile: {player_id}")
                        else:
                            print(f"  Updated profile: {player_id}")
                    except Exception as e:
                        print(f"  Error upserting profile: {e}")
                        failed += 1
                        continue
                else:
                    print(f"  Could not find or create user")
                    failed += 1
                    continue
            else:
                print(f"  Using existing profile: {player_id}")

            # Insert predictions
            inserted = 0
            for i, (home, away) in enumerate(predictions):
                if i >= len(matches):
                    break

                match = matches[i]
                try:
                    supabase.table('predictions').upsert({
                        'player_id': player_id,
                        'match_id': match['id'],
                        'predicted_home': home,
                        'predicted_away': away,
                        'submitted_at': '2026-06-11T00:00:00Z'
                    }, on_conflict='player_id,match_id').execute()
                    inserted += 1
                except Exception as e:
                    print(f"    Error on match {match['match_number']}: {e}")

            print(f"  ✓ Inserted {inserted}/{len(predictions)} predictions")
            successful += 1

        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed += 1

    print(f"\n{'='*60}")
    print(f"Import complete: {successful} successful, {failed} failed")
    print(f"{'='*60}")

if __name__ == '__main__':
    import_brackets()
