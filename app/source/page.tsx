"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"

export default function SourcePage() {
    const { dark } = useTheme()
    const githubUrl = "https://github.com/happyunicorngirlcute/Candy-Blossom"

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full text-center"
            >

                <p className="text-xl opacity-60 mb-8 leading-relaxed max-w-lg mx-auto">
                    Our entire frontend codebase is open-source.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-5 py-2.5 rounded-full font-semibold text-sm transition-colors duration-300"
                        style={{
                            background: dark ? "#fff" : "#F2B5CE",
                            color: dark ? "#000" : "#fff",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = dark ? "#e4e4e7" : "#e0a1b9"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = dark ? "#fff" : "#F2B5CE"
                        }}
                    >
                        <span className="flex items-center gap-2">
                            View on GitHub
                            <svg 
                                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </a>
                </div>
            </motion.div>
        </div>
    )
}
