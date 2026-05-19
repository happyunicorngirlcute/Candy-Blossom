"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Plant = {
  id: number
  common_name: string
  watering_general_benchmark?: string | string[] | null
}

type Props = {
  plants: Plant[]
  initialError?: string | null
}

export default function AddPlantClient({ plants, initialError }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [city, setCity] = useState("")
  const [error, setError] = useState<string | null>(initialError || null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const API = process.env.NEXT_PUBLIC_API_URL

  const filteredPlants = useMemo(() => {
    if (!searchTerm) return plants
    return plants.filter((plant) =>
      plant.common_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [plants, searchTerm])

  const handleAddPlant = async (plantId: number) => {
    if (!city.trim()) {
      setError("Enter your city to calculate watering for this plant.")
      return
    }

    if (!API) {
      setError("API URL is not configured.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const res = await fetch(`${API}/user/plant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plant: `${API}/plants/${plantId}`,
          city: city.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || data.message || "Failed to add plant")
        return
      }

      router.push("/dashboard/plants")
    } catch (err) {
      setError("An error occurred while adding the plant.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Add New Plant</h1>
      <p className="mt-2 text-sm opacity-60">Search the backend plant database, choose your plant, and tell us your city.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_280px]">
        <input
          type="text"
          placeholder="Search for a plant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm"
        />
        <input
          type="text"
          placeholder="Your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm"
        />
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.length === 0 ? (
          <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <p>No plant matches found. Try a different search term.</p>
          </div>
        ) : (
          filteredPlants.map((plant) => (
            <div key={plant.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
              <h3 className="font-semibold">{plant.common_name}</h3>
              <p className="text-sm opacity-60">Watering benchmark: {JSON.stringify(plant.watering_general_benchmark)}</p>
              <button
                disabled={loading}
                onClick={() => handleAddPlant(plant.id)}
                className="mt-4 bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to my collection
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
