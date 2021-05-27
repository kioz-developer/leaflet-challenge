d3.json("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-05-20&endtime=2021-05-27").then(function (earthquakeData) {
    createMap(earthquakeData);
});

function createMap(earthquakeData) {
    
    // Iterate over each feature
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Making a map
    var usaMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [earthquakes]
    });

    // Adding a tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(usaMap);
}

function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}