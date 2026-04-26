import endings from '../data/endings.json'

// Sorted most-specific (most conditions) first so stricter endings match before looser ones.
const SORTED_ENDINGS = [...endings].sort(
  (a, b) => Object.keys(b.conditions).length - Object.keys(a.conditions).length
)

export function checkEnding(state) {
  // Only evaluate endings once the player is past arc 2
  if (state.currentArc < 3) return { hasEnding: false }

  const { stats, flags, yearsReigned } = state

  for (const ending of SORTED_ENDINGS) {
    const c = ending.conditions
    let match = true

    if (c.minYears !== undefined && yearsReigned < c.minYears) match = false
    if (c.wonBattle1257 !== undefined && flags.wonBattle1257 !== c.wonBattle1257) match = false
    if (c.wonBattle1285 !== undefined && flags.wonBattle1285 !== c.wonBattle1285) match = false
    if (c.wonBattle1288 !== undefined && flags.wonBattle1288 !== c.wonBattle1288) match = false
    if (c.minDanTam !== undefined && stats.danTam < c.minDanTam) match = false
    if (c.minQuocKho !== undefined && stats.quocKho < c.minQuocKho) match = false
    if (c.maxTrieuCuong !== undefined && stats.trieuCuong > c.maxTrieuCuong) match = false

    if (match) return { hasEnding: true, endingId: ending.id }
  }

  // Catch-all: always award an ending when all arcs are done
  return { hasEnding: true, endingId: 'ending_default' }
}

export function getEnding(id) {
  return endings.find(e => e.id === id) ?? FALLBACK_ENDING
}

const FALLBACK_ENDING = {
  id: 'ending_default',
  title: 'Một Triều Đại Đã Qua',
  subtitle: 'Lịch sử không quên những người đã cố gắng',
  rating: 3,
  description: 'Nhà Trần khép lại sau hơn một thế kỷ trị vì. Có được, có mất — nhưng đất nước vẫn tiếp tục.',
  historicalNote: 'Nhà Trần tồn tại từ 1225 đến 1400, để lại di sản văn hóa và quân sự to lớn cho dân tộc Việt Nam.',
  unlockSuKy: [],
}
