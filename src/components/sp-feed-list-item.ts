import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getAudioPlayer, openAudioPlayer } from "../actions/audio";
import { FeedItemPlaybackRow } from "../types/database";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export interface FeedItemCard {
  audioSrc: string;
  title: string;
  showName: string;
  duration: string;
  feedItemPlayback?: FeedItemPlaybackRow;
  contentSnippet?: string;
  dateAdded?: Date;
  imgSrc?: string;
}

function niceTime(duration: duration.Duration) {
  const hours = duration.get("h");
  const minutes = duration.get("m");
  const hourString = hours
    ? `${duration.get("h")} hour${hours > 1 ? "s" : ""}`
    : "";
  const minuteString = minutes
    ? `${duration.get("m")} minute${minutes > 1 ? "s" : ""} `
    : "";

  if (hourString && !minuteString) {
    return hourString;
  }

  if (hourString && minuteString) {
    return `${hourString}, ${minuteString}`;
  }

  if (minuteString) {
    return minuteString;
  }

  return null;
}

@customElement("sp-feed-list-item")
export class SpFeedListItem extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      list-style: none;
      min-height: 10rem;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      padding-bottom: 0.75rem;
    }

    .header-container {
      display: flex;
    }

    img {
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      width: 60px;
      height: 60px;
    }

    .ugh {
      margin-left: 1rem;
    }

    h2 {
      font-size: 1.125rem;
      margin: 0;
    }

    h2 + p {
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

    .content-snippet {
      flex-shrink: 2;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .date-and-action-container {
      display: flex;
      align-items: center;
    }

    date {
      margin-top: 0;
      margin-bottom: 0;
    }

    time {
      margin-left: 0.5rem;
    }

    .time-modifier {
      margin-left: 0.25rem;
    }

    sp-play-pause-button {
      margin-left: auto;
      width: 30px;
    }
  `;

  @property({ type: Object })
  feedItem: FeedItemCard;

  @state()
  playing: boolean = false;

  @state()
  currentTime: number | undefined = undefined;

  private _handlePlay = () => {
    this.playing = true;
  };

  private _handlePause = () => {
    this.playing = false;
  };

  private _handleTimeUpdate = (e: Event) => {
    if (e.target instanceof HTMLAudioElement) {
      // don't know when to save, but this seems reasonable
      this.currentTime = e.target.currentTime;
    }
  };

  private _addEventListeners = () => {
    const audioPlayer = getAudioPlayer();
    audioPlayer.addEventListener("play", this._handlePlay);
    audioPlayer.addEventListener("pause", this._handlePause);
    audioPlayer.addEventListener("timeupdate", this._handleTimeUpdate);
  };

  private _removeEventListeners = () => {
    const audioPlayer = getAudioPlayer();
    audioPlayer.removeEventListener("play", this._handlePlay);
    audioPlayer.removeEventListener("pause", this._handlePause);
    audioPlayer.removeEventListener("timeupdate", this._handleTimeUpdate);
  };

  private _mutationObserverCallback: MutationCallback = (
    mutationList,
    observer,
  ) => {
    for (const mutation of mutationList) {
      // we only attach this observer after we know that the audio player has
      // set the src to this feed items source. Thus, if this is called,
      // we know that the src has changed away to something else.
      if (mutation.type === "attributes" && mutation.attributeName === "src") {
        this._disconnectFromAudioPlayer(observer);
      }
    }
  };

  private _mutationObserver: MutationObserver = new MutationObserver(
    this._mutationObserverCallback,
  );

  private _connectToAudioPlayer = () => {
    this._addEventListeners();
    this._mutationObserver.observe(getAudioPlayer(), { attributes: true });
  };

  private _disconnectFromAudioPlayer = (observer: MutationObserver) => {
    this._removeEventListeners();
    observer.disconnect();
  };

  private _handlePlayClick = async () => {
    const audioPlayer = getAudioPlayer();
    if (audioPlayer.src === this.feedItem.audioSrc) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    } else {
      await openAudioPlayer(
        this.feedItem.showName,
        this.feedItem.title,
        this.feedItem.imgSrc!,
        this.feedItem.audioSrc,
      );

      this.playing = true;
      this._connectToAudioPlayer();
    }
  };

  private _renderDuration = () => {
    const convertedTime = dayjs(this.feedItem.duration, "HH:mm:ss");
    const duration = dayjs.duration({
      hours: convertedTime.hour(),
      minutes: convertedTime.minute(),
      seconds: convertedTime.second(),
    });

    if (this.feedItem.feedItemPlayback?.played) {
      return html`
        <time .datetime=${this.feedItem.duration}>${niceTime(duration)}</time>
        <p class="time-modifier">Played!</p>
      `;
    }

    if (this.currentTime) {
      const timePlayed = Math.floor(this.currentTime);
      const timeLeft = duration.subtract({ seconds: timePlayed });

      return html`
        <time .datetime=${timeLeft.format("HH:mm:ss")}
          >${niceTime(timeLeft)}</time
        >
        <p class="time-modifier">remaining</p>
      `;
    }

    return html`
      <time .datetime=${this.feedItem.duration}>${niceTime(duration)}</time>
    `;
  };

  connectedCallback() {
    super.connectedCallback();
    const audioPlayer = getAudioPlayer();
    if (audioPlayer.src === this.feedItem.audioSrc) {
      this._connectToAudioPlayer();
      if (!audioPlayer.paused) {
        this.playing = true;
      }
    }

    this.currentTime = this.feedItem.feedItemPlayback?.currentTime;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const audioPlayer = getAudioPlayer();
    if (audioPlayer.src === this.feedItem.audioSrc) {
      this._disconnectFromAudioPlayer(this._mutationObserver);
    }
  }

  render() {
    return html`
      <div class="header-container">
        <sp-show-img .src=${this.feedItem.imgSrc}></sp-show-img>
        <div class="ugh">
          <h2>${this.feedItem.title}</h2>
          <p>${this.feedItem.showName}</p>
        </div>
      </div>
      <p class="content-snippet">${this.feedItem.contentSnippet}</p>
      <div class="date-and-action-container">
        <date>${dayjs(this.feedItem.dateAdded).format("MMM D, YYYY")}</date>
        ${this._renderDuration()}
        <sp-play-pause-button
          .playing=${this.playing}
          @click=${() => this._handlePlayClick()}
        ></sp-play-pause-button>
      </div>
    `;
  }
}
