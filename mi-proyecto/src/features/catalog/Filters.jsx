import { RefinementList, RangeInput, ClearRefinements } from 'react-instantsearch'
import '../../styles/Filters.css'

function Filters({ isOpen, onToggle }) {
  return (
    <div className={`catalog-filters-wrap ${isOpen ? '' : 'is-collapsed'}`}>
      <button
        type="button"
        className="filters-toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        title={isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
      >
        {isOpen ? '‹' : '›'}
      </button>

      <aside className="catalog-filters">
        <div className="catalog-filters__header">
          <h2>Filtros</h2>
          <ClearRefinements translations={{ resetButtonText: 'Limpiar filtros' }} />
        </div>

        <div className="filter-group">
          <h3>Categoría</h3>
          <RefinementList
            attribute="category_facet"
            searchable={false}
            showMore={true}
            showMoreLimit={20}
          />
        </div>

        <div className="filter-group">
          <h3>Marca</h3>
          <RefinementList
            attribute="brand_facet"
            searchable={true}
            translations={{ placeholderText: 'Buscar marca...' }}
            showMore={true}
            showMoreLimit={20}
          />
        </div>

        <div className="filter-group">
          <h3>Precio (₡)</h3>
          <RangeInput
            attribute="pricing.b2c.price_crc"
            translations={{ 
              separatorElementText: '—', 
              submitButtonText: 'Aplicar'
            }}
          />
        </div>
      </aside>
    </div>
  )
}

export default Filters