<script setup lang="ts">
defineProps<{
  file: File
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div>
    <h2>Binary Inspector</h2>
    <p>File: {{ file.name }} ({{ file.size }} bytes)</p>
    <p>(hex content placeholder)</p>
    <button @click="emit('close')">Back</button>
  </div>
</template>
