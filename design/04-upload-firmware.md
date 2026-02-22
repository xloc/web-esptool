# Slice 04: Upload Firmware

Upload one or more binary files to the ESP device at specified addresses.

## Flow

```
[Drag file or click to select] → [Upload view opens] → [Set addresses, add more files] → [Upload] → [Progress] → [Done]
```

## What to build

- Drag-drop or click to select file(s) opens the upload view (when device connected in bootloader mode)
- Upload view shows file list with filename, size, editable hex address (default 0x0)
- Can add more files or remove files from the list
- Upload button flashes all files to device with progress
- MD5 verification on completion
- Re-read partition table after upload

## UI sketch

```
┌─────────────────────────────────────────────────────────────┐
│ Upload Firmware                                             │
├─────────────────────────────────────────────────────────────┤
│ [+ Add files]                                               │
│                                                             │
│  firmware.bin     128 KB    0x00010000  [x]                 │
│  bootloader.bin    16 KB    0x00001000  [x]                 │
│  partitions.bin     3 KB    0x00008000  [x]                 │
│                                                             │
│ [Upload]                                                    │
│ ████████████░░░░░░░░░░░░░░░  45%  firmware.bin              │
└─────────────────────────────────────────────────────────────┘
```

## Success criteria

- [ ] Drag-drop or click opens upload view (when connected)
- [ ] Address field editable per file (hex input)
- [ ] Can add more files or remove files from list
- [ ] Upload flashes files to device with progress
- [ ] Partition table refreshes after upload
