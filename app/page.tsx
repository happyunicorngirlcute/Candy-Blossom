"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

/* ── Light ray effect ── */
function LightRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[var(--accent)]/8 to-transparent blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-500/8 to-transparent blur-3xl" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-white/[0.02] to-transparent blur-2xl rotate-12" />
    </div>
  )
}

/* ── Dashboard Preview (exact replica of real dashboard) ── */
function DashboardPreview() {
  const metrics = [
    { label: "Plants in Collection", value: "12", accent: "var(--accent)", suffix: "species" },
    { label: "Care Needed", value: "3", accent: "#3b82f6", suffix: "due next 7 days" },
    { label: "Garden Hydration Score", value: "87%", accent: "#22c55e", suffix: "Optimal hydration" },
  ]

  const chartData = [
    { name: "Monstera", moisture: 72, wateringVal: 60, sunVal: 65, color: "#22c55e" },
    { name: "Rose", moisture: 45, wateringVal: 40, sunVal: 80, color: "#ef4444" },
    { name: "Fern", moisture: 85, wateringVal: 70, sunVal: 30, color: "#22c55e" },
    { name: "Snake", moisture: 30, wateringVal: 25, sunVal: 40, color: "#eab308" },
    { name: "Lavender", moisture: 55, wateringVal: 35, sunVal: 90, color: "#a855f7" },
  ]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-xl overflow-hidden">
      <div className="p-5 md:p-7 space-y-6">
        <div className="flex items-center justify-between">
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="p-4 md:p-6 border border-[var(--muted)]/30 hover:border-[var(--muted)]/60 rounded-2xl bg-[var(--surface)] flex flex-col justify-between transition-all relative overflow-hidden group select-none"
            >
              <div
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${m.accent}, transparent)` }}
              />
              <h3 className="text-[10px] md:text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">{m.label}</h3>
              <div className="flex items-baseline gap-2 mt-3 md:mt-4">
                <span className="text-3xl md:text-4xl font-semibold tracking-tight text-white" style={{ color: i === 2 ? "#22c55e" : undefined }}>{m.value}</span>
                <span className="text-xs md:text-sm text-[var(--muted)]">{m.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          <div className="p-4 md:p-6 border border-[var(--muted)]/30 hover:border-[var(--muted)]/60 rounded-2xl bg-[var(--surface)] lg:col-span-3 flex flex-col justify-between relative overflow-hidden group transition-all">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-bold text-[var(--muted)] mb-4">Watering Timelines & Requirements</h3>

            <div className="h-48 md:h-64 flex items-end justify-between px-1 md:px-2 gap-2 md:gap-4 mt-4 relative border-b border-[var(--border)] pb-2 select-none">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-white w-full h-0" />
                <div className="border-t border-white w-full h-0" />
                <div className="border-t border-white w-full h-0" />
                <div className="border-t border-white w-full h-0" />
              </div>

              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group/bar relative">
                  <div className="absolute bottom-full mb-2 bg-black/90 border border-[var(--border)] text-xs text-white rounded-lg p-3 shadow-2xl opacity-0 group-hover/bar:opacity-100 transition-all z-20 pointer-events-none w-40 leading-relaxed scale-95 group-hover/bar:scale-100 origin-bottom select-none">
                    <p className="font-bold border-b border-white/10 pb-1 mb-1" style={{ color: "var(--accent)" }}>{item.name}</p>
                    <p className="flex justify-between"><span>Moisture:</span> <span className="font-bold">{item.moisture}%</span></p>
                    <p className="flex justify-between"><span>Water Need:</span> <span className="font-bold">{item.wateringVal}%</span></p>
                    <p className="flex justify-between"><span>Sunlight:</span> <span className="font-bold">{item.sunVal}%</span></p>
                  </div>

                  <div className="w-4 md:w-6 lg:w-8 h-36 md:h-48 bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end gap-[2px] transition-all hover:bg-white/10 cursor-pointer">
                    <div className="w-full bg-yellow-500/40 hover:bg-yellow-500/60 transition-colors" style={{ height: `${(item.sunVal / 240) * 100}%` }} />
                    <div className="w-full bg-purple-500/40 hover:bg-purple-500/60 transition-colors" style={{ height: `${(item.wateringVal / 240) * 100}%` }} />
                    <div className="w-full rounded-t-sm transition-all" style={{ height: `${(item.moisture / 240) * 100}%`, backgroundColor: item.color }} />
                  </div>

                  <span className="text-[10px] mt-2 font-bold tracking-tight text-[var(--muted)] group-hover/bar:text-white transition-colors truncate max-w-full text-center">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 mt-4 md:mt-6 text-[10px] text-[var(--muted)] px-1 md:px-2 font-semibold select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: "var(--accent)" }} />
                <span>Soil moisture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-500/50" />
                <span>Water requirements</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-yellow-500/50" />
                <span>Sunlight exposure</span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 border border-[var(--muted)]/30 hover:border-[var(--muted)]/60 rounded-2xl bg-[var(--surface)] lg:col-span-2 flex flex-col relative overflow-hidden group transition-all">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-semibold mb-4 text-[var(--muted)]">Plants that need hydration the most</h3>

            <div className="flex-1 overflow-y-auto max-h-[240px] md:max-h-[290px] pr-1 select-none">
              <div className="flex flex-col gap-2">
                {[
                  { name: "Snake Plant", sciName: "Dracaena trifasciata", img: "/images/Snake-Plant.png", nextWater: "Today" },
                  { name: "Rose", sciName: "Rosa hybrid", img: "", nextWater: "Tomorrow" },
                  { name: "Monstera", sciName: "Monstera deliciosa", img: "/images/Monstera.png", nextWater: "In 2 days" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-black/10 hover:bg-black/30 transition-all group/item">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-white/5" />
                      ) : (
                        <img src="/favicon.ico" alt={item.name} className="w-9 h-9 rounded-lg object-contain p-1.5 border border-white/5 opacity-40" />
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover/item:text-[var(--accent)] transition-colors">{item.name}</h4>
                        <p className="text-[10px] text-[var(--muted)] truncate">{item.sciName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-white">{item.nextWater}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── My Plants Preview (3 real plants with images) ── */
function PlantsPreview() {
  const plants = [
    { name: "Monstera Deliciosa", sciName: "Monstera deliciosa", image: "/images/Monstera.png", sun: "Partial shade", water: "Moderate" },
    { name: "Boston Fern", sciName: "Nephrolepis exaltata", image: "/images/Boston-Fern.png", sun: "Indirect light", water: "Frequent" },
    { name: "Snake Plant", sciName: "Dracaena trifasciata", image: "/images/Snake-Plant.png", sun: "Low light", water: "Minimum" },
  ]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-xl overflow-hidden">
      <div className="p-5 md:p-7">
        <div className="flex items-center justify-between mb-5">
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {plants.map((p, i) => (
            <motion.div
              key={p.name}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
            >
              <div className="h-32 bg-[var(--surface)]">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 md:p-4 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-[var(--text)] truncate">{p.name}</p>
                  <p className="text-[10px] text-[var(--muted)]/60 truncate italic">{p.sciName}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium">{p.sun}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium">{p.water}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Add Plant Preview (exact working replica, no add buttons) ── */
type PreviewPlant = {
  id: number
  common_name: string
  watering_general_benchmark?: { value: string; unit: string } | string | string[] | null
  default_image?: { original_url?: string; regular_url?: string; thumbnail?: string }
  sunlight?: string[]
  watering?: string
}

const itemVariantsAdd = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

function AddPlantPreview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<PreviewPlant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const API = process.env.NEXT_PUBLIC_API_URL || ""

  const handleSearch = async (page: number = 1) => {
    if (!searchTerm.trim()) return
    setSearching(true)
    setError(null)
    setResults([])
    setCurrentPage(page)

    try {
      const searchRes = await fetch(`${API}/api/plants/search/${encodeURIComponent(searchTerm)}/${page}`)
      const searchData = await searchRes.json()
      if (!searchRes.ok) throw new Error(searchData.error || "Search failed")
      setLastPage(searchData.last_page || 1)
      setTotal(searchData.total || 0)
      setResults(searchData.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to search plants")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-xl overflow-hidden p-5 md:p-7 h-[480px] md:h-[560px] flex flex-col">

      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm w-full overflow-hidden shrink-0">
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]/40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
                placeholder="Search for a plant..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm placeholder:text-[var(--muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/40 transition-all"
              />
            </div>
            <button
              onClick={() => handleSearch(1)}
              disabled={searching}
              className="shrink-0 cursor-pointer px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-[var(--accent)] text-white hover:brightness-110 active:brightness-95 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  Search
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm leading-relaxed">{error}</div>
          )}
        </div>
      </div>

      {total > 0 && !searching && (
        <div className="mt-5 flex items-center justify-between px-1">
          <p className="text-xs text-[var(--muted)]/60 font-medium">
            <span className="text-[var(--muted)]/80 font-semibold">{total}</span> results found
          </p>
          <div className="flex items-center gap-3">
            <button disabled={currentPage <= 1} onClick={() => handleSearch(currentPage - 1)}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[var(--muted)] hover:text-[var(--text)]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="text-xs font-semibold text-[var(--muted)]/70 tabular-nums">{currentPage} / {lastPage}</span>
            <button disabled={currentPage >= lastPage} onClick={() => handleSearch(currentPage + 1)}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[var(--muted)] hover:text-[var(--text)]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 md:mt-8 flex-1 overflow-y-auto custom-scroll min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {results.slice(0, 4).map((plant, i) => {
          const isMissingInfo = !plant.sunlight || plant.sunlight.length === 0 || !plant.watering
          const imageUrl = plant.default_image?.regular_url || plant.default_image?.original_url
          return (
            <div key={plant.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:shadow-lg hover:border-[var(--muted)]/30"
            >
              <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[var(--bg)]">
                {imageUrl ? (
                  <img src={imageUrl} alt={plant.common_name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                ) : (
                  <img src="/favicon.ico" alt={plant.common_name} className="w-full h-full object-contain p-8 opacity-30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 right-3 flex gap-2">
                  
                </div>
              </div>
              <div className="flex flex-col flex-1 p-4 sm:p-5 select-none">
                <h3 className="text-sm sm:text-base font-semibold text-[var(--text)] leading-snug">{plant.common_name}</h3>
                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5">
                  {plant.sunlight && plant.sunlight.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                      {plant.sunlight[0]}
                    </span>
                  )}
                  {plant.watering && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                      {plant.watering}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {!searching && results.length === 0 && searchTerm && (
          <div className="col-span-full py-12 md:py-16 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-5">
              <svg className="w-7 h-7 text-[var(--muted)]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <h3 className="text-base font-semibold text-[var(--muted)] mb-1">No results found</h3>
            <p className="text-xs text-[var(--muted)]/50 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any plants matching &quot;<span className="text-[var(--muted)]/70 font-medium">{searchTerm}</span>&quot;. Try a different name or check the spelling.
            </p>
          </div>
        )}
        {searching && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
              <span className="text-xs text-[var(--muted)]/60">Searching plants...</span>
            </div>
          </div>
        )}
      </div>
      </div>

      {total > 0 && !searching && (
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-3">
          <button disabled={currentPage <= 1} onClick={() => handleSearch(currentPage - 1)}
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage >= lastPage - 2 ? lastPage - 4 + i : currentPage - 2 + i
              if (pageNum < 1 || pageNum > lastPage) return null
              return (
                <button key={pageNum} onClick={() => handleSearch(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${pageNum === currentPage ? "bg-[var(--accent)] text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"}`}>
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button disabled={currentPage >= lastPage} onClick={() => handleSearch(currentPage + 1)}
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5">
            Next
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Settings Preview ── */
function SettingsPreview() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-xl overflow-hidden">
      <div className="p-5 md:p-7 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div>
              <p className="text-xs font-medium text-[var(--text)]">Profile</p>
              <p className="text-[10px] text-[var(--muted)]/50">Name, email</p>
            </div>
            <div className="w-20 h-2 rounded-full bg-[var(--border)]" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div>
              <p className="text-xs font-medium text-[var(--text)]">Security</p>
              <p className="text-[10px] text-[var(--muted)]/50">Password</p>
            </div>
            <div className="w-20 h-2 rounded-full bg-[var(--border)]" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-red-500/10 bg-red-500/5">
            <div>
              <p className="text-xs font-medium text-red-500">Danger Zone</p>
              <p className="text-[10px] text-red-400/50">Account actions</p>
            </div>
            <div className="px-3 py-1 rounded-lg border border-red-500/20 text-red-500 text-[10px] font-semibold">Log out</div>
          </div>
        </div>
      </div>
    </div>
  )
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

