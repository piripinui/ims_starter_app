# ims-starter-app

This application is intended as a starting point for contestants wanting to create geospatial maps using Predix at the Minds and Machines Hackathon November 2016 in San Francisco. It uses an existing electric utility demonstration dataset that has been pre-loaded into the [Intelligent Mapping service](https://www.predix.io/services/service.html?id=1846) in [Predix.io](https://www.predix.io/). A live example of this app can be found [here](https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/).

## Hackathon Challenge

The context for using this app and the data services it is consuming is a specific challenge for the Hackathon around grid modernisation in the electric utility market. The problem statement is that householders and other traditional consumers of electricity from the grid are increasing adding solar panels, wind generation and battery storage (collectively known as "Distributed Energy Resources" or DER) on their premise to supplement their energy consumption. Surplus energy may be returned back to the grid, but this creates issues for the control, stability and safety of the grid because the electric utility that is responsible for the grid may not have visibility of those DER sources and certainly does not have any sensor equipment measuring load or the condition of assets at the low voltage end of the network (typically the only sensors are in substations).

Given this real issue in the electricity distribution market it is clear that the Industrial Internet of Things is an enabler for creating more visibility of the low voltage parts of the electricity network which will help the utilities to manage that part of the grid as DER energy sources are added over time.

The challenge for the Hackathon given this context is to create a sensor for a utility asset that is currently "dumb" but potentially has a critical impact on supply if it has a problem. For simplicity we propose sensor-enabling a electricity pole such that if it is leaning (because of strong winds in a storm) or has fallen over, the sensor generates an alarm that is published to Predix and is shown on a map of the electricity assets. The sensor will be created using an Intel Edison and [Predix Machine](https://www.predix.io/services/service.html?id=1185) and will connect to Predix to publish alarm events based on movement detected by the accelerometer.

This application and the data it shows is the basis of the map visualisation part of the challenge. Specifically, there are a set of poles in the dataset that this application shows - the idea is to listen to events from your sensor (which is representing that pole) and when an alarm is received (e.g. the sensor reports movement), change the style of that particular pole on the map in a prominent way.

## The Intelligent and Dynamic Mapping Services
The starter app is intended to demonstrate how to use the Intelligent and Dynamic Mapping services on Predix.io. These service provide geospatial services for storing and rendering asset locations on map, either statically or in realtime. To find out more, you can go to the [Predix.io catalog](https://www.predix.io/catalog/services/) which describes all the microservices available on Predix. The two geospatial services can be found below:

Intelligent Mapping Service - [https://www.predix.io/services/service.html?id=1846](https://www.predix.io/services/service.html?id=1846)
Dynamic Mapping Service - [https://www.predix.io/services/service.html?id=2120](https://www.predix.io/services/service.html?id=2120)

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
