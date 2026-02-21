<script setup lang="ts">
import { useEspStore } from '../stores/esp'

const esp = useEspStore()
</script>

<template>
  <div>
    <h2>Serial Monitor</h2>
    <p>Device connected but not in bootloader mode.</p>
    <p>(serial output placeholder)</p>
    <button @click="esp.disconnect">Disconnect</button>
  </div>
</template>
