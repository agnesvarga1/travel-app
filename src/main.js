import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import { router } from "./router";

import App from "./App.vue";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faPlus,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faHome, faPlus, faUser, faBars);
const pinia = createPinia();
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(pinia)
  .mount("#app");
