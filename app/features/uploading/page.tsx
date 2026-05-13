"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABLES = [
  {
    name: "plants",
    fields: [
      { name: "id", type: "UUID", desc: "Primary Key" },
      { name: "common_name", type: "VARCHAR", desc: "Human readable name" },
      { name: "scientific_name", type: "VARCHAR", desc: "Full species name" },
      { name: "light_requirement", type: "ENUM", desc: "LOW|MED|HIGH" },
      { name: "water_interval", type: "INT", desc: "Days between watering" },
    ]
  },
  {
    name: "growth_metrics",
    fields: [
      { name: "plant_id", type: "UUID", desc: "FK to plants" },
      { name: "height_cm", type: "FLOAT", desc: "Measured in cm" },
      { name: "timestamp", type: "TIMESTAMP", desc: "Measurement date" },
    ]
  }
];

export default function DatabaseConsole() {
  const [input, setInput] = useState("");
  const [inserting, setInserting] = useState(false);

  const handleInsert = () => {
    setInserting(true);
    setTimeout(() => setInserting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#ededed] p-12 selection:bg-blue-500/30">
      {/* Header Area */}
      <header className="flex justify-between items-center mb-20 border-b border-[#1a1a1a] pb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Database Core</h1>
          <p className="text-sm text-[#666] mt-2">Architecture Schema View</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new entry..."
            className="bg-[#0e0e0e] border border-[#222] px-3 py-1.5 rounded text-xs outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={handleInsert}
            className="bg-white text-black text-xs font-semibold px-4 py-1.5 rounded hover:bg-gray-200 transition-all"
          >
            INSERT
          </button>
        </div>
      </header>

      {/* Massive Schema Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {TABLES.map((table) => (
          <motion.div 
            key={table.name}
            className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-[#0e0e0e] px-6 py-4 border-b border-[#1a1a1a] flex justify-between items-center">
              <h2 className="font-mono text-lg text-blue-400 uppercase tracking-widest">{table.name}</h2>
              <span className="text-[10px] text-[#444] uppercase font-bold tracking-widest">PostgreSQL</span>
            </div>
            
            <div className="p-8 space-y-6">
              {table.fields.map((field) => (
                <div key={field.name} className="flex justify-between items-center py-2 border-b border-[#111]">
                  <div className="font-mono text-base">{field.name}</div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-[#555] italic">{field.desc}</span>
                    <span className="text-xs font-bold text-orange-500/80 uppercase w-20 text-right">{field.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insertion Visualizer */}
      <AnimatePresence>
        {inserting && (
          <motion.div 
            className="fixed bottom-12 right-12 bg-white text-black p-6 rounded-lg shadow-2xl font-mono text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            Executing: INSERT INTO plants ...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
