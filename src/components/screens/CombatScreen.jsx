'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import SwipeCard from '../game/SwipeCard'
import ChoiceButton from '../game/ChoiceButton'

export default function CombatScreen() {
  const { state, dispatch } = useGame()
  const { combatState } = state
  const [hoveredChoice, setHoveredChoice] = useState(null)
  const [cardKey, setCardKey] = useState(0)

  if (!combatState) return null

  const { playerHP, maxPlayerHP, enemyHP, maxEnemyHP, enemyName, currentCard } = combatState

  // Convert combat card to SwipeCard compatible format
  const mockEvent = {
    ...currentCard,
    title: 'Giao Tranh'
  }
  const choices = currentCard.choices

  const handleChoice = (choiceId) => {
    setHoveredChoice(null)
    setCardKey(k => k + 1)
    setTimeout(() => {
      dispatch({ type: 'COMBAT_CHOICE', choiceId })
    }, 150)
  }

  const handleDragEnd = (_, info) => {
    const SWIPE_THRESHOLD = 80
    if (info.offset.x >  SWIPE_THRESHOLD && choices[0]) handleChoice(choices[0].id)
    else if (info.offset.x < -SWIPE_THRESHOLD && choices[1]) handleChoice(choices[1].id)
  }

  return (
    <motion.div
      className="min-h-screen bg-red-950/90 flex flex-col max-w-sm mx-auto relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Intense red flash background */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 bg-red-600/10 mix-blend-overlay"
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Header: Enemy HP */}
      <div className="relative z-10 px-6 pt-8 pb-4 bg-gradient-to-b from-black/80 to-transparent flex flex-col items-center">
        <h2 className="text-xl font-bold text-red-300 font-serif mb-2 tracking-wider uppercase drop-shadow-md">
          {enemyName}
        </h2>
        <div className="w-full h-4 bg-black/60 rounded-full border border-red-900 overflow-hidden relative shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-800 to-red-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(enemyHP / maxEnemyHP) * 100}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>
        <p className="text-xs font-bold text-red-200 mt-1">{enemyHP} / {maxEnemyHP}</p>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          <SwipeCard
            key={cardKey}
            event={mockEvent}
            choices={choices}
            onDragEnd={handleDragEnd}
            onHoverChoice={setHoveredChoice}
          />
        </AnimatePresence>
      </div>

      {/* Footer: Player HP + Choices */}
      <div className="relative z-10 px-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex flex-col items-center mb-6">
          <p className="text-xs font-bold text-green-200 mb-1">{playerHP} / {maxPlayerHP}</p>
          <div className="w-48 h-3 bg-black/60 rounded-full border border-green-900 overflow-hidden relative shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-800 to-green-500"
              initial={{ width: '100%' }}
              animate={{ width: `${(playerHP / maxPlayerHP) * 100}%` }}
              transition={{ type: 'spring', damping: 15 }}
            />
          </div>
          <h2 className="text-sm font-bold text-green-300 font-serif mt-2 tracking-wider uppercase">
            Đại Việt
          </h2>
        </div>

        <div className="space-y-2">
          {choices.map((choice, i) => (
            <ChoiceButton
              key={choice.id}
              choice={{ ...choice, effects: {} }}
              index={i}
              hovered={hoveredChoice === i}
              onHover={() => setHoveredChoice(i)}
              onLeave={() => setHoveredChoice(null)}
              onClick={() => handleChoice(choice.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
