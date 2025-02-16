<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-h3 mb-6">Kanban Board</h1>
        <KanbanBoard />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import KanbanBoard from './components/KanbanBoard.vue'
</script>