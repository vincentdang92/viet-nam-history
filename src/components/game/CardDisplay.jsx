'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import CharacterPortrait from './CharacterPortrait'
import charactersData from '../../data/characters.json'

const TYPE_BADGE = {
  battle:     { label: '⚔️ Trận Chiến',        cls: 'bg-red-900/70 text-red-200 border border-red-700/50' },
  cinematic:  { label: '✨ Sự Kiện Trọng Đại',  cls: 'bg-yellow-900/70 text-yellow-200 border border-yellow-700/50' },
  historical: { label: '📜 Lịch Sử',            cls: 'bg-purple-900/60 text-purple-200' },
  event:      { label: '🎭 Sự Kiện',            cls: 'bg-blue-900/60 text-blue-200' },
}

const RARITY_FOIL = {
  legendary: 'linear-gradient(135deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.4) 50%, rgba(255,255,255,0.6) 55%, rgba(255,215,0,0) 60%)',
  rare: 'linear-gradient(135deg, rgba(192,192,192,0) 0%, rgba(192,192,192,0.3) 50%, rgba(255,255,255,0.6) 55%, rgba(192,192,192,0) 60%)',
  epic: 'linear-gradient(135deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.4) 50%, rgba(255,255,255,0.6) 55%, rgba(138,43,226,0) 60%)',
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  },
}

export default function CardDisplay({ event }) {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!event) return null

  const badge   = TYPE_BADGE[event.type] ?? TYPE_BADGE.event
  const isBig   = event.type === 'battle' || event.isCinematic
  const rarity  = event.rarity || 'common'
  
  // Find character data for the back side
  const charData = charactersData.find(c => c.id === event.character)

  return (
    <div 
      className="w-full h-full relative cursor-pointer flex flex-col" 
      style={{ perspective: 1200 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative flex flex-col"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
      >
        {/* === FRONT SIDE === */}
        <motion.div 
          className="absolute inset-0 w-full h-full flex flex-col pb-4"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          {/* Portrait taking full card */}
          <motion.div variants={stagger.item} className="absolute inset-0 w-full h-full shrink-0">
            <CharacterPortrait characterId={event.character} isCinematic={isBig} />
            
            {/* Absolute positioning for Badge and Year over the portrait */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10 pointer-events-none">
              <span className={`text-[10px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-md font-medium ${badge.cls}`}>
                {badge.label}
              </span>
              <span className="bg-black/60 text-tran-secondary text-xs font-mono px-2 py-1 rounded-lg border border-tran-secondary/30 backdrop-blur-md">
                {event.year}
              </span>
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="absolute bottom-0 left-0 w-full flex flex-col items-center p-4 sm:p-5 pt-12 pb-5 text-center justify-end z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
            <h2 className={`text-tran-text font-serif font-bold leading-snug ${isBig ? 'text-[1.35rem] sm:text-2xl' : 'text-lg sm:text-xl'} mb-1.5 sm:mb-2 drop-shadow-md`}>
              {event.title}
            </h2>
            
            <p className="text-tran-text/90 text-[13px] sm:text-sm leading-relaxed mb-2.5 sm:mb-3 drop-shadow-md">
              {event.context}
            </p>
            
            {event.quote && (
              <p className="text-tran-secondary italic text-[11px] sm:text-[13px] leading-snug pt-2.5 sm:pt-3 w-full drop-shadow-md">
                &ldquo;{event.quote}&rdquo;
              </p>
            )}
          </motion.div>

          {/* Holographic Shimmer Overlay */}
          {RARITY_FOIL[rarity] && (
            <motion.div 
              className="absolute inset-0 z-20 pointer-events-none mix-blend-color-dodge opacity-60 rounded-2xl"
              style={{ backgroundImage: RARITY_FOIL[rarity], backgroundSize: '200% 200%' }}
              animate={{ backgroundPosition: ['0% 0%', '200% 200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          )}
          
          {/* Hint to flip */}
          {charData && (
            <div className="absolute top-3 right-3 z-10 text-[10px] bg-black/60 text-tran-textMuted px-2 py-1 rounded-lg flex items-center gap-1">
              <span>Nhấn lật</span> 🔄
            </div>
          )}
        </motion.div>

        {/* === BACK SIDE === */}
        <div 
          className="absolute inset-0 bg-tran-card rounded-2xl p-5 sm:p-6 border-2 border-tran-border/50 flex flex-col"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', WebkitTransform: 'rotateY(180deg)' }}
        >
          {charData ? (
            <div className="flex flex-col h-full text-center items-center justify-start overflow-y-auto no-scrollbar">
              <div className="w-16 h-1 bg-tran-border/50 rounded-full mb-4 sm:mb-6 mx-auto" />
              <h3 className="text-xl sm:text-2xl font-serif text-tran-secondary font-bold mb-1">{charData.fullName}</h3>
              <p className="text-[11px] sm:text-xs text-tran-textMuted mb-3 sm:mb-4 font-mono">{charData.years}</p>
              
              <div className="w-full bg-black/30 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-tran-border/30">
                <p className="text-[13px] sm:text-sm text-tran-text/90 italic">"{charData.role}"</p>
              </div>
              
              <p className="text-[13px] sm:text-sm leading-relaxed text-tran-text/80 mb-4 sm:mb-6 text-left">
                {charData.bio}
              </p>
              
              <div className="mt-auto pt-3 sm:pt-4 border-t border-tran-border/30 w-full">
                <p className="text-[10px] sm:text-xs text-tran-textMuted uppercase tracking-widest mb-1">Tính cách</p>
                <p className="text-[13px] sm:text-sm text-tran-secondary/80 font-medium">{charData.personality}</p>
              </div>

              {/* Show culture info on the back of the card if available */}
              {event.type === 'culture' && event.choices[0]?.modernLocation && (
                <div className="mt-4 pt-4 border-t border-tran-border/30 w-full text-left text-[11px] space-y-1.5">
                  <p className="text-tran-textMuted flex items-start gap-1.5">
                    <span className="shrink-0">📍</span> 
                    <span><strong className="text-tran-text font-medium">Nay là:</strong> {event.choices[0].modernLocation}</span>
                  </p>
                  {event.choices[0].specialty && (
                    <p className="text-tran-textMuted flex items-start gap-1.5">
                      <span className="shrink-0">🍜</span> 
                      <span><strong className="text-tran-text font-medium">Đặc sản:</strong> {event.choices[0].specialty}</span>
                    </p>
                  )}
                  {event.choices[0].referenceLink && (
                    <a 
                      href={event.choices[0].referenceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      🔗 Tìm hiểu thêm
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-tran-textMuted text-sm">
              Dữ liệu nhân vật đã thất lạc trong sử sách...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
