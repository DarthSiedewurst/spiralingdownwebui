<template>
  <div class="background">
    <b-modal
      :title="rulename"
      hide-backdrop
      centered
      ok-only
      hide-header-close
      no-close-on-esc
      no-close-on-backdrop
      ref="rule"
      @ok="handleOk"
      static
    >{{ ruledescription }}</b-modal>
    <div v-for="(player, index) in players" :key="'player' + index">
      <player ref="player" :player="player" @overlayRight="overlayRight"></player>
    </div>
    <table class="fullscreen">
      <tr v-for="(line, index) in matrix" :key="index">
        <td class="m-0 p-0" v-for="(n, index) in line" :key="index">
          <tile :fieldNumber="n" :ruleset="ruleset" :players="players" :roll="roll"></tile>
        </td>
      </tr>

      <div :class="[isRight ? 'floatLeft' : 'floatRight', 'overlay']">
        <div>
          <b-row class="overlayCenter">
            <h1 class="player m-auto">
              <span :class="[isActive ? 'active' : '']">{{ activePlayer.name }}</span>
              ist am zug
            </h1>
          </b-row>
          <b-row>
            <div class="m-auto" @click="rollTheDie">
              <dice ref="dice"></dice>
            </div>
          </b-row>
          <b-row class="ruleUi">
            <div class="activeRule m-auto">{{ rulerule }}</div>
          </b-row>
          <b-row class="newGameUi" v-if="!gameModeMultiplayer">
            <b-col>
              <b-button @click="newGame" class="newGameButton float-right" type="button">Neues Spiel</b-button>
            </b-col>
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
import Socket from "../services/socket";
import constants from "../constants";

@Component({
  components: { tile, player, dice }
})
export default class Game extends Vue {
  private rulename = "";
  private ruledescription = "";
  private rulerule = "";
  private ruleMovement = 0;
  private diceable = true;
  private popUpOpen = true;
  private random = 0;

  private socket = new Socket();

  private matrix: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [29, 30, 31, 32, 33, 34, 35, 36, 9],
    [28, 51, 52, 53, 54, 55, 56, 37, 10],
    [27, 50, 65, 66, 67, 68, 57, 38, 11],
    [26, 49, 64, 71, 70, 69, 58, 39, 12],
    [25, 48, 63, 62, 61, 60, 59, 40, 13],
    [24, 47, 46, 45, 44, 43, 42, 41, 14],
    [23, 22, 21, 20, 19, 18, 17, 16, 15]
  ];

  private async mounted() {
    this.players.forEach(element => {
      (this.$refs.player as any)[element.id].movePlayerAutonom(element.tile);
    });
    Socket.mySocket.on("reconnect", () => {
      Socket.mySocket.emit("reconnectSocket", {
        lobby: Socket.lobby,
        ownLobby: Socket.mySocket.id
      });
    });
    Socket.mySocket.on("playersUpdated", (newPlayers: Player[]) => {
      this.$store.commit("setPlayers", newPlayers);
    });
    Socket.mySocket.on("diceWasRolled", async payload => {
      this.players = payload.players;
      let id = 0;
      this.players.forEach((element: Player) => {
        if (element.activeTurn) {
          id = element.id;
        }
      });
      this.roll = payload.roll;
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(
            Socket.mySocket.emit("showRuleInSocket", {
              id,
              lobby: Socket.lobby
            })
          );
        }, 500 * (Math.abs(this.roll) + 2));
      });
    });
    Socket.mySocket.on("okHasBeenClicked", () => {
      this.okClicked();
    });
    Socket.mySocket.on("ruleOpened", payload => {
      console.log(payload);
      this.players = payload.players;
      if (this.popUpOpen) {
        this.showRule(payload.id);
      }
    });
    Socket.mySocket.on("nextTurn", players => {
      let id = 0;
      players.forEach((element: Player) => {
        if (element.activeTurn) {
          id = element.id;
        }
      });

      this.players = players;
      this.activePlayer = players[id];
      if (this.yourId === this.activePlayer.id) {
        if (this.settings.vibration) {
          window.navigator.vibrate(1000);
        }
      }
      this.diceable = true;
    });
    Socket.mySocket.on("popUpUpdated", payload => {
      this.popUpOpen = payload.popUpOpen;
      this.random = payload.random;
      if (!this.popUpOpen) {
        this.$nextTick(() => {
          (this.$refs["rule"] as any).hide();
        });
      }
    });
    window.addEventListener("focus", () => {
      if (this.gameModeMultiplayer) {
        Socket.mySocket.emit("getUpdate", {
          lobby: Socket.lobby,
          ownLobby: Socket.mySocket.id
        });
        setTimeout(() => {
          Socket.mySocket.emit("updatePopUpOpen", Socket.lobby);
        }, 1000);
      }
    });

    Socket.mySocket.on("gotUpdate", newPlayers => {
      this.$store.commit("setPlayers", newPlayers);
    });
  }

  private get settings() {
    return this.$store.state.settings;
  }

  private get gameModeMultiplayer() {
    return this.$store.state.gameModeMultiplayer;
  }
  private get yourId() {
    return this.$store.state.yourId;
  }
  private get ruleset() {
    return this.$store.state.ruleset;
  }

  private get isRight() {
    return this.right;
  }

  private get isActive() {
    let active = false;
    if (this.gameModeMultiplayer) {
      active = this.yourId === this.activePlayer.id ? true : false;
    }
    return active;
  }

  private right = false;

  private get players(): Player[] {
    return this.$store.state.players;
  }
  private set players(players: Player[]) {
    this.$store.commit("setPlayers", players);
  }

  private roll = 0;
  private activePlayer = this.players[0];

  private async rollTheDie() {
    if (!this.gameModeMultiplayer || this.yourId === this.activePlayer.id) {
      if (this.diceable) {
        this.diceable = false;
        let id = 0;
        this.players.forEach((element: Player) => {
          if (element.activeTurn) {
            id = element.id;
          }
        });
        this.roll = (this.$refs.dice as any).roll();

        if (this.gameModeMultiplayer) {
          await Socket.mySocket.emit("moveInSocket", {
            roll: this.roll,
            playerId: id,
            lobby: Socket.lobby
          });
        } else {
          await this.move(id);
          this.diceable = true;
        }
      }
    }
  }

  private async handleOk(bvModalEvt) {
    bvModalEvt.preventDefault();

    if (this.gameModeMultiplayer) {
      if (this.yourId === this.activePlayer.id) {
        await Socket.mySocket.emit("okClicked", Socket.lobby);
      }
    } else {
      this.okClicked();
    }
  }

  private async okClicked() {
    const fieldId = "fieldId" + this.players[this.activePlayer.id].tile;
    this.ruleMovement = this.ruleset[fieldId].move;

    if (this.ruleMovement !== 0) {
      this.$nextTick(() => {
        (this.$refs["rule"] as any).hide();
      });
      this.roll = this.ruleMovement;
      if (this.gameModeMultiplayer && this.yourId === this.activePlayer.id) {
        await Socket.mySocket.emit("moveInSocket", {
          roll: this.roll,
          playerId: this.yourId,
          lobby: Socket.lobby
        });
      } else if (!this.gameModeMultiplayer) {
        this.move(this.activePlayer.id);
      }
      return;
    }

    if (this.gameModeMultiplayer && this.yourId === this.activePlayer.id) {
      Socket.mySocket.emit("newActivePlayer", Socket.lobby);
    } else if (!this.gameModeMultiplayer) {
      this.players[this.activePlayer.id].activeTurn = false;

      if (this.activePlayer.id < this.players.length - 1) {
        this.players[this.activePlayer.id + 1].activeTurn = true;
        this.activePlayer = this.players[this.activePlayer.id + 1];
      } else {
        this.players[0].activeTurn = true;
        this.activePlayer = this.players[0];
      }
    }

    document
      .getElementById("fieldId" + this.activePlayer.tile)!
      .getBoundingClientRect().left >
    document.getElementById("fieldId4")!.getBoundingClientRect().left
      ? (this.right = true)
      : (this.right = false);
    this.$nextTick(() => {
      (this.$refs["rule"] as any).hide();
    });
  }

  private overlayRight(right: boolean) {
    this.right = right;
  }

  private async move(id: number) {
    this.diceable = false;

    await this.$store.dispatch("move", { id, roll: this.roll });

    await new Promise(resolve => {
      setTimeout(() => {
        resolve(this.showRule(id));
      }, 500 * (Math.abs(this.roll) + 2));
    });

    this.diceable = true;
  }

  private showRule(id: number) {
    const fieldId = "fieldId" + this.players[id].tile;

    this.rulename = this.ruleset[fieldId].name;
    this.ruledescription = this.ruleset[fieldId].description;
    this.ruledescription = this.ruledescription.replace(
      /{playerName}/g,
      this.activePlayer.name
    );

    if (this.ruleset[fieldId].rulerule !== "") {
      if (this.ruleset[fieldId].rulerule === "Random") {
        let random = 0;
        if (this.gameModeMultiplayer) {
          random = this.random;
        } else {
          random = Math.random();
        }
        random = Math.floor(random * constants.RULERULES.length);
        this.rulerule = constants.RULERULES[random];
        this.ruledescription = constants.RULERULES[random];
        this.ruledescription = this.ruledescription.replace(
          /{playerName}/g,
          this.activePlayer.name
        );
      } else if (this.ruleset[fieldId].rulerule === "-") {
        this.rulerule = "";
      } else {
        this.rulerule = this.ruleset[fieldId].rulerule;
      }
      this.rulerule = this.rulerule.replace(
        /{playerName}/g,
        this.activePlayer.name
      );
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
  background-color: black;
}
.player {
  margin: auto;
  font-size: 4vw;
}

.fullscreen {
  margin: auto;
  margin-top: 1vh;
  box-shadow: 0 0 10px 10px black;
}
.newGameButton {
  bottom: 0vh;
  right: 1vw;
  position: absolute;
  background-color: orange;
  color: black;
  font-size: 1vw;
}
.newGameButton:hover {
  background-color: red;
}
.newGameUi {
  margin-left: 0;
  margin-right: 0;
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
  opacity: 0.7;
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
  height: 40vh;
  margin-left: 0;
  margin-right: 0;
}
.active {
  color: red;
}
</style>
