<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElTag,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElPagination,
  ElSpace,
  ElMessageBox,
  ElTooltip,
  ElInputNumber,
} from 'element-plus'
import { inventoryTableProps } from './props'
import { inventoryTableEmits } from './emits'
import { mockInventoryData, mockCategoryOptions, mockWarehouseOptions } from './mock'
import type { InventoryColumn, InventoryItem, InventoryQuery, StockStatus } from './types'
import { formatDateTime, formatMoney, resolveStockStatus } from './utils'

defineOptions({
  name: 'InventoryTable',
})

const props = defineProps(inventoryTableProps)
const emit = defineEmits(inventoryTableEmits)

const DEFAULT_COLUMNS: InventoryColumn[] = [
  { prop: 'sku', label: 'SKU', minWidth: 120, sortable: true },
  { prop: 'name', label: '商品名称', minWidth: 160, sortable: true },
  { prop: 'category', label: '分类', minWidth: 110 },
  { prop: 'warehouse', label: '仓库', minWidth: 100 },
  { prop: 'quantity', label: '库存数量', minWidth: 130, sortable: true, align: 'center' },
  { prop: 'status', label: '库存状态', minWidth: 110, align: 'center' },
  { prop: 'unitPrice', label: '单价', minWidth: 100, sortable: true, align: 'right' },
  { prop: 'updatedAt', label: '更新时间', minWidth: 160, sortable: true },
]

const innerQuery = reactive<InventoryQuery>({
  keyword: '',
  category: '',
  status: '',
  warehouse: '',
})

watch(
  () => props.query,
  (val) => {
    if (!val) return
    Object.assign(innerQuery, val)
  },
  { immediate: true, deep: true },
)

const currentPage = ref(1)
const innerPageSize = ref(props.pageSize)
const selectedRows = ref<InventoryItem[]>([])

watch(
  () => props.pageSize,
  (val) => {
    innerPageSize.value = val
  },
)

const sourceData = computed<InventoryItem[]>(() => {
  if (props.data.length > 0) return props.data
  if (props.useMock) return mockInventoryData
  return []
})

const categoryOptions = computed(() =>
  props.categoryOptions.length
    ? props.categoryOptions
    : props.useMock
      ? mockCategoryOptions
      : [...new Set(sourceData.value.map((i) => i.category).filter(Boolean))],
)

const warehouseOptions = computed(() =>
  props.warehouseOptions.length
    ? props.warehouseOptions
    : props.useMock
      ? mockWarehouseOptions
      : [
          ...new Set(
            sourceData.value
              .map((i) => i.warehouse)
              .filter((w): w is string => Boolean(w)),
          ),
        ],
)

const resolvedColumns = computed<InventoryColumn[]>(() => {
  const cols = props.columns.length ? props.columns : DEFAULT_COLUMNS
  return cols.filter((c) => c.visible !== false)
})

const isServerMode = computed(() => typeof props.total === 'number')

