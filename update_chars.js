const fs = require('fs');
const file = './src/data/characters.json';
let chars = JSON.parse(fs.readFileSync(file, 'utf8'));

const newChars = [
  {
    "id": "ho_nguyen_trung",
    "name": "Hồ Nguyên Trừng",
    "fullName": "Hồ Nguyên Trừng",
    "years": "1374–1446",
    "role": "Hoàng thái tử, Thượng tướng quân",
    "portrait": null,
    "personality": "Tài năng xuất chúng, am hiểu kỹ thuật và quân sự",
    "arc": [4],
    "bio": "Con cả của Hồ Quý Ly, nhường ngôi cho em là Hồ Hán Thương. Ông là nhà quân sự tài ba, người sáng chế ra súng Thần cơ và thuyền chiến Cổ lâu. Câu nói nổi tiếng: 'Thần không sợ đánh, chỉ sợ lòng dân không theo'."
  },
  {
    "id": "tran_thiem_binh",
    "name": "Trần Thiêm Bình",
    "fullName": "Trần Thiêm Bình",
    "years": "?–1406",
    "role": "Kẻ mạo xưng tôn thất nhà Trần",
    "portrait": null,
    "personality": "Tham vọng, cầu ngoại bang",
    "arc": [4],
    "bio": "Tự nhận là hoàng tử nhà Trần, chạy sang nhà Minh cầu viện, tạo cớ cho quân Minh xâm lược Đại Ngu. Bị quân nhà Hồ bắt và chém chết."
  },
  {
    "id": "truong_phu",
    "name": "Trương Phụ",
    "fullName": "Trương Phụ",
    "years": "1375–1449",
    "role": "Tổng binh quân Minh",
    "portrait": null,
    "personality": "Tàn bạo, kiêu ngạo, quyết đoán",
    "arc": [4, 5],
    "bio": "Tướng lĩnh nhà Minh chỉ huy cuộc xâm lược Đại Ngu, nổi tiếng với sự tàn bạo dã man như chôn sống, chặt đầu, đốt xác người Việt."
  },
  {
    "id": "tran_ngoi",
    "name": "Giản Định Đế",
    "fullName": "Trần Ngỗi",
    "years": "?–1410",
    "role": "Hoàng đế nhà Hậu Trần",
    "portrait": null,
    "personality": "Quyết tâm phục quốc nhưng thiếu kiên nhẫn và bị gièm pha",
    "arc": [4],
    "bio": "Con thứ của vua Trần Nghệ Tông. Ông dấy binh khởi nghĩa lập nên nhà Hậu Trần nhưng do tin lời gièm pha đã giết hại công thần, làm suy yếu lực lượng."
  },
  {
    "id": "vuong_thong",
    "name": "Vương Thông",
    "fullName": "Vương Thông",
    "years": "?–1452",
    "role": "Tổng binh quân Minh",
    "portrait": null,
    "personality": "Kiên nhẫn nhưng thực dụng",
    "arc": [5],
    "bio": "Chỉ huy cao nhất của quân Minh sau này. Bị vây hãm trong thành Đông Quan, cuối cùng phải xin nghị hòa với Lê Lợi và rút quân về nước."
  },
  {
    "id": "lieu_thang",
    "name": "Liễu Thăng",
    "fullName": "Liễu Thăng",
    "years": "?–1427",
    "role": "An Viễn hầu quân Minh",
    "portrait": null,
    "personality": "Kiêu ngạo, chủ quan, khinh địch",
    "arc": [5],
    "bio": "Dẫn 10 vạn viện binh sang cứu Vương Thông nhưng do khinh địch nên bị nghĩa quân Lam Sơn mai phục và chém chết tại ải Chi Lăng."
  },
  {
    "id": "moc_thanh",
    "name": "Mộc Thạnh",
    "fullName": "Mộc Thạnh",
    "years": "1368–1439",
    "role": "Kiềm quốc công quân Minh",
    "portrait": null,
    "personality": "Dạn dày kinh nghiệm, cẩn trọng",
    "arc": [4, 5],
    "bio": "Tướng lĩnh kỳ cựu nhà Minh. Khi nghe tin Liễu Thăng tử trận, Mộc Thạnh hoảng sợ cho rút quân ngay lập tức nhưng vẫn bị quân Lam Sơn truy kích tơi bời."
  },
  {
    "id": "nguyen_xi",
    "name": "Nguyễn Xí",
    "fullName": "Nguyễn Xí",
    "years": "1397–1465",
    "role": "Đại đô đốc nghĩa quân Lam Sơn",
    "portrait": null,
    "personality": "Dũng mãnh, mưu trí, trung thành",
    "arc": [5],
    "bio": "Công thần khai quốc nhà Hậu Lê. Nổi danh trong trận mai phục Tốt Động – Chúc Động đánh tan 5 vạn quân Minh. Từng làm tướng dạy bầy chó săn tấn công địch."
  },
  {
    "id": "tran_cao",
    "name": "Trần Cảo",
    "fullName": "Trần Cảo",
    "years": "?–1428",
    "role": "Hoàng đế bù nhìn",
    "portrait": null,
    "personality": "Thấp kém, làm bình phong chính trị",
    "arc": [5],
    "bio": "Được Lê Lợi lập làm vua trên danh nghĩa để đáp ứng yêu sách 'lập con cháu nhà Trần' của Vương Thông, tạo cớ cho quân Minh rút lui danh dự."
  }
];

newChars.forEach(nc => {
  if (!chars.find(c => c.id === nc.id)) {
    chars.push(nc);
  }
});

fs.writeFileSync(file, JSON.stringify(chars, null, 2));
