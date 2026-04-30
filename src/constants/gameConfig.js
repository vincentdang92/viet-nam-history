export const STAT_KEYS = ['binhLuc', 'danTam', 'quocKho', 'trieuCuong']

export const STAT_META = {
  binhLuc:    { label: 'Binh Lực',   icon: '⚔️', color: '#C0392B', tailwind: 'bg-red-700' },
  danTam:     { label: 'Dân Tâm',    icon: '👥', color: '#27AE60', tailwind: 'bg-green-600' },
  quocKho:    { label: 'Quốc Khố',   icon: '💰', color: '#F39C12', tailwind: 'bg-yellow-500' },
  trieuCuong: { label: 'Triều Cương', icon: '📜', color: '#8E44AD', tailwind: 'bg-purple-700' },
}

export const DANGER_MIN = 15
export const DANGER_MAX = 85
export const STAT_INITIAL = 50
export const STAT_FLOOR = 0
export const STAT_CEIL = 100

export const GAME_OVER_MESSAGES = {
  binhLuc_min: 'Quân giặc tràn vào Thăng Long, triều đình sụp đổ...',
  danTam_min: 'Trăm họ nổi dậy, vua phải bỏ ngai vàng chạy trốn...',
  quocKho_min: 'Ngân khố cạn kiệt, quân lính bỏ trốn, triều đình tan rã...',
  trieuCuong_min: 'Quyền thần soán ngôi, dòng họ nhà vua bị diệt...',
  binhLuc_max: 'Tướng lĩnh lộng quyền, đảo chính lật đổ triều đình...',
  trieuCuong_max: 'Vua độc đoán, triều thần phản loạn tập thể...',
}

export const YEAR_PER_CARD = 3

export const CONTRIBUTION_TITLES = [
  { score: 150, title: 'Quốc Sử Viện Giám Tu', color: '#F59E0B' }, // amber-500
  { score: 100, title: 'Sử Quan', color: '#EAB308' },             // yellow-500
  { score: 75,  title: 'Trạng Nguyên', color: '#EF4444' },        // red-500
  { score: 50,  title: 'Bảng Nhãn', color: '#F97316' },           // orange-500
  { score: 35,  title: 'Tiến Sĩ', color: '#A855F7' },             // purple-500
  { score: 20,  title: 'Cử Nhân', color: '#3B82F6' },             // blue-500
  { score: 10,  title: 'Hương Cống', color: '#06B6D4' },          // cyan-500
  { score: 5,   title: 'Tú Tài', color: '#14B8A6' },              // teal-500
  { score: 1,   title: 'Thư Sinh', color: '#22C55E' },            // green-500
  { score: 0,   title: 'Kẻ Hiếu Kỳ', color: '#9CA3AF' }           // gray-400
]

export function getContributionTitle(score) {
  const numScore = score || 0
  for (const tier of CONTRIBUTION_TITLES) {
    if (numScore >= tier.score) return tier
  }
  return CONTRIBUTION_TITLES[CONTRIBUTION_TITLES.length - 1]
}

export const ARENA_BOTS = [
  { id: 'bot1', playerName: 'Trần Hưng Đạo', score: 15000, isBot: true },
  { id: 'bot2', playerName: 'Chu Văn An', score: 12500, isBot: true },
  { id: 'bot3', playerName: 'Mạc Đĩnh Chi', score: 10000, isBot: true },
  { id: 'bot4', playerName: 'Nguyễn Hiền', score: 8500, isBot: true },
  { id: 'bot5', playerName: 'Phạm Ngũ Lão', score: 7000, isBot: true },
  { id: 'bot6', playerName: 'Trần Thủ Độ', score: 5500, isBot: true },
  { id: 'bot7', playerName: 'Trần Quốc Toản', score: 4000, isBot: true },
  { id: 'bot8', playerName: 'Lê Phụ Trần', score: 2500, isBot: true },
  { id: 'bot9', playerName: 'Yết Kiêu', score: 1500, isBot: true },
  { id: 'bot10', playerName: 'Dã Tượng', score: 1000, isBot: true },
]
