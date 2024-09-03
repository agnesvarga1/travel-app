<script setup>
import PrimaryBtn from "./PrimaryBtn.vue";
import SecondaryBtn from "./SecondaryBtn.vue";
import { useTripsStore } from "../stores/trips";
import { RouterLink } from "vue-router";
import LocationsMap from "./LocationsMap.vue";
import { ref } from "vue";

const getImageSrc = (img) => {
  if (img.startsWith("data:image")) {
    return img;
  }
  // Otherwise image from the public folder
  return `/images/${img}`;
};

defineProps({
  trip: Object,
});
let isModal = ref(false);
let isDeleteModal = ref(false);

const tripsStore = useTripsStore();
</script>
<template>
  <div
    class="trip-card w-80 mx-auto shadow-lg mt-3 rounded-lg overflow-hidden realtive"
  >
    <div class="card-header">
      <img :src="getImageSrc(trip.cover)" :alt="trip.title" />
    </div>
    <div class="card-body p-2">
      <div class="flex justify-between">
        <div class="text-sm mb-2">
          <h2 class="text-primary font-heading text-xl">{{ trip.title }}</h2>

          <span class="font-body">From: {{ trip.startDate }} </span><br />
          <span class="font-body"> To: {{ trip.endDate }}</span>
        </div>
        <div @click="isModal = true">
          <font-awesome-icon
            class="bg-primary rounded-md p-2 text-xl text-light hover:bg-dark cursor-pointer"
            :icon="['fas', 'map-location-dot']"
          />
        </div>
      </div>

      <p class="text-sm font-body leading-5">{{ trip.description }}</p>
      <LocationsMap v-if="isModal" @close="isModal = false" :id="trip.id" />
    </div>
    <div class="card-footer p-3 flex justify-center flex-col gap-1">
      <PrimaryBtn class="w-full">
        <router-link :to="{ name: 'TripDetails', params: { id: trip.id } }">
          View Details
        </router-link>
      </PrimaryBtn>
      <SecondaryBtn @click="isDeleteModal = true">Delete Trip</SecondaryBtn>
    </div>
    <div
      v-if="isDeleteModal"
      class="max-w-md mx-auto mt-20 bg-white shadow-lg p-2 rounded-lg absolute w-80 top-14"
    >
      <h2 class="font-heading text-dark">Are you sure to DELETE this item?</h2>
      <div class="flex justify-end gap-1">
        <PrimaryBtn @click="tripsStore.deleteTripFromDB(trip.id)"
          >Delete</PrimaryBtn
        >
        <SecondaryBtn @click="isDeleteModal = false">Cancel</SecondaryBtn>
      </div>
    </div>
  </div>
</template>
