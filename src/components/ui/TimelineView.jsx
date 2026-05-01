'use client'

import { motion } from 'framer-motion'
import timeline from '../../data/timeline.json'

const ARC_COLOR = {
  1: '#8B1A1A',
  2: '#C0392B',
  3: '#8E44AD',
  4: '#1A6B3C',
  5: '#8B5A00',
}

import { formatArcName, ARC_LABEL } from '../../utils/helpers'

export default function TimelineView() {
  let lastArc = null

  return (
    <div className="pb-6">
      {timeline.map((event, i) => {
        const showArcHeader = event.arc !== lastArc
        lastArc = event.arc
        const color = ARC_COLOR[event.arc] ?? '#5A3020'

        return (
          <div key={i}>
            {showArcHeader && (
              <motion.div
                className="flex items-center gap-2 px-4 pt-5 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="h-px flex-1" style={{ background: color + '50' }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2" style={{ color }}>
                  {formatArcName(event.arc)} - {ARC_LABEL[event.arc]}
                </span>
                <div className="h-px flex-1" style={{ background: color + '50' }} />
              </motion.div>
            )}

            <motion.div
              className="flex gap-3 px-4 py-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              {/* Left: year + line */}
              <div className="flex flex-col items-center" style={{ width: 44 }}>
                <span className="text-[10px] font-bold shrink-0" style={{ color }}>
                  {event.year}
                </span>
                <div className="flex-1 w-px mt-1" style={{ background: color + '30', minHeight: 16 }} />
              </div>

              {/* Dot */}
              <div className="shrink-0 mt-1" style={{ width: 8, height: 8 }}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <p className="text-tran-text text-xs font-semibold leading-snug">{event.title}</p>
                <p className="text-tran-textMuted text-[11px] leading-relaxed mt-0.5">{event.desc}</p>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
