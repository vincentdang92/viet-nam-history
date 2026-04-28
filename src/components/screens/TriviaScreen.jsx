'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

const TIME_LIMIT = 10

export default function TriviaScreen() {
  const { state, dispatch } = useGame()
  const { triviaData } = state
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    if (isAnswered) return
    if (timeLeft <= 0) {
      handleTimeout()
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isAnswered])

  const handleTimeout = () => {
    setIsAnswered(true)
    setTimeout(() => {
      dispatch({ type: 'TRIVIA_COMPLETE', isCorrect: false })
    }, 2000)
  }

  const handleSelect = (idx) => {
    if (isAnswered) return
    setIsAnswered(true)
    setSelectedIdx(idx)

    setTimeout(() => {
      dispatch({ type: 'TRIVIA_COMPLETE', isCorrect: idx === triviaData.correctIndex })
    }, 2500)
  }

  if (!triviaData) return null

  return (
    <motion.div
      className="min-h-screen bg-tran-bg flex flex-col justify-center items-center px-4 max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full bg-tran-card border border-tran-border p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-tran-textMuted font-bold">Kỳ Thi</p>
            <h2 className="text-xl font-bold text-tran-secondary font-serif">Khoa Cử</h2>
          </div>
          
          {/* Timer */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="rgba(164,124,105,0.2)" strokeWidth="4" fill="none" />
              <motion.circle
                cx="24" cy="24" r="20"
                stroke={timeLeft > 3 ? '#A47C69' : '#ef4444'}
                strokeWidth="4" fill="none"
                strokeDasharray="125.6"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 125.6 * (1 - timeLeft / TIME_LIMIT) }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </svg>
            <span className={`text-sm font-bold ${timeLeft > 3 ? 'text-tran-text' : 'text-red-500'}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        <p className="text-tran-text text-lg font-medium mb-6 leading-relaxed">
          {triviaData.question}
        </p>

        <div className="space-y-3 mb-6">
          {triviaData.options.map((opt, idx) => {
            let btnClass = "border-tran-border text-tran-text hover:border-tran-secondary/50 bg-tran-bg/50"
            if (isAnswered) {
              if (idx === triviaData.correctIndex) {
                btnClass = "border-green-600 bg-green-900/40 text-green-300"
              } else if (idx === selectedIdx) {
                btnClass = "border-red-600 bg-red-900/40 text-red-300"
              } else {
                btnClass = "border-tran-border/30 text-tran-textMuted/50 opacity-50"
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${btnClass}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-sm p-4 rounded-xl bg-tran-bg/50 border border-tran-border/50 text-tran-textMuted leading-relaxed"
          >
            {selectedIdx === triviaData.correctIndex ? '✅ Trạng Nguyên xuất thế!' : '❌ Bọn khoa bảng giá áo túi cơm...'}
            <hr className="my-2 border-tran-border/30" />
            {triviaData.explanation}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
