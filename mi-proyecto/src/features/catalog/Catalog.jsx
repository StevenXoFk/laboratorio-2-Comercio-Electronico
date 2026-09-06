import { useState } from 'react'
import { Hits, Stats, useInstantSearch } from 'react-instantsearch'
import Filters from './Filters'
import ProductCard from './ProductCard'
import Pagination from './Pagination'
import EmptyState from './EmptyState'
import '../../styles/Catalog.css'

function Catalog() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const { results } = useInstantSearch()
  const hasHits = Boolean(results?.nbHits)

  return (
    <div className="catalog">
      <Stats
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