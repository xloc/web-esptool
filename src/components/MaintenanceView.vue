<script setup lang="ts">
import { useEspStore } from '../stores/esp'

const esp = useEspStore()

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

const typeColors: Record<number, string> = {
  0: 'bg-blue-500', // app
  1: 'bg-green-500', // data
}

function typeColor(p: { type: number }) {
  return typeColors[p.type] ?? 'bg-slate-500'
}

function formatHex(n: number) {
  const hex = n.toString(16).padStart(8, '0')
  return '0x' + hex.replace(/(.{4})/g, '$1 ').slice(0, -1)
}

</script>

<template>
  <div class="relative h-full w-full flex flex-col justify-center items-center">
    <div v-if="esp.erasing" class="absolute right-4 top-4">
      Erasing flash...
      <progress></progress>
    </div>
    <section class="m-2 absolute left-0 top-0 flex gap-2 items-center">
      <h2>Chip</h2>
      <dl class="flex gap-2 items-center">
        <dd>{{ esp.chipInfo?.chipName }}</dd>
        <!-- <dd>{{ esp.chipInfo?.features }}</dd> -->
        <dd>{{ esp.chipInfo?.mac }}</dd>
        <dd>{{ esp.chipInfo?.flashSize ? `${esp.chipInfo.flashSize / 1024} MB` : 'Unknown' }}</dd>
      </dl>

      <button @click="esp.disconnect"
        class="bg-red-200 text-bg-800 hover:bg-red-100 px-2 py-1 rounded-lg">Disconnect</button>
    </section>

    <section class="w-full max-w-7xl flex flex-col px-4 gap-y-4">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl text-slate-500">
          Partitions
          <span class="text-sm text-slate-400 ml-2">
            {{ esp.chipInfo?.flashSize ? formatSize(esp.chipInfo.flashSize * 1024) : '' }}
            ({{ formatHex(0) }} – {{ esp.chipInfo?.flashSize ? formatHex(esp.chipInfo.flashSize * 1024) : '' }})
          </span>
        </h2>
        <button @click="esp.erase" :disabled="esp.erasing">
          {{ esp.erasing ? 'Erasing...' : 'Erase Flash' }}
        </button>
      </div>

      <!-- Size bar -->
      <div class="flex h-2 gap-x-2">
        <div v-for="p in esp.partitions" :key="p.offset" class="rounded-full" :class="typeColor(p)"
          :style="{ flexGrow: p.size, flexBasis: '1rem' }">
        </div>
      </div>

      <!-- Partition details -->
      <div class="flex gap-x-4">
        <article v-for="p in esp.partitions" :key="p.offset" class="flex-1 p-2 bg-white rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-2">{{ p.name }}</h3>
          <dl class="flex flex-wrap gap-x-1 gap-y-1">
            <div class="flex gap-x-1 items-baseline px-2 bg-slate-100 rounded-full text-sm">
              <dt class="text-slate-400">type</dt>
              <dd class="text-slate-900">{{ p.typeName }}.{{ p.subtypeName }}</dd>
            </div>
            <div class="flex gap-x-1 items-baseline px-2 bg-slate-100 rounded-full text-sm">
              <dt class="text-slate-400">size</dt>
              <dd class="text-slate-900">{{ formatSize(p.size) }}</dd>
            </div>
            <div v-if="p.encrypted" class="px-2 bg-amber-100 rounded-full text-sm text-amber-700">
              encrypted
            </div>
            <div class="w-full text-slate-300 text-xs flex justify-between">
              <span>{{ formatHex(p.offset) }}</span>
              <span>{{ formatHex(p.offset + p.size) }}</span>
            </div>
          </dl>
        </article>
      </div>

    </section>

  </div>
</template>
