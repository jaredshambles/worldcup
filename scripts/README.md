# Player Bracket Import

This directory contains scripts to import player bracket predictions from PDF files into Supabase.

## Requirements

- Python 3.8+
- `pdfplumber` library
- `python-supabase` library

## Setup

### 1. Install Dependencies

```bash
pip install pdfplumber supabase
```

### 2. Set Environment Variables

Get your Supabase credentials from https://app.supabase.com/project/epphtwzblamzhxuayjjv/settings/general

Then set:
```bash
export SUPABASE_URL="https://epphtwzblamzhxuayjjv.supabase.co"
export SUPABASE_SERVICE_KEY="[your service role key from Settings > API]"
```

On Windows PowerShell:
```powershell
$env:SUPABASE_URL="https://epphtwzblamzhxuayjjv.supabase.co"
$env:SUPABASE_SERVICE_KEY="[your service role key]"
```

## Run the Import

From the `wc-bracket` directory:

```bash
python scripts/import-player-brackets.py
```

### What It Does

1. **Reads all PDF files** from `../Player Brackets/`
2. **Extracts player names** from filenames (e.g., `AIDAN OSGOODE.pdf` → "Aidan Osgoode")
3. **Parses match predictions** from the PDF content (two-digit scores)
4. **Creates player profiles** in Supabase if they don't exist
5. **Inserts predictions** into the `predictions` table

### Output

The script will show:
- Number of PDFs found
- For each player:
  - Name extracted from filename
  - Number of predictions found
  - Whether profile was created or existing
  - Number of predictions successfully inserted

## Finding Your Supabase Service Key

1. Go to https://app.supabase.com/project/epphtwzblamzhxuayjjv
2. Click **Settings** (bottom left)
3. Click **API**
4. Copy the **service_role** key (not the anon key)

⚠️ **Keep this key SECRET** — it has full database access. Never commit it to git.

## Troubleshooting

### `ModuleNotFoundError: No module named 'pdfplumber'`
Run: `pip install pdfplumber`

### `Error: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars required`
Make sure both environment variables are set. Check with:
- Bash/Linux/Mac: `echo $SUPABASE_URL`
- PowerShell: `$env:SUPABASE_URL`

### No predictions found in PDFs
The PDF format may have changed. Check if the PDF files contain bracket predictions.

### Wrong number of predictions
The script extracts all two-digit numbers from the PDF. If it finds too many or too few, the PDF layout may be different than expected. Update the `parse_predictions_from_pdf()` function as needed.

## After Import

1. Go to your app at `http://localhost:3000`
2. The leaderboard should now show all players and their predictions
3. You can view/edit individual predictions in the dashboard once you log in

## Notes

- Players are created with email format: `firstname.lastname@worldcup.local`
- You can manually edit player profiles in Supabase Studio
- Predictions are marked as submitted on 2026-06-11
- Duplicate predictions are skipped (upsert on player_id + match_id)
