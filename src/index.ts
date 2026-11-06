import type { App, Plugin } from 'vue'
import InventoryTable from './components/InventoryTable/InventoryTable.vue'

export * from './components/InventoryTable'

export { InventoryTable }

export const InventoryTablePlugin: Plugin = {
  install(app: App) {
    app.component('InventoryTable', InventoryTable)
  },
}

export default InventoryTablePlugin
