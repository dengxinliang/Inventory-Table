import type { InventoryItem, InventoryPagination, InventoryQuery, StockStatus } from './types'

export const inventoryTableEmits = {
  /** Fired when selection changes */
  'selection-change': (rows: InventoryItem[]) => Array.isArray(rows),
  /** Fired when search / filter is applied */
  search: (query: InventoryQuery) => !!query && typeof query === 'object',
  /** Fired when pagination changes */
  'page-change': (pagination: InventoryPagination) =>
    !!pagination && typeof pagination.page === 'number',
  /** View detail */
  view: (row: InventoryItem) => !!row,
  /** Edit row */
  edit: (row: InventoryItem) => !!row,
  /** Delete row */
  delete: (row: InventoryItem) => !!row,
  /** Batch delete */
  'batch-delete': (rows: InventoryItem[]) => Array.isArray(rows),
  /** Quantity adjusted inline */
  'quantity-change': (payload: { row: InventoryItem; quantity: number }) =>
    !!payload && !!payload.row && typeof payload.quantity === 'number',
  /** Status badge click */
  'status-click': (payload: { row: InventoryItem; status: StockStatus }) =>
    !!payload && !!payload.row,
  /** Refresh request */
  refresh: () => true,
} as const

export type InventoryTableEmits = typeof inventoryTableEmits
