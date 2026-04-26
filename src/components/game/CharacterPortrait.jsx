const INITIALS = {
  tran_thai_tong: { label: '太', color: '#8B1A1A' },
  tran_hung_dao:  { label: '興', color: '#C0392B' },
  tran_nhan_tong: { label: '仁', color: '#8E44AD' },
  tran_thu_do:    { label: '守', color: '#2C3E50' },
  tran_quang_khai:{ label: '光', color: '#1A5276' },
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
