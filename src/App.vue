<script setup>
import NavMobile from "./components/NavMobile.vue";
import MobileHeader from "./components/MobileHeader.vue";
</script>

<template class="relative font-body">
  <MobileHeader />
  <router-view></router-view>
  <NavMobile />
</template>

<style scoped></style>
