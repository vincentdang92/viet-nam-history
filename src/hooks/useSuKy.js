'use client'

import { useGame } from '../context/GameContext'

const SU_KY_DATA = {
  su_ky_lap_quoc_001: {
    id: 'su_ky_lap_quoc_001',
    title: 'Nhà Trần Lập Quốc',
    category: 'Sự Kiện',
    shortFact: 'Năm 1225, Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh, kết thúc nhà Lý',
    detail: 'Cuộc chuyển giao quyền lực từ nhà Lý sang nhà Trần diễn ra tương đối êm thấm nhờ sự sắp xếp khéo léo của Trần Thủ Độ. Lý Chiêu Hoàng, vị nữ vương duy nhất trong lịch sử Việt Nam, kết thúc triều đại 216 năm của nhà Lý.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_tran_hung_dao_001: {
    id: 'su_ky_tran_hung_dao_001',
    title: 'Hưng Đạo Đại Vương',
    category: 'Nhân Vật',
    shortFact: 'Vị tướng duy nhất trong lịch sử đánh bại Nguyên Mông 3 lần',
    detail: 'Trần Quốc Tuấn (1228–1300), tước hiệu Hưng Đạo Đại Vương. Ông là vị tướng tài năng nhất lịch sử Việt Nam, chỉ huy ba cuộc kháng Nguyên và giành chiến thắng cả ba lần. Tác giả Hịch tướng sĩ và Binh thư yếu lược.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_hich_tuong_si_001: {
    id: 'su_ky_hich_tuong_si_001',
    title: 'Hịch Tướng Sĩ',
    category: 'Văn Học',
    shortFact: 'Áng văn yêu nước vĩ đại nhất thế kỷ 13 của Trần Hưng Đạo',
    detail: '"Ta thường đến bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt..." — Hịch tướng sĩ không chỉ là lời kêu gọi chiến đấu mà còn là kiệt tác văn học, thể hiện tinh thần yêu nước và trách nhiệm với vận mệnh quốc gia.',
    source: 'Hịch tướng sĩ — Trần Hưng Đạo',
  },
  su_ky_bach_dang_001: {
    id: 'su_ky_bach_dang_001',
    title: 'Trận Bạch Đằng 1288',
    category: 'Trận Chiến',
    shortFact: 'Trận thủy chiến vĩ đại nhất lịch sử, chấm dứt mộng xâm lược của Nguyên Mông',
    detail: 'Mùa xuân 1288, Trần Hưng Đạo cho đóng cọc gỗ bịt sắt dưới lòng sông Bạch Đằng. Khi hạm đội Nguyên tiến vào lúc triều cao, quân ta nhử sâu rồi phản công khi triều rút. Hàng trăm chiến thuyền bị đánh đắm, Ô Mã Nhi bị bắt sống.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_phat_hoang_001: {
    id: 'su_ky_phat_hoang_001',
    title: 'Phật Hoàng Trần Nhân Tông',
    category: 'Nhân Vật',
    shortFact: 'Vị vua Phật duy nhất trong lịch sử Việt Nam, sáng lập Thiền phái Trúc Lâm',
    detail: 'Sau khi lãnh đạo hai cuộc kháng Nguyên thắng lợi, Trần Nhân Tông nhường ngôi và lên núi Yên Tử xuất gia. Ông sáng lập Thiền phái Trúc Lâm Yên Tử — dòng thiền thuần Việt đầu tiên. Được hậu thế tôn xưng là "Phật Hoàng".',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_dong_bo_dau_001: {
    id: 'su_ky_dong_bo_dau_001',
    title: 'Trận Đông Bộ Đầu 1258',
    category: 'Trận Chiến',
    shortFact: 'Lần đầu tiên trong lịch sử, quân Nguyên Mông bị đánh bại',
    detail: 'Năm 1257–1258, quân Nguyên 30,000 người xâm lược Đại Việt. Nhà Trần áp dụng chiến lược "vườn không nhà trống", rút khỏi Thăng Long rồi phản công. Trận Đông Bộ Đầu là đòn quyết định, buộc quân Nguyên phải rút lui nhục nhã.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_tran_quoc_toan_001: {
    id: 'su_ky_tran_quoc_toan_001',
    title: 'Thiếu Niên Trần Quốc Toản',
    category: 'Nhân Vật',
    shortFact: 'Tự chiêu mộ 1.000 quân lúc 16 tuổi, cờ "Phá cường địch, báo hoàng ân"',
    detail: 'Trần Quốc Toản (1267–1285), con trai Hoài Văn hầu Trần Quốc Nghiễn. Bị từ chối tham dự hội nghị Bình Than vì còn nhỏ, ông tức giận bóp nát một quả quất. Sau đó tự chiêu mộ nghĩa quân, lập nhiều chiến công trong kháng Nguyên lần 2 năm 1285. Hy sinh ở tuổi 18.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_binh_than_001: {
    id: 'su_ky_binh_than_001',
    title: 'Hội Nghị Bình Than',
    category: 'Sự Kiện',
    shortFact: 'Hội nghị thống nhất toàn dân kháng Nguyên, giao quyền chỉ huy cho Trần Hưng Đạo',
    detail: 'Năm 1282, Trần Nhân Tông triệu tập tất cả vương hầu tại bến Bình Than. Hội nghị quyết định nhất trí kháng chiến, giao toàn quyền quân sự cho Trần Hưng Đạo. Sự thống nhất chỉ huy là yếu tố then chốt dẫn đến chiến thắng.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_chuong_duong_001: {
    id: 'su_ky_chuong_duong_001',
    title: 'Trận Chương Dương và Hàm Tử',
    category: 'Trận Chiến',
    shortFact: 'Hai trận đại thắng năm 1285, thu hồi Thăng Long lần thứ hai',
    detail: 'Tháng 5–6/1285, Trần Quang Khải chỉ huy hai trận lớn: Chương Dương và Hàm Tử. Quân Nguyên rút chạy trong hỗn loạn. Bài thơ "Tụng giá hoàn kinh sư" của Trần Quang Khải là di sản văn học ghi dấu chiến thắng.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_coc_bach_dang_001: {
    id: 'su_ky_coc_bach_dang_001',
    title: 'Bãi Cọc Bạch Đằng',
    category: 'Sự Kiện',
    shortFact: 'Kế hoạch thiên tài: cọc gỗ bịt sắt nhử địch vào bẫy khi triều rút',
    detail: 'Trần Hưng Đạo cho đóng hàng nghìn cọc gỗ lim bịt sắt nhọn dưới lòng sông Bạch Đằng. Quân ta nhử hạm đội Nguyên vào sông lúc triều cao. Khi triều rút, cọc nhô lên đâm thủng thuyền địch. Hàng trăm chiến thuyền bị đánh đắm trong một buổi chiều.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_thuy_quan_001: {
    id: 'su_ky_thuy_quan_001',
    title: 'Lực Lượng Thủy Quân Nhà Trần',
    category: 'Sự Kiện',
    shortFact: 'Thủy quân tinh nhuệ — vũ khí bí mật đánh bại hải quân Nguyên Mông',
    detail: 'Nhà Trần xây dựng lực lượng thủy quân mạnh nhất Đông Nam Á thời đó. Kiến thức về thủy triều và địa hình sông nước là lợi thế không thể sao chép của người Việt trên sông Bạch Đằng, Hàm Tử, Chương Dương.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_hung_dao_tuong_linh: {
    id: 'su_ky_hung_dao_tuong_linh',
    title: 'Trần Hưng Đạo — Thánh Nhân Dân Tộc',
    category: 'Nhân Vật',
    shortFact: 'Sau khi mất năm 1300, được thần hóa và thờ phụng khắp cả nước đến tận ngày nay',
    detail: 'Trần Hưng Đạo mất năm 1300, dặn vua giữ bí quyết chiến tranh nhân dân. Đền Kiếp Bạc ở Hải Dương là nơi thờ chính, thu hút hàng triệu người hành hương. Ngài được coi là vị thần bảo hộ quốc gia và thần y trong tín ngưỡng dân gian Việt Nam.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_suy_vong_001: {
    id: 'su_ky_suy_vong_001',
    title: 'Sự Suy Tàn Của Nhà Trần',
    category: 'Sự Kiện',
    shortFact: 'Từ đỉnh cao kháng Nguyên đến sụp đổ — bài học về quyền lực và sự kiêu ngạo',
    detail: 'Nhà Trần hưng thịnh đạt đỉnh cao với ba lần kháng Nguyên, rồi dần suy tàn vì xa hoa, loạn nội bộ và áp lực từ Chiêm Thành. Hồ Quý Ly soán ngôi năm 1400. Lịch sử nhà Trần là bài học kinh điển về chu kỳ hưng-vong của một triều đại.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_ho_quy_ly_001: {
    id: 'su_ky_ho_quy_ly_001',
    title: 'Hồ Quý Ly',
    category: 'Nhân Vật',
    shortFact: 'Người kết thúc nhà Trần, cải cách táo bạo nhưng đế nghiệp chỉ kéo dài 7 năm',
    detail: 'Hồ Quý Ly (?–1407) là nhà cải cách nổi bật: in tiền giấy, hạn điền, đổi chữ Hán sang chữ Nôm trong văn bản nhà nước. Tuy nhiên ông soán ngôi nhà Trần và bị nhà Minh xâm lược năm 1407. Bị bắt và đưa về Trung Quốc. Nhà Hồ tồn tại chỉ 7 năm.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
}

export function useSuKy() {
  const { state } = useGame()

  const unlocked = state.unlockedSuKy
    .map(id => SU_KY_DATA[id])
    .filter(Boolean)

  return { unlocked, total: Object.keys(SU_KY_DATA).length }
}
