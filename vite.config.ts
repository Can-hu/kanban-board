import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'
import { defineConfig as defineVitestConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
    vuetify()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  ...defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
      deps: {
        inline: ["vuetify"],
      },
    }
  })
})