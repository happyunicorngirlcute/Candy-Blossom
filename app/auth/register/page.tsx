"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { fetchBackend } from "@/lib/fetchApi"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

export default function AuthRegister() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    useEffect(() => {
        try {
            const stored = localStorage.getItem('registerData')
            if (stored) {
                const data = JSON.parse(stored)
                if (data.email) setEmail(data.email)
                if (data.name) setName(data.name)
                if (typeof data.step === 'number') setStep(Math.min(1, data.step))
            }
        } catch { }
    }, [])

    useEffect(() => {
        try {
            const data = { email, name, step }
            localStorage.setItem('registerData', JSON.stringify(data))
        } catch { }
    }, [email, name, step])

    const next = () => setStep((s) => Math.min(1, s + 1))

    const verifyEmail = async () => {
        setError(null)
        setLoading(true)

        try {
            const payload = {
                email,
                name,
            }

            const res = await fetchBackend('/register/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || data.message || 'Verification failed')
                setLoading(false)
                return
            }

            setSent(true)

        } catch (err) {
            setError('My backend seems to not work as intended!')
        } finally {
            setLoading(false)
        }
    }

    const emailValid = email.includes('@') && email.includes('.')
    const nameValid = name.trim().length >= 3

    return (
        <motion.main className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors"
            variants={containerVariants} initial="hidden" animate="visible"
        >
            <section className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-4xl text-center space-y-6">

                    {!sent ? (
                        <>
                            <motion.h1 variants={itemVariants} className="text-3xl font-thin leading-tight">
                                {step === 0 && 'What should I call you?'}
                                {step === 1 && (name ? `What's your email address, ${name
                                    }?` : 'What\'s your email address?')}
                            </motion.h1>

                            <div className="w-full">
                                <div className="w-[390px] mx-auto">
                                    {step === 0 && (
                                        <motion.div variants={itemVariants} className="text-center">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full mx-auto block px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] border-animate no-placeholder"
                                            />

                                            <button
                                                type="button"
                                                disabled={!nameValid}
                                                onClick={next}
                                                className={`w-full mx-auto block mt-4 px-3 py-2 rounded-md font-semibold transition-colors duration-150 
                                                    ${nameValid
                                                        ? 'bg-[var(--text)] text-[var(--bg)] dark:bg-white dark:text-black cursor-pointer hover:opacity-95'
                                                        : 'bg-[var(--border)] text-[var(--muted)] opacity-60 cursor-not-allowed blocked-animate'
                                                    }`}
                                            >
                                                Next?
                                            </button>
                                        </motion.div>
                                    )}

                                    {step === 1 && (
                                        <motion.div variants={itemVariants} className="text-center">
                                            <input
                                                autoFocus
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full mx-auto block px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] border-animate no-placeholder"
                                            />

                                            {error && (
                                                <div className="text-[#CA2A30] text-sm mt-2 text-left">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                onClick={verifyEmail}
                                                className={`w-full mx-auto block mt-4 px-3 py-2 rounded-md font-semibold transition-colors duration-150 ${emailValid
                                                    ? 'bg-[var(--text)] text-[var(--bg)] dark:bg-white dark:text-black cursor-pointer hover:opacity-95'
                                                    : 'bg-[var(--border)] text-[var(--muted)] opacity-60 cursor-not-allowed blocked-animate'
                                                    }`}
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span className="animate-spin h-4 w-4 border-2 border-[var(--bg)] dark:border-black border-t-transparent rounded-full"></span>
                                                        Sending email...
                                                    </span>
                                                ) : "Let's verify that"}
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (

                        <h1 className="text-4xl font-thin leading-tight"> {name}. That's a cool name! Check your inbox</h1>

                    )}

                </div>
            </section>
        </motion.main>
    )
}