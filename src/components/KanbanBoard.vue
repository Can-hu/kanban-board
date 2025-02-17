<template>
  <v-container fluid>
    <v-row class="kanban-board">
      <v-col v-for="column in columns" :key="column.id" cols="12" md="4">
        <v-card class="kanban-column" elevation="4">
          <v-card-title class="text-h6 text-white" :class="getColumnColor(column.id)">
            {{ column.title }}
          </v-card-title>
          <v-card-text class="kanban-column-body">
            <div
              class="kanban-dropzone"
              @dragover.prevent
              @drop="onDrop($event, column.id as ColumnId)"
              :class="{ 'drag-over': isDragOver[column.id] }"
              @dragenter="isDragOver[column.id] = true"
              @dragleave="isDragOver[column.id] = false"
            >
              <KanbanCard
                v-for="card in column.cards"
                :key="card.id"
                :card="card"
                @update="updateCard"
                @delete="deleteCard"
              />
              <v-btn
                block
                :color="getButtonColor(column.id)"
                variant="flat"
                class="mt-3 add-card-button"
                data-test="add-card-button"
                @click="openAddCard(column.id as ColumnId)"
              >
                <v-icon left>mdi-plus</v-icon>
                Add Card
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Card Dialog -->
    <v-dialog v-model="showAddCard" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Add New Card</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleAddCard">
            <v-text-field
              v-model="newCard.title"
              label="Title"
              required
              data-test="new-card-title"
            ></v-text-field>
            <v-textarea
              v-model="newCard.description"
              label="Description"
              required
              data-test="new-card-description"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" data-test="save-card-button" @click="handleAddCard">
            Save
          </v-btn>
          <v-btn color="error" data-test="cancel-card-button" @click="showAddCard = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useKanban } from '../composables/useKanban'
import KanbanCard from './KanbanCard.vue'

type ColumnId = 'todo' | 'inProgress' | 'done';

type ColumnColors = {
  [key in ColumnId]: string;
}

const { columns, addCard, updateCard, deleteCard, moveCard } = useKanban()
const showAddCard = ref(false)
const newCard = ref({ title: '', description: '' })
const selectedColumnId = ref<string | null>(null)
const isDragOver = reactive<Record<string, boolean>>({})

// Handle dragging over columns
const onDrop = (event: DragEvent, columnId: string) => {
  const cardId = event.dataTransfer?.getData('cardId')
  if (cardId) {
    moveCard(cardId, columnId)
  }
  isDragOver[columnId] = false
}

const openAddCard = (columnId: string) => {
  selectedColumnId.value = columnId
  showAddCard.value = true
}

const handleAddCard = () => {
  if (newCard.value.title && newCard.value.description && selectedColumnId.value) {
    addCard(selectedColumnId.value, {
      title: newCard.value.title,
      description: newCard.value.description
    })
    newCard.value = { title: '', description: '' }
    showAddCard.value = false
  }
}

const columnColorMap: ColumnColors = {
  todo: 'to-do-bg',
  inProgress: 'in-progress-bg',
  done: 'done-bg'
}

const getColumnColor = (columnId: string): string => {
  return columnColorMap[columnId as ColumnId] || 'bg-grey-darken-2'
}

const buttonColorMap: ColumnColors = {
  todo: '#FB7D44',
  inProgress: '#2A92BF',
  done: '#00B961'
}

const getButtonColor = (columnId: string): string => {
  return buttonColorMap[columnId as ColumnId] || 'grey'
}
</script>

<style scoped>
.kanban-board {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 16px;
}

.kanban-column {
  border-radius: 20px;
  overflow: hidden;
}

.kanban-column-body {
  min-height: 250px;
  padding: 8px;
}

.kanban-dropzone {
  min-height: 250px;
  padding: 8px;
  transition: background-color 0.3s ease-in-out;
}

.kanban-dropzone.drag-over {
  background-color: rgba(0, 0, 0, 0.1);
  border: 2px dashed #333;
}

.add-card-button {
  border-radius: 20px;
}

.to-do-bg {
  background-color: #FB7D44;
}

.in-progress-bg {
  background-color: #2A92BF;
}

.done-bg {
  background-color: #00B961;
}
</style>
