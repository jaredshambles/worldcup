#!/usr/bin/env python3
"""
Import player predictions using OCR on bracket PDFs.
Uses pytesseract for better text extraction from visual bracket PDFs.
"""

import os
import re
from pathlib import Path
from PIL import Image
import subprocess

try:
    import pytesseract
except ImportError:
    print("Error: pytesseract not installed. Install with: pip install pytesseract pillow pdf2image")
    print("Also need Tesseract OCR: https://github.com/UB-Mannheim/tesseract/wiki")
    exit(1)

try:
    from pdf2image import convert_from_path
except ImportError:
    print("Error: pdf2image not installed. Install with: pip install pdf2image")
    exit(1)

try:
    from supabase import create_client
except ImportError:
    print("Error: supabase not installed. Install with: pip install supabase")
    exit(1)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars required")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
BRACKETS_DIR = Path(__file__).parent.parent.parent / 'Player Brackets'

def get_player_name_from_filename(filename):
    """Extract player name from PDF filename."""
    name = re.sub(r'\.pdf$', '', filename, flags=re.IGNORECASE)
    name = re.sub(r'\s*copy\s*$', '', name, flags=re.IGNORECASE)
    return name.strip()

def extract_predictions_with_ocr(pdf_path, max_pages=5):
    """Extract predictions from PDF using OCR."""
    predictions = []

    try:
        # Convert first few pages to images
        images = convert_from_path(pdf_path, first_page=1, last_page=max_pages)

        all_numbers = []
        for img in images:
            # Use OCR to extract text
            text = pytesseract.image_to_string(img)
            # Extract all two-digit numbers
            numbers = re.findall(r'\d{2}', text)
            all_numbers.extend(numbers)

        # Convert pairs to predictions, filter valid scores (0-9)
        for i in range(0, len(all_numbers), 2):
            if i + 1 < len(all_numbers):
                try:
                    home = int(all_numbers[i])
                    away = int(all_numbers[i + 1])
                    if 0 <= home <= 9 and 0 <= away <= 9:
                        predictions.append((home, away))
                except:
                    pass

        return predictions
    except Exception as e:
        print(f"    Error with OCR: {e}")
        return []

def import_brackets():
    """Main import function."""
    print("Starting bracket import with OCR...")
    print("Note: This requires Tesseract OCR installed")

    # Get all PDF files
    pdf_files = sorted([f for f in BRACKETS_DIR.glob('*.pdf')])
    print(f"Found {len(pdf_files)} bracket PDFs\n")

    if not pdf_files:
        print(f"No PDFs found in {BRACKETS_DIR}")
        return

    # Get all matches
    matches_response = supabase.table('matches').select('id, match_number').order('match_number').execute()
    matches = matches_response.data
    print(f"Found {len(matches)} matches in database\n")

    successful = 0
    failed = 0

    for idx, pdf_file in enumerate(pdf_files, 1):
        print(f"{idx}/{len(pdf_files)}: {pdf_file.name}")

        try:
            player_name = get_player_name_from_filename(pdf_file.name)
            print(f"  Player: {player_name}")

            # Extract predictions with OCR
            predictions = extract_predictions_with_ocr(pdf_file)
            print(f"  Found {len(predictions)} predictions")

            if len(predictions) == 0:
                print(f"  ⚠️  No predictions found")
                failed += 1
                continue

            if len(predictions) > len(matches):
                predictions = predictions[:len(matches)]

            email = f"{player_name.lower().replace(' ', '.')}@worldcup.local"

            # Check/create profile
            profile_response = supabase.table('profiles').select('id').eq('email', email).execute()
            player_id = profile_response.data[0]['id'] if profile_response.data else None

            if not player_id:
                try:
                    user_response = supabase.auth.admin.create_user({
                        'email': email,
                        'password': email.replace('@', '').replace('.', '')[:20],
                        'email_confirm': True,
                        'user_metadata': {'full_name': player_name}
                    })
                    player_id = user_response.user.id
                except:
                    print(f"  Error creating user")
                    failed += 1
                    continue

                try:
                    supabase.table('profiles').insert({
                        'id': player_id,
                        'full_name': player_name,
                        'nickname': player_name.split()[-1],
                        'email': email,
                        'is_admin': False,
                        'is_paid': True,
                    }).execute()
                except:
                    pass

            # Insert predictions
            inserted = 0
            for i, (home, away) in enumerate(predictions):
                if i >= len(matches):
                    break

                try:
                    supabase.table('predictions').upsert({
                        'player_id': player_id,
                        'match_id': matches[i]['id'],
                        'predicted_home': home,
                        'predicted_away': away,
                        'submitted_at': '2026-06-11T00:00:00Z'
                    }, on_conflict='player_id,match_id').execute()
                    inserted += 1
                except Exception as e:
                    print(f"    Error on match {matches[i]['match_number']}: {e}")

            print(f"  ✓ Inserted {inserted} predictions")
            successful += 1

        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed += 1

    print(f"\n{'='*60}")
    print(f"Import complete: {successful} successful, {failed} failed")

if __name__ == '__main__':
    import_brackets()
