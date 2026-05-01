import { applyEffects, checkGameOver, evaluateTitle } from './statsEngine'
import { resolveNextEvent, loadEvent } from './eventResolver'
import { checkEnding } from './endingChecker'
import { YEAR_PER_CARD, DANGER_MIN, DANGER_MAX, STAT_CEIL } from '../constants/gameConfig'
import { getApplicableItem } from '../data/items'
import { getRandomTrivia } from '../data/trivia'
import { getRandomCombatCard } from '../data/combat'
import { COMPANIONS_DATA } from '../data/companions'

const MAX_NEG_EFFECT = 15
const MAX_POS_EFFECT = 20

// Exported so GameContext can recompute rescuedStats from old saves that don't have it
export function computeRescuedStats(stats, bonus, triggerStat) {
  const result = { ...stats }
  if (!triggerStat) return result

  const [key, direction] = triggerStat.split('_')
  if (!result[key]) return result

  if (direction === 'low') {
    // Current is dangerously low. Rescue brings it up safely above DANGER_MIN.
    result[key] = Math.max(DANGER_MIN + 16, result[key] + bonus)
  } else if (direction === 'high') {
    // Current is dangerously high. Rescue brings it down safely below DANGER_MAX.
    result[key] = Math.min(DANGER_MAX - 16, result[key] - bonus)
  }
  
  return result
}

export function handleRescueOrGameOver(stateBase, gameOverCheck, nextEvent, choice) {
  // 1. Check for item rescue
  const applicableItem = getApplicableItem(stateBase.inventory || [], gameOverCheck.triggerStat)
  if (applicableItem) {
    return {
      ...stateBase,
      gameStatus: 'item_rescue',
      gameOverReason: gameOverCheck.reason,
      lastChoice: choice,
      itemRescue: {
        itemId: applicableItem.id,
        triggerStat: gameOverCheck.triggerStat,
        pendingState: { ...stateBase, currentEvent: nextEvent },
        rescuedStats: computeRescuedStats(stateBase.stats, 20, gameOverCheck.triggerStat), // 20 bonus for item
      }
    }
  }

  // 2. Fallback to ad rescue
  if ((stateBase.adRescueCount ?? 0) < 10) {
    const AD_TIERS = [
      { duration: 5,  bonus: 10 },
      { duration: 10, bonus: 20 },
      { duration: 15, bonus: 30 },
    ]
    const tier = AD_TIERS[Math.floor(Math.random() * 3)]

    return {
      ...stateBase,
      gameStatus: 'ad_rescue',
      gameOverReason: gameOverCheck.reason,
      lastChoice: choice,
      adRescue: {
        duration: tier.duration,
        bonus: tier.bonus,
        triggerStat: gameOverCheck.triggerStat,
        pendingState: { ...stateBase, currentEvent: nextEvent },
        rescuedStats: computeRescuedStats(stateBase.stats, tier.bonus, gameOverCheck.triggerStat),
      },
    }
  }

  // 3. Game Over (no rescue left)
  const endingCheck = checkEnding(stateBase, true)
  if (endingCheck.hasEnding) {
    return {
      ...stateBase,
      gameStatus: 'ending',
      endingId: endingCheck.endingId,
      lastChoice: choice,
      endingDebugInfo: {
        isGameOver: true,
        triggerStat: gameOverCheck.triggerStat,
        reason: gameOverCheck.reason,
        nextEvent: nextEvent,
      }
    }
  }

  return {
    ...stateBase,
    gameStatus: 'gameover',
    gameOverReason: gameOverCheck.reason,
    lastChoice: choice,
  }
}

