"use client"

import { motion } from "framer-motion"

export default function GrowingPage() {
    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 leading-[1.15]">
                        Growth Tracking
                        <br />
                        <span className="text-green-500">Watch them thrive</span>
                    </h1>
                    <p className="text-[var(--muted)] text-base leading-relaxed max-w-md">
                        Track your plant&apos;s growth over time. Log milestones, take progress photos, and see how your care routine helps them flourish.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-56 h-56 shrink-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/10 flex items-center justify-center"
                >
                    <svg className="w-20 h-20 text-green-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13L11 20z"/><path d="M9 13c1.9 2.8 4.3 3.9 6.2 4.5"/></svg>
                </motion.div>
            </div>
        </div>
    )
}
