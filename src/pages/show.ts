import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FeedItemUgh, fetchFeedItems } from "../actions/feed";
import { Task } from "@lit/task";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { getPrettyDuration, niceTime } from "../utils/date";
import { AudioIntegratedElement } from "../components/audio-integrated-element";
import { getAudioPlayer, openAudioPlayer } from "../actions/audio";
import { getSPDB } from "../actions/database";

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
  `;

  @property({ type: String })
  guid: string;

  private _showTask = new Task(this, {
    task: async () => {
      const feedItems = await fetchFeedItems();
      const theThing = feedItems.find(
        ({ guid }) => guid === decodeURIComponent(this.guid),
      );

      if (theThing === undefined) {
        return undefined;
      }
      const url = theThing.enclosure?.url;

      if (url === undefined) {
        return theThing;
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

      this.currentTime = feedItemPlayback?.currentTime;
      return theThing;
    },
    args: () => [this.guid],
  });

  private _handlePlayClick =
    (feedItemUgh: FeedItemUgh | undefined) => async (event: Event) => {
      event.preventDefault();
      if (feedItemUgh && feedItemUgh.enclosure?.url) {
        const audioPlayer = getAudioPlayer();
        if (audioPlayer.src === feedItemUgh.enclosure?.url) {
          if (audioPlayer.paused) {
            audioPlayer.play();
          } else {
            audioPlayer.pause();
          }
        } else {
          await openAudioPlayer(
            feedItemUgh.feed.title!,
            feedItemUgh.title!,
            (feedItemUgh.itunes?.image ?? feedItemUgh.feed.image?.url)!,
            feedItemUgh.enclosure.url,
          );

          this.playing = true;
          this._addEventListeners();
        }
      }
    };

  private _renderShow = (feedItemUgh: FeedItemUgh | undefined) => {
    const duration = getPrettyDuration(feedItemUgh?.itunes?.duration);
    return html`
      <h1>${feedItemUgh?.title}</h1>
      <h2>${feedItemUgh?.feed.title}</h2>
      <date>${dayjs(feedItemUgh?.pubDate).format("MMM D, YYYY")}</date>
      <!-- GOTTA SLAP SOME PLAYBACK THINGS HERE -->
      <div class="playback">
        <time .datetime=${duration.format("HH:mm:ss")}
          >${niceTime(duration)}</time
        >
        <sp-play-pause-button
          .playing=${this.playing}
          @click=${this._handlePlayClick(feedItemUgh)}
        ></sp-play-pause-button>
      </div>
      <section>
        ${unsafeHTML(DOMPurify.sanitize(feedItemUgh?.content ?? ""))}
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
