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

function init() {

	// Define a set of styles to use when the features are rendered on the map.
	var styles = {
		ed_pole : new ol.style.Style({
			image : new ol.style.Circle({
				radius : 5,
				fill : new ol.style.Fill({
					color : 'red',
					opacity : 0.6
				}),
				stroke : new ol.style.Stroke({
					color : 'black',
					opacity : 0.4
				})
			})
		}),
		ed_oh_transformer : new ol.style.Style({
			image : new ol.style.Circle({
				radius : 2,
				fill : new ol.style.Fill({
					color : 'purple',
					opacity : 0.6
				}),
				stroke : new ol.style.Stroke({
					color : 'black',
					opacity : 0.4
				})
			})
		}),
		ed_demand_point : new ol.style.Style({
			image : new ol.style.Circle({
				radius : 2,
				fill : new ol.style.Fill({
					color : 'green',
					opacity : 0.6
				}),
				stroke : new ol.style.Stroke({
					color : 'black',
					opacity : 0.4
				})
			})
		}),
		ed_handhole : new ol.style.Style({
			image : new ol.style.Circle({
				radius : 2,
				fill : new ol.style.Fill({
					color : 'blue',
					opacity : 0.6
				}),
				stroke : new ol.style.Stroke({
					color : 'black',
					opacity : 0.4
				})
			})
		}),
		ed_light : new ol.style.Style({
			image : new ol.style.Circle({
				radius : 2,
				fill : new ol.style.Fill({
					color : 'orange',
					opacity : 0.6
				}),
				stroke : new ol.style.Stroke({
					color : 'black',
					opacity : 0.4
				})
			})
		}),
		ed_ug_secondary_conductor : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.6)'
			}),
			stroke : new ol.style.Stroke({
				color : '#319FD3',
				width : 2
			})
		}),
		ed_ug_primary_conductor : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'purple'
			}),
			stroke : new ol.style.Stroke({
				color : 'purple',
				width : 2
			})
		}),
		ed_oh_secondary_conductor : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 0, 0.6)'
			}),
			stroke : new ol.style.Stroke({
				color : '#319FD3',
				width : 2
			})
		}),
		ed_oh_primary_conductor : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 0, 0, 0.6)'
			}),
			stroke : new ol.style.Stroke({
				color : '#319FD3',
				width : 2
			})
		}),
		sub_substation : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(0, 0, 255, 0.6)'
			}),
			stroke : new ol.style.Stroke({
				color : 'black',
				width : 2
			})
		})
	}

	// Create the array of layers adding an OpenStreetMap layer as the base map.
	var mapLayers = [
		new ol.layer.Tile({
			source : new ol.source.OSM()
		})
	];

	var geoFormatter = new ol.format.GeoJSON({
			defaultDataProjection : 'EPSG:4326',
			projection : 'EPSG:3857'
		});

	function defineAndGetLayer(layerProp) {
		if (layers.hasOwnProperty(layerProp)) {
			// Create a new Openlayers 3 layer.
			var layerName = layerProp;
			var aLayer = new ol.layer.Vector({
					source : new ol.source.Vector({
						format : new ol.format.GeoJSON()
					}),
					style : function (feature, resolution) {
						return styles[layerName];
					}
				});
				
			aLayer.layerName = layers[layerProp];

			mapLayers.push(aLayer);

			// Fetch the layer data and add it to the layer's source.
			$.ajax({
				url : '/v1/collections/' + layerName,
				type : 'GET',
				success : function (data) {
					var features = geoFormatter.readFeatures(data, {
							dataProjection : 'EPSG:4326',
							featureProjection : 'EPSG:3857'
						});
					console.log("Collection call succeeded for /v1/collections/" + layerName + " (" + features.length + " features)");
					aLayer.getSource().addFeatures(features);
				}
			});
		}
	}

	var layers = {
		'ed_oh_secondary_conductor' : 'Overhead Secondary Conductor',
		'ed_ug_secondary_conductor' : 'Underground Secondary Conductor',
		'ed_oh_primary_conductor' : 'Overhead Primary Conductor',
		'ed_ug_primary_conductor' : 'Underground Primary Conductor',
		'ed_handhole' : 'Handhole',
		'ed_pole' : 'Pole',
		'sub_substation' : 'Substation',
		'ed_oh_transformer' : 'Overhead Transformer',
		'ed_demand_point' : 'Demand Point',
		'ed_light' : 'Streetlight'
	}

	// Create the layers for the map.
	for (var layerProp in layers) {
		defineAndGetLayer(layerProp);
	}

	// Create an Openlayers 3 map using the layers defined above.
	var map = new ol.Map({
			layers : mapLayers,
			target : 'map',
			view : new ol.View({
				// Hardwired to centre the map over Cortland, NY.
				center : ol.proj.transform([-76.180484, 42.601181], 'EPSG:4326', 'EPSG:3857'),
				zoom : 10
			})
		});

		
	// Create an overlay for popups when the users clicks on the map.
	var popup = new ol.Overlay({
			element : document.getElementById('popup')
		});
	map.addOverlay(popup);

	// Add an event handler for when the user clicks on the map which raises a popover with the selected feature or the location in degrees.
	map.on('click', function (evt) {
		var element = popup.getElement();
		var coordinate = evt.coordinate;
		var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
					coordinate, 'EPSG:3857', 'EPSG:4326'));
		var pixel = evt.pixel;
		var content = '';
		var feature;

		var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
				$(element).attr("title", layer.layerName);
				return feature;
			});

		if (typeof feature != 'undefined') {
			var props = feature.getProperties();
			for (var property in props) {
				if (props.hasOwnProperty(property)) {
					if (property != "geometry") {
						if (props[property] != 'unset' && props[property] != '') {
							content += '<p>' + property + ': ' + props[property] + '</p>'
						}
					}
				}
			}
		}
		else {
			$(element).attr("title", "Location");
		}

		$(element).popover('destroy');
		popup.setPosition(coordinate);
		// the keys are quoted to prevent renaming in ADVANCED_OPTIMIZATIONS mode.
		$(element).popover({
			'placement' : 'top',
			'animation' : false,
			'html' : true,
			'content' : content + '<code>' + hdms + '</code>'
		});
		$(element).popover('show');
	});
}