function HomeContent() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const targetRef = useRef<HTMLDivElement>(null)

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[var(--bg)] text-[var(--text)] select-none transition-colors"
    >
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 pt-24 pb-16 text-center overflow-hidden">
        <LightRays />
        <div className="max-w-3xl z-10">
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
            <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-lg mx-auto">
              Candy Blossom gives youare instructions for every plant in your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            </div>
          </motion.div>
        </div>
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
          <DashboardPreview />
        </motion.div>
      </section>

      {/* ── My Plants Preview ── */}
      <section className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-[var(--accent)] text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">Organized.</span>

              <p className="text-[var(--muted)] text-base sm:text-lg leading-relaxed mt-4">
                Browser the plants you added in your collection.
              </p>
            </div>
            <div className="lg:ml-auto lg:w-[110%]">
              <PlantsPreview />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Add Plant Preview ── */}
      <section className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32 bg-[var(--surface)]/50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Add plants to
              <br />
              <span className="text-[var(--accent)]">your collection.</span>
            </h2>
            <p className="text-[var(--muted)] text-base sm:text-lg max-w-xl">
              Search plants you need, add them to your collection, and we&apos;ll handle the rest.
            </p>
          </div>
          <AddPlantPreview />
        </motion.div>
      </section>

      {/* ── Settings Preview ── */}


      {/* ── Features ── */}
      <section ref={targetRef} className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-24 md:py-32 bg-[var(--surface)]/50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[var(--accent)] text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">We know everything.</span>
    
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group p-6 md:p-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/20 hover:shadow-lg transition-all duration-300 cursor-default"
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

      {/* ── Footer ── */}
      <footer className="px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-88 py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-left justify-between gap-4">
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
