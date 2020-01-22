mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtZWxhcGNlIiwiYSI6ImNrMnVrMXNjbjExOTQzbW56amloa3FvZTYifQ.xZG1tMykgGuNCvr-EI00xQ';
        
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [30.545791,50.432568],
    zoom: 12.3
});


// create a HTML element for our project
var el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
.setLngLat({lng:30.545791,lat:50.432568})
.addTo(map);

