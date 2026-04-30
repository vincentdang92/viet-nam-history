export const COMPANIONS_DATA = {
  tran_hung_dao: {
    id: 'tran_hung_dao',
    name: 'Trần Hưng Đạo',
    title: 'Quốc Công Tiết Chế',
    avatar: '🛡️',
    skillName: 'Hịch Tướng Sĩ',
    desc: 'Tăng 30% Máu tối đa của quân ta khi bước vào Sinh Tử Chiến.',
    effect: { type: 'buff_hp', value: 30 } // +30 max HP
  },
  pham_ngu_lao: {
    id: 'pham_ngu_lao',
    name: 'Phạm Ngũ Lão',
    title: 'Điện Súy Thượng Tướng Quân',
    avatar: '🔥',
    skillName: 'Đan Sọt Nhớ Nước',
    desc: 'Bỏ qua sát thương từ đòn đánh đầu tiên của giặc (Né đòn 1 lần).',
    effect: { type: 'dodge_first_hit' }
  },
  tran_quang_khai: {
    id: 'tran_quang_khai',
    name: 'Trần Quang Khải',
    title: 'Thượng Tướng Thái Sư',
    avatar: '⚔️',
    skillName: 'Đoạt Giáo Chương Dương',
    desc: 'Tăng 30% sát thương gây ra cho kẻ thù mỗi lần vuốt thẻ tấn công.',
    effect: { type: 'buff_damage', value: 30 }
  },
  tran_khanh_du: {
    id: 'tran_khanh_du',
    name: 'Trần Khánh Dư',
    title: 'Phó Tướng Vân Đồn',
    avatar: '💰',
    skillName: 'Cướp Thuyền Lương',
    desc: 'Nếu chiến thắng Sinh Tử Chiến, Quốc Khố tăng thêm 30 điểm.',
    effect: { type: 'bonus_reward', stat: 'quocKho', value: 30 }
  },
  yet_kieu: {
    id: 'yet_kieu',
    name: 'Yết Kiêu',
    title: 'Thần Tướng Thủy Quân',
    avatar: '🌊',
    skillName: 'Đục Thuyền Môn',
    desc: 'Giảm 25% Máu tối đa của tướng địch ngay khi trận chiến bắt đầu.',
    effect: { type: 'debuff_enemy_hp', value: 25 }
  }
}
