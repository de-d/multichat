import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import Registration from "../views/reg.vue";
import Chat from "../views/chat.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/reg",
    name: "reg",
    component: Registration,
  },
  {
    path: "/chat",
    name: "chat",
    component: Chat,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Изменено на import.meta.env
  routes,
});

export default router;
