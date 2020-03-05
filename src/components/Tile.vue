<template>
  <div :id="fieldId" class="tile">
    <p>{{ fieldNumber }}</p>
    {{ rule }}
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

  //private rule: string = ruleset1[this.fieldNumber];
}
</script>

<style lang="scss" scoped>
.tile {
  width: 150px;
  height: 90px;
  box-shadow: 0 0 10px lightgreen;
  margin: 5px;
}
</style>
