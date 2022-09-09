import { createRouter, createWebHistory } from "vue-router";

const routerHistory = createWebHistory();

const routes = [
  {
    path: "/",
    name: "Chat",
    component: () => import("@/views/Chat-new.vue"),
  },
  {
    path: "/test",
    name: "Father",
    component: () => import("@/views/Father.vue"),
  },
];

const router = createRouter({
  history: routerHistory,
  routes,
});

export default router;
