<template>
  <div id="app">
    <sidebar></sidebar>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";

@Component({
  components: { Sidebar },
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  overscroll-behavior-y: contain;
  font-family: "San Francisco" !important;
}
.bierdeckel {
  background-size: 100% 100% !important;
  border-radius: 100% !important;
  height: 14vh;
  width: 14vh;
  color: black !important;
  font-size: 3vh !important;
  font-weight: bold !important;
}
.bierdeckel:hover {
  color: black;
}
</style>
