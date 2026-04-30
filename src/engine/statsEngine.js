import { DANGER_MIN, DANGER_MAX, STAT_FLOOR, STAT_CEIL, GAME_OVER_MESSAGES, STAT_KEYS } from '../constants/gameConfig'

export function applyEffects(stats, effects, activeTitle = null) {
  const next = { ...stats }
  
  // Base effects
  for (const key of STAT_KEYS) {
    if (effects[key] !== undefined) {
      next[key] = next[key] + effects[key]
    }
  }

  // Title Passive Buffs
  if (activeTitle === 'nhan_tong') {
    next.danTam += 1 // +1 Dân Tâm every turn
  }
  if (activeTitle === 'chien_than') {
    next.binhLuc += 1 // +1 Binh Lực every turn
  }
  if (activeTitle === 'thai_binh') {
    next.quocKho += 1 // +1 Quốc Khố every turn
  }

  // Clamp values
  for (const key of STAT_KEYS) {
    next[key] = Math.min(STAT_CEIL, Math.max(STAT_FLOOR, next[key]))
  }

  return next
}

export function checkGameOver(stats) {
  for (const key of STAT_KEYS) {
    const val = stats[key]
    if (val <= DANGER_MIN) {
      return { isOver: true, triggerStat: `${key}_low`, reason: GAME_OVER_MESSAGES[`${key}_min`] || 'Triều đại sụp đổ...' }
    }
    if ((key === 'binhLuc' || key === 'trieuCuong') && val >= DANGER_MAX) {
      return { isOver: true, triggerStat: `${key}_high`, reason: GAME_OVER_MESSAGES[`${key}_max`] || 'Mất kiểm soát triều đình...' }
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

export function evaluateTitle(stats) {
  if (stats.danTam >= 80) return 'nhan_tong'
  if (stats.binhLuc >= 80) return 'chien_than'
  if (stats.quocKho >= 80) return 'thai_binh'
  return null
}

export const TITLES_META = {
  nhan_tong: { name: 'Nhân Tông', buff: '+1 Dân tâm/lượt' },
  chien_than: { name: 'Chiến Thần', buff: '+1 Binh lực/lượt' },
  thai_binh: { name: 'Thái Bình', buff: '+1 Quốc khố/lượt' }
}
