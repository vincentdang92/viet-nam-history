'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTopContributors, getTopArenaPlayers } from '../../lib/firestore'
import { getContributionTitle, ARENA_BOTS } from '../../constants/gameConfig'
import { useGame } from '../../context/GameContext'
import { generateBotGhost } from '../../utils/ghostGenerator'

export default function LeaderboardScreen({ onBack }) {
  const { dispatch } = useGame()
  const [activeTab, setActiveTab] = useState('arena') // 'arena' | 'contrib'
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const handleDuel = (targetUser) => {
    let ghostData = targetUser.ghostData
    if (!ghostData && targetUser.isBot) {
      ghostData = generateBotGhost(targetUser)
    } else if (typeof ghostData === 'string') {
      try { ghostData = JSON.parse(ghostData) } catch (e) {}
    }
    
    if (!ghostData || !ghostData.questions || ghostData.questions.length === 0) {
      alert("Người chơi này chưa có đủ dữ liệu lịch sử thi đấu hợp lệ!")
      return
    }

    dispatch({ type: 'START_DUEL', payload: { targetUser, ghostData } })
  }

  useEffect(() => {
    setLoading(true)
    if (activeTab === 'contrib') {
      getTopContributors().then(data => {
        setLeaders(data)
        setLoading(false)
      })
    } else {
      getTopArenaPlayers(50).then(data => {
        // Mix real players with bots and sort
        const combined = [...data, ...ARENA_BOTS].sort((a, b) => b.score - a.score).slice(0, 50)
        setLeaders(combined)
        setLoading(false)
      })
    }
  }, [activeTab])

  return (
    <motion.div 
      className="absolute inset-0 z-50 bg-stone-950 flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
    >
      <div className="flex-1 flex flex-col pb-safe overflow-hidden min-h-0">
        {/* Header */}
        <div className="bg-stone-950/90 backdrop-blur-md px-4 pt-4 pb-2 border-b border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-900 text-stone-400 hover:text-white"
            >
              ←
            </button>
            <h2 className="text-xl font-bold font-serif text-amber-500 text-center flex-1 pr-10">
              Quốc Sử Viện
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex bg-stone-900 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'arena' ? 'bg-red-900 text-white shadow' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Lôi Đài
            </button>
            <button
              onClick={() => setActiveTab('contrib')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'contrib' ? 'bg-amber-900 text-white shadow' : 'text-stone-400 hover:text-stone-200'}`}
            >
              Cống Hiến
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-lg text-amber-200">
              {activeTab === 'arena' ? 'Trạng Nguyên Bảng' : 'Bảng Xếp Hạng Cống Hiến'}
            </h3>
            <p className="text-xs text-stone-400">
              {activeTab === 'arena' 
                ? 'Đua top điểm số Lôi Đài Lịch Sử với anh hùng hào kiệt.' 
                : 'Vinh danh những Sử Gia đã đóng góp để hoàn thiện dữ liệu lịch sử Đại Việt.'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <p>Chưa có ai được ghi danh.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaders.map((user, idx) => {
                const titleMeta = activeTab === 'contrib' ? getContributionTitle(user.score) : null
                return (
                  <motion.div 
                    key={user.id}
                    className={`rounded-xl border transition-all ${user.isBot ? 'bg-stone-900/50 border-stone-800/50 opacity-80' : 'bg-stone-900 border-stone-800'} ${selectedUserId === user.id ? 'border-amber-600 shadow-lg shadow-amber-900/20' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div 
                      className="flex items-center gap-3 p-3 cursor-pointer"
                      onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                    >
                      <div className="w-8 flex justify-center">
                        <span className={`text-lg font-bold ${idx < 3 ? 'text-amber-500' : 'text-stone-500'}`}>
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-stone-200 truncate">
                            {user.playerName || 'Ẩn Danh'}
                          </p>
                          {user.isBot && <span className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">NPC</span>}
                        </div>
                        {titleMeta && (
                          <p className="text-xs font-medium" style={{ color: titleMeta.color }}>
                            {titleMeta.title}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${activeTab === 'arena' ? 'text-red-400' : 'text-amber-500'}`}>{user.score || 0}</p>
                        <p className="text-[10px] text-stone-500">điểm</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedUserId === user.id && activeTab === 'arena' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-stone-800/50 bg-stone-950/30"
                        >
                          <div className="p-3 flex justify-between items-center gap-4">
                            <p className="text-xs text-stone-400 flex-1">
                              {user.isBot 
                                ? 'Thách đấu với Danh nhân lịch sử để kiểm chứng tài năng.'
                                : 'Đấu lại bóng ma (Ghost) dựa trên lịch sử thi đấu của người này.'}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuel(user)
                              }}
                              className="bg-red-800 hover:bg-red-700 text-red-100 px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-colors flex items-center gap-2"
                            >
                              <span>⚔️</span> Tỉ Thí
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
