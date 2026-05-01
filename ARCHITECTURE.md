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
- Chapter đầu tiên: Kỷ Trần - Hồ - Lê Sơ (1225–1428)
- ~70–80 thẻ sự kiện
- 7 endings khác nhau
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
│   │   │   ├── PoetryScreen.jsx  # Mini-game điền khuyết Hùng Văn
│   │   │   ├── EspionageScreen.jsx# Mini-game Hỏi cung
│   │   │   ├── ArenaScreen.jsx   # Lôi Đài Lịch Sử (Quiz Mode)
│   │   │   ├── DuelScreen.jsx    # Tỉ Thí Bóng Ma (PvP Ghost Mode)
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
│   │   │   ├── CampaignMap.jsx   # Bản Đồ Chiến Sự tương tác
│   │   │   ├── FactionPanel.jsx  # Mạng lưới Gia Phả và Phe Phái
│   │   │   └── Modal.jsx         # Generic modal wrapper
│   │   │
│   │   └── layout/
│   │       ├── Header.jsx        # Header với năm + chapter
│   │       └── PageTransition.jsx# Transition giữa màn hình
│   │
│   ├── context/
│   │   └── GameContext.jsx       # Global game state

---

## 4. UI ARCHITECTURE: LAYOUT "TAM TÀI" (Thiên - Địa - Nhân)

Màn hình chơi chính (`GameScreen.jsx`) được thiết kế theo tỷ lệ màn hình dọc (mobile-first), chia làm 3 phần rõ rệt:

1. **Phần Thiên (Header & Stats - 15%)**
   - Nổi (Floating) trên cùng bằng hiệu ứng Glassmorphism.
   - Gồm thông tin triều đại và 4 thanh chỉ số cốt lõi.

2. **Phần Nhân (Main Event Card - 55%)**
   - Thẻ sự kiện Borderless (không viền).
   - Ảnh chân dung chiếm 100% diện tích, overlay văn bản ở đáy thẻ bằng Gradient đen.

3. **Phần Địa (Choice Cards - 30%)**
   - Nơi người chơi ra quyết định qua 2 thẻ (Nhu - Cương).
   - Thiết kế thẩm mỹ Mộc Bản/Sắc Phong với hiệu ứng Dấu Ấn Hoàng Gia khi Click/Tap.

