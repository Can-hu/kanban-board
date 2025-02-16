// setup.ts
import { vi } from 'vitest'
import { config, mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Fix ResizeObserver issue (Vuetify components rely on this)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Create a single Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: { defaultTheme: 'light' }
})

// Register Vuetify globally for all tests
config.global.plugins = [vuetify]

// Helper function to mount components with Vuetify
export function mountWithVuetify<T>(component: T, options = {}) {
  return mount(component, {
    global: {
      plugins: [vuetify],
      stubs: {
        transition: false, // Stub transitions for predictable tests
        'v-dialog-transition': false
      }
    },
    ...options
  })
}

// Add a helper function for finding elements by data-test attribute
export function findByTestId(wrapper: any, testId: string) {
  return wrapper.find(`[data-test="${testId}"]`)
}
