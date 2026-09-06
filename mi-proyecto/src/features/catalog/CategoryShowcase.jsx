import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchClient } from './searchClient'
import { formatCRC } from './format'
import '../../styles/CategoryShowcase.css'

const INDEX_NAME = 'grupo-07_products'
const BLOCK_CATEGORY_LIMIT = 12 
const BLOCK_ITEMS = 4           
const COLUMNS_PER_ROW = 4
const ROTATE_INTERVAL_MS = 5000

function chunk(array, size) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

function useCategoryShowcase() {
  const [state, setState] = useState({ status: 'loading', blocks: [] })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const facetResponse = await searchClient.search([
          {
            indexName: INDEX_NAME,
            params: { query: '', hitsPerPage: 0, facets: ['category_facet'] },
          },
        ])

        const facetCounts = facetResponse.results?.[0]?.facets?.category_facet || {}
        const sortedNames = Object.keys(facetCounts).sort((a, b) => facetCounts[b] - facetCounts[a])
        const blockNames = sortedNames.slice(0, BLOCK_CATEGORY_LIMIT)

        if (blockNames.length === 0) {
          if (!cancelled) setState({ status: 'empty', blocks: [] })
          return
        }

        const requests = blockNames.map((name) => ({
          indexName: INDEX_NAME,
          params: {
            query: '',
            filters: `category_facet:"${name}"`,
            hitsPerPage: BLOCK_ITEMS,
          },
        }))

        const response = await searchClient.search(requests)
        const results = response.results || []

        const blocks = blockNames.map((name, index) => ({
          name,
          count: facetCounts[name],
          hits: results[index]?.hits || [],
        }))

        if (!cancelled) setState({ status: 'ready', blocks })
      } catch {
        if (!cancelled) setState({ status: 'error', blocks: [] })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

function BlockColumn({ category }) {
  const hits = category.hits
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (hits.length <= 1) return undefined

    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % hits.length)
    }, ROTATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [hits.length])

  const activeHit = hits[activeIndex]
  if (!activeHit) return null

  const price = activeHit.pricing?.b2c?.price_crc

  return (
    <div className="showcase-column">
      <div className="showcase-column__header">
        <h3>{category.name}</h3>
        <Link
          to={`/productos?categoria=${encodeURIComponent(category.name)}`}
          aria-label={`Ver todo: ${category.name}`}
        >
          ›
        </Link>
      </div>

      <Link to={`/producto/${activeHit.objectID}`} className="showcase-rotator">
        <div className="showcase-rotator__stage">
          {hits.map((hit, index) => (
            <img
              key={hit.objectID}
              src={hit.image_url}
              alt={hit.title}
              loading="lazy"
              className={`showcase-rotator__image${index === activeIndex ? ' is-active' : ''}`}
              onError={(e) => {
                e.currentTarget.src = '/icons.svg'
              }}
            />
          ))}

          {hits.length > 1 && (
            <div className="showcase-rotator__dots">
              {hits.map((hit, index) => (
                <span
                  key={hit.objectID}
                  className={`showcase-rotator__dot${index === activeIndex ? ' is-active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <p className="showcase-rotator__name">{activeHit.title}</p>
        <p className="showcase-rotator__price">{formatCRC(price)}</p>
      </Link>
    </div>
  )
}

function CategoryShowcase() {
  const { status, blocks } = useCategoryShowcase()

  if (status === 'loading') {
    return <p className="category-showcase__message">Cargando categorías...</p>
  }

  if (status === 'error' || status === 'empty') {
    return null
  }

  const rows = chunk(blocks, COLUMNS_PER_ROW)

  return (
    <section className="category-blocks">
      <h2>Explorá por categoría</h2>
      {rows.map((row, index) => (
        <div className="category-blocks__row" key={index}>
          {row.map((category) => (
            <BlockColumn key={category.name} category={category} />
          ))}
        </div>
      ))}
    </section>
  )
}

export default CategoryShowcase