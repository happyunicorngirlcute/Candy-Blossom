"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { fetchBackend } from "@/lib/fetchApi"

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

function RegisterPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login } = useAuth()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) {
            setError("Email is missing. Please try the registration again.")
            return
        }

        setError(null)
        setLoading(true)

        try {
            const res = await fetchBackend('/register/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Failed to complete registration.")
                setLoading(false)
                return
            }

            if (data.token && data.user) {
                login(data.token, JSON.stringify(data.user))
                router.push('/dashboard')
                return
            }

            // fallback: Redirect to landing page with success message
            router.push('/?registered=true')

        } catch (err) {
            setError("Cannot connect to backend.")
        } finally {
            setLoading(false)
        }
    }

    const passwordValid = password.length >= 6

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex items-center justify-center"
        >
            <section className="max-w-md w-full text-center space-y-6 px-6">
                <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl leading-tight font-semibold">
                    Your Password?
                </motion.h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <motion.div variants={itemVariants}>
                        <input
                            autoFocus
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] border-animate"
                        />

                        {error && <div className="text-[#CA2A30] text-sm mt-2 text-left">{error}</div>}

                        <button
                            type="submit"
                            disabled={!passwordValid || loading}
                            className={`w-full mt-4 px-3 py-2 rounded-md font-semibold transition-colors 
                                ${passwordValid
                                    ? 'bg-[var(--text)] text-[var(--bg)] dark:bg-white dark:text-black cursor-pointer hover:opacity-95'
                                    : 'bg-[var(--border)] text-[var(--muted)] opacity-60 cursor-not-allowed'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-[var(--bg)] dark:border-black border-t-transparent rounded-full"></span>
                                    Finishing...
                                </span>
                            ) : "Complete Registration"}
                        </button>
                    </motion.div>
                </form>
            </section>
        </motion.main>
    )
}

export default function RegisterPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterPasswordContent />
        </Suspense>
    )
}
