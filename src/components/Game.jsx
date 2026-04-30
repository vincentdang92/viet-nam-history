'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider, useGame } from '../context/GameContext'
import { AuthProvider, useAuth } from '../context/AuthContext'
import NameSetupScreen from './screens/NameSetupScreen'
import HomeScreen from './screens/HomeScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import ArcTransitionScreen from './screens/ArcTransitionScreen'
import SuKyScreen from './screens/SuKyScreen'
import AdRescueScreen from './screens/AdRescueScreen'
import ItemRescueScreen from './screens/ItemRescueScreen'
import CompanionSelectionScreen from './screens/CompanionSelectionScreen'
import TriviaScreen from './screens/TriviaScreen'
import EspionageScreen from './screens/EspionageScreen'
import PoetryScreen from './screens/PoetryScreen'
import CombatScreen from './screens/CombatScreen'
import ArenaScreen from './screens/ArenaScreen'
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
import { saveGameState, clearGameState } from '../lib/firestore'

const SAVEABLE = ['playing', 'arc_intro', 'ad_rescue']
const TERMINAL = ['gameover', 'ending']

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
function GameRouter() {
  const { state, dispatch } = useGame()
  const { playerName } = useAuth()

  if (!playerName) {
    return <NameSetupScreen key="namesetup" />
  }

  switch (state.gameStatus) {
    case 'menu':
      return <HomeScreen key="menu" />
    case 'playing':
      return <GameScreen key="game" />
    case 'arc_intro':
      return <ArcTransitionScreen key={`arc-${state.currentArc}`} />
    case 'item_rescue':
      return <ItemRescueScreen key="itemrescue" />
    case 'trivia':
      return <TriviaScreen key="trivia" />
    case 'espionage':
      return <EspionageScreen key="espionage" />
    case 'poetry_puzzle':
      return <PoetryScreen key="poetry" />
    case 'companion_selection':
      return <CompanionSelectionScreen key="companion_selection" />
    case 'combat':
      return <CombatScreen key="combat" />
    case 'ad_rescue':
      return <AdRescueScreen key="adrescue" />
    case 'arena':
      return <ArenaScreen key="arena" />
    case 'gameover':
      return <GameOverScreen key="gameover" />
    case 'ending': {
      const ending = getEnding(state.endingId)
      return (
        <EndingCard
          key="ending"
          ending={ending}
          onRestart={() => dispatch({ type: 'START_GAME' })}
          onSuKy={() => dispatch({ type: 'TOGGLE_SU_KY' })}
        />
      )
    }
    default:
      return <HomeScreen key="menu" />
  }
}

// ─── Inner — has access to GameContext + audio ──────────────────────────────────
function GameInner() {
  const { state, dispatch } = useGame()
  const { user, updateProfile } = useAuth()
  const { muted, start, toggle } = useBgMusic()
  const firestoreTimerRef = useRef(null)

  // Start music on first user interaction beyond the menu
  useEffect(() => {
    if (state.gameStatus !== 'menu') start()
  }, [state.gameStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save: localStorage immediately + Firestore debounced (1.5s)
  useEffect(() => {
    const status = state.gameStatus

    if (SAVEABLE.includes(status)) {
      try { localStorage.setItem('minh_chu_save', JSON.stringify(state)) } catch {}

      if (firestoreTimerRef.current) clearTimeout(firestoreTimerRef.current)
      if (user?.uid) {
        firestoreTimerRef.current = setTimeout(() => {
          saveGameState(user.uid, state)
        }, 1500)
      }
    }

    if (TERMINAL.includes(status)) {
      localStorage.removeItem('minh_chu_save')
      if (user?.uid) clearGameState(user.uid)
    }

    return () => {
      if (firestoreTimerRef.current) clearTimeout(firestoreTimerRef.current)
    }
  }, [state, user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync unlocked Sử Ký to global profile
  useEffect(() => {
    if (state.unlockedSuKy && state.unlockedSuKy.length > 0) {
      updateProfile({ unlockedSuKy: state.unlockedSuKy })
    }
  }, [state.unlockedSuKy]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync unlocked Endings (Milestones) to global profile
  useEffect(() => {
    if (state.gameStatus === 'ending' && state.endingId) {
      updateProfile({ milestones: [state.endingId] })
    }
  }, [state.gameStatus, state.endingId]) // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="w-full min-h-screen flex flex-col">
        <GameRouter />
      </div>
      <AnimatePresence>
        {state.showSuKy && (
          <SuKyScreen key="suky-screen" onBack={() => dispatch({ type: 'TOGGLE_SU_KY' })} />
        )}
      </AnimatePresence>
      <MusicButton muted={muted} onToggle={toggle} />
    </>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────────
export default function Game() {
  return (
    <AuthProvider>
      <GameProvider>
        <GameInner />
      </GameProvider>
    </AuthProvider>
  )
}
