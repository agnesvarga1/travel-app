import { initDB } from "./idb";

// Function to update the 'visited' field for a specific stop within a trip
export const updateStopVisitedStatus = async (
  tripId,
  dayIndex,
  stopIndex,
  visitedStatus
) => {
  const db = await initDB();
  const tx = db.transaction("trips", "readwrite");
  const store = tx.objectStore("trips");

  // Retrieve the specific trip by ID
  const trip = await store.get(tripId);

  if (trip) {
    // Check if the specified day and stop exist
    if (
      trip.days &&
      trip.days[dayIndex] &&
      trip.days[dayIndex].stops &&
      trip.days[dayIndex].stops[stopIndex]
    ) {
      // Modify the 'visited' field of the specific stop
      trip.days[dayIndex].stops[stopIndex].visited = visitedStatus;

      // Store the updated trip back in the store
      await store.put(trip);
      // console.log(
      //   `Stop with index ${stopIndex} in day ${dayIndex} of trip with ID ${tripId} updated successfully.`
      // );
    } else {
      console.error(
        `Specified day or stop not found in trip with ID ${tripId}.`
      );
    }
  } else {
    console.error(`Trip with ID ${tripId} not found.`);
  }

  await tx.done;
};

export const updateTripNotes = async (tripId, notes) => {
  const db = await initDB();
  const tx = db.transaction("trips", "readwrite");
  const store = tx.objectStore("trips");

  // Retrieve the specific trip by ID
  const trip = await store.get(tripId);

  if (trip) {
    // Modify the 'notes' field
    trip.notes = notes;

    // Store the updated trip back in the store
    await store.put(trip);
    // console.log(`Trip with ID ${tripId} notes updated successfully.`);
  } else {
    console.error(`Trip with ID ${tripId} not found.`);
  }

  await tx.done;
};
