# Smart Campus Space & Energy Intelligence System

An affordable Wi-Fi-enabled IoT prototype for monitoring classroom occupancy and estimating energy usage, with a web dashboard and historical records.

## Current prototype capabilities
- Live dashboard with occupancy, estimated power, energy, and device status.
- Express API and SQLite persistence.
- Demo/simulation mode so the software can be evaluated before hardware is connected.
- ESP32 firmware template for sending sensor readings over Wi-Fi.
- Clear separation between measured hardware values and simulated demo values.

> Safety: this prototype is for low-voltage sensing and monitoring. Do not connect mains voltage to an ESP32 or breadboard. Any mains energy meter installation must use a certified isolated meter and be performed by a qualified electrician.

## Quick start
Requirements: Node.js 18+.

```bash
cd backend
npm install
npm start
```

Open http://localhost:3000

The server creates the SQLite database automatically. Demo readings are generated when `DEMO_MODE=true`.

## Configuration
Copy `.env.example` to `.env`. Set a strong `DEVICE_API_KEY` before using a device on a network.

## API
- `GET /api/health`
- `GET /api/latest`
- `GET /api/history?limit=100`
- `POST /api/readings` (requires `x-api-key`)

POST body example:
```json
{
  "deviceId": "esp32-classroom-01",
  "room": "Classroom 1",
  "occupancy": 12,
  "powerW": 185.5,
  "energyWh": 42.3,
  "temperatureC": 28.4,
  "source": "hardware"
}
```

## Project structure
- `backend/` Express API, SQLite, and static dashboard hosting
- `firmware/` ESP32 Arduino sketch template
- `documentation/` architecture, bill of materials, testing, and team plan
- `diagrams/` Mermaid architecture diagram

## Hardware status
The software includes a hardware-ready API and ESP32 firmware template. Actual sensor accuracy and end-to-end hardware operation must be verified on the physical components available to the team; demo mode is explicitly labelled and must not be presented as measured data.

## Team of four
1. IoT hardware and firmware
2. Backend and API
3. Frontend and dashboard
4. Database, testing, and documentation

See `documentation/IMPLEMENTATION.md` and `documentation/TEAM_PLAN.md`.
