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
app = express();

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

var listenPort = process.env.PORT || 3000;

app.listen(listenPort, function () {
	console.log('ims-starter-app app listening on port ' + listenPort + '!');
});