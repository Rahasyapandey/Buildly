export interface Player {
  id: string
  name: string
  avatar: string
  color: string
  score: number
  roundScore: number
  isHost: boolean
  isDrawing: boolean
  hasGuessed: boolean
  guessTime?: number
  isBot?: boolean
  isMuted?: boolean
  isSpeaking?: boolean
  hasCamera?: boolean
  hasScreenShare?: boolean
}

export type GamePhase =
  | 'lobby'
  | 'word-select'
  | 'drawing'
  | 'round-end'
  | 'game-over'

export interface WordChoice {
  word: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  hint: string
}

export interface DrawStroke {
  tool: 'pen' | 'eraser'
  color: string
  size: number
  points: { x: number; y: number }[]
}

export interface ChatMessage {
  id: string
  playerId?: string
  playerName: string
  playerColor?: string
  text: string
  type: 'chat' | 'guess' | 'correct' | 'close' | 'system' | 'drawer'
  timestamp: number
  points?: number
}

export interface RoomSettings {
  rounds: number
  drawTime: number
  category: 'all' | 'tech' | 'party'
  includeBots: boolean
  maxPlayers: number
}

export interface UserStats {
  xp: number
  level: number
  gamesPlayed: number
  gamesWon: number
  correctGuesses: number
  totalGuesses: number
  winStreak: number
  bestStreak: number
  highestScore: number
  achievements: string[]
}

export interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  level: number
  xp: number
  wins: number
  accuracy: number
  badge: string
}

export interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  xpReward: number
  unlocked: boolean
}
