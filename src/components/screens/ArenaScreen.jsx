'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'
import { TRIVIA_DATA } from '../../data/trivia'
import { submitArenaScore } from '../../lib/firestore'
import { ARENA_BOTS } from '../../constants/gameConfig'

const TIME_LIMIT = 10

export default function ArenaScreen() {
  const { state, dispatch } = useGame()
  const { user, playerName } = useAuth()
  
  const [currentQ, setCurrentQ] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Ghost Recording State
  const [ghostQuestions, setGhostQuestions] = useState([])
  const [ghostActions, setGhostActions] = useState([])
  const [questionStartTime, setQuestionStartTime] = useState(null)

  // Hàm chọn câu hỏi ngẫu nhiên (chỉ chọn từ Kỷ Trần - arc 1 đến 5)
  const pickNextQuestion = useCallback(() => {
    const eligible = TRIVIA_DATA.filter(t => t.arcs.some(a => a >= 1 && a <= 5))
    const randomIdx = Math.floor(Math.random() * eligible.length)
    const q = eligible[randomIdx]
    setCurrentQ(q)
    
    // Ghost Recording
    setGhostQuestions(prev => [...prev, q.id])
    setQuestionStartTime(performance.now())
    
    setTimeLeft(TIME_LIMIT)
    setIsAnswered(false)
    setSelectedIdx(null)
  }, [])

  // Khởi tạo câu đầu tiên
  useEffect(() => {
    if (!currentQ && !isGameOver) pickNextQuestion()
  }, [currentQ, isGameOver, pickNextQuestion])

  // Đếm ngược thời gian
  useEffect(() => {
    if (isAnswered || isGameOver || !currentQ) return
    if (timeLeft <= 0) {
      handleAnswer(null, true)
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isAnswered, isGameOver, currentQ]) // eslint-disable-line

  const handleAnswer = (idx, isTimeout = false) => {
    if (isAnswered) return
    setIsAnswered(true)
    setSelectedIdx(idx)

    const isCorrect = !isTimeout && idx === currentQ.correctIndex
    
    // Record action for ghost
    const delayMs = questionStartTime ? Math.floor(performance.now() - questionStartTime) : TIME_LIMIT * 1000
    setGhostActions(prev => [...prev, { delayMs: Math.min(delayMs, TIME_LIMIT * 1000), isCorrect }])

    let newLives = state.arenaLives
    let newScore = state.arenaScore
    let newCombo = state.arenaCombo

    if (isCorrect) {
      const comboMultiplier = 1 + (state.arenaCombo * 0.1)
      newScore += Math.floor(100 * comboMultiplier)
      newCombo += 1
    } else {
      newLives -= 1
      newCombo = 0
    }

    dispatch({
      type: 'UPDATE_ARENA_STATE',
      payload: { arenaScore: newScore, arenaLives: newLives, arenaCombo: newCombo }
    })

    setTimeout(() => {
      if (newLives <= 0) {
        setIsGameOver(true)
      } else {
        pickNextQuestion()
      }
    }, 3000)
  }

  const handleQuit = () => {
    dispatch({ type: 'QUIT_ARENA' })
  }

  const handleSubmitScore = async () => {
    if (!user || isSubmitting || hasSubmitted) return
    setIsSubmitting(true)
    
    const ghostData = {
      questions: ghostQuestions,
      actions: ghostActions
    }
    
    await submitArenaScore(user.uid, playerName, state.arenaScore, ghostData)
    setIsSubmitting(false)
    setHasSubmitted(true)
  }

  if (!currentQ && !isGameOver) {
    return (
      <motion.div
        className="h-[100dvh] overflow-hidden bg-stone-950 flex flex-col justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </motion.div>
    )
  }

  if (isGameOver) {
    return (
      <motion.div
        className="h-[100dvh] overflow-hidden bg-stone-950 flex flex-col justify-center items-center px-4 max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-full bg-stone-900 border border-red-900 p-6 rounded-2xl text-center shadow-2xl shadow-red-900/20">
          <h2 className="text-3xl font-serif font-bold text-red-500 mb-2">Thất Bại</h2>
          <p className="text-stone-400 text-sm mb-6">Bạn đã hết sạch sinh lực trong Lôi Đài.</p>
          
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 mb-6">
            <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-1">Tổng Điểm Kỷ Lục</p>
            <p className="text-4xl font-bold text-amber-500 font-mono">{state.arenaScore}</p>
          </div>

          <div className="space-y-3">
            {user && state.arenaScore > 0 && !hasSubmitted ? (
              <button
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors"
              >
                {isSubmitting ? 'Đang gửi...' : 'Ghi danh Bảng Vàng'}
              </button>
            ) : hasSubmitted ? (
              <p className="text-green-500 font-bold text-sm py-2">✓ Đã ghi danh thành công</p>
            ) : null}
            
            <button
              onClick={handleQuit}
              className="w-full py-3 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const nextTarget = [...ARENA_BOTS].reverse().find(bot => bot.score > state.arenaScore)

  return (
    <motion.div
      className="h-[100dvh] bg-stone-950 flex flex-col items-center px-4 max-w-sm mx-auto relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      {/* Background Arena Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20L0 0v40l20-20z\' fill=\'%23ef4444\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-stone-950/80 pointer-events-none" />

      {/* Header Info */}
      <div className="w-full flex items-center justify-between py-6 relative z-10">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.span 
              key={i} 
              className={`text-xl transition-all duration-300 ${i < state.arenaLives ? '' : 'opacity-30 grayscale'}`}
              animate={i < state.arenaLives ? { scale: [1, 1.2, 1] } : { scale: 0.8 }}
              transition={{ repeat: i < state.arenaLives ? Infinity : 0, duration: 2, delay: i * 0.2 }}
            >
              ❤️
            </motion.span>
          ))}
        </div>

        <div className="text-right">
          <p className="text-amber-500 font-mono font-bold text-2xl">{state.arenaScore}</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Điểm</span>
            {state.arenaCombo > 1 && (
              <span className="text-[10px] bg-red-900/50 text-red-200 px-1.5 rounded font-bold">
                Combo x{state.arenaCombo}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Target Banner */}
      {nextTarget && (
        <motion.div 
          className="w-full bg-stone-900/80 border border-stone-800 rounded-lg p-2 mb-4 relative z-10 flex items-center justify-between"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          key={nextTarget.id}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Mục tiêu vượt qua</p>
              <p className="text-sm font-bold text-stone-200">{nextTarget.playerName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-amber-500 font-bold text-sm">{nextTarget.score}</p>
            <p className="text-[10px] text-stone-500">điểm</p>
          </div>
        </motion.div>
      )}

      <div className="w-full flex-1 flex flex-col justify-center relative z-10 overflow-y-auto hide-scrollbar">
        {/* Timer Bar */}
        <div className="w-full h-1.5 bg-stone-900 rounded-full mb-6 overflow-hidden">
          <motion.div 
            className={`h-full ${timeLeft > 3 ? 'bg-amber-500' : 'bg-red-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>

        <div className="bg-stone-900/80 p-5 rounded-2xl border border-red-900/30 mb-8 backdrop-blur-sm shadow-xl shadow-red-900/10">
          <p className="text-stone-200 text-lg font-medium leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "border-stone-800 text-stone-300 hover:border-amber-700/50 hover:bg-stone-900"
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnClass = "border-green-600 bg-green-900/40 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
              } else if (idx === selectedIdx) {
                btnClass = "border-red-600 bg-red-900/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              } else {
                btnClass = "border-stone-800/30 text-stone-600 opacity-50"
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${btnClass}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Explanation Popup */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 leading-relaxed"
            >
              <div className="font-bold mb-2 flex items-center gap-2">
                {selectedIdx === currentQ.correctIndex ? (
                  <><span className="text-xl">✅</span> <span className="text-green-400">Chính xác! (+{Math.floor(100 * (1 + state.arenaCombo * 0.1))}đ)</span></>
                ) : (
                  <><span className="text-xl">❌</span> <span className="text-red-400">Sai rồi! (-1 Mạng)</span></>
                )}
              </div>
              <hr className="my-2 border-stone-800" />
              {currentQ.explanation}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full pb-8 pt-4 relative z-10 flex justify-center">
        <button 
          onClick={handleQuit}
          disabled={isAnswered && !isGameOver}
          className="text-stone-500 hover:text-stone-300 text-xs tracking-widest uppercase disabled:opacity-30"
        >
          Rời Lôi Đài
        </button>
      </div>
    </motion.div>
  )
}
