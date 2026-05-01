'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function NameSetupScreen() {
  const { setPlayerName } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const trimmed = name.trim()
  const isValid = trimmed.length >= 2

  const handleConfirm = () => {
    if (!isValid) { setError('Tên phải có ít nhất 2 ký tự'); return }
    setPlayerName(trimmed)
  }

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden bg-tran-bg flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,26,26,0.18) 0%, transparent 70%)' }}
      />

      <div className="relative w-full">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ delay: 0.8, duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            👑
          </motion.div>
          <h1 className="text-tran-secondary font-serif text-2xl font-bold tracking-wide">
            Khai Danh Hiệu
          </h1>
          <p className="text-tran-textMuted text-sm mt-2 leading-relaxed">
            Đặt tên hiệu cho mình trước khi<br />bước vào triều đại
          </p>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 220 }}
        >
          {/* Input */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'rgba(90,48,32,0.7)', background: 'rgba(45,31,26,0.7)' }}
          >
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value.slice(0, 20)); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleConfirm()}
              placeholder="VD: Hưng Đạo Vương, Lê Lợi..."
              className="w-full bg-transparent px-4 py-4 text-tran-text text-base outline-none placeholder:text-tran-textMuted/35"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between px-1">
            {error
              ? <span className="text-red-400 text-xs">{error}</span>
              : <span className="text-tran-textMuted text-xs">Tối đa 20 ký tự</span>
            }
            <span className="text-tran-textMuted text-xs">{trimmed.length}/20</span>
          </div>

          {/* Confirm */}
          <motion.button
            onClick={handleConfirm}
            disabled={!isValid}
            className="w-full py-4 rounded-xl font-bold text-sm"
            style={{
              background: isValid
                ? 'linear-gradient(135deg, #8B1A1A, #C0392B)'
                : 'rgba(255,255,255,0.05)',
              color: isValid ? '#F5E6D0' : 'rgba(255,255,255,0.2)',
              minHeight: 56,
            }}
            whileTap={isValid ? { scale: 0.97 } : {}}
          >
            ⚔️ Bắt Đầu Hành Trình
          </motion.button>

          {/* Anonymous skip */}
          <button
            onClick={() => setPlayerName('Ẩn Danh')}
            className="w-full py-3 text-tran-textMuted text-xs active:opacity-60 transition-opacity"
            style={{ minHeight: 44 }}
          >
            Chơi ẩn danh →
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
