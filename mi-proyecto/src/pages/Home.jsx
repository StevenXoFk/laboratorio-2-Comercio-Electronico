import { InstantSearch } from 'react-instantsearch'
import { searchClient } from '../features/catalog/searchClient'
import SearchHeader from '../features/catalog/SearchHeader'
import CategoryShowcase from '../features/catalog/CategoryShowcase'
import Footer from '../components/Footer'
import '../styles/Home.css'

const VALUE_PROPS = [
  {
    title: 'Stock en tiempo real',
    text: 'Disponibilidad actualizada por sede, sin sorpresas al momento de comprar.',
  },
  {
    title: 'Precios B2C y mayoristas',
    text: 'Precio al público y tarifas por volumen para compras B2B, con descuentos.',
  },
  {
    title: 'Cotización directa',
    text: 'Solicitá una cotización de cualquier producto en un clic, sin formularios largos.',
  },
  {
    title: 'Envíos a todo el país',
    text: 'Coordinación logística rápida y segura hasta tu obra o taller.',
  },
]

function Home() {
  return (
    <InstantSearch searchClient={searchClient} indexName="grupo-07_products">
      <SearchHeader redirectSearchTo="/productos" />

      <section className="home-hero">
        <h1>Encontrá la maquinaria y repuestos que tu proyecto necesita</h1>
        <p>Stock actualizado en tiempo real, precios transparentes y cotización en un clic.</p>
      </section>

      <CategoryShowcase />

          <section className="home-value-props">
            <div className="value-props">
              {VALUE_PROPS.map((prop) => (
                <div key={prop.title} className="value-prop">
                  <h3>{prop.title}</h3>
                  <p>{prop.text}</p>
                </div>
              ))}
            </div>
          </section>
          
      <Footer />
    </InstantSearch>
  )
}

export default Home