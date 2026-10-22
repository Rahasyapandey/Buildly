import { useState, useEffect } from 'react'
import type { WordChoice } from '../../types/play'
import './PlayWordSelector.css'

interface PlayWordSelectorProps {
  choices: WordChoice[]
  onSelectWord: (choice: WordChoice) => void
}

export default function PlayWordSelector({
  choices,
  onSelectWord,
}: PlayWordSelectorProps) {
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-pick the first word
      if (choices.length > 0) {
        onSelectWord(choices[0])
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, choices, onSelectWord])

  return (
    <div className="play-word-modal-backdrop">
      <div className="play-word-modal">
        <div className="play-word-modal__header">
          <div className="play-word-modal__timer-pill">
            <span>⏱️</span>
            <span>{timeLeft}s to choose</span>
          </div>
          <h2 className="play-word-modal__title">It's Your Turn to Draw!</h2>
          <p className="play-word-modal__subtitle">
            Choose a secret word. Harder words reward you and guessers with more points!
          </p>
        </div>

        <div className="play-word-cards-grid">
          {choices.map((choice) => {
            const diffClass =
              choice.difficulty === 'Easy'
                ? 'play-word-card--easy'
                : choice.difficulty === 'Medium'
                ? 'play-word-card--medium'
                : 'play-word-card--hard'

            return (
              <button
                key={choice.word}
                className={`play-word-card ${diffClass}`}
                onClick={() => onSelectWord(choice)}
              >
                <div className="play-word-card__top">
                  <span className="play-word-difficulty">{choice.difficulty}</span>
                  <span className="play-word-points">+{choice.points} pts</span>
                </div>
                <div className="play-word-card__name">{choice.word}</div>
                <div className="play-word-card__hint">"{choice.hint}"</div>
                <div className="play-word-card__action">Draw this →</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
