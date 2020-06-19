export default class MusicService {
  static gonzalesPlaylist = [require("../assets/iwantgonzales.mp3"), require("../assets/gonzalesbrueder.mp3")];
  static trackNumber = Math.round(Math.random() * MusicService.gonzalesPlaylist.length - 1);
  static gonzales = new Audio(MusicService.gonzalesPlaylist[MusicService.trackNumber]);

  public playMusic() {
    MusicService.gonzales.volume = 0.2;
    MusicService.gonzales.play();
    MusicService.gonzales.onended = () => {
      this.stopMusic();
      this.playMusic();
    };
  }
  public stopMusic() {
    MusicService.gonzales.pause();
    MusicService.gonzales.currentTime = 0;
    const albumlength = MusicService.gonzalesPlaylist.length;
    if (MusicService.trackNumber < albumlength - 1) {
      MusicService.trackNumber++;
    } else {
      MusicService.trackNumber = 0;
    }
    MusicService.gonzales = new Audio(MusicService.gonzalesPlaylist[MusicService.trackNumber]);
  }
}
