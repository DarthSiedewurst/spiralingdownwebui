import Vue from 'vue';
import VueRouter from 'vue-router';
import Game from '@/views/Game.vue';
import NewGame from '@/views/NewGame.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'newGame',
    component: NewGame
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
