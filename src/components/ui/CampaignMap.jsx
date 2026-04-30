'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { MAP_NODES, MAP_EDGES } from '../../constants/mapConfig'

export default function CampaignMap() {
  const { state, dispatch } = useGame()
  const { isMapOpen, mapState } = state

  if (!isMapOpen) return null

  const getColor = (status) => {
    switch(status) {
      case 'player': return '#27AE60' // Xanh Đại Việt
      case 'enemy': return '#C0392B' // Đỏ Nguyên Mông
      case 'contested': return '#F39C12' // Vàng giao tranh
      default: return '#A08070'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-tran-bg/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-tran-border/30 bg-tran-card">
          <h2 className="text-xl font-bold text-tran-secondary">Bản Đồ Chiến Sự</h2>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_MAP' })}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-tran-bg text-tran-text hover:text-white transition-colors border border-tran-border"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden p-4">
          <div className="absolute inset-0 max-w-sm mx-auto my-auto aspect-[3/4] border-2 border-tran-border/20 rounded-xl bg-[#2D1F1A]/50">
            {/* Draw Edges */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {MAP_EDGES.map((edge, idx) => {
                const nodeA = MAP_NODES[edge[0]]
                const nodeB = MAP_NODES[edge[1]]
                return (
                  <line 
                    key={idx}
                    x1={`${nodeA.x}%`} 
                    y1={`${nodeA.y}%`} 
                    x2={`${nodeB.x}%`} 
                    y2={`${nodeB.y}%`} 
                    stroke="#A08070" 
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                )
              })}
            </svg>

            {/* Draw Nodes */}
            {Object.values(MAP_NODES).map(node => {
              const status = mapState[node.id] || 'player'
              const color = getColor(status)
              
              return (
                <motion.div 
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                >
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: color }}
                  />
                  <div className="mt-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 whitespace-nowrap">
                    <span className="text-[10px] font-bold" style={{ color: color }}>
                      {node.name}
                    </span>
                  </div>
                  
                  {/* Pulse effect if enemy */}
                  {status === 'enemy' && (
                    <motion.div 
                      className="absolute top-0 w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-4 py-2 bg-tran-card rounded-full border border-tran-border/50 text-[10px] font-medium shadow-xl">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#27AE60]"></div> Đại Việt</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#C0392B]"></div> Nguyên Mông</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
