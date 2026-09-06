const crcFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

export function formatCRC(value) {
  return typeof value === 'number' ? crcFormatter.format(value) : 'Precio no disponible'
}

export function formatCRCParts(value) {
  if (typeof value !== 'number') return null

  const symbol = crcFormatter.formatToParts(value).find((part) => part.type === 'currency')?.value ?? '₡'
  const amount = crcFormatter
    .formatToParts(value)
    .filter((part) => part.type !== 'currency' && part.type !== 'literal')
    .map((part) => part.value)
    .join('')

  return { symbol, amount }
}

export function formatPercent(value) {
  return typeof value === 'number' ? `${Math.round(value * 100)}%` : ''
}
