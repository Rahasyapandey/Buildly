import { useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '../../types/play'
import './PlayChat.css'

interface PlayChatProps {
  messages: ChatMessage[]
  isDrawer: boolean
  hasGuessed: boolean
  onSendMessage: (text: string) => void
}

export default function PlayChat({
  messages,
  isDrawer,
  hasGuessed,
  onSendMessage,
}: PlayChatProps) {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText.trim())
    setInputText('')
  }

  const inputPlaceholder = isDrawer
    ? 'You are drawing! (Guesses disabled)'
    : hasGuessed
    ? 'You guessed correctly! Chat with teammates...'
    : 'Type your guess here...'

  return (
    <div className="play-chat-panel">
      {/* Chat Header */}
      <div className="play-chat-header">
        <div className="play-chat-header__title">
          <span>💬</span>
          <span>GUESSING CHAT</span>
        </div>
        <span className="play-chat-header__badge">LIVE</span>
      </div>

      {/* Messages Stream */}
      <div className="play-chat-stream">
        {messages.map((msg) => {
          if (msg.type === 'correct') {
            return (
              <div key={msg.id} className="play-chat-msg play-chat-msg--correct">
                <span className="play-chat-msg__icon">🎉</span>
                <div className="play-chat-msg__content">
                  <span className="play-chat-msg__player">{msg.playerName}</span>
                  <span> guessed the word!</span>
                  {msg.points && (
                    <span className="play-chat-msg__points"> +{msg.points} pts</span>
                  )}
                </div>
              </div>
            )
          }

          if (msg.type === 'close') {
            return (
              <div key={msg.id} className="play-chat-msg play-chat-msg--close">
                <span className="play-chat-msg__icon">💡</span>
                <span className="play-chat-msg__text">{msg.text}</span>
              </div>
            )
          }

          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="play-chat-msg play-chat-msg--system">
                <span className="play-chat-msg__text">{msg.text}</span>
              </div>
            )
          }

          return (
            <div key={msg.id} className="play-chat-msg play-chat-msg--normal">
              <span
                className="play-chat-msg__author"
                style={{ color: msg.playerColor || '#2563eb' }}
              >
                {msg.playerName}:
              </span>
              <span className="play-chat-msg__text">{msg.text}</span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form className="play-chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="play-chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={inputPlaceholder}
          disabled={isDrawer}
          maxLength={60}
          autoComplete="off"
        />
        <button
          type="submit"
          className="play-chat-send-btn"
          disabled={isDrawer || !inputText.trim()}
          title="Send guess"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
