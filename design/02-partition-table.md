# Slice 02: Read Partition Table

Display the partition layout from the connected ESP device.

## Flow

```
[Device connected] → [Read partition table at 0x8000] → [Parse & display partitions]
```

## What to build

- After connection, read the partition table from flash (at 0x8000)
- Parse the binary partition table format
- Display partitions in MaintenanceView with name, type, offset, size

## ESP Partition Table Format

Source: [gen_esp32part.py](https://github.com/espressif/esp-idf/blob/master/components/partition_table/gen_esp32part.py)

Located at 0x8000. Each entry is 32 bytes, little-endian:

```
Offset  Size  Field
0       2     Magic (0xAA 0x50)
2       1     Type
3       1     Subtype
4       4     Offset (uint32)
8       4     Size (uint32)
12      16    Name (null-padded string)
28      4     Flags (uint32)
```

Struct format: `<2sBBLL16sL`

Table ends when:
- Magic is `0xEB 0xEB` (MD5 checksum entry follows, 14x 0xFF then 16-byte MD5)
- Or magic is not `0xAA 0x50`

Max entries: 95 (table size 0xC00 = 3072 bytes)

## Partition Types

- 0x00: app
- 0x01: data

Common subtypes:
- app: factory (0x00), ota_0 (0x10), ota_1 (0x11)
- data: phy (0x01), nvs (0x02), coredump (0x03), nvs_keys (0x04), spiffs (0x82)

## UI

Display each partition with: name, type, offset, size

## Success criteria

- [ ] Partition table is read automatically after connection
- [ ] Partitions display with name, type, offset, size
- [ ] Works with real ESP32/ESP8266
