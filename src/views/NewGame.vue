<template>
  <b-container>
    <h1>Spiraling Down</h1>
    <b-row>
      <b-col cols="8" class="newGameFrame">
        <playerList :players="players" @addPlayer="addPlayer" @deletePlayer="deletePlayer"></playerList>
      </b-col>
      <b-col class="newGameFrame">
        <b-form-group label="Rule Set" class="test">
          <b-form-select v-model="ruleset" :options="rulesets"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-button class="mt-3" type="button" @click="startNewGame">Starten!</b-button>
  </b-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import Player from "@/models/player.ts";
import playerList from "@/components/PlayerList.vue";
// @ts-ignore
import io from "socket.io-client";
import importetRules from "@/rules";

@Component({
  components: { playerList },
})
export default class NewGame extends Vue {
  private socket: any = {};
  private created() {
    let url = process.env.VUE_APP_WEBSERVICE_URL;
    url = url.substring(0, url.length - 1);
    this.socket = io(url);
  }

  private mounted() {
    this.socket.on("testMessage", (data: any) => {
      console.log(data);
    });
    console.log(process.env.VUE_APP_TEST);
  }

  private get rulesets() {
    const rulSets = [];
    for (const variable in importetRules) {
      rulSets.push({
        value: importetRules[variable],
        text: importetRules[variable].name,
      });
    }
    return rulSets;
  }

  private get ruleset() {
    return this.$store.state.ruleset;
  }

  private set ruleset(ruleset: any) {
    this.$store.commit("setRuleset", ruleset);
  }

  private get players(): Player[] {
    return this.$store.state.players;
  }
  private addPlayer(newPlayer: Player) {
    this.$store.dispatch("addPlayer", newPlayer);
  }
  private deletePlayer(playerId: number) {
    this.$store.dispatch("deletePlayer", playerId);
  }
  private startNewGame() {
    if (this.players.length > 0 && Object.keys(this.ruleset).length > 0) {
      this.$router.push({ path: "game" });
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-family: "Courier New";
}
.newGameFrame {
  margin: 1vh;
  padding: 2vh;
  height: 38vh;
  border-radius: 25px;
  border: 0.3vh solid black;
}
.test {
  position: relative;
  top: 45%;
  transform: translateY(-45%);
}
</style>
