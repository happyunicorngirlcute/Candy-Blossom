"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PlantDetailsModal from "@/components/PlantDetailsModal"

export default function MyPlantsPage() {
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlant, setSelectedPlant] = useState<any>(null)
  const router = useRouter()

  const API = process.env.NEXT_PUBLIC_API_URL

  const fetchPlants = async () => {
    setError(null)
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const res = await fetch(`${API}/user/plants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || data.message || "Failed to fetch plants")
        setPlants([])
        return
      }

      setPlants(data.data || data['hydra:member'] || [])
    } catch (err) {
      setError("An error occurred while fetching plants.")
      setPlants([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plant?")) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const res = await fetch(`${API}/user/plant/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || data.message || "Failed to delete plant")
        return
      }

      fetchPlants()
    } catch (err) {
      setError("An error occurred while deleting the plant.")
    }
  }

  if (loading) return <div className="p-8">Loading plants...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Plants</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.length === 0 ? (
          <p>No plants added yet. Add one now!</p>
        ) : (
          plants.map((item: any) => {
            // Depending on how API Platform serializes the nested object:
            // Sometimes it's item.plant, sometimes it's just the object if groups were merged.
            const p = item.plant
            const wateringDate = item.nextWateringAt ? new Date(item.nextWateringAt) : null
            const displayImage = item.image || p?.image

            const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0]
              if (!file) return

              const formData = new FormData()
              formData.append('image', file)

              try {
                const token = localStorage.getItem("token")
                const res = await fetch(`${API}/user/plant/${item.id}/image`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                })

                if (res.ok) {
                  fetchPlants() // Refresh list
                } else {
                  const data = await res.json()
                  alert(data.message || "Upload failed")
                }
              } catch (err) {
                alert("An error occurred during upload")
              }
            }

            return (
              <div key={item.id} className="group relative overflow-hidden p-0 border border-[var(--border)] rounded-2xl bg-[var(--surface)] flex flex-col shadow-sm hover:shadow-md transition-all">
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-[var(--bg)]">
                  {displayImage ? (
                    <img src={displayImage} alt={p.common_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="text-4xl opacity-50">🌱</div>
                      <label className="cursor-pointer bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[var(--accent)] hover:text-white transition-all">
                        <span>Add Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.city}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl mb-1 text-[var(--text)]">{p?.common_name || "Unknown plant"}</h3>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold opacity-40 leading-none mb-1">Sunlight</p>
                        <p className="text-sm font-medium">{Array.isArray(p?.sunlight) ? p.sunlight.join(', ') : p?.sunlight || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold opacity-40 leading-none mb-1">Watering</p>
                        <p className="text-sm font-medium">{p?.watering || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[var(--border)] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold opacity-60">Next Care</p>
                      <p className={`text-xs font-bold px-2 py-1 rounded-md ${wateringDate && wateringDate < new Date() ? 'bg-red-500/10 text-red-500' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                        {wateringDate ? wateringDate.toLocaleDateString() : "Not scheduled"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedPlant(p)}
                        className="w-full py-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold hover:bg-[var(--accent)] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Details
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group/del"
                      >
                        <svg className="w-4 h-4 group-hover/del:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                        Remove Plant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {selectedPlant && (
        <PlantDetailsModal 
          plant={selectedPlant} 
          onClose={() => setSelectedPlant(null)} 
        />
      )}
    </div>
  )
}
