<script setup lang="ts">
import { useEspStore } from './stores/esp'

const esp = useEspStore()
</script>

<template>
  <main>
    <h1>Web ESPTool</h1>

    <section>
      <button v-if="!esp.port" @click="esp.connect" :disabled="esp.connecting">
        {{ esp.connecting ? 'Connecting...' : 'Connect' }}
      </button>
      <button v-else @click="esp.disconnect">Disconnect</button>

      <p v-if="!esp.port && !esp.connecting">
        Put your device in bootloader mode before connecting (GPIO0 low during reset).
        If your board has BOOT and RESET buttons: hold BOOT, press RESET, release BOOT.
      </p>
      <p v-if="esp.error">{{ esp.error }}</p>
    </section>

    <section v-if="esp.chipInfo">
      <h2>Chip Info</h2>
      <dl>
        <dt>Chip</dt>
        <dd>{{ esp.chipInfo.chipName }}</dd>
        <dt>Features</dt>
        <dd>{{ esp.chipInfo.features }}</dd>
        <dt>MAC Address</dt>
        <dd>{{ esp.chipInfo.mac }}</dd>
        <dt>Flash Size</dt>
        <dd>{{ esp.chipInfo.flashSize ? `${esp.chipInfo.flashSize / 1024} MB` : 'Unknown' }}</dd>
      </dl>
    </section>
  </main>
</template>
