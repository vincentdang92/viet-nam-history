export const COMBAT_CARDS = [
  {
    id: 'combat_charge',
    context: 'Tiền quân địch ào ạt xông tới với khí thế hung hãn!',
    character: 'enemy_general',
    quote: 'Tiến lên! Không để chúng kịp trở tay!',
    choices: [
      {
        id: 'atk',
        text: 'Nghênh chiến (Đánh đổi)',
        playerHPDelta: -15,
        enemyHPDelta: -25,
      },
      {
        id: 'def',
        text: 'Lập mộc bài (Phòng thủ)',
        playerHPDelta: -5,
        enemyHPDelta: -5,
      }
    ]
  },
  {
    id: 'combat_arrows',
    context: 'Bầu trời đen kịt bởi cơn mưa tên từ cung thủ địch!',
    character: 'enemy_archer',
    quote: 'Bắn! Bắn cho đến khi không còn kẻ nào sống sót!',
    choices: [
      {
        id: 'atk',
        text: 'Dội hỏa tiễn đáp trả (Phản công)',
        playerHPDelta: -10,
        enemyHPDelta: -15,
      },
      {
        id: 'def',
        text: 'Giương khiên che chắn (Phòng ngự)',
        playerHPDelta: -5,
        enemyHPDelta: 0,
      }
    ]
  },
  {
    id: 'combat_flank',
    context: 'Kỵ binh địch bất ngờ bọc đánh từ hai bên sườn!',
    character: 'enemy_cavalry',
    quote: 'Nghiền nát chúng!',
    choices: [
      {
        id: 'atk',
        text: 'Điều quân đón đánh (Tử chiến)',
        playerHPDelta: -20,
        enemyHPDelta: -30,
      },
      {
        id: 'def',
        text: 'Co cụm đội hình (Bảo toàn)',
        playerHPDelta: -10,
        enemyHPDelta: 0,
      }
    ]
  },
  {
    id: 'combat_morale',
    context: 'Quân lính bắt đầu nao núng trước sức ép quá lớn của địch.',
    character: 'player_general',
    quote: 'Tướng quân, xin hãy ra chỉ thị!',
    choices: [
      {
        id: 'atk',
        text: 'Bản tướng đích thân xung phong! (Liều mạng)',
        playerHPDelta: -15,
        enemyHPDelta: -25,
      },
      {
        id: 'def',
        text: 'Dóng trống khích lệ (Hồi sức)',
        playerHPDelta: 15,
        enemyHPDelta: 0,
      }
    ]
  },
  {
    id: 'combat_trap',
    context: 'Địch đang hành quân qua địa hình đầm lầy hiểm trở.',
    character: 'player_general',
    quote: 'Đây là cơ hội trời cho!',
    choices: [
      {
        id: 'atk',
        text: 'Phóng hỏa công (Trí mạng)',
        playerHPDelta: 0,
        enemyHPDelta: -25,
      },
      {
        id: 'def',
        text: 'Chờ địch lọt sâu vào lưới (Mai phục)',
        playerHPDelta: 10,
        enemyHPDelta: -10,
      }
    ]
  }
]

export function getRandomCombatCard() {
  return COMBAT_CARDS[Math.floor(Math.random() * COMBAT_CARDS.length)]
}
