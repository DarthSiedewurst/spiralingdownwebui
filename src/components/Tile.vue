<template>
  <div
    :style="highlightStyle"
    class="tileContainer"
    :class="[
      { borderBottom: borderBottom },
      { borderLeft: borderLeft },
      { borderRight: borderRight },
      { tileMoveForward: tileMoveForward },
      { tileMoveBackward: tileMoveBackward },
      { tileRule: tileRule },
      { tileHighlighted: tileHighlighted }
    ]"
  >
    <div :id="fieldId" class="tile">
      <span class="responsiveNumber ml-2">{{ fieldNumber }}</span>
      <br />
      <div class="responsiveText ml-2">
        <strong>{{ rule }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "../models/player";
@Component({
  components: {}
})
export default class Tile extends Vue {
  @Prop() private fieldNumber!: number;
  @Prop() private ruleset!: any;
  @Prop() private players!: Player[];
  @Prop() private roll!: number;

  private fieldId: string = "fieldId" + this.fieldNumber;
  private rule = (this.ruleset as any)[this.fieldId].name;

  private get highlightStyle() {
    const rolled = Math.abs(this.roll / 2) + 1 + "s";
    return { "--transition-delay": rolled };
  }

  private get borderBottom() {
    return this.borderBottomList.indexOf(this.fieldNumber) > -1 ? true : false;
  }
  private get borderLeft() {
    return this.borderLeftList.indexOf(this.fieldNumber) > -1 ? true : false;
  }
  private get borderRight() {
    return this.borderRightList.indexOf(this.fieldNumber) > -1 ? true : false;
  }

  private get tileMoveForward() {
    let filterOn = false;
    this.players.forEach(player => {
      if (this.fieldNumber === player.tile) {
        filterOn = (this.ruleset as any)[this.fieldId].move > 0;
      }
    });
    return filterOn;
  }
  private get tileMoveBackward() {
    let filterOn = false;
    this.players.forEach(player => {
      if (this.fieldNumber === player.tile) {
        filterOn = (this.ruleset as any)[this.fieldId].move < 0;
      }
    });
    return filterOn;
  }
  private get tileRule() {
    let filterOn = false;
    this.players.forEach(player => {
      if (this.fieldNumber === player.tile) {
        filterOn =
          (this.ruleset as any)[this.fieldId].rulerule !== "" ? true : false;
      }
    });
    return filterOn;
  }
  private get tileHighlighted() {
    let filterOn = false;
    this.players.forEach(player => {
      if (this.fieldNumber === player.tile) {
        filterOn = true;
      }
    });
    return filterOn;
  }

  private borderBottomList: number[] = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    30,
    31,
    32,
    33,
    34,
    35,
    59,
    60,
    61,
    62,
    63,
    52,
    53,
    54,
    55,
    69,
    70,
    71,
    66,
    67
  ];
  private borderLeftList: number[] = [47, 48, 49, 50, 51, 63, 64, 65, 71];
  private borderRightList: number[] = [
    36,
    37,
    38,
    39,
    40,
    41,
    56,
    57,
    58,
    59,
    68,
    69
  ];
}
</script>

<style lang="scss" scoped>
.tile {
  color: black;
  line-height: 1;
}
.borderBottom {
  border-bottom: 0.5vh solid black !important;
}
.borderLeft {
  border-left: 0.4vh solid black !important;
}

.borderRight {
  border-right: 0.4vh solid black !important;
}
.responsiveText {
  margin-top: 2vh;
  font-size: 1vw;
}
.responsiveNumber {
  font-size: 1vw;
  margin-top: 0%;
  padding-top: 0%;
}
.tileContainer {
  width: 11vw;
  height: 12.3vh;
  margin: 0px;
  transition-delay: 1s;
  background: url("~@/assets/tilebackground.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.tileMoveForward {
  transition-delay: var(--transition-delay);

  filter: invert(0%) sepia(0%) hue-rotate(40deg) saturate(300%) brightness(80%)
    contrast(150%) !important;
}
.tileMoveBackward {
  transition-delay: var(--transition-delay);

  filter: invert(0%) sepia(0%) hue-rotate(315deg) saturate(300%) brightness(80%)
    contrast(150%) !important;
}
.tileRule {
  transition-delay: var(--transition-delay);

  filter: invert(0%) sepia(30%) hue-rotate(182deg) saturate(300%)
    brightness(80%) contrast(150%) !important;
}
.tileHighlighted {
  transition-delay: var(--transition-delay);

  filter: invert(0%) sepia(25%) hue-rotate(12deg) saturate(150%)
    brightness(120%) contrast(150%);
}
</style>
