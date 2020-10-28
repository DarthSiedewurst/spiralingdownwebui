import Vue from "vue";
import Vuex from "vuex";
import Player from "@/models/player";
import Socket from "@/services/socket";
import Ruleset from "@/models/ruleset";
import Setting from "@/models/setting";
import State from "@/models/state";

Vue.use(Vuex);

export default new Vuex.Store({
  state: new State(),
  mutations: {
    setSettings(state: State, settings: Setting) {
      const newSettings = { ...state.settings, ...settings };
      state.settings = newSettings;
    },
    setPlayers(state: State, players: Player[]) {
      state.players = players;
    },
    setRuleset(state: State, ruleset: Ruleset) {
      state.ruleset = ruleset;
    },
    gameModeMultiplayer(state: State, gameModeMultiplayer: boolean) {
      state.gameModeMultiplayer = gameModeMultiplayer;
    },
    setSocket(state: State, socket: any) {
      state.socket = socket;
    },
    setYourId(state: State, yourId: number) {
      state.yourId = yourId;
    }
  },
  actions: {
    //Dice
    // Todo maybe change any
    move({ state, commit }, movement: any) {
      const newPlayers: Player[] = JSON.parse(JSON.stringify(state.players));
      newPlayers[movement.id].tile += movement.roll;
      if (newPlayers[movement.id].tile > 72) {
        newPlayers[movement.id].tile = 72;
      }
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
    }
  },
  modules: {}
});
