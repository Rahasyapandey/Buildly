import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type {
  Player,
  GamePhase,
  WordChoice,
  DrawStroke,
  ChatMessage,
  RoomSettings,
  UserStats,
} from '../types/play'
import {
  getRandomWordChoices,
  generateWordHint,
  isWordMatch,
  isWordClose,
  WORD_BANK,
} from '../utils/wordBank'
import {
  getSavedUserStats,
  addXpAndRecordGame,
} from '../utils/playStorage'
import { soundEffects } from '../utils/soundEffects'

import PlayNavbar from '../components/Play/PlayNavbar'
import PlayLobby from '../components/Play/PlayLobby'
import PlayCanvas from '../components/Play/PlayCanvas'
import PlayWordSelector from '../components/Play/PlayWordSelector'
import PlayChat from '../components/Play/PlayChat'
import PlayPlayerList from '../components/Play/PlayPlayerList'
import PlayPodium from '../components/Play/PlayPodium'
import PlayVoiceBar from '../components/Play/PlayVoiceBar'
import PlayLeaderboard from '../components/Play/PlayLeaderboard'

import './Play.css'

export default function Play() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Generate or use room code from URL
  const [roomCode] = useState<string>(() => {
    const fromUrl = searchParams.get('room')
    if (fromUrl) return fromUrl.toUpperCase()
    return `BUILD-${Math.floor(1000 + Math.random() * 9000)}`
  })

  // Navigation tab: Game Room vs Leaderboard & Stats
  const [activeTab, setActiveTab] = useState<'game' | 'leaderboard'>('game')

  // User Stats & progression
  const [userStats, setUserStats] = useState<UserStats>(() => getSavedUserStats())

  // Current human user
  const [currentUser] = useState<Player>({
    id: 'user_alex',
    name: 'Alex Morgan',
    avatar: '🎨',
    color: '#2563eb',
    score: 0,
    roundScore: 0,
    isHost: true,
    isDrawing: false,
    hasGuessed: false,
    isMuted: false,
    isSpeaking: false,
  })

  // Players list (Human + default AI bot squad for instant local party)
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'user_alex',
      name: 'Alex Morgan',
      avatar: '🎨',
      color: '#2563eb',
      score: 0,
      roundScore: 0,
      isHost: true,
      isDrawing: false,
      hasGuessed: false,
      isMuted: false,
      isSpeaking: false,
    },
    {
      id: 'bot_devbot',
      name: 'DevBot',
      avatar: '🤖',
      color: '#10b981',
      score: 0,
      roundScore: 0,
      isHost: false,
      isDrawing: false,
      hasGuessed: false,
      isBot: true,
      isSpeaking: false,
    },
    {
      id: 'bot_elena',
      name: 'Elena',
      avatar: '🦊',
      color: '#ec4899',
      score: 0,
      roundScore: 0,
      isHost: false,
      isDrawing: false,
      hasGuessed: false,
      isBot: true,
      isSpeaking: false,
    },
    {
      id: 'bot_marcus',
      name: 'Marcus',
      avatar: '🦁',
      color: '#8b5cf6',
      score: 0,
      roundScore: 0,
      isHost: false,
      isDrawing: false,
      hasGuessed: false,
      isBot: true,
      isSpeaking: false,
    },
  ])

  // Game Settings
  const [settings, setSettings] = useState<RoomSettings>({
    rounds: 3,
    drawTime: 60,
    category: 'all',
    includeBots: true,
    maxPlayers: 6,
  })

  // Core Game State
  const [phase, setPhase] = useState<GamePhase>('lobby')
  const [currentRound, setCurrentRound] = useState(1)
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(settings.drawTime)
  const [currentWord, setCurrentWord] = useState('')
  const [wordHint, setWordHint] = useState('')
  const [wordChoices, setWordChoices] = useState<WordChoice[]>([])
  const [strokes, setStrokes] = useState<DrawStroke[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      playerName: 'Buildly System',
      text: `Welcome to Room ${roomCode}! Grab your mic, sketch out your ideas, and guess what teammates are drawing.`,
      type: 'system',
      timestamp: Date.now(),
    },
  ])

  const [roundWinnerWord, setRoundWinnerWord] = useState<string | null>(null)

  // BroadcastChannel for cross-tab multiplayer sync
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    try {
      const channel = new BroadcastChannel(`buildly_play_${roomCode}`)
      channelRef.current = channel

      channel.onmessage = (event) => {
        const { type, payload } = event.data
        if (type === 'stroke') {
          setStrokes((prev) => [...prev, payload])
        } else if (type === 'clear') {
          setStrokes([])
        } else if (type === 'undo') {
          setStrokes((prev) => prev.slice(0, -1))
        } else if (type === 'message') {
          setMessages((prev) => [...prev, payload])
        }
      }

      return () => {
        channel.close()
      }
    } catch {
      // BroadcastChannel unsupported fallback
    }
  }, [roomCode])

  const currentDrawer = players[currentDrawerIndex] || players[0]
  const isUserDrawing = currentDrawer.id === currentUser.id
  const hasUserGuessed = players.find((p) => p.id === currentUser.id)?.hasGuessed || false

  // Helper to append a system message
  const addSystemMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}-${Math.random()}`,
        playerName: 'System',
        text,
        type: 'system',
        timestamp: Date.now(),
      },
    ])
  }, [])

  const prepareTurnRef = useRef<(drawerIdx: number, roundNum: number) => void>(() => {})

  // Drawer picked a word -> start drawing countdown
  const startDrawingTurn = useCallback((word: string) => {
    setCurrentWord(word)
    setWordHint(generateWordHint(word, 0))
    setTimeLeft(settings.drawTime)
    setPhase('drawing')
    addSystemMessage('The clock is ticking! Start guessing!')
  }, [settings.drawTime, addSystemMessage])

  // Prepare a turn for a specific drawer
  const prepareTurn = useCallback((drawerIdx: number, roundNum: number) => {
    setStrokes([])
    setRoundWinnerWord(null)

    setPlayers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        isDrawing: idx === drawerIdx,
        hasGuessed: false,
        roundScore: 0,
      })),
    )

    const drawer = players[drawerIdx] || players[0]
    addSystemMessage(`Round ${roundNum}: ${drawer.name} is choosing a word...`)

    const choices = getRandomWordChoices(settings.category)
    setWordChoices(choices)
    setPhase('word-select')

    // If bot is the drawer, automatically select a word after 2.5 seconds
    if (drawer.isBot) {
      setTimeout(() => {
        const picked = choices[Math.floor(Math.random() * choices.length)]
        startDrawingTurn(picked.word)
      }, 2500)
    }
  }, [players, settings.category, addSystemMessage, startDrawingTurn])

  useEffect(() => {
    prepareTurnRef.current = prepareTurn
  }, [prepareTurn])

  // Start match
  const handleStartGame = () => {
    soundEffects.playStart()
    setCurrentRound(1)
    setCurrentDrawerIndex(0)
    setRoundWinnerWord(null)

    // Reset scores
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        roundScore: 0,
        hasGuessed: false,
        isDrawing: false,
      })),
    )

    prepareTurn(0, 1)
  }

  // End turn & reveal word
  const endTurn = useCallback(() => {
    setPhase('round-end')
    setRoundWinnerWord(currentWord)

    // Award drawer bonus points for every guesser
    const guessersCount = players.filter((p) => p.hasGuessed && !p.isDrawing).length
    if (guessersCount > 0) {
      const drawerBonus = guessersCount * 75
      setPlayers((prev) =>
        prev.map((p) =>
          p.isDrawing ? { ...p, score: p.score + drawerBonus } : p,
        ),
      )
      addSystemMessage(
        `${currentDrawer.name} earned +${drawerBonus} bonus pts because ${guessersCount} player(s) guessed the drawing!`,
      )
    }

    // Wait 4 seconds, then proceed to next drawer or next round
    setTimeout(() => {
      const nextDrawerIdx = currentDrawerIndex + 1

      if (nextDrawerIdx >= players.length) {
        // Round completed for all players
        const nextRound = currentRound + 1
        if (nextRound > settings.rounds) {
          // Game Over!
          setPhase('game-over')
          // Save stats & XP
          const userFinal = players.find((p) => p.id === currentUser.id)
          const sorted = [...players].sort((a, b) => b.score - a.score)
          const isWin = sorted[0]?.id === currentUser.id
          const newStats = addXpAndRecordGame(
            isWin ? 350 : 150,
            isWin,
            userFinal?.score || 0,
            4,
            6,
          )
          setUserStats(newStats)
        } else {
          setCurrentRound(nextRound)
          setCurrentDrawerIndex(0)
          prepareTurnRef.current(0, nextRound)
        }
      } else {
        setCurrentDrawerIndex(nextDrawerIdx)
        prepareTurnRef.current(nextDrawerIdx, currentRound)
      }
    }, 4000)
  }, [currentWord, players, currentDrawerIndex, currentRound, settings.rounds, currentDrawer.name, currentUser.id, addSystemMessage])

  // Drawing turn timer loop
  useEffect(() => {
    if (phase !== 'drawing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endTurn()
          return 0
        }

        const newTime = prev - 1

        // Soft tick sound in final 5 seconds
        if (newTime <= 5) {
          soundEffects.playTick()
        }

        // Reveal partial letter hints at 50% and 25% time
        if (newTime === Math.floor(settings.drawTime * 0.5)) {
          setWordHint(generateWordHint(currentWord, 0.3))
        } else if (newTime === Math.floor(settings.drawTime * 0.25)) {
          setWordHint(generateWordHint(currentWord, 0.6))
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, settings.drawTime, currentWord, endTurn])

  // Bot automated drawing playback when a bot is the active drawer
  useEffect(() => {
    if (phase !== 'drawing' || !currentDrawer.isBot) return

    // Find pre-baked strokes for the word if available
    const wordDef = WORD_BANK.find(
      (w) => w.word.toLowerCase() === currentWord.toLowerCase(),
    )
    const strokesToDraw = wordDef?.botStrokes || []

    let strokeIdx = 0
    const botInterval = setInterval(() => {
      if (strokeIdx >= strokesToDraw.length) {
        clearInterval(botInterval)
        return
      }
      const st = strokesToDraw[strokeIdx]
      setStrokes((prev) => [...prev, st])
      strokeIdx++
    }, 2800)

    return () => clearInterval(botInterval)
  }, [phase, currentDrawer.isBot, currentWord])

  // Teammate Bot automated guessing simulation during drawing phase
  useEffect(() => {
    if (phase !== 'drawing') return

    const botGuessers = players.filter((p) => p.isBot && !p.isDrawing && !p.hasGuessed)
    if (botGuessers.length === 0) return

    // Random timer for bot guessing
    const botTimer = setTimeout(() => {
      const activeBot = botGuessers[Math.floor(Math.random() * botGuessers.length)]
      const shouldGuessCorrect = Math.random() > 0.35 // 65% chance of correct guess

      if (shouldGuessCorrect) {
        const pointsAwarded = Math.round(150 + (timeLeft / settings.drawTime) * 300)
        soundEffects.playCorrect()

        setPlayers((prev) =>
          prev.map((p) =>
            p.id === activeBot.id
              ? { ...p, score: p.score + pointsAwarded, hasGuessed: true }
              : p,
          ),
        )

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-correct-${Date.now()}`,
            playerId: activeBot.id,
            playerName: activeBot.name,
            text: 'Guessed the word!',
            type: 'correct',
            points: pointsAwarded,
            timestamp: Date.now(),
          },
        ])
      } else {
        // Funny incorrect guess
        const wrongGuesses = ['Is it CSS?', 'A server cluster?', 'Cloud function?', 'A react component?']
        const funnyGuess = wrongGuesses[Math.floor(Math.random() * wrongGuesses.length)]

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-wrong-${Date.now()}`,
            playerId: activeBot.id,
            playerName: activeBot.name,
            playerColor: activeBot.color,
            text: funnyGuess,
            type: 'chat',
            timestamp: Date.now(),
          },
        ])
      }
    }, 8000 + Math.random() * 9000)

    return () => clearTimeout(botTimer)
  }, [phase, players, currentWord, timeLeft, settings.drawTime])

  // Canvas Stroke actions
  const handleAddStroke = (stroke: DrawStroke) => {
    setStrokes((prev) => [...prev, stroke])
    channelRef.current?.postMessage({ type: 'stroke', payload: stroke })
  }

  const handleClearStrokes = () => {
    setStrokes([])
    channelRef.current?.postMessage({ type: 'clear' })
  }

  const handleUndoStroke = () => {
    setStrokes((prev) => prev.slice(0, -1))
    channelRef.current?.postMessage({ type: 'undo' })
  }

  // Handle user incoming chat / guess
  const handleSendMessage = (text: string) => {
    // If game is in drawing phase and user hasn't guessed yet
    if (phase === 'drawing' && !isUserDrawing && !hasUserGuessed) {
      if (isWordMatch(text, currentWord)) {
        // Correct Guess!
        soundEffects.playCorrect()
        const points = Math.round(150 + (timeLeft / settings.drawTime) * 350)

        setPlayers((prev) =>
          prev.map((p) =>
            p.id === currentUser.id
              ? { ...p, score: p.score + points, hasGuessed: true }
              : p,
          ),
        )

        const correctMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          playerId: currentUser.id,
          playerName: currentUser.name,
          text: 'Guessed the word!',
          type: 'correct',
          points,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, correctMsg])
        channelRef.current?.postMessage({ type: 'message', payload: correctMsg })

        // Check if all players have now guessed
        const remainingToGuess = players.filter(
          (p) => !p.isDrawing && p.id !== currentUser.id && !p.hasGuessed,
        )
        if (remainingToGuess.length === 0) {
          endTurn()
        }
        return
      }

      if (isWordClose(text, currentWord)) {
        // Close guess hint
        setMessages((prev) => [
          ...prev,
          {
            id: `close-${Date.now()}`,
            playerName: 'Hint',
            text: `"${text}" is very close!`,
            type: 'close',
            timestamp: Date.now(),
          },
        ])
        return
      }
    }

    // Normal chat message
    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      playerId: currentUser.id,
      playerName: currentUser.name,
      playerColor: currentUser.color,
      text,
      type: 'chat',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, chatMsg])
    channelRef.current?.postMessage({ type: 'message', payload: chatMsg })
  }

  // Lobby actions
  const handleAddBot = () => {
    const botNames = ['Sarah', 'Kenji', 'Priya', 'Liam']
    const avatars = ['⚡', '🚀', '⭐', '💎']
    const colors = ['#0ea5e9', '#f59e0b', '#10b981', '#ec4899']

    const nextIdx = players.length
    if (nextIdx >= settings.maxPlayers) return

    const newBot: Player = {
      id: `bot_${Date.now()}`,
      name: botNames[nextIdx % botNames.length],
      avatar: avatars[nextIdx % avatars.length],
      color: colors[nextIdx % colors.length],
      score: 0,
      roundScore: 0,
      isHost: false,
      isDrawing: false,
      hasGuessed: false,
      isBot: true,
      isSpeaking: false,
    }

    setPlayers((prev) => [...prev, newBot])
  }

  const handleRemovePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  const handlePlayAgain = () => {
    setPhase('lobby')
    setStrokes([])
    setRoundWinnerWord(null)
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        roundScore: 0,
        hasGuessed: false,
        isDrawing: false,
      })),
    )
  }

  return (
    <div className="play-root-layout">
      {/* Top Navbar */}
      <PlayNavbar
        roomCode={roomCode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLeaveRoom={() => navigate('/overview')}
        isConnected={true}
        isVoiceActive={true}
      />

      {/* Main Content Area */}
      <main className="play-main-view">
        {activeTab === 'leaderboard' ? (
          <PlayLeaderboard
            userStats={userStats}
            onBackToGame={() => setActiveTab('game')}
          />
        ) : phase === 'lobby' ? (
          <PlayLobby
            roomCode={roomCode}
            players={players}
            currentUser={currentUser}
            settings={settings}
            onUpdateSettings={setSettings}
            onStartGame={handleStartGame}
            onAddBot={handleAddBot}
            onRemovePlayer={handleRemovePlayer}
          />
        ) : (
          /* Active Game Room View */
          <div className="play-gameroom-layout">
            {/* Left: Players List */}
            <PlayPlayerList players={players} currentUser={currentUser} />

            {/* Center: Canvas and Drawing Board */}
            <div className="play-canvas-center-panel">
              <PlayCanvas
                isDrawer={isUserDrawing}
                drawerName={currentDrawer.name}
                secretWord={currentWord}
                wordHint={wordHint}
                timeLeft={timeLeft}
                totalTime={settings.drawTime}
                roundNumber={currentRound}
                totalRounds={settings.rounds}
                strokes={strokes}
                onAddStroke={handleAddStroke}
                onClear={handleClearStrokes}
                onUndo={handleUndoStroke}
              />
            </div>

            {/* Right: Guessing Chat */}
            <PlayChat
              messages={messages}
              isDrawer={isUserDrawing}
              hasGuessed={hasUserGuessed}
              onSendMessage={handleSendMessage}
            />

            {/* Word Selection Modal (Only when it's your turn to choose) */}
            {phase === 'word-select' && isUserDrawing && (
              <PlayWordSelector
                choices={wordChoices}
                onSelectWord={(choice) => startDrawingTurn(choice.word)}
              />
            )}

            {/* Round End Reveal Banner */}
            {phase === 'round-end' && (
              <div className="play-round-reveal-banner">
                <span className="play-reveal-tag">TIME'S UP!</span>
                <h2 className="play-reveal-word">
                  The word was: <strong>{roundWinnerWord?.toUpperCase()}</strong>
                </h2>
                <p className="play-reveal-sub">Next drawer starting shortly...</p>
              </div>
            )}

            {/* Final Game Over Podium */}
            {phase === 'game-over' && (
              <PlayPodium
                players={players}
                currentUser={currentUser}
                userStats={userStats}
                onPlayAgain={handlePlayAgain}
                onExit={() => navigate('/overview')}
              />
            )}
          </div>
        )}
      </main>

      {/* Integrated Voice Chat Bar (Always accessible in room, docked floating at bottom) */}
      {activeTab === 'game' && (
        <PlayVoiceBar
          players={players}
          currentUser={currentUser}
          onSpeakingChange={(speaking) => {
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === currentUser.id ? { ...p, isSpeaking: speaking } : p,
              ),
            )
          }}
        />
      )}
    </div>
  )
}
