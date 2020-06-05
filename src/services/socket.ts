import io from "socket.io-client";
import Player from "@/models/player";
import Ruleset from "@/models/ruleset";
import { Vue } from "vue-property-decorator";
import Store from "@/store/index.ts";

export default class Socket extends Vue {
  static mySocket = null;
  private static lobby = "";
  private static players: Player[] = [];
  static ruleset: Ruleset = new Ruleset();

  public get players(): Player[] {
    return Socket.players;
  }
  public set players(val: Player[]) {
    Socket.players = val;
  }

  public setMySocket() {
    let url = process.env.VUE_APP_WEBSERVICE_URL;
    url = url.replace(/;/g, "");
    Socket.mySocket = io(url);
  }
  public joinLobby(lobby: string) {
    Socket.mySocket.emit("joinLobby", lobby);
    Socket.lobby = lobby;
    Socket.mySocket.on("lobbyJoined", (data: any) => {
      console.log(data);
    });
  }
  public async addPlayerToSocket(newPlayer: Player) {
    Socket.mySocket.emit("addPlayerToSocket", {
      newPlayer,
      lobby: Socket.lobby,
    });
    await Socket.mySocket.on("playersUpdated", (newPlayers: any) => {
      console.log("New Players from Server: " + newPlayers);
      Socket.players = newPlayers;
      Store.commit("setPlayers", newPlayers);
    });
  }
}
