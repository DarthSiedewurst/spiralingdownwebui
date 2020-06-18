import Vue from "vue";
import Vuex from "vuex";
import Player from "@/models/player";
import Socket from "@/services/socket";
import Ruleset from "@/models/ruleset";
import importetRules from "@/rules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    players: [],
    ruleset: importetRules.SpiralingDown,
    gameModeMultiplayer: true,
    socket: {},
    yourId: 0,
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
    setYourId(state: any, yourId: number) {
      state.yourId = yourId;
    },
  },
  actions: {
    //Dice
    move({ state, commit }, movement: any) {
      const newPlayers: Player[] = JSON.parse(JSON.stringify(state.players));
      newPlayers[movement.id].tile += movement.roll;
      commit("setPlayers", newPlayers);
    },
    //Player
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
    //Ruleset
    setRuleset({ state, commit, dispatch }, ruleset: Ruleset) {
      if (state.gameModeMultiplayer) {
        dispatch("setRulesetToSocket", ruleset);
      } else {
        commit("setRuleset", ruleset);
      }
    },
    setRulesetToSocket({ commit }, ruleset: Ruleset) {
      const socket = new Socket();
      if (Socket.ruleset !== ruleset) {
        socket.setRuleset(ruleset);
      }
    },
  },
  modules: {},
});
