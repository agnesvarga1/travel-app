import { defineStore } from "pinia";
import { getTrips, deleteTrip } from "../utils/idb";
import { updateTripNotes, addStop, deleteStop } from "../utils/idbUtils";

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

    async addStopToTrip(tripId, dayIndex, stop) {
      const trip = this.allTrips.find((trip) => trip.id === parseInt(tripId));
      if (trip) {
        if (!trip.days || !trip.days[dayIndex]) {
          console.error(
            `Day with index ${dayIndex} not found in trip with ID ${tripId}.`
          );
          return;
        }

        // Add the stop to the specified day in the trip state
        if (!trip.days[dayIndex].stops) {
          trip.days[dayIndex].stops = [];
        }
        trip.days[dayIndex].stops.push(stop);

        // Persist the stop to IndexedDB
        await addStop(tripId, dayIndex, stop);
      } else {
        console.error(`Trip with ID ${tripId} not found.`);
      }
    },
    async deleteStopFromTrip(tripId, dayIndex, stopIndex) {
      const trip = this.allTrips.find((trip) => trip.id === parseInt(tripId));
      if (trip) {
        if (!trip.days || !trip.days[dayIndex]) {
          console.error(
            `Day with index ${dayIndex} not found in trip with ID ${tripId}.`
          );
          return;
        }

        // Check if the stop exists at the given stopIndex
        if (
          !trip.days[dayIndex].stops ||
          !trip.days[dayIndex].stops[stopIndex]
        ) {
          console.error(
            `Stop with index ${stopIndex} not found on day ${dayIndex} of trip with ID ${tripId}.`
          );
          return;
        }

        // Remove the stop from the local state
        trip.days[dayIndex].stops.splice(stopIndex, 1);

        // Persist the deletion to IndexedDB
        await deleteStop(tripId, dayIndex, stopIndex);
      } else {
        console.error(`Trip with ID ${tripId} not found.`);
      }
    },
  },
});
