'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'
import { loadGameState } from '../../lib/firestore'
import PlayerInfoPanel from '../ui/PlayerInfoPanel'
import LeaderboardScreen from './LeaderboardScreen'
import chapters from '../../data/chapters.json'
import { useSuKy } from '../../hooks/useSuKy'

const RESUMABLE = ['playing', 'arc_intro', 'ad_rescue']

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  },
}

const ARC_SHORT = { 1: 'Lập Quốc', 2: 'Kháng Nguyên', 3: 'Thịnh Rồi Suy', 4: 'Nhà Hồ & Thuộc Minh', 5: 'Lam Sơn' }

export default function HomeScreen() {
  const { dispatch } = useGame()
  const { playerName, setPlayerName, linkGoogle, signUpEmail, loginEmail, isLinked, user, profile } = useAuth()
  const { total: totalSuKy } = useSuKy()
  const [savedState, setSavedState] = useState(null)
  const [linking, setLinking] = useState(false)
  const [linkMsg, setLinkMsg] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleLinkGoogle = async () => {
    setLinking(true)
    setLinkMsg(null)
    const result = await linkGoogle()
    setLinking(false)
    if (result.success) {
      if (result.isExistingAccount) {
        setLinkMsg({ ok: true, text: `✓ Đã tải tài khoản ${result.email}` })
      } else {
        setLinkMsg({ ok: true, text: `✓ Đã liên kết ${result.email}` })
      }
    } else if (result.error === 'auth/credential-already-in-use') {
      setLinkMsg({ ok: false, text: 'Tài khoản Google này đã được dùng' })
    } else if (result.error !== 'auth/popup-closed-by-user') {
      setLinkMsg({ ok: false, text: 'Liên kết thất bại, thử lại sau' })
    }
  }

  const handleEmailAuth = async (isSignUp) => {
    if (!email || !password) return setLinkMsg({ ok: false, text: 'Vui lòng nhập đủ email và mật khẩu' })
    setLinking(true)
    setLinkMsg(null)
    const result = isSignUp 
      ? await signUpEmail(email, password)
      : await loginEmail(email, password)
    
    setLinking(false)
    if (result.success) {
      if (result.isExistingAccount) {
        setLinkMsg({ ok: true, text: `✓ Đã tải tài khoản ${result.email}` })
      } else {
        setLinkMsg({ ok: true, text: `✓ Đã đăng ký ${result.email}` })
      }
      setShowEmailForm(false)
    } else {
      let errorMsg = 'Lỗi không xác định'
      if (result.error === 'auth/email-already-in-use') errorMsg = 'Email đã được đăng ký'
      else if (result.error === 'auth/invalid-credential' || result.error === 'auth/wrong-password' || result.error === 'auth/user-not-found') errorMsg = 'Sai thông tin đăng nhập'
      else if (result.error === 'auth/weak-password') errorMsg = 'Mật khẩu quá yếu (ít nhất 6 ký tự)'
      else if (result.error === 'auth/invalid-email') errorMsg = 'Email không hợp lệ'
      else errorMsg = `Lỗi: ${result.error}`
      setLinkMsg({ ok: false, text: errorMsg })
    }
  }

  useEffect(() => {
    async function loadSave() {
      let saved = null

      // Firestore first (cross-device, most reliable)
      if (user?.uid) {
        saved = await loadGameState(user.uid)
      }

      // Fallback to localStorage (offline / Firestore unavailable)
      if (!saved) {
        try {
          const raw = localStorage.getItem('minh_chu_save')
          if (raw) saved = JSON.parse(raw)
        } catch {}
      }

      if (saved && RESUMABLE.includes(saved.gameStatus)) {
        setSavedState(saved)
      }
    }
    loadSave()
  }, [user?.uid]) // re-run when auth resolves

  return (
    <motion.div
      className="min-h-screen bg-tran-bg flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,26,26,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            🏯
          </motion.div>
          <h1 className="text-tran-secondary font-serif text-4xl font-bold tracking-widest">
            MINH CHỦ
          </h1>
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="h-px flex-1 bg-tran-border" />
            <p className="text-tran-textMuted text-xs px-2">Game Lịch Sử Việt Nam</p>
            <div className="h-px flex-1 bg-tran-border" />
          </div>
        </motion.div>

        {/* Player badge */}
        <motion.div
          className="flex items-center justify-between mb-6 px-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-tran-secondary text-sm">👤</span>
            <span className="text-tran-text text-sm font-medium">{playerName}</span>
            {isLinked && <span className="text-[10px] text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded-full">Google</span>}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowInfo(true)}
              className="text-tran-textMuted text-base px-2 active:opacity-60"
              style={{ minHeight: 36 }}
              title="Thông tin"
            >
              ⚙
            </button>
            {(profile?.nameChangeCount || 0) < 2 ? (
              <button
                onClick={() => setPlayerName(null)}
                className="text-tran-textMuted text-[11px] active:opacity-60"
                style={{ minHeight: 36 }}
              >
                Đổi tên
              </button>
            ) : (
              <span className="text-tran-textMuted/50 text-[11px] px-1" title="Bạn đã dùng hết số lần đổi tên">
                🔒 Tên cố định
              </span>
            )}
          </div>
        </motion.div>

        {/* Meta Progression */}
        <motion.div
          className="flex justify-between items-center mb-6 px-2 py-3 bg-tran-card/30 border border-tran-border/30 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center flex-1 border-r border-tran-border/30">
            <p className="text-[10px] text-tran-textMuted uppercase mb-1 font-semibold">Sử Ký Đã Mở</p>
            <p className="text-tran-secondary font-bold text-base">
              {profile?.unlockedSuKy?.length || 0} <span className="text-xs font-normal opacity-60">/ {totalSuKy}</span>
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[10px] text-tran-textMuted uppercase mb-1 font-semibold">Kết Cục Đã Mở</p>
            <p className="text-tran-secondary font-bold text-base">
              {profile?.milestones?.length || 0} <span className="text-xs font-normal opacity-60">/ 5</span>
            </p>
          </div>
        </motion.div>

        {/* Leaderboard & Arena Buttons */}
        <motion.div
          className="mb-6 flex flex-col gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 border border-amber-900/40 rounded-xl text-amber-500 hover:bg-stone-800 transition-colors shadow-lg shadow-amber-900/20"
          >
            <span className="text-xl">📜</span>
            <span className="font-serif font-medium">Bảng Vàng Cống Hiến</span>
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'START_ARENA' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 hover:bg-red-900/40 transition-colors shadow-lg shadow-red-900/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17L3 10l7-7 7 7-7 7z\' fill=\'%23ef4444\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] animate-[pulse_4s_linear_infinite]" />
            <span className="text-xl relative z-10">⚔️</span>
            <span className="font-serif font-bold tracking-wide relative z-10">Lôi Đài Lịch Sử</span>
          </button>
        </motion.div>

        {/* Continue save */}
        {savedState && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 24 }}
          >
            <button
              onClick={() => {
                dispatch({ type: 'LOAD_GAME', savedState })
                setSavedState(null)
              }}
              className="w-full p-4 rounded-xl border border-tran-secondary/50 bg-tran-secondary/8 text-left active:opacity-80 transition-opacity"
              style={{ background: 'rgba(212,160,23,0.06)' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-tran-secondary font-bold text-sm">▶ Tiếp Tục</p>
                  <p className="text-tran-textMuted text-xs mt-0.5">
                    Chương {savedState.currentArc} · {ARC_SHORT[savedState.currentArc]} · Năm {savedState.currentYear}
                  </p>
                </div>
                <span className="text-tran-secondary text-xl shrink-0">⚔️</span>
              </div>
            </button>
          </motion.div>
        )}

        {/* Chapter list */}
        <motion.div
          className="space-y-3 mb-8"
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          {chapters.map((ch) => (
            <motion.div key={ch.id} variants={stagger.item}>
              <motion.button
                className={`w-full p-4 rounded-xl border text-left
                  ${ch.available
                    ? 'border-tran-secondary/40 bg-tran-card hover:bg-tran-secondary/5'
                    : 'border-tran-border/20 bg-tran-card/30 cursor-not-allowed opacity-40'
                  }`}
                onClick={() => {
                  if (!ch.available) return
                  setSavedState(null)
                  dispatch({ type: 'START_GAME' })
                }}
                disabled={!ch.available}
                whileTap={ch.available ? { scale: 0.98 } : {}}
                whileHover={ch.available ? { borderColor: 'rgba(212,160,23,0.7)' } : {}}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-tran-text font-serif font-bold">{ch.title}</h3>
                      {ch.available && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tran-secondary/20 text-tran-secondary font-medium">
                          MỞ
                        </span>
                      )}
                    </div>
                    <p className="text-tran-secondary text-xs">{ch.subtitle}</p>
                    <p className="text-tran-textMuted text-xs mt-1 leading-snug">{ch.description}</p>
                  </div>
                  <span className="text-tran-textMuted text-lg shrink-0 mt-1">
                    {ch.available ? '▶' : '🔒'}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Google link */}
        {user && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {isLinked ? (
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="text-green-400 text-xs">✓</span>
                <span className="text-tran-textMuted text-xs">Đã liên kết tài khoản — tiến trình được lưu</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {showEmailForm ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 bg-tran-card/50 p-3 rounded-xl border border-tran-border/50"
                  >
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-tran-bg/50 border border-tran-border rounded px-3 py-2 text-sm text-tran-text outline-none focus:border-tran-secondary transition-colors"
                    />
                    <input 
                      type="password" 
                      placeholder="Mật khẩu (ít nhất 6 ký tự)" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-tran-bg/50 border border-tran-border rounded px-3 py-2 text-sm text-tran-text outline-none focus:border-tran-secondary transition-colors"
                    />
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => handleEmailAuth(false)}
                        disabled={linking}
                        className="flex-1 bg-tran-secondary/20 hover:bg-tran-secondary/30 text-tran-secondary border border-tran-secondary/50 rounded py-2 text-sm transition-colors"
                      >
                        Đăng Nhập
                      </button>
                      <button 
                        onClick={() => handleEmailAuth(true)}
                        disabled={linking}
                        className="flex-1 bg-tran-primary/20 hover:bg-tran-primary/30 text-red-400 border border-tran-primary/50 rounded py-2 text-sm transition-colors"
                      >
                        Đăng Ký
                      </button>
                    </div>
                    <button 
                      onClick={() => setShowEmailForm(false)}
                      className="w-full text-xs text-tran-textMuted pt-1 hover:text-tran-text transition-colors"
                    >
                      Quay lại
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <button
                      onClick={handleLinkGoogle}
                      disabled={linking}
                      className="w-full py-3 rounded-xl border border-tran-border text-sm text-tran-textMuted active:opacity-70 transition-opacity flex items-center justify-center gap-2 mb-2"
                      style={{ minHeight: 48 }}
                    >
                      {linking ? (
                        <span className="opacity-60">Đang kết nối...</span>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Liên kết Google
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full py-2.5 rounded-xl border border-tran-border/50 text-sm text-tran-textMuted hover:text-tran-text hover:bg-tran-secondary/5 active:opacity-70 transition-all"
                    >
                      Hoặc Đăng nhập / Đăng ký bằng Email
                    </button>
                  </>
                )}
                
                <AnimatePresence>
                  {linkMsg && (
                    <motion.p
                      className={`text-center text-xs mt-2 ${linkMsg.ok ? 'text-green-400' : 'text-red-400'}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {linkMsg.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* Footer hint */}
        <motion.div
          className="text-center text-tran-textMuted text-xs space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Kéo thẻ trái / phải hoặc nhấn nút để chọn</p>
          <p className="opacity-50">✨ Fun First, Learn Always</p>
        </motion.div>
      </div>

      <PlayerInfoPanel open={showInfo} onClose={() => setShowInfo(false)} />

      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            key="leaderboard-wrapper"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
