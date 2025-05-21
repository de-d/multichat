import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import Registration from "../views/reg.vue";
import Login from "../views/login.vue";
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
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/chat",
    name: "chats",
    component: Chat,
    meta: { requiresAuth: true },
  },
  {
    path: "/chat/:id",
    name: "chat",
    component: Chat,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
