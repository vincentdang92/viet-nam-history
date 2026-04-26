# Content Agent — Viết Thẻ Sự Kiện Lịch Sử

## Nhiệm Vụ

Tạo thẻ sự kiện JSON cho game Minh Chủ. Mỗi thẻ là một tình huống lịch sử người chơi phải đối mặt, với 2 lựa chọn ảnh hưởng lên 4 chỉ số.

## Context Game

- Tên game: Minh Chủ — Reigns-style, lịch sử Việt Nam
- MVP Chapter: Nhà Trần (1225–1400), 3 arc
- 4 chỉ số: `binhLuc` (⚔️), `danTam` (👥), `quocKho` (💰), `trieuCuong` (📜)
- Game over khi stat ≤ 15 hoặc binhLuc/trieuCuong ≥ 85

## Schema Thẻ Sự Kiện

```json
{
  "id": "tran_arc1_XXX",
  "arc": 1,
  "year": 1237,
  "type": "historical",
  "title": "Tên ngắn, ấn tượng",
  "context": "Mô tả bối cảnh 2-3 câu, viết cho người chơi đọc",
  "character": "tran_hung_dao",
  "quote": "Câu nói ngắn của nhân vật (tùy chọn)",
  "choices": [
    {
      "id": "choice_a",
      "text": "Hành động người chơi chọn (ngắn, rõ ràng)",
      "effects": {
        "binhLuc": 5,
        "danTam": 0,
        "quocKho": -5,
        "trieuCuong": 5
      },
      "isHistorical": true,
      "fact": "Sự thật lịch sử, 1-2 câu, có tên nhân vật/sự kiện thật",
      "chainNext": null,
      "unlockSuKy": null,
      "setFlag": null,
      "endArc": false
    },
    {
      "id": "choice_b",
      "text": "Lựa chọn thay thế (ngược chiều hoặc rủi ro hơn)",
      "effects": {
        "binhLuc": -5,
        "danTam": 10,
        "quocKho": 5,
        "trieuCuong": -3
      },
      "isHistorical": false,
      "fact": "Giải thích tại sao lựa chọn này khác lịch sử",
      "chainNext": null,
      "unlockSuKy": null,
      "setFlag": null,
      "endArc": false
    }
  ],
  "requiredCondition": null,
  "isCinematic": false,
  "background": "thang_long_palace"
}
```

## Nhân Vật Có Sẵn

| ID | Tên | Arc |
|----|-----|-----|
| `tran_thai_tong` | Trần Thái Tông | 1 |
| `tran_hung_dao` | Trần Hưng Đạo | 1, 2 |
| `tran_nhan_tong` | Trần Nhân Tông | 2, 3 |
| `tran_thu_do` | Trần Thủ Độ | 1 |
| `tran_quang_khai` | Trần Quang Khải | 2 |

## Background Có Sẵn

`thang_long_palace`, `thang_long_court`, `thang_long_market`, `countryside`, `training_ground`, `war_council`, `battle_field`, `river_dock`, `exam_hall`, `bach_dang_river`, `yen_tu_mountain`, `kiet_bac_palace`

## Nguyên Tắc Viết Content

### Effects phải balanced
- Mỗi lựa chọn nên ảnh hưởng 2-3 stats, không phải tất cả
- Tổng effects tuyệt đối không quá 30 mỗi lựa chọn
- Choice_a (lịch sử) không nhất thiết phải "tốt hơn" — mỗi cái có trade-off

### Fact popup
- `isHistorical: true` → "Lịch Sử Thật" — xác nhận/bổ sung sự thật
- `isHistorical: false` → "Điều Chỉnh Lịch Sử" — giải thích sai ở đâu
- Luôn có tên người/sự kiện/nguồn cụ thể

### Tính cân bằng game
- Chuỗi 5-6 thẻ liên tiếp nên giữ stats ổn định nếu chơi đúng
- Không có thẻ nào tốt cả 4 stats hoặc xấu cả 4 stats

## Ví Dụ Prompt Gọi Agent

```
Viết 5 thẻ sự kiện JSON cho Arc 2 (Kháng Nguyên 1285-1288).
Bối cảnh: quân Nguyên 500,000 người đã vào, ta đang phản công.
Nhân vật chính: Trần Hưng Đạo, Trần Quang Khải.
Cần: 1 trận chiến, 2 sự kiện lịch sử, 2 sự kiện nội trị.
IDs bắt đầu từ tran_arc2_010.
```

## Danh Sách Arc

### Arc 1: Lập Quốc (1225–1257)
- Thiết lập triều đình, cải cách
- Đối phó sứ giả Mông Cổ
- Chuẩn bị chiến tranh
- Kết thúc: Trận Đông Bộ Đầu 1258

### Arc 2: Kháng Nguyên (1257–1288)
- Tổ chức kháng chiến toàn dân
- Ba trận lớn: 1257, 1285, 1288
- Hội nghị Diên Hồng, Bình Than
- Kết thúc: Trận Bạch Đằng đại thắng

### Arc 3: Thịnh Rồi Suy (1288–1400)
- Tái thiết sau chiến tranh
- Phát triển văn hóa Phật giáo
- Suy thoái dần
- Hồ Quý Ly nổi lên, nhà Trần kết thúc
