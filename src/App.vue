<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-h3 mb-6 app-title text-center">Kanban Board</h1>
        <KanbanBoard />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import KanbanBoard from './components/KanbanBoard.vue'
</script>

<style scoped>
.app-title {
  font-family: var(--primary-font);
  font-weight: 600;
}
</style>