'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useSuKy } from '../../hooks/useSuKy'
import StatsBar from '../game/StatsBar'
import CardDisplay from '../game/CardDisplay'
import ChoiceButton from '../game/ChoiceButton'
import YearDisplay from '../game/YearDisplay'
import FactPopup from '../ui/FactPopup'

const SWIPE_THRESHOLD = 80
const ARC_LABEL = { 1: 'Lập Quốc', 2: 'Kháng Nguyên', 3: 'Thịnh Rồi Suy' }

// ─── Swipe card ────────────────────────────────────────────────────────────────
function SwipeCard({ event, choices, onChoiceA, onChoiceB, cardKey, showTutorial }) {
  const x      = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-14, 14])

  const rightOpacity = useTransform(x, [20, 90], [0, 1])
  const rightScale   = useTransform(x, [20, 90], [0.85, 1])
  const leftOpacity  = useTransform(x, [-90, -20], [1, 0])
  const leftScale    = useTransform(x, [-90, -20], [1, 0.85])
  const rightTint    = useTransform(x, [0, SWIPE_THRESHOLD], [0, 0.15])
  const leftTint     = useTransform(x, [-SWIPE_THRESHOLD, 0], [0.15, 0])

  const handleDragEnd = (_, info) => {
    if (info.offset.x >  SWIPE_THRESHOLD && choices[0]) onChoiceA()
    else if (info.offset.x < -SWIPE_THRESHOLD && choices[1]) onChoiceB()
  }

  const isBattle = event?.type === 'battle' || event?.isCinematic

  return (
    <div className="relative select-none">
      <motion.div
        key={cardKey}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        dragMomentum={false}
        style={{ x, rotate, touchAction: 'none' }}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: -24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className={`relative rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing
          ${isBattle
            ? 'border-2 border-red-700/60 bg-gradient-to-b from-red-950/80 to-tran-card'
            : 'border border-tran-border bg-tran-card'
          }`}
        whileDrag={{ scale: 1.02 }}
      >
        {/* Drag tints */}
        <motion.div className="absolute inset-0 bg-tran-secondary/20 rounded-2xl pointer-events-none z-10" style={{ opacity: rightTint }} />
        <motion.div className="absolute inset-0 bg-red-800/20 rounded-2xl pointer-events-none z-10" style={{ opacity: leftTint }} />

        {/* Right overlay (choice A) */}
        <motion.div className="absolute inset-0 flex items-center justify-start pl-4 z-20 pointer-events-none" style={{ opacity: rightOpacity, scale: rightScale }}>
          <div className="bg-tran-secondary/90 text-tran-bg text-xs font-bold px-3 py-1.5 rounded-xl max-w-[45%] leading-snug">
            ✓ {choices[0]?.text}
          </div>
        </motion.div>

        {/* Left overlay (choice B) */}
        <motion.div className="absolute inset-0 flex items-center justify-end pr-4 z-20 pointer-events-none" style={{ opacity: leftOpacity, scale: leftScale }}>
          <div className="bg-red-700/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl max-w-[45%] leading-snug text-right">
            ✗ {choices[1]?.text}
          </div>
        </motion.div>

        {/* Battle glow */}
        {isBattle && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: '0 0 32px rgba(185,28,28,0.4)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <CardDisplay event={event} />
      </motion.div>

      {/* Tutorial hint — only on first card */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            className="absolute -bottom-8 inset-x-0 flex items-center justify-center gap-3 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.span
              className="text-tran-secondary text-xs"
              animate={{ x: [-4, 0, -4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ← kéo
            </motion.span>
            <span className="text-tran-textMuted text-[10px]">hoặc nhấn nút bên dưới</span>
            <motion.span
              className="text-red-400 text-xs"
              animate={{ x: [4, 0, 4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              kéo →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── In-game header ─────────────────────────────────────────────────────────────
function GameHeader({ arc, onSuKy }) {
  const { unlocked } = useSuKy()

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
      <div>
        <p className="text-tran-textMuted text-[10px] uppercase tracking-widest">Nhà Trần</p>
        <p className="text-tran-secondary text-xs font-semibold">{ARC_LABEL[arc]}</p>
      </div>
      <button
        onClick={onSuKy}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-tran-card border border-tran-border hover:border-tran-secondary/50 transition-colors"
      >
        <span className="text-sm">📖</span>
        <span className="text-tran-text text-xs">Sử Ký</span>
        {unlocked.length > 0 && (
          <span className="bg-tran-secondary text-tran-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            {unlocked.length}
          </span>
        )}
      </button>
    </div>
  )
}

// ─── Main screen ────────────────────────────────────────────────────────────────
export default function GameScreen({ onSuKy }) {
  const { state, dispatch } = useGame()
  const { currentEvent, stats, currentYear, currentArc, showFactPopup, pendingFact, eventHistory } = state
  const [hoveredChoice, setHoveredChoice] = useState(null)
  const [cardKey, setCardKey]   = useState(0)

  // Show tutorial on very first card only
  const isFirstCard = eventHistory.length === 0
  const [hideTutorial, setHideTutorial] = useState(false)

  const handleChoice = (choiceId) => {
    if (showFactPopup) return
    setCardKey(k => k + 1)
    setHideTutorial(true)
    setHoveredChoice(null)
    dispatch({ type: 'CHOOSE', choiceId })
  }

  const choices = currentEvent?.choices ?? []

  const previewEffects = hoveredChoice
    ? choices.find(c => c.id === hoveredChoice)?.effects ?? null
    : null

  const previewStats = previewEffects
    ? Object.fromEntries(
        Object.entries(stats).map(([k, v]) => [
          k, Math.min(100, Math.max(0, v + (previewEffects[k] ?? 0))),
        ])
      )
    : stats

  return (
    <motion.div
      className="min-h-screen bg-tran-bg flex flex-col max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <GameHeader arc={currentArc} onSuKy={onSuKy} />

      {/* Stats */}
      <div className="px-4 pb-2 shrink-0">
        <StatsBar stats={previewStats} baseStats={stats} />
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-h-0">
        <AnimatePresence mode="wait">
          <SwipeCard
            key={cardKey}
            event={currentEvent}
            choices={choices}
            onChoiceA={() => handleChoice(choices[0]?.id)}
            onChoiceB={() => handleChoice(choices[1]?.id)}
            cardKey={cardKey}
            showTutorial={isFirstCard && !hideTutorial}
          />
        </AnimatePresence>
      </div>

      {/* Year + choices */}
      <div className="px-4 pb-6 pt-4 shrink-0 space-y-2">
        <YearDisplay year={currentYear} arc={currentArc} />
        <div className="space-y-2 mt-2">
          {choices.map((choice, i) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              index={i}
              onClick={() => handleChoice(choice.id)}
              hovered={hoveredChoice === choice.id}
              onHover={() => setHoveredChoice(choice.id)}
              onLeave={() => setHoveredChoice(null)}
            />
          ))}
        </div>
      </div>

      <FactPopup
        fact={pendingFact}
        onDismiss={() => dispatch({ type: 'DISMISS_FACT' })}
      />
    </motion.div>
  )
}
