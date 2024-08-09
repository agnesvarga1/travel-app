<script setup></script>

<template>
  <div
    class="container fixed bottom-0 left-0 w-full h-20 bg-dark p-2 rounded-t-lg flex justify-around items-center"
  >
    <font-awesome-icon
      icon="home"
      class="text-primary text-5xl"
    ></font-awesome-icon>
    <font-awesome-icon
      icon="plus"
      class="text-primary text-5xl"
    ></font-awesome-icon>
    <font-awesome-icon :icon="['fas', 'bars']" class="text-primary text-5xl" />
  </div>
</template>

<style scoped></style>
