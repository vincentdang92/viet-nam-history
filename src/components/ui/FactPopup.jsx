'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FeedbackModal from './FeedbackModal'

export default function FactPopup({ fact, onDismiss }) {
  const [showFeedback, setShowFeedback] = useState(false)
  return (
    <>
      <AnimatePresence>
        {fact && (
          <motion.div
            key="fact-popup-overlay"
            className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.div
            className="relative w-full max-w-sm"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Accent line */}
            <div
              className="h-0.5 w-16 rounded-full mx-auto mb-3"
              style={{ backgroundColor: fact.isHistorical ? '#D4A017' : '#8E44AD' }}
            />

            <div className="bg-tran-card border border-tran-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div
                className="px-4 pt-3 pb-2 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(90,48,32,0.5)' }}
              >
                <span className="text-xl">
                  {fact.isHistorical ? '📖' : '🔄'}
                </span>
                <div>
                  <p className="text-xs font-semibold"
                    style={{ color: fact.isHistorical ? '#D4A017' : '#8E44AD' }}>
                    {fact.isHistorical ? 'Lịch Sử Thật' : 'Điều Chỉnh Lịch Sử'}
                  </p>
                  <p className="text-tran-textMuted text-[10px]">
                    {fact.isHistorical ? 'Đây là điều đã xảy ra' : 'Trong thực tế...'}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3 relative">
                <p className="text-tran-text text-sm leading-relaxed">{fact.text}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowFeedback(true) }}
                  className="absolute bottom-1 right-2 text-xs text-amber-600/70 hover:text-amber-500 underline underline-offset-2 flex items-center gap-1"
                >
                  <span>📝</span> Báo sai sót
                </button>
              </div>

              {/* CTA */}
              <div className="px-4 pb-4">
                <motion.button
                  onClick={onDismiss}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: fact.isHistorical ? 'rgba(212,160,23,0.15)' : 'rgba(142,68,173,0.15)',
                    border: `1px solid ${fact.isHistorical ? 'rgba(212,160,23,0.4)' : 'rgba(142,68,173,0.4)'}`,
                    color: fact.isHistorical ? '#D4A017' : '#8E44AD',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Tiếp tục →
                </motion.button>
              </div>
            </div>

            <p className="text-center text-tran-textMuted text-[10px] mt-2">
              Nhấn bất kỳ đâu để tiếp tục
            </p>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
        eventId={fact?.eventId} 
      />
    </>
  )
}
