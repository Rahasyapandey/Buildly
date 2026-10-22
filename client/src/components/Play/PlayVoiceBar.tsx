import { useState, useEffect, useRef, useCallback } from 'react'
import type { Player } from '../../types/play'
import './PlayVoiceBar.css'

interface PlayVoiceBarProps {
  players: Player[]
  currentUser: Player
  onSpeakingChange?: (isSpeaking: boolean) => void
}

export default function PlayVoiceBar({
  players,
  currentUser,
  onSpeakingChange,
}: PlayVoiceBarProps) {
  const [isInVoice, setIsInVoice] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(0) // 0 - 100
  const [showRoster, setShowRoster] = useState(false)

  const audioStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const videoStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const videoElemRef = useRef<HTMLVideoElement | null>(null)
  const screenElemRef = useRef<HTMLVideoElement | null>(null)
  const isMutedRef = useRef(isMuted)

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  const stopAudio = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop())
      audioStreamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    setVolumeLevel(0)
    onSpeakingChange?.(false)
  }, [onSpeakingChange])

  // Start real microphone capture with Web Audio API analyser
  const startAudio = useCallback(async () => {
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

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      source.connect(analyser)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const checkAudio = () => {
        if (!audioStreamRef.current) return
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const avg = sum / bufferLength
        const vol = Math.min(100, Math.round((avg / 80) * 100))
        setVolumeLevel(vol)

        const speaking = vol > 12 && !isMutedRef.current
        onSpeakingChange?.(speaking)

        animFrameRef.current = requestAnimationFrame(checkAudio)
      }

      checkAudio()
    } catch {
      console.info('Mic unavailable or permission denied — fallback to voice mode.')
    }
  }, [onSpeakingChange])

  // Handle Mute
  const toggleMute = () => {
    const next = !isMuted
    setIsMuted(next)
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !next
      })
    }
  }

  // Handle Deafen
  const toggleDeafen = () => {
    setIsDeafened((prev) => !prev)
  }

  // Toggle Camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop())
        videoStreamRef.current = null
      }
      setIsCameraOn(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 24 },
        })
        videoStreamRef.current = stream
        if (videoElemRef.current) {
          videoElemRef.current.srcObject = stream
        }
        setIsCameraOn(true)
      } catch {
        alert('Could not access camera. Please check browser permissions.')
      }
    }
  }

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop())
        screenStreamRef.current = null
      }
      setIsScreenSharing(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        screenStreamRef.current = stream
        if (screenElemRef.current) {
          screenElemRef.current.srcObject = stream
        }
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
        }
        setIsScreenSharing(true)
      } catch {
        // User cancelled picker
      }
    }
  }

  const handleJoinVoice = async () => {
    setIsInVoice(true)
    await startAudio()
  }

  const handleLeaveVoice = () => {
    setIsInVoice(false)
    setIsCameraOn(false)
    setIsScreenSharing(false)
    stopAudio()
  }

  // Auto-connect audio on initial mount, and cleanup on unmount
  useEffect(() => {
    startAudio()
    return () => {
      stopAudio()
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop())
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [startAudio, stopAudio])

  // Attach video stream if camera element mounts
  useEffect(() => {
    if (isCameraOn && videoElemRef.current && videoStreamRef.current) {
      videoElemRef.current.srcObject = videoStreamRef.current
    }
  }, [isCameraOn])

  // Attach screen stream if screen element mounts
  useEffect(() => {
    if (isScreenSharing && screenElemRef.current && screenStreamRef.current) {
      screenElemRef.current.srcObject = screenStreamRef.current
    }
  }, [isScreenSharing])

  return (
    <>
      {/* Floating Mini Video / Screen PIPs (top right corner of room) */}
      {(isCameraOn || isScreenSharing) && (
        <div className="play-voice-pips">
          {isCameraOn && (
            <div className="play-pip-bubble" title="Your Live Video Feed">
              <video
                ref={videoElemRef}
                autoPlay
                playsInline
                muted
                className="play-pip-video"
              />
              <span className="play-pip-label">You</span>
            </div>
          )}
          {isScreenSharing && (
            <div className="play-pip-bubble play-pip-bubble--screen" title="Screen Share Preview">
              <video
                ref={screenElemRef}
                autoPlay
                playsInline
                muted
                className="play-pip-video"
              />
              <span className="play-pip-label">🖥️ Screen Share</span>
            </div>
          )}
        </div>
      )}

      {/* Main Integrated Voice Bar (Docked at bottom of screen, clean & floating) */}
      <div className="play-voice-bar">
        {/* Left: Status & speaking indicator */}
        <div className="play-voice-bar__status">
          {isInVoice ? (
            <div className="play-voice-pill-active">
              <span className="play-voice-wave-dot" />
              <div className="play-voice-meter">
                <div
                  className="play-voice-meter-fill"
                  style={{ width: `${isMuted ? 0 : volumeLevel}%` }}
                />
              </div>
              <span className="play-voice-channel-name">Voice Huddle</span>
            </div>
          ) : (
            <button
              className="play-voice-btn-join"
              onClick={handleJoinVoice}
            >
              🎙️ Join Voice
            </button>
          )}
        </div>

        {/* Center: Real Voice Controls */}
        {isInVoice && (
          <div className="play-voice-bar__controls">
            {/* Mic Toggle */}
            <button
              className={`play-voice-control-btn ${isMuted ? 'play-voice-control-btn--off' : ''}`}
              onClick={toggleMute}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              <span className="play-voice-icon">{isMuted ? '🔇' : '🎙️'}</span>
              <span className="play-voice-btn-text">{isMuted ? 'Muted' : 'Mic On'}</span>
            </button>

            {/* Deafen Toggle */}
            <button
              className={`play-voice-control-btn ${isDeafened ? 'play-voice-control-btn--off' : ''}`}
              onClick={toggleDeafen}
              title={isDeafened ? 'Undeafen incoming audio' : 'Deafen (Mute room audio)'}
            >
              <span className="play-voice-icon">{isDeafened ? '🔈' : '🔊'}</span>
              <span className="play-voice-btn-text">{isDeafened ? 'Deafened' : 'Sound'}</span>
            </button>

            {/* Optional Camera Toggle */}
            <button
              className={`play-voice-control-btn ${isCameraOn ? 'play-voice-control-btn--active' : ''}`}
              onClick={toggleCamera}
              title={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
            >
              <span className="play-voice-icon">📹</span>
              <span className="play-voice-btn-text">{isCameraOn ? 'Cam On' : 'Camera'}</span>
            </button>

            {/* Optional Screen Share */}
            <button
              className={`play-voice-control-btn ${isScreenSharing ? 'play-voice-control-btn--active' : ''}`}
              onClick={toggleScreenShare}
              title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
            >
              <span className="play-voice-icon">🖥️</span>
              <span className="play-voice-btn-text">{isScreenSharing ? 'Sharing' : 'Share'}</span>
            </button>

            {/* Participants Roster Popover Trigger */}
            <button
              className={`play-voice-control-btn ${showRoster ? 'play-voice-control-btn--active' : ''}`}
              onClick={() => setShowRoster((prev) => !prev)}
              title="View voice participants"
            >
              <span className="play-voice-icon">👥</span>
              <span className="play-voice-btn-text">{players.length} in Call</span>
            </button>

            {/* Leave Voice */}
            <button
              className="play-voice-control-btn play-voice-control-btn--leave"
              onClick={handleLeaveVoice}
              title="Disconnect from voice chat"
            >
              <span className="play-voice-icon">📞</span>
              <span className="play-voice-btn-text">Leave</span>
            </button>
          </div>
        )}

        {/* Right: Participant Avatars Peek */}
        <div className="play-voice-bar__avatars">
          {players.slice(0, 4).map((p) => {
            const speaking = p.id === currentUser.id ? volumeLevel > 15 && !isMuted : p.isSpeaking
            return (
              <div
                key={p.id}
                className={`play-voice-mini-avatar ${speaking ? 'play-voice-mini-avatar--speaking' : ''}`}
                style={{ backgroundColor: p.color }}
                title={`${p.name} (${speaking ? 'Speaking' : 'Connected'})`}
              >
                {p.avatar}
              </div>
            )
          })}
        </div>

        {/* Participants Roster Flyout */}
        {showRoster && isInVoice && (
          <div className="play-voice-roster">
            <div className="play-voice-roster__header">
              <span>VOICE PARTICIPANTS ({players.length})</span>
              <button
                className="play-voice-roster__close"
                onClick={() => setShowRoster(false)}
              >
                ✕
              </button>
            </div>
            <div className="play-voice-roster__list">
              {players.map((p) => {
                const speaking = p.id === currentUser.id ? volumeLevel > 15 && !isMuted : p.isSpeaking
                return (
                  <div key={p.id} className="play-voice-roster__item">
                    <div
                      className={`play-voice-roster__avatar ${speaking ? 'play-voice-roster__avatar--speaking' : ''}`}
                      style={{ backgroundColor: p.color }}
                    >
                      {p.avatar}
                    </div>
                    <div className="play-voice-roster__info">
                      <span className="play-voice-roster__name">{p.name}</span>
                      <span className="play-voice-roster__state">
                        {p.id === currentUser.id && isMuted
                          ? 'Muted'
                          : speaking
                          ? 'Speaking...'
                          : 'Connected'}
                      </span>
                    </div>
                    <div className="play-voice-roster__icons">
                      {p.id === currentUser.id && isMuted ? '🔇' : speaking ? '🟢' : '🎙️'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
