"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/components/ThemeProvider"

const products = [
  { label: "Uploading", title: "Name me your plants, I will know how to take care of it" },
  { label: "Watering", title: "Get notified when its time to water your plants" },
  { label: "Sun", title: "Know when to leave your plants in the sun" },
  { label: "Growing", title: "Know when and how your plant grows" },
  { label: "Weather", title: "Updated on the weather needs for your plants" },
  { label: "Application", title: "All of this in our website, or in our application" },
]

function ExternalNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1.5 rounded-md text-sm transition-colors"
      style={{ color: "var(--muted)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
    >
      {children}
    </a>
  )
}


const panelVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },

  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -3 },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.14,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export default function HeaderDropdown() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showPricingPopup, setShowPricingPopup] = useState(false)
  const { dark, toggle } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between pl-88 pr-88 h-16"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div className="flex items-center font-semibold text-sm cursor-pointer" onClick={() => router.push("/")} style={{ color: "var(--text)" }}>
        Candy Blossom
      </div>

      <nav className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          {[
            { label: "Source", href: "/source", external: false },
            { label: "Docs", href: "/docs", external: false },
            { label: "Pricing", onClick: () => setShowPricingPopup(true) },
            { label: "Contact", href: "/contact", external: false },
          ].map((item) => (
            "onClick" in item ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className="px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {item.label}
              </button>
            ) : item.external ? (
              <ExternalNavItem key={item.label} href={item.href!}>
                {item.label}
              </ExternalNavItem>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {item.label}
              </Link>
            )
          ))}

          {/* Pricing Popup */}
          <AnimatePresence>
            {showPricingPopup && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPricingPopup(false)}
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
                >
                  <div className="text-center">
                    <h3 className="mb-6 text-xl font-bold text-[var(--text)]">It's completely free!</h3>
                    <p className="text-sm opacity-60 leading-relaxed">
                      Candy Blossom's website and application are 100% free to use.
                      Enjoy taking care of your plants without any cost
                    </p>
                    <button
                      onClick={() => setShowPricingPopup(false)}
                      className="mt-8 w-full rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
                      style={{
                        background: dark ? "#fff" : "#F2B5CE",
                        color: dark ? "#000" : "#fff",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? "#e4e4e7" : "#e0a1b9"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = dark ? "#fff" : "#F2B5CE"
                      }}
                    >
                      Got it
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer"
              style={{
                color: open ? "var(--bg)" : "var(--text)",
                background: open ? "var(--text)" : "transparent",
              }}
            >
              What I can do?
              <motion.svg
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`w-3.5 h-3.5 cursor-pointer ${!dark && open ? "text-white opacity-100" : "opacity-60"}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    transformOrigin: "top center",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[680px] rounded-2xl z-50 overflow-hidden cursor-pointer"
                >

                  <div className="grid grid-cols-3">
                    {products.map((item, i) => (
                      <Link
                        key={item.label}
                        href={`/features/${item.label.toLowerCase()}`}
                        className="flex flex-col gap-1 p-5 transition-colors cursor-pointer"
                        style={{
                          borderRight: i % 3 !== 2 ? "1px solid var(--border)" : "none",
                          borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--border)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold leading-snug" style={{ color: "var(--text)" }}>
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Moon / Sun toggle */}
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent transition-colors cursor-pointer relative"
            style={{ color: "var(--muted)" }}
          >
            <AnimatePresence>
              <motion.span
                key={dark ? "moon" : "sun"}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {dark ? <MoonIcon /> : <SunIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* divider */}
          <div className="w-px h-4" style={{ background: "var(--border)" }} />

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-sm px-[12px] py-1.5 transition-colors bg-transparent cursor-pointer"
            style={{ color: "var(--muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => router.push('/auth/register')}
            className="text-sm font-medium px-[12px] py-1.5 rounded-full border transition-colors cursor-pointer"
            style={{
              color: dark ? "#000000" : "#FFFFFF",
              borderColor: "var(--border)",
              background: dark ? "#FFFFFF" : "#F2B5CE",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = dark ? "#f4f4f5" : "#f7d1e0" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = dark ? "#FFFFFF" : "#F2B5CE" }}
          >
            Sign up
          </button>
        </div>
      </nav>
    </header>
  )
}