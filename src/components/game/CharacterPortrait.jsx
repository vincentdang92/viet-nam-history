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
        border: '3px solid rgba(212,160,23,0.8)',
        boxShadow: `0 0 0 1px rgba(212,160,23,0.3), inset 0 0 20px ${color}80`,
      }
    case 'general':
      return {
        border: `3px solid ${color}`,
        boxShadow: `0 0 0 1px ${color}66, inset 0 0 16px ${color}66`,
      }
    case 'scholar':
      return {
        border: '3px solid rgba(46,139,87,0.8)',
        boxShadow: `0 0 0 1px rgba(46,139,87,0.3), inset 0 0 14px ${color}50`,
      }
    case 'royal':
      return {
        border: '3px solid rgba(160,160,160,0.7)',
        boxShadow: `inset 0 0 12px ${color}40`,
      }
    case 'enemy':
      return {
        border: '3px solid rgba(74,85,104,0.9)',
        boxShadow: 'inset 0 0 14px rgba(74,85,104,0.6)',
      }
    default:
      return {
        border: `3px solid ${color}AA`,
        boxShadow: `inset 0 0 16px ${color}50`,
      }
  }
}

// Generate SVG Pattern Background for Placeholders
function getPatternBackground(color) {
  const c1 = color + '22'
  const c2 = color + '44'
  return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='${encodeURIComponent(c2)}' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
}

export default function CharacterPortrait({ characterId, isCinematic }) {
  const char = CHARACTERS[characterId] ?? { label: '?', color: '#5A3020', arc: 1, role: 'general' }
  const { label, color, arc, role } = char

  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const imgSrc = `/assets/characters/arc${arc}/${characterId}.webp`
  const showImg = imgLoaded && !imgError

  return (
    <div
      className={`absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center overflow-hidden`}
      style={{
        backgroundColor: color + '11',
        boxShadow: `inset 0 0 40px ${color}50`, // Soft inner shadow instead of borders
      }}
    >
      {/* Fallback Pattern Background */}
      <div 
        className="absolute inset-0 opacity-80" 
        style={{ 
          backgroundImage: getPatternBackground(color),
          backgroundSize: '60px 60px'
        }}
      />

      {/* Portrait image — fade in khi load xong */}
      {!imgError && (
        <img
          src={imgSrc}
          alt={label}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ opacity: showImg ? 1 : 0, transition: 'opacity 0.4s ease' }}
          draggable={false}
        />
      )}

      {/* Letter fallback overlay — hiện khi đang load hoặc lỗi */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: showImg ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 bg-black/40 backdrop-blur-sm" style={{ borderColor: color }}>
          <span
            className="font-calligraphy italic font-bold text-3xl leading-none text-center select-none"
            style={{ color, textShadow: `0 2px 10px ${color}80` }}
          >
            {label}
          </span>
        </div>
      </div>
      
      {/* Inner Vignette / Shadow Overlay for premium feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.6)' }} />
    </div>
  )
}
