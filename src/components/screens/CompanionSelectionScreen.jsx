'use client'

import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { COMPANIONS_DATA } from '../../data/companions'
import { useState } from 'react'

export default function CompanionSelectionScreen() {
  const { state, dispatch } = useGame()
  const { unlockedCompanions, currentEvent } = state
  const [selectedId, setSelectedId] = useState(null)

  const handleSelect = (id) => {
    setSelectedId(id)
  }

  const handleConfirm = () => {
    if (selectedId) {
      dispatch({ type: 'SELECT_COMPANION', companionId: selectedId })
    }
  }

  const handleSkip = () => {
    dispatch({ type: 'START_COMBAT_WITHOUT_COMPANION' })
  }

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden flex flex-col bg-tran-bg px-4 py-6 w-full max-w-md mx-auto justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-tran-secondary mb-1">Chuẩn Bị Giao Tranh</h2>
        <p className="text-tran-textMuted text-sm">Trận chiến: <span className="font-semibold text-red-400">{currentEvent?.enemyName || 'Quân Địch'}</span></p>
        <p className="text-xs text-tran-textMuted mt-2 italic">Hãy chọn một danh tướng xuất trận cùng bạn!</p>
      </div>

      <div className="space-y-3 mb-8 max-h-[60vh] overflow-y-auto hide-scrollbar">
        {unlockedCompanions.map(id => {
          const comp = COMPANIONS_DATA[id]
          if (!comp) return null
          
          const isSelected = selectedId === id

          return (
            <motion.div
              key={id}
              onClick={() => handleSelect(id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4
                ${isSelected 
                  ? 'border-tran-secondary bg-tran-secondary/10 shadow-[0_0_15px_rgba(202,138,4,0.15)]' 
                  : 'border-tran-border bg-tran-card opacity-80 hover:opacity-100'}
              `}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl filter drop-shadow-md shrink-0">{comp.avatar}</div>
              <div>
                <p className="text-[10px] text-tran-secondary font-bold uppercase tracking-widest mb-0.5">{comp.title}</p>
                <p className="font-bold text-tran-text text-base leading-none mb-1.5">{comp.name}</p>
                <p className="text-xs text-tran-textMuted leading-snug">
                  <span className="text-yellow-500 font-semibold">{comp.skillName}:</span> {comp.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-auto space-y-3">
        <button
          onClick={handleConfirm}
          disabled={!selectedId}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all
            ${selectedId 
              ? 'bg-tran-secondary text-tran-bg shadow-lg active:scale-95' 
              : 'bg-tran-border/50 text-tran-textMuted cursor-not-allowed'}
          `}
        >
          Xuất Trận!
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-3 rounded-xl border border-tran-border text-tran-textMuted text-sm font-semibold hover:bg-tran-card active:scale-95 transition-all"
        >
          Tự mình nghênh chiến
        </button>
      </div>
    </motion.div>
  )
}
