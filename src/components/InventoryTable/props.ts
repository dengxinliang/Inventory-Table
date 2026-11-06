import type { ExtractPropTypes, PropType } from 'vue'
import type { InventoryColumn, InventoryItem, InventoryQuery } from './types'

export const inventoryTableProps = {
  /** Table data source */
  data: {
    type: Array as PropType<InventoryItem[]>,
    default: () => [],
  },
  /** Custom column definitions; falls back to built-in columns when empty */
  columns: {
    type: Array as PropType<InventoryColumn[]>,
    default: () => [],
  },
  /** Loading indicator */
  loading: {
    type: Boolean,
    default: false,
  },
  /** Show toolbar (search / filters / actions) */
  showToolbar: {
    type: Boolean,
    default: true,
  },
  /** Show pagination */
  showPagination: {
    type: Boolean,
    default: true,
  },
  /** Enable row selection (checkbox) */
  selectable: {
    type: Boolean,
    default: true,
  },
  /** Enable row actions column */
  showActions: {
    type: Boolean,
    default: true,
  },
  /** Page size options */
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100],
  },
  /** Initial page size */
  pageSize: {
    type: Number,
    default: 10,
  },
  /** Total count for server-side pagination; omit for client-side */
  total: {
    type: Number,
    default: undefined,
  },
  /** Default low-stock threshold when item has none */
  defaultLowStockThreshold: {
    type: Number,
    default: 10,
  },
  /** Category filter options */
  categoryOptions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /** Warehouse filter options */
  warehouseOptions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /** Controlled search query (optional) */
  query: {
    type: Object as PropType<InventoryQuery>,
    default: undefined,
  },
  /** Table max height */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  /** Stripe rows */
  stripe: {
    type: Boolean,
    default: true,
  },
  /** Border */
  border: {
    type: Boolean,
    default: true,
  },
  /** Empty text */
  emptyText: {
    type: String,
    default: '暂无库存数据',
  },
  /** Currency symbol for unit price */
  currency: {
    type: String,
    default: '¥',
  },
  /** Use mock data when `data` is empty (demo only) */
  useMock: {
    type: Boolean,
    default: false,
  },
} as const

export type InventoryTableProps = ExtractPropTypes<typeof inventoryTableProps>
