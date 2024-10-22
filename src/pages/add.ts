import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Feed } from "../types/rss";
import sleepyCat from "../assets/noun-sleepy-cat-6113435.svg";
import "../components/sp-loading-spinner";
import { addFeed } from "../actions/feed";
import { Task } from "@lit/task";

@customElement("sp-add-feed-page")
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
  `;

  @state()
  private _feedUrl: string | null = null;

  private _parseFeed = new Task(this, {
    task: async ([feedUrl]) => {
      if (feedUrl) {
        const rssFeedResponse = await fetch("/api/read-rss-feed", {
          method: "post",
          body: JSON.stringify({
            q: feedUrl,
          }),
        });
        if (!rssFeedResponse.ok) {
          throw new Error("whoops");
        }
        return rssFeedResponse.json();
      }

      return null;
    },
    args: () => [this._feedUrl],
  });

  private _handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    this._feedUrl = formData.get("rss-feed") as string;
  };

  private _handleAdd = async (feed: Feed) => {
    await addFeed(feed);
  };

  private _renderLoading = () => {
    return html`
      <div class="loading-error-container">
        <sp-loading-spinner></sp-loading-spinner>
      </div>
    `;
  };

  private _renderError = () => {
    return html`
      <div class="loading-error-container">
        <div>
          <img src=${sleepyCat} height="200" width="200" />
          <p>Could not find or parse your feed</p>
        </div>
      </div>
    `;
  };

  private _renderFeed = (feed: Feed) => {
    return html`
        <div class="podcast-info-container">
          <img heigh="100" width="100" src="${ifDefined(feed.image?.url)}"></img>
          <div>
            <p>${feed.title}</p>
            <p>${feed.description}</p>
          </div>
          <button @click=${() => this._handleAdd(feed)}>Add Feed</button>
        </div>
        `;
  };

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <input type="text" name="rss-feed" />
        <button type="submit">Search</button>
      </form>
      ${this._feedUrl !== null
        ? html`
            ${this._parseFeed.render({
              pending: this._renderLoading,
              error: this._renderError,
              complete: this._renderFeed,
            })}
          `
        : nothing}
    `;
  }
}
