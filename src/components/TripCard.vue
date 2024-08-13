<script setup>
import PrimaryBtn from "./PrimaryBtn.vue";
import { RouterLink } from "vue-router";
defineProps({
  trip: Object,
});
</script>
<template>
  <div class="trip-card w-80 mx-auto shadow-lg mt-3 rounded-lg overflow-hidden">
    <div class="card-header">
      <img :src="`/images/${trip.cover}`" alt="" />
    </div>
    <div class="card-body p-2">
      <h2 class="text-primary font-heading text-xl">{{ trip.title }}</h2>
      <div class="text-sm mb-2">
        <span class="font-body">From: {{ trip.startDate }} </span>
        <span class="font-body"> To: {{ trip.endDate }}</span>
      </div>
      <p class="text-sm font-body leading-5">{{ trip.description }}</p>
    </div>
    <div class="card-footer p-3 flex justify-center">
      <PrimaryBtn class="w-full">
        <router-link :to="{ name: 'TripDetails', params: { id: trip.id } }">
          View Details
        </router-link>
      </PrimaryBtn>
    </div>
  </div>
</template>
