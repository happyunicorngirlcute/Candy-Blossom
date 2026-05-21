"use client"

import { motion } from "framer-motion"

export default function UploadingPage() {
    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 leading-[1.15]">
                        Plant Identification
                        <br />
                        <span className="text-emerald-500">Snap. Identify. Learn.</span>
                    </h1>
                    <p className="text-[var(--muted)] text-base leading-relaxed max-w-md">
                        Upload a photo of any plant and instantly identify it. Get detailed care information, watering schedules, and sunlight requirements.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-56 h-56 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/10 flex items-center justify-center"
                >
                    <svg className="w-20 h-20 text-emerald-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </motion.div>
            </div>
        </div>
    )
}
