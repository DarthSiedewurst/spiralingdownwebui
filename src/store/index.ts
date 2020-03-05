import Vue from 'vue';
import Vuex from 'vuex';
import Player from '@/models/player';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    players: [],
    ruleset: {}
  },
  mutations: {
    setPlayers(state: any, players: Player[]) {
      state.players = players;
    }
  },
  actions: {
    addPlayer({ state, commit }, newPlayer: Player) {
      const newPlayers: Player[] = state.players;
      newPlayers.push(newPlayer);
      commit('setPlayers', newPlayers);
    },
    deletePlayer({ state, commit }, playerId: number) {
      const newPlayers: Player[] = state.players;
      newPlayers.splice(playerId, 1);
      for (let i = 0; i < newPlayers.length; i++) {
        newPlayers[i].id = i;
      }
      commit('setPlayers', newPlayers);
    },
    newGame({ commit }) {
      commit('setPlayers', []);
    }
  },
  modules: {}
});
