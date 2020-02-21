function maps_init() {
    'use strict'
  
    
  
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
  }
  
  function maps_lazyload(api_key) {
    'use strict'
  
    if (api_key) {
      var options = {
        rootMargin: '100px',
        threshold: 0
      }
  
      var map = document.getElementById('map')
  
      var observer = new IntersectionObserver(
        function(entries, self) {
          // Intersecting with Edge workaround https://calendar.perfplanet.com/2017/progressive-image-loading-using-intersection-observer-and-sqip/#comment-102838
          var isIntersecting = typeof entries[0].isIntersecting === 'boolean' ? entries[0].isIntersecting : entries[0].intersectionRatio > 0
          if (isIntersecting) {
            var mapsJS = document.createElement('script')
            mapsJS.src = 'https://maps.googleapis.com/maps/api/js?callback=google_maps_init&key=' + api_key
            document.getElementsByTagName('head')[0].appendChild(mapsJS)
            self.unobserve(map)
          }
        },
        options
      )
  
      observer.observe(map)
    }
  }


  maps_lazyload('pk.eyJ1Ijoic2FtZWxhcGNlIiwiYSI6ImNrMnVrMXNjbjExOTQzbW56amloa3FvZTYifQ.xZG1tMykgGuNCvr-EI00xQ')