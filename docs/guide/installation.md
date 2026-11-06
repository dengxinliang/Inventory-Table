# 安装

## 环境要求

- Node.js `>= 18`
- Vue `^3.3`
- Element Plus `^2.4`

## npm / pnpm / yarn

::: code-group

```bash [npm]
npm install @inventory-table/vue element-plus
```

```bash [pnpm]
pnpm add @inventory-table/vue element-plus
```

```bash [yarn]
yarn add @inventory-table/vue element-plus
```

:::

## 全局注册

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import InventoryTablePlugin from '@inventory-table/vue'
import '@inventory-table/vue/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(InventoryTablePlugin)
app.mount('#app')
```

## 按需引入

```vue
<script setup lang="ts">
import { InventoryTable } from '@inventory-table/vue'
import '@inventory-table/vue/style.css'
import type { InventoryItem } from '@inventory-table/vue'

const data: InventoryItem[] = []
</script>

<template>
  <InventoryTable :data="data" />
</template>
```
