// Label: âm tiết đặc trưng nhất từ tên/tước hiệu nhân vật
// Font: EB Garamond italic bold — chữ khắc cổ điển thế kỷ 16, hỗ trợ tiếng Việt
const CHARACTERS = {
  // Nhà Trần
  tran_thai_tong:  { label: 'Thái',  color: '#8B1A1A' },
  tran_hung_dao:   { label: 'Hưng',  color: '#C0392B' },
  tran_nhan_tong:  { label: 'Nhân',  color: '#8E44AD' },
  tran_thu_do:     { label: 'Thủ',   color: '#2C3E50' },
  tran_quang_khai: { label: 'Quang', color: '#1A5276' },
  // Nhà Hồ & Thuộc Minh
  ho_quy_ly:       { label: 'Hồ',    color: '#1A6B3C' },
  ho_han_thuong:   { label: 'Hán',   color: '#276B1A' },
  tran_thiem_binh: { label: 'Thiêm', color: '#5C4033' },
  tran_quy_khoang: { label: 'Khoáng',color: '#6B2C1A' },
  truong_phu:      { label: 'Trương',color: '#1A3A6B' },
  le_loi:          { label: 'Lợi',   color: '#8B5A00' },
  // Lam Sơn
  le_lai:          { label: 'Lai',   color: '#8B2F1A' },
  nguyen_trai:     { label: 'Trãi',  color: '#4A1A6B' },
  nguyen_chich:    { label: 'Chích', color: '#2C5C1A' },
  dinh_le:         { label: 'Lễ',    color: '#6B1A1A' },
}

export default function CharacterPortrait({ characterId, isCinematic }) {
  const char = CHARACTERS[characterId] ?? { label: '?', color: '#5A3020' }
  const len  = char.label.length

  // Circle size
  const circleSize = isCinematic ? 'w-24 h-24' : 'w-16 h-16'

  // Font size — shorter label = bigger text
  const fontSize = isCinematic
    ? (len <= 2 ? '2rem' : len <= 4 ? '1.5rem' : '1.15rem')
    : (len <= 2 ? '1.35rem' : len <= 4 ? '1.05rem' : '0.82rem')

  return (
    <div
      className={`${circleSize} rounded-full flex items-center justify-center shadow-lg mx-auto relative`}
      style={{
        backgroundColor: char.color + '22',
        border: `2px solid ${char.color}70`,
        boxShadow: `0 0 16px ${char.color}30`,
      }}
    >
      {/* Vòng trang trí bên trong */}
      <div
        className="absolute inset-1 rounded-full opacity-20"
        style={{ border: `1px solid ${char.color}` }}
      />

      <span
        className="relative z-10 font-calligraphy italic font-bold leading-none text-center select-none"
        style={{
          fontSize,
          color: char.color,
          textShadow: `0 1px 8px ${char.color}60`,
          letterSpacing: '-0.02em',
        }}
      >
        {char.label}
      </span>
    </div>
  )
}