const filteredData = computed(() => {
  if (isServerMode.value) return sourceData.value

  const kw = (innerQuery.keyword || '').trim().toLowerCase()
  return sourceData.value.filter((item) => {
    if (kw) {
      const hay = `${item.sku} ${item.name} ${item.remark ?? ''}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    if (innerQuery.category && item.category !== innerQuery.category) return false
    if (innerQuery.warehouse && item.warehouse !== innerQuery.warehouse) return false
    if (innerQuery.status) {
      const meta = resolveStockStatus(item, props.defaultLowStockThreshold)
      if (meta.status !== innerQuery.status) return false
    }
    return true
  })
})

const displayTotal = computed(() =>
  isServerMode.value ? (props.total as number) : filteredData.value.length,
)

const pagedData = computed(() => {
  if (isServerMode.value) return filteredData.value
  const start = (currentPage.value - 1) * innerPageSize.value
  return filteredData.value.slice(start, start + innerPageSize.value)
})

function asItem(row: Record<string, unknown> | InventoryItem): InventoryItem {
  return row as InventoryItem
}

function getStatus(row: Record<string, unknown> | InventoryItem) {
  return resolveStockStatus(asItem(row), props.defaultLowStockThreshold)
}

function handleSearch() {
  currentPage.value = 1
  emit('search', { ...innerQuery })
}

function handleReset() {
  innerQuery.keyword = ''
  innerQuery.category = ''
  innerQuery.status = ''
  innerQuery.warehouse = ''
  currentPage.value = 1
  emit('search', { ...innerQuery })
}

function handleSelectionChange(rows: InventoryItem[]) {
  selectedRows.value = rows
  emit('selection-change', rows)
}

function emitPageChange() {
  emit('page-change', {
    page: currentPage.value,
    pageSize: innerPageSize.value,
    total: displayTotal.value,
  })
}

function handleSizeChange(size: number) {
  innerPageSize.value = size
  currentPage.value = 1
  emitPageChange()
}

function handleCurrentChange(page: number) {
  currentPage.value = page
  emitPageChange()
}

async function handleDelete(row: Record<string, unknown> | InventoryItem) {
  const item = asItem(row)
  try {
    await ElMessageBox.confirm(`确认删除「${item.name}」吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    emit('delete', item)
  } catch {
    /* cancelled */
  }
}

function handleView(row: Record<string, unknown> | InventoryItem) {
  emit('view', asItem(row))
}

function handleEdit(row: Record<string, unknown> | InventoryItem) {
  emit('edit', asItem(row))
}

async function handleBatchDelete() {
  if (!selectedRows.value.length) return
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 条库存记录吗？`,
      '批量删除',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    emit('batch-delete', [...selectedRows.value])
  } catch {
    /* cancelled */
  }
}

function handleQuantityChange(
  row: Record<string, unknown> | InventoryItem,
  quantity: number | undefined,
) {
  if (quantity === undefined || quantity === null) return
  emit('quantity-change', { row: asItem(row), quantity })
}

function handleStatusClick(row: Record<string, unknown> | InventoryItem) {
  const item = asItem(row)
  const meta = getStatus(item)
  emit('status-click', { row: item, status: meta.status as StockStatus })
}

const statusOptions: { label: string; value: StockStatus | '' }[] = [
  { label: '全部状态', value: '' },
  { label: '充足', value: 'in_stock' },
  { label: '偏低', value: 'low_stock' },
  { label: '缺货', value: 'out_of_stock' },
]
</script>

<template>
  <div class="inventory-table">
    <div v-if="showToolbar" class="inventory-table__toolbar">
      <ElSpace wrap :size="12">
        <ElInput
          v-model="innerQuery.keyword"
          clearable
          placeholder="搜索 SKU / 名称"
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
        <ElSelect
          v-model="innerQuery.category"
          clearable
          placeholder="分类"
          style="width: 140px"
        >
          <ElOption
            v-for="opt in categoryOptions"
            :key="opt"
            :label="opt"
            :value="opt"
          />
        </ElSelect>
        <ElSelect
          v-model="innerQuery.warehouse"
          clearable
          placeholder="仓库"
          style="width: 140px"
        >
          <ElOption
            v-for="opt in warehouseOptions"
            :key="opt"
            :label="opt"
            :value="opt"
          />
        </ElSelect>
        <ElSelect
          v-model="innerQuery.status"
          clearable
          placeholder="库存状态"
          style="width: 140px"
        >
          <ElOption
            v-for="opt in statusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </ElSelect>
        <ElButton type="primary" @click="handleSearch">查询</ElButton>
        <ElButton @click="handleReset">重置</ElButton>
      </ElSpace>

      <ElSpace wrap :size="8">
        <ElButton
          v-if="selectable"
          type="danger"
          plain
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          批量删除
        </ElButton>
        <ElButton @click="emit('refresh')">刷新</ElButton>
      </ElSpace>
    </div>

    <ElTable
      v-loading="loading"
      class="inventory-table__body"
      :data="pagedData"
      :stripe="stripe"
      :border="border"
      :max-height="maxHeight"
      :empty-text="emptyText"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <ElTableColumn
        v-if="selectable"
        type="selection"
        width="48"
        fixed="left"
      />

      <template v-for="col in resolvedColumns" :key="String(col.prop)">
        <ElTableColumn
          v-if="col.prop === 'status'"
          :label="col.label"
          :min-width="col.minWidth"
          :width="col.width"
          :align="col.align || 'center'"
          :fixed="col.fixed"
        >
          <template #default="{ row }">
            <ElTag
              class="inventory-table__status"
              :type="getStatus(row).type"
              effect="light"
              round
              @click="handleStatusClick(row)"
            >
              {{ getStatus(row).label }}
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="col.prop === 'quantity'"
          :label="col.label"
          :min-width="col.minWidth || 140"
          :width="col.width"
          :align="col.align || 'center'"
          :sortable="col.sortable"
          :fixed="col.fixed"
          :prop="String(col.prop)"
        >
          <template #default="{ row }">
            <div class="inventory-table__qty">
              <ElInputNumber
                :model-value="row.quantity"
                :min="0"
                :step="1"
                size="small"
                controls-position="right"
                @update:model-value="(v) => handleQuantityChange(row, v)"
              />
              <span v-if="row.unit" class="inventory-table__unit">{{ row.unit }}</span>
            </div>
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="col.prop === 'unitPrice'"
          :label="col.label"
          :min-width="col.minWidth"
          :width="col.width"
          :align="col.align || 'right'"
          :sortable="col.sortable"
          :fixed="col.fixed"
          :prop="String(col.prop)"
        >
          <template #default="{ row }">
            {{ formatMoney(row.unitPrice, currency) }}
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="col.prop === 'updatedAt'"
          :label="col.label"
          :min-width="col.minWidth"
          :width="col.width"
          :align="col.align"
          :sortable="col.sortable"
          :fixed="col.fixed"
          :prop="String(col.prop)"
        >
          <template #default="{ row }">
            {{ formatDateTime(row.updatedAt) }}
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else
          :prop="String(col.prop)"
          :label="col.label"
          :min-width="col.minWidth"
          :width="col.width"
          :align="col.align"
          :sortable="col.sortable"
          :fixed="col.fixed"
          show-overflow-tooltip
        />
      </template>

      <ElTableColumn
        v-if="showActions"
        label="操作"
        width="200"
        fixed="right"
        align="center"
      >
        <template #default="{ row }">
          <ElSpace :size="4">
            <ElButton link type="primary" @click="handleView(row)">查看</ElButton>
            <ElButton link type="primary" @click="handleEdit(row)">编辑</ElButton>
            <ElTooltip content="删除" placement="top">
              <ElButton link type="danger" @click="handleDelete(row)">删除</ElButton>
            </ElTooltip>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>

    <div v-if="showPagination" class="inventory-table__pagination">
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="innerPageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :total="displayTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.inventory-table {
  --it-gap: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--it-gap);
  width: 100%;
}

.inventory-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.inventory-table__body {
  width: 100%;
}

.inventory-table__qty {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.inventory-table__unit {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.inventory-table__status {
  cursor: pointer;
}

.inventory-table__pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
