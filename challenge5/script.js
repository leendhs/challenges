<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GeoGame</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <style>
    #map {
      height: 400px;
    }

    #message {
      position: fixed;
      top: 20px;
      left: 20px;
      background-color: white;
      padding: 10px;
      border: 1px solid black;
      display: none;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="message"></div>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const map = L.map('map').setView([51.0259, 4.4773], 13); // Mechelen coördinaten en zoomniveau

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const locations = [
        { name: 'Locatie 1', coords: [51.0259, 4.4773], message: 'Dit is locatie 1' }, // Grote Markt
        { name: 'Locatie 2', coords: [51.025, 4.482], message: 'Dit is locatie 2' }, // Sint-Romboutskathedraal
        { name: 'Locatie 3', coords: [51.025, 4.474], message: 'Dit is locatie 3' }, // Dossin Kazerne
        { name: 'Locatie 4', coords: [51.030, 4.491], message: 'Dit is locatie 4' }, // Technopolis
        { name: 'Locatie 5', coords: [51.024, 4.465], message: 'Dit is locatie 5' } // Kazerne Dossin Museum
      ];

      // Plaats markers voor elke locatie
      locations.forEach(location => {
        L.marker(location.coords).addTo(map).bindPopup(location.name);
      });

      // Functie om de afstand tussen twee coördinaten te berekenen (Haversine-formule)
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // straal van de aarde in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
      }

      // Functie om een bericht weer te geven
      function showMessage(message) {
        const messageDiv = document.getElementById('message');
        messageDiv.innerText = message;
        messageDiv.style.display = 'block';
      }

      // Functie om te controleren of de speler dichtbij een locatie is
      function checkLocationProximity(userLat, userLng) {
        locations.forEach(location => {
          const distance = calculateDistance(userLat, userLng, location.coords[0], location.coords[1]);
          if (distance < 0.1) { // Als de speler binnen 100 meter van de locatie is
            showMessage(location.message);
          }
        });
      }

      // Functie om de locatie van de gebruiker te verwerken
      function onLocationFound(e) {
        const userLat = e.latitude;
        const userLng = e.longitude;

        // Controleer of de speler in de buurt van een locatie is
        checkLocationProximity(userLat, userLng);
      }

      // Luister naar de locatieveranderingen van de gebruiker
      map.on('locationfound', onLocationFound);
      map.locate({ setView: true, maxZoom: 16 });
    });
  </script>
</body>
</html>
