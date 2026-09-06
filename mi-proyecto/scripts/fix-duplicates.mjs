import { readFileSync, writeFileSync } from 'node:fs'

const path = 'data/products.json'
const data = JSON.parse(readFileSync(path, 'utf8'))

const groups = new Map()
for (const item of data) {
  const baseTitle = String(item.title || '').trim()
  if (!groups.has(baseTitle)) groups.set(baseTitle, [])
  groups.get(baseTitle).push(item)
}

const toSlug = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getYear = (item) => {
  const y = Number(item?.facets?.year)
  if (Number.isFinite(y) && y >= 1900 && y <= 2100) return y

  const fromDescription = String(item.description || '').match(/Year:\s*(\d{4})/i)
  if (fromDescription) return Number(fromDescription[1])

  const legacyRange = String(item?.facets?.año_produccion_rango || '').match(/(19|20)\d{2}/)
  if (legacyRange) return Number(legacyRange[0])

  return 2020
}

for (const [baseTitle, records] of groups.entries()) {
  if (records.length <= 1) continue

  const yearCounter = new Map()
  records.sort((a, b) => getYear(a) - getYear(b))

  for (const item of records) {
    const year = getYear(item)
    item.facets = item.facets && typeof item.facets === 'object' ? item.facets : {}
    item.facets.year = year

    const countForYear = (yearCounter.get(year) || 0) + 1
    yearCounter.set(year, countForYear)

    item.title = countForYear > 1 ? `${baseTitle} ${year} v${countForYear}` : `${baseTitle} ${year}`

    const baseUrl = String(item.image_url || '').split('?')[0]
    const variant = `${toSlug(baseTitle)}-${year}-${countForYear}-${item.objectID}`
    item.image_url = `${baseUrl}?imgVariant=${encodeURIComponent(variant)}`

    item.description = String(item.description || '').replace(/Year:\s*\d{1,4}/i, `Year: ${year}`)
  }
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
console.log('done')
