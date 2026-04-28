'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useSuKy } from '../../hooks/useSuKy'
import StatsBar from '../game/StatsBar'
import CardDisplay from '../game/CardDisplay'
import ChoiceButton from '../game/ChoiceButton'
import YearDisplay from '../game/YearDisplay'
import FactPopup from '../ui/FactPopup'
import { ITEMS_DATA } from '../../data/items'

const SWIPE_THRESHOLD = 80
const ARC_LABEL = {
  1: 'Lập Quốc',
  2: 'Kháng Nguyên',
  3: 'Thịnh Rồi Suy',
  4: 'Nhà Hồ & Thuộc Minh',
  5: 'Lam Sơn Khởi Nghĩa',
}
const DYNASTY_LABEL = {
  1: 'Nhà Trần', 2: 'Nhà Trần', 3: 'Nhà Trần',
  4: 'Nhà Hồ', 5: 'Lam Sơn',
}

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

  const isBattle = event?.type === 'battle' || event?.isCinematic || event?.type === 'campaign'

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

// ─── Exit confirmation modal ────────────────────────────────────────────────────
function ExitModal({ onContinue, onHome }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
      style={{ background: 'rgba(26,15,10,0.85)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl border border-tran-border bg-tran-card shadow-2xl overflow-hidden"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      >
        <div className="px-5 pt-5 pb-4 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-tran-text font-semibold text-base leading-snug">Bỏ cuộc giữa chừng?</p>
          <p className="text-tran-textMuted text-sm mt-1">Tiến trình hiện tại sẽ không được lưu.</p>
        </div>
        <div className="flex flex-col gap-2 px-5 pb-5">
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl bg-tran-secondary text-tran-bg font-bold text-sm active:opacity-80 transition-opacity"
            style={{ minHeight: 48 }}
          >
            Tiếp tục chơi
          </button>
          <button
            onClick={onHome}
            className="w-full py-3 rounded-xl border border-tran-border text-tran-textMuted text-sm active:opacity-70 transition-opacity"
            style={{ minHeight: 48 }}
          >
            Về trang chủ
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── In-game header ─────────────────────────────────────────────────────────────
function GameHeader({ arc, onSuKy, onHome, inventory }) {
  const { unlocked } = useSuKy()

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onHome}
          className="text-tran-textMuted active:opacity-60 flex items-center justify-center rounded-lg border border-tran-border bg-tran-card"
          style={{ width: 36, height: 36 }}
          title="Về trang chủ"
        >
          ⌂
        </button>
        <div>
          <p className="text-tran-textMuted text-[10px] uppercase tracking-widest">{DYNASTY_LABEL[arc] ?? 'Đại Việt'}</p>
          <p className="text-tran-secondary text-xs font-semibold">{ARC_LABEL[arc]}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Inventory Items */}
        {inventory?.length > 0 && (
          <div className="flex gap-1 mr-1">
            {inventory.map(id => (
              <span key={id} title={ITEMS_DATA[id]?.name} className="text-lg filter drop-shadow-md">
                {ITEMS_DATA[id]?.icon}
              </span>
            ))}
          </div>
        )}

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
    </div>
  )
}

// ─── Main screen ────────────────────────────────────────────────────────────────
export default function GameScreen({ onSuKy }) {
  const { state, dispatch } = useGame()
  const { currentEvent, stats, currentYear, currentArc, showFactPopup, pendingFact, eventHistory, inventory } = state
  const [hoveredChoice, setHoveredChoice] = useState(null)
  const [cardKey, setCardKey]   = useState(0)
  const [showExitModal, setShowExitModal] = useState(false)

  // Show tutorial on very first card only
  const isFirstCard = eventHistory.length === 0
  const [hideTutorial, setHideTutorial] = useState(false)

  // Intercept browser back button / swipe-back gesture
  useEffect(() => {
    // Push a sentinel state so the back action hits us first
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      // Re-push so repeated back presses keep showing the modal
      window.history.pushState(null, '', window.location.href)
      setShowExitModal(true)
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const handleGoHome = useCallback(() => {
    setShowExitModal(false)
    dispatch({ type: 'RESTART' })
  }, [dispatch])

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

  const isCampaign = currentEvent?.type === 'campaign'

  return (
    <motion.div
      className={`min-h-screen flex flex-col max-w-sm mx-auto relative transition-colors duration-1000 ${isCampaign ? 'bg-red-950/40' : 'bg-tran-bg'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Campaign background intense glow */}
      {isCampaign && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay bg-red-900"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <div className="relative z-10">
        <GameHeader arc={currentArc} onSuKy={onSuKy} onHome={() => setShowExitModal(true)} inventory={inventory} />
      </div>

      {/* Stats */}
      <div className="px-4 pb-2 shrink-0 relative z-10">
        <StatsBar stats={previewStats} baseStats={stats} />
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-h-0 relative z-10">
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
      <div className="px-4 pb-6 pt-4 shrink-0 space-y-2 relative z-10">
        {isCampaign && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <span className="bg-red-900 text-red-200 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-md border border-red-700">
              Chiến Dịch
            </span>
          </motion.div>
        )}
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

      <AnimatePresence>
        {showExitModal && (
          <ExitModal
            onContinue={() => setShowExitModal(false)}
            onHome={handleGoHome}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
