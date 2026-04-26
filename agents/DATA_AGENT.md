# Data Agent — Quản Lý Game Data

## Nhiệm Vụ

Thêm, sửa, validate dữ liệu JSON cho game Minh Chủ.
Bao gồm: thẻ sự kiện, nhân vật, endings, sử ký entries.

## File Locations

```
src/data/
  chapters.json                         # Danh sách chapter (roadmap)
  characters.json                       # Nhân vật lịch sử
  endings.json                          # 5 endings của Chapter Nhà Trần
  chapters/tran_dynasty/
    arc1_lap_quoc.json                  # Arc 1: 1225–1257
    arc2_khang_nguyen.json              # Arc 2: 1257–1288
    arc3_thinh_roi_suy.json             # Arc 3: 1288–1400
src/hooks/useSuKy.js                    # SU_KY_DATA object (inline data)
```

## Schemas

### Event Card (src/data/chapters/tran_dynasty/arc*.json)

```typescript
interface EventCard {
  id: string              // "tran_arc{N}_{XXX}" — unique
  arc: 1 | 2 | 3
  year: number            // 1225–1400
  type: 'historical' | 'event' | 'battle' | 'cinematic'
  title: string           // Tên ngắn, ấn tượng
  context: string         // Mô tả bối cảnh, 2-4 câu
  character: string       // ID từ characters.json
  quote?: string          // Câu nói ngắn của nhân vật
  choices: Choice[]       // Luôn đúng 2 lựa chọn
  requiredCondition: null | object
  isCinematic: boolean
  background: string
}

interface Choice {
  id: 'choice_a' | 'choice_b'
  text: string
  effects: {
    binhLuc: number     // -20 đến +20
    danTam: number
    quocKho: number
    trieuCuong: number
  }
  isHistorical: boolean
  fact: string
  chainNext: string | null    // ID event kế tiếp
  unlockSuKy: string | null   // ID sử ký entry
  setFlag?: object            // { wonBattle1257: true }
  endArc?: boolean            // true = chuyển sang arc tiếp theo
}
```

### Character (src/data/characters.json)

```typescript
interface Character {
  id: string
  name: string
  fullName: string
  years: string       // "1228–1300"
  role: string
  portrait: null      // Chưa có ảnh trong MVP
  personality: string
  arc: number[]       // [1, 2] = xuất hiện ở arc 1 và 2
  bio: string
}
```

### Ending (src/data/endings.json)

```typescript
interface Ending {
  id: string
  title: string
  subtitle: string
  rating: 1 | 2 | 3 | 4 | 5
  conditions: {
    minYears?: number
    wonBattle1257?: boolean
    wonBattle1285?: boolean
    wonBattle1288?: boolean
    minDanTam?: number
    minQuocKho?: number
    trieuCuong_min?: boolean
  }
  description: string
  historicalNote: string
  unlockSuKy: string[]
}
```

### Sử Ký Entry (src/hooks/useSuKy.js — SU_KY_DATA object)

```typescript
interface SuKyEntry {
  id: string
  title: string
  category: 'Nhân Vật' | 'Trận Chiến' | 'Sự Kiện' | 'Văn Học'
  shortFact: string   // 1 câu, hiển thị trên card
  detail: string      // Nội dung mở rộng khi expand
  source: string      // Nguồn tham khảo
}
```

## Validation Checklist

Trước khi thêm event card, kiểm tra:

- [ ] ID unique trong toàn bộ project
- [ ] `character` ID tồn tại trong `characters.json`
- [ ] `chainNext` ID tồn tại nếu có
- [ ] `unlockSuKy` ID tồn tại trong `SU_KY_DATA` nếu có
- [ ] Tổng absolute effects của mỗi choice ≤ 30
- [ ] Không có lựa chọn nào tất cả effects âm hoặc tất cả dương
- [ ] `year` nằm trong khoảng đúng của arc
- [ ] Mỗi `fact` có ít nhất 1 chi tiết lịch sử cụ thể

## Arc Event Count Target

| Arc | Hiện tại | Target |
|-----|----------|--------|
| 1 | 13 events | 15–18 |
| 2 | 6 events | 15–18 |
| 3 | 4 events | 10–15 |

## Thêm Sử Ký Entry

1. Thêm entry vào `SU_KY_DATA` object trong `src/hooks/useSuKy.js`
2. Đặt ID mới vào `unlockSuKy` của event choice tương ứng
3. Thêm ID vào `unlockSuKy` array của ending nếu cần

## Prompt Template

```
Thêm [N] event card mới vào Arc [số], file arc[N]_*.json.
Context: [mô tả giai đoạn lịch sử].
IDs bắt đầu từ: tran_arc[N]_[XXX].
Character: [ID nhân vật].
Cần unlock sử ký mới: [có/không].
```
