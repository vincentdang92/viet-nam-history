'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { TRIVIA_DATA } from '../../data/trivia'
import { addContributionScore } from '../../lib/firestore'
import { useAuth } from '../../context/AuthContext'

const TIME_LIMIT = 10

export default function DuelScreen() {
  const { state, dispatch } = useGame()
  const { user, playerName } = useAuth()
  
  const ghostData = state.duelGhost
  const duelTarget = state.duelTarget

  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  
  const [playerScore, setPlayerScore] = useState(0)
  const [playerLives, setPlayerLives] = useState(3)
  const [playerCombo, setPlayerCombo] = useState(0)
  const [playerAnswerIdx, setPlayerAnswerIdx] = useState(null)
  
  const [ghostScore, setGhostScore] = useState(0)
  const [ghostLives, setGhostLives] = useState(3)
  const [ghostCombo, setGhostCombo] = useState(0)
  const [isGhostAnswered, setIsGhostAnswered] = useState(false)
  const [ghostIsCorrect, setGhostIsCorrect] = useState(false)

  const [isGameOver, setIsGameOver] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [hasClaimedReward, setHasClaimedReward] = useState(false)

  const currentQId = ghostData?.questions?.[currentQIdx]
  const currentQ = TRIVIA_DATA.find(q => q.id === currentQId)
  const ghostAction = ghostData?.actions?.[currentQIdx]

  // Count down
  useEffect(() => {
    if (showExplanation || isGameOver || !currentQ) return
    if (timeLeft <= 0) {
      if (playerAnswerIdx === null) handlePlayerAnswer(null, true)
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, showExplanation, isGameOver, currentQ, playerAnswerIdx]) // eslint-disable-line

  // Ghost Answer logic
  useEffect(() => {
    if (showExplanation || isGameOver || !currentQ || isGhostAnswered || !ghostAction) return
    
    // Elapsed time roughly calculated from timeLeft
    const elapsedMs = (TIME_LIMIT - timeLeft) * 1000
    if (elapsedMs >= ghostAction.delayMs) {
      setIsGhostAnswered(true)
      setGhostIsCorrect(ghostAction.isCorrect)
      
      let newGLives = ghostLives
      let newGScore = ghostScore
      let newGCombo = ghostCombo

      if (ghostAction.isCorrect) {
        newGScore += Math.floor(100 * (1 + ghostCombo * 0.1))
        newGCombo += 1
      } else {
        newGLives -= 1
        newGCombo = 0
      }
      
      setGhostLives(newGLives)
      setGhostScore(newGScore)
      setGhostCombo(newGCombo)
    }
  }, [timeLeft, isGhostAnswered, ghostAction, showExplanation, isGameOver, currentQ, ghostCombo, ghostLives, ghostScore])

  // Resolve Round when both answered
  useEffect(() => {
    if (!showExplanation && playerAnswerIdx !== null && isGhostAnswered) {
      setShowExplanation(true)
      
      setTimeout(() => {
        if (playerLives <= 0 || ghostLives <= 0 || currentQIdx >= ghostData.questions.length - 1) {
          setIsGameOver(true)
        } else {
          setCurrentQIdx(prev => prev + 1)
          setTimeLeft(TIME_LIMIT)
          setPlayerAnswerIdx(null)
          setIsGhostAnswered(false)
          setShowExplanation(false)
        }
      }, 4000)
    }
  }, [playerAnswerIdx, isGhostAnswered, showExplanation, playerLives, ghostLives, currentQIdx, ghostData])

  const handlePlayerAnswer = (idx, isTimeout = false) => {
    if (playerAnswerIdx !== null) return
    setPlayerAnswerIdx(isTimeout ? -1 : idx)

    const isCorrect = !isTimeout && idx === currentQ?.correctIndex

    let newLives = playerLives
    let newScore = playerScore
    let newCombo = playerCombo

    if (isCorrect) {
      newScore += Math.floor(100 * (1 + playerCombo * 0.1))
      newCombo += 1
    } else {
      newLives -= 1
      newCombo = 0
    }

    setPlayerLives(newLives)
    setPlayerScore(newScore)
    setPlayerCombo(newCombo)
  }

  const handleQuit = () => {
    dispatch({ type: 'QUIT_DUEL' })
  }

  if (!ghostData || !currentQId) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center">
        <p className="text-red-500">Dữ liệu Bóng Ma bị lỗi!</p>
        <button onClick={handleQuit} className="mt-4 text-stone-400">Quay về</button>
      </div>
    )
  }

  if (isGameOver) {
    const playerWon = playerScore > ghostScore
    
    // Claim reward once
    if (playerWon && user && !hasClaimedReward) {
      setHasClaimedReward(true)
      addContributionScore(user.uid, playerName, 10)
    }

    return (
      <motion.div
        className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full bg-stone-900 border border-stone-800 p-6 rounded-2xl text-center shadow-2xl">
          <h2 className={`text-3xl font-serif font-bold mb-2 ${playerWon ? 'text-amber-500' : 'text-red-500'}`}>
            {playerWon ? 'Chiến Thắng!' : 'Thất Bại'}
          </h2>
          <p className="text-stone-400 text-sm mb-6">
            {playerWon ? `Bạn đã đánh bại Bóng Ma của ${duelTarget?.playerName}` : `Bạn đã gục ngã trước ${duelTarget?.playerName}`}
          </p>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-1">Bạn</p>
              <p className={`text-2xl font-bold font-mono ${playerWon ? 'text-amber-500' : 'text-stone-400'}`}>{playerScore}</p>
            </div>
            <div className="flex-1 bg-stone-950 p-4 rounded-xl border border-stone-800 opacity-80">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-1">{duelTarget?.playerName}</p>
              <p className={`text-2xl font-bold font-mono ${!playerWon ? 'text-amber-500' : 'text-stone-400'}`}>{ghostScore}</p>
            </div>
          </div>

          <div className="space-y-3">
            {playerWon && (
              <p className="text-green-500 font-bold text-sm mb-4">✨ Chúc mừng! Bạn nhận được +10 Điểm Cống Hiến</p>
            )}
            <button
              onClick={handleQuit}
              className="w-full py-3 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 transition-colors"
            >
              Rời khỏi Lôi Đài
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-stone-950 flex flex-col px-4 max-w-sm mx-auto relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20L0 0v40l20-20z\' fill=\'%23ef4444\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />

      {/* Duel Header (Ghost vs Player) */}
      <div className="w-full py-4 relative z-10 flex gap-4 mt-safe">
        {/* Player Side */}
        <div className="flex-1 bg-stone-900 border border-amber-900/50 rounded-xl p-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <p className="text-[10px] text-amber-500 uppercase font-bold mb-1">Bạn</p>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-xs ${i < playerLives ? '' : 'opacity-30 grayscale'}`}>❤️</span>
            ))}
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono">{playerScore}</p>
        </div>

        {/* VS */}
        <div className="flex items-center justify-center font-black italic text-stone-800 text-2xl">
          VS
        </div>

        {/* Ghost Side */}
        <div className="flex-1 bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-right">
          <p className="text-[10px] text-stone-500 uppercase font-bold mb-1 truncate">{duelTarget?.playerName}</p>
          <div className="flex items-center justify-end gap-1 mb-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-xs ${i < ghostLives ? '' : 'opacity-30 grayscale'}`}>🖤</span>
            ))}
          </div>
          <p className="text-xl font-bold text-stone-400 font-mono">{ghostScore}</p>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center relative z-10">
        {/* Timer Bar */}
        <div className="w-full h-1.5 bg-stone-900 rounded-full mb-6 overflow-hidden">
          <motion.div 
            className={`h-full ${timeLeft > 3 ? 'bg-amber-500' : 'bg-red-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>

        {/* Ghost Status Indicator */}
        <div className="h-6 mb-2 flex items-center justify-center">
          {isGhostAnswered && !showExplanation && (
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold text-stone-400 bg-stone-900 px-3 py-1 rounded-full border border-stone-800"
            >
              👻 Đối thủ đã chọn!
            </motion.span>
          )}
        </div>

        <div className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 mb-8 backdrop-blur-sm shadow-xl shadow-stone-900/10">
          <p className="text-stone-200 text-lg font-medium leading-relaxed">
            {currentQ?.question}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {currentQ?.options.map((opt, idx) => {
            let btnClass = "border-stone-800 text-stone-300 hover:border-amber-700/50 hover:bg-stone-900"
            if (playerAnswerIdx !== null) {
              if (showExplanation && idx === currentQ.correctIndex) {
                btnClass = "border-green-600 bg-green-900/40 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
              } else if (idx === playerAnswerIdx) {
                btnClass = showExplanation && playerAnswerIdx !== currentQ.correctIndex
                  ? "border-red-600 bg-red-900/40 text-red-300"
                  : "border-amber-600 bg-amber-900/40 text-amber-300"
              } else {
                btnClass = "border-stone-800/30 text-stone-600 opacity-50"
              }
            }

            return (
              <button
                key={idx}
                disabled={playerAnswerIdx !== null}
                onClick={() => handlePlayerAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${btnClass}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Explanation Popup */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 leading-relaxed"
            >
              <div className="flex flex-col gap-2 mb-3">
                <div className="font-bold flex items-center justify-between">
                  <span>Bạn: {playerAnswerIdx === currentQ.correctIndex ? '✅ Đúng' : '❌ Sai'}</span>
                  <span className="text-stone-500">Đối thủ: {ghostIsCorrect ? '✅ Đúng' : '❌ Sai'}</span>
                </div>
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
          className="text-stone-600 hover:text-stone-400 text-xs tracking-widest uppercase transition-colors"
        >
          Đầu Hàng
        </button>
      </div>
    </motion.div>
  )
}
