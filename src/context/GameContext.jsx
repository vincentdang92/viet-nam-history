'use client'

import { createContext, useContext, useReducer } from 'react'
import { processChoice, processTriviaResult, processCombatChoice, dismissFactPopup, computeRescuedStats } from '../engine/gameEngine'
import { getFirstEvent } from '../engine/eventResolver'
import { STAT_INITIAL } from '../constants/gameConfig'
import { getRandomQuest } from '../data/quests'

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
  inventory: [],
  gameStatus: 'menu',
  endingId: null,
  gameOverReason: null,
  lastChoice: null,
  showFactPopup: false,
  pendingFact: null,
  pendingArcIntro: null,
  pendingEnding: null,
  adRescueCount: 0,
  adRescue: null,
  itemRescue: null,
  activeQuest: null,
  questToast: null,
  lastTriviaYear: 0,
  triviaData: null,
  historicalScore: 100,
  hintsLeft: 3,
  hintToast: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...INITIAL_STATE,
        gameStatus: 'playing',
        currentEvent: getFirstEvent(1),
        activeQuest: getRandomQuest(),
      }
    case 'CHOOSE':
      return processChoice(state, action.choiceId)
    case 'COMBAT_CHOICE':
      return processCombatChoice(state, action.choiceId)
    case 'TRIVIA_COMPLETE':
      return processTriviaResult(state, action.isCorrect)
    case 'DISMISS_FACT':
      return dismissFactPopup(state)
    case 'DISMISS_QUEST_TOAST':
      return { ...state, questToast: null }
    case 'USE_HINT':
      if (state.hintsLeft <= 0) return state
      return {
        ...state,
        hintsLeft: state.hintsLeft - 1,
        hintToast: state.currentEvent?.hint || 'Sử sách luôn có một con đường sáng, hãy nhìn xa trông rộng.'
      }
    case 'DISMISS_HINT_TOAST':
      return { ...state, hintToast: null }
    case 'START_ARC':
      return { ...state, gameStatus: 'playing', pendingArcIntro: null, activeQuest: state.activeQuest || getRandomQuest(), hintsLeft: 3 }
    case 'RESTART':
      return INITIAL_STATE
    case 'AD_RESCUE_COMPLETE': {
      const { rescuedStats, pendingState, bonus } = state.adRescue ?? {}
      if (!pendingState) return { ...state, gameStatus: 'gameover', adRescue: null }
      // Fallback: recompute if rescuedStats missing (old save format)
      const safeStats = rescuedStats ?? computeRescuedStats(pendingState.stats, bonus ?? 10)
      return {
        ...pendingState,
        stats: safeStats,
        gameStatus: 'playing',
        adRescue: null,
        adRescueCount: (state.adRescueCount ?? 0) + 1,
      }
    }
    case 'AD_RESCUE_SKIP':
      return {
        ...state,
        gameStatus: 'gameover',
        adRescue: null,
        adRescueCount: (state.adRescueCount ?? 0) + 1,
      }
    case 'ITEM_RESCUE_COMPLETE': {
      const { rescuedStats, pendingState, itemId } = state.itemRescue ?? {}
      if (!pendingState) return { ...state, gameStatus: 'gameover', itemRescue: null }
      
      const newInventory = state.inventory.filter(id => id !== itemId)
      
      return {
        ...pendingState,
        stats: rescuedStats ?? computeRescuedStats(pendingState.stats, 20),
        inventory: newInventory,
        gameStatus: 'playing',
        itemRescue: null,
      }
    }
    case 'ITEM_RESCUE_SKIP': {
      // Fallback to ad_rescue if available
      if ((state.adRescueCount ?? 0) < 10) {
        const { pendingState } = state.itemRescue ?? {}
        const tier = { duration: 5, bonus: 10 } // basic tier fallback
        return {
          ...state,
          gameStatus: 'ad_rescue',
          itemRescue: null,
          adRescue: {
            duration: tier.duration,
            bonus: tier.bonus,
            triggerStat: state.itemRescue?.triggerStat,
            pendingState,
            rescuedStats: computeRescuedStats(pendingState.stats, tier.bonus)
          }
        }
      }
      return {
        ...state,
        gameStatus: 'gameover',
        itemRescue: null,
      }
    }
    case 'LOAD_GAME': {
      const s = action.savedState ?? {}
      // Corrupt save: playing but no event
      if (s.gameStatus === 'playing' && !s.currentEvent) return INITIAL_STATE
      // Old ad_rescue save missing rescuedStats — recompute or discard
      let adRescue = s.adRescue ?? null
      if (s.gameStatus === 'ad_rescue' && adRescue) {
        if (!adRescue.rescuedStats && adRescue.pendingState?.stats && adRescue.bonus) {
          adRescue = { ...adRescue, rescuedStats: computeRescuedStats(adRescue.pendingState.stats, adRescue.bonus) }
        } else if (!adRescue.pendingState || !adRescue.bonus) {
          // Unrecoverable — drop to menu
          return INITIAL_STATE
        }
      }
      return {
        ...INITIAL_STATE,
        ...s,
        adRescue,
        showFactPopup: false,
        pendingFact: null,
        pendingArcIntro: null,
        pendingEnding: null,
      }
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
