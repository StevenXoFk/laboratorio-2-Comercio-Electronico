import { useInstantSearch } from 'react-instantsearch'

function NoResults() {
  const { results } = useInstantSearch()

  if (!results || results.nbHits !== 0) {
    return null
  }

  return (
    <div className="catalog-empty" role="status">
      <span className="catalog-empty__icon" aria-hidden="true">🔍</span>
      <h3 className="catalog-empty__title">No encontramos productos</h3>
      <p className="catalog-empty__text">
        No hay resultados para <strong>&ldquo;{results.query}&rdquo;</strong> con los filtros
        actuales. Probá con otro término de búsqueda o quitá algunos filtros.
      </p>
    </div>
  )
}

export default NoResults
