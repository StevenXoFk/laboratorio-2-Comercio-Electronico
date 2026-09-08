import { useState } from 'react'
import { Hits, Stats, useInstantSearch } from 'react-instantsearch'
import Filters from './Filters'
import ProductCard from './ProductCard'
import Pagination from './Pagination'
import EmptyState from './EmptyState'
import '../../styles/Catalog.css'

// En <=768px el panel de filtros se apila sobre la grilla y mide ~1065px, asi
// que abierto por defecto dejaba el primer producto a 1340px de scroll. En
// escritorio el sidebar no compite por espacio y sigue abierto.
const filtrosAbiertosPorDefecto = () =>
  typeof window === 'undefined' || window.matchMedia('(min-width: 769px)').matches

function Catalog() {
  const [filtersOpen, setFiltersOpen] = useState(filtrosAbiertosPorDefecto)
  const { results } = useInstantSearch()
  const hasHits = Boolean(results?.nbHits)

  return (
    <div className="catalog">
      <Stats
        classNames={{ root: 'catalog-stats' }}
        translations={{
          rootElementText({ nbHits }) {
            return `${nbHits.toLocaleString()} productos encontrados`
          },
        }}
      />

      <div className="catalog__body">
        <Filters isOpen={filtersOpen} onToggle={() => setFiltersOpen((o) => !o)} />

        <div className="catalog__results">
          {hasHits ? (
            <>
              <Hits hitComponent={ProductCard} classNames={{ list: 'catalog__grid' }} />
              <Pagination />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

export default Catalog