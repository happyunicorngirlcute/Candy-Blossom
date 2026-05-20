"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Plant = {
  id: number
  common_name: string
  watering_general_benchmark?: { value: string; unit: string } | string | string[] | null
  default_image?: { original_url?: string; regular_url?: string; thumbnail?: string }
  sunlight?: string[]
  watering?: string
}

function PlantCard({ plant, API }: { plant: Plant, API: string }) {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isMissingInfo = !plant.sunlight || plant.sunlight.length === 0 || !plant.watering

  const handleAdd = async () => {
    if (isMissingInfo) {
      setError("This plant is missing vital care information (sunlight or watering) and cannot be added.")
      return
    }

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
    <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {(plant.default_image?.regular_url || plant.default_image?.original_url) && (
        <img src={plant.default_image?.regular_url || plant.default_image?.original_url} alt={plant.common_name} className="w-full h-48 object-cover rounded-lg mb-4" />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{plant.common_name}</h3>
        
        <div className="mt-2 space-y-1">
          <div className="text-xs opacity-70 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${!plant.sunlight || plant.sunlight.length === 0 ? "bg-red-500" : "bg-green-500"}`} />
            <span className="font-medium">Sunlight:</span> {plant.sunlight && plant.sunlight.length > 0 ? plant.sunlight.join(", ") : "Missing"}
          </div>
          <div className="text-xs opacity-70 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${!plant.watering ? "bg-red-500" : "bg-green-500"}`} />
            <span className="font-medium">Watering:</span> {plant.watering || "Missing"}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-3 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <input 
          type="text" 
          placeholder="Enter your city" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          disabled={loading || isMissingInfo}
          onClick={handleAdd}
          className="w-full bg-[var(--accent)] text-white px-4 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : isMissingInfo ? "Incomplete Data" : "Add to My Plants"}
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
  const API = process.env.NEXT_PUBLIC_API_URL || ""

  const handleSearch = async (page: number = 1) => {
    if (!searchTerm.trim()) return
    setSearching(true)
    setError(null)
    setResults([])
    setCurrentPage(page)

    try {
      // 1. Search for plants with pagination
      const searchRes = await fetch(`${API}/api/plants/search/${encodeURIComponent(searchTerm)}/${page}`)
      const searchData = await searchRes.json()
      if (!searchRes.ok) throw new Error(searchData.error || "Search failed")
      
      const basicPlants = searchData.data || []
      setLastPage(searchData.last_page || 1)
      setTotal(searchData.total || 0)
      
      // 2. Fetch full details for each plant (Parallelized)
      const detailedPlants = await Promise.all(
        basicPlants.map(async (p: any) => {
          try {
            const detailRes = await fetch(`${API}/api/plants/details/${p.id}`)
            const detailData = await detailRes.json()
            return detailData.data
          } catch (e) {
            return p // Fallback to basic info
          }
        })
      )

      setResults(detailedPlants)
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
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Discover New Plants</h1>
          <p className="text-[var(--muted)] mt-1">Search the world's largest plant database and add them to your collection.</p>
        </div>
      </div>

      <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. Monstera Deliciosa, Rose, Maple..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all"
            />
          </div>
          <button 
            onClick={() => handleSearch(1)}
            disabled={searching}
            className="px-8 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {searching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : "Search"}
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
          <PlantCard key={plant.id} plant={plant} API={API} />
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
    </div>
  )
}
