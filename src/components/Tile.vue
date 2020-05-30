<template>
  <div
    :style="{'background-image' : 'url(' + require('@/assets/tilebackground.jpg') + ')'}"
    class="tileContainer"
    :class="[{'borderBottom': borderBottom}, {'borderLeft' : borderLeft}, {'borderRight' : borderRight}]"
  >
    <div :id="fieldId" class="tile">
      <span class="responsiveNumber">{{ fieldNumber }}</span>
      <br />
      <div class="responsiveText">
        <strong>{{ rule }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Tile extends Vue {
  @Prop() private fieldNumber!: number;
  @Prop() private ruleset!: any;

  private fieldId: string = "fieldId" + this.fieldNumber;
  private rule = (this.ruleset as any)[this.fieldId].name;

  private get borderBottom() {
    return this.borderBottomList.indexOf(this.fieldNumber) > -1 ? true : false;
  }
  private get borderLeft() {
    return this.borderLeftList.indexOf(this.fieldNumber) > -1 ? true : false;
  }
  private get borderRight() {
    return this.borderRightList.indexOf(this.fieldNumber) > -1 ? true : false;
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
  width: 90%;
  height: 90%;
}
.borderBottom {
  border-bottom: 0.3vh solid black;
}
.borderLeft {
  border-left: 0.3vh solid black;
}

.borderRight {
  border-right: 0.3vh solid black;
}
.responsiveText {
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
}
</style>
