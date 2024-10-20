import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Feed } from "../types/rss";
import sleepyCat from "../assets/noun-sleepy-cat-6113435.svg";
import "../components/sp-loading-spinner";
import { addFeedToSPDB } from "../actions/feed";

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
  `;

  @state()
  private _loading: boolean = false;

  @state()
  private _error: boolean = false;

  @state()
  private _adding: boolean = false;

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

  private async _handleAdd() {
    if (this._feed) {
      await addFeedToSPDB(this._feed);
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
          <button @click=${this._handleAdd}>Add Feed</button>
        </div>
        `;
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
