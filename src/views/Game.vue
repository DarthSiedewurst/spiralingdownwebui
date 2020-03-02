<template>
  <div>
    <b-row>
      <b-col>
        <div v-for="(player, index) in players" :key="'player' + index">
          <player ref="player" :player="player"></player>
        </div>
        <tr v-for="(line, index) in matrix" :key="index">
          <td v-for="(n, index) in line" :key="index">
            <tile :fieldNumber="n" :players="players"></tile>
          </td>
        </tr>
      </b-col>

      <b-col>
        <button @click="rollTheDie">Würfeln</button>
        {{ roll }}
        <div>Player {{ activePlayer }} ist am zug</div>
      </b-col>
    </b-row>
    <b-modal ref="rule">{{ rulename }}</b-modal>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
import ofSize from "@/services/spiralmatrix";
import tile from "@/components/Tile.vue";
import player from "@/components/Player.vue";

@Component({
  components: { tile, player }
})
export default class Game extends Vue {
  private ruleset1 = require("@/rules/ruleset1.json");
  private rulename = "";

  private matrix: any = ofSize.ofSize(8);
  private players: any = [
    { id: 0, activeTurn: true, name: "playerOne", tile: 1 },
    { id: 1, activeTurn: false, name: "playerTwo", tile: 1 },
    { id: 2, activeTurn: false, name: "playerThree", tile: 1 },
    { id: 3, activeTurn: false, name: "playerFour", tile: 1 },
    { id: 4, activeTurn: false, name: "playerFive", tile: 1 }
  ];
  private roll = 0;
  private activePlayer = this.players[0].name;

  private async rollTheDie() {
    let id = 0;
    this.players.forEach((element: any) => {
      if (element.activeTurn) {
        id = element.id;
      }
    });
    this.roll = Math.floor(Math.random() * 6) + 1;

    await this.move(id);

    this.showRule(id);

    this.players[id].activeTurn = false;

    if (id < this.players.length - 1) {
      this.players[id + 1].activeTurn = true;
      this.activePlayer = this.players[id + 1].name;
    } else {
      this.players[0].activeTurn = true;
      this.activePlayer = this.players[0].name;
    }
  }

  private move(id: number) {
    for (let i = 0; i < this.roll; i++) {
      setTimeout(() => {
        if (this.players[id].tile < 64) {
          this.players[id].tile++;
          (this.$refs.player as any)[id].movePlayer();
        }
        console.log("Timeout: " + this.players[id].tile);
      }, i * 500);
    }
    console.log("move: " + this.players[id].tile);
  }

  private showRule(id: number) {
    const fieldId = "fieldId" + this.players[id].tile;
    this.rulename = (this.ruleset1 as any)[fieldId].name;
    (this.$refs["rule"] as any).show();
    console.log("showRule: " + this.players[id].tile);
  }
}
</script>

<style lang="scss" scoped></style>
