import { Link, useNavigate } from 'react-router-dom'
import { SearchBox } from 'react-instantsearch'
import ThemeToggle from '../../components/ThemeToggle'
import '../../styles/SearchHeader.css'

function SearchHeader({ redirectSearchTo }) {
  const navigate = useNavigate()

  const redirectProps = redirectSearchTo
    ? {
        searchAsYouType: false,
        queryHook: (query, search) => {
          const trimmed = query.trim()
          if (trimmed) {
            navigate(`${redirectSearchTo}?q=${encodeURIComponent(trimmed)}`)
          } else {
            search(query)
          }
        },
      }
    : {}

  return (
    <header className="search-header">
      <Link to="/" className="site-header__logo">
        ⚙️ Maquinaria CR
      </Link>

      <nav className="site-header__nav">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
      </nav>

      <div className="search-wrapper">
        <SearchBox
          placeholder="Buscar productos..."
          translations={{ submitButtonTitle: 'Buscar', resetButtonTitle: 'Limpiar' }}
          classNames={{ root: 'search-header__box' }}
          {...redirectProps}
        />
      </div>

      <ThemeToggle />
    </header>
  )
}

export default SearchHeader