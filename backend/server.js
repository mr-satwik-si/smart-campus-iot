require("dotenv").config();
const path=require("node:path");
const {openDatabase}=require("./db");
const {createApp}=require("./app");
const port=Number(process.env.PORT||3000), host=process.env.HOST||"0.0.0.0";
const store=openDatabase(process.env.DB_PATH||path.join(__dirname,"data","campus.db"));
const apiKey=process.env.DEVICE_API_KEY||"change-me";
const demoMode=String(process.env.DEMO_MODE||"true").toLowerCase()==="true";
const interval=Math.max(2000,Number(process.env.DEMO_INTERVAL_MS||5000));
if(demoMode){
  const rooms=[{room:"Classroom 1",occupancy:24,powerW:820,temp:27.4,energyWh:1250},{room:"Computer Lab",occupancy:18,powerW:1160,temp:25.8,energyWh:2040},{room:"Library",occupancy:9,powerW:340,temp:26.2,energyWh:760}];
  const sample=()=>rooms.forEach(x=>{
    const power=Math.max(80,x.powerW+Math.round((Math.random()-.5)*100));
    x.energyWh+=power*interval/3600000;
    store.insertReading({deviceId:x.room.toLowerCase().replaceAll(" ","-")+"-demo",room:x.room,occupancy:Math.max(0,x.occupancy+Math.round((Math.random()-.5)*4)),powerW:power,energyWh:Number(x.energyWh.toFixed(3)),temperatureC:Number((x.temp+(Math.random()-.5)*.6).toFixed(1)),source:"demo",recordedAt:new Date().toISOString()});
  });
  if(store.latest(1).length===0)sample();
  const timer=setInterval(sample,interval);timer.unref();
  console.log("DEMO MODE: readings are simulated, not physical measurements.");
}
const server=createApp({store,apiKey}).listen(port,host,()=>console.log("Smart Campus IoT running at http://"+host+":"+port));
function shutdown(){server.close(()=>{store.close();process.exit(0);});}
process.on("SIGINT",shutdown);process.on("SIGTERM",shutdown);