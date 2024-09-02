<script setup>
import PrimaryBtn from "../components/PrimaryBtn.vue";
import { reactive, ref, watch, toRaw } from "vue";
import moment from "moment";
import axios from "axios";
import { debounce } from "lodash-es";
import { insertTrips } from "../utils/idb";
const selectedDate = ref(null);
const isSuccessMessage = ref(false);
const isOpen = ref(false);
const isOneDay = ref(false);
const successMessage = ref("");
const stopDescription = ref("");
const singleStop = reactive([
  {
    name: "",
    description: "",
    latitude: null,
    longitude: null,
    notes: "",
  },
]);

const datesArray = ref([]);

const daysToSign = reactive([]);
const newTrip = reactive({
  title: "",
  startDate: "",
  endDate: null,
  cover: "",
  description: "",
  days: daysToSign,
});

const openModal = (date) => {
  selectedDate.value = date;
  isOpen.value = true;
};

const fetchCoordinates = async () => {
  if (!singleStop.name) {
    return;
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        singleStop.name
      )}.json`,
      {
        params: {
          access_token:
            "pk.eyJ1IjoiYWdoeS12IiwiYSI6ImNtMGh4dXI4YzBmNGUyb3NsbWN1MWRzZjEifQ.eskvrdVOA2xM71Yu8u_p_w",
          limit: 1,
        },
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] =
        response.data.features[0].geometry.coordinates;

      // Create a new object to trigger reactivity
      const updatedStop = {
        ...singleStop, // Copy existing data
        latitude,
        longitude,
      };

      // Update the singleStop reactive object
      singleStop.name = updatedStop.name;
      singleStop.description = updatedStop.description;
      singleStop.latitude = updatedStop.latitude;
      singleStop.longitude = updatedStop.longitude;

      console.log("Longitude:", longitude, "Latitude:", latitude);
    } else {
      console.error("No coordinates found for the given address");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
};

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

const addStop = () => {
  let day = daysToSign.find((d) => d.date === selectedDate.value);

  // If the date doesn't exist, create a new day with an empty stops array
  if (!day) {
    day = { date: selectedDate.value, stops: [] };
    daysToSign.push(day);
  }

  // Push the stop into the stops array for the corresponding date
  day.stops.push({ ...singleStop });
  singleStop.name = "";
  singleStop.description = "";
  singleStop.longitude = null;
  singleStop.latitude = null;
  stopDescription.value = "";
  console.log(daysToSign);
  isOpen.value = false;
};

const debouncedFetchCoordinates = debounce(fetchCoordinates, 500);

const createBase64Image = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result); // Base64 string
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

const handleImage = async (e) => {
  const selectedImage = e.target.files[0]; // Get the first file
  try {
    const base64Image = await createBase64Image(selectedImage);
    newTrip.cover = base64Image; // Store the Base64 string in newTrip.cover
  } catch (error) {
    console.error("Error converting image to Base64:", error);
  }
};

watch(
  [() => newTrip.startDate, () => newTrip.endDate],
  ([startDate, endDate]) => {
    const daysCount = calculateDays(startDate, endDate);
  }
);

watch(
  () => singleStop.name,
  () => {
    debouncedFetchCoordinates();
  }
);

const saveTrip = async () => {
  try {
    const cleanDays = newTrip.days.map((day) => ({
      ...day,
      stops: day.stops.map((stop) => ({
        name: stop.name,
        description: stop.description,
        latitude: stop.latitude,
        longitude: stop.longitude,
        notes: stop.notes,
      })),
    }));

    const plainTrip = {
      title: newTrip.title,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      description: newTrip.description,
      days: cleanDays,
      cover: newTrip.cover,
    };

    await insertTrips([plainTrip]);
    isSuccessMessage.value = true;
    successMessage.value = "Trip saved successfully!";
    setTimeout(() => {
      window.location.reload(); // Refresh the page
    }, 2000);
  } catch (error) {
    console.error("Error saving trip:", error);
  }
};
</script>

<template>
  <div class="overflow-auto pb-20">
    <div
      class="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-auto"
    >
      <div
        class="text-2xl py-4 px-6 bg-accent text-white text-center font-heading uppercase"
      >
        Add a new trip
      </div>
      <div class="py-4 px-6">
        <div class="mb-4">
          <label class="block text-dark font-body mb-2" for="name">
            Title
          </label>
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
            id="starDate"
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
            id="endDate"
            type="date"
            placeholder="Select a date"
          />
        </div>
        <input
          @change="handleImage"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          type="file"
          accept="image/*"
        />

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
            <div v-for="day in daysToSign">
              <span v-for="stop in day.stops">{{ stop.name }}<br /></span>
            </div>
            <label class="block text-dark font-body mb-2" for="message">
              {{ date }}
            </label>
            <PrimaryBtn @click="openModal(date)" type="button"
              >Add Stop</PrimaryBtn
            >
          </div>
        </div>

        <div class="flex items-center justify-center mb-4">
          <PrimaryBtn @click="saveTrip"> Add Trip </PrimaryBtn>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isSuccessMessage" class="w-full absolute top-10">
    <div
      class="p-2 max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <h2 class="text-body text-primary">{{ successMessage }}</h2>
    </div>
  </div>
  <!-- STOP MODAL -->
  <div v-if="isOpen" class="w-full absolute top-10">
    <div
      class="p-2 max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <h3 class="flex justify-between font-heading text-dark">
        Add stop to the trip:
        <PrimaryBtn
          class="close-button font-body text-xl"
          @click="isOpen = false"
          >X</PrimaryBtn
        >
      </h3>

      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="name"> Title </label>
        <input
          v-model="singleStop.name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="City and Stop Name here"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="message">
          Description
        </label>
        <textarea
          v-model="singleStop.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          rows="4"
          placeholder="Description of the stop"
        ></textarea>
      </div>
      <PrimaryBtn @click="addStop(selectedDate)"> Save Stop </PrimaryBtn>
    </div>
  </div>
</template>

<style scoped></style>
