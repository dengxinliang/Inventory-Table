import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import 'element-plus/dist/index.css'
import './custom.css'
import BasicDemo from '../../components/demos/BasicDemo.vue'
import EventsDemo from '../../components/demos/EventsDemo.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.provide(ID_INJECTION_KEY, {
      prefix: 1024,
      current: 0,
    })
    app.provide(ZINDEX_INJECTION_KEY, {
      current: 0,
    })
    app.use(ElementPlus)
    app.component('BasicDemo', BasicDemo)
    app.component('EventsDemo', EventsDemo)
  },
}

export default theme
