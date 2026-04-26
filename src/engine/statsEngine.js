import { DANGER_MIN, DANGER_MAX, STAT_FLOOR, STAT_CEIL, GAME_OVER_MESSAGES, STAT_KEYS } from '../constants/gameConfig'

export function applyEffects(stats, effects) {
  const next = { ...stats }
  for (const key of STAT_KEYS) {
    if (effects[key] !== undefined) {
      next[key] = Math.min(STAT_CEIL, Math.max(STAT_FLOOR, next[key] + effects[key]))
    }
  }
  return next
}

export function checkGameOver(stats) {
  for (const key of STAT_KEYS) {
    const val = stats[key]
    if (val <= DANGER_MIN) {
      return { isOver: true, reason: GAME_OVER_MESSAGES[`${key}_min`] || 'Triều đại sụp đổ...' }
    }
    if ((key === 'binhLuc' || key === 'trieuCuong') && val >= DANGER_MAX) {
      return { isOver: true, reason: GAME_OVER_MESSAGES[`${key}_max`] || 'Mất kiểm soát triều đình...' }
    }
  }
  return { isOver: false }
}

export function getDangerStats(stats) {
  const danger = {}
  for (const key of STAT_KEYS) {
    danger[key] = stats[key] <= DANGER_MIN + 10 || stats[key] >= DANGER_MAX - 10
  }
  return danger
}
