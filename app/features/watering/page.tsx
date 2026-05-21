"use client"

import { motion } from "framer-motion"

export default function WateringPage() {
    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 leading-[1.15]">
                        Smart Watering
                        <br />
                        <span className="text-blue-500">Never overwater again</span>
                    </h1>
                    <p className="text-[var(--muted)] text-base leading-relaxed max-w-md">
                        Get notified exactly when your plants need water. Our system considers species, weather, season, and soil conditions to give you the perfect watering schedule.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-56 h-56 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/10 flex items-center justify-center"
                >
                    <svg className="w-20 h-20 text-blue-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </motion.div>
            </div>
        </div>
    )
}
