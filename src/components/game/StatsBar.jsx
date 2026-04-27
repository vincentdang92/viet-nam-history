'use client'

import { motion } from 'framer-motion'
import { STAT_META, STAT_KEYS } from '../../constants/gameConfig'

function StatItem({ statKey, value, base }) {
  const meta = STAT_META[statKey]
  const isDanger = value <= 25 || value >= 80
  const delta = base !== undefined ? value - base : 0
  const barColor = isDanger ? '#FF4444' : meta.color

  return (
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
      {/* Label row */}
      <div className="flex items-center gap-1">
        <span className="text-xs leading-none shrink-0">{meta.icon}</span>
        <span className="text-tran-textMuted text-[10px] truncate leading-none flex-1">{meta.label}</span>
        <span
          className="text-[11px] font-bold leading-none shrink-0 tabular-nums"
          style={{ color: barColor }}
        >
          {value}
        </span>
        {delta !== 0 && (
          <motion.span
            key={`${statKey}-${delta}`}
            className="text-[9px] font-bold leading-none shrink-0"
            style={{ color: delta > 0 ? '#4CAF50' : '#FF6B6B' }}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {delta > 0 ? `+${delta}` : delta}
          </motion.span>
        )}
      </div>
      {/* Bar row */}
      <div className="bg-black/40 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}

export default function StatsBar({ stats, baseStats }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 px-4 py-3 bg-black/30 rounded-xl">
      {STAT_KEYS.map(key => (
        <StatItem
          key={key}
          statKey={key}
          value={stats[key]}
          base={baseStats?.[key]}
        />
      ))}
    </div>
  )
}
