window.MapComponent = (function (window, document, api) {

    mapboxgl.accessToken = "YOUR_MAPBOX_API_KEY";
    // Holds mousedown state for events. if this
    // flag is active, we move the point on `mousemove`.
    var isDragging;

    // Is the cursor over a point? if this
    // flag is active, we listen for a mousedown event.
    var isCursorOverPoint;

    var coordinates = document.getElementById('coordinates');
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/basic-v9',
        center: [-122.4085536, 37.7788707],
        zoom: 13
    });

    var canvas = map.getCanvasContainer();

    var geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-122.3942272, 37.776503]
            }
        }]
    };

    function mouseDown() {
        if (!isCursorOverPoint) return;

        isDragging = true;

        // Set a cursor indicator
        canvas.style.cursor = 'grab';

        // Mouse events
        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    }

    function onMove(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        // Set a UI indicator for dragging.
        canvas.style.cursor = 'grabbing';

        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
        map.getSource('point').setData(geojson);
    }

    function onUp(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        // Print the coordinates of where the point had
        // finished being dragged to on the map.
        coordinates.style.display = 'block';
        coordinates.appendChild(document.createTextNode('Longitude: ' + coords.lng));
        coordinates.appendChild(document.createElement('br'));
        coordinates.appendChild(document.createTextNode('Latitude: ' + coords.lat));
        coordinates.appendChild(document.createElement('br'));
        coordinates.appendChild(document.createElement('hr'));

        // Call the Lyft SDK to retrieve driver ETA at this location 
        api.getApiLyftEta(coords.lat, coords.lng, function(res){
            for (var k in res.eta_estimates) {
                var eta = res.eta_estimates[k];
                coordinates.appendChild(document.createTextNode(eta.display_name + ': ' + eta.eta_seconds + ' sec'));
                coordinates.appendChild(document.createElement('br'));
            }
        });

        canvas.style.cursor = '';
        isDragging = false;

        // Unbind mouse events
        map.off('mousemove', onMove);
    }

    map.on('load', function() {

        // Add a single point to the map
        map.addSource('point', {
            "type": "geojson",
            "data": geojson
        });

        map.addLayer({
            "id": "point",
            "type": "circle",
            "source": "point",
            "paint": {
                "circle-radius": 10,
                "circle-color": "#352384"
            }
        });

        // When the cursor enters a feature in the point layer, prepare for dragging.
        map.on('mouseenter', 'point', function() {
            map.setPaintProperty('point', 'circle-color', '#FF00BF');
            canvas.style.cursor = 'move';
            isCursorOverPoint = true;
            map.dragPan.disable();
        });

        map.on('mouseleave', 'point', function() {
            map.setPaintProperty('point', 'circle-color', '#352384');
            canvas.style.cursor = '';
            isCursorOverPoint = false;
            map.dragPan.enable();
        });

        map.on('mousedown', mouseDown);
    });
})(window, window.document, window.ApiComponent);