# ims-starter-app

This application is intended as a starting point for contestants wanting to create geospatial maps using Predix at the Minds and Machines Hackathon November 2016 in San Francisco. It uses an existing electric utility demonstration dataset that has been pre-loaded into the [Intelligent Mapping service](https://www.predix.io/services/service.html?id=1846) in [Predix.io](https://www.predix.io/). A live example of this app can be found [here](https://imd-starter-app.run.aws-usw02-pr.ice.predix.io/).

The context for using this app and the data services it is consuming is a specific challenge for the Hackathon around grid modernisation in the electric utility market. The problem statement is that householders and other traditional consumers of electricity from the grid are increasing adding solar panels, wind generation and battery storage (collectively known as "Distributed Energy Resources" or DER) on their premise to supplement their energy consumption. Surplus energy may be returned back to the grid, but this creates issues for the control, stability and safety of the grid because the electric utility that is responsible for the grid may not have visibility of those DER sources and certainly does not have any sensor equipment measuring load or the condition of assets at the low voltage end of the network (typically the only sensors are in substations).

Given this real issue in the electricity distribution market it is clear that the Industrial Internet of Things is an enabler for creating more visibility of the low voltage parts of the electricity network which will help the utilities to manage that part of the grid as DER energy sources are added over time.

The challenge for the Hackathon given this context is to create a sensor for a utility asset that is currently "dumb" but potentially has a critical impact on supply if it has a problem. For simplicity we propose sensor-enabling a electricity pole such that if it is leaning (because of strong winds in a storm) or has fallen over, the sensor generates an alarm that is published to Predix and is shown on a map of the electricity assets. This application and the data it shows is the basis of the map visualisation part of the challenge. Specifically, there are a set of poles in the dataset that this application shows - the idea is to listen to events from your sensor that is representing that pole and when an alarm is received (e.g. the sensor reports movement), change the style of that particular pole on the map.

## Installation
Clone this repo:

`git clone https://github.com/piripinui/ims_starter_app.git`

Get the dependencies:

`npm install`

Start the app:

`npm start`

Start a browser and navigate to http://localhost:3000.