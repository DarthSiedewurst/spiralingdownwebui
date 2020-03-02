<template>
  <div class="playerKasten">
    <!--     <p class="kasten">{{ player.name }}</p>
    -->
    <img :id="player.id" class="player" src="@/assets/Black-Bishop.png" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Player extends Vue {
  @Prop() private player!: any;

  private mounted() {
    const activeTile = document
      .getElementById(this.player.tile)!
      .getBoundingClientRect();
    const activePlayer = document.getElementById(this.player.id)!.style;
    activePlayer.left = 25 * this.player.id + activeTile.right - 125 + "px";
    activePlayer.top = activeTile.top + "px";
  }

  private movePlayer() {
    const activeTile = document
      .getElementById("fieldId" + this.player.tile)!
      .getBoundingClientRect();
    const activePlayer = document.getElementById(this.player.id)!.style;
    activePlayer.left = 25 * this.player.id + activeTile.right - 125 + "px";
    activePlayer.top = activeTile.top + "px";
  }
}
</script>

<style lang="scss" scoped>
.kasten {
  background-color: black;
  color: yellow;
  margin: auto;
}
.playerKasten {
  width: 150px;
}
.player {
  height: 50px;
  width: 50px;
  position: absolute;
  transition: 0.5s linear;
}
</style>
