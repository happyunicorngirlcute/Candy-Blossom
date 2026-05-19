"use client"

import { useState } from "react"

export default function DashboardWeatherPage() {
    const [city, setCity] = useState("")
    const [weather, setWeather] = useState<{ city: string; temperature: number; condition: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const API = process.env.NEXT_PUBLIC_API_URL

    const fetchWeather = async () => {
        if (!city) {
            setError("Please enter a city.")
            return
        }

        setLoading(true)
        setError(null)
        setWeather(null)

        try {
            const res = await fetch(`${API}/weather/${encodeURIComponent(city)}`)
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || data.message || "Failed to fetch weather.")
                return
            }

            setWeather({
                city: data.city,
                temperature: data.temperature,
                condition: data.condition,
            })
        } catch (err) {
            setError("Network error while fetching weather.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Weather</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Check the current weather for any city and use it to care for your plants.</p>

            <div className="mt-6 flex flex-col gap-4 max-w-md">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                />

                <button
                    onClick={fetchWeather}
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Fetching weather...' : 'Get Weather'}
                </button>
            </div>

            {error && <div className="mt-6 text-red-500">{error}</div>}

            {weather && (
                <div className="mt-8 p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] max-w-md">
                    <h2 className="text-xl font-semibold">{weather.city}</h2>
                    <p className="mt-2 text-sm opacity-70">{weather.condition}</p>
                    <p className="mt-3 text-3xl font-bold">{weather.temperature}°C</p>
                </div>
            )}
        </div>
    )
}
