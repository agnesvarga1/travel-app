<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { useTripsStore } from "../stores/trips";
import PrimaryBtn from "../components/PrimaryBtn.vue";
import DayCard from "../components/DayCard.vue";
const route = useRoute();
const tripsStore = useTripsStore();
const tripId = computed(() => route.params.id);

const trip = computed(() =>
  tripsStore.allTrips.find((trip) => trip.id === parseInt(tripId.value))
);

onMounted(() => {
  // Optional: Load trips if not already loaded
  if (!trip.value) {
    tripsStore.loadTrips();
  }
});
</script>

<template>
  <div class="bg-light rounded-t-lg mt-14 p-3 main-container">
    <div v-if="trip">
      <div class="flex">
        <figure class="thumb">
          <img :src="`/images/${trip.cover}`" alt="cover image" />
        </figure>
        <div class="text-xs ps-2">
          <h1 class="text-accent text-xl font-semibold font-heading">
            {{ trip.title }}
          </h1>
          <p>From: {{ trip.startDate }}</p>
          <p>To: {{ trip.endDate }}</p>
        </div>
      </div>

      <div class="flex">
        <div class="py-1">
          <p class="text-dark font-body text-sm">
            <strong>Description:</strong> {{ trip.description }}
          </p>
          <div
            v-if="trip.notes !== ''"
            class="text-dark font-body text-sm mt-2 flex justify-between items-start"
          >
            <p>
              <strong>Notes:</strong> <br />
              {{ trip.notes }}
            </p>
            <PrimaryBtn class="text-xl"
              ><i class="fa-solid fa-pencil"></i
            ></PrimaryBtn>
          </div>
          <!-- If No notes -->
          <p class="text-dark font-body mt-2 shadow-xl rounded-md p-2" v-else>
            <strong>Add Notes:</strong>
            <PrimaryBtn class="text-xl ms-2"
              ><i class="fa-solid fa-pencil"></i
            ></PrimaryBtn>
          </p>
        </div>
      </div>
      <!-- Stops -->
      <h2 class="font-heading text-dark" v-if="trip.days">Stops:</h2>
      <div class="mt-2" v-for="(day, i) in trip.days" key="day.date">
        <h1>Day {{ i + 1 }} date:{{ day.date }}</h1>
        <DayCard v-for="stop in day.stops">
          <template v-slot:header>
            <img :src="`/images/${stop.image}`" alt="" />
          </template>
          <template v-slot:body>
            <div class="ps-2 font-body text-dark">
              <h3 class="font-heading text-primary text-xl">
                {{ stop.title }}
              </h3>
              <p class="text-dark font-body text-xs">
                {{ stop.description }}
              </p>
            </div>
          </template>
        </DayCard>
      </div>
      <!-- Hotels and Ristos -->
      <h2 class="font-heading text-dark" v-if="trip.hotels">Hotels:</h2>
      <DayCard v-if="trip.hotels" v-for="hotel in trip.hotels">
        <template v-slot:header
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M0 32C0 14.3 14.3 0 32 0L480 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-176 0 0-48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 48L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64C14.3 64 0 49.7 0 32zm96 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM240 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM112 192c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM328 384c13.3 0 24.3-10.9 21-23.8c-10.6-41.5-48.2-72.2-93-72.2s-82.5 30.7-93 72.2c-3.3 12.8 7.8 23.8 21 23.8l144 0z"
            />
          </svg>
        </template>
        <template v-slot:body>
          <div class="ps-2 font-body text-dark">
            <h3 class="font-heading text-primary text-xl">{{ hotel.name }}</h3>
            <p class="text-xs">
              <i class="fa-solid fa-map-pin"></i> {{ hotel.address }}
            </p>
          </div>
        </template>
      </DayCard>
      <h2 class="font-heading text-dark" v-if="trip.restaurants">Eats:</h2>
      <DayCard
        v-if="trip.restaurants"
        v-for="(risto, index) in trip.restaurants"
      >
        <template v-slot:header>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"
            />
          </svg>
        </template>
        <template v-slot:body>
          <div class="ps-2 font-body text-dark">
            <h3 class="font-heading text-primary text-xl">{{ risto.name }}</h3>
            <p class="text-xs">
              <i class="fa-solid fa-map-pin"></i> {{ risto.address }}
            </p>
            <p class="text-xs">
              <i class="fa-solid fa-plate-wheat"></i> {{ risto.type }}
            </p>
            <p class="text-xs">
              <i class="fa-solid fa-star"></i> {{ risto.rating }}
            </p>
          </div>
        </template>
      </DayCard>
    </div>
  </div>
</template>

<style scoped>
svg {
  fill: #583d72;
  width: 55px;
  margin: 0 auto;
}
</style>
