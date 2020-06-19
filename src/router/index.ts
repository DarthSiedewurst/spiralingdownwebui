import Vue from "vue";
import VueRouter from "vue-router";
import Game from "@/views/Game.vue";
import NewGame from "@/views/NewGame.vue";
import GameMode from "@/views/GameMode.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "gameMode",
    component: GameMode,
  },
  {
    path: "/newGame",
    name: "newGame",
    component: NewGame,
  },
  {
    path: "/game",
    name: "game",
    component: Game,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
