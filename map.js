var map = L.map("map").setView([51.454, -2.587], 11);

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
      },
    }).addTo(map);  // Add this GeoJSON layer to the map
  })
  .catch((error) => console.error("Error loading GeoJSON:", error));



  function styleFeature(feature) {
    let year = feature.properties.year;

    if (year >= 2024) {
        return {
            color: "grey",
            weight: 1,
            fillColor: "#000004",
            fillOpacity: 0.7,
        };
    } else if (year >= 2019 && year < 2024) {
        return {
            color: "grey",
            weight: 1,
            fillColor: "#781c6d",
            fillOpacity: 0.7,
        };
    } else if (year >= 2014 && year < 2019) {
        return {
            color: "grey",
            weight: 1,
            fillColor: "#ed6925",
            fillOpacity: 0.7,
        };
    } else {
        return {
            color: "grey",
            weight: 1,
            fillColor: "#fcffa4",
            fillOpacity: 0.7,
        };
    }
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
                style: styleFeature
            }).addTo(map);
        })
        .catch(error => console.error("Error loading GeoJSON:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    let defaultSpecies = document.getElementById("speciesSelect").value;
    loadSpeciesData(defaultSpecies);
});

document.getElementById("speciesForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let selectedSpecies = document.getElementById("speciesSelect").value;
    loadSpeciesData(selectedSpecies);
});
