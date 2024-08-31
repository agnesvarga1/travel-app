<script setup>
import PrimaryBtn from "../components/PrimaryBtn.vue";
import { reactive, ref, watch } from "vue";
import moment from "moment";

const isOneDay = ref(false);
const datesArray = ref([]);
const daysArray = ref([]);
const stopsArray = ref([]);
const daysToSign = reactive([
  {
    date: "",
    stops: [
      {
        name: "",
        description: "",
        latitude: null,
        longitude: null,
        notes: "",
      },
    ],
  },
]);
const newTrip = reactive({
  title: "",
  startDate: "",
  endDate: null,
  description: "",
});
const now = moment().format("YYYY-MM-DD");
const calculateDays = (startDate, endDate) => {
  datesArray.value = [];

  if (isOneDay.value || !endDate) {
    datesArray.value.push(moment(startDate).format("YYYY-MM-DD"));
    console.log(datesArray.value);
    return;
  }

  if (startDate && endDate) {
    let currentDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    datesArray.value.push(currentDate);

    while (currentDate !== formattedEndDate) {
      currentDate = moment(currentDate).add(1, "d").format("YYYY-MM-DD");
      datesArray.value.push(currentDate);
    }
  }

  console.log(datesArray.value);
};
watch(
  [() => newTrip.startDate, () => newTrip.endDate],
  ([startDate, endDate]) => {
    const daysCount = calculateDays(startDate, endDate);
  }
);
</script>

<template>
  <div
    class="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-hidden"
  >
    <div
      class="text-2xl py-4 px-6 bg-accent text-white text-center font-heading uppercase"
    >
      Add a new trip
    </div>
    <form class="py-4 px-6" action="">
      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="name"> Title </label>
        <input
          v-model="newTrip.title"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="My holiday title"
          required
        />
      </div>
      <div class="mb-5">
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <input
              v-model="isOneDay"
              type="checkbox"
              name="checkbox"
              id="radioButton1"
              class="h-4 w-4"
            />
            <label
              for="radioButton1"
              class="pl-3 text-base font-body text-dark"
            >
              One day Trip
            </label>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="date">
          Start Date
        </label>
        <input
          v-model="newTrip.startDate"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          placeholder="Select a date"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="date">
          End Date
        </label>
        <input
          v-model="newTrip.endDate"
          :disabled="isOneDay"
          :class="
            isOneDay
              ? 'bg-slate-50 text-slate-500 border-slate-200 shadow-none'
              : ''
          "
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          placeholder="Select a date"
        />
      </div>

      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="message">
          Description
        </label>
        <textarea
          v-model="newTrip.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          rows="4"
          placeholder="Description of the journey goes here"
        ></textarea>
      </div>
      <div v-if="datesArray.length > 0" class="mb-4">
        <h3 class="font-body text-dark">Add stop to the trip</h3>
        <div
          v-for="date in datesArray"
          :key="date"
          class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-dark"
        >
          <label class="block text-dark font-body mb-2" for="message">
            {{ date }}
          </label>
          <PrimaryBtn>Add Stop</PrimaryBtn>
        </div>
      </div>

      <div class="flex items-center justify-center mb-4">
        <PrimaryBtn> Add Trip </PrimaryBtn>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
