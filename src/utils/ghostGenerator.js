import { TRIVIA_DATA } from '../data/trivia'

export function generateBotGhost(bot) {
  const targetScore = bot.score
  let currentScore = 0
  let currentCombo = 0
  const questions = []
  const actions = []
  
  const eligible = TRIVIA_DATA.filter(t => t.arcs.some(a => a >= 1 && a <= 5))

  while (currentScore < targetScore) {
    // Pick random question
    const randomIdx = Math.floor(Math.random() * eligible.length)
    const q = eligible[randomIdx]
    questions.push(q.id)

    // Generate action
    // Bots usually answer fast (between 1500ms and 6000ms)
    const delayMs = Math.floor(Math.random() * 4500) + 1500
    actions.push({ delayMs, isCorrect: true })

    // Update score
    const comboMultiplier = 1 + (currentCombo * 0.1)
    currentScore += Math.floor(100 * comboMultiplier)
    currentCombo += 1
  }

  // The bot fails 3 times at the end to lose its 3 lives and die
  for (let i = 0; i < 3; i++) {
    const randomIdx = Math.floor(Math.random() * eligible.length)
    const q = eligible[randomIdx]
    questions.push(q.id)
    
    // Fails because it takes too long or answers wrong
    const delayMs = Math.floor(Math.random() * 2000) + 3000
    actions.push({ delayMs, isCorrect: false })
  }

  return {
    questions,
    actions,
    score: currentScore // Might be slightly higher than targetScore, but it's fine
  }
}
