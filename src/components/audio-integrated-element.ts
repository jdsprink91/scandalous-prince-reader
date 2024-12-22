import { LitElement } from "lit";
import { state } from "lit/decorators.js";
import { getAudioPlayer } from "../actions/audio";

export class AudioIntegratedElement extends LitElement {
  @state()
  playing: boolean = false;

  @state()
  currentTime: number | undefined = undefined;

  protected _handlePlay = () => {
    this.playing = true;
  };

  protected _handlePause = () => {
    this.playing = false;
  };

  protected _handleTimeUpdate = (e: Event) => {
    if (e.target instanceof HTMLAudioElement) {
      // don't know when to save, but this seems reasonable
      this.currentTime = e.target.currentTime;
    }
  };

  protected _addEventListeners = () => {
    const audioPlayer = getAudioPlayer();
    audioPlayer.addEventListener("play", this._handlePlay);
    audioPlayer.addEventListener("pause", this._handlePause);
    audioPlayer.addEventListener("timeupdate", this._handleTimeUpdate);
  };

  protected _removeEventListeners = () => {
    const audioPlayer = getAudioPlayer();
    audioPlayer.removeEventListener("play", this._handlePlay);
    audioPlayer.removeEventListener("pause", this._handlePause);
    audioPlayer.removeEventListener("timeupdate", this._handleTimeUpdate);
  };
}
