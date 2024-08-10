<script setup>
import { useTripsStore } from "../stores/trips";
import { computed, onMounted } from "vue";
import TripCard from "../components/TripCard.vue";

const tripsStore = useTripsStore();

const trips = computed(() => tripsStore.allTrips);
onMounted(() => {
  tripsStore.loadTrips();
});

//const props = defineProps(["trips"]);
</script>

<template>
  <div class="bg-light rounded-t-lg mt-14 p-3 main-container shadow-2xl">
    <h1 class="text-accent text-2xl font-semibold mt-2">Up coming Holiday</h1>
    <TripCard v-for="(trip, index) in trips" :key="index" :trip="trip" />
  </div>
</template>

<style scoped></style>
