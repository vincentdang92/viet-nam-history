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
    icon: '🃏',
    title: 'Đọc thẻ sự kiện',
    desc: 'Mỗi thẻ là một tình huống lịch sử thật. Có nhân vật, có bối cảnh, có lời thoại.',
  },
  {
    icon: '👆',
    title: 'Kéo hoặc nhấn để chọn',
    desc: 'Kéo thẻ sang trái / phải, hoặc nhấn vào nút chọn phía dưới. Không có lựa chọn nào hoàn toàn đúng.',
  },
  {
    icon: '📊',
    title: 'Theo dõi 4 chỉ số',
    desc: 'Mỗi quyết định thay đổi chỉ số. Giữ tất cả trong vùng an toàn (không quá thấp, không quá cao).',
  },
  {
    icon: '📖',
    title: 'Mở khóa Sử Ký',
    desc: 'Sau mỗi lựa chọn có popup sự thật lịch sử. Các thành tựu đặc biệt mở khóa trang Sử Ký.',
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
              <div className="text-center mb-5">
                <p className="text-tran-secondary font-serif font-bold text-lg">Hướng Dẫn Chơi</p>
                <p className="text-tran-textMuted text-xs mt-1">Dẫn dắt triều đại qua những thăng trầm lịch sử</p>
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
              <Block title="Mẹo Chơi">
                <div className="py-2 space-y-2.5">
                  {[
                    { icon: '⚖️', tip: 'Cân bằng là chìa khóa — không có đường thắng nào chỉ chọn một phía.' },
                    { icon: '📖', tip: 'Đọc fact sau mỗi thẻ — đó là lịch sử thật, không phải hư cấu.' },
                    { icon: '🎯', tip: 'Thua là bình thường. Lịch sử Việt Nam đầy gian nan — hãy thử lại và học từ thất bại.' },
                    { icon: '📺', tip: 'Khi sắp thua, có thể xem quảng cáo để hồi sinh một lần.' },
                  ].map(({ icon, tip }, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-base shrink-0">{icon}</span>
                      <p className="text-tran-textMuted text-xs leading-snug">{tip}</p>
                    </div>
                  ))}
                </div>
              </Block>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-tran-border text-tran-textMuted text-sm active:opacity-70 transition-opacity"
                style={{ minHeight: 48 }}
              >
                Đã hiểu, bắt đầu thôi!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
