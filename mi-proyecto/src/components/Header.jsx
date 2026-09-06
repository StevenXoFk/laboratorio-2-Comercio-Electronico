import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__logo">
        Maquinaria CR
      </Link>

      <nav className="site-header__nav">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
      </nav>
    </header>
  )
}

export default Header