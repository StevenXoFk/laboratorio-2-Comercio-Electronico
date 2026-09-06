import { useParams } from 'react-router-dom'
import { InstantSearch } from 'react-instantsearch'
import { searchClient } from '../features/catalog/searchClient'
import SearchHeader from '../features/catalog/SearchHeader'
import ProductDetail from '../features/catalog/ProductDetail'

function ProductoDetalle() {
  const { id } = useParams()

  return (
    <InstantSearch searchClient={searchClient} indexName="grupo-07_products">
      <SearchHeader redirectSearchTo="/productos" />
      <ProductDetail id={id} />
    </InstantSearch>
  )
}

export default ProductoDetalle
