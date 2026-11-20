const $=id=>document.getElementById(id);
const state={history:[]};$("year").textContent=new Date().getFullYear();
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function time(v){return v?new Date(v).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";}
function chart(rows){
 const c=$("power-chart"),ctx=c.getContext("2d"),r=c.getBoundingClientRect(),ratio=window.devicePixelRatio||1;
 c.width=Math.max(1,r.width*ratio);c.height=Math.max(1,r.height*ratio);ctx.scale(ratio,ratio);const w=r.width,h=r.height;ctx.clearRect(0,0,w,h);
 if(!rows.length){$("chart-empty").style.display="grid";return;} $("chart-empty").style.display="none";
 const data=rows.slice(-30),max=Math.max(100,...data.map(x=>Number(x.powerW)||0))*1.15,left=38,right=10,top=12,bottom=25,cw=w-left-right,ch=h-top-bottom;
 ctx.font="10px system-ui";ctx.fillStyle="#71819d";ctx.strokeStyle="#26364e";
 for(let i=0;i<=4;i++){const y=top+ch*i/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillText(Math.round(max*(1-i/4)),2,y+3);}
 const pts=data.map((d,i)=>({x:left+(data.length===1?cw/2:cw*i/(data.length-1)),y:top+ch-(Number(d.powerW)||0)/max*ch}));
 const g=ctx.createLinearGradient(0,top,0,h-bottom);g.addColorStop(0,"rgba(56,189,248,.24)");g.addColorStop(1,"rgba(56,189,248,0)");
 ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,h-bottom);ctx.lineTo(pts[0].x,h-bottom);ctx.closePath();ctx.fillStyle=g;ctx.fill();
 ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle="#42c4f5";ctx.lineWidth=2.5;ctx.stroke();
 pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle="#8be0ff";ctx.fill();});
}
function render(data){
 const s=data.summary||{},d=data.devices||[],h=data.history||[];
 $("occupancy").textContent=s.totalOccupancy??"—";$("power").textContent=Number(s.totalPowerW||0).toLocaleString(undefined,{maximumFractionDigits:1});
 $("energy").textContent=Number(s.latestEnergyWh||0).toLocaleString(undefined,{maximumFractionDigits:2});$("devices-count").textContent=s.activeDevices??0;
 $("last-updated").textContent="Updated "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});$("record-count").textContent=d.length+" devices";
 const n=$("mode-notice");n.style.display=s.dataMode==="hardware"?"none":"flex";
 if(s.dataMode==="waiting"){n.querySelector("strong").textContent="Waiting for devices";n.querySelector("p").textContent="No readings have arrived yet. Start demo mode or connect an ESP32 device.";}
 else if(s.dataMode==="demo"){n.querySelector("strong").textContent="Demo data";n.querySelector("p").textContent="Values are simulated for software demonstration. Connect ESP32 hardware for measured readings.";}
 const max=Math.max(1,...d.map(x=>x.occupancy));
 $("room-list").innerHTML=d.length?d.map(x=>'<div><div class="room-row-head"><span>'+esc(x.room)+'</span><span>'+x.occupancy+' people</span></div><div class="bar"><i style="width:'+Math.min(100,x.occupancy/max*100)+'%"></i></div></div>').join(""):'<div class="loading">No rooms reporting yet.</div>';
 $("device-table").innerHTML=d.length?d.map(x=>'<tr><td><div class="device-name">'+esc(x.deviceId)+'</div><div class="subtle">'+esc(x.room)+'</div></td><td>'+x.occupancy+'</td><td>'+Number(x.powerW).toFixed(1)+' W</td><td>'+(x.temperatureC==null?"—":Number(x.temperatureC).toFixed(1)+" °C")+'</td><td><span class="source '+(x.source==="hardware"?"hardware":"")+'">'+(x.source==="hardware"?"HARDWARE":"DEMO")+'</span></td><td>'+time(x.recordedAt)+'</td></tr>').join(""):'<tr><td colspan="6" class="loading">Waiting for device data…</td></tr>';
 state.history=h;chart(h);
}
async function refresh(){try{const r=await fetch("/api/dashboard",{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);render(await r.json());}catch(e){$("last-updated").textContent="Connection error";console.error(e);}}
$("refresh").addEventListener("click",refresh);window.addEventListener("resize",()=>chart(state.history));refresh();setInterval(refresh,5000);