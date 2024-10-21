import dayjs from "dayjs";
import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { openAudioPlayer } from "../actions/audio";

@customElement("sp-feed-item-card")
export class SpFeedItemCard extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    :host {
      display: block;
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
  `;

  @property({
    attribute: "title",
  })
  title: string = "";

  @property({
    attribute: "content-snippet",
  })
  contentSnippet: string = "";

  @property({
    attribute: "date-added",
  })
  dateAdded: string = "";

  @property({ attribute: "show-name" })
  showName: string = "";

  @property({ attribute: "img-src" })
  imgSrc: string = "";

  @property({ attribute: "audio-src" })
  audioSrc: string = "";

  private async _handlePlayClick() {
    openAudioPlayer(this.showName, this.title, this.imgSrc, this.audioSrc);
  }

  render() {
    return html` <li>
      <h2>${this.title}</h2>
      <p>${this.contentSnippet}</p>
      <div>
        <date>${dayjs(this.dateAdded).format("MMM D, YYYY")}</date>
        <button @click=${this._handlePlayClick}>Play me somethin</button>
      </div>
    </li>`;
  }
}
