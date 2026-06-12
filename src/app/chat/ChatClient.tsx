'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ChatMessage } from '@/lib/types'

export function ChatClient({
  userId,
  initialMessages,
}: {
  userId: string | null
  initialMessages: ChatMessage[]
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          // Fetch the full message with profile
          const { data } = await supabase
            .from('chat_messages')
            .select('*, profiles(full_name, nickname, avatar_url)')
            .eq('id', payload.new.id)
            .single()
          if (data) {
            setMessages(prev => [...prev, data as ChatMessage])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !userId) return
    setSending(true)
    await supabase.from('chat_messages').insert({
      player_id: userId,
      message: input.trim(),
    })
    setInput('')
    setSending(false)
  }

  const name = (msg: ChatMessage) => msg.profiles?.nickname || msg.profiles?.full_name || 'Unknown'
  const isMe = (msg: ChatMessage) => msg.player_id === userId

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4 text-text-primary">Group Chat</h1>

      <div className="flex-1 overflow-y-auto bg-white border border-border rounded-lg p-4 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 py-2 ${isMe(msg) ? 'justify-end' : ''}`}>
            <div className={`max-w-xs ${isMe(msg) ? 'order-2' : ''}`}>
              {!isMe(msg) && (
                <div className="text-xs font-semibold mb-0.5 text-text-primary">{name(msg)}</div>
              )}
              <div className={`px-3 py-2 rounded-lg text-sm ${
                isMe(msg)
                  ? 'bg-accent-secondary text-white'
                  : 'bg-surface-hover text-text-primary'
              }`}>
                {msg.message}
              </div>
              <div className="text-[10px] text-text-tertiary mt-0.5">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {userId ? (
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 px-4 py-3 bg-white border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-secondary"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-4 py-3 bg-accent-secondary text-white rounded-lg font-semibold text-sm hover:bg-accent-secondary/90 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="mt-4 text-center text-sm text-text-tertiary py-3 bg-white border border-border rounded-lg">
          Sign in to join the chat
        </div>
      )}
    </div>
  )
}
