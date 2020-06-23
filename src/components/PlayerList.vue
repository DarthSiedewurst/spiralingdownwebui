<template>
  <div>
    <div class="overflow">
      <b-row v-for="player in players" :key="player.id" class="player">
        <b-col cols="5">{{ player.name }}</b-col>
        <b-col cols="4">{{ mappedPlayers(player.color) }}</b-col>
        <b-col cols="2">
          <b-button
            v-if="!gameModeMultiplayer"
            @click="deletePlayer(player.id)"
            :size="deleteSize"
            class="deleteButton"
            type="button"
          >Löschen</b-button>
        </b-col>
      </b-row>
      <ValidationObserver ref="valid" v-if="!gameModeMultiplayer">
        <b-row v-if="addPlayerPossible">
          <b-col cols="5">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-input v-model="playerName"></b-input>
              <span class="playerValidation">{{ errors[0] }}</span>
            </ValidationProvider>
          </b-col>
          <b-col cols="4">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-select v-model="playerColor" :options="playerColors"></b-form-select>
              <span class="playerValidation">{{ errors[0] }}</span>
            </ValidationProvider>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </ValidationObserver>
    </div>
    <b-button
      :style="{
        'background-image': 'url(' + require('@/assets/bierdeckel.jpg') + ')',
      }"
      type="button"
      class="bierdeckel mt-2 float-left"
      v-if="gameModeMultiplayer"
      @click="copyInvitationLink"
    >Link kopieren</b-button>
    <WhatsAppButton
      class="share-button--circle mt-3 float-right"
      btnText
      v-if="isMobile && gameModeMultiplayer"
      :shareUrl="invitationLink"
    ></WhatsAppButton>

    <b-button
      :style="{
        'background-image': 'url(' + require('@/assets/bierdeckel.jpg') + ')',
      }"
      class="bierdeckel mt-2 float-left"
      v-if="!gameModeMultiplayer"
      type="button"
      @click="addPlayer"
    >Add Player</b-button>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-useless-escape */

// @ is an alias to /src
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "@/models/player";
import { validate } from "vee-validate";
import CONSTANTS from "@/constants";
import WhatsAppButton from "vue-share-buttons/src/components/WhatsAppButton.vue";
import Socket from "../services/socket";

@Component({
  components: { WhatsAppButton }
})
export default class PlayerList extends Vue {
  @Prop() private players!: Player[];
  @Prop() private gameModeMultiplayer!: boolean;

  private colors = CONSTANTS.COLORS;

  private invitationLink = "";
  private isMobile = false;

  private deleteSize = "";

  private mappedPlayers(playerColor: string) {
    let mappedColor = "not found";
    this.colors.forEach(color => {
      if (playerColor === color.value) {
        mappedColor = color.text;
      }
    });
    return mappedColor;
  }

  private mounted() {
    let url = process.env.VUE_APP_WEBSERVICE_URL;
    url = url.replace(/;/g, "");
    url = url.replace(/:3000/g, "");
    url = url + "?lobby=" + Socket.mySocket.id;
    this.invitationLink = url;

    // device detection
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      this.isMobile = true;
      this.deleteSize = "sm";
    }
  }
  private copyInvitationLink() {
    navigator.clipboard.writeText(this.invitationLink);
  }

  private get playerColors(): string[] {
    // Todo any
    const colors: any[] = [...this.colors];
    this.players.forEach(element => {
      if (
        colors
          .map(e => {
            return e.value;
          })
          .indexOf(element.color) > -1
      ) {
        colors.splice(
          colors
            .map(e => {
              return e.value;
            })
            .indexOf(element.color),
          1
        );
      }
    });
    return colors;
  }

  private get addPlayerPossible() {
    return this.players.length > 11 ? false : true;
  }

  private playerName = "";
  private playerColor = "";

  private addPlayer() {
    (this.$refs.valid as any).validate().then((success: boolean) => {
      if (success) {
        if (this.players.length > 11) {
          return;
        }
        const id = this.players.length;
        const activeTurn = this.players.length === 0 ? true : false;
        const newPlayer: Player = {
          id,
          name: this.playerName,
          activeTurn,
          tile: 0,
          color: this.playerColor
        };
        this.$emit("addPlayer", newPlayer);
        this.playerName = "";
        this.playerColor = "";
        this.$nextTick(() => (this.$refs.valid as any).reset());
      }
    });
  }
  private deletePlayer(playerId: number) {
    this.$emit("deletePlayer", playerId);
  }
}
</script>

<style lang="scss" scoped>
.deleteButton {
  background-color: darkred;
}
.overflow {
  height: 60vh;
  overflow: auto;
  overflow-x: hidden;
}
.player {
  font-size: 2vw;
}
.playerValidation {
  font-size: 1vw;
}
</style>
