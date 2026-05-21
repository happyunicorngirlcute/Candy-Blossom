"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useTheme } from "@/components/ThemeProvider"

const PlantScene = dynamic(() => import("@/components/scenes/PlantScene"), { ssr: false })

type Plant = {
  id: number
  common_name: string
  watering_general_benchmark?: { value: string; unit: string } | string | string[] | null
  default_image?: { original_url?: string; regular_url?: string; thumbnail?: string }
  sunlight?: string[]
  watering?: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

function AddPlantModal({ plant, API, onClose }: { plant: Plant, API: string, onClose: () => void }) {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAdd = async () => {
    if (!city.trim()) {
      setError("City is required.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/user/plant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          perenual_id: plant.id,
          common_name: plant.common_name,
          watering_general_benchmark: plant.watering_general_benchmark || [],
          image: plant.default_image?.regular_url || plant.default_image?.original_url || null,
          sunlight: plant.sunlight && plant.sunlight.length > 0 ? plant.sunlight : null,
          watering: plant.watering || null,
          city: city.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || "Failed to add plant")
      router.push("/dashboard/plants")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[var(--surface)] w-full sm:max-w-md rounded-t-2xl sm:rounded-3xl shadow-2xl border border-[var(--border)] relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--surface)] transition-colors z-10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {plant.default_image?.regular_url && (
          <div className="relative h-40 sm:h-48 w-full overflow-hidden">
            <img 
              src={plant.default_image.regular_url} 
              alt={plant.common_name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/60 to-transparent" />
            <div className="absolute bottom-4 left-8">
              <h2 className="text-xl font-semibold text-[var(--text)]">{plant.common_name}</h2>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {!plant.default_image?.regular_url && (
            <h2 className="text-xl font-semibold mb-6 text-[var(--text)]">What city is the plant located?</h2>
          )}

          <div className="space-y-4">
            <div>
              <input 
                autoFocus
                type="text" 
                placeholder="e.g. Paris, London, New York..." 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 transition-all"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs leading-relaxed"
              >
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              onClick={handleAdd}
              className="w-full bg-[var(--accent)] cursor-pointer text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:brightness-110 active:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding to collection...
                </>
              ) : "Confirm & Add to Collection"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PlantCard({ plant, onAdd, index }: { plant: Plant, onAdd: (plant: Plant) => void, index: number }) {
  const isMissingInfo = !plant.sunlight || plant.sunlight.length === 0 || !plant.watering
  const imageUrl = plant.default_image?.regular_url || plant.default_image?.original_url

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:shadow-lg hover:border-[var(--muted)]/30"
    >
      <div className="relative h-52 w-full overflow-hidden bg-[var(--bg)]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={plant.common_name} 
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <img 
            src="/favicon.ico" 
            alt={plant.common_name} 
            className="w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 right-3 flex gap-2">
  
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 select-none">
        <h3 className="text-base font-semibold text-[var(--text)] leading-snug">{plant.common_name}</h3>
        
        <div className="mt-3 flex flex-wrap gap-2">
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

        <div className="mt-auto pt-4">
          <button
            onClick={() => onAdd(plant)}
            className="w-full cursor-pointer py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add to Collection
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AddPlantClient() {
  const { dark } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Plant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedPlantForAdd, setSelectedPlantForAdd] = useState<Plant | null>(null)
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
      
      const basicPlants = searchData.data || []
      setLastPage(searchData.last_page || 1)
      setTotal(searchData.total || 0)
      setResults(basicPlants)
    } catch (err: any) {
      setError(err.message || "Failed to search plants")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-8 md:mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)] leading-[1.15]">
            Search for your plant.
         </h1>
          <p className="mt-1 text-sm text-[var(--muted)]/70 max-w-md">
            Find any plant species from our database and add it to your collection to start tracking its care.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-48 h-48 md:w-56 md:h-56 shrink-0"
        >
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm max-w-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1">
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]/40 pointer-events-none" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
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
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm leading-relaxed"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {total > 0 && !searching && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center justify-between px-1"
        >
          <p className="text-xs text-[var(--muted)]/60 font-medium">
            <span className="text-[var(--muted)]/80 font-semibold">{total}</span> results found
          </p>
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage <= 1}
              onClick={() => handleSearch(currentPage - 1)}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[var(--muted)] hover:text-[var(--text)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="text-xs font-semibold text-[var(--muted)]/70 tabular-nums">{currentPage} / {lastPage}</span>
            <button 
              disabled={currentPage >= lastPage}
              onClick={() => handleSearch(currentPage + 1)}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[var(--muted)] hover:text-[var(--text)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {results.map((plant, i) => (
          <PlantCard key={plant.id} plant={plant} index={i} onAdd={(p) => setSelectedPlantForAdd(p)} />
        ))}
        {!searching && results.length === 0 && searchTerm && (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-16 md:py-24 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-6">
              <svg className="w-8 h-8 text-[var(--muted)]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--muted)] mb-2">No results found</h3>
            <p className="text-sm text-[var(--muted)]/50 max-w-sm mx-auto leading-relaxed">
              We couldn't find any plants matching "<span className="text-[var(--muted)]/70 font-medium">{searchTerm}</span>". Try a different name or check the spelling.
            </p>
          </motion.div>
        )}
        {searching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex items-center justify-center py-16"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
              <span className="text-xs text-[var(--muted)]/60">Searching plants...</span>
            </div>
          </motion.div>
        )}
      </div>

      {total > 0 && !searching && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <button 
            disabled={currentPage <= 1}
            onClick={() => handleSearch(currentPage - 1)}
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
              const pageNum = currentPage <= 3
                ? i + 1
                : currentPage >= lastPage - 2
                  ? lastPage - 4 + i
                  : currentPage - 2 + i
              if (pageNum < 1 || pageNum > lastPage) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => handleSearch(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    pageNum === currentPage
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button 
            disabled={currentPage >= lastPage}
            onClick={() => handleSearch(currentPage + 1)}
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            Next
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedPlantForAdd && (
          <AddPlantModal 
            plant={selectedPlantForAdd} 
            API={API} 
            onClose={() => setSelectedPlantForAdd(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
