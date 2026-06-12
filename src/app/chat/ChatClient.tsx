'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ChatMessage } from '@/lib/types'
import Link from 'next/link'

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
  }, [])

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

  // Group messages by date
  let lastDate = ''

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">Group Chat</h1>

      <div className="flex-1 overflow-y-auto bg-card border border-border rounded-lg p-4 space-y-1">
        {messages.map(msg => {
          const msgDate = formatDate(msg.created_at)
          const showDate = msgDate !== lastDate
          lastDate = msgDate
          const name = msg.profiles?.nickname || msg.profiles?.full_name || 'Unknown'
          const isMe = msg.player_id === userId

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center text-xs text-muted py-2">{msgDate}</div>
              )}
              <div className={`flex gap-2 py-1 ${isMe ? 'justify-end' : ''}`}>
                <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                  {!isMe && (
                    <div className="text-xs text-accent font-semibold mb-0.5">{name}</div>
                  )}
                  <div className={`px-3 py-2 rounded-lg text-sm ${
                    isMe
                      ? 'bg-accent/20 text-foreground'
                      : 'bg-card-hover text-foreground'
                  }`}>
                    {msg.message}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">{formatTime(msg.created_at)}</div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {userId ? (
        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-4 py-3 bg-accent text-background rounded-lg font-semibold text-sm hover:bg-accent-dim disabled:opacity-40"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="mt-3 text-center text-sm text-muted py-3 bg-card border border-border rounded-lg">
          <Link href="/login" className="text-accent hover:underline">Sign in</Link> to join the chat
        </div>
      )}
    </div>
  )
}
