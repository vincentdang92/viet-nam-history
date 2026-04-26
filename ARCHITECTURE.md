# 🏯 MINH CHỦ — Game Mô Phỏng Lịch Sử Việt Nam
## Tài Liệu Kiến Trúc Dự Án (MVP Webapp)

---

## 1. TỔNG QUAN DỰ ÁN

### Vision
Game edutainment mô phỏng kiểu Reigns — người chơi đóng vai vua/tướng qua các triều đại Việt Nam, đưa ra quyết định ảnh hưởng vận mệnh đất nước. Vừa giải trí, vừa học lịch sử một cách tự nhiên.

### Target Audience
- Học sinh THCS, THPT muốn ôn luyện lịch sử
- Người yêu lịch sử Việt Nam, muốn trải nghiệm "what if"

### Core Philosophy
```
Fun First, Learn Always
Người chơi cảm thấy đang CHƠI GAME
Nhưng thực ra đang HỌC LỊCH SỬ
```

### MVP Scope
- Chapter đầu tiên: Nhà Trần (1225–1400)
- ~45–50 thẻ sự kiện
- 5 endings khác nhau
- Web app, mobile-first, không cần backend

---

## 2. TECH STACK

```
Frontend Framework  : React 18 + Vite
Styling             : Tailwind CSS v3
Animation           : Framer Motion
State Management    : React Context + useReducer (không cần Redux)
Data Layer          : JSON tĩnh (không cần backend ở MVP)
Font                : Google Fonts (Noto Serif, Be Vietnam Pro)
Deploy              : Vercel (free tier)
Version Control     : Git + GitHub
```

### Lý Do Chọn Stack Này
- React + Vite: hot reload nhanh, ecosystem lớn, solo dev quen thuộc
- JSON data: thêm/sửa thẻ sự kiện không cần đụng code
- Vercel: deploy 1 click, có link share ngay để test
- Không backend: MVP không cần lưu trữ, tránh phức tạp không cần thiết

---

## 3. CẤU TRÚC THƯ MỤC

