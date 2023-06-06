// Fetch the earthquake data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson")
    .then(response => response.json())
    .then(data => {
        // Create the map
        const map = L.map('map').setView([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Define a color function based on the earthquake depth
        function getColor(depth) {
            if (depth < 10) {
                return "#2ca25f";  // green
            } else if (depth < 30) {
                return "#fdae6b";  // orange
            } else {
                return "#d7191c";  // red
            }
        }

        // Complete for each relevant earthquake and add markers
        data.features.forEach(feature => {
            const magnitude = feature.properties.mag;
            const depth = feature.geometry.coordinates[2];
            const location = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            const popupText = `Magnitude: ${magnitude}<br>Depth: ${depth}`;

            const circle = L.circleMarker(location, {
                radius: magnitude * 2,
                color: getColor(depth),
                fillColor: getColor(depth),
                fillOpacity: 0.7
            }).addTo(map);

            circle.bindPopup(popupText);
        });

        // Create a legend for the depth colors
        const legend = L.control({ position: 'bottomleft' });
        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<strong>Depth</strong><br>';
            div.innerHTML += '<span style="color:#2ca25f;">&nbsp;&#9679;</span> < 10 km<br>';
            div.innerHTML += '<span style="color:#fdae6b;">&nbsp;&#9679;</span> 10-30 km<br>';
            div.innerHTML += '<span style="color:#d7191c;">&nbsp;&#9679;</span> > 30 km<br>';
            return div;
        };
        legend.addTo(map);
    });