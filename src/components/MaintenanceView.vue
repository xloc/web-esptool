<script setup lang="ts">
import { useEspStore } from '../stores/esp'

const esp = useEspStore()
</script>

<template>
  <div>
    <section>
      <h2>Chip Info</h2>
      <dl>
        <dt>Chip</dt>
        <dd>{{ esp.chipInfo?.chipName }}</dd>
        <dt>Features</dt>
        <dd>{{ esp.chipInfo?.features }}</dd>
        <dt>MAC Address</dt>
        <dd>{{ esp.chipInfo?.mac }}</dd>
        <dt>Flash Size</dt>
        <dd>{{ esp.chipInfo?.flashSize ? `${esp.chipInfo.flashSize / 1024} MB` : 'Unknown' }}</dd>
      </dl>
    </section>

    <section>
      <h2>Partitions</h2>
      <p>(partition list placeholder)</p>
    </section>

    <section>
      <h2>Operations</h2>
      <button>Flash</button>
      <button>Erase</button>
      <button>Read</button>
    </section>

    <button @click="esp.disconnect">Disconnect</button>
  </div>
</template>
