export default class MusicService {
  static gonzales = new Audio(require("../assets/gonzales.mp3"));

  public playMusic() {
    MusicService.gonzales.volume = 0.2;
    MusicService.gonzales.play();
    MusicService.gonzales.loop = true;
  }
  public stopMusic() {
    MusicService.gonzales.pause();
    MusicService.gonzales.currentTime = 0;
  }
}
