import { useTheme } from '../context/ThemeContext'
import '../styles/ThemeToggle.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
      <span className={`theme-toggle__inner ${theme === 'dark' ? 'is-flipped' : ''}`}>
        <span className="theme-toggle__face theme-toggle__face--front">☀️</span>
        <span className="theme-toggle__face theme-toggle__face--back">🌙</span>
      </span>
    </button>
  )
}

export default ThemeToggle