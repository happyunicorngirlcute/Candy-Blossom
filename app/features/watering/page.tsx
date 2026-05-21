"use client"

import { motion } from "framer-motion"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "@/components/ThemeProvider"

const WaterScene = dynamic(() => import("@/components/scenes/WaterScene"), { ssr: false })

export default function WateringPage() {
    const { dark } = useTheme()
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
                    className="w-56 h-56 shrink-0"
                >
                    <Suspense fallback={<div className="w-full h-full" />}>
                        <WaterScene dark={!!dark} />
                    </Suspense>
                </motion.div>
            </div>
        </div>
    )
}