export function processChoice(state, choiceId) {
  const choice = state.currentEvent.choices.find(c => c.id === choiceId)
  if (!choice) return state

  // Intercept 'battle' type events to trigger the Combat Mini-game
  if (state.currentEvent.type === 'battle' && state.gameStatus !== 'combat' && state.gameStatus !== 'companion_selection') {
    const hasCompanions = state.unlockedCompanions && state.unlockedCompanions.length > 0;
    
    return {
      ...state,
      gameStatus: hasCompanions ? 'companion_selection' : 'combat',
      combatState: {
        playerHP: 100,
        maxPlayerHP: 100,
        enemyHP: 100,
        maxEnemyHP: 100,
        enemyName: state.currentEvent.enemyName || 'Quân Địch',
        currentCard: getRandomCombatCard(),
        pendingChoiceId: choiceId,
        companionBuffs: false
      }
    }
  }

  // Intercept 'espionage' type events
  if (choice.espionageData && state.gameStatus !== 'espionage') {
    return {
      ...state,
      gameStatus: 'espionage',
      espionageState: {
        data: choice.espionageData,
        pendingChoiceId: choiceId
      }
    }
  }

  // Intercept 'poetry' type events
  if (state.currentEvent.type === 'poetry' && choice.poetryData && state.gameStatus !== 'poetry_puzzle') {
    return {
      ...state,
      gameStatus: 'poetry_puzzle',
      poetryState: {
        data: choice.poetryData,
        pendingChoiceId: choiceId
      }
    }
  }

  let effectsToApply = { ...(choice.effects || {}) }
  const rarity = state.currentEvent.rarity || 'common'
  
  if (rarity === 'legendary') {
    for (const key in effectsToApply) {
      if (effectsToApply[key] > 0) effectsToApply[key] *= 2
      else if (effectsToApply[key] < 0) effectsToApply[key] = 0
    }
  } else if (rarity === 'epic') {
    for (const key in effectsToApply) {
      if (effectsToApply[key] > 0) effectsToApply[key] = Math.floor(effectsToApply[key] * 1.5)
      else if (effectsToApply[key] < 0) effectsToApply[key] = Math.floor(effectsToApply[key] * 0.5)
    }
  } else if (rarity === 'rare') {
    for (const key in effectsToApply) {
      if (effectsToApply[key] > 0) effectsToApply[key] = Math.floor(effectsToApply[key] * 1.2)
    }
  }

  const newStats = applyEffects(state.stats, effectsToApply, state.activeTitle)
  const newTitle = evaluateTitle(newStats)

  let newHistoricalScore = state.historicalScore ?? 100
  let questToast = state.questToast

  if (choice.isHistorical !== undefined) {
    newHistoricalScore = Math.min(100, newHistoricalScore + (choice.isHistorical ? 10 : -20))
  }

  // No more Permadeath for Historical Score
  if (newHistoricalScore <= 0 && (state.historicalScore ?? 100) > 0) {
    questToast = { status: 'failed', title: 'Cảnh Báo Lịch Sử!', desc: 'Dòng thời gian đang hỗn loạn! Hãy hành động theo đúng lịch sử để xoay chuyển.' }
  }
  newHistoricalScore = Math.max(0, newHistoricalScore)

  const gameOverCheck = choice.endArc ? { isOver: false } : checkGameOver(newStats)
  if (gameOverCheck.isOver) {
    const yearAdvance = state.currentEvent.type === 'battle' || state.currentEvent.type === 'campaign' ? 2 : YEAR_PER_CARD
    const nextArc = choice.endArc ? state.currentArc + 1 : state.currentArc
    const newSuKy = choice.unlockSuKy
      ? [...new Set([...state.unlockedSuKy, choice.unlockSuKy])]
      : state.unlockedSuKy
    const newFlags = { ...state.flags }
    if (choice.setFlag) Object.assign(newFlags, choice.setFlag)

    // 0. Check Crisis (Second Chance)
    let crisisEventId = null
    if (gameOverCheck.triggerStat === 'danTam_low' && !state.flags.hasTriggeredCrisisDanTam) {
      crisisEventId = 'sys_crisis_danTam'
      newFlags.hasTriggeredCrisisDanTam = true
    } else if (gameOverCheck.triggerStat === 'quocKho_low' && !state.flags.hasTriggeredCrisisQuocKho) {
      crisisEventId = 'sys_crisis_quocKho'
      newFlags.hasTriggeredCrisisQuocKho = true
    }

    const newInventory = choice.giveItem && !(state.inventory || []).includes(choice.giveItem)
      ? [...(state.inventory || []), choice.giveItem]
      : (state.inventory || [])
      
    let newMapState = state.mapState
    if (choice.setMapNode) {
      newMapState = { ...state.mapState, ...choice.setMapNode }
    }
    
    let newFactionState = state.factionState
    if (choice.setCharacterStatus) {
      newFactionState = { ...state.factionState, ...choice.setCharacterStatus }
    }

    const pendingBase = {
      ...state,
      stats: newStats,
      historicalScore: newHistoricalScore,
      flags: newFlags,
      yearsReigned: state.yearsReigned + yearAdvance,
      currentYear: state.currentYear + yearAdvance,
      currentArc: nextArc,
      unlockedSuKy: newSuKy,
      inventory: newInventory,
      mapState: newMapState,
      factionState: newFactionState,
      activeTitle: newTitle,
      eventHistory: [...state.eventHistory, state.currentEvent.id],
      lastChoice: choice,
      showFactPopup: !!choice.fact,
      pendingFact: choice.fact ? { 
        text: choice.fact, 
        isHistorical: choice.isHistorical, 
        eventId: state.currentEvent.id,
        modernLocation: choice.modernLocation,
        specialty: choice.specialty,
        referenceLink: choice.referenceLink
      } : null,
      pendingArcIntro: choice.endArc ? nextArc : null,
      questToast,
    }

    if (crisisEventId) {
      const crisisEvent = loadEvent(crisisEventId)
      if (crisisEvent) {
        // Resolve where the game WOULD have gone if not interrupted
        const nextEvent = resolveNextEvent(pendingBase, choice)
        // Inject that destination into the crisis event's choices
        const injectedCrisis = {
          ...crisisEvent,
          choices: crisisEvent.choices.map(c => ({ ...c, chainNext: nextEvent?.id }))
        }
        return {
          ...pendingBase,
          currentEvent: injectedCrisis,
          gameStatus: 'playing', // Bypass game over
        }
      }
    }

    const nextEvent = resolveNextEvent(pendingBase, choice)
    return handleRescueOrGameOver(pendingBase, gameOverCheck, nextEvent, choice)
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
  const nextEvent = resolveNextEvent({ ...state, currentArc: nextArc }, choice)

  const stateForEndingCheck = {
    ...state,
    stats: newStats,
    historicalScore: newHistoricalScore,
    flags: newFlags,
    inventory: newInventory,
    activeQuest,
    questToast,
    yearsReigned: newYearsReigned,
    currentArc: nextArc,
    currentEvent: nextEvent,
    pendingArcIntro: choice.endArc ? nextArc : null,
  }

  // Only check for endings when an arc finishes
  let endingCheck = { hasEnding: false }
  if (choice.endArc) {
    endingCheck = checkEnding({ ...stateForEndingCheck, currentArc: state.currentArc })
  }

  if (endingCheck.hasEnding) {
    return {
      ...stateForEndingCheck,
      gameStatus: 'ending',
      endingId: endingCheck.endingId,
      unlockedSuKy: newSuKy,
      lastChoice: choice,
      // Show fact before the ending screen
      showFactPopup: true,
      pendingFact: { 
        text: choice.fact, 
        isHistorical: choice.isHistorical,
        modernLocation: choice.modernLocation,
        specialty: choice.specialty,
        referenceLink: choice.referenceLink
      },
      pendingEnding: endingCheck.endingId,
      endingDebugInfo: {
        isGameOver: false,
      }
    }
  }

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
      pendingFact: { 
        text: choice.fact, 
        isHistorical: choice.isHistorical,
        modernLocation: choice.modernLocation,
        specialty: choice.specialty,
        referenceLink: choice.referenceLink
      },
      pendingEnding: fallbackEndingId,
      endingDebugInfo: {
        isGameOver: false,
      }
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
    pendingFact: { 
      text: choice.fact, 
      isHistorical: choice.isHistorical,
      modernLocation: choice.modernLocation,
      specialty: choice.specialty,
      referenceLink: choice.referenceLink
    },
    // Signal arc transition after fact popup dismissal
    pendingArcIntro: choice.endArc ? nextArc : null,
  }
}

