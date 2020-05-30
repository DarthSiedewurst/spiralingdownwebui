<template>
  <div>
    <img :id="player.id" class="player" :class="player.color" src="@/assets/Black-Bishop.png" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
import IPlayer from "@/models/player.ts";

@Component({
  components: {}
})
export default class Player extends Vue {
  @Prop() private player!: IPlayer;

  private mounted() {
    const activeTile = document
      .getElementById(String(this.player.tile))!
      .getBoundingClientRect();
    const activePlayer = document.getElementById(String(this.player.id))!.style;
    activePlayer.left = 25 * this.player.id + activeTile.right - 145 + "px";
    activePlayer.top = activeTile.top + "px";
  }

  private movePlayer() {
    const activeTile = document
      .getElementById("fieldId" + this.player.tile)!
      .getBoundingClientRect();
    const activePlayer = document.getElementById(String(this.player.id))!.style;
    activePlayer.left = -10 * this.player.id + activeTile.right - 20 + "px";
    activePlayer.top = activeTile.top + "px";
  }
}
</script>

<style lang="scss" scoped>
.player {
  height: 4vh;
  width: 1.5vw;
  position: absolute;
  transition: 0.5s linear;
}
.yellow {
  filter: invert(79%) sepia(9%) saturate(6653%) hue-rotate(3deg)
    brightness(100%) contrast(103%);
}
.orange {
  filter: invert(9%) sepia(86%) saturate(2504%) hue-rotate(349deg)
    brightness(98%) contrast(118%);
}
.green {
  filter: invert(10%) sepia(71%) saturate(6473%) hue-rotate(118deg)
    brightness(93%) contrast(108%);
}
.purple {
  filter: invert(6%) sepia(74%) saturate(6792%) hue-rotate(245deg)
    brightness(69%) contrast(120%);
}
.black {
}
.dafuq {
  filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(56deg)
    brightness(100%) contrast(103%);
}
</style>
