<template>
  <div
    class="background"
    :style="{
      'background-image': 'url(' + require('@/assets/marmor.jpg') + ')',
    }"
  >
    <div class="fullscreen text-center">
      <h1 class="gameName m-auto">
        <strong>Spiraling Down</strong>
      </h1>
      <b-row>
        <b-col
          cols="8"
          class="newGameFrame"
          :style="{
            'background-image': 'url(' + require('@/assets/tilebackground.jpg') + ')',
          }"
        >
          <playerList
            :gameModeMultiplayer="gameModeMultiplayer"
            :players="players"
            @addPlayer="addPlayer"
            @deletePlayer="deletePlayer"
          ></playerList>
        </b-col>
        <b-col
          class="newGameFrame"
          :style="{
            'background-image': 'url(' + require('@/assets/tilebackground.jpg') + ')',
          }"
        >
          <b-form-group label="Rule Set" class="mt-3" :disabled="gameModeMultiplayer && yourId != 0">
            <b-form-select v-model="ruleset" :options="rulesets"></b-form-select>
          </b-form-group>
          <b-button
            :style="{
              'background-image': 'url(' + require('@/assets/bierdeckel.jpg') + ')',
            }"
            class="bierdeckel mt-2 float-right footerButoon"
            v-if="!gameModeMultiplayer || yourId === 0"
            type="button"
            @click="startNewGame"
            >Starten!</b-button
          >
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-useless-escape */

// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import Player from "@/models/player.ts";
import playerList from "@/components/PlayerList.vue";
// @ts-ignore
import importetRules from "@/rules";
import Socket from "../services/socket";

@Component({
  components: { playerList },
})
export default class NewGame extends Vue {
  private socket = new Socket();

  private mounted() {
    Socket.mySocket.on("gameStarted", () => {
      this.$router.push({ path: "game" });
    });
  }

  private get gameModeMultiplayer() {
    return this.$store.state.gameModeMultiplayer;
  }

  private get yourId() {
    return this.$store.state.yourId;
  }

  //Add new Rulesets in importedRules
  private get rulesets() {
    const ruleSets = [];
    for (const variable in importetRules) {
      ruleSets.push({
        value: importetRules[variable],
        text: importetRules[variable].name,
      });
    }
    return ruleSets;
  }

  private get ruleset() {
    return this.$store.state.ruleset;
  }

  private set ruleset(ruleset: any) {
    this.$store.dispatch("setRuleset", ruleset);
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
      if (this.gameModeMultiplayer) {
        Socket.mySocket.emit("startGame");
      } else {
        this.$router.push({ path: "game" });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gameName {
  color: black;
}
.fullscreen {
  width: 90vw;
  height: 90vh;
  margin: auto;
  padding: 1vh;
}
.background {
  background-color: white;
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.newGameFrame {
  margin: 1vh;
  padding: 2vh;
  max-height: 80vh;
  border-radius: 25px;
  border: 0.3vh solid black;
  overflow: visible;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.footerButoon {
  bottom: 2vh;
  right: 1vw;
  position: absolute;
}
</style>
