"use client"

import { motion } from "framer-motion"

export default function ApplicationPage() {
    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 leading-[1.15]">
                        Mobile & Web App
                        <br />
                        <span className="text-purple-500">Your garden, everywhere</span>
                    </h1>
                    <p className="text-[var(--muted)] text-base leading-relaxed max-w-md">
                        Access Candy Blossom from any device. Our web app and mobile application sync seamlessly so you can care for your plants wherever you are.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-56 h-56 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/10 flex items-center justify-center"
                >
                    <svg className="w-20 h-20 text-purple-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                </motion.div>
            </div>
        </div>
    )
}
