'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_COLOR = {
  'Nhân Vật': 'text-yellow-400',
  'Trận Chiến': 'text-red-400',
  'Sự Kiện': 'text-blue-400',
  'Văn Học': 'text-purple-400',
}

export default function SuKyCard({ entry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-tran-card border border-tran-border rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setExpanded(v => !v)}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`text-xs font-medium ${CATEGORY_COLOR[entry.category] ?? 'text-tran-textMuted'}`}>
              {entry.category}
            </span>
            <h3 className="text-tran-text font-serif font-bold text-sm mt-0.5">{entry.title}</h3>
          </div>
          <span className="text-tran-textMuted text-xs shrink-0 mt-1">{expanded ? '▲' : '▼'}</span>
        </div>
        <p className="text-tran-textMuted text-xs mt-1 leading-snug">{entry.shortFact}</p>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-tran-border/50 pt-2">
              <p className="text-tran-text/80 text-xs leading-relaxed">{entry.detail}</p>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                {entry.source && (
                  <p className="text-tran-textMuted text-xs italic">— {entry.source}</p>
                )}
                {entry.learnMore && (
                  <a
                    href={entry.learnMore}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-tran-secondary text-xs underline underline-offset-2 shrink-0"
                  >
                    Đọc thêm →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
