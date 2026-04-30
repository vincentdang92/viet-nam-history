# Minh Chủ — Game Lịch Sử Việt Nam

## Project Overview

Reigns-style edutainment game về lịch sử Việt Nam. Người chơi đóng vai vua/tướng, đưa ra quyết định ảnh hưởng vận mệnh đất nước. MVP: Chapter Kỷ Trần - Hồ - Lê Sơ (1225–1428).

**Core Philosophy:** Fun First, Learn Always — người chơi cảm thấy đang CHƠI GAME nhưng thực ra đang HỌC LỊCH SỬ.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v3 (custom `tran-*` color tokens)
- Framer Motion v11 (animations)
- React Context + useReducer (state management)
- JSON data (no backend)

## Run Commands

```bash
npm install
npm run dev      # localhost:3000
npm run build
npm start
```

## Directory Structure

```
app/
  layout.jsx            # Root layout (metadata, fonts, globals.css)
  page.jsx              # Homepage → imports <Game />
  globals.css           # Tailwind + base styles
src/
  components/Game.jsx   # 'use client' root — GameProvider + router
  components/screens/   # HomeScreen, GameScreen, GameOverScreen, SuKyScreen
  components/game/      # CardDisplay, ChoiceButton, StatsBar, etc.
  components/ui/        # FactPopup, EndingCard, SuKyCard
  context/GameContext   # Global state + dispatch ('use client')
  engine/               # gameEngine, statsEngine, eventResolver, endingChecker
  data/chapters/tran_dynasty/  # arc1, arc2, arc3, arc4, arc5 JSON
  data/                 # characters.json, endings.json, chapters.json, sysEvents.json
  constants/            # gameConfig.js, theme.js
  hooks/                # useSwipe, useSuKy ('use client')
```

## Next.js Notes

- All interactive components use `'use client'` directive
- `app/page.jsx` is a Server Component — only imports `<Game />`
- JSON data imported directly (no fetch) — works in both server/client
- No `src/main.jsx` or `index.html` — Next.js handles entry point

## Game State

```js
{
  gameStatus: 'menu' | 'playing' | 'gameover' | 'ending',
  chapter: 'tran_dynasty',
  currentArc: 1 | 2 | 3 | 4 | 5,
  currentYear: 1225,
  yearsReigned: 0,
  stats: { binhLuc, danTam, quocKho, trieuCuong },  // 0–100 each
  historicalScore: 100, // 0-100%
  flags: { tranHungDaoUnlocked, wonBattle1257, wonBattle1285, wonBattle1288 },
  unlockedSuKy: [],
  unlockedCompanions: [],
  selectedCompanion: null,
  activeTitle: null,
  inventory: [],
  activeQuest: null,
  combatState: null,
  espionageState: null,
  poetryState: null,
  mapState: { ... },
  factionState: { ... },
  currentEvent: { ... },
  showFactPopup: false,
  pendingFact: null,
  
  // Arena & Ghost Mode
  arenaScore: 0,
  arenaLives: 3,
  arenaCombo: 0,
  duelTarget: null,
  duelGhost: null,
}
```

## 4 Core Stats

| Key | Label | Icon | Color |
|-----|-------|------|-------|
| `binhLuc` | Binh Lực | ⚔️ | #C0392B |
| `danTam` | Dân Tâm | 👥 | #27AE60 |
| `quocKho` | Quốc Khố | 💰 | #F39C12 |
| `trieuCuong` | Triều Cương | 📜 | #8E44AD |

Game over khi bất kỳ stat ≤ 15 (hoặc binhLuc/trieuCuong ≥ 85).

## Color Tokens (Tailwind)

```
bg-tran-bg       #1A0F0A   (nền tối)
text-tran-text   #F5E6D0   (chữ kem)
tran-secondary   #D4A017   (vàng đế vương)
tran-primary     #8B1A1A   (đỏ trầm)
tran-card        #2D1F1A   (nền thẻ bài)
tran-border      #5A3020   (viền)
tran-textMuted   #A08070   (chữ mờ)
```

## Event Card Schema

```json
{
  "id": "tran_arc1_005",
  "arc": 1,
  "year": 1237,
  "type": "historical",       // "historical" | "event" | "battle" | "cinematic"
  "title": "...",
  "context": "...",
  "character": "tran_hung_dao",
  "quote": "...",
  "choices": [
    {
      "id": "choice_a",
      "text": "...",
      "effects": { "binhLuc": 5, "danTam": 0, "quocKho": -5, "trieuCuong": 5 },
      "isHistorical": true,
      "fact": "...",
      "chainNext": "tran_arc1_006",
      "unlockSuKy": "su_ky_id",
      "setFlag": { "wonBattle1257": true },
      "endArc": false
    }
  ],
  "isCinematic": false,
  "background": "thang_long_palace"
}
```

## Agents Available

- [CONTENT_AGENT.md](agents/CONTENT_AGENT.md) — Viết thẻ sự kiện lịch sử JSON
- [UI_AGENT.md](agents/UI_AGENT.md) — Tạo và sửa React components
- [DATA_AGENT.md](agents/DATA_AGENT.md) — Quản lý data, endings, characters

## Important Rules

1. Không cần backend — tất cả data là JSON tĩnh
2. Mobile-first — test trên viewport 390px
3. Mọi fact phải dựa trên lịch sử có nguồn gốc rõ ràng
4. Effects phải balanced — không có lựa chọn nào hoàn toàn "đúng"
5. Mỗi thẻ phải có ít nhất 1 `fact` popup chứa thông tin lịch sử thật
6. **Rarity System**: Hệ thống sẽ tự cấp phát độ hiếm (rare, epic, legendary) cho thẻ thường. Không gán cứng thuộc tính `rarity` trong thẻ JSON lịch sử trừ khi đó là thẻ Thần thoại (Mythic).
7. **Card UI**: Thẻ hiển thị kiểu TCG, có thể lật (Flip) để xem `bio`, `role` của character. Cần tối ưu placeholder SVG nếu không có ảnh.
8. Luôn đọc các file CLAUDE.md, ARCHITECTURE.md và thư mục agents/ khi làm mới hoặc update tính năng. Cập nhật các tài liệu này nếu thấy cần thiết.
9. **Framer Motion Gotchas**: Tuyệt đối KHÔNG dùng `AnimatePresence` trực tiếp với các custom function component (như các màn hình Router). Phải bọc chúng trong thẻ `<motion.div>` native có `exit` prop, hoặc dùng chiến thuật Fixed Overlay (`fixed inset-0 z-50`) render đè lên thay vì unmount component cũ để tránh lỗi kẹt `opacity: 0` hay render đúp màn hình.
