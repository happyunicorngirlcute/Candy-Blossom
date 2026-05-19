"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-4 h-4 flex items-center justify-center opacity-70">
    {children}
  </div>
)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname.startsWith("/dashboard")

  useEffect(() => {
    if (!loading && isDashboard && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isDashboard, isAuthenticated, loading, router])

  if (loading) return null;

  return (
    <div className="flex min-h-screen">
      {isDashboard && isAuthenticated && (
        <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] hidden md:block">
          <div className="p-4">
            <nav className="flex flex-col gap-1">
              <a href="/dashboard" className="flex items-center gap-3 text-sm px-3 py-1.5 rounded hover:bg-[var(--border)] transition-colors">
                <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg></IconWrapper>
                Overview
              </a>
              <a href="/dashboard/plants" className="flex items-center gap-3 text-sm px-3 py-1.5 rounded hover:bg-[var(--border)] transition-colors">
                <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg></IconWrapper>
                My Plants
              </a>
              <a href="/dashboard/weather" className="flex items-center gap-3 text-sm px-3 py-1.5 rounded hover:bg-[var(--border)] transition-colors">
                <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a4 4 0 00-4 4v1H6a4 4 0 000 8h12a4 4 0 000-8h-2V7a4 4 0 00-4-4z" /><path d="M8 19h8" /></svg></IconWrapper>
                Weather
              </a>
              <a href="/dashboard/settings" className="flex items-center gap-3 text-sm px-3 py-1.5 rounded hover:bg-[var(--border)] transition-colors">
                <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg></IconWrapper>
                Settings
              </a>
            </nav>
          </div>
        </aside>
      )}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
