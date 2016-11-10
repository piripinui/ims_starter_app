'use strict';

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

var fs = require('fs'),
request = require('request'),
apiUrl = '<Insert your collection service endpoint here>';


var addCollection = function addCollection(collectionName, contents, zoneId, bearerStr) {
	
	var contentJson = JSON.parse(contents);
	var factor = Math.round(contentJson.features.length / 1000);
	
	console.log(bearerStr);
	
	for (var i = 0; i < contentJson.features.length; i += 1000) {
		// Chop up the feature array by 1000 element chunks.
		var end = Math.min(i + 1000, contentJson.features.length);
		console.log("Uploading " + i + " to " + (end - 1) + " out of " + contentJson.features.length);
		var content = JSON.stringify({
			type: "FeatureCollection",
			features: contentJson.features.slice(i, end)
		})
		
		var options = {
			method : 'POST',
			url : apiUrl + collectionName,
			headers : {
				'Content-Type' : 'application/json',
				'Predix-Zone-Id' : zoneId,
				'x-subtenant-Id' : '<Insert your tenant id here>',
				'Authorization' : bearerStr
			},
			body : content
		};

		console.log("Requesting upload to " + apiUrl + collectionName);

		request(options, function (error, res, body) {
			if (error) {
				console.log('Problem with request', error);
			} else {
				console.log('STATUS:', res.statusCode);
				console.log('BODY:', body);
			}
		});
	}
};

var main = function main() {
	var filename = process.argv[2];
	var collectionName = process.argv[3];
	var zoneId = process.argv[4];
	var bearerStr = process.argv[5];
	var contents = fs.readFileSync(filename, 'utf-8');

	addCollection(collectionName, contents, zoneId, bearerStr);
}

main();