"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function OverviewPage() {
  const [plantCount, setPlantCount] = useState<number | null>(null)
  const [upcomingTasks, setUpcomingTasks] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const loadUserPlants = async () => {
      setError(null)
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        const res = await fetch(`${API}/user/plants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || data.message || "Unable to load your plants.")
          return
        }

        const plants = data.data || []
        setPlantCount(plants.length)

        const upcoming = plants.filter((plant: any) => {
          if (!plant.nextWateringAt) return false
          const wateringDate = new Date(plant.nextWateringAt)
          const diffDays = Math.ceil((wateringDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return diffDays >= 0 && diffDays <= 7
        }).length

        setUpcomingTasks(upcoming)
      } catch (err) {
        setError("An error occurred while loading your dashboard.")
      } finally {
        setLoading(false)
      }
    }

    loadUserPlants()
  }, [API, router])

  return (
    <div className="p-8">
      <p className="mt-4 text-sm opacity-60">Your current plant health stats and upcoming watering schedule.</p>

      {loading ? (
        <div className="mt-8 text-sm opacity-70">Loading dashboard information…</div>
      ) : error ? (
        <div className="mt-8 text-red-500">{error}</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <h3 className="text-sm font-medium opacity-70">Upcoming Tasks</h3>
            <p className="text-2xl font-semibold mt-2">{upcomingTasks ?? 0} plant{upcomingTasks === 1 ? "" : "s"} due soon</p>
          </div>
          <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <h3 className="text-sm font-medium opacity-70">Collection Size</h3>
            <p className="text-2xl font-semibold mt-2">{plantCount ?? 0} plant{plantCount === 1 ? "" : "s"}</p>
          </div>
        </div>
      )}
    </div>
  )
}