│   ├── hooks/
│   │   ├── useGameState.js       # Logic game chính
│   │   ├── useSwipe.js           # Gesture swipe
│   │   ├── useStats.js           # Tính toán + validate chỉ số
│   │   └── useSuKy.js            # Quản lý thư viện Sử Ký
│   │
│   ├── data/
│   │   ├── chapters/
│   │   │   ├── tran_dynasty/             # Chapter 1: Hào Khí Đông A
│   │   │   │   ├── arc1_lap_quoc.json      # Arc 1: Lập Quốc (1225–1257)
│   │   │   │   ├── arc2_khang_nguyen.json  # Arc 2: Ba Lần Kháng Nguyên
│   │   │   │   ├── arc3_thinh_roi_suy.json # Arc 3: Thịnh Rồi Suy
│   │   │   │   ├── arc4_nha_ho.json        # Arc 4: Nhà Hồ & Thuộc Minh (1400–1418)
│   │   │   │   ├── arc5_lam_son.json       # Arc 5: Khởi Nghĩa Lam Sơn (1418–1428)
│   │   │   │   └── arc6_le_so.json         # Arc 6: Thời Kỳ Lê Sơ (1428-1527)
│   │   │   └── dai_viet_tram_luan/       # Chapter 2: Phân Tranh & Thống Nhất
│   │   │       └── arc7_man_suong_phan_nghich.json # Arc 7: Nam-Bắc Triều (1527-1592)
│   │   │
│   │   ├── characters.json       # Danh sách nhân vật lịch sử
│   │   ├── endings.json          # 7 endings của Chapter Nhà Trần - Hồ - Lê
│   │   ├── chapters.json         # Danh sách chapters (roadmap)
│   │   ├── sysEvents.json        # Các sự kiện hệ thống (Khủng hoảng, Thương nhân)
│   │   ├── mythicEvents.json     # Các sự kiện thần thoại (Rùa Vàng, Rồng Thiêng)
│   │   └── cultureEvents.json    # Sự kiện văn hóa, đời sống dân gian (Side Quests)
│   │
│   ├── engine/
│   │   ├── gameEngine.js         # Core logic: xử lý lượt chơi, Combat, Items
│   │   ├── statsEngine.js        # Tính toán thay đổi chỉ số
│   │   ├── eventResolver.js      # Resolve sự kiện + chain events
│   │   └── endingChecker.js      # Kiểm tra điều kiện ending
│   │
│   ├── constants/
│   │   ├── gameConfig.js         # Cấu hình game (min/max chỉ số...)
│   │   ├── mapConfig.js          # Cấu hình Bản Đồ Chiến Sự
│   │   ├── factionConfig.js      # Cấu hình Mạng Lưới Nhân Vật
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
      "unlockSuKy": null,
      "modernLocation": "Khu di tích Kiếp Bạc, Hải Dương",  // Mở rộng cho thẻ văn hóa
      "specialty": "Vải thiều, Gốm Chu Đậu",               // Mở rộng cho thẻ văn hóa
      "referenceLink": "https://vi.wikipedia.org/wiki..."  // Mở rộng cho thẻ văn hóa
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
  
  // Chỉ số mở rộng
  historicalScore: 100, // Thanh Chính Sử (100% -> 0%)

  // Inventory & Nhiệm Vụ
  inventory: [],       // Mảng ID vật phẩm
  activeQuest: null,   // Nhiệm vụ đang active

  // Danh Tướng Đồng Hành
  unlockedCompanions: [], // Mảng ID tướng
  selectedCompanion: null,
  combatState: null,

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

  // Arena / PvP Ghost Mode
  arenaScore: 0,
  arenaLives: 3,
  arenaCombo: 0,
  duelTarget: null,
  duelGhost: null,

  // Game status
  gameStatus: "playing",  // "playing" | "gameover" | "ending" | "arena" | "duel"
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

  // 1. Áp dụng effects lên stats & historicalScore
  const newStats = applyEffects(state.stats, choice.effects)
  const newHistoricalScore = updateHistoricalScore(state.historicalScore, choice.isHistorical)

  // 2. Cảnh báo Lịch Sử (Không Permadeath)
  if (newHistoricalScore <= 0) {
    // Kích hoạt Quest Toast cảnh báo "Dòng thời gian hỗn loạn" nhưng vẫn cho chơi tiếp
  }

  // 3. Kiểm tra game over & Cứu nguy (Targeted Rescue)
  const gameOverCheck = checkGameOver(newStats)
  if (gameOverCheck.isOver) {
    return handleRescueOrGameOver(state, gameOverCheck, nextEvent, choice)
    // Hệ thống sẽ kiểm tra xem người chơi có Item hay Ads Cứu Nguy hay không.
    // Nếu có, chỉ phục hồi DUY NHẤT chỉ số gây ra Game Over, các chỉ số khác giữ nguyên.
  }

  // 4. Xử lý Nhiệm Vụ (Quests)
  const { newQuest, questToast, newInventory } = processQuest(state)

  // 4. Giải quyết Combat / Trivia
  // Nếu gặp thẻ battle -> chuyển sang màn hình chọn Companion -> Combat
  // Nếu đủ 15 năm -> kích hoạt Khoa Cử (Trivia)
  
  // 5. Cập nhật năm trị vì, Flags, Sử Ký
  
  // 6. Load sự kiện tiếp theo
  const nextEvent = resolveNextEvent(state, choice)

  return {
    ...state,
    stats: newStats,
    historicalScore: newHistoricalScore,
    currentEvent: nextEvent,
    // ...
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

### 6.3 Resolve Sự Kiện Tiếp Theo & Cơ Chế Nội Suy (Side Quest Interruption)

```javascript
// eventResolver.js
function resolveNextEvent(state, choice) {
  // BƯỚC 1: Tính toán trước thẻ Cốt truyện chính đáng lẽ sẽ xuất hiện (normalNextEvent)
  let normalNextEvent = null;
  if (choice.chainNext) normalNextEvent = loadEvent(choice.chainNext);
  else ... // fallback sang thẻ tiếp theo trong arc

  // BƯỚC 2: Kiểm tra tỷ lệ xuất hiện sự kiện phụ (Chỉ khi thẻ hiện tại không phải là sự kiện phụ)
  const isCurrentlySideQuest = ["sys_", "mythic_", "culture_"].some(prefix => state.currentEvent?.id?.startsWith(prefix));

  if (!isCurrentlySideQuest) {
    let sideQuestEvent = null;
    // Roll xúc xắc: 5% Thần Thoại, 10% Thương Nhân, 30% Văn Hóa...
    
    // BƯỚC 3: Tiêm (Inject) chuỗi gốc vào sự kiện phụ
    if (sideQuestEvent) {
      return {
        ...sideQuestEvent,
        choices: sideQuestEvent.choices.map(c => ({
          ...c,
          chainNext: normalNextEvent?.id // Gắn ngầm điểm rơi để khi chơi xong sẽ quay lại mạch chính
        }))
      }
    }
  }

  // Nếu không có sự kiện phụ nào xuất hiện, tiếp tục cốt truyện bình thường
  return normalNextEvent;
}
```
*Lưu ý: Cơ chế tiêm `chainNext` này cũng được áp dụng tương tự cho các thẻ Khủng hoảng (Crisis) ở bên trong `gameEngine.js` để đảm bảo game không bị mất dấu mạch truyện chính sau khi khủng hoảng kết thúc.*

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

### 7.4 Hệ Thống Độ Hiếm (Rarity System) & Thẻ Bài (TCG Style)

- **Giao diện Thẻ Bài**: Thẻ được thiết kế theo tỷ lệ 4:3 cho phần hình ảnh (Artwork), có thể lật (Flip 3D) để xem tiểu sử nhân vật ở mặt sau. Khi chưa có ảnh thật, sẽ dùng pattern họa tiết cổ phong làm nền.
- **Biến thể Rarity**: Khi load một sự kiện, có tỷ lệ nhất định để biến thẻ thường thành thẻ hiếm:
  - `legendary` (2%): Viền vàng, nhân đôi (x2) hiệu ứng buff, xóa bỏ hiệu ứng phạt.
  - `epic` (6%): Nhân 1.5 hiệu ứng buff, giảm một nửa hiệu ứng phạt.
  - `rare` (12%): Nhân 1.2 hiệu ứng buff.
- **Sự kiện Thần Thoại (Mythic Events)**: Có xác suất 5% xuất hiện thẻ ẩn (vd: Gặp cụ Rùa Vàng, Rồng thiêng bay xuống...) cung cấp vật phẩm đặc biệt hoặc thay đổi cục diện mạnh.

### 7.5 Animation Priorities

```
1. Card entrance animation (quan trọng nhất — ấn tượng đầu tiên)
2. Card 3D Flip (nhấn lật xem thông tin)
3. Foil Shimmer overlay (hiệu ứng lấp lánh cho thẻ hiếm)
4. Stats bar change animation (feedback tức thì sau lựa chọn)
5. Screen transitions (liền mạch giữa các màn hình)

**Cảnh Báo Kỹ Thuật (Framer Motion Gotchas):**
Tuyệt đối KHÔNG dùng `AnimatePresence` trực tiếp lên các custom component không có `forwardRef` (vd: `GameRouter` hay `GameScreen`). Lỗi này sẽ làm UI bị kẹt vĩnh viễn ở `opacity: 0` hoặc render 2 màn hình chồng lên nhau do không unmount được. Để chuyển trang mượt mà, luôn bọc chúng bằng `<motion.div>` native có prop `exit`. Với các tính năng mở phụ (Sử Ký, Bản Đồ, Gia Phả), ưu tiên dùng kỹ thuật Overlay (`fixed inset-0 z-[100]`) đè lên màn chơi để giữ nguyên state phía dưới thay vì đổi routing.
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
□ 7 endings khác nhau
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


---

# 📜 Dòng Chảy Lịch Sử: Kỷ Trần - Hồ - Lê Sơ (1225 - 1428)

Tài liệu này tổng hợp toàn bộ bức tranh toàn cảnh về dòng chảy cốt truyện của game hiện tại, hỗ trợ cho việc thiết kế thêm nội dung hoặc mở rộng sang các thời kỳ khác sau này.

Tổng cộng chúng ta đã có **5 Arc** liên hoàn, tái hiện 203 năm biến động cực kỳ kịch tính của lịch sử dân tộc với **70 thẻ sự kiện chính** được thiết kế chi tiết.

---

## 🟢 Arc 1: Lập Quốc (1225–1257)
**Trọng tâm:** Cuộc chuyển giao quyền lực khốc liệt từ nhà Lý sang nhà Trần và bước đầu đối phó với họa ngoại xâm.
*   **Tổng số sự kiện:** 16 sự kiện.
*   **Chiến dịch / Trận đánh lớn:** 2 trận.
*   **Các mốc tiêu điểm:**
    *   **1225:** Ngai Vàng Chuyển Tay (Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh, sự dàn xếp máu lạnh của Trần Thủ Độ).
    *   **1237:** Thiếu Niên Trần Quốc Tuấn (Hé lộ tài năng quân sự xuất chúng).
    *   **1257:** Trận Đông Bộ Đầu — Kháng Nguyên Lần Thứ Nhất (Cuộc thử lửa đầu tiên bảo vệ nền độc lập).

## 🟡 Arc 2: Ba Lần Kháng Nguyên (1257–1288)
**Trọng tâm:** Kỷ nguyên vàng son hào hùng nhất của nhà Trần, đối đầu trực diện với Đế chế Mông Nguyên thống trị lục địa Á-Âu.
*   **Tổng số sự kiện:** 22 sự kiện *(Arc đồ sộ nhất hiện tại)*.
*   **Chiến dịch / Trận đánh lớn:** 4 trận.
*   **Các mốc tiêu điểm:**
    *   **1260:** Hịch Tướng Sĩ (Trần Quốc Tuấn khơi dậy tinh thần yêu nước).
    *   **1282:** Chữ Nôm (Nguyễn Thuyên làm Văn tế cá sấu, nâng tầm văn hóa dân tộc).
    *   **1284:** Hội Nghị Diên Hồng ("Sát Thát" - triều đình và bô lão đồng lòng quyết không hàng).
    *   **1288:** Bạch Đằng: Đại Thắng Lịch Sử (Chôn vùi hoàn toàn dã tâm của giặc ngoại xâm).

## 🟠 Arc 3: Thịnh Rồi Suy (1288–1400)
**Trọng tâm:** Sự xuống dốc về đạo đức trị quốc và những nỗ lực bấu víu quyền lực cuối cùng của nhà Trần.
*   **Tổng số sự kiện:** 12 sự kiện.
*   **Chiến dịch / Trận đánh lớn:** 0 (Chủ yếu là biến cố triều chính và khủng hoảng nội bộ).
*   **Các mốc tiêu điểm:**
    *   **1293:** Trần Nhân Tông Xuất Gia (Sự ra đời của Thiền phái Trúc Lâm).
    *   **1325:** Lung Linh Nghi (Đặng Lộ phát minh dụng cụ thiên văn chính xác).
    *   **1350:** Nam Dược Thần Hiệu (Tuệ Tĩnh đặt nền móng y học cổ truyền dân tộc).
    *   **1396:** Tiền Giấy Thông Bảo Hội Sao (Hồ Quý Ly phát hành tiền giấy đầu tiên).
    *   **1400:** Màn Hạ — Nhà Trần Kết Thúc (Sự trỗi dậy của Hồ Quý Ly).
> *Kết thúc Arc 3, nếu người chơi không bị game over sớm, lịch sử sẽ sang trang với triều đại mới.*

## 🔴 Arc 4: Nhà Hồ & Thuộc Minh (1400–1418)
**Trọng tâm:** Những cải cách cấp tiến nhưng mất lòng dân của Nhà Hồ, dẫn đến bi kịch mất nước và đêm đen Bắc thuộc lần thứ 4.
*   **Tổng số sự kiện:** 9 sự kiện.
*   **Chiến dịch / Trận đánh lớn:** 1 trận.
*   **Các mốc tiêu điểm:**
    *   **1400:** Triều Đại Mới, Nền Móng Cũ (Hồ Quý Ly lập ra Đại Ngu).
    *   **1405:** Súng Thần Cơ & Cổ Lâu Thuyền (Phát minh quân sự vĩ đại của Hồ Nguyên Trừng).
    *   **1406:** Bóng Ma Từ Phương Bắc (Giặc Minh mượn cớ xâm lăng, đàn áp khốc liệt làm dân số sụt giảm thê thảm từ 3.120.000 xuống còn hơn 162.000 hộ).
    *   **1416:** Hội Thề Lũng Nhai (Lê Lợi và 18 hào kiệt kết nghĩa anh em).

## 🔵 Arc 5: Khởi Nghĩa Lam Sơn (1418–1428)
**Trọng tâm:** 10 năm nếm mật nằm gai đánh đuổi quân Minh, kết thúc bi kịch và mở ra bình minh cho triều Hậu Lê.
*   **Tổng số sự kiện:** 11 sự kiện.
*   **Chiến dịch / Trận đánh lớn:** 2 trận.
*   **Các mốc tiêu điểm:**
    *   **1418:** Bình Định Vương Dựng Cờ (Khởi nghĩa Lam Sơn bùng nổ, đối mặt với đói khát, 3 lần lui quân lên núi Chí Linh, Lê Lai liều mình cứu chúa).
    *   **1424:** Nguyễn Chích Và Nước Cờ Quyết Định (Chuyển hướng tiến vào Nghệ An tạo bàn đạp giải phóng).
    *   **1428:** Bình Ngô Đại Cáo (Khúc khải hoàn vĩ đại, tuyên cáo độc lập).

## 🟣 Arc 6: Đỉnh Cao Đại Việt (Dự kiến: Nhà Lê Sơ 1428–1527)
**Trọng tâm:** Chuyển dịch từ chiến tranh sinh tồn sang cân bằng quyền lực, phát triển văn hóa, nghệ thuật, luật pháp và khoa học. Điểm nhấn là thời kỳ Hồng Đức thịnh trị.
*   **Các mốc tiêu điểm dự kiến:**
    *   **Nghề In Mộc Bản (Lương Như Hộc)**
    *   **Đại Thành Toán Pháp (Lương Thế Vinh)**
    *   **Bản Đồ Hồng Đức & Quốc Triều Hình Luật**
    *   **Biến Cố Lệ Chi Viên (1442)**
    *   **Mạc Đăng Dung Cướp Ngôi (1527)**

---

## 🛠 Hướng Dẫn Tích Hợp Nội Dung Mới Trong Tương Lai
Khi cần mở rộng Chapter tiếp theo (Ví dụ: Nhà Lê Sơ - Thời Hồng Đức hoặc Nhà Lý), vui lòng tuân thủ cấu trúc sau:
1. Đảm bảo khai báo file dữ liệu trong `src/data/chapters.json`.
2. Tạo file JSON riêng biệt cho mỗi Arc nằm trong `src/data/chapters/<tên_triều_đại>/`.
3. Bổ sung nhân vật mới vào `characters.json`.
4. Cập nhật các câu hỏi phụ vào `trivia.js`.

---

## 🐞 Công Cụ Debug (Ending & Phục Sinh)

Game đã tích hợp sẵn hệ thống **Debug Panel** tại màn hình kết thúc (`EndingCard`) để hỗ trợ quá trình phát triển và kiểm thử nội dung:

- **Phân Biệt Nguồn Kích Hoạt (Trigger Source)**: Bảng Debug Panel (màu đỏ) sẽ hiển thị chi tiết Ending này được kích hoạt do người chơi đã vượt qua toàn bộ sự kiện của một Chapter (Normal Arc Ending), hay là do họ bị Game Over (tụt chỉ số về 0) nhưng thỏa mãn các điều kiện để nhận Good Ending thay vì màn hình Game Over thông thường.
- **Tính Năng Phục Sinh (Resurrect)**: Nếu Ending được kích hoạt bởi Game Over (VD: người chơi đang test Arc 3 nhưng lỡ tay làm chỉ số Binh Lực tụt về 0 và dính Good Ending), nút "Phục Sinh & Đi Tiếp" sẽ xuất hiện thay vì ẩn đi. Bấm vào nút này sẽ lập tức buff chỉ số vừa chết lên mức an toàn (30) và đưa người chơi quay lại đúng sự kiện tiếp theo để test tiếp, không cần phải chơi lại từ đầu. *(Lưu ý: Bảng Debug và nút Phục Sinh sẽ tự động bị ẩn đi ở môi trường Production - khi người chơi thực sự trải nghiệm game).*

---

## 💾 Hệ Thống Lưu Trữ (Persistence) & Checkpoint

Game được thiết kế cho chiến dịch lịch sử dài kỳ, do đó tích hợp hệ thống lưu trữ qua `src/services/storageService.js`.

- **Tự Động Lưu (Auto-save):** Trạng thái Game (`currentGameState`) được tự động lưu xuống `localStorage` sau mỗi sự kiện hoặc thao tác. Việc này cho phép người chơi đóng trình duyệt và mở lại chơi tiếp bình thường.
- **Phân Tách Dữ Liệu (Scoping):** Tên file save dưới local sẽ được gán kèm UserID (VD: `minh_chu_save_guest`). Việc này dọn sẵn đường cho Firebase Auth để không bị conflict dữ liệu khi nhiều người dùng xài chung 1 thiết bị.
- **Chơi Lại Chương Này (Checkpoint):** Mỗi khi bắt đầu một Arc mới (`START_ARC`), hệ thống sẽ chụp lại một `checkpoint` snapshot. Khi người chơi bị Game Over, họ sẽ có tùy chọn "Làm Lại Chương Này" (hồi sinh toàn bộ chỉ số về 50, quay về đầu Arc hiện tại) để giảm bớt cảm giác chán nản so với việc bắt buộc phải "Chơi Lại Từ Đầu" (Reset hoàn toàn về năm 1225).
- **Loại Bỏ Good Ending Trá Hình:** Khi người chơi chết (Game Over do cạn kiệt/bùng nổ chỉ số), hệ thống sẽ KHÔNG trao các Ending từ 3 sao trở lên để tránh nhầm lẫn. Người chơi sẽ thấy đúng màn hình sụp đổ, biết được nguyên do và tự chọn Làm lại chương hoặc Chơi lại từ đầu.
5. Tạo các Flag cần thiết và check kết cục tại `endingChecker.js`.
