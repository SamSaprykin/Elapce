mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtZWxhcGNlIiwiYSI6ImNrMnVrMXNjbjExOTQzbW56amloa3FvZTYifQ.xZG1tMykgGuNCvr-EI00xQ';
        
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: guide.geometry.coordinates,
    zoom: 12
});


// create a HTML element for our project
var el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
.setLngLat(guide.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + guide.title + '</h3><p>' + guide.location + '</p>'))
.addTo(map);