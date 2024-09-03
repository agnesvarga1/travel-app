import { defineStore } from "pinia";
import { getTrips, deleteTrip } from "../utils/idb";
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
    // Delete a trip from IndexedDB and update the local state
    async deleteTripFromDB(tripId) {
      await deleteTrip(tripId); // Delete the trip from IndexedDB

      // Remove the deleted trip from the local state
      this.allTrips = this.allTrips.filter((trip) => trip.id !== tripId);
      window.location.reload();
    },
  },
});
