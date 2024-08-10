<script setup>
import NavMobile from "./components/NavMobile.vue";
import MobileHeader from "./components/MobileHeader.vue";
// import { onMounted } from "vue";
// import { useTripsStore } from "./stores/trips";

// const tripsStore = useTripsStore();
// onMounted(() => {
//   tripsStore.loadTrips(); //load trips when app starts
// });
//const trips = tripsStore.allTrips;
</script>

<template class="relative">
  <MobileHeader />
  <router-view></router-view>
  <NavMobile />
</template>

<style scoped></style>