```
minh-chu/
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── backgrounds/          # Ảnh nền theo triều đại
│       └── characters/           # Portrait nhân vật (AI-generated)
│
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Root component + routing
│   │
│   ├── components/
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx    # Màn hình chào + chọn chapter
│   │   │   ├── GameScreen.jsx    # Màn hình chơi chính
│   │   │   ├── GameOverScreen.jsx# Màn hình kết thúc + ending
│   │   │   └── SuKyScreen.jsx    # Thư viện sự kiện đã unlock
│   │   │
│   │   ├── game/
│   │   │   ├── CardDisplay.jsx   # Hiển thị thẻ sự kiện
│   │   │   ├── SwipeCard.jsx     # Container swipe trái/phải
│   │   │   ├── ChoiceButton.jsx  # Nút lựa chọn
│   │   │   ├── StatsBar.jsx      # 4 thanh chỉ số
│   │   │   ├── StatIcon.jsx      # Icon từng chỉ số
│   │   │   ├── YearDisplay.jsx   # Hiển thị năm trị vì
│   │   │   └── CharacterPortrait.jsx # Portrait nhân vật
│   │   │
│   │   ├── ui/
│   │   │   ├── FactPopup.jsx     # Popup fact sau khi chọn
│   │   │   ├── EndingCard.jsx    # Card ending cuối game
│   │   │   ├── SuKyCard.jsx      # Card trong thư viện Sử Ký
│   │   │   ├── ProgressBar.jsx   # Thanh chỉ số animation
│   │   │   └── Modal.jsx         # Generic modal wrapper
│   │   │
│   │   └── layout/
│   │       ├── Header.jsx        # Header với năm + chapter
│   │       └── PageTransition.jsx# Transition giữa màn hình
│   │
│   ├── context/
│   │   └── GameContext.jsx       # Global game state
│   │
│   ├── hooks/
│   │   ├── useGameState.js       # Logic game chính
│   │   ├── useSwipe.js           # Gesture swipe
│   │   ├── useStats.js           # Tính toán + validate chỉ số
│   │   └── useSuKy.js            # Quản lý thư viện Sử Ký
│   │
│   ├── data/
│   │   ├── chapters/
│   │   │   └── tran_dynasty/
│   │   │       ├── arc1_lap_quoc.json      # Arc 1: Lập Quốc (1225–1257)
│   │   │       ├── arc2_khang_nguyen.json  # Arc 2: Ba Lần Kháng Nguyên
│   │   │       └── arc3_thinh_roi_suy.json # Arc 3: Thịnh Rồi Suy
│   │   │
│   │   ├── characters.json       # Danh sách nhân vật lịch sử
│   │   ├── endings.json          # 5 endings của Chapter Nhà Trần
│   │   └── chapters.json         # Danh sách chapters (roadmap)
│   │
│   ├── engine/
│   │   ├── gameEngine.js         # Core logic: xử lý lượt chơi
│   │   ├── statsEngine.js        # Tính toán thay đổi chỉ số
│   │   ├── eventResolver.js      # Resolve sự kiện + chain events
│   │   └── endingChecker.js      # Kiểm tra điều kiện ending
│   │
│   ├── constants/
│   │   ├── gameConfig.js         # Cấu hình game (min/max chỉ số...)
│   │   └── theme.js              # Màu sắc, font theo triều đại
│   │
│   └── utils/
│       ├── dataLoader.js         # Load và validate JSON data
│       └── helpers.js            # Utility functions
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 4. DATA SCHEMA

### 4.1 Thẻ Sự Kiện (Event Card)

```json
{
  "id": "tran_arc1_005",
  "arc": 1,
  "year": 1237,
  "type": "historical",
  "title": "Thiếu Niên Trần Quốc Tuấn",
  "context": "Một thiếu niên họ Trần lập chiến công ở biên ải phía Bắc...",
  "character": "tran_hung_dao",
  "quote": "Thần nguyện xin được phụng sự bệ hạ",
  "choices": [
    {
      "id": "choice_a",
      "text": "Đưa vào triều đình đào tạo",
      "effects": {
        "binhLuc": 5,
        "danTam": 0,
        "quocKho": -5,
        "trieuCuong": 5
      },
      "isHistorical": true,
      "fact": "Trần Hưng Đạo được đào tạo bài bản tại triều đình, sau này trở thành vị tướng vĩ đại nhất lịch sử Việt Nam.",
      "chainNext": "tran_arc1_006",
      "unlockSuKy": "su_ky_tran_hung_dao_001"
    },
    {
      "id": "choice_b",
      "text": "Để ông tự phát triển ngoài biên ải",
      "effects": {
        "binhLuc": 3,
        "danTam": 5,
        "quocKho": 0,
        "trieuCuong": -3
      },
      "isHistorical": false,
      "fact": "Trong lịch sử, Trần Hưng Đạo được nuôi dưỡng và đào tạo kỹ lưỡng trong triều đình nhà Trần.",
      "chainNext": "tran_arc1_007",
      "unlockSuKy": null
    }
  ],
  "requiredCondition": null,
  "isCinematic": false,
  "background": "thang_long_palace"
}
```

### 4.2 Nhân Vật (Character)

```json
{
  "id": "tran_hung_dao",
  "name": "Trần Hưng Đạo",
  "fullName": "Trần Quốc Tuấn",
  "years": "1228–1300",
  "role": "Hưng Đạo Đại Vương, Tổng chỉ huy quân đội",
  "portrait": "/assets/characters/tran_hung_dao.png",
  "personality": "Trung nghĩa, mưu lược, đặt nước lên trên thù nhà",
  "arc": [1, 2],
  "bio": "Vị tướng vĩ đại nhất lịch sử Việt Nam, 3 lần đánh bại quân Nguyên Mông..."
}
```

### 4.3 Ending

```json
{
  "id": "ending_bach_dang",
  "title": "Đế Vương Lưu Danh",
  "rating": 5,
  "conditions": {
    "minYears": 50,
    "wonAllBattles": true,
    "minDanTam": 40
  },
  "description": "Nhà Trần kết thúc trong hào quang. Ba lần đánh bại Nguyên Mông, sử sách ngàn đời ghi danh...",
  "historicalNote": "Đây là kết cục lịch sử thật của nhà Trần thời cực thịnh.",
  "unlockSuKy": ["su_ky_bach_dang_001", "su_ky_hung_dao_tuong_linh"]
}
```

### 4.4 Sử Ký (History Entry)

```json
{
  "id": "su_ky_tran_hung_dao_001",
  "title": "Hưng Đạo Đại Vương",
  "category": "Nhân Vật",
  "shortFact": "Vị tướng duy nhất trong lịch sử đánh bại Nguyên Mông 3 lần",
  "detail": "Trần Quốc Tuấn (1228-1300), tước hiệu Hưng Đạo Đại Vương...",
  "source": "Đại Việt Sử Ký Toàn Thư",
  "relatedEvents": ["tran_arc2_018", "tran_arc2_024"]
}
```

---

## 5. GAME STATE SCHEMA

```javascript
// GameContext — Global State
{
  // Thông tin chapter
  chapter: "tran_dynasty",
  currentArc: 1,
  currentYear: 1225,
  yearsReigned: 0,

  // 4 chỉ số cốt lõi (0–100)
  stats: {
    binhLuc: 50,      // ⚔️ Binh Lực
    danTam: 50,        // 👥 Dân Tâm
    quocKho: 50,       // 💰 Quốc Khố
    trieuCuong: 50     // 📜 Triều Cương
  },

  // Sự kiện hiện tại
  currentEvent: null,
  eventHistory: [],    // ID các sự kiện đã xảy ra
  activeChains: [],    // Chuỗi sự kiện đang active

  // Điều kiện đặc biệt
  flags: {
    tranHungDaoUnlocked: false,
    wonBattle1257: false,
    wonBattle1285: false,
    wonBattle1288: false
  },

  // Sử Ký
  unlockedSuKy: [],

  // Game status
  gameStatus: "playing",  // "playing" | "gameover" | "ending"
  endingId: null,
  gameOverReason: null
}
```

---

## 6. CORE GAME ENGINE LOGIC

### 6.1 Vòng Lặp Game Chính

```javascript
// gameEngine.js
function processChoice(state, choiceId) {
  const choice = getCurrentChoice(state, choiceId)

  // 1. Áp dụng effects lên stats
  const newStats = applyEffects(state.stats, choice.effects)

  // 2. Kiểm tra game over
  const gameOverCheck = checkGameOver(newStats)
  if (gameOverCheck.isOver) {
    return { ...state, gameStatus: "gameover", gameOverReason: gameOverCheck.reason }
  }

  // 3. Cập nhật năm trị vì
  const newYear = state.currentYear + getYearAdvance(state.currentEvent)

  // 4. Unlock Sử Ký nếu có
  const newSuKy = choice.unlockSuKy
    ? [...state.unlockedSuKy, choice.unlockSuKy]
    : state.unlockedSuKy

  // 5. Cập nhật flags
  const newFlags = updateFlags(state.flags, state.currentEvent, choiceId)

  // 6. Kiểm tra ending
  const endingCheck = checkEnding({ ...state, stats: newStats, flags: newFlags })
  if (endingCheck.hasEnding) {
    return { ...state, gameStatus: "ending", endingId: endingCheck.endingId }
  }

  // 7. Load sự kiện tiếp theo
  const nextEvent = resolveNextEvent(state, choice)

  return {
    ...state,
    stats: newStats,
    currentYear: newYear,
    yearsReigned: state.yearsReigned + getYearAdvance(state.currentEvent),
    currentEvent: nextEvent,
    unlockedSuKy: newSuKy,
    flags: newFlags,
    eventHistory: [...state.eventHistory, state.currentEvent.id]
  }
}
```

### 6.2 Điều Kiện Game Over

```javascript
// statsEngine.js
const DANGER_THRESHOLDS = {
  min: 15,  // Dưới 15 → nguy hiểm
  max: 85   // Trên 85 → nguy hiểm
}

