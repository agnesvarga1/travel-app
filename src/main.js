import { createApp } from "vue";
import "./style.css";
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

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
