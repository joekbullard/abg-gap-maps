var map = L.map("map",
  {
    minZoom: 10,
    maxBounds: [
      [51.3333, -2.8500], // Southwest corner
      [51.6833, -2.3000]  // Northeast corner
      ], 
  }
).setView([51.454, -2.587], 11);


L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20,
}).addTo(map);

fetch(
  "./data/avon_osgrid.geojson"
)
  .then((response) => response.json())
  .then((gridData) => {
    L.geoJSON(gridData, {
      style: {
        color: "grey",
        weight: 0.5,
        fillColor: "transparent",
        fillOpacity: 0,
      }
    }).addTo(map);  // Add this GeoJSON layer to the map
  })
  .catch((error) => console.error("Error loading GeoJSON:", error));


  const yearColors = [
    { min: 2024, color: "#000004", label: "2024+" },
    { min: 2019, color: "#781c6d", label: "2019 - 2023" },
    { min: 2014, color: "#ed6925", label: "2014 - 2018" },
    { min: 0, color: "#fcffa4", label: "Pre-2014" }
];

function getColor(year) {
  for (let range of yearColors) {
      if (year >= range.min) {
          return range.color;
      }
  }
  return "#fcffa4"; // Default color (should match the lowest range)
}


function styleFeature(feature) {
  return {
      color: "grey",
      weight: 1,
      fillColor: getColor(feature.properties.year),
      fillOpacity: 0.7,
  };
}

let geojsonLayer = null;

const speciesGeojson = {
    barbastelle: "./data/barbs.geojson",
    bechsteins: "./data/bechs.geojson",
    lhs: "./data/lhs.geojson",
    ghs: "./data/ghs.geojson"
};

function loadSpeciesData(species) {
    let url = speciesGeojson[species];

    if (!url) return;

    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: styleFeature,
            }).addTo(map);
        })
        .catch(error => console.error("Error loading GeoJSON:", error));
}



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');

  yearColors.forEach(range => {
      div.innerHTML +=
          '<i style="background:' + range.color + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ' +
          range.label + '<br>';
  });

  return div;
};

legend.addTo(map);

document.addEventListener("DOMContentLoaded", function () {
    let defaultSpecies = document.getElementById("speciesSelect").value;
    loadSpeciesData(defaultSpecies);
});

document.getElementById("speciesForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let selectedSpecies = document.getElementById("speciesSelect").value;
    loadSpeciesData(selectedSpecies);
});
