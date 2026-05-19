"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const API = process.env.NEXT_PUBLIC_API_URL
    const { login } = useAuth()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const url = `${API}/login`
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json().catch(() => ({}))

            if (res.status === 404) {
                setError(`404: endpoint not found at ${url}`)
                setLoading(false)
                return
            }

            if (!res.ok) {
                setError(data.error || data.message || 'Login failed')
                setLoading(false)
                return
            }

            // store token and basic user info
            if (data.token && data.user) login(data.token, JSON.stringify(data.user))

            router.push('/dashboard')

        } catch (err) {
            setError('My server crashed!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors"
        >
            <section className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-4xl text-center space-y-6">

                    <motion.h1 variants={itemVariants} className="text-4xl font-thin leading-tight">
                        Log in to Candy Blossom
                    </motion.h1>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-full max-w-md mx-auto">
                        <div>
                            <label className="block text-start text-sm font-medium mb-3 text-[var(--muted)]">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] border-animate no-placeholder"
                            />
                        </div>

                        <div>
                            <label className="block text-start text-sm font-medium mb-3 text-[var(--muted)]">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] border-animate no-placeholder"
                            />

                            {error && <div className="text-[#CA2A30] text-sm mt-2 mb-2 text-left">{error}</div>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full select-none cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors bg-[var(--text)] text-[var(--bg)] dark:bg-white dark:text-black hover:opacity-90"
                            >
                                {loading ? 'Welcoming you...' : 'Enter my home'}
                            </button>
                        </div>
                    </form>

                </div>
            </section>
        </motion.main >
    )
}