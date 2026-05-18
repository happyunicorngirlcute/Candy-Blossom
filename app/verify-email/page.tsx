"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"

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

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState("Verifying your email...")
    const API = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            setStatus('error')
            setMessage("I need a token to verify your email.")
            return
        }

        const verify = async () => {
            try {
                const res = await fetch(`${API}/verify-email?token=${token}`)
                const data = await res.json()

                if (res.ok) {
                    setStatus('success')
                    setMessage(data.message || "Email verified successfully!")
                    // Redirect to set password page with email in query
                    setTimeout(() => router.push(`/auth/register/password?email=${encodeURIComponent(data.email)}`), 2000)
                } else {
                    setStatus('error')
                    setMessage(data.error || "Verification failed.")
                }
            } catch (err) {
                setStatus('error')
                setMessage("Cannot connect to backend.")
            }
        }

        verify()
    }, [searchParams, API, router])

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex items-center justify-center"
        >
            <div className="max-w-md w-full text-center space-y-6 p-8 bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--border)]">
                <motion.h1 variants={itemVariants} className="text-2xl font-semibold">
                    Verifying...
                </motion.h1>
{/* 
                <motion.div variants={itemVariants} className="py-4">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin h-8 w-8 border-4 border-[var(--accent)] border-t-transparent rounded-full"></div>
                            <p className="text-[var(--muted)]">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <p className="text-sm text-[var(--muted)]">Redirecting to login...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="text-red-500 text-5xl">✕</div>
                            <p className="text-[var(--text)]">{message}</p>
                            <button 
                                onClick={() => router.push('/auth/register')}
                                className="mt-4 px-4 py-2 font-semibold rounded bg-[var(--text)] text-[var(--bg)] dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                            >
                                Back to Registration
                            </button>
                        </div>
                    )}
                </motion.div> */}
            </div>
        </motion.main>
    )
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
