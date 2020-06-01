<template>
  <div
    class="background"
    :style="{
      'background-image': 'url(' + require('@/assets/darkgreen.jpg') + ')'
    }"
  >
    <div class="fullscreen text-center">
      <h1 class="gameName m-auto">
        <strong>Game Mode</strong>
      </h1>
      <b-row class="mt-5">
        <b-col>
          <b-button
            class="gameModeButton"
            @click="singleplayer"
            :style="{
              'background-image':
                'url(' + require('@/assets/tilebackground.jpg') + ')'
            }"
          >Auf einem Gerät</b-button>
          <b-button
            class="gameModeButton ml-3"
            @click="multiplayer"
            :style="{
              'background-image':
                'url(' + require('@/assets/tilebackground.jpg') + ')'
            }"
          >Lobby erstellen</b-button>
        </b-col>
      </b-row>
    </div>
    <b-modal
      hide-backdrop
      centered
      no-close-on-esc
      no-close-on-backdrop
      @ok="handleOk"
      ok-only
      ref="lobby"
    >
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

@Component({
  components: {}
})
export default class NewGame extends Vue {
  private playerName = "";
  private playerColor = "";
  private socket = new Socket();

  private mounted() {
    if (Socket.mySocket === null) {
      this.socket.setMySocket();
    }

    if (this.$route.query.lobby) {
      console.log(this.$route.query.lobby);
      this.socket.joinLobby(this.$route.query.lobby as string);
      (this.$refs["lobby"] as any).show();
      console.log(process.env.VUE_APP_TEST);
    }
  }

  private get players() {
    return this.$store.state.players;
  }

  private get playerColors(): string[] {
    const colors: any[] = [
      { value: "orange", text: "Orange" },
      { value: "green", text: "Grün" },
      { value: "yellow", text: "Gelb" },
      { value: "black", text: "Schwarz" },
      { value: "dafuq", text: "Dafuq" },
      { value: "purple", text: "Lila" }
    ];

    this.players.forEach(element => {
      if (
        colors
          .map(e => {
            return e.value;
          })
          .indexOf(element.color) > -1
      ) {
        colors.splice(
          colors
            .map(e => {
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

    (this.$refs.valid as any).validate().then((success: boolean) => {
      if (success) {
        const activeTurn = this.players.length === 0 ? true : false;
        const newPlayer: Player = {
          id: this.players.length,
          name: this.playerName,
          tile: 0,
          activeTurn: activeTurn,
          color: this.playerColor
        };
        (this.$refs["lobby"] as any).show();
        this.$store.dispatch("addPlayer", newPlayer);
        this.$store.commit("gameModeMultiplayer", true);

        if (!this.$route.query.lobby) {
          this.socket.joinLobby(Socket.mySocket.id);
        }
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
  color: #874000;
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
.gameModeButton {
  width: 30vw;
  height: 30vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: 4vh;
  color: black;
}
</style>
