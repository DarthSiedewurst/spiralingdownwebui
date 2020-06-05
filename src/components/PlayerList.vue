<template>
  <div>
    <div class="overflow">
      <b-row v-for="player in players" :key="player.id">
        <b-col>
          {{ player.name }}
          <b-button
            v-if="!gameModeMultiplayer"
            @click="deletePlayer(player.id)"
            class="deleteButton"
            type="button"
          >Löschen</b-button>
        </b-col>
      </b-row>
      <ValidationObserver ref="valid" v-if="!gameModeMultiplayer">
        <b-row v-if="addPlayerPossible">
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
    </div>

    <b-button
      v-if="!gameModeMultiplayer"
      class="mt-3 float-left"
      type="button"
      @click="addPlayer"
    >Add Player</b-button>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "@/models/player";
import { validate } from "vee-validate";
import CONSTANTS from "@/constants";

@Component({
  components: {}
})
export default class PlayerList extends Vue {
  @Prop() private players!: Player[];
  @Prop() private gameModeMultiplayer!: boolean;

  private colors = CONSTANTS.COLORS;

  private get playerColors(): string[] {
    const colors: any[] = [...this.colors];
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
    console.log("method colors: " + colors);
    console.log("Constant colors: " + this.colors);
    return colors;
  }

  private get addPlayerPossible() {
    return this.players.length > 7 ? false : true;
  }

  private playerName = "";
  private playerColor = "";

  private addPlayer() {
    (this.$refs.valid as any).validate().then((success: boolean) => {
      if (success) {
        if (this.players.length > 7) {
          return;
        }
        const id = this.players.length;
        const activeTurn = this.players.length === 0 ? true : false;
        const newPlayer: Player = {
          id,
          name: this.playerName,
          activeTurn,
          tile: 0,
          color: this.playerColor
        };
        this.$emit("addPlayer", newPlayer);
        this.playerName = "";
        this.playerColor = "";
        this.$nextTick(() => (this.$refs.valid as any).reset());
      }
    });
  }
  private deletePlayer(playerId: number) {
    this.$emit("deletePlayer", playerId);
  }
}
</script>

<style lang="scss" scoped>
.deleteButton {
  float: right;
  background-color: darkred;
}
.overflow {
  height: 60vh;
  overflow: auto;
  overflow-x: hidden;
}
</style>
