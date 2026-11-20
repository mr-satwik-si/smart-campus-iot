const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {openDatabase}=require("../db");
const {createApp}=require("../app");

test("API rejects unauthenticated devices and persists authenticated readings",async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"campus-iot-"));
  const store=openDatabase(path.join(dir,"test.db"));
  const server=createApp({store,apiKey:"test-secret"}).listen(0,"127.0.0.1");
  await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  try {
    const denied=await fetch(base+"/api/readings",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({deviceId:"esp32-01",room:"Lab",occupancy:4,powerW:120,energyWh:30})});
    assert.equal(denied.status,401);
    const accepted=await fetch(base+"/api/readings",{method:"POST",headers:{"content-type":"application/json","x-api-key":"test-secret"},body:JSON.stringify({deviceId:"esp32-01",room:"Lab",occupancy:4,powerW:120,energyWh:30,temperatureC:27})});
    assert.equal(accepted.status,201);
    const dashboard=await (await fetch(base+"/api/dashboard")).json();
    assert.equal(dashboard.summary.totalOccupancy,4);
    assert.equal(dashboard.summary.totalPowerW,120);
    assert.equal(dashboard.devices[0].source,"hardware");
  } finally {
    await new Promise(resolve=>server.close(resolve));
    store.close();
    fs.rmSync(dir,{recursive:true,force:true});
  }
});
