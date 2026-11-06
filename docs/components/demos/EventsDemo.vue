<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  InventoryTable,
  mockInventoryData,
  type InventoryItem,
  type InventoryQuery,
} from '@inventory-table/vue'

const data = ref<InventoryItem[]>([...mockInventoryData])
const lastEvent = ref('等待交互…')

function onSearch(query: InventoryQuery) {
  lastEvent.value = `search → ${JSON.stringify(query)}`
}

function onView(row: InventoryItem) {
  lastEvent.value = `view → ${row.sku}`
  ElMessage.info(`查看：${row.name}`)
}

function onEdit(row: InventoryItem) {
  lastEvent.value = `edit → ${row.sku}`
  ElMessage.success(`编辑：${row.name}`)
}

function onDelete(row: InventoryItem) {
  data.value = data.value.filter((i) => i.id !== row.id)
  lastEvent.value = `delete → ${row.sku}`
  ElMessage.warning(`已删除：${row.name}`)
}

function onBatchDelete(rows: InventoryItem[]) {
  const ids = new Set(rows.map((r) => r.id))
  data.value = data.value.filter((i) => !ids.has(i.id))
  lastEvent.value = `batch-delete → ${rows.length} 条`
}

function onQuantityChange(payload: { row: InventoryItem; quantity: number }) {
  const target = data.value.find((i) => i.id === payload.row.id)
  if (target) target.quantity = payload.quantity
  lastEvent.value = `quantity-change → ${payload.row.sku} = ${payload.quantity}`
}
</script>

<template>
  <div class="demo-block">
    <p class="demo-block__title">事件联动 · 本地数据 CRUD</p>
    <p style="margin: 0 0 12px; font-size: 13px; color: var(--vp-c-text-2)">
      最近事件：{{ lastEvent }}
    </p>
    <InventoryTable
      :data="data"
      @search="onSearch"
      @view="onView"
      @edit="onEdit"
      @delete="onDelete"
      @batch-delete="onBatchDelete"
      @quantity-change="onQuantityChange"
    />
  </div>
</template>
