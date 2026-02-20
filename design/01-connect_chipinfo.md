# Slice 01: Connect & Display Chip Info

The smallest working version that proves the stack works end-to-end.

## Flow

```
[Connect Button] → [WebSerial] → [ESPLoader] → [Display chip info]
```

## What to build

- One page with a "Connect" button
- Request WebSerial port on click
- Initialize Transport + ESPLoader from esptool-js
- Display: chip name, features, MAC address, flash size

## Success criteria

- [ ] `pnpm dev` runs without errors
- [ ] Click "Connect" opens WebSerial device picker
- [ ] After selecting device, chip info appears on screen
- [ ] Works with real ESP32 or ESP8266

## Why this slice

- Validates Vite + Vue + esptool-js integration
- Tests WebSerial permissions and connection
- Proves the hardest part (device communication) works
- Foundation for all other features
