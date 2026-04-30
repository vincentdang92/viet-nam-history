import arc1 from '../data/chapters/tran_dynasty/arc1_lap_quoc.json'
import arc2 from '../data/chapters/tran_dynasty/arc2_khang_nguyen.json'
import arc3 from '../data/chapters/tran_dynasty/arc3_thinh_roi_suy.json'
import arc4 from '../data/chapters/tran_dynasty/arc4_nha_ho.json'
import arc5 from '../data/chapters/tran_dynasty/arc5_lam_son.json'
import sysEvents from '../data/sysEvents.json'
import mythicEvents from '../data/mythicEvents.json'

const ARCS = { 1: arc1, 2: arc2, 3: arc3, 4: arc4, 5: arc5 }

export function loadEvent(id) {
  for (const arc of Object.values(ARCS)) {
    const ev = arc.events.find(e => e.id === id)
    if (ev) return ev
  }
  if (sysEvents[id]) return sysEvents[id]
  return null
}

export function getFirstEvent(arcId = 1) {
  return applyRarity(ARCS[arcId]?.events[0] ?? null)
}

function applyRarity(event) {
  if (!event || event.rarity) return event // Already has rarity (e.g. mythic)
  
  const roll = Math.random()
  if (roll < 0.02) return { ...event, rarity: 'legendary' } // 2%
  if (roll < 0.08) return { ...event, rarity: 'epic' }      // 6%
  if (roll < 0.20) return { ...event, rarity: 'rare' }      // 12%
  
  return { ...event, rarity: 'common' }
}

function getRandomMythicEvent(eventHistory) {
  const available = Object.values(mythicEvents).filter(e => !eventHistory?.includes(e.id))
  if (available.length === 0) return null
  const idx = Math.floor(Math.random() * available.length)
  return available[idx]
}

export function resolveNextEvent(state, choice) {
  // 1. Mythic Event Encounter (5% chance if not chaining)
  if (!choice.chainNext && !choice.endArc) {
    if (Math.random() < 0.05) {
      const mythic = getRandomMythicEvent(state.eventHistory)
      if (mythic) return mythic
    }
    
    // 2. Merchant Encounter (10% chance if not chaining)
    if (Math.random() < 0.10 && sysEvents['sys_merchant']) {
      return sysEvents['sys_merchant']
    }
  }

  // 3. Chained event
  if (choice.chainNext) {
    return applyRarity(loadEvent(choice.chainNext))
  }

  if (choice.endArc) {
    // gameEngine.js already incremented currentArc — use it directly
    if (ARCS[state.currentArc]) {
      return applyRarity(ARCS[state.currentArc].events[0])
    }
    return null
  }

  const currentArcEvents = ARCS[state.currentArc]?.events ?? []
  const currentIdx = currentArcEvents.findIndex(e => e.id === state.currentEvent.id)
  const nextEvent = currentArcEvents[currentIdx + 1]

  if (nextEvent) return applyRarity(nextEvent)

  const nextArcId = state.currentArc + 1
  if (ARCS[nextArcId]) {
    return applyRarity(ARCS[nextArcId].events[0])
  }
  return null
}

export function getArcIntro(arcId) {
  return ARCS[arcId]?.intro ?? ''
}
