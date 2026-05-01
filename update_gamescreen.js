const fs = require('fs');
const file = './src/components/screens/GameScreen.jsx';
let code = fs.readFileSync(file, 'utf8');

// We'll replace GameHeader component
const newGameHeader = `
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBgMusic } from '../../hooks/useBgMusic'

function GameHeader({ arc, activeTitle, onSuKy, onHome, onToggleMap, onToggleFaction, inventory, activeQuest, hintsLeft, onUseHint }) {
  const { unlocked } = useSuKy()
  const { muted, toggle: toggleMusic } = useBgMusic()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={onHome}
          className="text-tran-textMuted active:opacity-60 flex items-center justify-center rounded-lg border border-tran-border bg-tran-card"
          style={{ width: 36, height: 36 }}
          title="Về trang chủ"
        >
          ⌂
        </button>
        <div>
          <p className="text-tran-textMuted text-[10px] uppercase tracking-widest flex items-center gap-1">
            {DYNASTY_LABEL[arc] ?? 'Đại Việt'}
            {activeTitle && (
              <span className="text-tran-secondary bg-tran-secondary/10 px-1 rounded border border-tran-secondary/20">
                {TITLES_META[activeTitle]?.name}
              </span>
            )}
          </p>
          <p className="text-tran-secondary text-xs font-semibold">{ARC_LABEL[arc]}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Active Quest */}
        {activeQuest && (
          <div className="relative group flex items-center justify-center w-8 h-8 rounded-full bg-tran-card border border-tran-border cursor-help">
            <span className="text-sm">📜</span>
            <div className="absolute top-full mt-2 right-0 w-48 p-3 bg-tran-bg border border-tran-border rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 pointer-events-none z-[100] transition-opacity">
              <p className="font-bold text-tran-secondary mb-1 text-xs">{activeQuest.title}</p>
              <p className="text-tran-textMuted text-[10px] leading-relaxed mb-2">{activeQuest.desc}</p>
              <div className="w-full bg-tran-card rounded-full h-1.5 overflow-hidden border border-tran-border/50">
                <div className="bg-tran-secondary h-full transition-all" style={{ width: \`\${(activeQuest.progress / activeQuest.duration) * 100}%\` }} />
              </div>
            </div>
          </div>
        )}

        {/* Inventory Items */}
        {inventory?.length > 0 && (
          <div className="flex gap-1 mr-1">
            {inventory.map(id => (
              <div key={id} className="relative group cursor-pointer">
                <span className="text-lg filter drop-shadow-md">
                  {ITEMS_DATA[id]?.icon}
                </span>
                <div className="absolute top-full mt-1 right-0 w-32 p-2 bg-tran-bg border border-tran-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-[100] transition-opacity">
                  <p className="font-bold text-tran-secondary text-[11px] mb-0.5">{ITEMS_DATA[id]?.name}</p>
                  <p className="text-tran-textMuted text-[9px] leading-tight">{ITEMS_DATA[id]?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expandable Menu Button */}
        <div className="relative z-[60]">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-tran-card border border-tran-border hover:border-tran-secondary/50 transition-colors"
          >
            <span className="text-tran-textMuted text-lg leading-none">{menuOpen ? '×' : '⋮'}</span>
          </button>
          
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 bg-tran-bg/95 backdrop-blur-md border border-tran-border rounded-xl shadow-2xl p-2 flex flex-col gap-2 min-w-[140px]"
              >
                <button
                  onClick={() => { onToggleMap(); setMenuOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-tran-card text-tran-textMuted hover:text-tran-secondary transition-colors text-left text-sm"
                >
                  <span>🗺️</span> Bản đồ
                </button>
                <button
                  onClick={() => { onToggleFaction(); setMenuOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-tran-card text-tran-textMuted hover:text-tran-secondary transition-colors text-left text-sm"
                >
                  <span>👥</span> Phe phái
                </button>
                <button
                  onClick={toggleMusic}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-tran-card text-tran-textMuted hover:text-tran-secondary transition-colors text-left text-sm border-t border-tran-border/30 pt-3 mt-1"
                >
                  <span>{muted ? '🔇' : '🎵'}</span> {muted ? 'Bật nhạc' : 'Tắt nhạc'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
`;

// regex to replace the function GameHeader
code = code.replace(/function GameHeader\([\s\S]*?return \([\s\S]*?\n}\n/m, newGameHeader);
if (!code.includes('import { useState }')) {
  code = code.replace("import { motion, AnimatePresence } from 'framer-motion'", "import { motion, AnimatePresence } from 'framer-motion'\nimport { useState } from 'react'\nimport { useBgMusic } from '../../hooks/useBgMusic'");
}
fs.writeFileSync(file, code);
