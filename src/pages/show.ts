import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { fetchFeed } from "../actions/feed";
import { Task } from "@lit/task";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { AudioIntegratedElement } from "../components/audio-integrated-element";
import { getAudioPlayer, openAudioPlayer } from "../actions/audio";
import { getSPDB } from "../actions/database";
import { Feed, FeedItem } from "../types/rss";

@customElement("sp-show")
export class SpShow extends AudioIntegratedElement {
  static styles = css`
    .playback {
      display: flex;
      align-items: center;
    }

    sp-play-pause-button {
      margin-left: auto;
      width: 30px;
    }

    .time-modifier {
      margin-left: 0.25rem;
    }
  `;

  @property({ type: String })
  link: string;

  @property({ type: String })
  guid: string;

  private _showTask = new Task(this, {
    task: async () => {
      const feed = await fetchFeed(decodeURIComponent(this.link));
      const theThing = feed.items.find(
        ({ guid }) => guid === decodeURIComponent(this.guid),
      );

      if (theThing === undefined) {
        return undefined;
      }
      const url = theThing.enclosure?.url;

      if (url === undefined) {
        return feed;
      }

      const audioPlayer = getAudioPlayer();
      if (audioPlayer.src === url) {
        this._addEventListeners();
        if (!audioPlayer.paused) {
          this.playing = true;
        }
      }
      const db = await getSPDB();
      const feedItemPlayback = await db.get("feed-item-playback", url);

      this.ended = feedItemPlayback?.played ?? false;
      this.currentTime = feedItemPlayback?.currentTime;

      return feed;
    },
    args: () => [this.guid],
  });

  private _handlePlayClick = (feed: Feed, feedItem: FeedItem) => async () => {
    if (feedItem && feedItem.enclosure?.url) {
      const audioPlayer = getAudioPlayer();
      if (audioPlayer.src === feedItem.enclosure?.url) {
        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      } else {
        await openAudioPlayer(
          feed.title!,
          feedItem.title!,
          (feedItem.itunes?.image ?? feed.image?.url)!,
          feedItem.enclosure.url,
        );

        this.playing = true;
        this._addEventListeners();
      }
    }
  };

  private _renderShow = (feed: Feed | undefined) => {
    if (feed === undefined) {
      return null;
    }

    const feedItem = feed.items.find(
      ({ guid }) => guid === decodeURIComponent(this.guid),
    );

    if (!feedItem) {
      return null;
    }

    return html`
      <h1>${feed.title}</h1>
      <h2>${feedItem.title}</h2>
      <date>${dayjs(feedItem.pubDate).format("MMM D, YYYY")}</date>
      <div class="playback">
        ${this._renderDuration(feedItem.itunes?.duration ?? "")}
        <sp-play-pause-button
          .playing=${this.playing}
          @click=${this._handlePlayClick(feed, feedItem)}
        ></sp-play-pause-button>
      </div>
      <section>
        ${unsafeHTML(DOMPurify.sanitize(feedItem.content ?? ""))}
      </section>
    `;
  };

  connectedCallback() {
    super.connectedCallback();
    // sometimes, we get here from scrolling down to the show and it doesn't
    // pop back up when we want to
    document.documentElement.scrollTo(0, 0);
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  render() {
    return this._showTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderShow,
    });
  }
}
