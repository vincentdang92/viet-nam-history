const fs = require('fs');
const file = './src/data/cultureEvents.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newEvents = {
  "culture_xam_minh": {
    "id": "culture_xam_minh",
    "type": "culture",
    "rarity": "common",
    "title": "Tục Xăm Mình",
    "context": "Thái thượng hoàng ra lệnh mọi vương hầu, quan lại và quân sĩ đều phải xăm hình rồng vào đùi để không quên gốc gác vùng sông nước của tổ tiên.",
    "character": "royal",
    "quote": "Gốc gác Đại Việt ta từ chài lưới mà lên, chớ quên đi cội nguồn!",
    "choices": [
      {
        "id": "choice_a",
        "text": "Tuân chỉ, hạ lệnh toàn quân xăm mình",
        "effects": {
          "binhLuc": 10,
          "danTam": 10
        },
        "isHistorical": true,
        "fact": "Thái bế (xăm mình) là một tục lệ rất phổ biến thời Trần. Binh lính thời Trần thường xăm chữ 'Sát Thát' (Giết giặc Thát Đát) lên cánh tay để thể hiện quyết tâm đánh giặc.",
        "modernLocation": "Lễ hội Minh Thề, Hải Phòng (vùng biển Bắc Bộ)",
        "specialty": "Hải sản, Bánh đa cua Hải Phòng",
        "referenceLink": "https://vi.wikipedia.org/wiki/X%C4%83m_m%C3%ACnh_(Vi%E1%BB%87t_Nam)"
      }
    ],
    "background": "river_night"
  },
  "culture_chu_nom": {
    "id": "culture_chu_nom",
    "type": "culture",
    "rarity": "rare",
    "title": "Bài Phú Đuổi Cá Sấu",
    "context": "Năm 1282, có cá sấu lớn xuất hiện ở sông Lô. Hình bộ Thượng thư Nguyễn Thuyên viết một bài phú ném xuống sông, cá sấu bèn bỏ đi.",
    "character": "scholar",
    "quote": "Sông núi nước Nam do thần linh phù hộ, yêu quái phương nào dám đến quấy nhiễu?",
    "choices": [
      {
        "id": "choice_a",
        "text": "Khen ngợi và ban danh hiệu 'Hàn Thuyên'",
        "effects": {
          "trieuCuong": 10,
          "danTam": 15
        },
        "isHistorical": true,
        "fact": "Vua Trần Nhân Tông khen ngợi Nguyễn Thuyên có tài như Hàn Dũ (người từng làm văn đuổi cá sấu), nên ban cho họ Hàn. Ông là một trong những người đầu tiên làm thơ bằng chữ Quốc ngữ (chữ Nôm).",
        "modernLocation": "Sông Lô, Phú Thọ",
        "specialty": "Cá Lăng sông Lô, Bánh chưng Đất Tổ",
        "referenceLink": "https://vi.wikipedia.org/wiki/H%C3%A0n_Thuy%C3%AAn"
      }
    ],
    "background": "river_day"
  },
  "culture_chuong_pho_minh": {
    "id": "culture_chuong_pho_minh",
    "type": "culture",
    "rarity": "epic",
    "title": "Đúc Chuông Phổ Minh",
    "context": "Các cao tăng và thợ thủ công muốn xin ngân khố để đúc quả chuông đồng khổng lồ (Quy vạc Phổ Minh) tại phủ Thiên Trường, đặt trước tháp Phổ Minh.",
    "character": "monk",
    "quote": "Chuông đồng vang vọng chín tầng mây, quốc thái dân an vạn đời...",
    "choices": [
      {
        "id": "choice_a",
        "text": "Mở kho bạc, hỗ trợ đúc chuông",
        "effects": {
          "quocKho": -15,
          "danTam": 20,
          "trieuCuong": 10
        },
        "isHistorical": true,
        "fact": "Vạc Phổ Minh (hay Chuông Phổ Minh) là một trong An Nam tứ đại khí (4 báu vật bằng đồng lớn nhất nước Nam thời Lý-Trần). Rất tiếc sau này đã bị quân Minh phá hủy để đúc súng đạn.",
        "modernLocation": "Chùa Phổ Minh, Tức Mặc, Nam Định",
        "specialty": "Phở bò Nam Định, Xôi xíu",
        "referenceLink": "https://vi.wikipedia.org/wiki/Ch%C3%B9a_Ph%E1%BB%95_Minh"
      },
      {
        "id": "choice_b",
        "text": "Từ chối, giữ đồng để đúc vũ khí",
        "effects": {
          "binhLuc": 15,
          "danTam": -10
        },
        "isHistorical": false,
        "fact": "Thời bình, triều Trần rất ủng hộ Phật giáo. Nhưng khi kháng chiến, vua Trần Nhân Tông từng tịch thu chuông đồng ở các chùa để đúc binh khí.",
        "modernLocation": "Khu di tích Đền Trần, Nam Định",
        "specialty": "Bánh xíu páo, Kẹo Sìu Châu",
        "referenceLink": "https://vi.wikipedia.org/wiki/An_Nam_t%E1%BB%A9_%C4%91%E1%BA%A1i_kh%C3%AD"
      }
    ],
    "background": "temple"
  },
  "culture_roi_nuoc": {
    "id": "culture_roi_nuoc",
    "type": "culture",
    "rarity": "common",
    "title": "Trò Múa Rối Nước",
    "context": "Nhân mùa nước nổi, dân làng vùng châu thổ sông Hồng mang những con rối gỗ ra ao đình diễn trò, tái hiện cảnh sinh hoạt chài lưới và rước kiệu vua.",
    "character": "peasant",
    "quote": "Rối cạn diễn trên cạn, rối nước quậy tung ao. Tiếng cười xua tan đi nhọc nhằn đồng áng!",
    "choices": [
      {
        "id": "choice_a",
        "text": "Dừng kiệu lại xem và ban thưởng",
        "effects": {
          "quocKho": -5,
          "danTam": 20
        },
        "isHistorical": true,
        "fact": "Múa rối nước là nghệ thuật dân gian độc đáo ra đời từ nền văn minh lúa nước sông Hồng, phát triển cực thịnh dưới thời Lý - Trần.",
        "modernLocation": "Làng rối nước Đào Thục, Đông Anh, Hà Nội",
        "specialty": "Đậu phụ làng Mơ, Chả rươi",
        "referenceLink": "https://vi.wikipedia.org/wiki/M%C3%BAa_r%E1%BB%91i_n%C6%B0%E1%BB%9Bc"
      }
    ],
    "background": "village_festival"
  },
  "culture_quoc_hoc_vien": {
    "id": "culture_quoc_hoc_vien",
    "type": "culture",
    "rarity": "epic",
    "title": "Mở Khoa Thái Học Sinh",
    "context": "Đất nước thái bình, vua Trần Thái Tông hạ chiếu mở khoa thi Thái học sinh để kén chọn nhân tài, đắp tượng Khổng Tử và Chu Công tại Quốc học viện.",
    "character": "scholar",
    "quote": "Kẻ sĩ mong ngày bảng vàng đề danh, đem tài trí phụng sự quốc gia.",
    "choices": [
      {
        "id": "choice_a",
        "text": "Tổ chức khoa thi, chọn Tam Khôi",
        "effects": {
          "trieuCuong": 20,
          "quocKho": -10,
          "danTam": 10
        },
        "isHistorical": true,
        "fact": "Năm 1247, nhà Trần mở khoa thi lấy Tam Khôi (Trạng Nguyên, Bảng Nhãn, Thám Hoa). Nhà sử học Lê Văn Hưu chính là Bảng nhãn của khoa thi này khi mới 18 tuổi.",
        "modernLocation": "Văn Miếu - Quốc Tử Giám, Hà Nội",
        "specialty": "Bánh cốm Hàng Than, Trà sen Tây Hồ",
        "referenceLink": "https://vi.wikipedia.org/wiki/Khoa_b%E1%BA%A3ng_Vi%E1%BB%87t_Nam"
      }
    ],
    "background": "thang_long_palace"
  }
};

Object.assign(data, newEvents);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Done adding new events');
