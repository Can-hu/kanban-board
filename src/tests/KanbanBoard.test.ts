import { describe, it, expect } from 'vitest'
import { mountWithVuetify, findByTestId } from './setup'
import { flushPromises } from '@vue/test-utils'
import KanbanBoard from '../components/KanbanBoard.vue'

describe('KanbanBoard.vue', () => {
  const createWrapper = () =>
    mountWithVuetify(KanbanBoard, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: false // Changed from true to false to prevent teleport stubbing
        }
      }
    })

  it('adds a new card when the Add Card button is clicked', async () => {
    const wrapper = createWrapper()
    
    // Ensure initial mounting is complete
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Click "Add Card" button
    const addButton = findByTestId(wrapper, 'add-card-button')
    expect(addButton.exists(), 'Add button should be present').toBe(true)
    await addButton.trigger('click')
    
    // Wait for dialog to mount and become visible
    await wrapper.vm.$nextTick()
    await flushPromises()
    
    // Wait for Vuetify's dialog transition
    await new Promise(resolve => setTimeout(resolve, 100))

    // Try multiple possible selectors for the dialog
    const dialog = document.querySelector('.v-dialog--active') || 
                  document.querySelector('.v-dialog:not([style*="display: none"])') ||
                  document.querySelector('.v-overlay--active .v-dialog')
    
    expect(dialog, 'Dialog should be present after clicking add button').toBeTruthy()

    // Find and fill in the form inputs
    const titleInput = document.querySelector('[data-test="new-card-title"] input')
    expect(titleInput, 'Title input should be present in dialog').toBeTruthy()
    
    if (titleInput instanceof HTMLInputElement) {
      titleInput.value = 'New Task'
      titleInput.dispatchEvent(new Event('input'))
      await wrapper.vm.$nextTick()
    }

    const descInput = document.querySelector('[data-test="new-card-description"] textarea')
    expect(descInput, 'Description input should be present in dialog').toBeTruthy()
    
    if (descInput instanceof HTMLTextAreaElement) {
      descInput.value = 'Task Description'
      descInput.dispatchEvent(new Event('input'))
      await wrapper.vm.$nextTick()
    }

    // Click save button
    const saveButton = document.querySelector('[data-test="save-card-button"]')
    expect(saveButton, 'Save button should be present in dialog').toBeTruthy()
    
    if (saveButton instanceof HTMLElement) {
      saveButton.click()
      await wrapper.vm.$nextTick()
      await flushPromises()
    }

    // Add extra wait for dialog closing animation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify the new card appears
    expect(wrapper.text()).toContain('New Task')
    expect(wrapper.text()).toContain('Task Description')
  })
})