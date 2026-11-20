# Test Plan
| ID | Test | Expected result |
|---|---|---|
| T01 | Start backend in demo mode | Server listens on configured port |
| T02 | GET /api/health | JSON contains ok=true |
| T03 | Open dashboard | Metrics and room rows appear |
| T04 | GET /api/history?limit=10 | At most 10 ordered records |
| T05 | POST without API key | HTTP 401 |
| T06 | POST with valid key and payload | HTTP 201 and saved record |
| T07 | POST negative occupancy | HTTP 400 |
| T08 | Restart server | SQLite records persist |
| T09 | ESP32 posts a physical reading | Source displayed as HARDWARE |
| T10 | Compare estimated occupancy to manual count | Accuracy recorded over repeated trials |

Collect dashboard screenshot, terminal test output, successful API response with secrets removed, manual occupancy comparison and energy-meter comparison. Simulated output is not evidence of physical sensor validation.
