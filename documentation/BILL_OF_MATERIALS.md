# Bill of Materials and No-Extra-Budget Plan

| Item | Purpose | Plan |
|---|---|---|
| Existing laptop/desktop | Run Node.js server and dashboard | Required for software demo |
| Existing Wi-Fi router/hotspot | Connect ESP32 and laptop on the same LAN | Required for hardware data path |
| ESP32 development board | Read sensors and transmit data | Use only if already available |
| Two IR break-beam sensors | Estimate direction of doorway movement | Optional; use existing compatible sensors |
| Isolated energy meter such as PZEM-004T | Measure real power and cumulative energy | Optional; use only if already available and correctly rated |
| USB power supply and jumper wires | Power/connect low-voltage electronics | Use existing equipment |

## No additional component budget
The software prototype can be demonstrated without purchasing hardware by leaving DEMO_MODE=true. The dashboard labels simulated data. For a physical demonstration, connect only the sensors and compatible meter already available to the team. If no energy meter is available, report the energy channel as simulated; do not claim that the system physically measures mains energy.

## Electrical safety
Never connect mains voltage to an ESP32, breadboard or unprotected wiring. Do not build an improvised mains measurement circuit. A PZEM or other mains energy meter must be installed in a suitable enclosure by a qualified electrician, following the meter manufacturer's instructions and local electrical rules.
