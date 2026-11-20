const express = require("express");
const helmet = require("helmet");
const path = require("node:path");
function parseReading(body={}) {
  const deviceId=String(body.deviceId||"").trim(), room=String(body.room||"").trim();
  const occupancy=Number(body.occupancy), powerW=Number(body.powerW), energyWh=Number(body.energyWh);
  const temperatureC=body.temperatureC==null?null:Number(body.temperatureC);
  const source=body.source==="demo"?"demo":"hardware";
  if(!deviceId||deviceId.length>80) throw new Error("deviceId is required (max 80 characters)");
  if(!room||room.length>100) throw new Error("room is required (max 100 characters)");
  if(!Number.isInteger(occupancy)||occupancy<0||occupancy>500) throw new Error("occupancy must be an integer from 0 to 500");
  if(!Number.isFinite(powerW)||powerW<0||powerW>100000) throw new Error("powerW must be between 0 and 100000");
  if(!Number.isFinite(energyWh)||energyWh<0||energyWh>100000000) throw new Error("energyWh must be a non-negative cumulative Wh reading");
  if(temperatureC!==null&&(!Number.isFinite(temperatureC)||temperatureC< -20||temperatureC>100)) throw new Error("temperatureC must be between -20 and 100, or null");
  return {deviceId,room,occupancy,powerW,energyWh,temperatureC,source,recordedAt:new Date().toISOString()};
}
function createApp({store,apiKey="change-me",publicDir=path.join(__dirname,"public")}) {
  const app=express(); app.disable("x-powered-by"); app.use(helmet({contentSecurityPolicy:false})); app.use(express.json({limit:"16kb"}));
  app.get("/api/health",(_req,res)=>res.json({ok:true,service:"smart-campus-iot",timestamp:new Date().toISOString()}));
  app.get("/api/latest",(_req,res)=>res.json({readings:store.latest(20)}));
  app.get("/api/history",(req,res)=>{const limit=Math.max(1,Math.min(500,parseInt(req.query.limit,10)||100));res.json({readings:store.history(limit)});});
  app.get("/api/dashboard",(_req,res)=>{
    const devices=store.latestPerDevice(), totalOccupancy=devices.reduce((s,x)=>s+x.occupancy,0), totalPowerW=devices.reduce((s,x)=>s+x.powerW,0);
    const latest=devices.reduce((a,b)=>!a||a.recordedAt<b.recordedAt?b:a,null);
    const temps=devices.filter(x=>x.temperatureC!=null);
    res.json({summary:{totalOccupancy,totalPowerW:Number(totalPowerW.toFixed(2)),activeDevices:devices.length,latestEnergyWh:latest?latest.energyWh:0,averageTemperatureC:temps.length?Number((temps.reduce((s,x)=>s+x.temperatureC,0)/temps.length).toFixed(1)):null,dataMode:devices.some(x=>x.source==="hardware")?"hardware":devices.length?"demo":"waiting"},devices,history:store.history(30)});
  });
  app.post("/api/readings",(req,res)=>{
    if(!apiKey||apiKey==="change-me"||req.get("x-api-key")!==apiKey) return res.status(401).json({error:"Unauthorized device. Configure DEVICE_API_KEY and send it in x-api-key."});
    try{const reading=parseReading(req.body);const result=store.insertReading(reading);return res.status(201).json({ok:true,id:Number(result.lastInsertRowid),reading});}
    catch(error){return res.status(400).json({error:error.message});}
  });
  app.use(express.static(publicDir,{extensions:["html"]}));
  app.use((error,_req,res,_next)=>{if(error&&error.type==="entity.parse.failed")return res.status(400).json({error:"Invalid JSON body"});console.error(error);res.status(500).json({error:"Internal server error"});});
  return app;
}
module.exports={createApp,parseReading};