// ─── Combat Processing ────────────────────────────────────────────────────────
export function processCombatChoice(state, choiceId) {
  const cState = state.combatState
  const card = cState.currentCard
  const choice = card.choices.find(c => c.id === choiceId)
  
  const comp = state.selectedCompanion ? COMPANIONS_DATA[state.selectedCompanion] : null

  let playerDamageTaken = choice.playerHPDelta || 0
  let enemyDamageTaken = choice.enemyHPDelta || 0

  let dodgedFirstHit = cState.dodgedFirstHit || false

  if (comp) {
    if (comp.effect.type === 'dodge_first_hit' && !dodgedFirstHit && playerDamageTaken < 0) {
      playerDamageTaken = 0
      dodgedFirstHit = true
    }
    if (comp.effect.type === 'buff_damage' && enemyDamageTaken < 0) {
      enemyDamageTaken = Math.floor(enemyDamageTaken * (1 + comp.effect.value / 100))
    }
  }
  
  const newPlayerHP = Math.min(cState.maxPlayerHP, Math.max(0, cState.playerHP + playerDamageTaken))
  const newEnemyHP = Math.max(0, cState.enemyHP + enemyDamageTaken)
  
  if (newPlayerHP <= 0) {
    const newStats = { ...state.stats, binhLuc: 0 }
    const gameOverCheck = { isOver: true, triggerStat: 'binhLuc_low', reason: 'Đại quân tan vỡ, ngài tử trận sa trường!' }
    
    // Resolve what event we would have gone to if we had survived
    const mainPendingChoiceId = cState.pendingChoiceId
    const mainChoice = state.currentEvent.choices.find(c => c.id === mainPendingChoiceId)
    const pendingBase = { ...state, stats: newStats, combatState: null, gameStatus: 'playing' }
    
    // Fake the event type to normal so we don't infinitely trigger combat
    const tempState = { ...pendingBase, currentEvent: { ...pendingBase.currentEvent, type: 'normal' } }
    const nextEvent = resolveNextEvent(tempState, mainChoice)
    
    return handleRescueOrGameOver(pendingBase, gameOverCheck, nextEvent, mainChoice)
  }
  
  if (newEnemyHP <= 0) {
    const pendingChoiceId = cState.pendingChoiceId
    let resumedState = { 
      ...state, 
      gameStatus: 'playing', 
      combatState: null, 
      questToast: { status: 'completed', title: 'Thắng Trận!', desc: 'Quân địch đã bị tiêu diệt hoàn toàn!' } 
    }
    
    if (comp && comp.effect.type === 'bonus_reward') {
      resumedState.stats = {
        ...resumedState.stats,
        [comp.effect.stat]: Math.min(100, resumedState.stats[comp.effect.stat] + comp.effect.value)
      }
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
      dodgedFirstHit,
      currentCard: getRandomCombatCard()
    }
  }
}

