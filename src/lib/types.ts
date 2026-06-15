export interface Profile {
  id: string
  full_name: string
  nickname: string | null
  email: string
  is_admin: boolean
  is_paid: boolean
  avatar_url: string | null
}

export interface Match {
  id: number
  match_number: number
  stage: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final'
  group_letter: string | null
  match_date: string
  match_time: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'live' | 'finished'
  point_multiplier: number
}

export interface Prediction {
  id: number
  player_id: string
  match_id: number
  predicted_home: number
  predicted_away: number
  points_earned: number
  is_locked: boolean
  submitted_at: string
}

export interface PredictionWithMatch extends Prediction {
  matches: Match
}

export interface LeaderboardEntry {
  player_id: string
  full_name: string
  nickname: string | null
  avatar_url: string | null
  total_points: number
  match_points: number
  bonus_points: number
  exact_scores: number
  correct_winners: number
  total_predictions: number
  group_points: number
  r32_points: number
  r16_points: number
  qf_points: number
  sf_points: number
  final_points: number
  rank: number
}

export interface Deadline {
  id: number
  stage: string
  deadline_utc: string
  description: string
}

export interface ChatMessage {
  id: number
  player_id: string
  message: string
  created_at: string
  profiles?: Pick<Profile, 'full_name' | 'nickname' | 'avatar_url'>
}

export interface NewsItem {
  id: number
  title: string
  body: string | null
  source_url: string | null
  is_auto: boolean
  created_at: string
}

export interface BonusQuestion {
  id: number
  question_text: string
  points_value: number
  correct_answer: string | null
  is_resolved: boolean
}

export interface BonusAnswer {
  id: number
  player_id: string
  question_id: number
  answer_text: string
  points_earned: number
}

export const STAGE_LABELS: Record<string, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Finals',
  sf: 'Semi-Finals',
  third: 'Third Place',
  final: 'Final',
}

export const STAGE_ORDER = ['group', 'r32', 'r16', 'qf', 'sf', 'third', 'final']

export const TEAM_FLAGS: Record<string, string> = {
  'Algeria': '🇩🇿',
  'Argentina': '🇦🇷',
  'Australia': '🇦🇺',
  'Austria': '🇦🇹',
  'Belgium': '🇧🇪',
  'Bosnia and Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷',
  'Canada': '🇨🇦',
  'Cape Verde': '🇨🇻',
  'Colombia': '🇨🇴',
  'Croatia': '🇭🇷',
  'Curaçao': '🇨🇼',
  'Czech Republic': '🇨🇿',
  'DR Congo': '🇨🇩',
  'Ecuador': '🇪🇨',
  'Egypt': '🇪🇬',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Ghana': '🇬🇭',
  'Haiti': '🇭🇹',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Ivory Coast': '🇨🇮',
  'Japan': '🇯🇵',
  'Jordan': '🇯🇴',
  'Korea Republic': '🇰🇷',
  'Mexico': '🇲🇽',
  'Morocco': '🇲🇦',
  'Netherlands': '🇳🇱',
  'New Zealand': '🇳🇿',
  'Norway': '🇳🇴',
  'Panama': '🇵🇦',
  'Paraguay': '🇵🇾',
  'Portugal': '🇵🇹',
  'Qatar': '🇶🇦',
  'Saudi Arabia': '🇸🇦',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Senegal': '🇸🇳',
  'South Africa': '🇿🇦',
  'Spain': '🇪🇸',
  'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭',
  'Tunisia': '🇹🇳',
  'Turkey': '🇹🇷',
  'United States': '🇺🇸',
  'Uruguay': '🇺🇾',
  'Uzbekistan': '🇺🇿',
}

export function getTeamFlag(teamName: string): string {
  return TEAM_FLAGS[teamName] || ''
}

export function formatTeamName(teamName: string): string {
  if (teamName === 'TBD') return 'TBD'

  // Handle seed labels like "1E", "2A", "3rd A/B/C/D/F"
  const seedMatch = teamName.match(/^(\d+)(?:st|nd|rd|th)?\s*([A-L])(.*)$/)
  if (seedMatch) {
    const [, num, group, rest] = seedMatch
    const n = parseInt(num)
    const ordinal = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'

    if (rest.includes('/')) {
      // Multi-group qualifier like "3rd A/B/C/D/F"
      return `${n}${ordinal} place from Groups ${group}${rest}`
    }
    return `${n}${ordinal} place from Group ${group}`
  }

  return teamName
}
