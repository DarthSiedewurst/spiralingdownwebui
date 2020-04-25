<template>
  <b-container>
    <h1>Trinkspiel</h1>
    <b-row>
      <b-col cols="8">
        <playerList :players="players" @addPlayer="addPlayer" @deletePlayer="deletePlayer"></playerList>
      </b-col>
      <b-col class="m-auto">Ruleset</b-col>
    </b-row>

    <b-button type="button" @click="startNewGame">Starten!</b-button>
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

@Component({
  components: { playerList }
})
export default class NewGame extends Vue {
  private socket: any = {};
  private created() {
    this.socket = io("https://spiralingdown.de:3000");
  }

  private mounted() {
    this.socket.on("testMessage", (data: any) => {
      console.log(data);
    });
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
    if (this.players.length > 0) {
      this.$router.push({ path: "game" });
    }
  }
}
</script>

<style lang="scss" scoped></style>
