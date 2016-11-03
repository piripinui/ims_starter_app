/* Copyright 2016 General Electric Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

var express = require('express'),
request = require('request'),
app = express(),
sseConns = [];

app.use(express.static(__dirname + '/public'));

function handleRequest(req, res) {
	// Routing the request to a set of service endpoints on Predix that contain the hackathon utility distribution network
	// data pre-loaded.
	var url = 'https://imd-example-app.run.aws-usw02-pr.ice.predix.io' + req.url;

	var options = {
		url : url 
	}

	var myRequest = request(options);

	myRequest.on('response', function (response) {
		if (response.statusCode != 200) {
			console.log("Error: " + response.statusCode);
		} else {
			myRequest.pipe(res);
		}
	})
}

app.get('/v1/collections/*', handleRequest);

function updateSSEListeners(msg, data) {
	sseConns.forEach(function(element, index, array) {
		element(msg, data);
	});
}

function startSSE(req, res) {
	// Create a response to a SSE request from the client, which establishes a stream connection between this
	// server and that client. Returns a function that is used to send events back to client subsequently.
	console.log("Sending event stream response...");
	res.writeHead(200, {
		'Content-Type' : 'text/event-stream',
		'Cache-Control' : 'no-cache',
		'Connection' : 'keep-alive'
	});
	res.write("\n");
	console.log("Event source request responded to.");
	sequence = 0;
	return function sendSSE(eventName, eventData, id) {
		//console.log("Sending event stream data for " + eventName);
		res.write("event: " + eventName + "\n");
		res.write("data: " + JSON.stringify(eventData) + "\n\n");
	}
}

app.get('/events', function (req, res) {
	// Got a request for an SSE connection - need to respond.
	if (req.headers.accept && req.headers.accept == 'text/event-stream') {
		if (req.url == '/events') {
			console.log("Got event request from " + req.headers.referer);
			// Respond to the SSE request and push the sse function onto the list of listening clients.
			sseConns.push(startSSE(req, res));
		} else {
			res.writeHead(404);
			res.end();
		}
	} else {
		res.writeHead(500, {
			'Content-Type' : 'text/html'
		});
		res.write("Malformed request");
		res.end();
	}
})

app.get('/generateevent', function(req, res) {
	// Got a request to generate a mock event for the application to respond to.
	updateSSEListeners('alarm', {
		poleId: "75605"
	});
	
	res.writeHead(200, {
		'Content-Type' : 'text/html'
		});
	res.write("Event generated successfully");
	res.end();
})

var listenPort = process.env.PORT || 3000;

app.listen(listenPort, function () {
	console.log('ims-starter-app app listening on port ' + listenPort + '!');
});