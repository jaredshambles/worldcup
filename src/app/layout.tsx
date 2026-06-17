import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Nav } from "@/components/Nav"
import { getCurrentUser } from "@/lib/auth-server"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WC Bracket Challenge 2026",
  description: "World Cup 2026 Bracket Prediction Challenge",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  const profile = user ? {
    id: user.id,
    email: user.email,
    full_name: (user as any).full_name || user.name || '',
    nickname: (user as any).nickname || '',
    is_admin: (user as any).is_admin || false,
    is_paid: false,
    avatar_url: (user as any).avatar_url || user.image || '',
  } : null

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-background">
        <Nav serverUser={profile} />
        <main className="flex-1 w-full">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
