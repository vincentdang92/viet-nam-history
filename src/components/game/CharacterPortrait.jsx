const INITIALS = {
  tran_thai_tong:  { label: '太', color: '#8B1A1A' },
  tran_hung_dao:   { label: '興', color: '#C0392B' },
  tran_nhan_tong:  { label: '仁', color: '#8E44AD' },
  tran_thu_do:     { label: '守', color: '#2C3E50' },
  tran_quang_khai: { label: '光', color: '#1A5276' },
  // Arc 4: Nhà Hồ & Thuộc Minh
  ho_quy_ly:       { label: '胡', color: '#1A6B3C' },
  ho_han_thuong:   { label: '漢', color: '#276B1A' },
  tran_thiem_binh: { label: '添', color: '#5C4033' },
  tran_quy_khoang: { label: '廓', color: '#6B2C1A' },
  truong_phu:      { label: '張', color: '#1A3A6B' },
  le_loi:          { label: '黎', color: '#8B5A00' },
  // Arc 5: Lam Sơn
  le_lai:          { label: '賴', color: '#8B2F1A' },
  nguyen_trai:     { label: '阮', color: '#4A1A6B' },
  nguyen_chich:    { label: '織', color: '#2C5C1A' },
  dinh_le:         { label: '禮', color: '#6B1A1A' },
}

export default function CharacterPortrait({ characterId, isCinematic }) {
  const info = INITIALS[characterId] ?? { label: '?', color: '#5A3020' }
  const size = isCinematic ? 'w-24 h-24 text-4xl' : 'w-16 h-16 text-2xl'

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center border-2 border-tran-secondary/50 shadow-lg mx-auto`}
      style={{ backgroundColor: info.color + '33', borderColor: info.color + '80' }}
    >
      <span className="font-serif" style={{ color: info.color }}>
        {info.label}
      </span>
    </div>
  )
}
