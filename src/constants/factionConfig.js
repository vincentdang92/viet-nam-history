export const FACTIONS = {
  royal: { id: 'royal', name: 'Hoàng Tộc' },
  military: { id: 'military', name: 'Tướng Lĩnh' },
  enemy: { id: 'enemy', name: 'Kẻ Địch' }
}

export const CHARACTER_NODES = {
  tran_nhan_tong: { id: 'tran_nhan_tong', name: 'Trần Nhân Tông', role: 'Hoàng Đế', faction: 'royal', icon: '👑' },
  tran_thanh_tong: { id: 'tran_thanh_tong', name: 'Trần Thánh Tông', role: 'Thái Thượng Hoàng', faction: 'royal', icon: '👴' },
  tran_quang_khai: { id: 'tran_quang_khai', name: 'Trần Quang Khải', role: 'Thái Sư', faction: 'royal', icon: '📜' },
  tran_ich_tac: { id: 'tran_ich_tac', name: 'Trần Ích Tắc', role: 'Chiêu Quốc Vương', faction: 'royal', icon: '🎭' },
  tran_hung_dao: { id: 'tran_hung_dao', name: 'Trần Hưng Đạo', role: 'Quốc Công Tiết Chế', faction: 'military', icon: '⚔️' },
  tran_quoc_toan: { id: 'tran_quoc_toan', name: 'Trần Quốc Toản', role: 'Hoài Văn Hầu', faction: 'military', icon: '🍊' },
  tran_binh_trong: { id: 'tran_binh_trong', name: 'Trần Bình Trọng', role: 'Bảo Nghĩa Vương', faction: 'military', icon: '🛡️' },
  pham_ngu_lao: { id: 'pham_ngu_lao', name: 'Phạm Ngũ Lão', role: 'Điện Súy Thượng Tướng', faction: 'military', icon: '🌾' },
  thoat_hoan: { id: 'thoat_hoan', name: 'Thoát Hoan', role: 'Trấn Nam Vương', faction: 'enemy', icon: '🐺' },
  toa_do: { id: 'toa_do', name: 'Toa Đô', role: 'Tả Thừa Tướng', faction: 'enemy', icon: '🏹' },
  o_ma_nhi: { id: 'o_ma_nhi', name: 'Ô Mã Nhi', role: 'Đại Tướng', faction: 'enemy', icon: '⚓' }
}

// Trạng thái mặc định: 'alive' (đang sống), 'dead' (tử trận), 'traitor' (phản tặc/kẻ địch)
export const INITIAL_FACTION_STATE = {
  tran_nhan_tong: 'alive',
  tran_thanh_tong: 'alive',
  tran_quang_khai: 'alive',
  tran_ich_tac: 'alive', // Sẽ thành 'traitor' sau này
  tran_hung_dao: 'alive',
  tran_quoc_toan: 'alive', // Sẽ thành 'dead' sau trận chiến
  tran_binh_trong: 'alive', // Sẽ thành 'dead'
  pham_ngu_lao: 'alive',
  thoat_hoan: 'alive',
  toa_do: 'alive',
  o_ma_nhi: 'alive'
}
