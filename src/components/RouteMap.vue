<script setup>
import { onMounted, watch, ref } from "vue";
import L from "leaflet";
import PrimaryBtn from "./PrimaryBtn.vue";
// Props
const props = defineProps({
  stops: Array,
  hotel: Object,
});

let map;

// create a red polyline from an array of LatLng points
const latlngs = [];

// Example for stop marker
const stopIcon = L.divIcon({
  html: '<i class="fas fa-map-marker-alt" style="color: #FF8474; font-size: 24px;"></i>',
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

const initializeMap = () => {
  map = L.map("map", {
    center: [props.hotel.latitude, props.hotel.longitude], //@hotel
    zoom: 12,
  });
  latlngs.push([props.hotel.latitude, props.hotel.longitude]);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  L.marker([props.hotel.latitude, props.hotel.longitude], { icon: hotelIcon })
    .addTo(map)
    .bindPopup(`<b>${props.hotel.name}</b>`);

  // To ensure map renders correctly
  map.invalidateSize();
  props.stops.forEach((stop) => {
    L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
      .addTo(map)
      .bindPopup(`<b>${stop.title}</b>`);
    latlngs.push([stop.latitude, stop.longitude]);
  });
  let polyline = L.polyline(latlngs, { color: "#583D72" }).addTo(map);
  map.fitBounds(polyline.getBounds());
};

onMounted(() => {
  //tripsStore.loadTrips();
  initializeMap();
});
</script>

<template>
  <div
    class="modal-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
  >
    <div
      class="modal-container rounded-lg relative"
      style="width: 80%; height: 80%"
    >
      <div id="map" class="map-container w-full h-full"></div>
    </div>
    <PrimaryBtn
      class="close-button absolute top-2 right-2 font-body text-xl"
      @click="$emit('close')"
      >X</PrimaryBtn
    >
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
