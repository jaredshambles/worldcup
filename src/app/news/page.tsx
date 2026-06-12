import { createClient } from '@/lib/supabase/server'
import type { NewsItem } from '@/lib/types'

export const revalidate = 60

export default async function NewsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news_feed')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const news = (data || []) as NewsItem[]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">News Feed</h1>

      {news.length === 0 ? (
        <p className="text-muted text-center py-12">No news yet. Check back after some matches.</p>
      ) : (
        <div className="space-y-3">
          {news.map(item => {
            const date = new Date(item.created_at)
            const timeAgo = getTimeAgo(date)
            return (
              <div key={item.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-sm">{item.title}</h2>
                    {item.body && <p className="text-sm text-muted mt-1">{item.body}</p>}
                  </div>
                  {item.is_auto && (
                    <span className="text-xs px-1.5 py-0.5 bg-card-hover text-muted rounded shrink-0">Auto</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span>{timeAgo}</span>
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Source
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
