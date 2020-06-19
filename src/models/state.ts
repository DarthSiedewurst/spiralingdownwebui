import Setting from "./setting";
import Player from "./player";
import Ruleset from "./ruleset";
import importetRules from "@/rules";

export default class State {
  settings: Setting = new Setting();
  players: Player[] = [];
  ruleset: Ruleset = importetRules.SpiralingDown;
  gameModeMultiplayer: boolean;
  socket: any = {};
  yourId = 0;
}
