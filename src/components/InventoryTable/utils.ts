import type { InventoryItem, StockStatus, StockStatusMeta } from './types'

const STATUS_MAP: Record<StockStatus, Omit<StockStatusMeta, 'status'>> = {
  in_stock: { label: '充足', type: 'success' },
  low_stock: { label: '偏低', type: 'warning' },
  out_of_stock: { label: '缺货', type: 'danger' },
}

/** Resolve stock status from quantity + threshold */
export function resolveStockStatus(
  item: InventoryItem,
  defaultThreshold = 10,
): StockStatusMeta {
  const threshold = item.lowStockThreshold ?? defaultThreshold
  let status: StockStatus

  if (item.quantity <= 0) {
    status = 'out_of_stock'
  } else if (item.quantity <= threshold) {
    status = 'low_stock'
  } else {
    status = 'in_stock'
  }

  return { status, ...STATUS_MAP[status] }
}

/** Format ISO / date string for display */
export function formatDateTime(value?: string): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Format money with currency symbol */
export function formatMoney(value?: number, currency = '¥'): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '-'
  return `${currency}${value.toFixed(2)}`
}
