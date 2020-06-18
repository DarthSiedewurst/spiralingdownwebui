<template>
  <div>
    <b-button v-b-toggle.sidebar class="sidebarMenu">
      <b-icon-three-dots class="sidebarIcon"></b-icon-three-dots>
    </b-button>

    <b-sidebar
      id="sidebar"
      title="Einstellungen"
      backdrop-variant="dark"
      backdrop
      right
      shadow
      no-header-close
      width="40vw"
      header-class="sidebarHeader"
    >
      <b-container class="sidebarContent">
        <b-row>
          <b-col>
            <input class="drinkbox" type="checkbox" v-model="vibration" id="myCheckbox1"/>
            <label for="myCheckbox1"></label
          ></b-col>
          <b-col class="drinkboxText"> <b-icon-phone class="sidebarIcon"></b-icon-phone>Vibration </b-col>
        </b-row>
        <b-row>
          <b-col>
            <input class="drinkbox" type="checkbox" v-model="music" id="myCheckbox2"/>
            <label for="myCheckbox2"></label
          ></b-col>
          <b-col class="drinkboxText">
            <b-icon-music-note-beamed class="sidebarIcon"></b-icon-music-note-beamed>Musik
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <input class="drinkbox" type="checkbox" v-model="sound" id="myCheckbox3"/>
            <label for="myCheckbox3"></label
          ></b-col>
          <b-col class="drinkboxText"> <b-icon-volume-up class="sidebarIcon"></b-icon-volume-up>Sound </b-col>
        </b-row>
      </b-container>
    </b-sidebar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Sidebar extends Vue {
  private get vibration() {
    return this.$store.state.settings.vibration;
  }
  private set vibration(vibration: boolean) {
    this.commitToStore({ vibration });
  }
  private get music() {
    return this.$store.state.settings.music;
  }
  private set music(music: boolean) {
    this.commitToStore({ music });
  }
  private get sound() {
    return this.$store.state.settings.sound;
  }
  private set sound(sound: boolean) {
    this.commitToStore({ sound });
  }

  private commitToStore(settings: any) {
    this.$store.commit("setSettings", settings);
  }
}
</script>
<style scoped>
.sidebarMenu {
  position: fixed;
  right: 1vw;
  top: 1vh;
  background: transparent !important;
  border: none !important;
  z-index: 1000;
}
>>> .sidebarHeader {
  font-size: 5vw !important;
}
.sidebarContent {
  font-size: 3vw;
}
.sidebarIcon {
  color: black;
}
.drinkbox {
  display: none;
}
.drinkbox + label {
  background: url("~@/assets/bier-leer.jpg");
  height: 20vh;
  width: 10vw;
  display: inline-block;
  background-size: 100% 100%;
  overflow: hidden;

  transition: 0.5s;
}

.drinkbox:checked + label {
  background: url("~@/assets/bier-voll.jpg");
  height: 20vh;
  width: 10vw;
  display: inline-block;
  background-size: 100% 100%;
  overflow: hidden;

  transition: 0.5s;
}
.drinkboxText {
  margin-top: 10vh;
}
</style>
