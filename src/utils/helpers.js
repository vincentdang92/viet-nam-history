export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val))
}

export function formatYear(year) {
  return `Năm ${year}`
}

export function getRatingStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

export const ARC_LABEL = {
  '-2': 'Cọc Tiêu Bạch Đằng',
  '-1': 'Mặc Giáp Xuất Chinh',
  0: 'Hào Khí Thăng Long',
  1: 'Lập Quốc',
  2: 'Kháng Nguyên',
  3: 'Thịnh Rồi Suy',
  4: 'Nhà Hồ & Thuộc Minh',
  5: 'Lam Sơn Khởi Nghĩa',
  6: 'Đỉnh Cao Đại Việt',
  7: 'Màn Sương Phản Nghịch',
  8: 'Sông Gianh Chia Cắt',
  9: 'Cơn Lốc Tây Sơn',
  10: 'Triều Nguyễn Cơ Nghiệp',
  11: 'Lưỡi Lê & Máu Đào',
  12: 'Đêm Trường Thức Tỉnh',
  13: 'Xích Xiềng Vỡ Bờ',
  14: 'Chín Năm Kháng Chiến',
  15: 'Cắt Nửa Vầng Trăng',
  16: 'Mưa Bom Bão Lửa',
  17: 'Đại Thắng Mùa Xuân'
}

export function formatArcName(arcId) {
  if (arcId === -2) return 'Tiền Truyện I'
  if (arcId === -1) return 'Tiền Truyện II'
  if (arcId === 0) return 'Tiền Truyện III'
  return `Chương ${arcId}`
}
