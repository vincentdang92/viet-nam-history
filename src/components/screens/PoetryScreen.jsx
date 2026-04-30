'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'

export default function PoetryScreen() {
  const { state, dispatch } = useGame()
  const { poetryState } = state
  const { data, pendingChoiceId } = poetryState

  const [selectedWord, setSelectedWord] = useState(null)
  const [result, setResult] = useState(null) // 'success' | 'fail'

  if (!data) return null

  const handleSelect = (word) => {
    if (result) return
    setSelectedWord(word)
    
    const isCorrect = word === data.correctWord
    setResult(isCorrect ? 'success' : 'fail')

    setTimeout(() => {
      dispatch({ type: 'POETRY_COMPLETE', isSuccess: isCorrect, pendingChoiceId })
    }, 3000)
  }

  // Split passage by [BLANK] to render the fill-in-the-blank text
  const parts = data.passage.split('[BLANK]')

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center bg-[#1A0F0A] p-4 relative overflow-hidden font-serif"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background styling for parchment */}
      <div className="absolute inset-0 bg-[#E8DCC4] opacity-10 pointer-events-none" style={{ mixBlendMode: 'overlay' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1A0F0A_100%)] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md bg-[#2A1F1A]/80 backdrop-blur-sm p-6 rounded-sm border-2 border-[#D4AF37]/30 shadow-2xl relative">
        {/* Corner Ornaments */}
        <div className="absolute top-2 left-2 text-[#D4AF37]/50 text-xl">✥</div>
        <div className="absolute top-2 right-2 text-[#D4AF37]/50 text-xl">✥</div>
        <div className="absolute bottom-2 left-2 text-[#D4AF37]/50 text-xl">✥</div>
        <div className="absolute bottom-2 right-2 text-[#D4AF37]/50 text-xl">✥</div>

        <motion.h2 
          className="text-2xl font-bold text-[#D4AF37] text-center mb-6 border-b border-[#D4AF37]/20 pb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {data.title || "Điền Khuyết Hùng Văn"}
        </motion.h2>

        <div className="text-[#E8DCC4] text-lg leading-loose mb-10 text-justify relative px-2">
          {parts[0]}
          <span 
            className={`inline-block mx-2 px-4 py-1 min-w-[100px] text-center font-bold border-b-2 transition-colors duration-500
              ${!selectedWord ? 'border-[#D4AF37] text-transparent' : 
                result === 'success' ? 'border-[#27AE60] text-[#27AE60]' : 'border-[#C0392B] text-[#C0392B]'}`}
          >
            {selectedWord || "..."}
          </span>
          {parts[1]}
        </div>

        {!result ? (
          <div className="grid grid-cols-2 gap-3">
            {data.options.map((option, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelect(option)}
                className="py-3 px-4 rounded border border-[#D4AF37]/40 bg-[#1A0F0A]/50 text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all font-medium text-lg"
              >
                {option}
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded border text-center ${result === 'success' ? 'bg-[#27AE60]/20 border-[#27AE60]/50' : 'bg-[#C0392B]/20 border-[#C0392B]/50'}`}
          >
            <h3 className={`text-xl font-bold mb-2 ${result === 'success' ? 'text-[#27AE60]' : 'text-[#C0392B]'}`}>
              {result === 'success' ? 'Chính Xác!' : 'Sai Lầm!'}
            </h3>
            <p className="text-[#E8DCC4] text-sm">
              {result === 'success' ? 'Lời hịch đã khắc sâu vào tâm trí ba quân tướng sĩ!' : 'Sĩ khí giảm sút do lời truyền bị sai lệch...'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
