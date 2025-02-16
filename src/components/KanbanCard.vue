<template>
  <v-card
    class="kanban-card"
    draggable="true"
    @dragstart="onDragStart"
    elevation="3"
  >
    <v-card-title class="d-flex align-center">
      <template v-if="!isEditing">
        <span data-test="card-title">{{ card.title }}</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          size="small"
          data-test="edit-button"
          @click="isEditing = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          color="error"
          data-test="delete-button"
          @click="$emit('delete', card.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <v-text-field
        v-else
        v-model="editedCard.title"
        dense
        hide-details
        data-test="title-input"
        @blur="saveChanges"
        @keyup.enter="saveChanges"
      ></v-text-field>
    </v-card-title>

    <v-card-text>
      <template v-if="!isEditing">
        <div data-test="card-description">{{ card.description }}</div>
      </template>
      <v-textarea
        v-else
        v-model="editedCard.description"
        dense
        hide-details
        auto-grow
        data-test="description-input"
        @blur="saveChanges"
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { KanbanCard } from '../types/kanban'

const props = defineProps<{ card: KanbanCard }>()

const emit = defineEmits<{
  (e: 'update', cardId: string, updates: Partial<KanbanCard>): void
  (e: 'delete', cardId: string): void
}>()

const isEditing = ref(false)
const editedCard = ref({ ...props.card })

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData('cardId', props.card.id)
}

const saveChanges = () => {
  emit('update', props.card.id, {
    title: editedCard.value.title,
    description: editedCard.value.description
  })
  isEditing.value = false
}
</script>

<style scoped>
.kanban-card {
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.kanban-card:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
