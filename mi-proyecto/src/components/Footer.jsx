import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__col">
          <h2 className="site-footer__brand">
            Maquinaria <span className="highlight">CR</span>
          </h2>
          <p className="site-footer__about">
            Soluciones integrales en repuestos y maquinaria pesada. Calidad, respaldo y garantía para optimizar tus proyectos.
          </p>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__title">Navegación</h3>
          <ul className="site-footer__links">
            <li><Link to="/">› Inicio</Link></li>
            <li><Link to="/productos">› Productos</Link></li>
            <li><Link to="/nosotros">› Nosotros</Link></li>
            <li><Link to="/contacto">› Contacto</Link></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__title">Categorías</h3>
          <ul className="site-footer__links">
            <li><Link to="/productos?cat=excavadora">Excavadoras</Link></li>
            <li><Link to="/productos?cat=bulldozer">Bulldozer</Link></li>
            <li><Link to="/productos?cat=cargador">Cargador de Ruedas</Link></li>
            <li><Link to="/productos?cat=mezcladora">Mezcladora de Concreto</Link></li>
          </ul>
        </div>


        <div className="site-footer__col">
          <h3 className="site-footer__title">Contacto</h3>
          <ul className="site-footer__contact">
            <li> <span>San José, Costa Rica</span></li>
            <li> <span>+506 8000-0000</span></li>
            <li> <span>info@maquinariacr.com</span></li>
            <li> <span>Lun - Vie: 7:30 AM - 5:00 PM</span></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__bottom-container">
          <p>&copy; {new Date().getFullYear()} Maquinaria CR. Todos los derechos reservados.</p>
          <div className="site-footer__legal">
            <Link to="/privacidad">Política de Privacidad</Link>
            <Link to="/terminos">Términos del Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer