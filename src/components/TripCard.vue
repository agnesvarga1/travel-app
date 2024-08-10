<script setup>
defineProps({
  trip: Object,
});
</script>
<template>
  <div class="trip-card w-80 mx-auto shadow-lg mt-3 rounded-lg">
    <div class="card-header">
      <!-- <img :src="" alt="" /> -->
    </div>
    <div class="card-body p-2">
      <h2 class>{{ trip.title }}</h2>
      <div>
        <span>From:{{ trip.startDate }}</span> <br />
        <span>To:{{ trip.endDate }}</span>
      </div>
    </div>

    <!-- //  <router-link :to="{ name: 'TripDetails', params: { id: trip.id } }"
      >View Details</router-link
    > -->
  </div>
</template>
