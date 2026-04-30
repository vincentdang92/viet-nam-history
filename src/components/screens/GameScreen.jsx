'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useSuKy } from '../../hooks/useSuKy'
import StatsBar from '../game/StatsBar'
import ChoiceButton from '../game/ChoiceButton'
import SwipeCard from '../game/SwipeCard'
import YearDisplay from '../game/YearDisplay'
import FactPopup from '../ui/FactPopup'
import CampaignMap from '../ui/CampaignMap'
import FactionPanel from '../ui/FactionPanel'
import { ITEMS_DATA } from '../../data/items'
import { TITLES_META } from '../../engine/statsEngine'

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

// ─── Quest Toast ────────────────────────────────────────────────────────────────
function QuestToast({ toast, onDismiss }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onDismiss, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-16 left-4 right-4 mx-auto z-50 px-4 py-2 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm
        ${toast.status === 'completed' ? 'bg-green-900/90 border-green-500/50 text-green-100' : 'bg-red-900/90 border-red-500/50 text-red-100'}
      `}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <span className="text-xl shrink-0">{toast.status === 'completed' ? '✨' : '❌'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight truncate">{toast.title}</p>
        <p className="text-xs opacity-90 break-words line-clamp-2">{toast.desc}</p>
      </div>
    </motion.div>
  )
}

// ─── Hint Toast ─────────────────────────────────────────────────────────────────
function HintToast({ toast, onDismiss }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onDismiss, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-32 left-4 right-4 mx-auto z-50 px-5 py-4 rounded-2xl shadow-2xl border bg-yellow-900/95 border-yellow-500/50 text-yellow-50 max-w-sm"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 shrink-0">💡</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-yellow-300 mb-1">Cố Vấn Lịch Sử</p>
          <p className="text-sm italic leading-relaxed break-words">"{toast}"</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── In-game header ─────────────────────────────────────────────────────────────
function GameHeader({ arc, activeTitle, onSuKy, onHome, onToggleMap, onToggleFaction, inventory, activeQuest, hintsLeft, onUseHint }) {
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
          <p className="text-tran-textMuted text-[10px] uppercase tracking-widest flex items-center gap-1">
            {DYNASTY_LABEL[arc] ?? 'Đại Việt'}
            {activeTitle && (
              <span className="text-tran-secondary bg-tran-secondary/10 px-1 rounded border border-tran-secondary/20">
                {TITLES_META[activeTitle]?.name}
              </span>
            )}
          </p>
          <p className="text-tran-secondary text-xs font-semibold">{ARC_LABEL[arc]}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Map Toggle Button */}
        <button
          onClick={onToggleMap}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-tran-card border border-tran-border hover:border-tran-secondary/50 transition-colors"
          title="Bản Đồ Chiến Sự"
        >
          <span className="text-sm">🗺️</span>
        </button>

        {/* Faction Toggle Button */}
        <button
          onClick={onToggleFaction}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-tran-card border border-tran-border hover:border-tran-secondary/50 transition-colors"
          title="Mạng Lưới Phe Phái"
        >
          <span className="text-sm">👥</span>
        </button>
        {/* Active Quest */}
        {activeQuest && (
          <div className="relative group flex items-center justify-center w-8 h-8 rounded-full bg-tran-card border border-tran-border cursor-help">
            <span className="text-sm">📜</span>
            <div className="absolute top-full mt-2 right-0 w-48 p-3 bg-tran-bg border border-tran-border rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 pointer-events-none z-[100] transition-opacity">
              <p className="font-bold text-tran-secondary mb-1 text-xs">{activeQuest.title}</p>
              <p className="text-tran-textMuted text-[10px] leading-relaxed mb-2">{activeQuest.desc}</p>
              <div className="w-full bg-tran-card rounded-full h-1.5 overflow-hidden border border-tran-border/50">
                <div className="bg-tran-secondary h-full transition-all" style={{ width: `${(activeQuest.progress / activeQuest.duration) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Inventory Items */}
        {inventory?.length > 0 && (
          <div className="flex gap-1 mr-1">
            {inventory.map(id => (
              <div key={id} className="relative group cursor-pointer">
                <span className="text-lg filter drop-shadow-md">
                  {ITEMS_DATA[id]?.icon}
                </span>
                <div className="absolute top-full mt-2 right-0 w-48 p-3 bg-tran-bg border border-tran-border rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 pointer-events-none z-[100] transition-opacity">
                  <p className="font-bold text-tran-secondary mb-1 text-xs">{ITEMS_DATA[id]?.name}</p>
                  <p className="text-tran-textMuted text-[10px] leading-relaxed">{ITEMS_DATA[id]?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onSuKy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-tran-card border border-tran-border hover:border-tran-secondary/50 transition-colors"
        >
          <span className="text-sm">📖</span>
          {unlocked.length > 0 && (
            <span className="bg-tran-secondary text-tran-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unlocked.length}
            </span>
          )}
        </button>

        {/* Hint Button */}
        <button
          onClick={onUseHint}
          disabled={hintsLeft <= 0}
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors
            ${hintsLeft > 0 ? 'bg-yellow-900/40 border-yellow-600/50 hover:bg-yellow-900/60 text-yellow-200' : 'bg-tran-card border-tran-border/50 text-tran-border opacity-50'}`}
          title={`Hỏi Cố Vấn (${hintsLeft} lần)`}
        >
          <span className="text-sm">💡</span>
        </button>
      </div>
    </div>
  )
}

// ─── Main screen ────────────────────────────────────────────────────────────────
export default function GameScreen() {
  const { state, dispatch } = useGame()
  const { currentEvent, stats, historicalScore, hintsLeft, hintToast, currentYear, currentArc, showFactPopup, pendingFact, eventHistory, inventory, activeQuest, questToast } = state
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
      exit={{ opacity: 0 }}
    >
      {/* Campaign background intense glow */}
      {isCampaign && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay bg-red-900"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Quest Toast Notification */}
      <AnimatePresence>
        {questToast && (
          <QuestToast toast={questToast} onDismiss={() => dispatch({ type: 'DISMISS_QUEST_TOAST' })} />
        )}
        {hintToast && (
          <HintToast toast={hintToast} onDismiss={() => dispatch({ type: 'DISMISS_HINT_TOAST' })} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-50">
        <GameHeader 
          arc={currentArc} 
          activeTitle={state.activeTitle}
          onSuKy={() => dispatch({ type: 'TOGGLE_SU_KY' })} 
          onHome={() => setShowExitModal(true)} 
          onToggleMap={() => dispatch({ type: 'TOGGLE_MAP' })}
          onToggleFaction={() => dispatch({ type: 'TOGGLE_FACTION' })}
          inventory={inventory} 
          activeQuest={activeQuest} 
          hintsLeft={hintsLeft}
          onUseHint={() => dispatch({ type: 'USE_HINT' })}
        />
      </div>

      <CampaignMap />
      <FactionPanel />

      {/* Stats */}
      <div className="px-4 pb-1 shrink-0 relative z-10">
        <StatsBar stats={previewStats} baseStats={stats} />
        {/* Historical Score Meter */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-tran-textMuted font-bold">Chính Sử</span>
          <div className="flex-1 h-1.5 bg-tran-bg rounded-full overflow-hidden border border-tran-border/30">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
              initial={{ width: `${historicalScore}%` }}
              animate={{ width: `${historicalScore}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
          <span className={`text-[10px] font-bold ${historicalScore < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-500'}`}>{historicalScore}%</span>
        </div>
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
