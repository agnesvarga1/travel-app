// import { defineStore } from "pinia";
// import tripsData from "../data/trips.json";

// export const useTripsStore = defineStore("trips", {
//   state: () => ({ trips: [] }),
//   getters: {
//     allTrips: (state) => tripsData.trips,
//   },
//   actions: {
//     loadTrips() {
//       this.trips = tripsData.trips;
//       // console.log("Trips loaded:", this.trips);
//     },
//   },
// });

import { defineStore } from "pinia";
import { getTrips } from "../utils/idb";

export const useTripsStore = defineStore("trips", {
  state: () => ({
    allTrips: [],
  }),
  actions: {
    async loadTrips() {
      this.allTrips = await getTrips(); // Load data from IndexedDB
    },
  },
});
