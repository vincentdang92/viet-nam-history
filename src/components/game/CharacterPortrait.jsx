'use client'

import { useState } from 'react'

// label: âm tiết đặc trưng (fallback khi chưa có ảnh)
// arc:   folder /assets/characters/arc{N}/{id}.webp
// role:  quyết định style viền frame
const CHARACTERS = {
  // Nhà Trần
  tran_thai_tong:  { label: 'Thái',   color: '#8B1A1A', arc: 1, role: 'king'    },
  tran_hung_dao:   { label: 'Hưng',   color: '#C0392B', arc: 1, role: 'general' },
  tran_nhan_tong:  { label: 'Nhân',   color: '#8E44AD', arc: 2, role: 'king'    },
  tran_thu_do:     { label: 'Thủ',    color: '#2C3E50', arc: 1, role: 'scholar' },
  tran_quang_khai: { label: 'Quang',  color: '#1A5276', arc: 2, role: 'general' },
  // Nhà Hồ & Thuộc Minh
  ho_quy_ly:       { label: 'Hồ',     color: '#1A6B3C', arc: 4, role: 'king'    },
  ho_han_thuong:   { label: 'Hán',    color: '#276B1A', arc: 4, role: 'royal'   },
  tran_thiem_binh: { label: 'Thiêm',  color: '#5C4033', arc: 4, role: 'royal'   },
  tran_quy_khoang: { label: 'Khoáng', color: '#6B2C1A', arc: 4, role: 'royal'   },
  truong_phu:      { label: 'Trương', color: '#1A3A6B', arc: 4, role: 'enemy'   },
  le_loi:          { label: 'Lợi',    color: '#8B5A00', arc: 4, role: 'king'    },
  // Lam Sơn
  le_lai:          { label: 'Lai',    color: '#8B2F1A', arc: 5, role: 'general' },
  nguyen_trai:     { label: 'Trãi',   color: '#4A1A6B', arc: 5, role: 'scholar' },
  nguyen_chich:    { label: 'Chích',  color: '#2C5C1A', arc: 5, role: 'general' },
  dinh_le:         { label: 'Lễ',     color: '#6B1A1A', arc: 5, role: 'general' },
}

// Viền ngoài theo role
function getFrameStyle(role, color) {
  switch (role) {
    case 'king':
      return {
        border: '2px solid rgba(212,160,23,0.6)',
        boxShadow: `0 0 0 1px rgba(212,160,23,0.25), 0 0 20px ${color}50, 0 0 40px ${color}18`,
      }
    case 'general':
      return {
        border: `2px solid ${color}99`,
        boxShadow: `0 0 0 1px ${color}44, 0 0 16px ${color}44`,
      }
    case 'scholar':
      return {
        border: '2px solid rgba(46,139,87,0.6)',
        boxShadow: `0 0 0 1px rgba(46,139,87,0.25), 0 0 14px ${color}38`,
      }
    case 'royal':
      return {
        border: '2px solid rgba(160,160,160,0.5)',
        boxShadow: `0 0 12px ${color}28`,
      }
    case 'enemy':
      return {
        border: '2px solid rgba(74,85,104,0.7)',
        boxShadow: '0 0 14px rgba(74,85,104,0.5)',
      }
    default:
      return {
        border: `2px solid ${color}70`,
        boxShadow: `0 0 16px ${color}30`,
      }
  }
}

// Màu vòng trang trí bên trong
function getRingColor(role, fallback) {
  switch (role) {
    case 'king':    return 'rgba(212,160,23,0.5)'
    case 'scholar': return 'rgba(46,139,87,0.5)'
    case 'royal':   return 'rgba(160,160,160,0.4)'
    case 'enemy':   return 'rgba(74,85,104,0.5)'
    default:        return `${fallback}50`
  }
}

export default function CharacterPortrait({ characterId, isCinematic }) {
  const char = CHARACTERS[characterId] ?? { label: '?', color: '#5A3020', arc: 1, role: 'general' }
  const { label, color, arc, role } = char
  const len = label.length

  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const circleSize = isCinematic ? 'w-24 h-24' : 'w-16 h-16'
  const fontSize = isCinematic
    ? (len <= 2 ? '2rem' : len <= 4 ? '1.5rem' : '1.15rem')
    : (len <= 2 ? '1.35rem' : len <= 4 ? '1.05rem' : '0.82rem')

  const imgSrc = `/assets/characters/arc${arc}/${characterId}.webp`
  const showImg = imgLoaded && !imgError
  const ringColor = getRingColor(role, color)

  return (
    <div
      className={`${circleSize} rounded-full flex items-center justify-center shadow-lg mx-auto relative overflow-hidden`}
      style={{
        backgroundColor: color + '22',
        ...getFrameStyle(role, color),
      }}
    >
      {/* Portrait image — fade in khi load xong */}
      {!imgError && (
        <img
          src={imgSrc}
          alt={label}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top rounded-full"
          style={{ opacity: showImg ? 1 : 0, transition: 'opacity 0.4s ease' }}
          draggable={false}
        />
      )}

      {/* Letter fallback — hiện khi đang load hoặc lỗi */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full"
        style={{ opacity: showImg ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div
          className="absolute inset-1 rounded-full opacity-20"
          style={{ border: `1px solid ${ringColor}` }}
        />
        <span
          className="relative z-10 font-calligraphy italic font-bold leading-none text-center select-none"
          style={{
            fontSize,
            color,
            textShadow: `0 1px 8px ${color}60`,
            letterSpacing: '-0.02em',
          }}
        >
          {label}
        </span>
      </div>

      {/* Vòng overlay bên trong khi có ảnh — subtle frame feel */}
      {showImg && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 2px ${ringColor}` }}
        />
      )}
    </div>
  )
}
