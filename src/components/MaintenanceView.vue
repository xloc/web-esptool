<script setup lang="ts">
import { useEspStore } from '../stores/esp'

const esp = useEspStore()
</script>

<template>
  <div class="relative h-full w-full flex flex-col justify-center items-center">
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

    <section class="">
      <h2>Partitions</h2>
      <p>(partition list placeholder)</p>
    </section>

  </div>
</template>
