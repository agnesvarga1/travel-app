<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="h-10 text-dark fixed top-0 left-0 p-2 w-full">
    <router-link :to="{ name: 'home' }">
      <h2>LOGO</h2>
    </router-link>
  </header>
</template>

<style scoped></style>
