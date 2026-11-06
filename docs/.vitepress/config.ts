import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'

export default defineConfig({
  title: 'Inventory Table',
  description: 'Vue 3 + Element Plus 库存表格组件 — 开箱即用',
  lang: 'zh-CN',
  base: '/inventory-table/',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/inventory-table/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Inventory Table',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/inventory-table' },
      {
        text: 'v1.0.0',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/your-org/inventory-table/blob/main/CHANGELOG.md',
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '简介', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'InventoryTable', link: '/components/inventory-table' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/inventory-table' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Inventory Table Contributors',
    },
    search: {
      provider: 'local',
    },
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@inventory-table/vue': resolve(__dirname, '../../src'),
      },
    },
    ssr: {
      noExternal: ['element-plus'],
    },
  },
})
