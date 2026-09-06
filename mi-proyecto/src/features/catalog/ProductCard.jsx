import { Link } from 'react-router-dom'
import { formatCRC } from './format'
import '../../styles/ProductCard.css'

function ProductCard({ hit }) {
  const price = hit?.pricing?.b2c?.price_crc
  const inStock = hit?.pricing?.b2c?.in_stock

  return (
    <Link to={`/producto/${hit.objectID}`} className="product-card">
      <div className="product-card__image">
        <img
          src={hit.image_url}
          alt={hit.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/icons.svg'
          }}
        />
      </div>

      <div className="product-card__info">
        <span className="product-card__category">{hit.category_facet}</span>
        <h3 className="product-card__title">{hit.title}</h3>
        <p className="product-card__brand">{hit.brand}</p>

        <div className="product-card__footer">
          <span className="product-card__price">{formatCRC(price)}</span>
          <span className={`product-card__stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            {inStock ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard