import { createApp } from "vue";
import { plugin, defaultConfig } from "@formkit/vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";

createApp(App).use(router).use(plugin, defaultConfig).mount("#app");
