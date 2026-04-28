export const QUESTS_DATA = [
  {
    id: 'quest_dan_tam',
    title: 'An Dân Lập Quốc',
    desc: 'Giữ Dân Tâm không rớt xuống dưới 50 trong vòng 5 lượt.',
    condition: { type: 'maintain_stat', stat: 'danTam', min: 50 },
    duration: 5,
    rewardItem: 'item_chieu_xa_thue'
  },
  {
    id: 'quest_trieu_cuong',
    title: 'Thanh Trừng Nịnh Thần',
    desc: 'Giữ Triều Cương dưới 60 trong vòng 5 lượt.',
    condition: { type: 'maintain_stat', stat: 'trieuCuong', max: 60 },
    duration: 5,
    rewardItem: 'item_thuong_phuong'
  },
  {
    id: 'quest_binh_luc',
    title: 'Rèn Luyện Quân Sĩ',
    desc: 'Giữ Binh Lực trên 60 trong vòng 5 lượt.',
    condition: { type: 'maintain_stat', stat: 'binhLuc', min: 60 },
    duration: 5,
    rewardItem: 'item_binh_thu'
  }
]

export function getRandomQuest() {
  const randomIndex = Math.floor(Math.random() * QUESTS_DATA.length)
  return { ...QUESTS_DATA[randomIndex], progress: 0 }
}
