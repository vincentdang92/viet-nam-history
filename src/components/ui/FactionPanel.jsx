'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { FACTIONS, CHARACTER_NODES } from '../../constants/factionConfig'

export default function FactionPanel() {
  const { state, dispatch } = useGame()
  const { isFactionOpen, factionState } = state

  if (!isFactionOpen) return null

  // Group characters by their current effective faction.
  // E.g., if a royal becomes a traitor, they move to the 'enemy' faction visually.
  const groupedCharacters = {
    royal: [],
    military: [],
    enemy: []
  }

  Object.values(CHARACTER_NODES).forEach(char => {
    const status = factionState[char.id] || 'alive'
    
    // Determine effective faction based on status
    let effectiveFaction = char.faction
    if (status === 'traitor') {
      effectiveFaction = 'enemy'
    }

    groupedCharacters[effectiveFaction].push({ ...char, status })
  })

  const getStatusStyle = (status) => {
    switch (status) {
      case 'alive': return 'border-tran-secondary bg-tran-secondary/10 opacity-100'
      case 'dead': return 'border-gray-600 bg-gray-800/50 opacity-60 grayscale'
      case 'traitor': return 'border-red-600 bg-red-900/30 opacity-100 text-red-500'
      default: return 'border-tran-border opacity-100'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'dead': return 'Tuyệt Diệt'
      case 'traitor': return 'Phản Tặc'
      default: return ''
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-tran-bg/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-tran-border/30 bg-tran-card">
          <h2 className="text-xl font-bold text-tran-secondary">Mạng Lưới Phe Phái</h2>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_FACTION' })}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-tran-bg text-tran-text hover:text-white transition-colors border border-tran-border"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {Object.values(FACTIONS).map(faction => (
            <div key={faction.id}>
              <h3 className="text-sm font-bold text-tran-textMuted uppercase tracking-widest mb-4 border-b border-tran-border/30 pb-2">
                {faction.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {groupedCharacters[faction.id].map(char => {
                  const style = getStatusStyle(char.status)
                  const label = getStatusLabel(char.status)

                  return (
                    <motion.div 
                      key={char.id}
                      className={`relative p-3 rounded-xl border flex items-center gap-3 transition-colors ${style}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      layout
                    >
                      <div className="text-2xl shrink-0">{char.icon}</div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate text-tran-text">{char.name}</p>
                        <p className="text-[10px] text-tran-textMuted truncate">{char.role}</p>
                      </div>
                      
                      {label && (
                        <div className={`absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${char.status === 'traitor' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                          {label}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
