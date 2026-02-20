# Build Contract

## Goal

Build a browser-based tool that exposes all esptool-js functionality (connect, flash, erase, read, monitor, chip info) through a single-page interface using WebSerial.

## User Stories

As a user I can:
- connect to an ESP device via WebSerial and see chip info (name, features, MAC, flash size)
- flash one or more firmware files to specified addresses with progress indication
- erase the entire flash memory
- read flash contents from a specified address/size and download as a binary file
- open a serial monitor to see device output in real-time
- verify flashed firmware using MD5 checksum
- auto-reconnect to the same device when the microcontroller is manually reset or temporarily disconnects
- inspect the binary content of a firmware image file (hex viewer)

## Definition of Done

- [ ] `pnpm dev` starts the app locally
- [ ] App loads in Chrome/Edge 89+ without errors
- [ ] Can connect to a real ESP32/ESP8266 device
- [ ] Chip info displays correctly after connection
- [ ] Can flash a test binary and see progress
- [ ] Can erase flash and see completion message
- [ ] Can read flash region and download .bin file
- [ ] Serial monitor shows device output
- [ ] MD5 verification passes after flash
- [ ] Auto-reconnects when device is reset or temporarily disconnects
- [ ] Can load a .bin file and view its hex content

## Constraints

- Frontend-only (no backend server), github-pages deployable
- Use esptool-js library
- WebSerial API (Chrome/Edge 89+)
- pnpm + vite + vue3-typescript + pinia + tailwindcss

## Not Doing

(None specified yet)
