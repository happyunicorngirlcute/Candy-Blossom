"use client"

import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger animation for children
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function Login() {
    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors"
        >
            <section className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-4xl text-center space-y-6">

                    <motion.h1 variants={itemVariants} className="text-3xl font-thin leading-tight">
                        Log in to Candy Blossom
                    </motion.h1>

                    <form className="mt-6 space-y-4 w-full max-w-md mx-auto">
                        <div>
                            <label className="block text-start text-sm font-medium mb-2 text-[var(--muted)]">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-shadow transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] no-placeholder"
                            />
                        </div>

                        <div>
                            <label className="block text-start text-sm font-medium mb-2 text-[var(--muted)]">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] shadow-sm transition-shadow transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] no-placeholder"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full mt-2 cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md bg-[var(--accent)] text-white font-semibold hover:opacity-90 btn-animate"
                            >
                                Enter my home
                            </button>
                        </div>
                    </form>



                    {/* <motion.p variants={itemVariants} className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            We provide care instructions for your plants based on their species, current health status, weather, when to water, and much more! Just upload a photo of your plant, and we'll take care of the rest!
          </motion.p> */}

                </div>
            </section>
        </motion.main >
    )
}