d3.json("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-05-20&endtime=2021-05-27").then(function (earthquakeData) {
    console.log(earthquakeData);
});
