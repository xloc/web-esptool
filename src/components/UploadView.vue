<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEspStore, type UploadFile } from '../stores/esp'

const props = defineProps<{ initialFiles: File[] }>()
const emit = defineEmits<{ close: [] }>()

const esp = useEspStore()

const files = ref<UploadFile[]>([])

// Load initial files
loadFiles(props.initialFiles)

async function loadFiles(newFiles: File[]) {
  for (const file of newFiles) {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let data = ''
    for (let i = 0; i < bytes.length; i += 8192) {
      data += String.fromCharCode(...bytes.subarray(i, i + 8192))
    }
    files.value.push({ file, address: 0, data })
  }
}

async function addFiles() {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = '.bin'
  input.onchange = () => {
    if (input.files) loadFiles([...input.files])
  }
  input.click()
}

function removeFile(index: number) {
  files.value.splice(index, 1)
  if (files.value.length === 0) emit('close')
}

function parseHex(value: string): number {
  const cleaned = value.replace(/[\s_]/g, '')
  return parseInt(cleaned, 16) || 0
}

function formatHex(n: number) {
  return '0x' + n.toString(16).padStart(8, '0')
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

const progressPercent = computed(() => {
  const { written, total } = esp.uploadProgress
  return total > 0 ? Math.round((written / total) * 100) : 0
})

const currentFileName = computed(() => {
  const idx = esp.uploadProgress.fileIndex
  return files.value[idx]?.file.name ?? ''
})

async function upload() {
  await esp.upload(files.value)
  emit('close')
}
</script>

<template>
  <div class="h-full w-full flex flex-col items-center justify-center p-8">
    <section class="w-full max-w-2xl bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl text-slate-500">Upload Firmware</h2>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600">Close</button>
      </div>

      <div class="space-y-2 mb-4">
        <div v-for="(f, i) in files" :key="i" class="flex items-center gap-4 p-2 bg-slate-50 rounded">
          <span class="flex-1 truncate">{{ f.file.name }}</span>
          <span class="text-slate-400 text-sm w-20 text-right">{{ formatSize(f.file.size) }}</span>
          <input
            type="text"
            :value="formatHex(f.address)"
            @change="f.address = parseHex(($event.target as HTMLInputElement).value)"
            class="w-32 px-2 py-1 border rounded font-mono text-sm"
            :disabled="esp.uploading"
          />
          <button @click="removeFile(i)" class="text-red-400 hover:text-red-600" :disabled="esp.uploading">
            &times;
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="addFiles" :disabled="esp.uploading" class="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
          + Add files
        </button>
        <button
          @click="upload"
          :disabled="esp.uploading || files.length === 0"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ esp.uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>

      <div v-if="esp.uploading" class="mt-4">
        <div class="flex justify-between text-sm text-slate-500 mb-1">
          <span>{{ currentFileName }}</span>
          <span>{{ progressPercent }}%</span>
        </div>
        <progress :value="progressPercent" max="100" class="w-full"></progress>
      </div>
    </section>
  </div>
</template>
