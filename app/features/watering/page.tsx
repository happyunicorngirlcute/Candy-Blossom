"use client"

import { motion } from "framer-motion"

export default function WateringPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <motion.h1 
                    className="text-6xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-linear-to-r from-[var(--text)] to-[var(--muted)]"
                >
                    Smart Watering
                </motion.h1>
                <p className="text-xl opacity-70 mb-12 max-w-2xl leading-relaxed">
                    Get precise notifications based on your plant species, soil moisture, and local weather patterns.
                </p>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6">How it works</h2>
                    <p className="text-lg leading-relaxed italic opacity-80">
                        The system automatically adjusts your watering schedule when it detects a rainy day in your city.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
