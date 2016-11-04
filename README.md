# ims-starter-app

This application is intended as a starting point for contestants wanting to create geospatial maps using Predix at the Minds and Machines Hackathon November 2016 in San Francisco. It uses an existing electric utility demonstration dataset that has been pre-loaded into the [Intelligent Mapping service](https://www.predix.io/services/service.html?id=1846) in [Predix.io](https://www.predix.io/). A live example of this app can be found [here](https://ims-starter-app.run.aws-usw02-pr.ice.predix.io/).

## Hackathon Challenge

The context for using this app and the data services it is consuming is a specific challenge for the Hackathon around grid modernisation in the electric utility market. The problem statement is that householders and other traditional consumers of electricity from the grid are increasing adding solar panels, wind generation and battery storage (collectively known as "Distributed Energy Resources" or DER) on their premise to supplement their energy consumption. Surplus energy may be returned back to the grid, but this creates issues for the control, stability and safety of the grid because the electric utility that is responsible for the grid may not have visibility of those DER sources and certainly does not have any sensor equipment measuring load or the condition of assets at the low voltage end of the network (typically the only sensors are in substations).

Given this real issue in the electricity distribution market it is clear that the Industrial Internet of Things is an enabler for creating more visibility of the low voltage parts of the electricity network which will help the utilities to manage that part of the grid as DER energy sources are added over time. See [this article](https://dupress.deloitte.com/dup-us-en/focus/internet-of-things/iot-in-electric-power-industry.html) for more background.

The challenge for the Hackathon is based on this trend. The scenario is to create a sensor for a utility asset that is currently "dumb" but potentially has a critical impact on supply if it has a problem. For simplicity we propose sensor-enabling a electricity pole such that if it is leaning (because of strong winds in a storm) or has fallen over, the sensor generates an alarm that is published to Predix and is shown on a map of the electricity assets. The sensor will be created using an Intel Edison and [Predix Machine](https://www.predix.io/services/service.html?id=1185) and will connect to Predix to publish alarm events based on movement detected by an accelerometer. For a tutorial of how to use this device with Predix Machine, see [here](https://www.predix.io/resources/tutorials/journey.html#1752).

This application and the data it shows is the basis of the map visualisation part of the challenge. Specifically, there are a set of poles in the dataset that this application shows - the idea is to listen to events from your sensor (which is representing that pole) and when an alarm is received (e.g. the sensor reports movement), change the style of that particular pole on the map in a prominent way.

## The Intelligent and Dynamic Mapping Services
The starter app is intended to demonstrate how to use the Intelligent and Dynamic Mapping services on Predix.io. These service provide geospatial services for storing and rendering asset locations on map, either statically or in realtime. To find out more, you can go to the [Predix.io catalog](https://www.predix.io/catalog/services/) which describes all the microservices available on Predix. The two geospatial services can be found below:

* Intelligent Mapping Service - [https://www.predix.io/services/service.html?id=1846](https://www.predix.io/services/service.html?id=1846)
* Dynamic Mapping Service - [https://www.predix.io/services/service.html?id=2120](https://www.predix.io/services/service.html?id=2120)

The services have extensive documentation about how to use them - see [https://sw-intelligent-mapping.github.io/smallworld-mapping-services/index.htm](https://sw-intelligent-mapping.github.io/smallworld-mapping-services/index.htm).

## Installation
Clone this repo:

`git clone https://github.com/piripinui/ims_starter_app.git`

Get the dependencies:

`npm install`

Start the app:

`npm start`

Start a browser and navigate to http://localhost:3000.

## How it works

The starter app uses [Openlayers 3](https://openlayers.org/) to display the map. It sets up a map using [Openstreetmap](https://www.openstreetmap.org) as the base layer and then adds the electricity distribution asset locations on top of that map as vector layers. 

The application is set up so that when the user clicks on the map a popover will be raised. If the location at which the mouse click coincides with one of the assets, the popover will have a heading corresponding to the layer that asset is on (as above) or just the coordinates of the location in lat/lon degrees.

The application is also set up to listen to event alarms that are generated externally. For demonstration purposes such an event can be simulated from the server application.

### Structure
The app consists of a HTML/Javascript client (held in the public directory) and a nodejs server (in the root directory). The server serves up the static HTML and Javascript of the client on port 3000 and redirects requests from the client to the Predix data endpoints described above. 

The server also sets up a [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) connection for every client that connects to it. This connection is used to demonstrate how the client can listen to external events like alarms from sensors in real-time.

### Vector Data and Service Endpoints

There are 10 layers in the dataset:
* Overhead Secondary Conductor
* Underground Secondary Conductor
* Overhead Primary Conductor
* Underground Primary Conductor
* Handhole
* Pole
* Substation
* Overhead Transformer
* Demand Point
* Streetlight

The data for each layer is retrieved from an instance of the [Predix Intelligent Mapping service](https://www.predix.io/services/service.html?id=1846) using AJAX requests to service endpoints whose path correspond to the layers above. For example:

* Overhead Secondary Conductor - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_oh_secondary_conductor
* Underground Secondary Conductor - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_ug_secondary_conductor
* Overhead Primary Conductor - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_oh_primary_conductor
* Underground Primary Conductor - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_ug_primary_conductor
* Handhole - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_handhole
* Pole - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_pole
* Substation - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/sub_substation
* Overhead Transformer - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_oh_transformer
* Demand Point - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_demand_point
* Streetlight - https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/v1/collections/ed_light

Each service request returns a [GeoJSON FeatureCollection](http://geojson.org/geojson-spec.html) which is used to create the vector features for each layer and display them on the map.

The GeoJSON data that was used to create the datasets in the endpoints above is available in the data directory, for reference.

Note that only GET requests can be made to the service above, meaning that it is not possible to delete or update the records in that dataset. This has been done deliberately since many people will be using the same data. If you wish to update or delete data, you will need to create your own instance of Intelligent Mapping and upload the example data. For more information on how to do that, see "Creating your own Intelligent or Dynamic Mapping Services" below.

## Responding to Events
The starter app is set up to respond to real-time events using the [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE) technology. The idea is that the sensor device will create an event based on movement of the device (detected by accelerometer) and that event will be published in the Predix Cloud where it will be consumed by your application. Rather than polling for the event, the application will listen using SSE. When it is notified of an event it will find the relevant pole (using the pole's id property) and generate a "ripple" effect over the pole's location on the map. You can see a simulation of how this works by generating a mock event using the following URL:

[https://ims-starter-app.run.aws-usw02-pr.ice.predix.io/generateevent](https://ims-starter-app.run.aws-usw02-pr.ice.predix.io/generateevent)

By issuing this request from your browser you should see a "ripple" effect drawn on the map for pole with the id of 92423. For your application clearly that event would be coming from the Predix Machine-enabled sensor device, not simulated as in this example.

# Creating your own Intelligent or Dynamic Mapping Services
You may wish to create your own Intelligent and/or Dynamic Mapping instances rather than using the pre-loaded one described above. A reason for doing this would be to, for example, create maps using your own geospatial data rather the utility example dataset. 
In order to do this you must create your own service instances (including authentication using UAA), bind them to your app and then upload sets of GeoJSON data to that instance. The first two steps are described in the documentation for both Intelligent and Dynamic Mapping [here](https://sw-intelligent-mapping.github.io/smallworld-mapping-services/index.htm#IntelligentMappingServices/ProcessOverview.htm%3FTocPath%3DGetting%2520started%2520with%2520Intelligent%2520Mapping%2520and%2520Dynamic%2520Mapping%2520services%7C_____0).

Once you've completed the setup, you need to upload data to the service. A script is included in this repository for that purpose called uploader.js. You will need to modify the script to include the URI of your app and have the zone id and bearer token to authenticate you to supply as parameters. To run the script, issue the following command:

`node uploader.js <name of GeoJSON file> <name of the collection> <zone id> <bearer string>`
