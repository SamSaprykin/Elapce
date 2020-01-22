function geoFindMe(e) {
    e.preventDefault();
    

    const status = document.getElementById('status')
    const locationInput = document.getElementById('location')

    function success (position) {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;

        status.textContent = '';
        locationInput.value = `[${longitude}, ${latitude}]`;
    }

    function error () {
        status.textContent = 'Unable to retriev your location';
    }

    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported in your browser';
    } else {
        status.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(success, error)
    }
}

document.getElementById('find-me').addEventListener('click', geoFindMe);