'use client'

import { motion } from 'framer-motion'
import { STAT_META, STAT_KEYS } from '../../constants/gameConfig'

function StatItem({ statKey, value, base }) {
  const meta = STAT_META[statKey]
  const isDanger = value <= 25 || value >= 80
  const delta = base !== undefined ? value - base : 0

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      <span className="text-sm shrink-0">{meta.icon}</span>
      <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ backgroundColor: isDanger ? '#FF4444' : meta.color }}
        />
      </div>
      {delta !== 0 && (
        <motion.span
          key={`${statKey}-${delta}`}
          className="text-[10px] font-bold w-6 text-right shrink-0"
          style={{ color: delta > 0 ? '#4CAF50' : '#FF6B6B' }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {delta > 0 ? `+${delta}` : delta}
        </motion.span>
      )}
    </div>
  )
}

export default function StatsBar({ stats, baseStats }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-4 py-2.5 bg-black/30 rounded-xl">
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
