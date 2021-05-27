d3.json("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02").then(function (earthquakeData) {
    console.log(earthquakeData);
});