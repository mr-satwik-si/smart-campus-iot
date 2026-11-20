# Implementation and Setup
## Requirements
- Node.js 20 or newer and npm
- Git
- Arduino IDE 2.x for ESP32 hardware

## Run locally
From repository root:

Windows CMD:
```cmd
cd backend
copy .env.example .env
npm install
npm start
```

PowerShell, macOS or Linux:
```bash
cd backend
cp .env.example .env
npm install
npm start
```

Open http://localhost:3000. Run tests with npm test.

## Configuration
Edit backend/.env. For local demo keep DEMO_MODE=true. Configure a long random DEVICE_API_KEY before device testing. For hardware-only operation set DEMO_MODE=false and restart the server.

## ESP32 setup
1. Install ArduinoJson and PZEM004Tv30 libraries.
2. Open firmware/esp32_smart_campus.ino.
3. Configure Wi-Fi, server LAN IP, device ID and matching API key.
4. Connect two low-voltage IR sensors to GPIO 26 and 27.
5. Connect PZEM UART TX/RX to ESP32 GPIO 16/17 if supported by the board.
6. Upload and open Serial Monitor at 115200 baud.
7. Verify readings before presenting hardware as complete.

The IR entry/exit sequence logic is a starter implementation. Calibrate it for your doorway and test repeated entry, exit, simultaneous crossings and noisy signals. The PZEM installation involves mains voltage and must only be done by a qualified electrician. Never connect mains voltage to an ESP32 or breadboard.

## API
- GET /api/health — service health
- GET /api/dashboard — summary, latest state per device and recent readings
- GET /api/latest — latest 20 readings
- GET /api/history?limit=100 — historical readings (limit 1–500)
- POST /api/readings — ingestion endpoint; requires x-api-key header

Units: powerW is watts; energyWh is a cumulative watt-hour meter counter; temperatureC is Celsius; occupancy is an estimated integer count. Source demo means simulated; source hardware means submitted by a device.

## Troubleshooting
- EADDRINUSE: change PORT or stop the process using port 3000.
- Dashboard empty: check /api/health and server logs.
- HTTP 401: confirm DEVICE_API_KEY matches the ESP32 x-api-key header.
- ESP32 cannot connect: use the computer LAN IP, not localhost, and allow the port through the firewall.
- PZEM values NaN: verify UART wiring, library, meter supply and safe installation.
