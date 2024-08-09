<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="container fixed bottom-0 left-0 w-full h-20 bg-dark p-2 rounded-t-lg flex justify-around items-center"
  >
    <router-link :to="{ name: 'home' }">
      <font-awesome-icon
        icon="home"
        class="text-primary text-5xl"
      ></font-awesome-icon>
    </router-link>
    <router-link :to="{ name: 'add' }">
      <font-awesome-icon
        icon="plus"
        class="text-primary text-5xl"
      ></font-awesome-icon>
    </router-link>
    <font-awesome-icon :icon="['fas', 'bars']" class="text-primary text-5xl" />
  </div>
</template>

<style scoped></style>
