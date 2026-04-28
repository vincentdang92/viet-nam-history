import { applyEffects, checkGameOver } from './statsEngine'
import { resolveNextEvent } from './eventResolver'
import { checkEnding } from './endingChecker'
import { YEAR_PER_CARD, DANGER_MIN, DANGER_MAX, STAT_CEIL } from '../constants/gameConfig'
import { getApplicableItem } from '../data/items'
import { getRandomTrivia } from '../data/trivia'
import { getRandomCombatCard } from '../data/combat'

// From data analysis across all arcs: max |negative| = 15, max positive on binhLuc/trieuCuong = 20
const MAX_NEG_EFFECT = 15
const MAX_POS_EFFECT = 20

// Exported so GameContext can recompute rescuedStats from old saves that don't have it
export function computeRescuedStats(stats, bonus) {
  const result = {}
  for (const [key, val] of Object.entries(stats)) {
    const isMaxDanger = key === 'binhLuc' || key === 'trieuCuong'

    let adjusted
    if (isMaxDanger) {
      if (val >= DANGER_MAX) {
        // Over the ceiling → bring down
        adjusted = val - bonus
      } else {
        // Safe zone → keep as-is; adding bonus risks pushing toward DANGER_MAX
        adjusted = val
      }
    } else {
      // danTam / quocKho → always recover
      adjusted = val + bonus
    }

    // safeMin: rescued stat must survive one worst-case negative choice (31 - 15 = 16 > 15)
    const safeMin = DANGER_MIN + MAX_NEG_EFFECT + 1  // = 31
    // safeMax for max-danger: must survive one worst-case positive choice (64 + 20 = 84 < 85)
    const safeMax = isMaxDanger ? DANGER_MAX - MAX_POS_EFFECT - 1 : STAT_CEIL  // 64 vs 100
    result[key] = Math.min(safeMax, Math.max(safeMin, adjusted))
  }
  return result
}

