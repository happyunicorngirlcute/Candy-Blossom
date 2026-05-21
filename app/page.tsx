"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Suspense, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { useSearchParams } from "next/navigation"
import { useTheme } from "@/components/ThemeProvider"
import dynamic from "next/dynamic"

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false })

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const features = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    title: "Smart Watering",
    description: "Get notified exactly when your plants need water, based on species, weather, and soil conditions.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    title: "Sunlight Tracking",
    description: "Know exactly when to move your plants into the sun or shade based on their specific needs.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    title: "Weather Integration",
    description: "Real-time weather data adjusts care recommendations automatically for your plant's location.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13L11 20z" />
        <path d="M9 13c1.9 2.8 4.3 3.9 6.2 4.5" />
      </svg>
    ),
    title: "Plant Identification",
    description: "Upload a photo and instantly identify any plant species with detailed care information.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    title: "Care Notes",
    description: "Log observations, track growth, and keep a journal for each plant in your collection.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    title: "Dashboard Overview",
    description: "See all your plants at a glance with hydration scores, watering schedules, and health status.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
]

const stats = [
  { value: "200+", label: "Plant species identified" },
  { value: "3 min", label: "Average setup time" },
  { value: "100%", label: "Free to use" },
  { value: "24/7", label: "Care monitoring" },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { dark } = useTheme()
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] })
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -30])

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[var(--bg)] text-[var(--text)] transition-colors"
    >
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 pt-24 pb-16 lg:pt-0">
        <div className="flex-1 max-w-2xl z-10">
          <motion.div variants={itemVariants} className="space-y-6">
            {registered && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Account created successfully!
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
              Your plants,
              <br />
              <span className="text-[var(--accent)]">beautifully</span> cared for
            </h1>
            <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-lg">
              Candy Blossom gives you smart care instructions for every plant in your home — watering schedules, sunlight tracking, weather alerts, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
             
            </div>
          </motion.div>
        </div>
        <motion.div
          variants={itemVariants}
          className="flex-1 w-full max-w-lg lg:max-w-none flex items-center justify-center"
          style={{ y: sceneY }}
        >
          <Suspense fallback={<div className="w-full h-[400px] md:h-[500px]" />}>
            <HeroScene dark={!!dark} />
          </Suspense>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section ref={targetRef} className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Everything you need to
              <br />
              <span className="text-[var(--accent)]">care for your plants</span>
            </h2>
            <p className="text-[var(--muted)] text-base sm:text-lg max-w-xl mx-auto">
              From watering reminders to sunlight tracking, Candy Blossom handles the details so you can enjoy your garden.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group p-6 md:p-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/20 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32 bg-[var(--surface)]/50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Your garden at a glance
            </h2>
            <p className="text-[var(--muted)] text-base sm:text-lg max-w-xl mx-auto">
              A clean dashboard shows you everything you need to know about your plant collection.
            </p>
          </div>

          {/* Dashboard screenshot */}
          <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="ml-4 text-xs text-[var(--muted)]/60 font-medium">Dashboard — Candy Blossom</div>
            </div>
            <img
              src="/images/dashboard.png"
              alt="Candy Blossom Dashboard"
              className="w-full h-auto"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = 'none'
                const fallback = target.nextElementSibling
                if (fallback) (fallback as HTMLElement).style.display = 'flex'
              }}
            />
            <div className="hidden items-center justify-center p-12 text-center" style={{ display: 'none' }}>
              <div className="space-y-3">
                <svg className="w-12 h-12 mx-auto text-[var(--muted)]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-sm text-[var(--muted)]/50">Add a screenshot named <code className="text-[var(--accent)] text-xs bg-[var(--surface)] px-1.5 py-0.5 rounded">public/images/dashboard.png</code></p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--accent)] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32 bg-[var(--surface)]/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Ready to transform
            <br />
            your plant care?
          </h2>
          <p className="text-[var(--muted)] text-base sm:text-lg max-w-lg mx-auto mb-8">
            Join Candy Blossom today and never forget to water your plants again.
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => router.push("/auth/register")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 active:brightness-95 transition-all"
            >
              Get Started Free
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          )}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-semibold text-[var(--muted)]">Candy Blossom</div>
          <div className="text-xs text-[var(--muted)]/50">
            Made with care for plant lovers everywhere.
          </div>
        </div>
      </footer>
    </motion.main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[var(--muted)]">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
