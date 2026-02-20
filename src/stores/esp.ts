import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ESPLoader, Transport } from 'esptool-js'

export interface ChipInfo {
  chipName: string
  features: string
  mac: string
  flashSize?: number
}

export const useEspStore = defineStore('esp', () => {
  const port = ref<SerialPort | null>(null)
  const esploader = ref<ESPLoader | null>(null)
  const chipInfo = ref<ChipInfo | null>(null)
  const connecting = ref(false)
  const error = ref<string | null>(null)

  async function connect() {
    await disconnect()
    error.value = null
    connecting.value = true

    try {
      const selectedPort = await navigator.serial.requestPort()
      port.value = selectedPort

      const transport = new Transport(selectedPort)
      const loader = new ESPLoader({
        transport,
        baudrate: 115200,
        romBaudrate: 115200,
      })

      await loader.main()

      chipInfo.value = {
        chipName: loader.chip.CHIP_NAME,
        features: (await loader.chip.getChipFeatures(loader)).join(', '),
        mac: (await loader.chip.readMac(loader)).toUpperCase(),
        flashSize: await loader.getFlashSize(),
      }

      esploader.value = loader
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      await disconnect()
    } finally {
      connecting.value = false
    }
  }

  async function disconnect() {
    if (esploader.value) {
      try {
        await esploader.value.transport.disconnect()
      } catch {}
      esploader.value = null
    }
    if (port.value) {
      try {
        await port.value.close()
      } catch {}
      port.value = null
    }
    chipInfo.value = null
  }

  return { port, esploader, chipInfo, connecting, error, connect, disconnect }
})
