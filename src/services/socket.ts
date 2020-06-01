import io from "socket.io-client";

export default class Socket {
  static mySocket = null;

  public setMySocket() {
    let url = process.env.VUE_APP_WEBSERVICE_URL;
    url = url.replace(/;/g, "");
    Socket.mySocket = io(url);
  }
  public joinLobby(lobby: string) {
    Socket.mySocket.emit("joinLobby", lobby);
    Socket.mySocket.on("lobbyJoined", (data: any) => {
      console.log(data);
    });
  }
  /* 
    if(this.$route.query.lobby) {
        (this.$refs["lobby"] as any).show();

        let url = process.env.VUE_APP_WEBSERVICE_URL;
        url = url.replace(/;/g, "");
        this.socket = io(url);
        this.socket.emit("joinLobby", this.$route.query.lobby);
        this.socket.on("lobbyJoined", (data: any) => {
            console.log(data);
        });
    } */
}
