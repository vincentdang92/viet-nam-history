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
