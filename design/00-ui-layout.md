# UI Layout

## Design Principle

The UI adapts to device state automatically rather than requiring user mode selection.

## Start Screen

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│              [Connect]                  │
│                                         │
│                                         │
│   [Inspect Firmware] or drag file here  │
└─────────────────────────────────────────┘
```

- **Connect** button is the primary action (center)
- **Inspect Firmware** button in corner with drag-drop hint nearby
- Drag-drop a file anywhere opens the binary inspector

## After Connection

The UI automatically shows one of two views based on chip detection:

### Chip Detected (Bootloader Mode)

Device is in bootloader mode, ready for programming.

```
┌─────────────────────────────────────────┐
│ Chip Info                               │
│ - Name, features, MAC, flash size       │
├─────────────────────────────────────────┤
│ Partitions                              │
│ - Partition list from device            │
├─────────────────────────────────────────┤
│ Operations                              │
│ - Flash                                 │
│ - Erase                                 │
│ - Read                                  │
└─────────────────────────────────────────┘
```

### Chip Not Detected (Running Mode)

Device is running user firmware, not in bootloader.

```
┌─────────────────────────────────────────┐
│ Serial Monitor                          │
│                                         │
│ (device output stream)                  │
│                                         │
└─────────────────────────────────────────┘
```

## Binary Inspector

Standalone view for inspecting binary files. Accessible from start screen without device connection. Also reused for inspecting partition content.
