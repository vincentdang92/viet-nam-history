'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STAT_META } from '../../constants/gameConfig'

function EffectPills({ effects }) {
  if (!effects) return null
  return (
    <div className="flex flex-wrap gap-1 mt-auto justify-center w-full">
      {Object.entries(effects).map(([key, val]) => {
        if (val === 0) return null
        const meta = STAT_META[key]
        const positive = val > 0
        return (
          <span
            key={key}
            className="text-[10px] px-1 py-0.5 rounded-sm font-bold shadow-sm"
            style={{
              backgroundColor: (positive ? meta.color : '#C0392B') + '40',
              color: positive ? meta.color : '#FFCCCC',
              border: `1px solid ${positive ? meta.color : '#FF6B6B'}40`
            }}
          >
            {meta.icon} {positive ? '+' : ''}{val}
          </span>
        )
      })}
    </div>
  )
}

// Lựa chọn A (Trái) -> Nhu (Vàng đồng)
// Lựa chọn B (Phải) -> Cương (Đỏ gạch)
const CARD_STYLES = [
  {
    bg: 'bg-[#FDF6E3]',
    border: 'border-[#B8860B]',
    labelColor: 'text-[#B8860B]',
    textColor: 'text-[#3E2723]',
    label: 'NHU',
    shadow: 'shadow-[inset_0_0_20px_rgba(184,134,11,0.15)]'
  },
  {
    bg: 'bg-[#2B0F0F]',
    border: 'border-[#8B1A1A]',
    labelColor: 'text-[#FF7F50]',
    textColor: 'text-[#FDEBD0]',
    label: 'CƯƠNG',
    shadow: 'shadow-[inset_0_0_20px_rgba(139,26,26,0.4)]'
  }
]

export default function ChoiceButton({ choice, index, onClick, hovered, onHover, onLeave }) {
  const [isSealed, setIsSealed] = useState(false)
  const style = CARD_STYLES[index] || CARD_STYLES[0]

  const handleTap = () => {
    if (isSealed) return
    setIsSealed(true)
    onHover() // Lock hover state for preview
    
    // Đợi hiệu ứng con dấu đóng xuống 0.4s rồi mới chuyển cảnh
    setTimeout(() => {
      onClick()
    }, 400)
  }

  return (
    <motion.div
      className={`relative flex-1 rounded-lg border-2 ${style.border} ${style.bg} ${style.shadow} p-3 flex flex-col items-center text-center cursor-pointer overflow-hidden transition-all duration-300 ${hovered ? 'scale-105 z-10 brightness-110' : 'scale-100 z-0 brightness-90'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={onLeave}
      onTap={handleTap}
      whileTap={{ scale: 0.95 }}
    >
      {/* Nền giấy mộc bản/sắc phong (Dùng noise pattern giả) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <span className={`text-[10px] uppercase font-bold tracking-widest mb-2 border-b border-current pb-1 w-3/4 ${style.labelColor}`}>
        {style.label}
      </span>
      
      <p className={`text-xs sm:text-sm font-medium leading-snug mb-3 flex-1 flex items-center ${style.textColor}`}>
        {choice.text}
      </p>

      <EffectPills effects={choice.effects} />

      {/* Hiệu ứng Dấu Ấn Hoàng Gia */}
      <AnimatePresence>
        {isSealed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            initial={{ scale: 3, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <div className="border-4 border-red-600 rounded-sm px-2 py-1 bg-red-600/10 backdrop-blur-sm shadow-2xl">
              <span className="text-red-600 font-serif font-bold text-xl tracking-widest drop-shadow-md" style={{ textShadow: '0 0 4px rgba(220,38,38,0.8)' }}>
                PHÊ CHUẨN
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
