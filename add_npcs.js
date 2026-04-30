const fs = require('fs');
const file = './src/data/characters.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const npcs = [
  {
    "id": "peasant",
    "name": "Thường Dân",
    "fullName": "Nhân dân Đại Việt",
    "years": "Muôn đời",
    "role": "Người nông dân, thợ thủ công",
    "portrait": null,
    "personality": "Chăm chỉ, chất phác, yêu nước thương nòi",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Lực lượng nòng cốt của quốc gia, là người làm ra của cải vật chất và cũng là những người trực tiếp cầm vũ khí bảo vệ đất nước khi có giặc ngoại xâm."
  },
  {
    "id": "merchant",
    "name": "Thương Nhân",
    "fullName": "Thương nhân",
    "years": "Muôn đời",
    "role": "Thương lái, người buôn bán",
    "portrait": null,
    "personality": "Nhanh nhạy, tháo vát, biết nắm bắt cơ hội",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Những người rong ruổi khắp các ngả đường thủy bộ, mang hàng hóa và tin tức giao thương giữa các vùng miền, thậm chí ra nước ngoài."
  },
  {
    "id": "royal",
    "name": "Hoàng Tộc",
    "fullName": "Hoàng tộc triều đình",
    "years": "Muôn đời",
    "role": "Vương hầu, thân vương",
    "portrait": null,
    "personality": "Quyền uy, giàu có, đôi khi bảo thủ",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Những người thuộc dòng dõi hoàng gia, nắm giữ những vị trí quan trọng trong quân đội và triều đình, sở hữu nhiều thái ấp và điền trang."
  },
  {
    "id": "scholar",
    "name": "Nho Sinh",
    "fullName": "Kẻ sĩ Đại Việt",
    "years": "Muôn đời",
    "role": "Người trí thức, quan lại",
    "portrait": null,
    "personality": "Học rộng tài cao, coi trọng lễ nghĩa",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Tầng lớp trí thức được đào tạo qua thi cử, là rường cột của bộ máy quan liêu, luôn đề cao trung hiếu và đạo lý thánh hiền."
  },
  {
    "id": "monk",
    "name": "Thiền Sư",
    "fullName": "Bậc chân tu",
    "years": "Muôn đời",
    "role": "Nhà sư, người tu hành",
    "portrait": null,
    "personality": "Từ bi, trí tuệ, thoát tục",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Những bậc xuất gia tu đạo, có ảnh hưởng rất lớn đến đời sống tinh thần của cả triều đình và dân chúng, đặc biệt là dưới thời Lý - Trần."
  },
  {
    "id": "tien_ong",
    "name": "Tiên Ông",
    "fullName": "Tiên nhân",
    "years": "Vô Thủy Vô Chung",
    "role": "Bậc đắc đạo",
    "portrait": null,
    "personality": "Tiên phong đạo cốt, không màng thế sự",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Theo truyền thuyết dân gian, tiên ông thường xuất hiện để răn dạy người đời, thử lòng vua chúa hoặc báo trước điềm lành dữ."
  },
  {
    "id": "rong_thieng",
    "name": "Rồng Thiêng",
    "fullName": "Hoàng Long",
    "years": "Vô Thủy Vô Chung",
    "role": "Linh thú bảo hộ",
    "portrait": null,
    "personality": "Uy nghiêm, linh thiêng",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Biểu tượng của quyền lực hoàng gia và sức mạnh dân tộc, nguồn cội của người Việt (Con Rồng cháu Tiên), thường xuất hiện báo điềm lành."
  },
  {
    "id": "than_kim_quy",
    "name": "Cụ Rùa Vàng",
    "fullName": "Thần Kim Quy",
    "years": "Vô Thủy Vô Chung",
    "role": "Thần linh bảo hộ",
    "portrait": null,
    "personality": "Thông thái, thần bí",
    "arc": [1, 2, 3, 4, 5],
    "bio": "Vị thần linh thiêng gắn liền với sông nước Đại Việt, từng giúp An Dương Vương xây thành, trao gươm thần cho vua Lê Thái Tổ."
  }
];

const existingIds = new Set(data.map(c => c.id));
npcs.forEach(npc => {
  if (!existingIds.has(npc.id)) {
    data.push(npc);
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Added missing NPC archetypes.');
