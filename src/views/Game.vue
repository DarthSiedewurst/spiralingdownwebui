<template>
  <div class="background">
    <b-modal
      :title="rulename"
      hide-backdrop
      centered
      ok-only
      no-close-on-esc
      no-close-on-backdrop
      ref="rule"
      @ok="handleOk"
    >{{ ruledescribtion }}</b-modal>
    <div v-for="(player, index) in players" :key="'player' + index">
      <player ref="player" :player="player"></player>
    </div>
    <table class="fullscreen">
      <tr v-for="(line, index) in matrix" :key="index">
        <td class="m-0 p-0" v-for="(n, index) in line" :key="index">
          <tile :fieldNumber="n" :ruleset="ruleset" :players="players"></tile>
        </td>
      </tr>

      <div :class="[isRight ? 'floatLeft' : 'floatRight', 'overlay']">
        <div>
          <b-row class="overlayCenter">
            <h1 class="player m-auto">{{ activePlayer.name }} ist am zug</h1>
          </b-row>
          <b-row>
            <div class="m-auto" @click="rollTheDie">
              <dice ref="dice"></dice>
            </div>
          </b-row>
          <b-row class="ruleUi">
            <div class="activeRule m-auto">{{ rulerule }}</div>
          </b-row>
          <b-row>
            <b-button @click="newGame" class="newGameButton" type="button">Neues Spiel</b-button>
          </b-row>
        </div>
      </div>
    </table>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";
import tile from "@/components/Tile.vue";
import player from "@/components/Player.vue";
import dice from "@/components/Dice.vue";
import Player from "@/models/player.ts";

@Component({
  components: { tile, player, dice }
})
export default class Game extends Vue {
  private rulename = "";
  private ruledescribtion = "";
  private rulerule = "";
  private ruleMovement = 0;
  private diceable = true;

  private matrix: any = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [29, 30, 31, 32, 33, 34, 35, 36, 9],
    [28, 51, 52, 53, 54, 55, 56, 37, 10],
    [27, 50, 65, 66, 67, 68, 57, 38, 11],
    [26, 49, 64, 71, 70, 69, 58, 39, 12],
    [25, 48, 63, 62, 61, 60, 59, 40, 13],
    [24, 47, 46, 45, 44, 43, 42, 41, 14],
    [23, 22, 21, 20, 19, 18, 17, 16, 15]
  ];

  private get ruleset() {
    return this.$store.state.ruleset;
  }

  private get isRight() {
    return this.right;
  }

  private right = false;

  private get players(): Player[] {
    return this.$store.state.players;
  }
  private roll = 0;
  private activePlayer = this.players[0];

  private async rollTheDie() {
    if (this.diceable) {
      this.diceable = false;
      let id = 0;
      this.players.forEach((element: any) => {
        if (element.activeTurn) {
          id = element.id;
        }
      });
      this.roll = (this.$refs.dice as any).roll();

      await this.move(id);
      this.diceable = true;
    }
  }
  private handleOk(bvModalEvt: any) {
    const fieldId = "fieldId" + this.players[this.activePlayer.id].tile;
    this.ruleMovement = (this.ruleset as any)[fieldId].move;

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
    document
      .getElementById("fieldId" + this.activePlayer.tile)!
      .getBoundingClientRect().left >
    document.getElementById("fieldId4")!.getBoundingClientRect().left
      ? (this.right = true)
      : (this.right = false);
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
    } else {
      for (let i = 0; i < Math.abs(this.roll); i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            resolve(this.moveBackward(id));
          }, 500);
        });
      }
    }
    this.showRule(id);
  }

  private moveForward(id: number) {
    if (this.players[id].tile < 72) {
      this.players[id].tile++;
      (this.$refs.player as any)[id].movePlayer();
      document
        .getElementById("fieldId" + this.activePlayer.tile)!
        .getBoundingClientRect().left >
      document.getElementById("fieldId4")!.getBoundingClientRect().left
        ? (this.right = true)
        : (this.right = false);
    }
  }

  private moveBackward(id: number) {
    this.players[id].tile--;
    (this.$refs.player as any)[id].movePlayer();
    document
      .getElementById("fieldId" + this.activePlayer.tile)!
      .getBoundingClientRect().left >
    document.getElementById("fieldId4")!.getBoundingClientRect().left
      ? (this.right = true)
      : (this.right = false);
  }

  private showRule(id: number) {
    document
      .getElementById("fieldId" + this.activePlayer.tile)!
      .getBoundingClientRect().left > 750
      ? (this.right = true)
      : (this.right = false);
    const fieldId = "fieldId" + this.players[id].tile;
    this.rulename = (this.ruleset as any)[fieldId].name;
    this.ruledescribtion = (this.ruleset as any)[fieldId].describtion;
    if ((this.ruleset as any)[fieldId].rulerule !== "") {
      this.rulerule = (this.ruleset as any)[fieldId].rulerule;
    }
    (this.$refs["rule"] as any).show();
  }

  private newGame() {
    this.$store.dispatch("newGame");
    this.$router.push({ name: "newGame" });
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-color: #cf9461;
}
.player {
  margin: auto;
}

.fullscreen {
  margin: auto;
  margin-top: 1vh;
  box-shadow: 0 0 10px 10px darkgreen;
}
.newGameButton {
  margin-top: 37vh;
  margin-left: 24vw;
  background-color: orange;
  color: black;
}
.newGameButton:hover {
  background-color: red;
}
.overlay {
  width: 30vw;
  height: 96vh;
  position: fixed;
  top: 0vh;
  margin-top: 2vh;
  margin-bottom: 2vh;
  z-index: 100;
  background-color: #becbd2;
  text-align: center;
  opacity: 0.5;
}
.floatLeft {
  right: 70%;
  left: 0%;
  transition: border 2s linear;
}
.floatRight {
  left: 70%;
  transition: border 2s linear;
}
.overlayCenter {
  height: 100%;
  margin: auto;
  margin-top: 25%;
}

.activeRule {
  font-size: 2vw;
  font-weight: bold;
  color: red;
}
.ruleUi {
  height: 20vh;
  margin-left: 0;
  margin-right: 0;
}
</style>
