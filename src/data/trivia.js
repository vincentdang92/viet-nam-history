export const TRIVIA_DATA = [
  {
    id: 'triv_1',
    question: 'Tác phẩm "Hịch tướng sĩ" do ai soạn thảo?',
    options: ['Trần Thủ Độ', 'Trần Hưng Đạo', 'Lê Lợi', 'Nguyễn Trãi'],
    correctIndex: 1,
    explanation: 'Trần Hưng Đạo viết Hịch tướng sĩ để khích lệ tinh thần quân sĩ nhà Trần trước họa ngoại xâm.'
  },
  {
    id: 'triv_2',
    question: 'Hội nghị Diên Hồng do vua Trần Thánh Tông triệu tập gồm những ai?',
    options: ['Các Vương hầu', 'Tướng lĩnh', 'Bô lão trong cả nước', 'Sứ thần ngoại quốc'],
    correctIndex: 2,
    explanation: 'Hội nghị Diên Hồng (1284) là hội nghị dân chủ đầu tiên, triệu tập các bô lão để hỏi ý kiến đánh hay hòa.'
  },
  {
    id: 'triv_3',
    question: 'Vị tướng nào bóp nát quả cam vì không được dự bàn việc nước?',
    options: ['Trần Quốc Toản', 'Trần Bình Trọng', 'Phạm Ngũ Lão', 'Yết Kiêu'],
    correctIndex: 0,
    explanation: 'Trần Quốc Toản (16 tuổi) vì quá nhỏ không được dự Hội nghị Bình Than nên đã tức giận bóp nát quả cam.'
  },
  {
    id: 'triv_4',
    question: 'Câu nói "Ta thà làm ma nước Nam, chứ không thèm làm vương đất Bắc" là của ai?',
    options: ['Trần Thủ Độ', 'Trần Bình Trọng', 'Trần Hưng Đạo', 'Trần Quang Khải'],
    correctIndex: 1,
    explanation: 'Danh tướng Trần Bình Trọng đã khảng khái trả lời quân Nguyên Mông trước khi bị sát hại.'
  },
  {
    id: 'triv_5',
    question: 'Trận thủy chiến lịch sử đánh chìm hạm đội Nguyên Mông năm 1288 diễn ra ở sông nào?',
    options: ['Sông Hồng', 'Sông Lô', 'Sông Bạch Đằng', 'Sông Như Nguyệt'],
    correctIndex: 2,
    explanation: 'Trận Bạch Đằng 1288 là chiến thắng vĩ đại chấm dứt dã tâm xâm lược của đế quốc Nguyên Mông.'
  }
]

export function getRandomTrivia() {
  return TRIVIA_DATA[Math.floor(Math.random() * TRIVIA_DATA.length)]
}