export function processChoice(state, choiceId) {
  const choice = state.currentEvent.choices.find(c => c.id === choiceId)
  if (!choice) return state

  // Intercept 'battle' type events to trigger the Combat Mini-game
  if (state.currentEvent.type === 'battle' && state.gameStatus !== 'combat') {
    return {
      ...state,
      gameStatus: 'combat',
      combatState: {
        playerHP: 100,
        maxPlayerHP: 100,
        enemyHP: 100,
        maxEnemyHP: 100,
        enemyName: 'Quân Địch',
        currentCard: getRandomCombatCard(),
        pendingChoiceId: choiceId
      }
    }
  }

  const newStats = applyEffects(state.stats, choice.effects)

  const gameOverCheck = checkGameOver(newStats)
  if (gameOverCheck.isOver) {
    const yearAdvance = state.currentEvent.type === 'battle' || state.currentEvent.type === 'campaign' ? 2 : YEAR_PER_CARD
    const nextArc = choice.endArc ? state.currentArc + 1 : state.currentArc
    const newSuKy = choice.unlockSuKy
      ? [...new Set([...state.unlockedSuKy, choice.unlockSuKy])]
      : state.unlockedSuKy
    const newFlags = { ...state.flags }
    if (choice.setFlag) Object.assign(newFlags, choice.setFlag)
    const newInventory = choice.giveItem && !(state.inventory || []).includes(choice.giveItem)
      ? [...(state.inventory || []), choice.giveItem]
      : (state.inventory || [])

    const pendingBase = {
      ...state,
      stats: newStats,
      flags: newFlags,
      yearsReigned: state.yearsReigned + yearAdvance,
      currentYear: state.currentYear + yearAdvance,
      currentArc: nextArc,
      unlockedSuKy: newSuKy,
      inventory: newInventory,
      eventHistory: [...state.eventHistory, state.currentEvent.id],
      lastChoice: choice,
      showFactPopup: !!choice.fact,
      pendingFact: choice.fact ? { text: choice.fact, isHistorical: choice.isHistorical } : null,
      pendingArcIntro: choice.endArc ? nextArc : null,
    }
    const nextEvent = resolveNextEvent(pendingBase, choice)

    // 1. Check for item rescue
    const applicableItem = getApplicableItem(state.inventory || [], gameOverCheck.triggerStat)
    if (applicableItem) {
      return {
        ...state,
        gameStatus: 'item_rescue',
        gameOverReason: gameOverCheck.reason,
        lastChoice: choice,
        itemRescue: {
          itemId: applicableItem.id,
          triggerStat: gameOverCheck.triggerStat,
          pendingState: { ...pendingBase, currentEvent: nextEvent },
          rescuedStats: computeRescuedStats(pendingBase.stats, 20), // 20 bonus for item
        }
      }
    }

    // 2. Fallback to ad rescue
    if ((state.adRescueCount ?? 0) < 10) {
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
          rescuedStats: computeRescuedStats(pendingBase.stats, tier.bonus),
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

  const yearAdvance = state.currentEvent.type === 'battle' || state.currentEvent.type === 'campaign' ? 2 : YEAR_PER_CARD
  const newYear = state.currentYear + yearAdvance
  const newYearsReigned = state.yearsReigned + yearAdvance

  const newSuKy = choice.unlockSuKy
    ? [...new Set([...state.unlockedSuKy, choice.unlockSuKy])]
    : state.unlockedSuKy

  let newInventory = choice.giveItem && !(state.inventory || []).includes(choice.giveItem)
    ? [...(state.inventory || []), choice.giveItem]
    : (state.inventory || [])

  let activeQuest = state.activeQuest
  let questToast = null

  if (activeQuest) {
    let failed = false
    const { condition } = activeQuest
    if (condition.type === 'maintain_stat') {
      const statVal = newStats[condition.stat]
      if (condition.min !== undefined && statVal < condition.min) failed = true
      if (condition.max !== undefined && statVal > condition.max) failed = true
    }
    
    if (failed) {
      questToast = { status: 'failed', title: activeQuest.title, desc: 'Mật chỉ thất bại' }
      activeQuest = null
    } else {
      activeQuest = { ...activeQuest, progress: (activeQuest.progress || 0) + 1 }
      if (activeQuest.progress >= activeQuest.duration) {
        questToast = { status: 'completed', title: activeQuest.title, desc: 'Mật chỉ thành công!', reward: activeQuest.rewardItem }
        if (activeQuest.rewardItem && !newInventory.includes(activeQuest.rewardItem)) {
          newInventory = [...newInventory, activeQuest.rewardItem]
        }
        activeQuest = null
      }
    }
  }

  const newFlags = { ...state.flags }
  if (choice.setFlag) Object.assign(newFlags, choice.setFlag)

  const nextArc = choice.endArc ? state.currentArc + 1 : state.currentArc

  const stateForEndingCheck = {
    ...state,
    stats: newStats,
    flags: newFlags,
    inventory: newInventory,
    activeQuest,
    questToast,
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

// ─── Combat Processing ────────────────────────────────────────────────────────
export function processCombatChoice(state, choiceId) {
  const cState = state.combatState
  const card = cState.currentCard
  const choice = card.choices.find(c => c.id === choiceId)
  
  const newPlayerHP = Math.min(cState.maxPlayerHP, Math.max(0, cState.playerHP + (choice.playerHPDelta || 0)))
  const newEnemyHP = Math.max(0, cState.enemyHP + (choice.enemyHPDelta || 0))
  
  if (newPlayerHP <= 0) {
    const newStats = { ...state.stats, binhLuc: 0 }
    return {
      ...state,
      stats: newStats,
      gameStatus: 'gameover',
      gameOverReason: 'Đại quân tan vỡ, ngài tử trận sa trường!',
      combatState: null
    }
  }
  
  if (newEnemyHP <= 0) {
    const pendingChoiceId = cState.pendingChoiceId
    const resumedState = { 
      ...state, 
      gameStatus: 'playing', 
      combatState: null, 
      questToast: { status: 'completed', title: 'Thắng Trận!', desc: 'Quân địch đã bị tiêu diệt hoàn toàn!' } 
    }
    const tempState = { ...resumedState, currentEvent: { ...resumedState.currentEvent, type: 'normal' } }
    return processChoice(tempState, pendingChoiceId)
  }
  
  return {
    ...state,
    combatState: {
      ...cState,
      playerHP: newPlayerHP,
      enemyHP: newEnemyHP,
      currentCard: getRandomCombatCard()
    }
  }
}

// ─── Trivia Processing ──────────────────────────────────────────────────────────
export function processTriviaResult(state, isCorrect) {
  const effects = {
    trieuCuong: isCorrect ? -10 : 10,
    danTam: isCorrect ? 15 : -5,
    quocKho: isCorrect ? 10 : 0,
    binhLuc: 0
  }
  
  const newStats = applyEffects(state.stats, effects)
  const gameOverCheck = checkGameOver(newStats)

  if (gameOverCheck.isOver) {
    return {
      ...state,
      stats: newStats,
      gameStatus: 'gameover',
      gameOverReason: gameOverCheck.reason,
      triviaData: null,
    }
  }

  return {
    ...state,
    stats: newStats,
    gameStatus: 'playing',
    triviaData: null,
    questToast: isCorrect 
      ? { status: 'completed', title: 'Khoa Cử Thành Công', desc: 'Chọn được người tài, quốc gia hưng thịnh!' }
      : { status: 'failed', title: 'Khoa Cử Thất Bại', desc: 'Tuyển nhầm nịnh thần, triều cương rối ren!' }
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

  // Trigger Trivia every 15 years
  if (base.yearsReigned - base.lastTriviaYear >= 15 && base.yearsReigned > 0) {
    const trivia = getRandomTrivia()
    return {
      ...base,
      gameStatus: 'trivia',
      triviaData: trivia,
      lastTriviaYear: base.yearsReigned
    }
  }

  return base
}
