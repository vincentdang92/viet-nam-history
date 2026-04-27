'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useGame } from '../../context/GameContext'
import { STAT_META, STAT_KEYS } from '../../constants/gameConfig'
import { checkFirestoreConnection } from '../../lib/firestore'

const ARC_LABEL = {
  1: 'Lập Quốc', 2: 'Kháng Nguyên', 3: 'Thịnh Rồi Suy',
  4: 'Nhà Hồ & Thuộc Minh', 5: 'Lam Sơn',
}

const ENV_COLOR = {
  production: '#4CAF50',
  preview: '#F39C12',
  development: '#8E44AD',
}

function truncateUID(uid) {
  if (!uid) return '—'
  if (uid.length <= 12) return uid
  return `${uid.slice(0, 6)}···${uid.slice(-4)}`
}

function formatBuildTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function Row({ label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-tran-border/30 last:border-0">
      <span className="text-tran-textMuted text-xs">{label}</span>
      <span
        className="text-xs font-medium tabular-nums text-right max-w-[55%] truncate"
        style={{ color: valueColor || '#F5E6D0' }}
      >
        {value}
      </span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-widest text-tran-textMuted/60 font-semibold mb-1.5">
        {title}
      </p>
      <div
        className="rounded-xl px-3 py-1"
        style={{ background: 'rgba(45,31,26,0.6)', border: '1px solid rgba(90,48,32,0.4)' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function PlayerInfoPanel({ open, onClose }) {
  const { playerName, user, isLinked } = useAuth()
  const { state } = useGame()
  const [dbStatus, setDbStatus] = useState(null) // null = checking

  useEffect(() => {
    if (!open) return
    setDbStatus(null)
    checkFirestoreConnection(user?.uid).then(setDbStatus)
  }, [open, user?.uid])

  const isPlaying = state.gameStatus !== 'menu'

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'
  const buildTime  = process.env.NEXT_PUBLIC_BUILD_TIME  || '—'
  const appEnv     = process.env.NEXT_PUBLIC_APP_ENV     || 'development'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto rounded-t-2xl overflow-hidden"
            style={{ background: '#1A0F0A', border: '1px solid rgba(90,48,32,0.6)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-tran-border" />
            </div>

            <div className="px-4 pb-6 overflow-y-auto max-h-[75vh]">
              <p className="text-tran-secondary font-serif font-bold text-base mb-4 text-center">
                Thông Tin
              </p>

              {/* Player */}
              <Section title="Người chơi">
                <Row label="Tên hiệu" value={playerName || '—'} valueColor="#D4A017" />
                <Row
                  label="Tài khoản"
                  value={isLinked ? `Google · ${user?.email}` : 'Ẩn danh'}
                  valueColor={isLinked ? '#4CAF50' : '#A08070'}
                />
                <Row label="UID" value={truncateUID(user?.uid)} valueColor="#6B7280" />
              </Section>

              {/* Current session — only while playing */}
              {isPlaying && (
                <Section title="Phiên chơi hiện tại">
                  <Row label="Chương" value={`Arc ${state.currentArc} · ${ARC_LABEL[state.currentArc] || ''}`} />
                  <Row label="Năm" value={state.currentYear} />
                  <Row label="Năm trị vì" value={`${state.yearsReigned} năm`} />
                  <Row
                    label="Lần cứu đã dùng"
                    value={`${state.adRescueCount ?? 0} / 10`}
                    valueColor={(state.adRescueCount ?? 0) >= 8 ? '#FF6B6B' : '#F5E6D0'}
                  />
                  {/* Stats mini grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0 pt-1">
                    {STAT_KEYS.map(key => {
                      const meta = STAT_META[key]
                      const val = state.stats[key]
                      const isDanger = val <= 15 || ((key === 'binhLuc' || key === 'trieuCuong') && val >= 85)
                      return (
                        <div key={key} className="flex items-center justify-between py-1.5 border-b border-tran-border/30 last:border-0">
                          <span className="text-tran-textMuted text-xs">{meta.icon} {meta.label}</span>
                          <span
                            className="text-xs font-bold tabular-nums"
                            style={{ color: isDanger ? '#FF4444' : meta.color }}
                          >
                            {val}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </Section>
              )}

              {/* Build */}
              <Section title="Thông số build">
                <Row label="Phiên bản" value={`v${appVersion}`} valueColor="#D4A017" />
                <Row
                  label="Môi trường"
                  value={appEnv}
                  valueColor={ENV_COLOR[appEnv] || '#A08070'}
                />
                <Row label="Build lúc" value={formatBuildTime(buildTime)} valueColor="#6B7280" />
                <Row label="Firebase project" value={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '—'} valueColor="#6B7280" />
                <Row
                  label="Firestore"
                  value={dbStatus === null ? 'Đang kiểm tra…' : dbStatus.label}
                  valueColor={dbStatus === null ? '#6B7280' : dbStatus.ok ? '#4CAF50' : '#FF6B6B'}
                />
                {dbStatus && !dbStatus.ok && (
                  <div className="py-1.5 text-[10px] leading-snug" style={{ color: '#FF9966' }}>
                    {dbStatus.label === 'Chưa cấu hình' && 'Thiếu NEXT_PUBLIC_FIREBASE_* env vars'}
                    {dbStatus.label === 'Lỗi quyền (rules)' && 'Cần enable Firestore + set security rules trong Firebase Console'}
                    {dbStatus.label === 'Không có mạng' && 'Mất kết nối — game dùng localStorage tạm'}
                    {dbStatus.label === 'Chưa đăng nhập' && 'Firebase Console → Authentication → Anonymous → Enable'}
                  </div>
                )}
              </Section>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-tran-border text-tran-textMuted text-sm active:opacity-70"
                style={{ minHeight: 48 }}
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
