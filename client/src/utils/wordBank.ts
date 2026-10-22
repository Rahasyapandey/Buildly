import type { WordChoice, DrawStroke } from '../types/play'

export interface WordDefinition {
  word: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  hint: string
  category: 'tech' | 'party'
  // Optional pre-baked coordinates for bots to sketch on canvas
  botStrokes?: DrawStroke[]
}

export const WORD_BANK: WordDefinition[] = [
  // --- TECH CATEGORY ---
  {
    word: 'Database',
    difficulty: 'Easy',
    points: 150,
    hint: 'Stores structured data in tables and records',
    category: 'tech',
    botStrokes: [
      // Cylinder top
      {
        tool: 'pen',
        color: '#2563eb',
        size: 4,
        points: [
          { x: 260, y: 140 },
          { x: 300, y: 125 },
          { x: 360, y: 125 },
          { x: 400, y: 140 },
          { x: 360, y: 155 },
          { x: 300, y: 155 },
          { x: 260, y: 140 },
        ],
      },
      // Cylinder sides
      {
        tool: 'pen',
        color: '#2563eb',
        size: 4,
        points: [
          { x: 260, y: 140 },
          { x: 260, y: 280 },
        ],
      },
      {
        tool: 'pen',
        color: '#2563eb',
        size: 4,
        points: [
          { x: 400, y: 140 },
          { x: 400, y: 280 },
        ],
      },
      // Cylinder bottom
      {
        tool: 'pen',
        color: '#2563eb',
        size: 4,
        points: [
          { x: 260, y: 280 },
          { x: 300, y: 295 },
          { x: 360, y: 295 },
          { x: 400, y: 280 },
        ],
      },
      // Middle rung
      {
        tool: 'pen',
        color: '#3b82f6',
        size: 3,
        points: [
          { x: 260, y: 210 },
          { x: 300, y: 225 },
          { x: 360, y: 225 },
          { x: 400, y: 210 },
        ],
      },
    ],
  },
  {
    word: 'Cloud',
    difficulty: 'Easy',
    points: 120,
    hint: 'Remote servers delivering computing services over the internet',
    category: 'tech',
    botStrokes: [
      {
        tool: 'pen',
        color: '#0ea5e9',
        size: 4,
        points: [
          { x: 250, y: 240 },
          { x: 230, y: 220 },
          { x: 240, y: 180 },
          { x: 280, y: 170 },
          { x: 310, y: 140 },
          { x: 360, y: 140 },
          { x: 390, y: 170 },
          { x: 430, y: 190 },
          { x: 430, y: 230 },
          { x: 400, y: 250 },
          { x: 250, y: 250 },
        ],
      },
      // Rain drops or lightning
      {
        tool: 'pen',
        color: '#38bdf8',
        size: 3,
        points: [
          { x: 280, y: 270 },
          { x: 275, y: 295 },
        ],
      },
      {
        tool: 'pen',
        color: '#38bdf8',
        size: 3,
        points: [
          { x: 330, y: 270 },
          { x: 325, y: 295 },
        ],
      },
      {
        tool: 'pen',
        color: '#38bdf8',
        size: 3,
        points: [
          { x: 380, y: 270 },
          { x: 375, y: 295 },
        ],
      },
    ],
  },
  {
    word: 'Monitor',
    difficulty: 'Easy',
    points: 130,
    hint: 'An electronic screen used to display output from a computer',
    category: 'tech',
    botStrokes: [
      // Screen outline
      {
        tool: 'pen',
        color: '#1e293b',
        size: 4,
        points: [
          { x: 240, y: 140 },
          { x: 420, y: 140 },
          { x: 420, y: 260 },
          { x: 240, y: 260 },
          { x: 240, y: 140 },
        ],
      },
      // Stand stem
      {
        tool: 'pen',
        color: '#64748b',
        size: 4,
        points: [
          { x: 330, y: 260 },
          { x: 330, y: 310 },
        ],
      },
      // Stand base
      {
        tool: 'pen',
        color: '#64748b',
        size: 4,
        points: [
          { x: 280, y: 310 },
          { x: 380, y: 310 },
        ],
      },
      // Code on screen
      {
        tool: 'pen',
        color: '#10b981',
        size: 2,
        points: [
          { x: 260, y: 170 },
          { x: 320, y: 170 },
        ],
      },
      {
        tool: 'pen',
        color: '#10b981',
        size: 2,
        points: [
          { x: 280, y: 190 },
          { x: 360, y: 190 },
        ],
      },
      {
        tool: 'pen',
        color: '#3b82f6',
        size: 2,
        points: [
          { x: 260, y: 210 },
          { x: 340, y: 210 },
        ],
      },
    ],
  },
  {
    word: 'Coffee',
    difficulty: 'Easy',
    points: 110,
    hint: 'The fuel of software engineers everywhere',
    category: 'party',
    botStrokes: [
      // Mug body
      {
        tool: 'pen',
        color: '#854d0e',
        size: 4,
        points: [
          { x: 270, y: 170 },
          { x: 380, y: 170 },
          { x: 370, y: 280 },
          { x: 280, y: 280 },
          { x: 270, y: 170 },
        ],
      },
      // Mug handle
      {
        tool: 'pen',
        color: '#854d0e',
        size: 4,
        points: [
          { x: 378, y: 190 },
          { x: 420, y: 200 },
          { x: 420, y: 240 },
          { x: 375, y: 250 },
        ],
      },
      // Steam
      {
        tool: 'pen',
        color: '#94a3b8',
        size: 2,
        points: [
          { x: 300, y: 155 },
          { x: 310, y: 135 },
          { x: 300, y: 115 },
        ],
      },
      {
        tool: 'pen',
        color: '#94a3b8',
        size: 2,
        points: [
          { x: 340, y: 155 },
          { x: 350, y: 135 },
          { x: 340, y: 115 },
        ],
      },
    ],
  },
  {
    word: 'Rocket',
    difficulty: 'Medium',
    points: 200,
    hint: 'To the moon! Deploys your code to production at lightspeed',
    category: 'tech',
    botStrokes: [
      // Rocket nose & body
      {
        tool: 'pen',
        color: '#ef4444',
        size: 4,
        points: [
          { x: 330, y: 110 },
          { x: 360, y: 160 },
          { x: 360, y: 250 },
          { x: 300, y: 250 },
          { x: 300, y: 160 },
          { x: 330, y: 110 },
        ],
      },
      // Window
      {
        tool: 'pen',
        color: '#38bdf8',
        size: 3,
        points: [
          { x: 320, y: 180 },
          { x: 340, y: 180 },
          { x: 340, y: 200 },
          { x: 320, y: 200 },
          { x: 320, y: 180 },
        ],
      },
      // Left fin
      {
        tool: 'pen',
        color: '#ef4444',
        size: 4,
        points: [
          { x: 300, y: 220 },
          { x: 265, y: 260 },
          { x: 300, y: 255 },
        ],
      },
      // Right fin
      {
        tool: 'pen',
        color: '#ef4444',
        size: 4,
        points: [
          { x: 360, y: 220 },
          { x: 395, y: 260 },
          { x: 360, y: 255 },
        ],
      },
      // Fire exhaust
      {
        tool: 'pen',
        color: '#f59e0b',
        size: 4,
        points: [
          { x: 310, y: 255 },
          { x: 330, y: 310 },
          { x: 350, y: 255 },
        ],
      },
    ],
  },
  {
    word: 'Kubernetes',
    difficulty: 'Hard',
    points: 300,
    hint: 'Container orchestration platform with a 7-spoked ship helm logo',
    category: 'tech',
  },
  {
    word: 'Docker',
    difficulty: 'Medium',
    points: 220,
    hint: 'A blue whale carrying software containers on its back',
    category: 'tech',
  },
  {
    word: 'Keyboard',
    difficulty: 'Easy',
    points: 130,
    hint: 'Physical typing device with QWERTY layout',
    category: 'tech',
  },
  {
    word: 'Firewall',
    difficulty: 'Medium',
    points: 210,
    hint: 'A brick wall engulfed in flames blocking malicious network packets',
    category: 'tech',
  },
  {
    word: 'Python',
    difficulty: 'Medium',
    points: 180,
    hint: 'A friendly yellow and blue serpent programming language',
    category: 'tech',
  },
  {
    word: 'Bug',
    difficulty: 'Easy',
    points: 120,
    hint: 'An unwanted glitch or crawler hiding inside your source code',
    category: 'tech',
  },
  {
    word: 'Terminal',
    difficulty: 'Easy',
    points: 140,
    hint: 'Black window with a green blinking prompt cursor ($ _)',
    category: 'tech',
  },
  {
    word: 'Pizza',
    difficulty: 'Easy',
    points: 100,
    hint: 'Triangular slice topped with melted cheese and pepperoni circles',
    category: 'party',
  },
  {
    word: 'Guitar',
    difficulty: 'Medium',
    points: 190,
    hint: 'Musical instrument with 6 strings and a long neck',
    category: 'party',
  },
  {
    word: 'Bicycle',
    difficulty: 'Medium',
    points: 180,
    hint: 'Two wheels, handlebars, and pedals',
    category: 'party',
  },
  {
    word: 'Astronaut',
    difficulty: 'Hard',
    points: 280,
    hint: 'Person floating in a spacesuit with a gold reflective helmet visor',
    category: 'party',
  },
  {
    word: 'Castle',
    difficulty: 'Hard',
    points: 260,
    hint: 'Stone fortress with battlements, towers, and a drawbridge',
    category: 'party',
  },
  {
    word: 'Submarine',
    difficulty: 'Hard',
    points: 270,
    hint: 'Yellow vessel with a periscope exploring beneath the ocean waves',
    category: 'party',
  },
]

