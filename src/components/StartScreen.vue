<script setup lang="ts">
import { useEspStore } from '../stores/esp'

const esp = useEspStore()

const emit = defineEmits<{
  inspectFirmware: [file: File]
}>()

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files[0]
  if (file) emit('inspectFirmware', file)
}

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('inspectFirmware', file)
}
</script>

<template>
  <div class="flex flex-col h-screen" @dragover.prevent @drop.prevent="onDrop">
    <div class="flex-1 flex flex-col items-center justify-center">
      <button @click="esp.connect" :disabled="esp.connecting" class="py-2 px-8 text-2xl bg-slate-200 rounded-full ">
        {{ esp.connecting ? 'Connecting...' : 'Connect' }}
      </button>
      <p v-if="esp.error">{{ esp.error }}</p>
    </div>

    <div class="absolute bottom-4 right-4 flex items-center gap-2">
      <label>
        <input type="file" accept=".bin" @change="onFileSelect" hidden>
        <button type="button" onclick="this.previousElementSibling.click()">
          Inspect Firmware
        </button>
      </label>
      <span>or drag file here</span>
    </div>
  </div>
</template>
