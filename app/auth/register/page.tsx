"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

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
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            const stored = localStorage.getItem('registerData')
            if (stored) {
                const data = JSON.parse(stored)
                if (data.email) setEmail(data.email)
                if (data.username) setUsername(data.username)
                if (data.password) setPassword(data.password)
                if (typeof data.step === 'number') setStep(Math.min(2, data.step))
            }
        } catch { }
    }, [])

    useEffect(() => {
        try {
            const data = { email, username, password, step }
            localStorage.setItem('registerData', JSON.stringify(data))
        } catch { }
    }, [email, username, password, step])

    const next = () => setStep((s) => Math.min(2, s + 1))

    const finish = async () => {
        setError(null)
        setLoading(true)

        try {
            const payload = {
                email,
                password,
                firstName: username,
                lastName: "",
            }

            const res = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || data.message || 'Registration failed')
                setLoading(false)
                return
            }

            try { localStorage.removeItem('registerData') } catch { }

            // registration created; redirect user to login and ask to verify email
            router.push('/auth/login')

        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    const emailValid = email.includes('@') && email.includes('.')
    const usernameValid = username.trim().length >= 3
    // password: at least 8 chars, at least one letter and one number
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)
    const passwordLengthOk = password.length >= 8
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    return (
        <motion.main className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors"
            variants={containerVariants} initial="hidden" animate="visible"
        >
            <section className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-4xl text-center space-y-6">

                    <motion.h1 variants={itemVariants} className="text-3xl font-thin leading-tight">
                        {step === 0 && 'What should I call you?'}
                        {step === 1 && (username ? `What's your email address, ${username}?` : 'What\'s your email address?')}
                        {step === 2 && 'Your password?'}
                    </motion.h1>

                    <div className="w-full">
                        <div className="w-[390px] mx-auto">
                            {step === 0 && (
                                <motion.div variants={itemVariants} className="text-center">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full mx-auto block px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] border-animate no-placeholder"
                                    />

                                    <button
                                        disabled={!usernameValid}
                                        onClick={next}
                                        className={`w-full mx-auto block mt-4 px-3 py-2 rounded-md text-white font-semibold transition-colors duration-150 ${usernameValid ? 'bg-[var(--accent)] cursor-pointer hover:opacity-95' : 'bg-[var(--border)] opacity-60 cursor-not-allowed blocked-animate'}`}
                                    >
                                        Continue
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

                                    <button
                                        disabled={!emailValid}
                                        onClick={next}
                                        className={`w-full mx-auto block mt-4 px-3 py-2 rounded-md text-white font-semibold transition-colors duration-150 ${emailValid ? 'bg-[var(--accent)] cursor-pointer hover:opacity-95' : 'bg-[var(--border)] opacity-60 cursor-not-allowed blocked-animate'}`}
                                    >
                                        Continue
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div variants={itemVariants} className="text-center">
                                    <input
                                        autoFocus
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full mx-auto block px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] border-animate no-placeholder"
                                    />

                                    {/* validation messages shown below the password input */}
                                    {!passwordLengthOk && password.length > 0 && (
                                        <div className="text-yellow-400 text-sm mt-2 text-left">Le mot de passe doit contenir au moins 8 caractères.</div>
                                    )}
                                    {password.length > 0 && !/.*[A-Za-z].*/.test(password) && (
                                        <div className="text-yellow-400 text-sm mt-1 text-left">Le mot de passe doit contenir au moins une lettre.</div>
                                    )}
                                    {password.length > 0 && !/.*\d.*/.test(password) && (
                                        <div className="text-yellow-400 text-sm mt-1 text-left">Le mot de passe doit contenir au moins un chiffre.</div>
                                    )}
                                    {error && (
                                        <div className="text-red-400 text-sm mt-1 text-left">{error}</div>
                                    )}

                                    <button
                                        disabled={!passwordValid || loading}
                                        onClick={finish}
                                        className={`w-full mx-auto block mt-4 px-3 py-2 rounded-md text-white font-semibold transition-colors duration-150 ${passwordValid ? 'bg-[var(--accent)] cursor-pointer hover:opacity-95' : 'bg-[var(--border)] opacity-60 cursor-not-allowed blocked-animate'}`}
                                    >
                                        {loading ? 'Création…' : 'Create account'}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </motion.main>
    )
}
