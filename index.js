const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile= fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp + " °C");
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min + " °C");
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max + " °C");
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url === "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Jaipur&appid=c3b64fb503f0a6a10aacbb3e6b1e8690&units=metric")
        .on ("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            console.log(realTimeData);
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if(err) return console.log("connection lost", err);
            res.end();
        });
    }
});

server.listen(4000,function(){
    console.log("server running at port 4000");
});