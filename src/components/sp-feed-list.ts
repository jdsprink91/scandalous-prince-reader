import dayjs from "dayjs";
import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { openAudioPlayer } from "../actions/audio";
import "../components/sp-show-img";

export interface FeedItemCard {
  audioSrc: string;
  title: string;
  showName: string;
  contentSnippet?: string;
  dateAdded?: Date;
  imgSrc?: string;
}

@customElement("sp-feed-list")
export class SpFeedList extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    :host {
      display: block;
    }

    ul {
      padding-left: 0;
    }

    li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      list-style: none;
      min-height: 10rem;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      padding-bottom: 0.75rem;
    }

    li + li {
      padding-top: 0.75rem;
      border-top: 1px solid black;
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

    .play-button {
      margin-left: auto;
    }
  `;

  @property({ type: Array, attribute: "feed-items" })
  feedItems: FeedItemCard[] = [];

  private async _handlePlayClick(card: FeedItemCard) {
    openAudioPlayer(card.showName, card.title, card.imgSrc!, card.audioSrc);
  }

  render() {
    return html` <ul>
      ${this.feedItems.map((feedItem) => {
        return html`
          <li>
            <div class="header-container">
              <sp-show-img .src=${feedItem.imgSrc}></sp-show-img>
              <div class="ugh">
                <h2>${feedItem.title}</h2>
                <p>${feedItem.showName}</p>
              </div>
            </div>
            <p class="content-snippet">${feedItem.contentSnippet}</p>
            <div class="date-and-action-container">
              <date>${dayjs(feedItem.dateAdded).format("MMM D, YYYY")}</date>
              <button
                class="play-button"
                @click=${() => this._handlePlayClick(feedItem)}
              >
                Play me somethin
              </button>
            </div>
          </li>
        `;
      })}
    </ul>`;
  }
}
