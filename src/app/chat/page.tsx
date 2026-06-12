import { createClient } from '@/lib/supabase/server'
import { ChatClient } from './ChatClient'

export const revalidate = 0 // always fresh for chat

export default async function ChatPage() {
  const supabase = await createClient()

  const [{ data: { user } }, { data: messages }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('chat_messages')
      .select('*, profiles(full_name, nickname, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  return (
    <ChatClient
      userId={user?.id ?? null}
      initialMessages={(messages || []).reverse()}
    />
  )
}
