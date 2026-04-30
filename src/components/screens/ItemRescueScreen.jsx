'use client'

import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { ITEMS_DATA } from '../../data/items'

export default function ItemRescueScreen() {
  const { state, dispatch } = useGame()
  const rescueData = state.itemRescue

  if (!rescueData) return null

  const item = ITEMS_DATA[rescueData.itemId]
  const reason = state.gameOverReason || 'Nguy nan cận kề...'

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden bg-tran-bg flex flex-col justify-center items-center px-6 max-w-sm mx-auto relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Intense glow background */}
      <motion.div
        className="absolute inset-0 bg-yellow-900/10"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="z-10 w-full bg-tran-card border-2 border-[#D4A017]/40 p-6 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        {/* Decorative rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#D4A017]/20 blur-3xl rounded-full" />

        <motion.p
          className="text-6xl mb-4 relative z-10"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
        >
          {item?.icon || '📜'}
        </motion.p>
        
        <h2 className="text-xl font-bold text-[#F5E6D0] font-serif mb-2 relative z-10">
          Cơ Hội Vãn Hồi
        </h2>
        <p className="text-tran-textMuted text-sm mb-6 leading-relaxed relative z-10">
          <span className="text-red-400 font-semibold">{reason}</span><br/><br/>
          Tuy nhiên, bạn đang sở hữu <strong className="text-[#D4A017]">{item?.name}</strong>. Có muốn sử dụng bảo vật này để lật ngược thế cờ?
        </p>

        <div className="space-y-3 relative z-10">
          <button
            onClick={() => dispatch({ type: 'ITEM_RESCUE_COMPLETE' })}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
          >
            Sử dụng {item?.name}
          </button>
          <button
            onClick={() => dispatch({ type: 'ITEM_RESCUE_SKIP' })}
            className="w-full py-3 rounded-xl border border-tran-border/50 text-tran-textMuted text-sm font-medium active:opacity-60"
          >
            Bỏ qua (Cất giữ đồ)
          </button>
        </div>
      </div>
    </motion.div>
  )
}
