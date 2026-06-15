import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Mapping of @worldcup.local usernames to real player data
const PLAYER_MAPPING: Record<string, { full_name: string; nickname: string | null }> = {
  'aidan.osgoode': { full_name: 'Aidan Limosani-Izarra', nickname: null },
  'aidee.barba': { full_name: 'Aidee Barba', nickname: 'Yaya' },
  'alessandra': { full_name: 'Alessandra Ferrera', nickname: null },
  'alex.ferrera': { full_name: 'Alex Ferrera', nickname: null },
  'andreina.izarra': { full_name: 'Andreina Izarra', nickname: null },
  'betsy': { full_name: 'Betsy Bello', nickname: null },
  'carlitos': { full_name: 'Carlos Arreaza', nickname: null },
  'christina.allien': { full_name: 'Christina Allien', nickname: null },
  'crissyjuan': { full_name: 'Criss & Juan', nickname: null },
  'douglas': { full_name: 'Douglas Izarra', nickname: null },
  'evan.michael.lopez': { full_name: 'Evan', nickname: null },
  'fercho': { full_name: 'Fernando Gonzalez', nickname: null },
  'kevin': { full_name: 'Kevin Andre', nickname: 'Kev' },
  'lester.tigrett': { full_name: 'Lester Tigrett', nickname: 'Poppie' },
  'luciano.ruiz.izarra': { full_name: 'Luciano Ruiz-Izarra', nickname: null },
  'luz.maria.parlante': { full_name: 'Luz Maria Parlante', nickname: null },
  'mark.limosani': { full_name: 'Mark Limosani', nickname: null },
  'matteo': { full_name: 'Matteo & Abu', nickname: null },
  'matthew.meckel': { full_name: 'Matt Meckel', nickname: null },
  'mikael': { full_name: 'Mikael Tigrett', nickname: null },
  'richard.raymond.copa.mundial.brackets': { full_name: 'Richard Raymond', nickname: null },
  'ryan.tigrett': { full_name: 'Ryan Tigrett', nickname: null },
  'sol_predictions': { full_name: 'ChattGPT', nickname: 'Sol' },
  'valentina.izarra.final.xlsx.-.2026.world.cup_your.bracket': { full_name: 'Valentina Izarra', nickname: null },
  'wendy': { full_name: 'Wendy Barba', nickname: null },
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
    // Fetch all profiles
    const { data: profiles } = await supabase.from('profiles').select('*')

    if (!profiles) {
      return Response.json({ error: 'No profiles found' }, { status: 404 })
    }

    // Update profiles with correct names by matching @worldcup.local usernames
    const updates = []
    for (const profile of profiles) {
      if (!profile.email?.includes('@worldcup.local')) continue

      // Extract username from email (part before @worldcup.local)
      const username = profile.email.split('@')[0]
      const playerData = PLAYER_MAPPING[username]

      if (playerData) {
        updates.push({
          id: profile.id,
          full_name: playerData.full_name,
          nickname: playerData.nickname,
        })
      }
    }

    // Perform bulk update
    for (const update of updates) {
      await supabase
        .from('profiles')
        .update({ full_name: update.full_name, nickname: update.nickname })
        .eq('id', update.id)
    }

    return Response.json({
      success: true,
      updated: updates.length,
      total_profiles: profiles.length,
      message: `Updated ${updates.length} of ${profiles.length} profiles`,
    })
  } catch (error) {
    console.error('Update error:', error)
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
