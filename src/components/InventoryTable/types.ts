/** Stock status for an inventory item */
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

/** Single inventory row */
export interface InventoryItem {
  /** Unique identifier */
  id: string | number
  /** SKU / product code */
  sku: string
  /** Product display name */
  name: string
  /** Category label */
  category: string
  /** Warehouse / location */
  warehouse?: string
  /** Current quantity on hand */
  quantity: number
  /** Alert threshold for low stock */
  lowStockThreshold?: number
  /** Unit price */
  unitPrice?: number
  /** Unit of measure, e.g. pcs / box */
  unit?: string
  /** Last updated ISO datetime */
  updatedAt?: string
  /** Optional remark */
  remark?: string
  /** Extra fields passthrough */
  [key: string]: unknown
}

/** Column definition for customizable table columns */
export interface InventoryColumn {
  prop: keyof InventoryItem | string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean | 'custom'
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  /** Whether to show this column; default true */
  visible?: boolean
}

/** Pagination state */
export interface InventoryPagination {
  page: number
  pageSize: number
  total: number
}

/** Filter / search query */
export interface InventoryQuery {
  keyword?: string
  category?: string
  status?: StockStatus | ''
  warehouse?: string
}

/** Derived stock status helper result */
export interface StockStatusMeta {
  status: StockStatus
  label: string
  type: 'success' | 'warning' | 'danger' | 'info'
}
