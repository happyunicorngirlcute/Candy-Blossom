"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface PlantDetailsModalProps {
  plant: any
  onClose: () => void
}

const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({ plant, onClose }) => {
  if (!plant) return null

  const renderSection = (title: string, content: any) => {
    if (content === null || content === undefined || (Array.isArray(content) && content.length === 0)) return null
    
    let displayContent = content
    if (Array.isArray(content)) {
      displayContent = content.join(', ')
    } else if (typeof content === 'object') {
      displayContent = JSON.stringify(content, null, 2)
    } else if (typeof content === 'boolean') {
      displayContent = content ? 'Yes' : 'No'
    }

    return (
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">{title}</h4>
        <p className="text-sm font-medium">{displayContent}</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0"
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[var(--surface)] w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-3xl shadow-2xl border border-[var(--border)] relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--surface)] transition-colors z-10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="relative h-48 sm:h-64 w-full">
          {plant.image ? (
            <img src={plant.image} alt={plant.common_name} className="w-full h-full object-cover" />
          ) : (
            <img 
              src="/favicon.ico" 
              alt={plant.common_name} 
              className="w-full h-full object-contain p-16 opacity-20 bg-[var(--bg)]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent" />
          <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 right-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">{plant.common_name}</h2>
            {plant.scientific_name && (
              <p className="text-base sm:text-lg italic opacity-60">{Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name}</p>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {plant.description && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-40 mb-2">Description</h4>
              <p className="text-sm leading-relaxed opacity-80">{plant.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <h3 className="text-sm font-bold border-b border-[var(--border)] pb-2 mb-4 text-[var(--accent)]">General Info</h3>
              {renderSection('Family', plant.family)}
              {renderSection('Type', plant.type)}
              {renderSection('Cycle', plant.cycle)}
              {renderSection('Origin', plant.origin)}
              {renderSection('Growth Rate', plant.growth_rate)}
              {renderSection('Maintenance', plant.maintenance)}
              {renderSection('Care Level', plant.care_level)}
            </div>

            <div>
              <h3 className="text-sm font-bold border-b border-[var(--border)] pb-2 mb-4 text-[var(--accent)]">Care Details</h3>
              {renderSection('Watering', plant.watering)}
              {renderSection('Sunlight', plant.sunlight)}
              {renderSection('Pruning Month', plant.pruning_month)}
              {renderSection('Soil', plant.soil)}
              {renderSection('Attracts', plant.attracts)}
              {renderSection('Propagation', plant.propagation)}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <h3 className="text-sm font-bold border-b border-[var(--border)] pb-2 mb-4 text-[var(--accent)]">Characteristics</h3>
              {renderSection('Flowers', plant.flowers)}
              {renderSection('Flowering Season', plant.flowering_season)}
              {renderSection('Fruits', plant.fruits)}
              {renderSection('Edible Fruit', plant.edible_fruit)}
              {renderSection('Leaf', plant.leaf)}
              {renderSection('Thorny', plant.thorny)}
            </div>

            <div>
              <h3 className="text-sm font-bold border-b border-[var(--border)] pb-2 mb-4 text-[var(--accent)]">Tolerances & Safety</h3>
              {renderSection('Drought Tolerant', plant.drought_tolerant)}
              {renderSection('Salt Tolerant', plant.salt_tolerant)}
              {renderSection('Invasive', plant.invasive)}
              {renderSection('Rare', plant.rare)}
              {renderSection('Poisonous to Humans', plant.poisonous_to_humans)}
              {renderSection('Poisonous to Pets', plant.poisonous_to_pets)}
            </div>
          </div>

          {plant.other_images && plant.other_images.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-40 mb-4">More Images</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {plant.other_images.map((img: any, idx: number) => (
                  <img key={idx} src={img.regular_url || img.thumbnail} className="w-full h-24 object-cover rounded-xl" alt={`${plant.common_name} ${idx}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PlantDetailsModal
