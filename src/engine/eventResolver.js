import arc1 from '../data/chapters/tran_dynasty/arc1_lap_quoc.json'
import arc2 from '../data/chapters/tran_dynasty/arc2_khang_nguyen.json'
import arc3 from '../data/chapters/tran_dynasty/arc3_thinh_roi_suy.json'

const ARCS = { 1: arc1, 2: arc2, 3: arc3 }

export function loadEvent(id) {
  for (const arc of Object.values(ARCS)) {
    const ev = arc.events.find(e => e.id === id)
    if (ev) return ev
  }
  return null
}

export function getFirstEvent(arcId = 1) {
  return ARCS[arcId]?.events[0] ?? null
}

export function resolveNextEvent(state, choice) {
  if (choice.chainNext) {
    return loadEvent(choice.chainNext)
  }

  if (choice.endArc) {
    // gameEngine.js already incremented currentArc — use it directly
    if (ARCS[state.currentArc]) {
      return ARCS[state.currentArc].events[0]
    }
    return null
  }

  const currentArcEvents = ARCS[state.currentArc]?.events ?? []
  const currentIdx = currentArcEvents.findIndex(e => e.id === state.currentEvent.id)
  const nextEvent = currentArcEvents[currentIdx + 1]

  if (nextEvent) return nextEvent

  const nextArcId = state.currentArc + 1
  if (ARCS[nextArcId]) {
    return ARCS[nextArcId].events[0]
  }
  return null
}

export function getArcIntro(arcId) {
  return ARCS[arcId]?.intro ?? ''
}
