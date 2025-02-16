import { createRouter, createWebHistory } from "vue-router";
import QuizHome from "./components/QuizHome/QuizHome.vue";
import QuizQuestion from "./components/QuizQuestion/QuizQuestion.vue";
import QuizResults from "./components/QuizResults/QuizResults.vue";

const routes = [
  { path: "/", component: QuizHome },
  { path: "/quiz", component: QuizQuestion },
  { path: "/results", component: QuizResults },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
