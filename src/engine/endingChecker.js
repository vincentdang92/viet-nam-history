import endings from '../data/endings.json'

const SORTED_ENDINGS = [...endings].sort(
  (a, b) => Object.keys(b.conditions).length - Object.keys(a.conditions).length
)

export function checkEnding(state) {
  const { currentArc, stats, flags, yearsReigned } = state

  // Arc 1-2: never trigger endings
  if (currentArc < 3) return { hasEnding: false }
  // Arc 4: pure transition arc, no endings
  if (currentArc === 4) return { hasEnding: false }

  for (const ending of SORTED_ENDINGS) {
    const c = ending.conditions
    let match = true

    // Arc range gates
    if (c.minArc !== undefined && currentArc < c.minArc) match = false
    if (c.maxArc !== undefined && currentArc > c.maxArc) match = false

    // Year / stat / flag conditions
    if (c.minYears    !== undefined && yearsReigned < c.minYears)          match = false
    if (c.wonBattle1257  !== undefined && flags.wonBattle1257  !== c.wonBattle1257)  match = false
    if (c.wonBattle1285  !== undefined && flags.wonBattle1285  !== c.wonBattle1285)  match = false
    if (c.wonBattle1288  !== undefined && flags.wonBattle1288  !== c.wonBattle1288)  match = false
    if (c.wonBattleTotDong !== undefined && flags.wonBattleTotDong !== c.wonBattleTotDong) match = false
    if (c.wonBattleChiLang !== undefined && flags.wonBattleChiLang !== c.wonBattleChiLang) match = false
    if (c.proclamedBinhNgo !== undefined && flags.proclamedBinhNgo !== c.proclamedBinhNgo) match = false
    if (c.minDanTam   !== undefined && stats.danTam   < c.minDanTam)       match = false
    if (c.minQuocKho  !== undefined && stats.quocKho  < c.minQuocKho)      match = false
    if (c.maxTrieuCuong !== undefined && stats.trieuCuong > c.maxTrieuCuong) match = false

    if (match) return { hasEnding: true, endingId: ending.id }
  }

  // Catch-all: only for arc 3 (Nhà Trần era). Arc 5 catch-all below.
  if (currentArc === 3) return { hasEnding: true, endingId: 'ending_default' }

  // Arc 5 catch-all
  if (currentArc === 5) return { hasEnding: true, endingId: 'ending_doc_lap' }

  // Arc 6 catch-all
  if (currentArc >= 6) return { hasEnding: true, endingId: 'ending_nam_bac_trieu' }

  return { hasEnding: false }
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
