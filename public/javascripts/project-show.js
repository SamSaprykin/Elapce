mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtZWxhcGNlIiwiYSI6ImNrMnVrMXNjbjExOTQzbW56amloa3FvZTYifQ.xZG1tMykgGuNCvr-EI00xQ';
 
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: project.geometry.coordinates,
    zoom: 12
});


// create a HTML element for our project
var el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
.setLngLat(project.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + project.title + '</h3><p>' + project.location + '</p>'))
.addTo(map);





$('.toggle-edit-form').on('click', function(){
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit')
    $(this).siblings('.edit-review-form').toggle();
});

// add click listener for clearing rating

$('.clear-rating').click(function(){
    $(this).siblings('.input-no-rate').click();
})




    