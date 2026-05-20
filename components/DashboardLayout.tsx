"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-4 h-4 flex items-center justify-center opacity-70">
    {children}
  </div>
)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [notification, setNotification] = useState<{ plantName: string } | null>(null)
  
  const API = process.env.NEXT_PUBLIC_API_URL

  // Define protected routes
  const protectedRoutes = ["/dashboard"]
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  useEffect(() => {
    // Redirect only if accessing a protected route without being authenticated
    if (!loading && isProtected && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isProtected, isAuthenticated, loading, router])

  useEffect(() => {
    const checkNotifications = async () => {
      if (!isAuthenticated || !isProtected) return
      
      const lastCheck = sessionStorage.getItem("watering_notif_shown")
      if (lastCheck) return

      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/user/plants`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        const plants = data.data || []

        const now = new Date()
        const currentHour = now.getHours()
        const isMorning = currentHour >= 6 && currentHour < 11

        let sunNotif = null
        if (isMorning) {
          const plantNeedsSun = plants.find((item: any) => {
            const sunlight = Array.isArray(item.plant.sunlight) ? item.plant.sunlight.join(' ').toLowerCase() : (item.plant.sunlight || "").toLowerCase()
            return sunlight.includes("full sun") || sunlight.includes("part shade")
          })
          if (plantNeedsSun) {
            sunNotif = { 
              type: 'sun', 
              plantName: plantNeedsSun.plant.common_name,
              message: "It's a beautiful morning! Make sure your plant is getting its morning sun exposure."
            }
          }
        }

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = tomorrow.toISOString().split('T')[0]

        const plantToWater = plants.find((item: any) => {
          if (!item.nextWateringAt) return false
          return item.nextWateringAt.startsWith(tomorrowStr)
        })

        if (plantToWater) {
          setNotification({ 
            type: 'watering',
            plantName: plantToWater.plant.common_name,
            message: `You are 1 day away from watering your ${plantToWater.plant.common_name}. Make sure you have enough water ready!`
          })
          sessionStorage.setItem("watering_notif_shown", "true")
        } else if (sunNotif) {
          setNotification(sunNotif)
          sessionStorage.setItem("watering_notif_shown", "true")
        }
      } catch (err) {
        console.error("Failed to check notifications", err)
      }
    }

    if (!loading && isAuthenticated) {
      checkNotifications()
    }
  }, [isAuthenticated, isProtected, loading, API])

  if (loading) return null;

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path))

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 text-[13px] font-normal tracking-[-0.01em] px-2.5 py-[5px] rounded-[6px] transition-colors ${
      isActive(path)
        ? "bg-[var(--border)] text-[var(--text)]"
        : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"
    }`

  return (
    <div className="flex min-h-screen">
      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotification(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-2xl"
            >
              <div className="mb-4 text-4xl">{notification.type === 'sun' ? '☀️' : '💧'}</div>
              <h3 className="mb-4 text-xl font-bold text-[var(--text)]">
                {notification.type === 'sun' ? 'Sun Exposure Alert' : 'Time to get ready!'}
              </h3>
              <p className="text-md opacity-70 leading-relaxed">
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className={`mt-8 w-full rounded-full px-4 py-2 text-md font-semibold text-white transition-opacity hover:opacity-90 ${notification.type === 'sun' ? 'bg-orange-500' : 'bg-[var(--accent)]'}`}
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Show navigation ONLY in dashboard routes if authenticated */}
      {isProtected && isAuthenticated && (
        <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] hidden md:block">
          <div className="p-4">

            <nav className="flex flex-col gap-5">
              <div>

                <div className="flex flex-col gap-1">
                  <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                    <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg></IconWrapper>
                    Overview
                  </Link>
                  <Link href="/dashboard/add-plant" className={navLinkClass("/dashboard/add-plant")}>
                    <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></IconWrapper>
                    Add a plant
                  </Link>
                </div>
              </div>

              <div>
                <div className="px-2.5 mb-2 text-[9px] font-extrabold uppercase tracking-widest text-[var(--muted)]/50">Collection</div>
                <div className="flex flex-col gap-1">
                  <Link href="/dashboard/plants" className={navLinkClass("/dashboard/plants")}>
                    <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13L11 20z" /><path d="M9 13c1.9 2.8 4.3 3.9 6.2 4.5" /></svg></IconWrapper>
                    My Plants
                  </Link>
                  <Link href="/dashboard/settings" className={navLinkClass("/dashboard/settings")}>
                    <IconWrapper><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg></IconWrapper>
                    Settings
                  </Link>
                </div>
              </div>
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
