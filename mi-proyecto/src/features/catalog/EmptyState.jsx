import { useClearRefinements, useInstantSearch } from 'react-instantsearch'
import '../../styles/Catalog.css'

function EmptyState() {
  const { indexUiState } = useInstantSearch()
  const { refine, canRefine } = useClearRefinements()
  const query = indexUiState.query

  return (
    <div className="catalog-empty" role="status">
      <svg
        className="catalog-empty__icon"
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8.5" y1="8.5" x2="13.5" y2="13.5" />
        <line x1="13.5" y1="8.5" x2="8.5" y2="13.5" />
      </svg>

      <h3 className="catalog-empty__title">No encontramos productos con esos filtros</h3>

      <p className="catalog-empty__text">
        {query ? (
          <>
            No hay resultados para <strong>&ldquo;{query}&rdquo;</strong> con la combinación
            de filtros actual.
          </>
        ) : (
          'Prueba quitando algún filtro o ajustando el rango de precio.'
        )}
      </p>

      {canRefine && (
        <button type="button" className="catalog-empty__button" onClick={() => refine()}>
          Limpiar filtros
        </button>
      )}
    </div>
  )
}

export default EmptyState
