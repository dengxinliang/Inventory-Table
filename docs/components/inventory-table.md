# InventoryTable

库存管理表格：筛选、分页、状态标签、行内改数量、批量删除。

## 在线预览

<BasicDemo />

## 事件示例

<EventsDemo />

## 基础用法

```vue
<script setup lang="ts">
import { InventoryTable } from '@inventory-table/vue'
import '@inventory-table/vue/style.css'
</script>

<template>
  <!-- 演示模式：内置 mock 数据 -->
  <InventoryTable use-mock />
</template>
```

## 传入业务数据

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { InventoryTable, type InventoryItem } from '@inventory-table/vue'
import '@inventory-table/vue/style.css'

const list = ref<InventoryItem[]>([
  {
    id: 1,
    sku: 'SKU-001',
    name: '示例商品',
    category: '默认分类',
    warehouse: '主仓',
    quantity: 20,
    unitPrice: 99,
    unit: '件',
    updatedAt: new Date().toISOString(),
  },
])
</script>

<template>
  <InventoryTable
    :data="list"
    @edit="(row) => console.log('edit', row)"
    @delete="(row) => (list = list.filter((i) => i.id !== row.id))"
  />
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 表格数据 | `InventoryItem[]` | `[]` |
| `columns` | 自定义列；空则使用内置列 | `InventoryColumn[]` | `[]` |
| `loading` | 加载中 | `boolean` | `false` |
| `showToolbar` | 显示工具栏 | `boolean` | `true` |
| `showPagination` | 显示分页 | `boolean` | `true` |
| `selectable` | 多选列 | `boolean` | `true` |
| `showActions` | 操作列 | `boolean` | `true` |
| `pageSizes` | 每页条数选项 | `number[]` | `[10,20,50,100]` |
| `pageSize` | 初始每页条数 | `number` | `10` |
| `total` | 服务端总数；传入后关闭客户端切片 | `number` | — |
| `defaultLowStockThreshold` | 默认低库存阈值 | `number` | `10` |
| `categoryOptions` | 分类筛选项 | `string[]` | `[]` |
| `warehouseOptions` | 仓库筛选项 | `string[]` | `[]` |
| `query` | 受控查询对象 | `InventoryQuery` | — |
| `maxHeight` | 表格最大高度 | `string \| number` | — |
| `stripe` | 斑马纹 | `boolean` | `true` |
| `border` | 边框 | `boolean` | `true` |
| `emptyText` | 空状态文案 | `string` | `暂无库存数据` |
| `currency` | 货币符号 | `string` | `¥` |
| `useMock` | `data` 为空时使用内置 mock | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `selection-change` | 多选变化 | `(rows: InventoryItem[])` |
| `search` | 点击查询 / 重置 | `(query: InventoryQuery)` |
| `page-change` | 分页变化 | `(pagination: InventoryPagination)` |
| `view` | 查看 | `(row: InventoryItem)` |
| `edit` | 编辑 | `(row: InventoryItem)` |
| `delete` | 删除单行 | `(row: InventoryItem)` |
| `batch-delete` | 批量删除 | `(rows: InventoryItem[])` |
| `quantity-change` | 行内改数量 | `({ row, quantity })` |
| `status-click` | 点击状态标签 | `({ row, status })` |
| `refresh` | 点击刷新 | `()` |

## InventoryItem

```ts
interface InventoryItem {
  id: string | number
  sku: string
  name: string
  category: string
  warehouse?: string
  quantity: number
  lowStockThreshold?: number
  unitPrice?: number
  unit?: string
  updatedAt?: string
  remark?: string
  [key: string]: unknown
}
```

## 服务端分页

传入 `total` 后，组件不再对 `data` 做客户端切片，由你在 `@search` / `@page-change` 中请求接口并回填 `data`。

```vue
<InventoryTable
  :data="list"
  :total="total"
  :loading="loading"
  @search="fetchList"
  @page-change="fetchList"
/>
```
