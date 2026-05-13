"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  { id: "input", title: "User Input" },
  { id: "analyzing", title: "Image/Text Analysis" },
  { id: "mapping", title: "Schema Mapping" },
  { id: "insert", title: "Database Write" },
];

export default function PlantEngineSimulator() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const simulate = () => {
    setStage("analyzing");
    setData(null);
    setTimeout(() => {
      setStage("mapping");
      setTimeout(() => {
        setStage("insert");
        setTimeout(() => {
          setData({
            id: crypto.randomUUID().slice(0, 8),
            name: query,
            scientific_name: "Monstera Deliciosa",
            status: "Success",
          });
          setStage(null);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="w-full space-y-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a plant name (e.g. Monstera)..."
          className="w-full bg-[#111111] border border-[#333] p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
        />
        <button
          onClick={simulate}
          className="absolute right-2 top-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500"
        >
          Process
        </button>
      </div>

      <div className="flex gap-4">
        {STAGES.map((s, i) => (
          <div key={s.id} className={`flex-1 h-2 rounded-full ${stage === s.id ? 'bg-blue-500' : 'bg-[#222]'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#0a0a0a] border border-[#262626] rounded-xl font-mono text-sm"
          >
            <div className="text-green-500 mb-2">INSERT INTO plants (name, scientific_name) VALUES (...);</div>
            <pre className="text-blue-300">
              {JSON.stringify(data, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
