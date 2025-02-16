// src/tests/KanbanCard.test.ts
import { describe, it, expect } from 'vitest'
import { mountWithVuetify, findByTestId } from './setup'
import KanbanCardComponent from '../components/KanbanCard.vue'
import type { KanbanCard } from '../types/kanban'

describe('KanbanCard.vue', () => {
  const mockCard: KanbanCard = {
    id: '1',
    title: 'Test Card',
    description: 'Test Description',
    column: 'todo'
  }

  const createWrapper = () => mountWithVuetify(KanbanCardComponent, {
    props: { card: mockCard }
  })

  it('emits update event when edited', async () => {
    const wrapper = createWrapper()

    console.log('Initial card HTML:', wrapper.html())

    // Click the edit button
    const editButton = findByTestId(wrapper, 'edit-button')
    expect(editButton.exists(), 'Edit button should be present').toBe(true)
    await editButton.trigger('click')
    await wrapper.vm.$nextTick()

    console.log('Edit mode HTML:', wrapper.html())

    // Find and modify title input (target the native input)
    const titleInputWrapper = findByTestId(wrapper, 'title-input')
    const titleInputField = titleInputWrapper.find('input')
    expect(titleInputField.exists(), 'Title input should be present').toBe(true)
    await titleInputField.setValue('Updated Title')
    await wrapper.vm.$nextTick()

    // Find and modify description input
    const descInputWrapper = findByTestId(wrapper, 'description-input')
    const descInputField = descInputWrapper.find('textarea')
    expect(descInputField.exists(), 'Description input should be present').toBe(true)
    await descInputField.setValue('Updated Description')
    await wrapper.vm.$nextTick()

    // Trigger save
    await titleInputField.trigger('blur')
    await wrapper.vm.$nextTick()

    // Verify emitted event
    const emitted = wrapper.emitted('update')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0]).toEqual([
        '1',
        { title: 'Updated Title', description: 'Updated Description' }
      ])
    }
  })
})
