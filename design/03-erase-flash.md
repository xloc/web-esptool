# Slice 03: Erase Flash

Erase the entire flash memory of the connected ESP device.

## Flow

```
[Click Erase button] → [Erase in progress] → [Done]
```

## What to build

- Add "Erase" button next to Partitions title in MaintenanceView
- Call `esploader.eraseFlash()` on click
- Show progress bar during erase
- Re-read partition table after erase completes

## Success criteria

- [ ] Erase button visible next to Partitions heading
- [ ] Flash erases successfully on real device
- [ ] Progress bar shows during erase
