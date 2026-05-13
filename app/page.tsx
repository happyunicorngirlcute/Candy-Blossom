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

export default function Home() {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors"
    >
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl text-center space-y-6">

          <motion.h1 variants={itemVariants} className="text-5xl font-semibold leading-tight">
            Candy Blossom will take care of your plants from now on
          </motion.h1>

          <motion.p variants={itemVariants} className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            We provide care instructions for your plants based on their species, current health status, weather, when to water, and much more! Just upload a photo of your plant, and we'll take care of the rest!
          </motion.p>

      </div>
    </section>
    </motion.main >
  )
}