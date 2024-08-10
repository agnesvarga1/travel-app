<script setup>
defineProps({
  trip: Object,
});
</script>
<template>
  <div class="trip-card w-80 mx-auto shadow-lg mt-3 rounded-lg overflow-hidden">
    <div class="card-header">
      <img :src="`../../public/images/${trip.cover}`" alt="" />
    </div>
    <div class="card-body p-2">
      <h2 class="text-primary font-heading text-xl">{{ trip.title }}</h2>
      <div>
        <span>From: {{ trip.startDate }} </span>
        <span> To: {{ trip.endDate }}</span>
      </div>
    </div>

    <!-- //  <router-link :to="{ name: 'TripDetails', params: { id: trip.id } }"
      >View Details</router-link
    > -->
  </div>
</template>
