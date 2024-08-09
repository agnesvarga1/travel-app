<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="h-16 bg-white text-dark fixed top-0 left-0">
    <router-link :to="{ name: 'home' }">
      <h2>LOGO</h2>
    </router-link>
  </header>
</template>

<style scoped></style>
