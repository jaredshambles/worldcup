import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { questionId, answerText, answerId } = await request.json()
  const supabase = createServiceClient()
  const userId = session.user.id

  if (answerId) {
    const { data, error } = await supabase
      .from('bonus_answers')
      .update({ answer_text: answerText })
      .eq('id', answerId)
      .eq('player_id', userId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('bonus_answers')
    .insert({
      player_id: userId,
      question_id: questionId,
      answer_text: answerText,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
