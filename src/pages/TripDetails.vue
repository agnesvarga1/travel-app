<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { useTripsStore } from "../stores/trips";

const route = useRoute();
const tripsStore = useTripsStore();
const tripId = computed(() => route.params.id);

const trip = computed(() =>
  tripsStore.allTrips.find((trip) => trip.id === parseInt(tripId.value))
);

onMounted(() => {
  // Optional: Load trips if not already loaded
  if (!trip.value) {
    tripsStore.loadTrips();
  }
});
</script>

<template>
  <div class="bg-light rounded-t-lg mt-14 p-3 main-container">
    <h1 class="text-accent text-xl font-semibold mt-2 font-heading">
      Details of
    </h1>
    <div v-if="trip">
      <h1 class="text-accent text-2xl font-semibold mt-2 font-heading">
        {{ trip.title }}
      </h1>
      <div>
        <figure class="thumb">
          <img :src="`/images/${trip.cover}`" alt="cover image" />
        </figure>
        <p class="text-dark text-xs">{{ trip.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
