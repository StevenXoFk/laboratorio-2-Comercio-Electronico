import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TARGET_COUNT = 500
const SOURCE_PATH = resolve('data/products.json')

const PRICE_BUCKETS = [
  { max: 25000000, label: '0-25M' },
  { max: 50000000, label: '25M-50M' },
  { max: 75000000, label: '50M-75M' },
  { max: 100000000, label: '75M-100M' },
  { max: 150000000, label: '100M-150M' },
  { max: 200000000, label: '150M-200M' },
  { max: Infinity, label: '200M+' },
]

const FACET_KEY_MAP = {
  condicion: 'condition',
  año: 'year',
  peso_kg: 'weight_kg',
  potencia_hp: 'power_hp',
  alcance_excavacion_m: 'digging_reach_m',
  capacidad_carga_kg: 'load_capacity_kg',
  capacidad_carga_ton: 'load_capacity_ton',
  capacidad_cucharon_m3: 'bucket_capacity_m3',
  ancho_tambor_m: 'drum_width_m',
  capacidad_maxima_ton: 'max_capacity_ton',
  hoja_tipo: 'blade_type',
  ancho_hoja_m: 'blade_width_m',
  motor_modelo: 'engine_model',
  capacidad_combustible_litros: 'fuel_capacity_liters',
}

function parseProducts() {
  const raw = readFileSync(SOURCE_PATH, 'utf-8')
  return JSON.parse(raw)
}

function deepStripSearchMetadata(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      deepStripSearchMetadata(item)
    }
    return
  }

  if (!value || typeof value !== 'object') {
    return
  }

  delete value._snippetResult
  delete value._highlightResult
  delete value._rankingInfo

  for (const key of Object.keys(value)) {
    deepStripSearchMetadata(value[key])
  }
}

function sanitizeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function roundCrc(value) {
  return Math.round(sanitizeNumber(value, 0))
}

function getPriceRangeCrc(price) {
  const safePrice = sanitizeNumber(price, 0)
  const bucket = PRICE_BUCKETS.find((item) => safePrice <= item.max)
  return bucket ? bucket.label : '200M+'
}

function getPrimaryCategory(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return 'Sin Categoría'
  }

  return categories[categories.length - 1]
}

function normalizeLocations(item) {
  const sourceLocations = Array.isArray(item.locations) ? item.locations : []
  if (sourceLocations.length === 0) {
    return [
      { site: 'Cartago Centro', stock_quantity: 0 },
      { site: 'San José', stock_quantity: 0 },
      { site: 'Alajuela', stock_quantity: 0 },
    ]
  }

  return sourceLocations.map((location) => ({
    site: location.site || 'Sin sede',
    stock_quantity: Math.max(0, Math.round(sanitizeNumber(location.stock_quantity, 0))),
  }))
}

function normalizeFacets(item) {
  const sourceFacets = item?.facets && typeof item.facets === 'object' ? item.facets : {}
  const normalizedFacets = {}

  for (const [key, value] of Object.entries(sourceFacets)) {
    const normalizedKey = FACET_KEY_MAP[key] || key
    normalizedFacets[normalizedKey] = value
  }

  item.facets = normalizedFacets
}

function normalizeProduct(item) {
  deepStripSearchMetadata(item)
  normalizeFacets(item)

  item.categories = Array.isArray(item.categories) ? item.categories : []
  item.locations = normalizeLocations(item)

  const b2cPrice = roundCrc(item?.pricing?.b2c?.price_crc)
  const b2bPriceFromSource = roundCrc(item?.pricing?.b2b?.price_crc)
  const finalB2cPrice = b2cPrice > 0 ? b2cPrice : 10000000
  const finalB2bPrice = b2bPriceFromSource > 0 ? b2bPriceFromSource : Math.round(finalB2cPrice * 0.92)

  item.pricing = {
    b2c: {
      price_crc: finalB2cPrice,
      in_stock: item.locations.some((location) => location.stock_quantity > 0),
    },
    b2b: {
      price_crc: finalB2bPrice,
      min_order_quantity: Math.max(1, Math.round(sanitizeNumber(item?.pricing?.b2b?.min_order_quantity, 1))),
      volume_discounts: Array.isArray(item?.pricing?.b2b?.volume_discounts)
        ? item.pricing.b2b.volume_discounts
            .map((entry) => ({
              min_units: Math.max(2, Math.round(sanitizeNumber(entry.min_units, 2))),
              discount_pct: Math.max(0, Number(sanitizeNumber(entry.discount_pct, 0).toFixed(3))),
            }))
            .sort((a, b) => a.min_units - b.min_units)
        : [
            { min_units: 2, discount_pct: 0.04 },
            { min_units: 5, discount_pct: 0.08 },
          ],
    },
  }

  const primaryCategory = getPrimaryCategory(item.categories)
  const priceRange = getPriceRangeCrc(finalB2cPrice)

  item.facets = {
    ...item.facets,
    brand: item.brand || 'Sin Marca',
    category: primaryCategory,
    price_range_crc: priceRange,
  }

  item.price_range_crc = priceRange
  item.category_facet = primaryCategory
  item.brand_facet = item.brand || 'Sin Marca'

  return item
}

