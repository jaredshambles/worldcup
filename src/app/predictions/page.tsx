import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth-server'
import { STAGE_ORDER, STAGE_LABELS } from '@/lib/types'
import type { Match, Prediction, BonusQuestion, BonusAnswer } from '@/lib/types'
import { PredictionsClient } from './PredictionsClient'

export const revalidate = 15

export default async function PredictionsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?from=expired')

  const supabase = await createClient()

  const [
    { data: matches },
    { data: predictions },
    { data: deadlines },
    { data: bonusQuestions },
    { data: bonusAnswers },
  ] = await Promise.all([
    supabase.from('matches').select('*').order('match_number'),
    supabase.from('predictions').select('*').eq('player_id', user.id),
    supabase.from('deadlines').select('*').order('deadline_utc'),
    supabase.from('bonus_questions').select('*'),
    supabase.from('bonus_answers').select('*').eq('player_id', user.id),
  ])

  return (
    <PredictionsClient
      userId={user.id}
      matches={(matches || []) as Match[]}
      predictions={(predictions || []) as Prediction[]}
      deadlines={deadlines || []}
      bonusQuestions={(bonusQuestions || []) as BonusQuestion[]}
      bonusAnswers={(bonusAnswers || []) as BonusAnswer[]}
    />
  )
}
