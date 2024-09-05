<script setup>
import PrimaryBtn from "../components/PrimaryBtn.vue";
import { reactive, ref, watch, toRaw, onMounted } from "vue";
import { useTripsStore } from "../stores/trips";

import axios from "axios";
import { debounce } from "lodash-es";

const tripsStore = useTripsStore();

const props = defineProps({
  tripId: {
    type: Number,
    required: true,
  },
  dayIndex: {
    type: Number,
    required: true,
  },
});

const newStop = reactive([
  {
    title: "",
    description: "",
    latitude: null,
    longitude: null,
    notes: "",
  },
]);

const fetchCoordinates = async () => {
  if (!newStop.title) {
    return;
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        newStop.title
      )}.json`,
      {
        params: {
          access_token: import.meta.env.VITE_API_KEY_MP,
          autocomplete: true,
          limit: 1,
        },
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] =
        response.data.features[0].geometry.coordinates;
      //console.log(longitude, latitude);
      //  Create a new object to trigger reactivity
      const updatedStop = {
        ...newStop, // Copy existing data
        latitude,
        longitude,
      };

      // Update the singleStop reactive object
      newStop.title = updatedStop.title;
      newStop.description = updatedStop.description;
      newStop.latitude = updatedStop.latitude;
      newStop.longitude = updatedStop.longitude;

      //console.log("Longitude:", longitude, "Latitude:", latitude);
    } else {
      console.error("No coordinates found for the given address");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
};

const debouncedFetchCoordinates = debounce(fetchCoordinates, 500);

watch(
  () => newStop.title,
  () => {
    debouncedFetchCoordinates();
  }
);

watch(
  () => newStop,
  (newValue) => {
    console.log("newStop updated:", newValue);
  },
  { deep: true } // Ensure deep watching of the object
);

const saveStop = () => {
  console.log("Saving stop...");
  console.log("newStop:", newStop); // Log the entire reactive object
  console.log("Stop name:", newStop.title); // Log the specific property you need

  const stop = toRaw(newStop); // Convert to a plain object
  console.log("Raw stop:", stop);

  tripsStore.addStopToTrip(props.tripId, props.dayIndex, stop);
};
</script>

<template>
  <div class="w-80 absolute top-20">
    <div
      class="p-2 max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <h3 class="flex justify-between font-heading text-dark">
        Add stop to the trip:
        <PrimaryBtn
          class="close-button font-body text-xl"
          @click="$emit('close')"
          >X</PrimaryBtn
        >
      </h3>

      <div class="mb-4">
        <label class="block text-dark font-body mb-2" for="name"> Title </label>
        <input
          v-model="newStop.title"
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
          v-model="newStop.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          rows="4"
          placeholder="Description of the stop"
          required
          maxlength="5000"
        ></textarea>
      </div>
      <PrimaryBtn @click="saveStop"> Save Stop </PrimaryBtn>
    </div>
  </div>
</template>

<style scoped></style>
