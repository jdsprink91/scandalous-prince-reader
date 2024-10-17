import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import dayjs from "dayjs";
import { Feed, FeedItem } from "../types/rss";

function openAudioPlayer(feed: Feed, item: FeedItem) {
  const audio = document.querySelector("#my-audio");
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
}

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
  private _feed?: Feed;

  private async _handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const rssFeedUrl = formData.get("rss-feed") as string;
    const rssFeedResponse = await fetch("/api/read-rss-feed", {
      method: "post",
      body: JSON.stringify({
        q: rssFeedUrl,
      }),
    });
    const rssFeedJson: Feed = await rssFeedResponse.json();

    this._feed = rssFeedJson;
  }

  private _handlePlayClick(item: FeedItem) {
    if (this._feed) {
      openAudioPlayer(this._feed, item);
    }
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
          ${this._feed.items.map(
            (item) =>
              html`<li>
                <h2>${item.title}</h2>
                <p>${item.contentSnippet}</p>
                <div>
                  <date>${dayjs(item.isoDate).format("MMM D, YYYY")}</date>
                  <button @click=${() => this._handlePlayClick(item)}>
                    Play me somethin
                  </button>
                </div>
              </li>`,
          )}
        </ul>`;
    }

    return html`<p>got nothin</p>`;
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <input type="text" name="rss-feed" />
        <button type="submit">Search</button>
      </form>
      ${this._renderFeed()}
    `;
  }
}
