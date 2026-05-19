"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MyPlantsPage() {
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

      <div className="mt-4">
        <Link href="/dashboard/plants/add" className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
          Add New Plant
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.length === 0 ? (
          <p>No plants added yet. Add one now!</p>
        ) : (
          plants.map((plant: any) => {
            const plantName = plant.plant?.common_name || plant.common_name || "Unknown plant"
            const wateringDate = plant.nextWateringAt ? new Date(plant.nextWateringAt) : null

            return (
              <div key={plant.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{plantName}</h3>
                  <p className="text-sm opacity-60">City: {plant.city}</p>
                  <p className="text-sm">
                    Next Watering: {wateringDate ? wateringDate.toLocaleDateString() : "Not scheduled"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(plant.id)}
                  className="mt-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors self-end"
                >
                  Delete
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
