const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const bracketsDir = path.join(__dirname, '../../Player Brackets');

// Extract text from PDF using pdftotext
async function extractPdfText(filePath) {
  return new Promise((resolve, reject) => {
    const pdftotext = spawn('pdftotext', [filePath, '-']);
    let output = '';
    let error = '';

    pdftotext.stdout.on('data', (data) => {
      output += data.toString();
    });

    pdftotext.stderr.on('data', (data) => {
      error += data.toString();
    });

    pdftotext.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`pdftotext failed: ${error}`));
      }
    });
  });
}

// Parse predictions from PDF text
// The predictions are encoded as sequences of two-digit numbers
function parsePredictions(text) {
  // Find the group stage section and extract all match predictions
  // Predictions appear as sequences like: 12 11 02 12 21 10 22 11 02 21...
  const matches = text.match(/(\d{2}\s+){20,}/g);
  if (!matches) return [];

  const predictions = [];
  // Extract all two-digit numbers from the matched text
  const allNumbers = text.match(/\d{2}/g);
  if (!allNumbers) return [];

  // Parse pairs of digits as home/away scores (first 72 matches are group stage)
  for (let i = 0; i < Math.min(allNumbers.length, 72); i++) {
    const digits = allNumbers[i];
    const home = parseInt(digits[0]);
    const away = parseInt(digits[1]);

    // Skip invalid scores
    if (home >= 0 && away >= 0) {
      predictions.push({ home, away });
    }
  }

  return predictions;
}

// Get player name from filename
function getPlayerName(filename) {
  // Remove .pdf extension and "copy" suffix
  const name = filename.replace(/\.pdf$/i, '').replace(/\s*copy\s*/i, '').trim();
  return name;
}

// Main import function
async function importBrackets() {
  try {
    console.log('Starting bracket import...');

    // Get all PDF files
    const files = fs.readdirSync(bracketsDir).filter(f => f.toLowerCase().endsWith('.pdf'));
    console.log(`Found ${files.length} bracket PDFs`);

    // Get all matches from database
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('id, match_number')
      .order('match_number');

    if (matchError) throw matchError;
    console.log(`Found ${matches.length} matches in database`);

    // Import each bracket
    for (const file of files) {
      try {
        const fullPath = path.join(bracketsDir, file);
        console.log(`\nProcessing: ${file}`);

        // Extract PDF text
        const text = await extractPdfText(fullPath);
        const playerName = getPlayerName(file);
        console.log(`  Player: ${playerName}`);

        // Parse predictions
        const predictions = parsePredictions(text);
        console.log(`  Found ${predictions.length} predictions`);

        if (predictions.length === 0) {
          console.log(`  ⚠️ No predictions found in PDF`);
          continue;
        }

        // Create or get player profile
        const email = `${playerName.toLowerCase().replace(/\s+/g, '.')}@worldcup.test`;

        // First check if profile exists
        let { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        let playerId = existingProfile?.id;

        if (!playerId) {
          // Create auth user first if needed
          const { data: user, error: userError } = await supabase.auth.admin.createUser({
            email,
            password: Math.random().toString(36).slice(-12),
            email_confirm: true,
            user_metadata: { full_name: playerName }
          });

          if (userError && userError.status !== 422) { // 422 = user already exists
            throw userError;
          }

          playerId = user?.user?.id;
        }

        if (!playerId) {
          console.log(`  ❌ Could not create/find player profile`);
          continue;
        }

        console.log(`  Player ID: ${playerId}`);

        // Insert predictions
        let inserted = 0;
        let failed = 0;

        for (let i = 0; i < predictions.length && i < matches.length; i++) {
          const pred = predictions[i];
          const match = matches[i];

          const { error: predError } = await supabase
            .from('predictions')
            .upsert({
              player_id: playerId,
              match_id: match.id,
              predicted_home: pred.home,
              predicted_away: pred.away,
              submitted_at: new Date().toISOString()
            }, {
              onConflict: 'player_id,match_id'
            });

          if (predError) {
            console.log(`    ❌ Match ${match.match_number}: ${predError.message}`);
            failed++;
          } else {
            inserted++;
          }
        }

        console.log(`  ✓ Inserted ${inserted} predictions, ${failed} failed`);
      } catch (err) {
        console.error(`  ❌ Error processing ${file}:`, err.message);
      }
    }

    console.log('\n✓ Import complete!');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

importBrackets();
