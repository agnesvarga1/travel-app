<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted, ref, reactive, watch } from "vue";
import { useTripsStore } from "../stores/trips";
import PrimaryBtn from "../components/PrimaryBtn.vue";
import DayCard from "../components/DayCard.vue";
import RouteMap from "../components/RouteMap.vue";
import moment from "moment";
import { updateStopVisitedStatus } from "../utils/idbUtils";

const route = useRoute();
const tripsStore = useTripsStore();
const tripId = computed(() => route.params.id);

const trip = computed(() =>
  tripsStore.allTrips.find((trip) => trip.id === parseInt(tripId.value))
);
let isModal = ref(false);
const selectedDayStops = ref([]);
const selectedHotel = ref(null);
let isNoteModal = ref(false);
let note = ref("");

onMounted(() => {
  tripsStore.loadTrips();
});

// Function to toggle visited status of stops and save to indexedDB
const checkVisited = (stop, tripId, dayIndex, stopIndex) => {
  stop.visited = !stop.visited;
  tripId = Number(tripId);

  updateStopVisitedStatus(tripId, stopIndex, dayIndex, stop.visited);
};

const openMap = (day) => {
  selectedDayStops.value = day.stops.map((stop) => ({
    title: stop.title,
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  if (trip.value.hotels && trip.value.hotels.length > 0) {
    const dayDate = moment(day.date); // Convert day.date to a Moment.js object

    selectedHotel.value = trip.value.hotels.find((hotel) => {
      const checkInDate = moment(hotel.checkIn);
      const checkOutDate = moment(hotel.checkOut);
      return dayDate.isBetween(checkInDate, checkOutDate, "days", "[]");
    });
  } else {
    selectedHotel.value = null;
  }
  isModal.value = true;
};

watch(
  () => isNoteModal.value,
  (newVal) => {
    if (newVal && trip.value) {
      note.value = trip.value.notes || "";
    }
  }
);

const submitNote = (id, n) => {
  id = Number(id);
  tripsStore.updateTripNotes(id, n);
  isNoteModal.value = false;
};
</script>

<template>
  <div class="bg-light rounded-t-lg mt-14 p-3 main-container">
    <div v-if="trip">
      <div class="flex">
        <figure class="w-24">
          <img :src="`/images/${trip.cover}`" alt="cover image" />
        </figure>
        <div class="text-xs p-3 pt-1 text-dark font-body">
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
            <PrimaryBtn @click="isNoteModal = true" class="text-xl"
              ><i class="fa-solid fa-pencil"></i>
            </PrimaryBtn>
          </div>
          <!-- If No notes -->
          <p class="text-dark font-body mt-2" v-else>
            <strong>Add Notes:</strong>
            <PrimaryBtn @click="isNoteModal = true" class="text-xl ms-2"
              ><i class="fa-solid fa-pencil"></i
            ></PrimaryBtn>
          </p>
        </div>
      </div>
      <!-- Stops -->
      <h2 class="font-heading text-dark" v-if="trip.days">Stops:</h2>
      <div class="mt-2" v-for="(day, dayIndex) in trip.days" :key="dayIndex">
        <h1 class="font-heading text-dark flex justify-between text-lg">
          Day {{ dayIndex + 1 }}
          <div @click="openMap(day)">
            <font-awesome-icon
              class="bg-primary rounded-md p-2 text-xl text-light hover:bg-dark cursor-pointer"
              :icon="['fas', 'map-location-dot']"
            />
          </div>
        </h1>
        <h3 class="font-heading text-dark">date:{{ day.date }}</h3>
        <DayCard
          v-for="(stop, stopIndex) in day.stops"
          class="relative"
          :key="stopIndex"
        >
          <template v-slot:header>
            <svg
              @click="checkVisited(stop, tripId, stopIndex, dayIndex)"
              id="visited-icon"
              :class="{ active: stop.visited }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
              />
            </svg>

            <svg
              class="fill-dark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                d="M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8L32 192c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9l0-.9 4.4-1.6L240.1 4.2zM64 224l64 0 0 192 40 0 0-192 64 0 0 192 48 0 0-192 64 0 0 192 40 0 0-192 64 0 0 196.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512L32 512c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1L64 224z"
              />
            </svg>
          </template>
          <template v-slot:body>
            <div class="p-2 font-body text-dark">
              <h3 class="font-heading text-secondary text-sm">
                {{ stop.title }}
              </h3>
              <p class="text-dark font-body text-xs">
                {{ stop.description }}
              </p>
              <p class="text-dark font-body text-xs mt-1">
                <strong>Notes:</strong>
                {{ stop.notes }}
              </p>
            </div>
          </template>
        </DayCard>
      </div>
      <!-- Hotels and Ristos -->
      <h2 class="font-heading text-dark pt-2" v-if="trip.hotels">Hotels:</h2>
      <DayCard v-if="trip.hotels" v-for="hotel in trip.hotels">
        <template v-slot:header
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M0 32C0 14.3 14.3 0 32 0L480 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-176 0 0-48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 48L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64C14.3 64 0 49.7 0 32zm96 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM240 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM112 192c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM328 384c13.3 0 24.3-10.9 21-23.8c-10.6-41.5-48.2-72.2-93-72.2s-82.5 30.7-93 72.2c-3.3 12.8 7.8 23.8 21 23.8l144 0z"
            />
          </svg>
        </template>
        <template v-slot:body>
          <div class="font-body text-dark p-2">
            <h3 class="font-heading text-secondary xt-l">{{ hotel.name }}</h3>
            <p class="text-xs">
              <i class="fa-solid fa-map-pin"></i> {{ hotel.address }}
            </p>
            <p class="text-xs">Check-In Date: {{ hotel.checkIn }}</p>
            <p class="text-xs">Check-Out Date: {{ hotel.checkOut }}</p>
          </div>
        </template>
      </DayCard>
      <h2 class="font-heading text-dark pt-3" v-if="trip.restaurants">Eats:</h2>
      <DayCard
        v-if="trip.restaurants"
        v-for="(risto, index) in trip.restaurants"
      >
        <template v-slot:header>
          <svg
            class="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"
            />
          </svg>
        </template>
        <template v-slot:body>
          <div class="ps-2 font-body text-dark p-2">
            <h3 class="font-heading text-secondary text-l">{{ risto.name }}</h3>
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
    <!-- NOTE MODAL -->
    <div
      v-if="isNoteModal"
      class="note-modal absolute top-10 w-full bg-white flex flex-col align-center p-3"
    >
      <h3 class="flex justify-between p-2 font-heading text-dark">
        Add Note
        <PrimaryBtn
          class="close-button font-body text-xl"
          @click="isNoteModal = false"
          >X</PrimaryBtn
        >
      </h3>
      <textarea
        v-model="note"
        class="w-full border-2 border-gray-300 rounded-md p-1 font-body"
        cols="20"
        rows="10"
        :placeholder="trip.notes === '' ? 'example note' : ''"
        >{{ trip.notes }}</textarea
      >
      <div>
        <PrimaryBtn
          class="mt-2 focus:outline-none focus:border-dark"
          @click="submitNote(tripId, note)"
          >Submit Note</PrimaryBtn
        >
      </div>
    </div>
    <RouteMap
      v-if="isModal"
      :stops="selectedDayStops"
      :hotel="selectedHotel"
      @close="isModal = false"
    />
  </div>
</template>

<style scoped>
svg {
  fill: #583d72;
  width: 55px;
  margin: 0 auto;
}
#visited-icon {
  width: 25px;
  fill: gray;
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
}
#visited-icon:hover {
  transform: scale(1.2);
}
.active {
  fill: #ff8474 !important;
}
</style>
