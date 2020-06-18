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
      sidebar-class="sidebarAll"
    >
      <b-container class="sidebarContent">
        <b-row>
          <b-col>
            <input class="drinkbox" type="checkbox" v-model="vibration" id="myCheckbox1"/>
            <label :class="[vibration ? 'drinkboxChecked' : 'drinkboxUnchecked']" for="myCheckbox1"></label
          ></b-col>
          <b-col class="drinkboxText"> <b-icon-phone class="sidebarIcon"></b-icon-phone>Vibration </b-col>
        </b-row>
        <b-row>
          <b-col>
            <input class="drinkbox" type="checkbox" v-model="music" id="myCheckbox2"/>
            <label :class="[music ? 'drinkboxChecked' : 'drinkboxUnchecked']" for="myCheckbox2"></label
          ></b-col>
          <b-col class="drinkboxText">
            <b-icon-music-note-beamed class="sidebarIcon"></b-icon-music-note-beamed>Musik
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <input class="drinkbox" type="checkbox" v-model="sound" id="myCheckbox3"/>
            <label :class="[sound ? 'drinkboxChecked' : 'drinkboxUnchecked']" for="myCheckbox3"></label
          ></b-col>
          <b-col class="drinkboxText"> <b-icon-volume-up class="sidebarIcon"></b-icon-volume-up>Sound </b-col>
        </b-row>
      </b-container>
    </b-sidebar>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MusicService from "@/services/musicService";

@Component({
  components: {},
})
export default class Sidebar extends Vue {
  private mounted() {
    const playPromise = MusicService.gonzales.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          MusicService.gonzales.volume = 0.2;
        })
        .catch((e) => {
          console.log(e);
          this.music = false;
        });
    }
  }
  private get vibration() {
    return this.$store.state.settings.vibration;
  }
  private set vibration(vibration: boolean) {
    if (vibration) {
      window.navigator.vibrate(1000);
    }
    this.commitToStore({ vibration });
  }
  private get music() {
    return this.$store.state.settings.music;
  }
  private set music(music: boolean) {
    const musicService = new MusicService();
    if (music) {
      musicService.playMusic();
    } else {
      musicService.stopMusic();
    }
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
>>> .sidebarAll {
  background-size: 100% 100%;
  background: url("~@/assets/marmor.jpg");
}
.sidebarMenu {
  position: fixed;
  right: 1vw;
  top: 1vh;
  background: transparent !important;
  border: none !important;
  z-index: 1000;
  font-size: 6vh;
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
.drinkboxChecked {
  background: url("~@/assets/bier-voll.png");
  height: 20vh;
  width: 10vw;
  display: inline-block;
  background-size: 100% 100%;
  overflow: hidden;

  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
.drinkboxUnchecked {
  background: url("~@/assets/bier-leer.png");
  height: 20vh;
  width: 10vw;
  display: inline-block;
  background-size: 100% 100%;
  overflow: hidden;

  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
.drinkboxText {
  margin-top: 10vh;
}
</style>
