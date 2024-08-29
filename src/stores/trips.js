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
import { updateTripNotes } from "../utils/idbUtils";

export const useTripsStore = defineStore("trips", {
  state: () => ({
    allTrips: [],
  }),
  actions: {
    async loadTrips() {
      this.allTrips = await getTrips(); // Load data from IndexedDB
    },
    updateTripNotes(tripId, note) {
      const trip = this.allTrips.find((trip) => trip.id === parseInt(tripId));
      if (trip) {
        trip.notes = note; // Update the note locally in the state
        updateTripNotes(tripId, note); // Persist the note to IndexedDB
      }
    },
  },
});
