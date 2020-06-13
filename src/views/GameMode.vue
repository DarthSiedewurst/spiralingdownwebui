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
      <b-row class="mt-5">
        <b-col>
          <b-button
            class="gameModeButton"
            @click="singleplayer"
            :style="{
              'background-image': 'url(' + require('@/assets/tilebackground.jpg') + ')',
            }"
            >Auf einem Gerät</b-button
          >
          <b-button
            class="gameModeButton ml-3"
            @click="multiplayer"
            :style="{
              'background-image': 'url(' + require('@/assets/tilebackground.jpg') + ')',
            }"
            >Lobby erstellen</b-button
          >
        </b-col>
      </b-row>
    </div>
    <b-modal hide-backdrop centered no-close-on-esc no-close-on-backdrop @ok="handleOk" ok-only ref="lobby">
      <b-row>
        <b-col>Name</b-col>
        <b-col>Farbe</b-col>
      </b-row>
      <ValidationObserver ref="valid">
        <b-row>
          <b-col>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-input v-model="playerName"></b-input>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-col>
          <b-col>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-select v-model="playerColor" :options="playerColors"></b-form-select>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </b-col>
        </b-row>
      </ValidationObserver>
    </b-modal>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
import Player from "../models/player";
import Socket from "../services/socket";
import CONSTANTS from "@/constants";

@Component({
  components: {},
})
export default class NewGame extends Vue {
  private colors = CONSTANTS.COLORS;
  private playerName = "";
  private playerColor = "";
  private socket = new Socket();

  private async mounted() {
    console.log(process.env.VUE_APP_TEST);

    if (Socket.mySocket === null) {
      this.socket.setMySocket();
    }

    if (this.$route.query.lobby) {
      await this.socket.joinLobby(this.$route.query.lobby as string);
      this.playersUpdated();
      this.rulesetUpdated();
      (this.$refs["lobby"] as any).show();
    }
  }
  private playersUpdated() {
    Socket.mySocket.on("playersUpdated", (newPlayers: any) => {
      this.$store.commit("setPlayers", newPlayers);
    });
  }
  public rulesetUpdated() {
    Socket.mySocket.on("rulesetUpdated", (ruleset: Ruleset) => {
      Socket.ruleset = ruleset;
      this.$store.commit("setRuleset", ruleset);
    });
  }

  private get players() {
    return this.$store.state.players;
  }

  private get playerColors(): string[] {
    const colors: any[] = [...this.colors];

    this.players.forEach((element) => {
      if (
        colors
          .map((e) => {
            return e.value;
          })
          .indexOf(element.color) > -1
      ) {
        colors.splice(
          colors
            .map((e) => {
              return e.value;
            })
            .indexOf(element.color),
          1
        );
      }
    });
    return colors;
  }

  private singleplayer() {
    this.$store.commit("gameModeMultiplayer", false);
    this.goToNewGame();
  }
  private multiplayer() {
    (this.$refs["lobby"] as any).show();
  }
  private handleOk(bvModalEvt) {
    bvModalEvt.preventDefault();

    (this.$refs.valid as any).validate().then(async (success: boolean) => {
      if (success) {
        const activeTurn = this.players.length === 0 ? true : false;
        const newPlayer: Player = {
          id: this.players.length,
          name: this.playerName,
          tile: 0,
          activeTurn: activeTurn,
          color: this.playerColor,
        };
        this.$store.commit("setYourId", this.players.length);
        if (!this.$route.query.lobby) {
          await this.socket.joinLobby(Socket.mySocket.id);
          await this.playersUpdated();
          await this.rulesetUpdated();
          Socket.mySocket.emit("getPlayerFromSocket");
        }
        (this.$refs["lobby"] as any).show();

        Socket.mySocket.emit("addPlayerToSocket", newPlayer);
        this.$store.commit("gameModeMultiplayer", true);

        this.goToNewGame();
      }
    });
  }

  private goToNewGame() {
    this.$router.push({ path: "newGame" });
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
  background-repeat: repeat;
  background-size: 100% 100%;
}
.gameModeButton {
  width: 30vw;
  height: 30vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: 4vh;
  color: black;
}
</style>
