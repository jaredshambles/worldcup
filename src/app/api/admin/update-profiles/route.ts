import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

// Mapping of @worldcup.local usernames to real player data
const PLAYER_MAPPING: Record<string, { full_name: string; nickname: string | null; real_email: string | null }> = {
  'aidan.osgoode': { full_name: 'Aidan Limosani-Izarra', nickname: null, real_email: null },
  'aidee.barba': { full_name: 'Aidee Barba', nickname: 'Yaya', real_email: 'aide595@hotmail.com' },
  'alessandra': { full_name: 'Alessandra Ferrera', nickname: null, real_email: 'agferrera22@gmail.com' },
  'alex.ferrera': { full_name: 'Alex Ferrera', nickname: null, real_email: 'alexander.x.ferrera@gmail.com' },
  'andreina.izarra': { full_name: 'Andreina Izarra', nickname: null, real_email: 'Andreina.Izarra.DMD@gmail.com' },
  'betsy': { full_name: 'Betsy Bello', nickname: null, real_email: 'betsybello@yahoo.com' },
  'carlitos': { full_name: 'Carlos Arreaza', nickname: null, real_email: 'cearreaza62@gmail.com' },
  'christina.allien': { full_name: 'Christina Allien', nickname: null, real_email: 'Christinaallien@aol.com' },
  'crissyjuan': { full_name: 'Criss & Juan', nickname: null, real_email: 'crisscrow@gmail.com' },
  'douglas': { full_name: 'Douglas Izarra', nickname: null, real_email: 'doug.izarra@gmail.com' },
  'evan.michael.lopez': { full_name: 'Evan', nickname: null, real_email: null },
  'fercho': { full_name: 'Fernando Gonzalez', nickname: null, real_email: 'f.gonzalez0679@gmail.com' },
  'kevin': { full_name: 'Kevin Andre', nickname: 'Kev', real_email: 'kvn.andre@gmail.com' },
  'lester.tigrett': { full_name: 'Lester Tigrett', nickname: 'Poppie', real_email: 'usoccer13@icloud.com' },
  'luciano.ruiz.izarra': { full_name: 'Luciano Ruiz-Izarra', nickname: null, real_email: 's.lruiz-izarra@cushmanschool.org' },
  'luz.maria.parlante': { full_name: 'Luz Maria Parlante', nickname: null, real_email: 'Luzmariaparlante@gmail.com' },
  'mark.limosani': { full_name: 'Mark Limosani', nickname: null, real_email: 'malimosani@westonendocare.com' },
  'matteo': { full_name: 'Matteo & Abu', nickname: null, real_email: 'barbalx@hotmail.com' },
  'matthew.meckel': { full_name: 'Matt Meckel', nickname: null, real_email: null },
  'mikael': { full_name: 'Mikael Tigrett', nickname: null, real_email: 'mtigrett@gmail.com' },
  'richard.raymond.copa.mundial.brackets': { full_name: 'Richard Raymond', nickname: null, real_email: 'rraymond82@gmail.com' },
  'ryan.tigrett': { full_name: 'Ryan Tigrett', nickname: null, real_email: 'ryan.tigrett@me.com' },
  'sol_predictions': { full_name: 'ChattGPT', nickname: 'Sol', real_email: null },
  'valentina.izarra.final.xlsx.-.2026.world.cup_your.bracket': { full_name: 'Valentina Izarra', nickname: null, real_email: 'valentinaiz@mac.com' },
  'wendy': { full_name: 'Wendy Barba', nickname: null, real_email: 'wendy_aba@mac.com' },
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return Response.json({ error: 'Not authorized' }, { status: 403 })
  }

  try {
    const serviceClient = createServiceClient()

    // Fetch all profiles
    const { data: profiles } = await supabase.from('profiles').select('*')

    if (!profiles) {
      return Response.json({ error: 'No profiles found' }, { status: 404 })
    }

    // Update profiles with correct names and emails by matching @worldcup.local usernames
    const updates = []
    const emailUpdates: string[] = []
    for (const profile of profiles) {
      if (!profile.email?.includes('@worldcup.local')) continue

      const username = profile.email.split('@')[0]
      const playerData = PLAYER_MAPPING[username]

      if (playerData) {
        const profileUpdate: Record<string, string | null> = {
          full_name: playerData.full_name,
          nickname: playerData.nickname,
        }
        if (playerData.real_email) {
          profileUpdate.email = playerData.real_email.toLowerCase()
        }

        updates.push({ id: profile.id, ...profileUpdate })

        // Update auth.users email via admin API
        if (playerData.real_email) {
          const { error } = await serviceClient.auth.admin.updateUserById(profile.id, {
            email: playerData.real_email.toLowerCase(),
          })
          if (error) {
            console.error(`Failed to update auth email for ${playerData.full_name}:`, error.message)
          } else {
            emailUpdates.push(playerData.full_name)
          }
        }
      }
    }

    // Update profile rows
    for (const update of updates) {
      const { id, ...fields } = update
      await supabase
        .from('profiles')
        .update(fields)
        .eq('id', id)
    }

    return Response.json({
      success: true,
      updated: updates.length,
      emails_updated: emailUpdates,
      total_profiles: profiles.length,
      message: `Updated ${updates.length} profiles, ${emailUpdates.length} emails migrated from @worldcup.local`,
    })
  } catch (error) {
    console.error('Update error:', error)
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
