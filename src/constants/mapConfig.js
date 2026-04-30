export const MAP_NODES = {
  thang_long: { id: 'thang_long', name: 'Thăng Long', x: 50, y: 30 },
  van_kiep: { id: 'van_kiep', name: 'Vạn Kiếp', x: 70, y: 20 },
  binh_than: { id: 'binh_than', name: 'Bình Than', x: 65, y: 35 },
  bach_dang: { id: 'bach_dang', name: 'Bạch Đằng', x: 85, y: 40 },
  chuong_duong: { id: 'chuong_duong', name: 'Chương Dương', x: 55, y: 45 },
  ham_tu: { id: 'ham_tu', name: 'Hàm Tử', x: 60, y: 55 },
  thien_truong: { id: 'thien_truong', name: 'Thiên Trường', x: 65, y: 70 },
  thanh_hoa: { id: 'thanh_hoa', name: 'Thanh Hóa', x: 30, y: 80 },
  chiem_thanh: { id: 'chiem_thanh', name: 'Chiêm Thành (Phía Nam)', x: 10, y: 95 }
}

export const MAP_EDGES = [
  ['thang_long', 'van_kiep'],
  ['thang_long', 'binh_than'],
  ['thang_long', 'chuong_duong'],
  ['van_kiep', 'bach_dang'],
  ['binh_than', 'bach_dang'],
  ['chuong_duong', 'ham_tu'],
  ['ham_tu', 'thien_truong'],
  ['thien_truong', 'thanh_hoa'],
  ['thanh_hoa', 'chiem_thanh']
]

// Mặc định các cứ điểm đều thuộc quyền kiểm soát của Đại Việt ('player')
// Các trạng thái có thể có: 'player' | 'enemy' | 'contested'
export const INITIAL_MAP_STATE = {
  thang_long: 'player',
  van_kiep: 'player',
  binh_than: 'player',
  bach_dang: 'player',
  chuong_duong: 'player',
  ham_tu: 'player',
  thien_truong: 'player',
  thanh_hoa: 'player',
  chiem_thanh: 'enemy' // Toa Đô đang ở đây
}
