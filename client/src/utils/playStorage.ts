import type { UserStats, LeaderboardEntry, Achievement } from '../types/play'

const STATS_STORAGE_KEY = 'buildly_play_user_stats'

export const DEFAULT_USER_STATS: UserStats = {
  xp: 1240,
  level: 4,
  gamesPlayed: 14,
  gamesWon: 6,
  correctGuesses: 42,
  totalGuesses: 58,
  winStreak: 2,
  bestStreak: 4,
  highestScore: 1850,
  achievements: ['first_guess', 'streak_3'],
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_guess',
    title: 'First Blood',
    desc: 'Be the first to correctly guess a secret word in a round.',
    icon: '⚡',
    xpReward: 100,
    unlocked: true,
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    desc: 'Guess 3 consecutive drawings correctly without missing.',
    icon: '🔥',
    xpReward: 250,
    unlocked: true,
  },
  {
    id: 'master_artist',
    title: 'Da Vinci',
    desc: 'Every single player in the room guessed your drawing.',
    icon: '🎨',
    xpReward: 350,
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    desc: 'Guess a drawing within the first 6 seconds.',
    icon: '⏱️',
    xpReward: 200,
    unlocked: false,
  },
  {
    id: 'room_dominator',
    title: 'Grandmaster',
    desc: 'Win 1st place in a game with over 1,500 total points.',
    icon: '👑',
    xpReward: 500,
    unlocked: false,
  },
]

export const SAMPLE_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Satoshi_N',
    avatar: '⚡',
    level: 32,
    xp: 28450,
    wins: 114,
    accuracy: 94,
    badge: 'Legendary',
  },
  {
    rank: 2,
    name: 'Elena_V',
    avatar: '🦊',
    level: 27,
    xp: 22100,
    wins: 89,
    accuracy: 91,
    badge: 'Grandmaster',
  },
  {
    rank: 3,
    name: 'DevBot',
    avatar: '🤖',
    level: 24,
    xp: 19800,
    wins: 76,
    accuracy: 88,
    badge: 'Master',
  },
  {
    rank: 4,
    name: 'Aarav_P',
    avatar: '🚀',
    level: 19,
    xp: 14200,
    wins: 52,
    accuracy: 86,
    badge: 'Diamond',
  },
  {
    rank: 5,
    name: 'Alex Morgan (You)',
    avatar: '🎨',
    level: 4,
    xp: 1240,
    wins: 6,
    accuracy: 72,
    badge: 'Challenger',
  },
  {
    rank: 6,
    name: 'Marcus_K',
    avatar: '🦁',
    level: 12,
    xp: 8900,
    wins: 28,
    accuracy: 79,
    badge: 'Gold',
  },
  {
    rank: 7,
    name: 'Yashasvi',
    avatar: '⭐',
    level: 10,
    xp: 7400,
    wins: 24,
    accuracy: 82,
    badge: 'Silver',
  },
]

export function getSavedUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY)
    if (raw) return { ...DEFAULT_USER_STATS, ...JSON.parse(raw) }
  } catch {
    // fallback
  }
  return DEFAULT_USER_STATS
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

export function addXpAndRecordGame(
  xpGained: number,
  isWin: boolean,
  score: number,
  correctGuesses: number,
  totalGuessesInGame: number,
): UserStats {
  const current = getSavedUserStats()
  const newXp = current.xp + xpGained
  // 500 XP per level
  const newLevel = Math.max(current.level, Math.floor(newXp / 500) + 1)
  const newStreak = isWin ? current.winStreak + 1 : 0
  const updated: UserStats = {
    ...current,
    xp: newXp,
    level: newLevel,
    gamesPlayed: current.gamesPlayed + 1,
    gamesWon: current.gamesWon + (isWin ? 1 : 0),
    correctGuesses: current.correctGuesses + correctGuesses,
    totalGuesses: current.totalGuesses + totalGuessesInGame,
    winStreak: newStreak,
    bestStreak: Math.max(current.bestStreak, newStreak),
    highestScore: Math.max(current.highestScore, score),
  }
  saveUserStats(updated)
  return updated
}
