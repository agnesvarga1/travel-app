<script setup>
import { useTripsStore } from "../stores/trips";
import { onMounted, reactive, ref, watch, onBeforeMount } from "vue";
import TripCard from "../components/TripCard.vue";
import { RouterLink, useRoute } from "vue-router";
import moment from "moment";

const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};

const tripsStore = useTripsStore();
const trips = reactive(tripsStore.allTrips);

onMounted(async () => {
  await tripsStore.loadTrips(); // Ensure data is loaded first

  findOngoingAndUpcomingTrips(); // Then find trips
});

const now = moment().format("YYYY-MM-DD");

const ongoingTrip = ref(null);
const upcomingTrip = ref(null);

const findOngoingAndUpcomingTrips = () => {
  let closestUpcoming = null;

  for (const trip of trips) {
    const tripStart = moment(trip.startDate).format("YYYY-MM-DD");
    const tripEnd = moment(trip.endDate).format("YYYY-MM-DD");

    // Check if the trip is ongoing
    if (moment(now).isBetween(tripStart, tripEnd, null, "[]")) {
      ongoingTrip.value = trip;

      return; // Exit early if we find an ongoing trip
    }

    // If no ongoing trip, find the closest upcoming trip
    if (moment(now).isBefore(tripStart)) {
      if (
        !closestUpcoming ||
        moment(tripStart).isBefore(moment(closestUpcoming.startDate))
      ) {
        closestUpcoming = trip;
      }
    }
  }

  // If no ongoing trip, set the closest upcoming one
  if (!ongoingTrip.value) {
    upcomingTrip.value = closestUpcoming;
  }
};

watch(trips, (newTrip) => {
  findOngoingAndUpcomingTrips();
});
</script>
class=""
<template>
  <div class="bg-light rounded-t-lg mt-14 p-3 main-container shadow-2xl">
    <h1
      v-if="ongoingTrip"
      class="text-accent text-2xl font-semibold mt-2 sm:w-full md:w-10/12 md:mx-auto"
    >
      Happening Now
    </h1>
    <h1
      v-else-if="upcomingTrip"
      class="text-accent text-2xl font-semibold mt-2 sm:w-full md:w-10/12 md:mx-auto"
    >
      Next Holiday
    </h1>

    <!-- Show the ongoing trip if it exists -->
    <div v-if="ongoingTrip">
      <TripCard :trip="ongoingTrip" />
    </div>

    <!-- If no ongoing trip, show the next upcoming trip -->
    <div v-else-if="upcomingTrip">
      <TripCard :trip="upcomingTrip" />
    </div>
    <h1
      v-else-if="upcomingTrip === null && ongoingTrip === null"
      class="text-accent text-2xl font-semibold mt-2"
    >
      No trip planned! Click
      <router-link
        :to="{ name: 'add' }"
        class="relative p-1 text-center nav-item cursor-pointer text-dark text-3xl"
        :class="{ active: isActive('/add') }"
      >
        here </router-link
      >to add one or on the plus sign!
    </h1>
  </div>
</template>

<style scoped></style>
