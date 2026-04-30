'use client'

import { motion, AnimatePresence } from 'framer-motion'

const STATS = [
  {
    icon: '⚔️',
    label: 'Binh Lực',
    color: '#C0392B',
    desc: 'Sức mạnh quân sự của triều đình. Quá thấp — giặc tràn vào. Quá cao — loạn tướng nổi dậy.',
    danger: 'cả hai chiều',
  },
  {
    icon: '👥',
    label: 'Dân Tâm',
    color: '#27AE60',
    desc: 'Lòng dân với triều đình. Xuống thấp — dân nổi loạn, mất chính danh.',
    danger: 'quá thấp',
  },
  {
    icon: '💰',
    label: 'Quốc Khố',
    color: '#F39C12',
    desc: 'Ngân sách quốc gia. Cạn kiệt — không nuôi được quân, không xây được gì.',
    danger: 'quá thấp',
  },
  {
    icon: '📜',
    label: 'Triều Cương',
    color: '#8E44AD',
    desc: 'Quyền lực triều đình. Quá thấp — quyền lực tan rã. Quá cao — độc tài, mất lòng người.',
    danger: 'cả hai chiều',
  },
]

const STEPS = [
  {
    icon: '📜',
    title: 'Gánh vác mệnh nước',
    desc: 'Mỗi quyết định của ngài là một tình huống có thật. Lịch sử được dệt nên từ chính những lựa chọn khó khăn này.',
  },
  {
    icon: '👆',
    title: 'Vuốt để định đoạt',
    desc: 'Kéo thẻ sang trái / phải để ban thánh chỉ. Chú ý: Không có quyết định nào làm hài lòng tất cả.',
  },
  {
    icon: '⚖️',
    title: 'Cân bằng quốc gia',
    desc: 'Giữ 4 trụ cột triều đình vững vàng. Một cột sụp đổ, cơ đồ hàng trăm năm cũng tan thành mây khói.',
  },
  {
    icon: '📖',
    title: 'Gìn giữ Sử Ký',
    desc: 'Mỗi thẻ lật đi là một bài học lịch sử được mở ra. Khám phá sự thật đằng sau những quyết định ngàn năm.',
  },
]

function StatRow({ stat }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-tran-border/25 last:border-0">
      <span className="text-xl shrink-0 mt-0.5">{stat.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-bold" style={{ color: stat.color }}>{stat.label}</span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{ background: `${stat.color}20`, color: stat.color }}
          >
            nguy hiểm: {stat.danger}
          </span>
        </div>
        <p className="text-tran-textMuted text-xs leading-snug">{stat.desc}</p>
      </div>
    </div>
  )
}

function StepRow({ step, index }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-tran-border/25 last:border-0">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={{ background: 'rgba(212,160,23,0.15)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.3)' }}
      >
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-tran-text text-xs font-semibold mb-0.5">{step.icon} {step.title}</p>
        <p className="text-tran-textMuted text-xs leading-snug">{step.desc}</p>
      </div>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-widest text-tran-textMuted/60 font-semibold mb-1.5">
        {title}
      </p>
      <div
        className="rounded-xl px-3 py-1"
        style={{ background: 'rgba(45,31,26,0.6)', border: '1px solid rgba(90,48,32,0.4)' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function HowToPlayModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-sm mx-auto rounded-t-2xl overflow-hidden"
            style={{ background: '#1A0F0A', border: '1px solid rgba(90,48,32,0.6)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-tran-border" />
            </div>

            <div className="px-4 pb-6 overflow-y-auto max-h-[82vh]">
              {/* Header */}
              <div className="text-center mb-5 mt-2">
                <p className="text-tran-secondary font-serif font-bold text-xl uppercase tracking-wider">Cẩm Nang Kế Thế</p>
                <p className="text-tran-textMuted text-xs mt-2 italic">Gánh vác giang sơn, viết tiếp những trang sử hào hùng của dân tộc Việt Nam</p>
              </div>

              {/* How to play steps */}
              <Block title="Cách chơi">
                {STEPS.map((step, i) => (
                  <StepRow key={i} step={step} index={i} />
                ))}
              </Block>

              {/* Stats */}
              <Block title="4 Chỉ Số Quốc Gia">
                {STATS.map((stat) => (
                  <StatRow key={stat.label} stat={stat} />
                ))}
              </Block>

              {/* Danger zone visual */}
              <Block title="Vùng Nguy Hiểm">
                <div className="py-2.5 space-y-2">
                  <div className="relative h-4 rounded-full overflow-hidden" style={{ background: '#2D1F1A' }}>
                    <div
                      className="absolute inset-y-0 left-0 flex items-center justify-center"
                      style={{ width: '15%', background: 'rgba(255,60,60,0.5)' }}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center justify-center"
                      style={{ width: '15%', background: 'rgba(255,60,60,0.3)' }}
                    />
                    <div
                      className="absolute inset-y-0"
                      style={{ left: '15%', right: '15%', background: 'rgba(39,174,96,0.25)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] text-tran-text font-medium tracking-wide">AN TOÀN</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-tran-textMuted px-0.5">
                    <span className="text-red-400">≤ 15 → Thua</span>
                    <span className="text-tran-textMuted/50">0 ——————— 100</span>
                    <span className="text-red-400">≥ 85 → Thua*</span>
                  </div>
                  <p className="text-[10px] text-tran-textMuted/60 leading-snug">
                    * Chỉ áp dụng cho <span style={{ color: '#C0392B' }}>Binh Lực</span> và <span style={{ color: '#8E44AD' }}>Triều Cương</span>
                  </p>
                </div>
              </Block>

              {/* Tips */}
              <Block title="Tinh Thần & Giá Trị Cốt Lõi">
                <div className="py-2 space-y-3.5">
                  {[
                    { icon: '🇻🇳', title: 'Hồn Thiêng Lịch Sử', tip: 'Mọi sự kiện đều dựa trên chính sử. Hãy để lòng yêu nước soi đường cho mỗi thánh chỉ của ngài.' },
                    { icon: '⌛', title: 'Dòng Thời Gian', tip: 'Làm trái lịch sử sẽ làm loạn thời không. Nhưng ngài luôn có thể thử nghiệm để trả lời câu hỏi "Nếu như?".' },
                    { icon: '🛡️', title: 'Cơ Hội Làm Lại', tip: 'Lịch sử đầy gian nan. Nếu triều đại sụp đổ, ngài luôn có quyền Cứu Nguy để sửa sai và đi tiếp.' },
                    { icon: '✨', title: 'Giải Trí & Tự Hào', tip: 'Trước hết đây là một trò chơi giải trí (Fun First), nhưng đọng lại sẽ là lòng tự hào dân tộc (Learn Always).' },
                  ].map(({ icon, title, tip }, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="text-tran-secondary text-xs font-bold mb-0.5">{title}</p>
                        <p className="text-tran-textMuted text-xs leading-relaxed">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Block>

              <button
                onClick={onClose}
                className="w-full py-3.5 mt-2 rounded-xl border border-tran-secondary/30 bg-tran-secondary/10 hover:bg-tran-secondary/20 text-tran-secondary text-sm font-bold uppercase tracking-wider transition-colors"
                style={{ minHeight: 48 }}
              >
                Tuân Mệnh! Bắt đầu gánh vác
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
