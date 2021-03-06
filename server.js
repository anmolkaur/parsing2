var http = require('http'); //http server and client functionality
var fs = require('fs'); //filesystemrelayed functionality
var path = require('path'); //fs path related functionality
var mime = require('mime'); //ability to derive a MIME type based on filename extension
var cache = {}; //contents of cached files are stored
var cronJob = require('cron').CronJob;
var replace = require("replace");
//var xml2json = require('node-xml2json'); 
//var request = require("request");
var xml2json = require('xmlparser');
var XmlStream = require('xml-stream');

//var libxmljs = require("libxmljs");

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents){
	response.writeHead(
		200,
		{"content-type":mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath){
	//check if file is cached in memory
	if(cache[absPath]) {
		//server file from memory
		sendFile(response, absPath, cache[absPath]);
	} 
	else {
		//check if file exists
		fs.exists(absPath, function (exists){
			if (exists){
				//read file from disk
				fs.readFile(absPath, function (err, data){
					if(err){
						send404(response);
					}
					else {
						//cache
						cache[absPath] = data;
						//and serve file from disk
						sendFile(response, absPath, data);
					}
				})
			} 
			else {
				send404(response);
			}
		});
	}

}


//create httpserver using anon function to define per-request behaviour
var server = http.createServer(function(request, response){
	var filePath = false;

	console.log(request.url);
	if(request.url == '/'){
		filePath = 'index.html'; //serve this as default
	} else {
		filePath =  request.url; //translate url path to relative file path
	}

	var absPath = './' +filePath;
	serveStatic(response, cache, absPath); //serve static file
});

server.listen(3000, function(){
	console.log("Server listening on port 3000.");
	begin();
});



//call event brite's api

//console responses

//console.log("hi");
/*
var url="https://www.eventbrite.com/json/event_search?app_key=QIY3RFGKIACEQZ32M3&keywords=toronto";


function begin(){

	request(url, function(error, response, body){
		console.log(body);
		var allText = body;
		var partsArray = body.split ('{"event":');
		console.log("                       1st entry:")
		console.log(partsArray[1]);

	});

}

*/

function begin(){
/*var parseString = require('xml2js').parseString;

	function parse_XML2json1(xmldata){	
		//var xml = "<root>Hello xml2js!</root>";
		console.log("!!!!!"+xmldata);
		parseString(xmldata, function (err, result) {
			console.log("DONE PARSING TO JSON");
	    	console.log(result);
		});
	}

	function parse_XML2json2(xmldata){	
		
	}
*/
	var url = "http://wx.toronto.ca/festevents.nsf/torontocyclingeventsfeed.xml";


	http.get(url, function(res) {
	  res.on('data', function (chunk) {
	    console.log("data is--------"+chunk);
	   
	    chunk.setEncoding('utf8');
	    var xml = new XmlStream(chunk, 'utf8');
		console.log(xml);

		//var xml = chunk.split("</lastBuildDate>");
		//xml = xml.map(function(val){return +val + 1;});
		//console.log(xml[0] + xml[1]);

		//var json = xml2json.parser(xml);

		//var xmlDoc = libxmljs.parseXml(xml);
		//console.log("json -----------------"+json);
		//var data = JSON.stringify(json);
		//console.log(data);

	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

	

/*
	var job = new cronJob('* * * * * *', function(){
		console.log('You will see this message every second');

	}, null, true, "America/Los_Angeles");
	
*/
}