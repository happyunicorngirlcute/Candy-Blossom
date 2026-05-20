"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type Plant = {
  id: number
  common_name: string
  watering_general_benchmark?: { value: string; unit: string } | string | string[] | null
  default_image?: { original_url?: string; regular_url?: string; thumbnail?: string }
  sunlight?: string[]
  watering?: string
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

        <div className="p-8">
          <h2 className="text-2xl  mb-4 text-[var(--text)]">What city is the plant located?</h2>

          <div className="space-y-4">
            <div>
              <input 
                autoFocus
                type="text" 
                placeholder="e.g. Paris, London, New York..." 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              onClick={handleAdd}
              className="w-full bg-[var(--accent)] cursor-pointer text-white px-4 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 h-10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : "Confirm & Add"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PlantCard({ plant, onAdd }: { plant: Plant, onAdd: (plant: Plant) => void }) {
  const isMissingInfo = !plant.sunlight || plant.sunlight.length === 0 || !plant.watering

  return (
    <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {(plant.default_image?.regular_url || plant.default_image?.original_url) && (
        <img src={plant.default_image?.regular_url || plant.default_image?.original_url} alt={plant.common_name} className="w-full h-48 object-cover rounded-lg mb-4" />
      )}
      <div className="flex-1">
        <h3 className=" text-[var(--muted)] text-lg">{plant.common_name}</h3>
      </div>

      <div className="pt-3 border-t border-[var(--border)]">
        <button
          disabled={isMissingInfo}
          onClick={() => onAdd(plant)}
          className="w-full bg-[var(--accent)] text-white px-4 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMissingInfo ? "Incomplete Data" : "Add to My Plants"}
        </button>
      </div>
    </div>
  )
}

export default function AddPlantClient() {
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl tracking-tight text-[var(--muted)]">Type the name of your plant</h1>
        </div>
      </div>

      <div className="bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-sm max-w-xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-3 text-left">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          
          <button 
            onClick={() => handleSearch(1)}
            disabled={searching}
            className="w-full select-none cursor-pointer inline-flex items-center justify-center px-4 py-3 rounded-md font-semibold transition-colors bg-[var(--text)] text-[var(--bg)] dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50"
          >
            {searching ? (
              <>
                <div className="w-4 h-4 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : "Let's search for it"}
          </button>
        </div>
        {error && <div className="mt-4 p-4 bg-red-500/10 text-red-600 rounded-xl border border-red-500/20 text-sm">{error}</div>}
      </div>

      {total > 0 && (
        <div className="mt-6 flex items-center justify-between px-2">
          <p className="text-sm opacity-50">Found {total} results</p>
          <div className="flex items-center gap-4">
            <button 
              disabled={currentPage <= 1 || searching}
              onClick={() => handleSearch(currentPage - 1)}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] disabled:opacity-30"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="text-sm font-bold">Page {currentPage} of {lastPage}</span>
            <button 
              disabled={currentPage >= lastPage || searching}
              onClick={() => handleSearch(currentPage + 1)}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] disabled:opacity-30"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onAdd={(p) => setSelectedPlantForAdd(p)} />
        ))}
        {!searching && results.length === 0 && searchTerm && (
          <div className="col-span-full py-20 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-medium opacity-50">No plants found matching "{searchTerm}"</h3>
            <p className="opacity-40">Try searching for a different name or species.</p>
          </div>
        )}
      </div>

      {total > 0 && !searching && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button 
            disabled={currentPage <= 1}
            onClick={() => handleSearch(currentPage - 1)}
            className="px-6 py-2 rounded-xl border border-[var(--border)] font-semibold hover:bg-[var(--surface)] disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="font-bold">Page {currentPage} / {lastPage}</span>
          <button 
            disabled={currentPage >= lastPage}
            onClick={() => handleSearch(currentPage + 1)}
            className="px-6 py-2 rounded-xl border border-[var(--border)] font-semibold hover:bg-[var(--surface)] disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
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