const GAME_OVER_REASONS = {
  binhLuc_min: "Quân giặc tràn vào Thăng Long, triều đình sụp đổ...",
  danTam_min: "Trăm họ nổi dậy, vua phải bỏ ngai vàng chạy trốn...",
  quocKho_min: "Ngân khố cạn kiệt, quân lính bỏ trốn, triều đình tan rã...",
  trieuCuong_min: "Quyền thần soán ngôi, dòng họ nhà vua bị diệt...",
  binhLuc_max: "Tướng lĩnh lộng quyền, đảo chính lật đổ triều đình...",
  trieuCuong_max: "Vua độc đoán, triều thần phản loạn tập thể..."
}
```

### 6.3 Resolve Sự Kiện Tiếp Theo

```javascript
// eventResolver.js
function resolveNextEvent(state, choice) {
  // Ưu tiên 1: Chain event từ lựa chọn
  if (choice.chainNext) {
    return loadEvent(choice.chainNext)
  }

  // Ưu tiên 2: Sự kiện bắt buộc theo năm (milestone)
  const milestone = checkMilestone(state.currentYear)
  if (milestone) return loadEvent(milestone)

  // Ưu tiên 3: Sự kiện ngẫu nhiên phù hợp arc hiện tại
  return loadRandomEvent(state.currentArc, state.eventHistory, state.flags)
}
```

---

## 7. UI/UX GUIDELINES

### 7.1 Màu Sắc Theo Triều Đại

```javascript
// theme.js
const THEMES = {
  tran_dynasty: {
    primary: "#8B1A1A",      // Đỏ trầm — màu của nhà Trần
    secondary: "#D4A017",    // Vàng đế vương
    background: "#1A0F0A",   // Nền tối cổ kính
    cardBg: "#2D1F1A",       // Nền thẻ bài
    text: "#F5E6D0",         // Chữ kem nhạt
    danger: "#FF4444",       // Chỉ số nguy hiểm
    safe: "#4CAF50"          // Chỉ số an toàn
  }
}
```

### 7.2 4 Chỉ Số — Icon + Màu

```
⚔️ Binh Lực    → Màu đỏ thẫm  #C0392B
👥 Dân Tâm     → Màu xanh lá  #27AE60
💰 Quốc Khố   → Màu vàng     #F39C12
📜 Triều Cương → Màu tím      #8E44AD
```

### 7.3 Màn Hình Chính — Layout

```
┌─────────────────────────────┐
│  ⚔️ ████░░  👥 ██████░  │  ← Stats Row 1
│  💰 ███░░░  📜 ████░░  │  ← Stats Row 2
├─────────────────────────────┤
│                             │
│      [Portrait nhân vật]    │  ← Character Portrait
│                             │
│  "Năm 1257 — Hưng Đạo Vương│
│   quỳ tâu trước mặt vua..." │  ← Event Text
│                             │
│  ┌─────────┐ ┌───────────┐  │
│  │ Rút lui │ │ Tử chiến  │  │  ← Choice Buttons
│  └─────────┘ └───────────┘  │
│                             │
│         Năm 1257            │  ← Year Display
└─────────────────────────────┘
```

### 7.4 Animation Priorities

```
1. Card entrance animation (quan trọng nhất — ấn tượng đầu tiên)
2. Stats bar change animation (feedback tức thì sau lựa chọn)
3. Fact popup slide-in (reward cảm giác)
4. Screen transitions (liền mạch giữa các màn hình)
5. Game over animation (dramatic, đáng nhớ)
```

---

## 8. ROADMAP TRIỂN KHAI

### Giai Đoạn 0 — Setup (3–5 ngày)
```
□ npm create vite@latest minh-chu -- --template react
□ Cài Tailwind CSS + Framer Motion
□ Setup cấu trúc thư mục như trên
□ Deploy Vercel lần đầu (Hello World)
□ Viết 10 thẻ sự kiện JSON đầu tiên
```

### Giai Đoạn 1 — Skeleton (1–2 tuần)
```
□ HomeScreen cơ bản
□ GameScreen với CardDisplay + ChoiceButton
□ StatsBar thay đổi theo lựa chọn
□ GameOver khi chỉ số về 0
□ Load data từ JSON
□ Deploy + test trên mobile browser
```

### Giai Đoạn 2 — Content (2–3 tuần)
```
□ Viết đủ 45–50 thẻ sự kiện Chapter Nhà Trần
□ FactPopup sau mỗi lựa chọn
□ Chain events hoạt động
□ 3–5 endings khác nhau
□ SuKy screen cơ bản
```

### Giai Đoạn 3 — Polish (1–2 tuần)
```
□ Swipe gesture (Framer Motion)
□ Animation đầy đủ
□ Font + màu sắc cổ phong
□ Responsive hoàn chỉnh
□ Error handling
```

### Giai Đoạn 4 — Validate (1 tuần)
```
□ Share cho 10–20 người test
□ Thu thập feedback
□ Quyết định hướng tiếp theo
```

---

## 9. PROMPT GUIDELINES CHO CLAUDE SONNET

### Khi yêu cầu tạo component:

```
"Tạo component [TênComponent] cho game Minh Chủ.
Game là Reigns-style, lịch sử Việt Nam, cổ phong.
Theme: nền tối #1A0F0A, text kem #F5E6D0, accent đỏ #8B1A1A, vàng #D4A017.
Stack: React + Tailwind + Framer Motion.
[Mô tả chi tiết component cần làm]"
```

### Khi yêu cầu viết content thẻ sự kiện:

```
"Viết [N] thẻ sự kiện JSON cho game Minh Chủ, Chapter Nhà Trần, Arc [số].
Bối cảnh: [mô tả arc].
Yêu cầu: đúng lịch sử, có fact popup, có effect lên 4 chỉ số (binhLuc/danTam/quocKho/trieuCuong).
Schema: [paste schema từ mục 4.1]"
```

### Khi yêu cầu fix logic:

```
"Đây là gameEngine.js của game Minh Chủ (Reigns-style lịch sử VN).
Game state schema: [paste từ mục 5].
Vấn đề: [mô tả bug].
Fix giúp mình."
```

---

## 10. INSTALL & RUN

```bash
# Clone project
git clone https://github.com/username/minh-chu.git
cd minh-chu

# Install dependencies
npm install

# Run dev server
npm run dev

# Build production
npm run build

# Deploy Vercel
npx vercel --prod
```

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^10.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "vite": "^5.0.0"
  }
}
```

---

*Tài liệu này là nguồn sự thật duy nhất (single source of truth) cho dự án Minh Chủ MVP.*
*Cập nhật tài liệu này mỗi khi có thay đổi lớn về kiến trúc.*
