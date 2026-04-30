import { useState } from 'react'
import { submitFeedback } from '../../lib/firestore'
import { useAuth } from '../../context/AuthContext'

export default function FeedbackModal({ isOpen, onClose, eventId }) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const { isLinked, linkGoogle, user, playerName } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setStatus('submitting')
    const ok = await submitFeedback(user?.uid, playerName, user?.email, eventId, content)
    if (ok) {
      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
        setContent('')
      }, 2000)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-900 border border-amber-900/50 rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-white p-1"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-amber-500 mb-2 font-serif text-center">Góp Ý Lịch Sử</h3>
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📜</div>
            <p className="text-amber-100 font-medium">Đa tạ Sử Gia đã góp ý!</p>
            <p className="text-sm text-stone-400 mt-2">Ý kiến của bạn sẽ được Quốc Sử Viện xem xét.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-400 mb-4 text-center">
              Lịch sử do toàn dân viết nên. Nếu phát hiện sai sót, hãy gửi thông tin để chúng ta cùng sửa chữa.
            </p>

            {!isLinked ? (
              <div className="bg-stone-800 rounded-lg p-4 text-center">
                <p className="text-sm text-amber-200/80 mb-4">Bạn cần liên kết tài khoản để ghi danh vào Bảng Xếp Hạng Cống Hiến.</p>
                <button 
                  onClick={linkGoogle}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors mb-2"
                >
                  Liên kết Google
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-2 px-4 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded font-medium transition-colors"
                >
                  Để sau
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Ghi rõ nguồn tài liệu lịch sử nếu có..."
                  className="w-full h-32 bg-stone-950 border border-stone-700 rounded-lg p-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-600 resize-none"
                />
                
                {status === 'error' && (
                  <p className="text-red-400 text-xs text-center">Có lỗi xảy ra, xin vui lòng thử lại sau.</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim() || status === 'submitting'}
                    className="flex-1 py-2 px-4 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white rounded font-medium transition-colors"
                  >
                    {status === 'submitting' ? 'Đang gửi...' : 'Gửi Góp Ý'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
