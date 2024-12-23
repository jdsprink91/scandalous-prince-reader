import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getAudioPlayer, openAudioPlayer } from "../actions/audio";
import { FeedItemPlaybackRow } from "../types/database";
import { AudioIntegratedElement } from "./audio-integrated-element";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export interface FeedItemCard {
  audioSrc: string;
  title: string;
  showName: string;
  duration: string;
  guid: string;
  feedUrl: string;
  feedItemPlayback?: FeedItemPlaybackRow;
  contentSnippet?: string;
  dateAdded?: Date;
  imgSrc?: string;
}

@customElement("sp-feed-list-item")
export class SpFeedListItem extends AudioIntegratedElement {
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
      position: relative;
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
      z-index: 2;
    }

    a {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  `;

  @property({ type: Object })
  feedItem: FeedItemCard;

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
        this.playing = false;
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

  connectedCallback() {
    super.connectedCallback();
    const audioPlayer = getAudioPlayer();
    if (audioPlayer.src === this.feedItem.audioSrc) {
      this._connectToAudioPlayer();
      if (!audioPlayer.paused) {
        this.playing = true;
      }
    }

    this.ended = this.feedItem.feedItemPlayback?.played ?? false;
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
    const linkToShow = `shows/${encodeURIComponent(this.feedItem.feedUrl)}/${encodeURIComponent(this.feedItem.guid)}`;
    return html`
      <div>
        <a .href=${linkToShow}></a>
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
          ${this._renderDuration(this.feedItem.duration)}
          <sp-play-pause-button
            .playing=${this.playing}
            @click=${this._handlePlayClick}
          ></sp-play-pause-button>
        </div>
      </div>
    `;
  }
}
