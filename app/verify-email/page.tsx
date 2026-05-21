"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
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

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState("Verifying your email...")

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            setStatus('error')
            setMessage("I need a token to verify your email.")
            return
        }

        const verify = async () => {
            try {
                const res = await fetchBackend(`/verify-email?token=${token}`)
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
    }, [searchParams, router])

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex items-center justify-center"
        >
            <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-thin leading-tight text-center">
                Verifying... {status === 'success' && "Success!"}
                {status === 'error' && "Give it a moment?"}
            </motion.h1>
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
