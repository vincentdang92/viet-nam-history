'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'
import { loadGameState } from '../../lib/firestore'
import PlayerInfoPanel from '../ui/PlayerInfoPanel'
import AuthRequiredModal from '../ui/AuthRequiredModal'
import LeaderboardScreen from './LeaderboardScreen'
import chapters from '../../data/chapters.json'
import { useSuKy } from '../../hooks/useSuKy'
import { formatArcName, ARC_LABEL } from '../../utils/helpers'

const RESUMABLE = ['playing', 'arc_intro', 'ad_rescue']

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  },
}

const ARC_SHORT = ARC_LABEL

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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [confirmArcId, setConfirmArcId] = useState(null)

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

      if (user?.uid) {
        saved = await loadGameState(user.uid)
      }

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
  }, [user?.uid])

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden bg-tran-bg flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,26,26,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md flex-1 overflow-y-auto px-6 py-4 flex flex-col hide-scrollbar">
        <div className="m-auto w-full flex flex-col h-full">
          {/* Logo */}
          <motion.div
            className="text-center mb-6 shrink-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className="text-5xl mb-2"
              animate={{ rotate: [0, -3, 3, 0] }}
              transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              🏯
            </motion.div>
            <h1 className="text-tran-secondary font-serif text-3xl font-bold tracking-widest">
              MINH CHỦ
            </h1>
          </motion.div>

          {/* Compact Profile & Meta Badge */}
          <motion.div
            className="flex items-center justify-between mb-5 px-3 py-2 bg-tran-card/40 border border-tran-border/40 rounded-2xl shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-tran-secondary text-sm">👤</span>
                <span className="text-tran-text text-sm font-medium">{playerName}</span>
                {isLinked && <span className="text-[9px] text-green-400 bg-green-900/30 px-1.5 rounded-full">GG</span>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setShowInfo(true)}
                  className="text-tran-textMuted text-xs hover:text-tran-text"
                >
                  ⚙ Cài đặt
                </button>
                <span className="text-tran-textMuted/30">|</span>
                {(profile?.nameChangeCount || 0) < 2 ? (
                  <button
                    onClick={() => setPlayerName(null)}
                    className="text-tran-textMuted text-xs hover:text-tran-text"
                  >
                    Đổi tên
                  </button>
                ) : (
                  <span className="text-tran-textMuted/50 text-xs" title="Bạn đã dùng hết số lần đổi tên">
                    🔒 Tên cố định
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 text-center border-l border-tran-border/30 pl-3">
              <div>
                <p className="text-[9px] text-tran-textMuted uppercase mb-0.5">Sử Ký</p>
                <p className="text-tran-secondary font-bold text-sm">
                  {profile?.unlockedSuKy?.length || 0}<span className="text-[10px] opacity-60">/{totalSuKy}</span>
                </p>
              </div>
              <div>
                <p className="text-[9px] text-tran-textMuted uppercase mb-0.5">Kết Cục</p>
                <p className="text-tran-secondary font-bold text-sm">
                  {profile?.milestones?.length || 0}<span className="text-[10px] opacity-60">/5</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Multiplayer Action Buttons (Row) */}
          <motion.div
            className="mb-5 flex gap-2 shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={() => setShowLeaderboard(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-stone-900 border border-amber-900/40 rounded-xl text-amber-500 hover:bg-stone-800 transition-colors shadow-lg shadow-amber-900/10"
            >
              <span className="text-xl">📜</span>
              <span className="text-xs font-serif font-medium">Bảng Vàng</span>
            </button>
            
            <button 
              onClick={() => {
                if (!isLinked) {
                  setShowAuthModal(true)
                  return
                }
                dispatch({ type: 'START_ARENA' })
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 hover:bg-red-900/40 transition-colors shadow-lg shadow-red-900/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17L3 10l7-7 7 7-7 7z\' fill=\'%23ef4444\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] animate-[pulse_4s_linear_infinite]" />
              <span className="text-xl relative z-10">⚔️</span>
              <span className="text-xs font-serif font-bold relative z-10">Lôi Đài</span>
            </button>
          </motion.div>

          {/* Continue save */}
          {savedState && (
            <motion.div
              className="mb-5 shrink-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 24 }}
            >
              <button
                onClick={() => {
                  dispatch({ type: 'LOAD_GAME', savedState })
                  setSavedState(null)
                }}
                className="w-full p-3 rounded-xl border border-tran-secondary/50 bg-tran-secondary/8 text-left active:opacity-80 transition-opacity"
                style={{ background: 'rgba(212,160,23,0.06)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-tran-secondary font-bold text-sm">▶ Tiếp Tục</p>
                    <p className="text-tran-textMuted text-[10px] mt-0.5">
                      {formatArcName(savedState.currentArc)} · {ARC_SHORT[savedState.currentArc]} · Năm {savedState.currentYear}
                    </p>
                  </div>
                  <span className="text-tran-secondary text-lg shrink-0">⚔️</span>
                </div>
              </button>
            </motion.div>
          )}

          {/* Chapter list */}
          <motion.div
            className="space-y-2.5 mb-6 flex-1 overflow-y-auto min-h-[200px]"
            variants={stagger.container}
            initial="initial"
            animate="animate"
          >
            {chapters.map((ch) => (
              <motion.div key={ch.id} variants={stagger.item}>
                <div
                  className={`w-full p-3 rounded-xl border text-left
                    ${ch.available
                      ? 'border-tran-secondary/40 bg-tran-card'
                      : 'border-tran-border/20 bg-tran-card/30 opacity-40'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-tran-text font-serif font-bold text-sm">{ch.title}</h3>
                        {ch.available && (
                          <span className="text-[9px] px-1.5 rounded-full bg-tran-secondary/20 text-tran-secondary font-medium">
                            MỞ
                          </span>
                        )}
                      </div>
                      <p className="text-tran-textMuted text-[10px] leading-snug">{ch.subtitle}</p>
                    </div>
                    {!ch.available && (
                      <span className="text-tran-textMuted text-sm shrink-0 mt-0.5">🔒</span>
                    )}
                  </div>

                  {ch.available && (
                    <div className="flex flex-col gap-1.5 mt-3 border-t border-tran-border/30 pt-3">
                      {ch.arcs.map(arc => {
                        const isUnlocked = arc.id <= (profile?.maxArcReached || 1)
                        return (
                          <button
                            key={arc.id}
                            disabled={!isUnlocked}
                            onClick={() => {
                              if (!isUnlocked) return
                              if (savedState) {
                                setConfirmArcId(arc.id)
                                return
                              }
                              setSavedState(null)
                              dispatch({ type: 'START_GAME', arcId: arc.id })
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors
                              ${isUnlocked 
                                ? 'bg-tran-secondary/10 border border-tran-secondary/20 text-tran-text hover:bg-tran-secondary/20 active:scale-[0.98]' 
                                : 'bg-stone-900/40 border border-transparent text-tran-textMuted/40 cursor-not-allowed'}`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`font-serif font-bold shrink-0 ${isUnlocked ? 'text-tran-secondary' : ''}`}>
                                {formatArcName(arc.id)}
                              </span>
                              <span className="opacity-50 shrink-0">-</span>
                              <span className="truncate">{arc.title}</span>
                            </div>
                            <span className="text-[10px] shrink-0 ml-2">
                              {isUnlocked ? '▶' : '🔒'}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Compact Login/Footer */}
          <motion.div
            className="shrink-0 mt-auto pt-4 border-t border-tran-border/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {user && (
              isLinked ? (
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="text-tran-textMuted text-[10px]">Đã lưu tiến trình lên mây</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleLinkGoogle}
                    disabled={linking}
                    className="w-full py-2 rounded-lg border border-tran-border text-[11px] text-tran-textMuted active:opacity-70 flex items-center justify-center gap-1.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Đăng nhập Google để lưu tiến trình
                  </button>
                  <AnimatePresence>
                    {linkMsg && (
                      <motion.p
                        className={`text-center text-[10px] ${linkMsg.ok ? 'text-green-400' : 'text-red-400'}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {linkMsg.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>

      <PlayerInfoPanel open={showInfo} onClose={() => setShowInfo(false)} />

      <AnimatePresence>
        {showAuthModal && (
          <AuthRequiredModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            title="Đăng Ký Tham Gia Lôi Đài"
            message="Sử Gia cần liên kết tài khoản (Google) để bước vào Lôi Đài Lịch Sử và ghi danh lên Bảng Vàng."
          />
        )}
      </AnimatePresence>

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

      {/* New Game Confirm Modal */}
      {confirmArcId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border border-amber-900/50 rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setConfirmArcId(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-white p-1"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-amber-500 mb-2 font-serif text-center">Cảnh Báo</h3>
            
            <p className="text-sm text-stone-400 mb-6 text-center">
              Khởi tạo dòng thời gian mới sẽ xóa hoàn toàn tiến trình Chương đang chơi dở. Bạn có chắc chắn muốn bắt đầu lại?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmArcId(null)}
                className="flex-1 py-2 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSavedState(null)
                  dispatch({ type: 'START_GAME', arcId: confirmArcId })
                  setConfirmArcId(null)
                }}
                className="flex-1 py-2 px-4 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium transition-colors"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
