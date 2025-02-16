import { ref } from 'vue'
import type { KanbanCard, KanbanColumn } from '../types/kanban'

export function useKanban() {
  const columns = ref<KanbanColumn[]>([
    { id: 'todo', title: 'To Do', cards: [] },
    { id: 'inProgress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] }
  ])

  const addCard = (columnId: string, card: Omit<KanbanCard, 'id' | 'column'>) => {
    const column = columns.value.find(col => col.id === columnId)
    if (column) {
      const newCard: KanbanCard = {
        id: crypto.randomUUID(),
        column: columnId,
        ...card
      }
      column.cards.push(newCard)
    }
  }

  const updateCard = (cardId: string, updates: Partial<KanbanCard>) => {
    columns.value.forEach(column => {
      const card = column.cards.find(c => c.id === cardId)
      if (card) {
        Object.assign(card, updates)
      }
    })
  }

  const deleteCard = (cardId: string) => {
    columns.value.forEach(column => {
      const index = column.cards.findIndex(c => c.id === cardId)
      if (index !== -1) {
        column.cards.splice(index, 1)
      }
    })
  }

  const moveCard = (cardId: string, targetColumnId: string) => {
    let sourceColumn: KanbanColumn | undefined
    let cardIndex = -1

    // Find the source column and card index
    sourceColumn = columns.value.find(column => {
      cardIndex = column.cards.findIndex(c => c.id === cardId)
      return cardIndex !== -1
    })

    if (!sourceColumn || cardIndex === -1) return

    // Remove card from source column
    const [movedCard] = sourceColumn.cards.splice(cardIndex, 1)

    // Add card to target column
    const targetColumn = columns.value.find(col => col.id === targetColumnId)
    if (targetColumn) {
      movedCard.column = targetColumnId
      targetColumn.cards.push(movedCard)
    } else {
      // If target column not found, put the card back in source column
      sourceColumn.cards.splice(cardIndex, 0, movedCard)
    }
  }

  return {
    columns,
    addCard,
    updateCard,
    deleteCard,
    moveCard
  }
}