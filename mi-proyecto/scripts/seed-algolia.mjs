import { algoliasearch } from 'algoliasearch'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import 'dotenv/config'

const appId = process.env.ALGOLIA_APP_ID
const adminKey = process.env.ALGOLIA_ADMIN_KEY

if (!appId || !adminKey) {
  console.error('Faltan las variables ALGOLIA_APP_ID o ALGOLIA_ADMIN_KEY en tu .env')
  process.exit(1)
}

const client = algoliasearch(appId, adminKey)

const dataDir = './data'
const files = readdirSync(dataDir).filter(f => f.endsWith('.json'))

let products = []

for (const file of files) {
  const categoria = file.replace('.json', '')
  const content = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'))
  const withCategory = content.map(p => ({ ...p, categoria }))
  products = products.concat(withCategory)
}

async function configureSettings() {
  await client.setSettings({
    indexName: 'grupo-07_products',
    indexSettings: {
      searchableAttributes: [
        'title',
        'brand',
        'category_facet',
        'description'
      ],
      attributesForFaceting: [
        'category_facet',
        'brand_facet',
        'pricing.b2c.price_crc'
      ]
    }
  })
  console.log('Configuración de facets y searchable attributes aplicada.')
}

async function seed() {
  const { taskID } = await client.saveObjects({
    indexName: 'grupo-07_products',
    objects: products,
  })

  console.log(`Indexación completa. Task ID: ${taskID}`)
  console.log(`${products.length} productos enviados a Algolia.`)

  await configureSettings()
}

seed().catch((err) => {
  console.error('Error al indexar:', err)
  process.exit(1)
})