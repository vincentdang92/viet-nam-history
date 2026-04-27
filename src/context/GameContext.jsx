'use client'

import { createContext, useContext, useReducer } from 'react'
import { processChoice, dismissFactPopup } from '../engine/gameEngine'
import { getFirstEvent } from '../engine/eventResolver'
import { STAT_INITIAL } from '../constants/gameConfig'

const INITIAL_STATE = {
  chapter: 'tran_dynasty',
  currentArc: 1,
  currentYear: 1225,
  yearsReigned: 0,
  stats: {
    binhLuc: STAT_INITIAL,
    danTam: STAT_INITIAL,
    quocKho: STAT_INITIAL,
    trieuCuong: STAT_INITIAL,
  },
  currentEvent: null,
  eventHistory: [],
  flags: {
    tranHungDaoUnlocked: false,
    wonBattle1257: false,
    wonBattle1285: false,
    wonBattle1288: false,
    foughtMing1406: false,
    joinedLungNhai: false,
    followedNguyenChich: false,
    wonBattleTotDong: false,
    wonBattleChiLang: false,
    proclamedBinhNgo: false,
  },
  unlockedSuKy: [],
  gameStatus: 'menu',
  endingId: null,
  gameOverReason: null,
  lastChoice: null,
  showFactPopup: false,
  pendingFact: null,
  pendingArcIntro: null,
  pendingEnding: null,
  adRescueUsed: false,
  adRescue: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...INITIAL_STATE,
        gameStatus: 'playing',
        currentEvent: getFirstEvent(1),
      }
    case 'CHOOSE':
      return processChoice(state, action.choiceId)
    case 'DISMISS_FACT':
      return dismissFactPopup(state)
    case 'START_ARC':
      return { ...state, gameStatus: 'playing', pendingArcIntro: null }
    case 'RESTART':
      return INITIAL_STATE
    case 'AD_RESCUE_COMPLETE': {
      const { bonus } = state.adRescue
      const rescuedStats = {}
      for (const [key, val] of Object.entries(state.stats)) {
        rescuedStats[key] = Math.min(100, val + bonus)
      }
      return {
        ...state,
        stats: rescuedStats,
        gameStatus: 'playing',
        adRescue: null,
        adRescueUsed: true,
      }
    }
    case 'AD_RESCUE_SKIP':
      return {
        ...state,
        gameStatus: 'gameover',
        adRescue: null,
        adRescueUsed: true,
      }
    case 'LOAD_GAME':
      return {
        ...INITIAL_STATE,
        ...action.savedState,
        showFactPopup: false,
        pendingFact: null,
        pendingArcIntro: null,
        pendingEnding: null,
      }
    default:
      return state
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
