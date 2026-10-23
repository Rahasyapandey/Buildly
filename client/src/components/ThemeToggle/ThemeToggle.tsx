import { useTheme } from '../../context/useTheme'
import { IconMoon, IconSun } from '../Icons/Icons'
import './ThemeToggle.css'

interface ThemeToggleProps {
  variant?: 'pill' | 'icon'
  className?: string
}

export default function ThemeToggle({
  variant = 'icon',
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className={`theme-toggle-btn ${
        variant === 'icon' ? 'theme-toggle-btn--icon' : ''
      } ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Night / Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Night / Dark Mode'}
    >
      <span className="theme-toggle-icon">
        {isDark ? <IconSun size={15} /> : <IconMoon size={15} />}
      </span>
      {variant === 'pill' && (
        <span>{isDark ? 'Light' : 'Night'}</span>
      )}
    </button>
  )
}
