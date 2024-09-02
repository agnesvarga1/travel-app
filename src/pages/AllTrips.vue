<script setup>
import { useTripsStore } from "../stores/trips";
import { onMounted, watch } from "vue";
import TripCard from "../components/TripCard.vue";

const tripsStore = useTripsStore();
const trips = tripsStore.allTrips;
onMounted(async () => {
  await tripsStore.loadTrips();
});
</script>

<template>
  <div
    class="bg-light rounded-t-lg mt-14 p-3 main-container shadow-2xl md:flex md:items-start md:justify-center"
  >
    <TripCard v-for="trip in trips" :trip="trip" :key="trip.id" />
  </div>
</template>

<style scoped></style>
