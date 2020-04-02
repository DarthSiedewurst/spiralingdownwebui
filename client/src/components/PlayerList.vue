<template>
  <div>
    <b-row v-for="player in players" :key="player.id">
      <b-col>
        {{ player.name }}
        <b-button @click="deletePlayer(player.id)" class="deleteButton" type="button">Löschen</b-button>
      </b-col>
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

    <b-button type="button" @click="addPlayer">Add Player</b-button>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "@/models/player";
import { validate } from "vee-validate";

@Component({
  components: {}
})
export default class PlayerList extends Vue {
  @Prop() private players!: Player[];

  private valid: any = "";

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

  private playerName = "";
  private playerColor = "";

  private addPlayer() {
    (this.$refs.valid as any).validate().then((success: boolean) => {
      if (success) {
        if (this.players.length > 5) {
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
</style>
