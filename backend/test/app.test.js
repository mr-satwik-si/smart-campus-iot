const test=require("node:test");
const assert=require("node:assert/strict");
const {parseReading}=require("../app");
test("accepts valid reading",()=>{const r=parseReading({deviceId:"esp32-01",room:"Classroom 1",occupancy:10,powerW:320.5,energyWh:1200,temperatureC:28,source:"hardware"});assert.equal(r.occupancy,10);assert.equal(r.source,"hardware");assert.ok(r.recordedAt);});
test("rejects negative occupancy",()=>assert.throws(()=>parseReading({deviceId:"x",room:"Lab",occupancy:-1,powerW:1,energyWh:1}),/occupancy/));
test("rejects invalid power",()=>assert.throws(()=>parseReading({deviceId:"x",room:"Lab",occupancy:1,powerW:"bad",energyWh:1}),/powerW/));