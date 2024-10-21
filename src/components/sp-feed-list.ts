import dayjs from "dayjs";
import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { openAudioPlayer } from "../actions/audio";

export interface FeedItemCard {
  audioSrc: string;
  title: string;
  showName: string;
  contentSnippet?: string;
  dateAdded?: string;
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

    li + li {
      margin-top: 0.25rem;
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
  `;

  @property({ type: Array, attribute: "feed-items" })
  feedItems: FeedItemCard[] = [];

  private async _handlePlayClick(card: FeedItemCard) {
    openAudioPlayer(card.showName, card.title, card.imgSrc, card.audioSrc);
  }

  render() {
    return html` <ul>
      ${this.feedItems.map((feedItem) => {
        return html`
          <li>
            <h2>${feedItem.title}</h2>
            <p>${feedItem.contentSnippet}</p>
            <div>
              <date>${dayjs(feedItem.dateAdded).format("MMM D, YYYY")}</date>
              <button @click=${() => this._handlePlayClick(feedItem)}>
                Play me somethin
              </button>
            </div>
          </li>
        `;
      })}
    </ul>`;
  }
}
