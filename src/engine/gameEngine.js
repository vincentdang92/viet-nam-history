import { applyEffects, checkGameOver } from './statsEngine'
import { resolveNextEvent } from './eventResolver'
import { checkEnding } from './endingChecker'
import { YEAR_PER_CARD } from '../constants/gameConfig'

export function processChoice(state, choiceId) {
  const choice = state.currentEvent.choices.find(c => c.id === choiceId)
  if (!choice) return state

  const newStats = applyEffects(state.stats, choice.effects)

  const gameOverCheck = checkGameOver(newStats)
  if (gameOverCheck.isOver) {
    if (!state.adRescueUsed) {
      const AD_TIERS = [
        { duration: 5,  bonus: 10 },
        { duration: 10, bonus: 20 },
        { duration: 15, bonus: 30 },
      ]
      const tier = AD_TIERS[Math.floor(Math.random() * 3)]

      // Pre-compute everything after the choice so rescue can advance to NEXT card
      const yearAdvance = state.currentEvent.type === 'battle' ? 2 : YEAR_PER_CARD
      const newSuKy = choice.unlockSuKy
        ? [...new Set([...state.unlockedSuKy, choice.unlockSuKy])]
        : state.unlockedSuKy
      const newFlags = { ...state.flags }
      if (choice.setFlag) Object.assign(newFlags, choice.setFlag)
      const nextArc = choice.endArc ? state.currentArc + 1 : state.currentArc

      const pendingBase = {
        ...state,
        stats: newStats,
        flags: newFlags,
        yearsReigned: state.yearsReigned + yearAdvance,
        currentYear: state.currentYear + yearAdvance,
        currentArc: nextArc,
        unlockedSuKy: newSuKy,
        eventHistory: [...state.eventHistory, state.currentEvent.id],
        lastChoice: choice,
        showFactPopup: !!choice.fact,
        pendingFact: choice.fact ? { text: choice.fact, isHistorical: choice.isHistorical } : null,
        pendingArcIntro: choice.endArc ? nextArc : null,
      }
      const nextEvent = resolveNextEvent(pendingBase, choice)

      return {
        ...state,
        gameStatus: 'ad_rescue',
        gameOverReason: gameOverCheck.reason,
        lastChoice: choice,
        adRescue: {
          duration: tier.duration,
          bonus: tier.bonus,
          triggerStat: gameOverCheck.triggerStat,
          pendingState: { ...pendingBase, currentEvent: nextEvent },
        },
      }
    }
    return {
      ...state,
      stats: newStats,
      gameStatus: 'gameover',
      gameOverReason: gameOverCheck.reason,
      lastChoice: choice,
    }
  }

  const yearAdvance = state.currentEvent.type === 'battle' ? 2 : YEAR_PER_CARD
  const newYear = state.currentYear + yearAdvance
  const newYearsReigned = state.yearsReigned + yearAdvance

  const newSuKy = choice.unlockSuKy
    ? [...new Set([...state.unlockedSuKy, choice.unlockSuKy])]
    : state.unlockedSuKy

  const newFlags = { ...state.flags }
  if (choice.setFlag) Object.assign(newFlags, choice.setFlag)

  const nextArc = choice.endArc ? state.currentArc + 1 : state.currentArc

  const stateForEndingCheck = {
    ...state,
    stats: newStats,
    flags: newFlags,
    yearsReigned: newYearsReigned,
    currentArc: nextArc,
  }

  const endingCheck = checkEnding(stateForEndingCheck)
  if (endingCheck.hasEnding) {
    return {
      ...stateForEndingCheck,
      gameStatus: 'ending',
      endingId: endingCheck.endingId,
      unlockedSuKy: newSuKy,
      lastChoice: choice,
      // Show fact before the ending screen
      showFactPopup: true,
      pendingFact: { text: choice.fact, isHistorical: choice.isHistorical },
      pendingEnding: endingCheck.endingId,
    }
  }

  const nextEvent = resolveNextEvent(stateForEndingCheck, choice)

  if (!nextEvent) {
    const fallbackEndingId = stateForEndingCheck.currentArc >= 5
      ? 'ending_doc_lap'
      : 'ending_bach_dang'
    return {
      ...stateForEndingCheck,
      gameStatus: 'ending',
      endingId: fallbackEndingId,
      unlockedSuKy: newSuKy,
      lastChoice: choice,
      showFactPopup: true,
      pendingFact: { text: choice.fact, isHistorical: choice.isHistorical },
      pendingEnding: fallbackEndingId,
    }
  }

  return {
    ...stateForEndingCheck,
    currentEvent: nextEvent,
    currentYear: newYear,
    unlockedSuKy: newSuKy,
    eventHistory: [...state.eventHistory, state.currentEvent.id],
    lastChoice: choice,
    showFactPopup: true,
    pendingFact: { text: choice.fact, isHistorical: choice.isHistorical },
    // Signal arc transition after fact popup dismissal
    pendingArcIntro: choice.endArc ? nextArc : null,
  }
}

export function dismissFactPopup(state) {
  const base = { ...state, showFactPopup: false, pendingFact: null }

  // After an arc-ending choice → show arc intro screen
  if (state.pendingArcIntro) {
    return { ...base, gameStatus: 'arc_intro' }
  }

  // After the last card of the game → show ending
  if (state.pendingEnding) {
    return { ...base, gameStatus: 'ending', endingId: state.pendingEnding, pendingEnding: null }
  }

  return base
}
