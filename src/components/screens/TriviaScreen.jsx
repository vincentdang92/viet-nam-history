'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

const TIME_LIMIT = 10

export default function TriviaScreen() {
  const { state, dispatch } = useGame()
  const { triviaData, currentYear } = state
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
      <div className="w-full bg-stone-900 border-2 border-amber-900/60 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4a017\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold mb-1">
              Khoa Thi Đình năm {currentYear}
            </p>
            <h2 className="text-2xl font-bold text-amber-500 font-serif">Tuyển Chọn Nhân Tài</h2>
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

        <div className="bg-stone-950/50 p-4 rounded-xl border border-amber-900/30 mb-6 relative z-10">
          <p className="text-stone-200 text-lg font-medium leading-relaxed">
            {triviaData.question}
          </p>
        </div>

        <div className="space-y-3 mb-6 relative z-10">
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
            className="text-sm p-4 rounded-xl bg-stone-950/80 border border-amber-900/50 text-stone-300 leading-relaxed relative z-10"
          >
            <div className="font-bold mb-2 flex items-center gap-2">
              {selectedIdx === triviaData.correctIndex ? (
                <><span className="text-xl">✅</span> <span className="text-green-400">Trạng Nguyên xuất thế! Khâm thử.</span></>
              ) : (
                <><span className="text-xl">❌</span> <span className="text-red-400">Bọn khoa bảng giá áo túi cơm...</span></>
              )}
            </div>
            <hr className="my-2 border-amber-900/30" />
            {triviaData.explanation}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