// ─── Espionage Processing ────────────────────────────────────────────────────────
export function processEspionageResult(state, isSuccess) {
  const eData = state.espionageState.data
  const pendingChoiceId = state.espionageState.pendingChoiceId
  const currentChoice = state.currentEvent.choices.find(c => c.id === pendingChoiceId)
  
  const effects = isSuccess ? eData.reward : eData.penalty
  const newStats = applyEffects(state.stats, effects)
  const gameOverCheck = checkGameOver(newStats)

  if (gameOverCheck.isOver) {
    const pendingBase = { ...state, stats: newStats, espionageState: null, gameStatus: 'playing' }
    const nextEvent = resolveNextEvent(pendingBase, currentChoice)
    return handleRescueOrGameOver(pendingBase, gameOverCheck, nextEvent, currentChoice)
  }

  // Inject the dynamically calculated effects into a fake choice so processChoice can handle the rest
  const tempState = { ...state, gameStatus: 'playing', espionageState: null, stats: newStats }
  
  const mergedEffects = { ...currentChoice.effects }
  if (effects) {
    for (const k in effects) {
      mergedEffects[k] = (mergedEffects[k] || 0) + effects[k]
    }
  }

  const modifiedChoice = { ...currentChoice, effects: mergedEffects, espionageData: null }
  const modifiedEvent = { ...tempState.currentEvent, choices: tempState.currentEvent.choices.map(c => c.id === pendingChoiceId ? modifiedChoice : c) }
  const stateWithModifiedEvent = { ...state, gameStatus: 'playing', espionageState: null, currentEvent: modifiedEvent }
  
  let newHistoricalScore = state.historicalScore
  if (effects && effects.historicalScore) {
    newHistoricalScore = Math.max(0, Math.min(100, newHistoricalScore + effects.historicalScore))
  }
  
  return processChoice({ ...stateWithModifiedEvent, historicalScore: newHistoricalScore }, pendingChoiceId)
}

export function processPoetryResult(state, isSuccess) {
  if (state.gameStatus !== 'poetry_puzzle' || !state.poetryState) return state

  const { data, pendingChoiceId } = state.poetryState
  const effects = isSuccess ? data.reward : data.penalty

  const currentEvent = state.currentEvent
  const originalChoice = currentEvent.choices.find(c => c.id === pendingChoiceId)
  
  const modifiedChoice = {
    ...originalChoice,
    effects: { ...(originalChoice.effects || {}), ...effects }
  }

  const stateWithModifiedEvent = {
    ...state,
    gameStatus: 'playing',
    poetryState: null,
    currentEvent: {
      ...currentEvent,
      choices: currentEvent.choices.map(c => c.id === pendingChoiceId ? modifiedChoice : c),
      type: 'normal' // Prevent infinite loop
    }
  }

  return processChoice(stateWithModifiedEvent, pendingChoiceId)
}

// ─── Utilities ──────────────────────────────────────────────────────────────────
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
    const pendingBase = { ...state, stats: newStats, triviaData: null, gameStatus: 'playing' }
    // Trivia returns to the exact same event
    const nextEvent = pendingBase.currentEvent
    return handleRescueOrGameOver(pendingBase, gameOverCheck, nextEvent, null)
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
    const trivia = getRandomTrivia(base.currentArc, base.triviaHistory || [])
    return {
      ...base,
      gameStatus: 'trivia',
      triviaData: trivia,
      triviaHistory: [...(base.triviaHistory || []), trivia.id],
      lastTriviaYear: base.yearsReigned
    }
  }

  return base
}
