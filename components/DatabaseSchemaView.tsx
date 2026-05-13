"use client"

import { motion } from "framer-motion"

const databaseSchema = [
  { field: "id", type: "UUID", description: "Unique identifier for the plant record." },
  { field: "name", type: "String", description: "The common name of the plant." },
  { field: "scientific_name", type: "String", description: "The binomial nomenclature." },
  { field: "light_requirement", type: "Enum<Light>", description: "Required light level (low, medium, high)." },
  { field: "water_interval_days", type: "Integer", description: "Recommended days between watering." },
  { field: "toxicity", type: "Boolean", description: "Is it toxic to animals?" },
  { field: "created_at", type: "Timestamp", description: "Record creation time." },
]

export default function DatabaseSchemaView() {
  return (
    <div className="font-mono text-sm w-full bg-[#0a0a0a] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#262626] bg-[#111111]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-[var(--text)] opacity-50">PlantModel.ts</span>
      </div>
      <div className="p-6">
        <div className="text-blue-400 mb-4">interface Plant &#123;</div>
        {databaseSchema.map((item, i) => (
          <motion.div 
            key={item.field}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="pl-6 group flex items-center gap-4 hover:bg-[#1a1a1a] p-1 rounded transition-colors"
          >
            <span className="text-purple-400 font-semibold">{item.field}</span>
            <span className="text-orange-400 text-xs px-1.5 py-0.5 bg-orange-950/20 rounded border border-orange-950">
              {item.type}
            </span>
            <span className="text-[var(--text)] opacity-40">// {item.description}</span>
          </motion.div>
        ))}
        <div className="text-blue-400 mt-2">&#125;</div>
      </div>
    </div>
  )
}
