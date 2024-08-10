import { defineStore } from "pinia";
import tripsData from "../data/trips.json";

export const useTripsStore = defineStore("trips", {
  state: () => ({ trips: [] }),
  getters: {
    allTrips: (state) => tripsData.trips,
  },
  actions: {
    loadTrips() {
      this.trips = tripsData.trips;
      console.log("Trips loaded:", this.trips);
    },
  },
});
