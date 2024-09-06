<script setup>
import PrimaryBtn from "./PrimaryBtn.vue";
import SecondaryBtn from "./SecondaryBtn.vue";
import { onMounted } from "vue";
import { useTripsStore } from "../stores/trips";

const tripsStore = useTripsStore();
const props = defineProps({
  tripId: {
    type: Number,
    required: true,
  },
  dayIndex: {
    type: Number,
  },
  itemId: {
    type: Number,
  },
  flag: {
    type: String,
  },
});
onMounted(() => {
  console.log(props);
});

const deleteItem = () => {
  if (props.flag === "stop") {
    tripsStore.deleteStopFromTrip(props.tripId, props.dayIndex, props.itemId);
    window.location.reload();
  } else {
    console.log("nope");
  }
};
</script>

<template>
  <!-- DELETE MODAL -->
  <div
    class="max-w-md mx-auto mt-20 bg-white shadow-lg p-2 rounded-lg absolute w-80 top-14 z-10"
  >
    <h2 class="font-heading text-dark">Are you sure to DELETE this item?</h2>
    <div class="flex justify-end gap-1">
      <PrimaryBtn @click="deleteItem()">Delete</PrimaryBtn>
      <SecondaryBtn @click="$emit('close')">Cancel</SecondaryBtn>
    </div>
  </div>
</template>

<style scoped></style>
