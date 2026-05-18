"use client"

import { motion } from "framer-motion"

export default function ApplicationPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <motion.h1 
                    className="text-4xl font-semibold  mb-8  from-[var(--text)] to-[var(--muted)]"
                >
                    Work in progress
                </motion.h1>
            </motion.div>
        </div>
    )
}
