import { createApp } from "vue";
import config from "../formkit.config";
import { plugin, defaultConfig } from "@formkit/vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";

createApp(App).use(router).use(plugin, defaultConfig(config)).mount("#app");
