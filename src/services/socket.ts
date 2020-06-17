import io from "socket.io-client";
import Player from "@/models/player";
import Ruleset from "@/models/ruleset";
import { Vue } from "vue-property-decorator";
import Store from "@/store/index.ts";

export default class Socket extends Vue {
  static mySocket = null;
  static ruleset: Ruleset = new Ruleset();
  static lobby = null;

  public setMySocket() {
    let url = process.env.VUE_APP_WEBSERVICE_URL;
    url = url.replace(/;/g, "");
    Socket.mySocket = io(url);
  }
  public joinLobby(lobby: string) {
    Socket.mySocket.emit("joinLobby", lobby);
    Socket.mySocket.on("lobbyJoined", (data: any) => {
      Socket.lobby = lobby;
      console.log(data);
    });
  }
  //Ruleset
  public setRuleset(ruleset: Ruleset) {
    Socket.mySocket.emit("setRulesetToSocket", { ruleset, lobby: Socket.lobby });
  }
}
