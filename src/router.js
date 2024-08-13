import { createRouter, createWebHistory } from "vue-router"; //webhistory salva browser history in pagina to enable back arrow in browser

import AppHome from "./pages/AppHome.vue";
import AppAddTrip from "./pages/AppAddTrip.vue";
import TripDetails from "./pages/TripDetails.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppHome,
    },
    {
      path: "/add",
      name: "add",
      component: AppAddTrip,
    },
    {
      path: "/trip/:id",
      name: "TripDetails",
      component: TripDetails,
    },
  ],
});
export { router };
