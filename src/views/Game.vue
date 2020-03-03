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
        <b-row>
          <h1 class="player m-auto">{{ activePlayer.name }} ist am zug</h1>
        </b-row>
        <b-row class="diceContainer">
          <div class="m-auto" @click="rollTheDie">
            <dice ref="dice"></dice>
          </div>
        </b-row>
        <b-row>
          <b-button class="newGameButton" type="button">Neues Spiel</b-button>
        </b-row>
      </b-col>
    </b-row>
    <b-modal ok-only no-close-on-esc no-close-on-backdrop ref="rule" @ok="handleOk">{{ rulename }}</b-modal>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
import ofSize from "@/services/spiralmatrix";
import tile from "@/components/Tile.vue";
import player from "@/components/Player.vue";
import dice from "@/components/Dice.vue";

@Component({
  components: { tile, player, dice }
})
export default class Game extends Vue {
  private ruleset1 = require("@/rules/ruleset1.json");
  private rulename = "";
  private ruleMovement = 0;

  private matrix: any = ofSize.ofSize(8);
  private players: any = [
    { id: 0, activeTurn: true, name: "Marco", tile: 1 },
    { id: 1, activeTurn: false, name: "Andre", tile: 1 }
  ];
  private roll = 0;
  private activePlayer = this.players[0];

  private rollTheDie() {
    let id = 0;
    this.players.forEach((element: any) => {
      if (element.activeTurn) {
        id = element.id;
      }
    });
    this.roll = (this.$refs.dice as any).roll();
    console.log(this.roll);

    this.move(id);
  }
  private handleOk(bvModalEvt: any) {
    const fieldId = "fieldId" + this.players[this.activePlayer.id].tile;
    this.ruleMovement = (this.ruleset1 as any)[fieldId].move;

    if (this.ruleMovement !== 0) {
      this.roll = this.ruleMovement;
      this.move(this.activePlayer.id);
      return;
    }

    this.players[this.activePlayer.id].activeTurn = false;

    if (this.activePlayer.id < this.players.length - 1) {
      this.players[this.activePlayer.id + 1].activeTurn = true;
      this.activePlayer = this.players[this.activePlayer.id + 1];
    } else {
      this.players[0].activeTurn = true;
      this.activePlayer = this.players[0];
    }
  }

  private async move(id: number) {
    if (this.roll > 0) {
      for (let i = 0; i < this.roll; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            resolve(this.moveForward(id));
          }, 500);
        });
      }
      this.showRule(id);
    } else {
      for (let i = 0; i < Math.abs(this.roll); i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            resolve(this.moveBackward(id));
          }, 500);
        });
      }
      this.showRule(id);
    }
  }

  private moveForward(id: number) {
    if (this.players[id].tile < 64) {
      this.players[id].tile++;
      (this.$refs.player as any)[id].movePlayer();
    }
  }

  private moveBackward(id: number) {
    this.players[id].tile--;
    (this.$refs.player as any)[id].movePlayer();
  }

  private showRule(id: number) {
    const fieldId = "fieldId" + this.players[id].tile;
    this.rulename = (this.ruleset1 as any)[fieldId].name;
    (this.$refs["rule"] as any).show();
  }
}
</script>

<style lang="scss" scoped>
.player {
  margin: auto;
}
.diceContainer {
  margin-top: 25%;
}
.newGameButton {
  margin: auto;
  margin-top: 50%;
}
</style>
