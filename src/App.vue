<script setup lang="ts">
import { ref } from 'vue'
import { useEspStore } from './stores/esp'
import StartScreen from './components/StartScreen.vue'
import MaintenanceView from './components/MaintenanceView.vue'
import SerialMonitor from './components/SerialMonitor.vue'
import BinaryInspector from './components/BinaryInspector.vue'

const esp = useEspStore()
const inspectingFile = ref<File | null>(null)
</script>

<template>
  <main class="h-screen bg-slate-100">
    <BinaryInspector v-if="inspectingFile" :file="inspectingFile" @close="inspectingFile = null" />
    <StartScreen v-else-if="!esp.port" @inspect-firmware="inspectingFile = $event" />
    <MaintenanceView v-else-if="esp.chipInfo" />
    <SerialMonitor v-else />
  </main>
</template>
