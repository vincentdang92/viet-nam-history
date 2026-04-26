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

  // ── Arc 4: Nhà Hồ & Thuộc Minh ─────────────────────────────────────────────
  su_ky_tay_do: {
    id: 'su_ky_tay_do',
    title: 'Thành Tây Đô — Di Sản UNESCO',
    category: 'Công Trình',
    shortFact: 'Xây bằng đá nguyên khối trong 3 tháng, nay là Di sản Văn hóa Thế giới',
    detail: 'Thành Nhà Hồ (Tây Đô) tại Thanh Hóa được xây dựng năm 1397 chỉ trong 3 tháng. Toàn bộ tường thành làm từ đá nguyên khối khổng lồ — không dùng vữa — theo kỹ thuật chưa được giải mã hoàn toàn đến nay. Được UNESCO công nhận là Di sản Văn hóa Thế giới năm 2011.',
    source: 'UNESCO World Heritage List',
  },
  su_ky_nha_ho: {
    id: 'su_ky_nha_ho',
    title: 'Nhà Hồ — Triều Đại Ngắn Nhất',
    category: 'Sự Kiện',
    shortFact: 'Chỉ 7 năm tồn tại (1400-1407) — triều đại ngắn nhất có chính sử Việt Nam',
    detail: 'Nhà Hồ tồn tại từ 1400 đến 1407 — chỉ 7 năm. Dù thực hiện nhiều cải cách tiến bộ (tiền giấy, hạn điền, cải tổ thi cử), nhà Hồ không có đủ thời gian và lòng dân để bén rễ. Khi quân Minh xâm lược, không có đủ lực lượng kháng cự hiệu quả.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_thuoc_minh: {
    id: 'su_ky_thuoc_minh',
    title: 'Hai Mươi Năm Thuộc Minh',
    category: 'Sự Kiện',
    shortFact: 'Nhà Minh đổi tên Đại Việt thành Giao Chỉ, đốt sách và bắt trí thức sang Tàu',
    detail: 'Giai đoạn Thuộc Minh (1407-1427) là một trong những trang đen tối nhất lịch sử Việt Nam. Nhà Minh đốt sách vở chữ Nôm, bắt trí thức và thợ thủ công sang Trung Quốc, đánh thuế nặng, bắt phu dịch. Đây là âm mưu xóa bỏ văn hóa Việt và đồng hóa vĩnh viễn.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_lung_nhai: {
    id: 'su_ky_lung_nhai',
    title: 'Hội Thề Lũng Nhai',
    category: 'Sự Kiện',
    shortFact: '19 người uống máu ăn thề năm 1416 — khởi đầu của cuộc kháng chiến vĩ đại',
    detail: 'Hội Thề Lũng Nhai (1416) tại Thanh Hóa: Lê Lợi cùng 18 hào kiệt uống máu ăn thề quyết chí đánh đuổi quân Minh. Trong số 19 người có Lê Lai, Đinh Lễ, Nguyễn Xí... Hai năm sau (1418), Lê Lợi chính thức phát động Khởi Nghĩa Lam Sơn.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },

  // ── Arc 5: Lam Sơn Khởi Nghĩa ───────────────────────────────────────────────
  su_ky_le_loi: {
    id: 'su_ky_le_loi',
    title: 'Lê Lợi — Bình Định Vương',
    category: 'Nhân Vật',
    shortFact: 'Từ hào trưởng làng quê đến người sáng lập triều đại dài nhất lịch sử Việt Nam',
    detail: 'Lê Lợi (1385-1433) không có xuất thân hoàng tộc — ông chỉ là một hào trưởng giàu có ở Lam Sơn. Nhà Minh ba lần mời ông làm quan, ông ba lần từ chối. Khởi nghĩa năm 1418 với vài trăm người, chiến thắng năm 1428 trước đại quân cả trăm nghìn người. Triều đại ông sáng lập — nhà Lê — kéo dài 360 năm.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_le_lai: {
    id: 'su_ky_le_lai',
    title: 'Lê Lai — Hai Mươi Mốt Lê Lai',
    category: 'Nhân Vật',
    shortFact: 'Mặc áo giáp của Lê Lợi để nghi binh, hi sinh để cứu cuộc kháng chiến',
    detail: 'Lê Lai hi sinh khoảng năm 1419. Câu "Hai mươi mốt Lê Lai, hai mươi hai Lê Lợi" nhắc nhớ rằng ngày giỗ Lê Lai (21/8 âm lịch) phải trước ngày giỗ Lê Lợi (22/8) — theo lệnh của chính Lê Lợi khi còn sống. Đây là nghĩa cử tri ân hiếm có của một vị vua với người đã hi sinh vì mình.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_nguyen_trai: {
    id: 'su_ky_nguyen_trai',
    title: 'Nguyễn Trãi — Ức Trai',
    category: 'Nhân Vật',
    shortFact: 'Quân sư thiên tài, tác giả Bình Ngô Đại Cáo — được UNESCO công nhận là Danh nhân văn hóa thế giới',
    detail: 'Nguyễn Trãi (1380-1442), hiệu Ức Trai — nhà thơ, nhà chính trị, chiến lược gia. Ông đã từ chối theo cha sang Trung Quốc để ở lại cứu nước. Viết Bình Ngô Đại Cáo và hàng trăm thư gửi tướng Minh dụ hàng. Năm 1980, UNESCO công nhận ông là Danh nhân văn hóa thế giới.',
    source: 'UNESCO & Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_tot_dong: {
    id: 'su_ky_tot_dong',
    title: 'Trận Tốt Động-Chúc Động 1426',
    category: 'Trận Chiến',
    shortFact: 'Tiêu diệt hơn 50.000 quân Minh, bắt sống cố vấn cao cấp nhất của nhà Minh tại Giao Chỉ',
    detail: 'Tháng 11/1426, Đinh Lễ và Nguyễn Xí phục kích đại quân Minh do Vương Thông chỉ huy tại Tốt Động và Chúc Động (nay là Chương Mỹ, Hà Nội). Kết quả: hơn 50.000 quân Minh bị tiêu diệt, tướng Lý Lượng tử trận, Hoàng Phúc — cố vấn cao cấp nhất — bị bắt sống. Đây là thắng lợi quyết định buộc Vương Thông phải cố thủ trong thành Đông Quan.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_chi_lang: {
    id: 'su_ky_chi_lang',
    title: 'Ải Chi Lăng — Mồ Chôn Viện Binh',
    category: 'Trận Chiến',
    shortFact: 'Liễu Thăng tử trận sau 8 ngày vượt biên — 100.000 quân Minh tan rã',
    detail: 'Ngày 20/10/1427, Liễu Thăng bị phục kích và tử trận tại ải Chi Lăng (Lạng Sơn) — chỉ 8 ngày sau khi vượt biên. 100.000 quân viện binh của ông bị tiêu diệt phần lớn tại Xương Giang (Bắc Giang). Ải Chi Lăng từ đó trở thành biểu tượng của chiến thuật phục kích Việt Nam — nơi địch mạnh hơn vẫn bị tiêu diệt.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_dong_quan: {
    id: 'su_ky_dong_quan',
    title: 'Hội Thề Đông Quan — Nhân Nghĩa Thắng Thù Hận',
    category: 'Sự Kiện',
    shortFact: 'Lê Lợi cấp 500 thuyền và lương thực cho hơn 100.000 quân Minh về nước',
    detail: 'Tháng 12/1427, Hội Thề Đông Quan kết thúc chiến tranh. Lê Lợi không chỉ tha mạng mà còn cấp thuyền bè và lương thực cho hơn 100.000 quân Minh rút về. Sử sách Trung Quốc ghi nhận đây là hành động nhân nghĩa hiếm có. Quyết định này cũng ngăn nhà Minh có cớ để tái xâm lược.',
    source: 'Đại Việt Sử Ký Toàn Thư',
  },
  su_ky_binh_ngo: {
    id: 'su_ky_binh_ngo',
    title: 'Bình Ngô Đại Cáo — Tuyên Ngôn Độc Lập Đầu Tiên',
    category: 'Văn Học',
    shortFact: 'Áng văn bất hủ năm 1428, được Hồ Chí Minh nhắc đến khi soạn Tuyên ngôn Độc lập 1945',
    detail: '"Việc nhân nghĩa cốt ở yên dân, Quân điếu phạt trước lo trừ bạo..." — Bình Ngô Đại Cáo (1428) do Nguyễn Trãi soạn theo lệnh Lê Lợi là tuyên ngôn độc lập đầu tiên của Việt Nam. Nó khẳng định Đại Việt là quốc gia văn hiến độc lập, không phải thuộc địa của Trung Quốc. Hồ Chí Minh coi đây là tiền đề lịch sử khi soạn Tuyên ngôn Độc lập năm 1945.',
    source: 'Bình Ngô Đại Cáo — Nguyễn Trãi, 1428',
  },
}

export function useSuKy() {
  const { state } = useGame()

  const unlocked = state.unlockedSuKy
    .map(id => SU_KY_DATA[id])
    .filter(Boolean)

  return { unlocked, total: Object.keys(SU_KY_DATA).length }
}
