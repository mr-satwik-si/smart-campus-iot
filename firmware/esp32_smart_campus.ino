/*
 Smart Campus IoT ESP32 starter firmware.
 Requires ArduinoJson and PZEM004Tv30 libraries.
 Sensors: two digital IR break-beams on GPIO 26/27; PZEM-004T UART on 16/17.

 SAFETY: Never connect mains voltage to an ESP32 or breadboard. PZEM mains-side
 installation must be enclosed and completed by a qualified electrician.
*/
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <PZEM004Tv30.h>
const char* WIFI_SSID="YOUR_WIFI_NAME";
const char* WIFI_PASSWORD="YOUR_WIFI_PASSWORD";
const char* API_URL="http://192.168.1.10:3000/api/readings";
const char* API_KEY="REPLACE_WITH_DEVICE_API_KEY";
const char* DEVICE_ID="esp32-classroom-01";
const char* ROOM_NAME="Classroom 1";
const int SENSOR_A=26,SENSOR_B=27,PZEM_RX=16,PZEM_TX=17;
HardwareSerial meterSerial(2);
PZEM004Tv30 meter(meterSerial,PZEM_RX,PZEM_TX);
int occupancy=0;
bool oldA=false,oldB=false;
unsigned long lastSend=0,sequenceStart=0;
void connectWiFi(){
 WiFi.mode(WIFI_STA);WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
 unsigned long start=millis();while(WiFi.status()!=WL_CONNECTED&&millis()-start<20000){delay(500);Serial.print(".");}
 Serial.println(WiFi.status()==WL_CONNECTED?" Wi-Fi connected":" Wi-Fi timeout");
 if(WiFi.status()==WL_CONNECTED)Serial.println(WiFi.localIP());
}
void updateOccupancy(){
 bool a=digitalRead(SENSOR_A)==LOW,b=digitalRead(SENSOR_B)==LOW;
 if(a&&!oldA)sequenceStart=millis();
 if(b&&!oldB&&sequenceStart&&millis()-sequenceStart<1000)occupancy++;
 if(a&&!oldA&&oldB&&millis()-sequenceStart<1000)occupancy=max(0,occupancy-1);
 oldA=a;oldB=b;occupancy=constrain(occupancy,0,500);
}
void sendReading(){
 if(WiFi.status()!=WL_CONNECTED){connectWiFi();return;}
 float power=meter.power(),energy=meter.energy(),voltage=meter.voltage();
 if(isnan(power)||isnan(energy)){Serial.println("PZEM reading unavailable");return;}
 StaticJsonDocument<256> doc;
 doc["deviceId"]=DEVICE_ID;doc["room"]=ROOM_NAME;doc["occupancy"]=occupancy;
 doc["powerW"]=power;doc["energyWh"]=energy*1000.0;doc["temperatureC"]=nullptr;doc["source"]="hardware";
 String payload;serializeJson(doc,payload);
 HTTPClient http;http.begin(API_URL);http.addHeader("Content-Type","application/json");http.addHeader("x-api-key",API_KEY);
 int code=http.POST(payload);Serial.printf("POST %d | %.1f V | %.1f W | %.3f kWh\n",code,voltage,power,energy);
 if(code>0)Serial.println(http.getString());http.end();
}
void setup(){Serial.begin(115200);pinMode(SENSOR_A,INPUT_PULLUP);pinMode(SENSOR_B,INPUT_PULLUP);connectWiFi();}
void loop(){updateOccupancy();if(millis()-lastSend>=5000){lastSend=millis();sendReading();}delay(10);}
