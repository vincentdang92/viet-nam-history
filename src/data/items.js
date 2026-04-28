export const ITEMS_DATA = {
  item_binh_thu: {
    id: 'item_binh_thu',
    name: 'Binh Thư Yếu Lược',
    icon: '📜',
    desc: 'Cứu vãn 1 lần khi Binh Lực cạn kiệt (bị ngoại bang xâm chiếm). Tác phẩm quân sự kinh điển của Trần Hưng Đạo.',
    rescueTrigger: 'binhLuc_low'
  },
  item_thuong_phuong: {
    id: 'item_thuong_phuong',
    name: 'Thượng Phương Kiếm',
    icon: '🗡️',
    desc: 'Cứu vãn 1 lần khi Triều Cương quá cao (quyền thần lộng hành). Kiếm báu vua ban để trảm nịnh thần.',
    rescueTrigger: 'trieuCuong_high'
  },
  item_chieu_xa_thue: {
    id: 'item_chieu_xa_thue',
    name: 'Chiếu Xá Thuế',
    icon: '📜',
    desc: 'Cứu vãn 1 lần khi Dân Tâm cạn kiệt (nhân dân khởi nghĩa). Miễn giảm tô thuế để xoa dịu muôn dân.',
    rescueTrigger: 'danTam_low'
  }
}

export function getApplicableItem(inventory, triggerStat) {
  if (!inventory || inventory.length === 0) return null
  for (const itemId of inventory) {
    const item = ITEMS_DATA[itemId]
    if (item && item.rescueTrigger === triggerStat) {
      return item
    }
  }
  return null
}
