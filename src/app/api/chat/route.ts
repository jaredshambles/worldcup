import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message } = await request.json()
  if (!message?.trim() || message.length > 500) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      player_id: session.user.id,
      message: message.trim(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
