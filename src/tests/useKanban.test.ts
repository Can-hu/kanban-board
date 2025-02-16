import { describe, it, expect } from 'vitest'
import { useKanban } from '@/composables/useKanban'

describe('useKanban composable', () => {
  it('should initialize with 3 columns', () => {
    const { columns } = useKanban()
    expect(columns.value.length).toBe(3)
    expect(columns.value.map(c => c.id)).toEqual(['todo', 'inProgress', 'done'])
  })

  it('should add a new card to the correct column', () => {
    const { columns, addCard } = useKanban()
    addCard('todo', { title: 'Test Card', description: 'Testing addCard' })
    
    expect(columns.value.find(c => c.id === 'todo')?.cards.length).toBe(1)
    expect(columns.value.find(c => c.id === 'todo')?.cards[0].title).toBe('Test Card')
  })

  it('should update a card correctly', () => {
    const { columns, addCard, updateCard } = useKanban()
    addCard('todo', { title: 'Old Title', description: 'Old Desc' })
    const cardId = columns.value[0].cards[0].id
    
    updateCard(cardId, { title: 'New Title' })
    expect(columns.value[0].cards[0].title).toBe('New Title')
  })

  it('should delete a card correctly', () => {
    const { columns, addCard, deleteCard } = useKanban()
    addCard('todo', { title: 'To Delete', description: 'Delete me' })
    const cardId = columns.value[0].cards[0].id

    deleteCard(cardId)
    expect(columns.value[0].cards.length).toBe(0)
  })

  it('should move a card between columns', () => {
    const { columns, addCard, moveCard } = useKanban()
    addCard('todo', { title: 'Move Me', description: 'To another column' })
    const cardId = columns.value[0].cards[0].id

    moveCard(cardId, 'done')
    expect(columns.value[0].cards.length).toBe(0) // Removed from 'todo'
    expect(columns.value[2].cards.length).toBe(1) // Added to 'done'
    expect(columns.value[2].cards[0].title).toBe('Move Me')
  })
})
