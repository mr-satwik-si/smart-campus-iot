const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
function openDatabase(dbPath) {
  const resolved = path.resolve(dbPath || "./data/campus.db");
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const db = new Database(resolved);
  db.pragma("journal_mode = WAL");
  db.exec("CREATE TABLE IF NOT EXISTS readings (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT NOT NULL, room TEXT NOT NULL, occupancy INTEGER NOT NULL CHECK(occupancy>=0), power_w REAL NOT NULL CHECK(power_w>=0), energy_wh REAL NOT NULL CHECK(energy_wh>=0), temperature_c REAL, source TEXT NOT NULL DEFAULT 'hardware', recorded_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_readings_time ON readings(recorded_at);");
  const insert = db.prepare("INSERT INTO readings(device_id,room,occupancy,power_w,energy_wh,temperature_c,source,recorded_at) VALUES(@deviceId,@room,@occupancy,@powerW,@energyWh,@temperatureC,@source,@recordedAt)");
  const fields = "id, device_id AS deviceId, room, occupancy, power_w AS powerW, energy_wh AS energyWh, temperature_c AS temperatureC, source, recorded_at AS recordedAt";
  return {
    raw: db,
    insertReading: value => insert.run(value),
    latest: (limit=20) => db.prepare("SELECT "+fields+" FROM readings ORDER BY id DESC LIMIT ?").all(limit),
    latestPerDevice: () => db.prepare("SELECT "+fields+" FROM readings r WHERE id=(SELECT MAX(id) FROM readings WHERE device_id=r.device_id) ORDER BY room").all(),
    history: (limit=100) => db.prepare("SELECT "+fields+" FROM readings ORDER BY id DESC LIMIT ?").all(limit).reverse(),
    close: () => db.close()
  };
}
module.exports = { openDatabase };