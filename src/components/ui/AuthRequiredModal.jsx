import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function AuthRequiredModal({ isOpen, onClose, message, title = "Yêu cầu Đăng nhập" }) {
  const { linkGoogle } = useAuth()
  const [isLinking, setIsLinking] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  if (!isOpen) return null

  const handleGoogle = async () => {
    setIsLinking(true)
    setErrorMsg(null)
    const result = await linkGoogle()
    setIsLinking(false)
    if (result.success) {
      onClose() // Auto close on success
    } else {
      if (result.error === 'auth/credential-already-in-use') {
        setErrorMsg('Tài khoản Google này đã được dùng')
      } else if (result.error !== 'auth/popup-closed-by-user') {
        setErrorMsg('Liên kết thất bại, thử lại sau')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <motion.div 
        className="bg-stone-900 border border-amber-900/50 rounded-xl p-6 max-w-sm w-full shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-white p-1"
        >
          ✕
        </button>
        <div className="text-center mb-4">
          <span className="text-4xl block mb-2">🔒</span>
          <h3 className="text-xl font-bold text-amber-500 font-serif">{title}</h3>
        </div>
        
        <p className="text-sm text-stone-300 mb-6 text-center leading-relaxed">
          {message || 'Bạn cần liên kết tài khoản để sử dụng tính năng này. Tiến trình chơi của bạn cũng sẽ được lưu trữ an toàn.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={isLinking}
            className="w-full py-3 rounded-xl border border-stone-700 bg-stone-800 text-sm text-stone-300 hover:text-white hover:bg-stone-700 active:opacity-70 transition-all flex items-center justify-center gap-2 font-medium"
          >
            {isLinking ? (
              <span className="opacity-60">Đang kết nối...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Tiếp tục với Google
              </>
            )}
          </button>
          
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs text-center"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            onClick={onClose}
            className="w-full py-2 text-xs text-stone-500 hover:text-stone-400 transition-colors"
          >
            Để sau
          </button>
        </div>
      </motion.div>
    </div>
  )
}
