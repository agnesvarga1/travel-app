<script setup>
import { onMounted, onUpdated, computed } from "vue";
import L from "leaflet";
import PrimaryBtn from "./PrimaryBtn.vue";
import { useTripsStore } from "../stores/trips";

const tripsStore = useTripsStore();

// Example for stop marker
const stopIcon = L.divIcon({
  html: '<i class="fas fa-map-marker-alt" style="color: #FF8474; font-size: 24px;"></i>',
  className: "custom-marker",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Example for restaurant marker
const restaurantIcon = L.divIcon({
  html: '<i class="fas fa-utensils" style="color: #9F5F80; font-size: 24px;"></i>',
  className: "custom-marker",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Example for hotel marker
const hotelIcon = L.divIcon({
  html: '<i class="fas fa-hotel" style="color: #583D72; font-size: 24px;"></i>',
  className: "custom-marker",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

const trips = computed(() => tripsStore.allTrips);
let map;
const getMarkers = () => {
  //console.log(trips.value);
  trips.value.forEach((trip) => {
    trip.days.forEach((day) => {
      day.stops.forEach((stop) => {
        L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
          .addTo(map)
          .bindPopup(`<b>${stop.title}</b>`);
      });
    });
    if (trip.hotels) {
      trip.hotels.forEach((hotel) => {
        //console.log(hotel);
        L.marker([hotel.latitude, hotel.longitude], { icon: hotelIcon })
          .addTo(map)
          .bindPopup(`<b>${hotel.name}</b>`)
          .openPopup();
      });
    }

    trip.restaurants.forEach((restaurant) => {
      L.marker([restaurant.latitude, restaurant.longitude], {
        icon: restaurantIcon,
      })
        .addTo(map)
        .bindPopup(`<b>${restaurant.name}</b>`);
    });
  });
};

const initializeMap = () => {
  map = L.map("map", {
    center: [48.8566, 2.3522], // Paris
    zoom: 12,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // To ensure map renders correctly
  map.invalidateSize();
  getMarkers();
};

onMounted(() => {
  tripsStore.loadTrips();
  initializeMap();
});

onUpdated(() => {
  const mapContainer = document.getElementById("map");
  if (mapContainer) {
    const map = L.map(mapContainer);
    map.invalidateSize(); // Ensure map resizes correctly
  }
});
</script>

<template>
  <div
    class="modal-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
  >
    <div class="modal-container rounded-lg" style="width: 80%; height: 80%">
      <PrimaryBtn
        class="close-button absolute top-2 right-2 font-body text-xl"
        @click="$emit('close')"
        >X</PrimaryBtn
      >
      <div id="map" class="map-container w-full h-full"></div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  width: 80%;
  height: 80%;
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>
