import { createRouter, createWebHistory } from "vue-router"; //webhistory salva browser history in pagina to enable back arrow in browser

import AppHome from "./pages/AppHome.vue";
import AppAddTrip from "./pages/AppAddTrip.vue";
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
  ],
});
export { router };