// Pick 3 random words for drawer selection modal
export function getRandomWordChoices(
  category: 'all' | 'tech' | 'party' = 'all',
): WordChoice[] {
  let pool = WORD_BANK
  if (category !== 'all') {
    pool = WORD_BANK.filter((w) => w.category === category)
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5)

  // Ensure 1 Easy, 1 Medium, and 1 Hard if available
  const easy = shuffled.find((w) => w.difficulty === 'Easy') || shuffled[0]
  const med = shuffled.find((w) => w.difficulty === 'Medium') || shuffled[1]
  const hard = shuffled.find((w) => w.difficulty === 'Hard') || shuffled[2]

  return [
    {
      word: easy.word,
      difficulty: easy.difficulty,
      points: easy.points,
      hint: easy.hint,
    },
    {
      word: med.word,
      difficulty: med.difficulty,
      points: med.points,
      hint: med.hint,
    },
    {
      word: hard.word,
      difficulty: hard.difficulty,
      points: hard.points,
      hint: hard.hint,
    },
  ]
}

// Generate masked hint (e.g., "_ _ _ _ _") and reveal partial letters over time
export function generateWordHint(
  word: string,
  revealFraction: number = 0,
): string {
  const chars = word.split('')
  const totalLetters = chars.filter((c) => c !== ' ').length
  const revealCount = Math.floor(totalLetters * Math.min(revealFraction, 0.6)) // max 60% revealed

  // Pick deterministic or stable indices based on word characters
  const indicesToReveal = new Set<number>()
  for (let i = 0; i < revealCount; i++) {
    const idx = (i * 3 + 1) % chars.length
    if (chars[idx] !== ' ') {
      indicesToReveal.add(idx)
    }
  }

  return chars
    .map((c, idx) => {
      if (c === ' ') return ' '
      if (indicesToReveal.has(idx)) return c
      return '_'
    })
    .join(' ')
}

// Check if a guess matches the secret word (ignoring case, spaces, and punctuation)
export function isWordMatch(guess: string, target: string): boolean {
  const cleanGuess = guess.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  return cleanGuess === cleanTarget
}

// Levenshtein distance to check if a player's guess is "close"
export function isWordClose(guess: string, target: string): boolean {
  const a = guess.trim().toLowerCase()
  const b = target.trim().toLowerCase()
  if (Math.abs(a.length - b.length) > 2) return false

  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        )
      }
    }
  }

  const dist = matrix[b.length][a.length]
  return dist > 0 && dist <= 2
}
