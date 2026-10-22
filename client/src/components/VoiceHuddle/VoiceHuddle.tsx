import { useEffect, useRef, useState } from 'react'
import './VoiceHuddle.css'

interface Participant {
  id: string
  name: string
  initials: string
  color: string
  isMuted: boolean
  isSpeaking: boolean
}

export default function VoiceHuddle() {
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [secondsInCall, setSecondsInCall] = useState(0)
  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false)

  // Real mic audio stream & analyser references
  const audioStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Teammates in the room
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'alex',
      name: 'Alex Morgan (You)',
      initials: 'AM',
      color: '#2563eb',
      isMuted: false,
      isSpeaking: false,
    },
    {
      id: 'aarav',
      name: 'Aarav',
      initials: 'AR',
      color: '#10b981',
      isMuted: false,
      isSpeaking: false,
    },
    {
      id: 'yashasvi',
      name: 'Yashasvi',
      initials: 'YS',
      color: '#8b5cf6',
      isMuted: false,
      isSpeaking: false,
    },
  ])

  // Call timer
  useEffect(() => {
    if (!isInCall) return

    const timer = setInterval(() => {
      setSecondsInCall((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isInCall])

  // Teammate speech simulation for live collaborative experience
  useEffect(() => {
    if (!isInCall || isDeafened) return

    const interval = setInterval(() => {
      const peers = ['aarav', 'yashasvi']
      const activePeer = Math.random() > 0.4 ? peers[Math.floor(Math.random() * peers.length)] : null

      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === 'alex') {
            return { ...p, isSpeaking: isSpeakingLocal && !isMuted, isMuted }
          }
          return {
            ...p,
            isSpeaking: activePeer === p.id && !p.isMuted,
          }
        }),
      )
    }, 2400)

    return () => clearInterval(interval)
  }, [isInCall, isDeafened, isSpeakingLocal, isMuted])

  // Real Microphone Audio Analyser
  const startAudioCapture = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      audioStreamRef.current = stream

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioCtx = new AudioContextClass()
      audioContextRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const checkVolume = () => {
        if (!audioStreamRef.current) return
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const average = sum / bufferLength

        // If audio level passes threshold, user is speaking
        setIsSpeakingLocal(average > 15)
        animFrameRef.current = requestAnimationFrame(checkVolume)
      }

      checkVolume()
    } catch {
      // Permission denied or mic unavailable — fallback to regular state without crashing
      console.info('Mic access not granted or unavailable, audio huddle running in simulated voice mode.')
    }
  }

  const stopAudioCapture = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
      audioStreamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    setIsSpeakingLocal(false)
  }

  const handleJoinCall = async () => {
    setSecondsInCall(0)
    setIsInCall(true)
    setIsMuted(false)
    setIsDeafened(false)
    await startAudioCapture()
  }

  const handleLeaveCall = () => {
    setIsInCall(false)
    setSecondsInCall(0)
    stopAudioCapture()
  }

  const handleToggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)

    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMute
      })
    }
  }

  const handleToggleDeafen = () => {
    setIsDeafened(!isDeafened)
  }

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (!isInCall) {
    return (
      <div className="voice-join-trigger" onClick={handleJoinCall}>
        <div className="voice-join-icon">🎙️</div>
        <div>
          <div className="voice-join-text">Connect Voice Huddle</div>
          <div className="voice-join-sub">Audio-only team sync • 2 active</div>
        </div>
        <button className="btn-start-voice">Join Voice</button>
      </div>
    )
  }

  return (
    <div className="voice-huddle-bar" role="region" aria-label="Voice Huddle Controls">
      {/* Room Badge */}
      <div className="voice-room-info">
        <div className="voice-room-badge">
          <span className="voice-live-dot" />
          <span>Huddle</span>
        </div>
        <span className="voice-call-timer">{formatTime(secondsInCall)}</span>
      </div>

      {/* Participants */}
      <div className="voice-participants-list">
        {participants.map((p) => {
          const speaking = p.id === 'alex' ? isSpeakingLocal && !isMuted : p.isSpeaking
          const muted = p.id === 'alex' ? isMuted : p.isMuted

          return (
            <div
              key={p.id}
              className="voice-participant"
              title={`${p.name}${muted ? ' (Muted)' : speaking ? ' (Speaking)' : ''}`}
            >
              <div
                className={`voice-avatar ${speaking ? 'voice-avatar--speaking' : ''}`}
                style={{ backgroundColor: p.color }}
              >
                {p.initials}
                {muted && <span className="voice-status-icon">✕</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="voice-controls-row">
        {/* Mic Mute Button */}
        <button
          className={`voice-control-btn ${isMuted ? 'voice-control-btn--active-mute' : ''}`}
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          aria-label={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? '🔇' : '🎙️'}
        </button>

        {/* Deafen / Speaker Button */}
        <button
          className={`voice-control-btn ${isDeafened ? 'voice-control-btn--active-mute' : ''}`}
          onClick={handleToggleDeafen}
          title={isDeafened ? 'Undeafen Audio' : 'Deafen (Mute Incoming Audio)'}
          aria-label={isDeafened ? 'Undeafen Audio' : 'Deafen'}
        >
          {isDeafened ? '🔈' : '🔊'}
        </button>

        {/* Disconnect Button */}
        <button
          className="voice-control-btn voice-control-btn--end-call"
          onClick={handleLeaveCall}
          title="Disconnect from Voice Huddle"
          aria-label="Disconnect"
        >
          📞
        </button>
      </div>
    </div>
  )
}
