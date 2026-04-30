'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'

export default function EspionageScreen() {
  const { state, dispatch } = useGame()
  const { espionageState } = state
  const data = espionageState?.data
  
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [result, setResult] = useState(null) // 'success' | 'fail'

  if (!data) return null

  const handleSelect = (idx) => {
    if (result) return // already selected
    setSelectedIdx(idx)
    
    const isLie = data.statements[idx].isLie
    setResult(isLie ? 'success' : 'fail')
    
    // Auto proceed after 4 seconds
    setTimeout(() => {
      dispatch({ type: 'ESPIONAGE_COMPLETE', isSuccess: isLie })
    }, 4000)
  }

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden flex flex-col bg-tran-bg px-4 py-8 max-w-sm mx-auto justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🕵️‍♂️</div>
        <h2 className="text-2xl font-bold text-tran-secondary mb-2">Hỏi Cung Tù Binh</h2>
        <p className="text-tran-textMuted text-sm leading-relaxed">
          Tên tù binh khai ra 3 điều, nhưng theo mật báo, <span className="text-red-400 font-bold">chắc chắn có 1 lời nói dối</span>. Hãy dùng hiểu biết lịch sử của bạn để chỉ ra câu nói dối đó!
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {data.statements.map((stmt, idx) => {
          const isSelected = selectedIdx === idx
          let btnClass = "border-tran-border bg-tran-card opacity-90 hover:opacity-100"
          
          if (result) {
            if (isSelected) {
              btnClass = stmt.isLie 
                ? "border-green-500 bg-green-900/30 text-green-100" // correct choice
                : "border-red-500 bg-red-900/30 text-red-100" // wrong choice
            } else if (stmt.isLie) {
              btnClass = "border-green-500 bg-green-900/10 text-green-300 border-dashed" // show the right answer
            } else {
              btnClass = "border-tran-border bg-tran-card opacity-50"
            }
          }

          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={!!result}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${btnClass}`}
              whileTap={!result ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{result && stmt.isLie ? '✅' : result && isSelected ? '❌' : '💬'}</span>
                <p className="text-sm font-medium leading-relaxed">{stmt.text}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border ${result === 'success' ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}
          >
            <h3 className={`font-bold text-lg mb-2 ${result === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {result === 'success' ? 'Chính Xác!' : 'Sai Lầm!'}
            </h3>
            <p className="text-sm text-tran-text leading-relaxed">
              {data.statements.find(s => s.isLie).fact || (result === 'success' ? 'Ngài đã nhìn thấu sự dối trá của kẻ thù!' : 'Ngài đã bị quân giặc qua mặt.')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
