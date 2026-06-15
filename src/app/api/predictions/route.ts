import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { matchId, predictedHome, predictedAway, predictionId } = await request.json()
  const supabase = createServiceClient()
  const userId = session.user.id

  if (predictionId) {
    const { data, error } = await supabase
      .from('predictions')
      .update({ predicted_home: predictedHome, predicted_away: predictedAway })
      .eq('id', predictionId)
      .eq('player_id', userId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('predictions')
    .insert({
      player_id: userId,
      match_id: matchId,
      predicted_home: predictedHome,
      predicted_away: predictedAway,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
