<script setup>
import { useTripsStore } from "../stores/trips";
import { onMounted, watch, ref } from "vue";
import TripCard from "../components/TripCard.vue";

const tripsStore = useTripsStore();
const trips = ref([]); // Use ref to make `trips` reactive

// Load trips on component mount
onMounted(async () => {
  await tripsStore.loadTrips();
});

// Watch for changes in `tripsStore.allTrips` and update `trips` accordingly
watch(
  () => tripsStore.allTrips, // Watch the `allTrips` array from the store
  (newTrips) => {
    trips.value = newTrips; // Update the local `trips` ref when store data changes
  },
  { immediate: true } // Trigger immediately in case `allTrips` is already populated
);
</script>

<template>
  <div
    class="bg-light rounded-t-lg mt-14 p-3 main-container shadow-2xl md:flex md:items-start md:justify-center"
  >
    <TripCard v-for="trip in trips" :trip="trip" :key="trip.id" />
  </div>
</template>

<style scoped></style>
