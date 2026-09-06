import { useSearchParams } from 'react-router-dom'
import { InstantSearch } from 'react-instantsearch'
import { searchClient } from '../features/catalog/searchClient'
import SearchHeader from '../features/catalog/SearchHeader'
import Catalog from '../features/catalog/Catalog'

function Productos() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('categoria')

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="grupo-07_products"
      initialUiState={{
        'grupo-07_products': {
          query: initialQuery,
          ...(initialCategory ? { refinementList: { category_facet: [initialCategory] } } : {}),
        },
      }}
    >
      <SearchHeader />
      <Catalog />
    </InstantSearch>
  )
}

export default Productos