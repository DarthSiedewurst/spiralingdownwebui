import Vue from "vue";
import Vuex from "vuex";
import Player from "@/models/player";
import Socket from "@/services/socket";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    players: [],
    ruleset: {},
    gameModeMultiplayer: true,
    socket: {},
  },
  mutations: {
    setPlayers(state: any, players: Player[]) {
      state.players = players;
    },
    setRuleset(state: any, ruleset: any) {
      state.ruleset = ruleset;
    },
    gameModeMultiplayer(state: any, gameModeMultiplayer: boolean) {
      state.gameModeMultiplayer = gameModeMultiplayer;
    },
    setSocket(state: any, socket: any) {
      state.socket = socket;
    },
  },
  actions: {
    async addPlayerToSocket({ commit }, newPlayer: Player) {
      const socket = new Socket();
      socket.addPlayerToSocket(newPlayer);
    },
    async getPlayerFromSocket() {
      const socket = new Socket();
      socket.getPlayerFromSocket();
    },
    addPlayer({ state, commit }, newPlayer: Player) {
      const newPlayers: Player[] = state.players;
      newPlayers.push(newPlayer);
      commit("setPlayers", newPlayers);
    },
    deletePlayer({ state, commit }, playerId: number) {
      const newPlayers: Player[] = state.players;
      newPlayers.splice(playerId, 1);
      for (let i = 0; i < newPlayers.length; i++) {
        newPlayers[i].id = i;
      }
      commit("setPlayers", newPlayers);
    },
    newGame({ commit }) {
      commit("setPlayers", []);
    },
  },
  modules: {},
});
