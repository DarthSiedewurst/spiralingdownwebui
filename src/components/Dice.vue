<template>
  <div class="container-dice">
    <div id="dice1" class="dice dice-one">
      <div id="dice-one-side-one" class="side one">
        <div class="divot one-1"></div>
      </div>
      <div id="dice-one-side-two" class="side two">
        <div class="divot two-1"></div>
        <div class="divot two-2"></div>
      </div>
      <div id="dice-one-side-three" class="side three">
        <div class="divot three-1"></div>
        <div class="divot three-2"></div>
        <div class="divot three-3"></div>
      </div>
      <div id="dice-one-side-four" class="side four">
        <div class="divot four-1"></div>
        <div class="divot four-2"></div>
        <div class="divot four-3"></div>
        <div class="divot four-4"></div>
      </div>
      <div id="dice-one-side-five" class="side five">
        <div class="divot five-1"></div>
        <div class="divot five-2"></div>
        <div class="divot five-3"></div>
        <div class="divot five-4"></div>
        <div class="divot five-5"></div>
      </div>
      <div id="dice-one-side-six" class="side six">
        <div class="divot six-1"></div>
        <div class="divot six-2"></div>
        <div class="divot six-3"></div>
        <div class="divot six-4"></div>
        <div class="divot six-5"></div>
        <div class="divot six-6"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Dice extends Vue {
  //POINT ROLL FUNCTION
  private roll() {
    const elDiceOne = document.getElementById("dice1")!;
    // sets dice variables
    const diceOne = Math.floor(Math.random() * 6) + 1;

    //Dice reset and display

    for (let i = 1; i <= 6; i++) {
      elDiceOne.classList.remove("show-" + i);
      if (diceOne === i) {
        elDiceOne.classList.add("show-" + i);
      }
    }
    return diceOne;
  }
}
</script>
<style scoped>
/* MODAL THINGS*/

/*########## DICE THINGS ###########*/

.dice {
  position: relative;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  transition: transform 1s;
}

.divot {
  position: absolute;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border-radius: 10px;
  background: #000;
}

.side {
  background-color: rgba(255, 255, 204, 0.97);
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid black;
}

.side:nth-child(1) {
  transform: translateZ(50px);
}

.side:nth-child(6) {
  transform: rotateY(180deg) translateZ(50px);
}

.side:nth-child(3) {
  transform: rotateY(90deg) translateZ(50px);
}

.side:nth-child(4) {
  transform: rotateY(-90deg) translateZ(50px);
}

.side:nth-child(5) {
  transform: rotateX(90deg) translateZ(50px);
}

.side:nth-child(2) {
  transform: rotateX(-90deg) translateZ(50px);
}

.show-1 {
  transform: rotateX(720deg) rotateZ(-720deg);
}

.show-6 {
  transform: rotateX(-900deg) rotateZ(1080deg);
}

.show-3 {
  transform: rotateY(-450deg) rotateZ(-1440deg);
}

.show-4 {
  transform: rotateY(810deg) rotateZ(720deg);
}

.show-5 {
  transform: rotateX(-810deg) rotateZ(-1080deg);
}

.show-2 {
  transform: rotateX(450deg) rotateZ(-720deg);
}

/* Dice Dots */
.two-1,
.three-1,
.four-1,
.five-1,
.six-1 {
  top: 20%;
  left: 20%;
}

.four-3,
.five-3,
.six-4 {
  top: 20%;
  left: 80%;
}

.one-1,
.three-2,
.five-5 {
  top: 50%;
  left: 50%;
}

.four-2,
.five-2,
.six-3 {
  top: 80%;
  left: 20%;
}

.two-2,
.three-3,
.four-4,
.five-4,
.six-6 {
  top: 80%;
  left: 80%;
}

.six-2 {
  top: 50%;
  left: 20%;
}

.six-5 {
  top: 50%;
  left: 80%;
}
</style>
