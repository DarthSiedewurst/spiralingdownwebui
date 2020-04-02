<template>
  <div
    :id="fieldId"
    class="tile"
    :class="[{'borderBottom': borderBottom}, {'borderLeft' : borderLeft}]"
  >
    <span class="responsiveNumber">{{ fieldNumber }}</span>
    <br />
    <div class="responsiveText">{{ rule }}</div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
//import * as ruleset1 from "@/rules/ruleset1.json";

@Component({
  components: {}
})
export default class Game extends Vue {
  @Prop() private fieldNumber!: number;

  private ruleset1 = require("@/rules/ruleset1.json");

  private fieldId: string = "fieldId" + this.fieldNumber;
  private rule = (this.ruleset1 as any)[this.fieldId].name;

  private get borderBottom() {
    return this.borderBottomList.indexOf(this.fieldNumber) > -1 ? true : false;
  }
  private get borderLeft() {
    return this.borderLeftList.indexOf(this.fieldNumber) > -1 ? true : false;
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
  private borderLeftList: number[] = [
    9,
    10,
    11,
    12,
    13,
    14,
    47,
    48,
    49,
    50,
    51,
    37,
    38,
    39,
    40,
    63,
    64,
    65,
    57,
    58,
    71
  ];

  //private rule: string = ruleset1[this.fieldNumber];
}
</script>

<style lang="scss" scoped>
.tile {
  width: 10vw;
  height: 9vh;
  box-shadow: 0 0 2px lightgreen;
  margin: 0px;
}
.borderBottom {
  border-bottom: 2px solid black;
}
.borderLeft {
  border-left: 2px solid black;
}
.responsiveText {
  font-size: 1vw;
}
.responsiveNumber {
  font-size: 1vw;
  margin-top: 0%;
  padding-top: 0%;
}
</style>