function nextObjectId(existingIds, startAt) {
  let current = startAt
  while (existingIds.has(`MQ${String(current).padStart(3, '0')}`)) {
    current += 1
  }

  return current
}

function cloneProduct(seed, ordinal, objectIdValue) {
  const clone = JSON.parse(JSON.stringify(seed))
  const objectId = `MQ${String(objectIdValue).padStart(3, '0')}`

  clone.objectID = objectId

  const baseYear = sanitizeNumber(clone?.facets?.year, 2020)
  const yearOffset = ordinal % 5
  if (clone.facets && typeof clone.facets === 'object') {
    clone.facets.year = Math.max(2017, Math.min(2025, baseYear - 2 + yearOffset))
  }

  const factor = 0.9 + ((ordinal % 21) * 0.01)
  const b2c = roundCrc(clone.pricing.b2c.price_crc * factor)
  const b2b = roundCrc(clone.pricing.b2b.price_crc * (factor - 0.03))

  clone.pricing.b2c.price_crc = Math.max(10000000, b2c)
  clone.pricing.b2b.price_crc = Math.max(9000000, b2b)

  const locationBoost = ordinal % 4
  clone.locations = clone.locations.map((location, index) => ({
    ...location,
    stock_quantity: Math.max(0, Math.round(sanitizeNumber(location.stock_quantity, 0) + ((index + locationBoost) % 3) - 1)),
  }))

  clone.pricing.b2c.in_stock = clone.locations.some((location) => location.stock_quantity > 0)

  const priceRange = getPriceRangeCrc(clone.pricing.b2c.price_crc)
  clone.price_range_crc = priceRange
  clone.facets.price_range_crc = priceRange

  return normalizeProduct(clone)
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function appendVariantParam(url, variantId) {
  const separator = String(url).includes('?') ? '&' : '?'
  return `${url}${separator}variant=${encodeURIComponent(variantId)}`
}

function buildUniqueDescription(product, occurrenceIndex) {
  const base = String(product.description || '').trim().replace(/\s+/g, ' ').replace(/[.\s]*$/, '')
  const condition = String(product?.facets?.condition || 'N/A')
  const year = sanitizeNumber(product?.facets?.year, 0)
  return `${base}. Model: ${product.title}. Variant: ${occurrenceIndex + 1}. Condition: ${condition}. Year: ${year}.`
}

function enforceUniquenessByModel(products) {
  const modelCounter = new Map()

  for (const product of products) {
    const modelKey = String(product.title || '').trim().toLowerCase()
    const occurrenceIndex = modelCounter.get(modelKey) || 0
    modelCounter.set(modelKey, occurrenceIndex + 1)

    const variantId = `${slugify(product.title)}-${product.objectID}-${occurrenceIndex + 1}`
    product.image_url = appendVariantParam(product.image_url, variantId)
    product.description = buildUniqueDescription(product, occurrenceIndex)
  }
}

function main() {
  const products = parseProducts().map((item) => normalizeProduct(item))

  if (products.length > TARGET_COUNT) {
    throw new Error(`El archivo ya tiene ${products.length} productos y supera el objetivo de ${TARGET_COUNT}.`)
  }

  const existingIds = new Set(products.map((item) => item.objectID))

  const seeds = products.map((item) => JSON.parse(JSON.stringify(item)))
  let nextNumericId = 1

  for (const id of existingIds) {
    const digits = Number(String(id).replace(/\D/g, ''))
    if (Number.isFinite(digits)) {
      nextNumericId = Math.max(nextNumericId, digits + 1)
    }
  }

  let ordinal = 0
  while (products.length < TARGET_COUNT) {
    const seed = seeds[ordinal % seeds.length]
    const availableNumericId = nextObjectId(existingIds, nextNumericId)
    nextNumericId = availableNumericId + 1

    const candidate = cloneProduct(seed, ordinal, availableNumericId)
    existingIds.add(candidate.objectID)
    products.push(candidate)
    ordinal += 1
  }

  enforceUniquenessByModel(products)

  writeFileSync(SOURCE_PATH, `${JSON.stringify(products, null, 2)}\n`)

  console.log(`products.json actualizado con ${products.length} productos.`)
  console.log('Normalizaciones aplicadas: CRC-only, eliminación de metadata de búsqueda, facetas de precio/categoría/marca.')
}

main()
