import { defineStore } from "pinia";
import { ref } from "vue";
import { ESPLoader, Transport } from "esptool-js";

export interface ChipInfo {
  chipName: string;
  features: string;
  mac: string;
  flashSize?: number;
}

const typeNames: Record<number, string> = { 0: 'app', 1: 'data' }
const subtypeNames: Record<number, Record<number, string>> = {
  0: { 0: 'factory', 0x10: 'ota_0', 0x11: 'ota_1', 0x20: 'test' },
  1: { 0x01: 'phy', 0x02: 'nvs', 0x03: 'coredump', 0x04: 'nvs_keys', 0x82: 'spiffs' },
}

export class Partition {
  constructor(
    public name: string,
    public type: number,
    public subtype: number,
    public offset: number,
    public size: number,
    public encrypted: boolean,
  ) {}

  get typeName() {
    return typeNames[this.type] ?? `0x${this.type.toString(16)}`
  }

  get subtypeName() {
    return subtypeNames[this.type]?.[this.subtype] ?? `0x${this.subtype.toString(16)}`
  }
}

const PARTITION_TABLE_OFFSET = 0x8000;
const PARTITION_ENTRY_SIZE = 32;
const PARTITION_MAGIC = [0xaa, 0x50];
const PARTITION_MD5_MAGIC = [0xeb, 0xeb];

export function parsePartitions(data: Uint8Array): Partition[] {
  const partitions: Partition[] = [];
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  for (
    let i = 0;
    i + PARTITION_ENTRY_SIZE <= data.length;
    i += PARTITION_ENTRY_SIZE
  ) {
    const magic0 = view.getUint8(i);
    const magic1 = view.getUint8(i + 1);

    // End of table: MD5 checksum marker or invalid magic
    if (magic0 === PARTITION_MD5_MAGIC[0] && magic1 === PARTITION_MD5_MAGIC[1])
      break;
    if (magic0 !== PARTITION_MAGIC[0] || magic1 !== PARTITION_MAGIC[1]) break;

    const type = view.getUint8(i + 2);
    const subtype = view.getUint8(i + 3);
    const offset = view.getUint32(i + 4, true);
    const size = view.getUint32(i + 8, true);
    const nameBytes = data.slice(i + 12, i + 28);
    const nullIndex = nameBytes.indexOf(0);
    const name = new TextDecoder().decode(
      nameBytes.slice(0, nullIndex === -1 ? 16 : nullIndex),
    );
    const flags = view.getUint32(i + 28, true);
    const encrypted = (flags & 0x01) !== 0;

    partitions.push(new Partition(name, type, subtype, offset, size, encrypted));
  }

  return partitions;
}

export const useEspStore = defineStore("esp", () => {
  const port = ref<SerialPort | null>(null);
  const esploader = ref<ESPLoader | null>(null);
  const chipInfo = ref<ChipInfo | null>(null);
  const partitions = ref<Partition[]>([]);
  const connecting = ref(false);
  const error = ref<string | null>(null);

  async function connect() {
    await disconnect();
    error.value = null;
    connecting.value = true;

    try {
      const selectedPort = await navigator.serial.requestPort();
      port.value = selectedPort;

      const transport = new Transport(selectedPort);
      transport.trace = () => {}; // suppress esptool-js trace output
      const loader = new ESPLoader({
        transport,
        baudrate: 115200,
        romBaudrate: 115200,
      });

      try {
        await loader.main();
        chipInfo.value = {
          chipName: loader.chip.CHIP_NAME,
          features: (await loader.chip.getChipFeatures(loader)).join(", "),
          mac: (await loader.chip.readMac(loader)).toUpperCase(),
          flashSize: await loader.getFlashSize(),
        };
        esploader.value = loader;

        // Read partition table
        const data = await loader.readFlash(PARTITION_TABLE_OFFSET, 0xc00);
        partitions.value = parsePartitions(data);
      } catch {
        // Chip not detected (not in bootloader mode) - keep port open for serial monitor
        chipInfo.value = null;
        esploader.value = null;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      await disconnect();
    } finally {
      connecting.value = false;
    }
  }

  async function disconnect() {
    if (esploader.value) {
      try {
        await esploader.value.transport.disconnect();
      } catch {}
      esploader.value = null;
    }
    if (port.value) {
      try {
        await port.value.close();
      } catch {}
      port.value = null;
    }
    chipInfo.value = null;
    partitions.value = [];
  }

  return {
    port,
    esploader,
    chipInfo,
    partitions,
    connecting,
    error,
    connect,
    disconnect,
  };
});
