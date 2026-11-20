# Smart Campus Space & Energy Intelligence System
## Academic Project Report Draft

> Replace the bracketed fields with your team's actual information. Do not submit simulated dashboard values as physical measurement results.

## Title page
- Project title: Smart Campus Space & Energy Intelligence System
- Institution: [Institution name]
- Department / course: [Department and course]
- Academic year: [Year]
- Team members: [Member 1], [Member 2], [Member 3], [Member 4]
- Guide: [Guide name]

## Abstract
The Smart Campus Space & Energy Intelligence System is a Wi-Fi-enabled prototype intended to help campus administrators observe classroom occupancy and electricity usage. An ESP32-based device can collect room entry events and energy-meter measurements, transmit them to a Node.js API, and store the readings in an SQLite database. A browser dashboard presents occupancy, instantaneous power, cumulative energy and device reporting status. A clearly labelled demo mode supplies simulated data when physical sensors are unavailable, allowing the software and interface to be demonstrated independently of hardware. Physical performance must be evaluated separately using the team's installed sensors and reference measurements.

## 1. Introduction
Educational campuses use classrooms, laboratories and shared spaces throughout the day. Without timely information, staff may not know whether a room is occupied or whether electrical loads remain active. This project explores a low-cost monitoring architecture that combines sensor data, a Wi-Fi connection, a web API, a local database and a dashboard.

## 2. Problem statement
Campus staff may lack a single view of room occupancy and energy use. The project develops a prototype that gathers these readings and makes them visible through a web dashboard. The prototype is a monitoring aid; it does not automatically control electrical circuits.

## 3. Objectives
1. Estimate room occupancy from entry/exit sensor events.
2. Receive instantaneous power and cumulative energy readings from a suitable meter.
3. Transmit readings over Wi-Fi.
4. Validate and store data in a database.
5. Display current room and energy information on a web dashboard.
6. Test the software path independently using labelled simulated data.

## 4. Scope and assumptions
- Initial deployment is a limited prototype for selected rooms, not a whole-campus production system.
- Occupancy is an estimate and depends on correct sensor placement, calibration and doorway behavior.
- Energy values are measured only when a compatible energy meter is physically installed and verified.
- Demo mode is intended for software evaluation and is not evidence of real-world sensor measurement.
- The prototype displays readings; it does not switch mains equipment or replace certified building-management systems.

## 5. System architecture
The ESP32 receives digital entry sensor states and energy-meter readings. It posts JSON over Wi-Fi to an authenticated Express endpoint. The API validates fields, writes the data to SQLite and serves aggregated dashboard data. The browser polls the API and renders room utilization, device activity and a power trend.

See ARCHITECTURE.md and ../diagrams/architecture.mmd.

## 6. Hardware and software requirements
### Hardware options
- ESP32 development board with Wi-Fi.
- Two digital IR break-beam sensors for directional doorway events.
- Compatible isolated energy meter (for example, PZEM-004T v3) if already available.
- Regulated low-voltage USB power supply and jumper wires.
- Laptop/desktop and Wi-Fi router for the local server and dashboard.

Where the team has no energy-meter hardware or budget for it, demonstrate the end-to-end software using demo mode and state clearly that energy values are simulated. Do not purchase or install electrical equipment solely to match the report. Any mains-side energy-meter installation must be performed by a qualified electrician.

### Software
- ESP32 firmware: Arduino C++
- Communication: Wi-Fi and HTTP JSON for a trusted local prototype network
- Backend: Node.js and Express
- Storage: SQLite
- Frontend: HTML, CSS and vanilla JavaScript
- Source control and CI: Git, GitHub and GitHub Actions

## 7. Main modules
1. Sensor acquisition: reads two low-voltage entry beams and energy-meter serial values.
2. Device communication: connects to Wi-Fi and sends a JSON report with a device API key.
3. API and validation: rejects unauthenticated and out-of-range readings.
4. Data storage: saves timestamped readings in SQLite.
5. Dashboard: summarizes active devices, occupancy, instantaneous power, cumulative energy and recent reports.
6. Demo mode: generates clearly marked example readings for software demonstration.

## 8. Data and API design
A reading contains:
- deviceId: device identifier
- room: monitored room name
- occupancy: non-negative estimated person count
- powerW: instantaneous active power in watts
- energyWh: cumulative energy-meter counter in watt-hours
- temperatureC: optional temperature in degrees Celsius
- source: demo or hardware
- recordedAt: server timestamp

API endpoints:
- GET /api/health
- GET /api/dashboard
- GET /api/latest
- GET /api/history?limit=100
- POST /api/readings (requires x-api-key)

## 9. Implementation procedure
1. Install Node.js 20+ and Git.
2. Clone the GitHub repository.
3. Copy backend/.env.example to backend/.env and set a private device API key.
4. Install backend dependencies and run the server.
5. Open the dashboard locally and verify demo mode.
6. Run the automated test suite.
7. Only when available, configure and upload the ESP32 firmware.
8. Verify hardware-origin readings, calibrate sensors and record test evidence.

Detailed commands are in IMPLEMENTATION.md.

## 10. Testing and validation
Use TEST_PLAN.md as the test checklist. Record the actual date, test setup, expected result, observed result and pass/fail status for each test. Required physical validation includes comparing occupancy estimates with manual counts over repeated trials and comparing the installed energy meter against a suitable reference meter. Keep demo-mode tests separate from hardware tests.

### Results record (complete after testing)
| Test / metric | Actual result | Evidence reference |
|---|---|---|
| API health and software startup | [Fill in] | [Screenshot/log] |
| API authentication test | [Fill in] | [Test output] |
| Dashboard demo mode | [Fill in] | [Screenshot] |
| Occupancy count accuracy | [Measure; do not invent] | [Trial sheet] |
| Power meter comparison | [Measure; do not invent] | [Meter photo/log] |
| Wi-Fi reporting reliability | [Measure; do not invent] | [Log] |

## 11. Limitations
- Dual-beam occupancy counting can miss tailgating, simultaneous crossings or people moving in unusual patterns.
- Energy data depends on the meter, wiring, installation and calibration.
- HTTP device reporting should be limited to a trusted isolated LAN; deploy HTTPS and stronger device identity before any wider use.
- Demo values are generated examples, not actual campus consumption.
- No automatic electrical load control is implemented.

## 12. Future enhancements
- HTTPS and per-device credentials/certificates.
- Multi-floor and multi-building dashboards.
- Configurable occupancy capacity and alerts.
- Daily and monthly energy summaries with CSV export.
- Sensor calibration tools and offline buffering.
- Role-based accounts and cloud deployment.
- Integration with certified smart meters and building-management systems.

## 13. Conclusion
This prototype demonstrates a complete software data path for campus space and energy monitoring: device-format readings, authenticated API ingestion, persistent storage and a web dashboard. The software can be evaluated using demo mode, while real-world claims require separate installation, calibration and physical test evidence.

## References
- ESP32 documentation: https://docs.espressif.com/projects/esp-idf/en/stable/esp32/
- Node.js documentation: https://nodejs.org/docs/latest/api/
- Express documentation: https://expressjs.com/
- SQLite documentation: https://www.sqlite.org/docs.html
- ArduinoJson documentation: https://arduinojson.org/
