'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { GameProvider, useGame } from '../context/GameContext'
import HomeScreen from './screens/HomeScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import ArcTransitionScreen from './screens/ArcTransitionScreen'
import SuKyScreen from './screens/SuKyScreen'
import EndingCard from './ui/EndingCard'
import { getEnding } from '../engine/endingChecker'

function GameRouter() {
  const { state, dispatch } = useGame()
  const [showSuKy, setShowSuKy] = useState(false)

  if (showSuKy) {
    return <SuKyScreen key="suky" onBack={() => setShowSuKy(false)} />
  }

  switch (state.gameStatus) {
    case 'menu':
      return <HomeScreen key="menu" />
    case 'playing':
      return <GameScreen key="game" onSuKy={() => setShowSuKy(true)} />
    case 'arc_intro':
      return <ArcTransitionScreen key={`arc-${state.currentArc}`} />
    case 'gameover':
      return <GameOverScreen key="gameover" />
    case 'ending': {
      const ending = getEnding(state.endingId)
      return (
        <EndingCard
          key="ending"
          ending={ending}
          onRestart={() => dispatch({ type: 'START_GAME' })}
          onSuKy={() => setShowSuKy(true)}
        />
      )
    }
    default:
      return <HomeScreen key="menu" />
  }
}

export default function Game() {
  return (
    <GameProvider>
      <AnimatePresence mode="wait">
        <GameRouter />
      </AnimatePresence>
    </GameProvider>
  )
}
