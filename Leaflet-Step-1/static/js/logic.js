var colors = ['#a3f600', '#dcf400', '#f7db11', '#fdb72a', '#fca35d', '#ff5f65'];
var steps = [];

var min_depth = 0;
var max_depth = 0;

d3.json("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-05-20&endtime=2021-05-27").then(function (earthquakeData) {
    var depths = earthquakeData.features.map(d => d.geometry.coordinates[2]);
    min_depth = Math.ceil(d3.min(depths));
    max_depth = d3.max(depths);

    steps_size = max_depth / 6

    steps[0] = Math.ceil(steps_size); 
    steps[1] = Math.ceil(steps_size * 2);
    steps[2] = Math.ceil(steps_size * 3);
    steps[3] = Math.ceil(steps_size * 4);
    steps[4] = Math.ceil(steps_size * 5);
    steps[5] = Math.ceil(steps_size * 6);

    createMap(earthquakeData);
});

function createMap(earthquakeData) {

    // Craete earthquake map
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circle(latlng, {
                fillOpacity: 0.75,
                color: "white",
                weight: 1,
                fillColor: getColorByDepth(geoJsonPoint.geometry.coordinates[2]),
                // Setting our circle's radius equal to the output of our markerSize function
                // This will make our marker's size proportionate to its magnitude
                radius: (geoJsonPoint.properties.mag*20000)
            });
        }
    }).bindPopup(function (layer) {
        return "<h3>" + layer.feature.properties.place +
        "</h3><hr><p>Datetime: " + new Date(layer.feature.properties.time) + "</p>" +
        "<p>Magnitude: " + layer.feature.properties.mag + "</p>";
    });


    // Create a tile layer
    var streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Create the map object with options
    var worldMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetLayer, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers({
        "Light Map": streetLayer
    }, {
        "Earthquakes": earthquakes
    }, {
        collapsed: false
    }).addTo(worldMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");

        div.innerHTML = `
        <p>
            <span style="background-color: ${colors[0]}"></span>
            <span class="leg-text">${min_depth}-${steps[0]}</span>
        </p>
        <p>
            <span style="background-color: ${colors[1]}"></span>
            <span class="leg-text">${steps[0]}-${steps[1]}</span>
        </p>
        <p>
            <span style="background-color: ${colors[2]}"></span>
            <span class="leg-text">${steps[1]}-${steps[2]}</span>
        </p>
        <p>
            <span style="background-color: ${colors[3]}"></span>
            <span class="leg-text">${steps[2]}-${steps[3]}</span>
        </p>
        <p>
            <span style="background-color: ${colors[4]}"></span>
            <span class="leg-text">${steps[3]}-${steps[4]}</span>
        </p>
        <p>
            <span style="background-color: ${colors[5]}"></span>
            <span class="leg-text">${steps[4]}-${steps[5]}</span>
        </p>
        `;

        return div;
    };

    // Adding legend to the map
    legend.addTo(worldMap);
}

function getColorByDepth(depth) {
    if (depth >= min_depth && depth < steps[0]) {
        return colors[0];
    } else if (depth >= steps[0] && depth < steps[1]) {
        return colors[1];
    } else if (depth >= steps[1] && depth < steps[2]) {
        return colors[2];
    } else if (depth >= steps[2] && depth < steps[3]) {
        return colors[3];
    } else if (depth >= steps[3] && depth < steps[4]) {
        return colors[4];
    } else if (depth >= steps[4] && depth < steps[5]) {
        return colors[5];
    }
        
}
