const http = require("http");
const fs = require("fs");
const kelvinToCelsius = require('kelvin-to-celsius');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {

	let temperature = tempVal.replace("{%tempval%}", kelvinToCelsius(orgVal.main.temp));
	temperature = temperature.replace("{%tempmin%}", kelvinToCelsius(orgVal.main.temp_min));
	temperature = temperature.replace("{%tempmax%}", kelvinToCelsius(orgVal.main.temp_max));
	temperature = temperature.replace("{%location%}", orgVal.name);
	temperature = temperature.replace("{%country%}", orgVal.sys.country);
	temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

	return temperature;
};

const server = http.createServer((req, res) => {
	if (req.url == "/"){
		requests('https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=3e7e70aca1c2b0e9e6827e985427a4a8')
	  		.on("data", (chunk) => {
			    const objdata = JSON.parse(chunk);
			    const arrData = [objdata];
			    const realTimeData = arrData
			      .map((val) => replaceVal(homeFile, val))
			      .join("");
			    res.write(realTimeData);
	  		})
			.on("end", (err) => {
			    if (err) return console.log("connection closed due to errors", err);
			    res.end();
			});
	} 
  	else{
    	res.end("File not found");
  	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("listening to port 8000");
});
