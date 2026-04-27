'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider, useGame } from '../context/GameContext'
import HomeScreen from './screens/HomeScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import ArcTransitionScreen from './screens/ArcTransitionScreen'
import SuKyScreen from './screens/SuKyScreen'
import AdRescueScreen from './screens/AdRescueScreen'
import EndingCard from './ui/EndingCard'
import { getEnding } from '../engine/endingChecker'
import { useBgMusic } from '../hooks/useBgMusic'
import {
  trackGameStart,
  trackGameOver,
  trackEndingReached,
  trackArcComplete,
  trackAdRescueShown,
  trackError,
} from '../lib/analytics'

// ─── Floating music toggle button ──────────────────────────────────────────────
function MusicButton({ muted, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      title={muted ? 'Bật nhạc' : 'Tắt nhạc'}
      className="fixed top-3 right-3 z-50 w-8 h-8 rounded-full flex items-center justify-center text-base select-none"
      style={{
        background: 'rgba(45,31,26,0.85)',
        border: '1px solid rgba(90,48,32,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      whileTap={{ scale: 0.85 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      {muted ? '🔇' : '🎵'}
    </motion.button>
  )
}

// ─── Router ─────────────────────────────────────────────────────────────────────
function GameRouter({ onSuKy, showSuKy }) {
  const { state, dispatch } = useGame()

  if (showSuKy) {
    return <SuKyScreen key="suky" onBack={() => onSuKy(false)} />
  }

  switch (state.gameStatus) {
    case 'menu':
      return <HomeScreen key="menu" />
    case 'playing':
      return <GameScreen key="game" onSuKy={() => onSuKy(true)} />
    case 'arc_intro':
      return <ArcTransitionScreen key={`arc-${state.currentArc}`} />
    case 'ad_rescue':
      return <AdRescueScreen key="adrescue" />
    case 'gameover':
      return <GameOverScreen key="gameover" />
    case 'ending': {
      const ending = getEnding(state.endingId)
      return (
        <EndingCard
          key="ending"
          ending={ending}
          onRestart={() => dispatch({ type: 'START_GAME' })}
          onSuKy={() => onSuKy(true)}
        />
      )
    }
    default:
      return <HomeScreen key="menu" />
  }
}

// ─── Inner — has access to GameContext + audio ──────────────────────────────────
function GameInner() {
  const { state } = useGame()
  const [showSuKy, setShowSuKy] = useState(false)
  const { muted, start, toggle } = useBgMusic()

  // Start music on first user interaction beyond the menu
  useEffect(() => {
    if (state.gameStatus !== 'menu') start()
  }, [state.gameStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save on every state change (except menu)
  useEffect(() => {
    if (state.gameStatus === 'menu') return
    try {
      localStorage.setItem('minh_chu_save', JSON.stringify(state))
    } catch {}
  }, [state])

  // Analytics — fire events on key status transitions
  const prevStatus = useRef(null)
  useEffect(() => {
    const s = state.gameStatus
    const prev = prevStatus.current
    prevStatus.current = s

    if (s === prev) return

    if (s === 'playing' && prev === 'menu') {
      trackGameStart()
    }
    if (s === 'gameover') {
      trackGameOver({
        reason: state.gameOverReason,
        arc: state.currentArc,
        yearsReigned: state.yearsReigned,
        currentYear: state.currentYear,
      })
    }
    if (s === 'ending') {
      trackEndingReached({
        endingId: state.endingId,
        arc: state.currentArc,
        yearsReigned: state.yearsReigned,
      })
    }
    if (s === 'arc_intro') {
      trackArcComplete({ arc: state.currentArc - 1 })
    }
    if (s === 'ad_rescue' && state.adRescue) {
      trackAdRescueShown({
        duration: state.adRescue.duration,
        bonus: state.adRescue.bonus,
        triggerStat: state.adRescue.triggerStat,
      })
    }
  }, [state.gameStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  // Global error tracking
  useEffect(() => {
    const handler = (e) => trackError({ message: e.message, source: 'window.onerror' })
    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        <GameRouter
          key={showSuKy ? 'suky' : state.gameStatus + state.currentArc}
          onSuKy={setShowSuKy}
          showSuKy={showSuKy}
        />
      </AnimatePresence>
      <MusicButton muted={muted} onToggle={toggle} />
    </>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────────
export default function Game() {
  return (
    <GameProvider>
      <GameInner />
    </GameProvider>
  )
}
