import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import dayjs from "dayjs";
import { Feed, FeedItem } from "../types/rss";
import sleepyCat from "../assets/noun-sleepy-cat-6113435.svg";
import "../components/sp-loading-spinner";

function openAudioPlayer(feed: Feed, item: FeedItem) {
  const audio = document.querySelector<HTMLAudioElement>("#my-audio");
  let player = document.querySelector("sp-mobile-audio-player");

  if (!player) {
    player = document.createElement("sp-mobile-audio-player");
    document.body.appendChild(player);
  }

  if (!item.enclosure?.url || !audio) {
    return null;
  }

  if (item.enclosure.url! === audio.getAttribute("src")) {
    return null;
  }

  const imgSrc = item.itunes?.image ?? feed.image?.url;

  player.setAttribute("show-name", feed.title!);
  player.setAttribute("title", item.title!);
  player.setAttribute("img-src", imgSrc!);

  // this ALWAYS has to be last
  audio.setAttribute("src", item.enclosure.url!);

  // make sure the widget on lock screen looks good
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: item.title,
      artist: feed.title,
      artwork: [
        {
          src: imgSrc!,
        },
      ],
    });

    const actionHandlers: [
      MediaSessionAction,
      ((details: MediaSessionActionDetails) => void) | null,
    ][] = [
      [
        "play",
        async () => {
          await audio.play();
          navigator.mediaSession.playbackState = "playing";
        },
      ],
      [
        "pause",
        () => {
          audio.pause();
          navigator.mediaSession.playbackState = "paused";
        },
      ],
      ["previoustrack", null],
      ["nexttrack", null],
      ["stop", null],
      [
        "seekbackward",
        (details) => {
          audio.currentTime = Math.max(
            audio.currentTime - (details.seekOffset ?? 15),
            0,
          );
        },
      ],
      [
        "seekforward",
        (details) => {
          audio.currentTime = Math.min(
            audio.currentTime + (details.seekOffset ?? 15),
            audio.duration,
          );
        },
      ],
      [
        "seekto",
        (details) => {
          audio.currentTime = details.seekTime ?? 0;
        },
      ],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        console.log(
          `The media session action "${action}" is not supported yet.`,
        );
      }
    }
  }
}

// local state
let input: string | null = null;
let cachedFeed: Feed | null = null;

@customElement("sp-add-page")
export class SpAddPage extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    :host {
      display: block;
    }

    form {
      display: flex;
    }

    input {
      flex-grow: 1;
    }

    button[type="submit"] {
      margin-left: 2rem;
    }

    .podcast-info-container {
      display: flex;
      margin-top: 1rem;
    }

    .loading-error-container {
      display: grid;
      height: 200px;
      place-items: center;
    }

    li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      list-style: none;
      border: 1px solid black;
      border-radius: 2px;
      height: 10rem;
      padding: 0.5rem 0.25rem;
    }

    li > h2 {
      font-size: 1.125rem;
      margin: 0;
    }

    li > p {
      flex-shrink: 2;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    li > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    li > div > date {
      margin-top: 0;
      margin-bottom: 0;
    }

    li + li {
      margin-top: 0.25rem;
    }

    ul {
      padding-left: 0;
    }
  `;

  @state()
  private _loading: boolean = false;

  @state()
  private _error: boolean = false;

  @state()
  private _feed: Feed | null = cachedFeed;

  private async _handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    this._loading = true;
    this._error = false;
    const formData = new FormData(e.target as HTMLFormElement);
    const rssFeedUrl = formData.get("rss-feed") as string;
    input = rssFeedUrl;
    try {
      const rssFeedResponse = await fetch("/api/read-rss-feed", {
        method: "post",
        body: JSON.stringify({
          q: rssFeedUrl,
        }),
      });
      if (!rssFeedResponse.ok) {
        throw new Error("whoops");
      }
      const rssFeedJson: Feed = await rssFeedResponse.json();
      this._feed = rssFeedJson;
      cachedFeed = rssFeedJson;
    } catch {
      input = "";
      cachedFeed = null;
      this._error = true;
    } finally {
      this._loading = false;
    }
  }

  private _handlePlayClick(item: FeedItem) {
    if (this._feed) {
      openAudioPlayer(this._feed, item);
    }
  }

  private _renderLoading() {
    return html`
      <div class="loading-error-container">
        <sp-loading-spinner></sp-loading-spinner>
      </div>
    `;
  }

  private _renderError() {
    return html`
      <div class="loading-error-container">
        <div>
          <img src=${sleepyCat} height="200" width="200" />
          <p>Could not find or parse your feed</p>
        </div>
      </div>
    `;
  }

  private _renderFeed() {
    if (this._feed) {
      return html`
        <div class="podcast-info-container">
          <img heigh="100" width="100" src="${ifDefined(this._feed.image?.url)}"></img>
          <div>
            <p>${this._feed.title}</p>
            <p>${this._feed.description}</p>
          </div>
        </div>
        <ul>
          ${this._feed.items.map((item) => {
            return html` <li>
              <h2>${item.title}</h2>
              <p>${item.contentSnippet}</p>
              <div>
                <date>${dayjs(item.isoDate).format("MMM D, YYYY")}</date>
                <button @click=${() => this._handlePlayClick(item)}>
                  Play me somethin
                </button>
              </div>
            </li>`;
          })}
        </ul>`;
    }

    return nothing;
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <input type="text" name="rss-feed" value=${input ?? ""} />
        <button type="submit">Search</button>
      </form>
      ${this._loading ? this._renderLoading() : nothing}
      ${this._error ? this._renderError() : nothing}
      ${!this._loading && !this._error ? this._renderFeed() : nothing}
    `;
  }
}
