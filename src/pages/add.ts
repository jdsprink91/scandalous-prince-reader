import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import sleepyCat from "../assets/noun-sleepy-cat-6113435.svg";
import "../components/sp-loading-spinner";
import { Task } from "@lit/task";
import "../components/sp-add-feed-item";

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
  `;

  private _parseFeed = new Task(this, {
    task: async ([feedUrl]: [string]) => {
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
  });

  private _handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const feedUrl = formData.get("rss-feed") as string;
    this._parseFeed.run([feedUrl]);
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

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <input type="text" name="rss-feed" />
        <button type="submit">Search</button>
      </form>
      ${this._parseFeed.render({
        pending: () => html`<sp-loading-page></sp-loading-page>`,
        error: this._renderError,
        complete: (feed) =>
          html`<sp-add-feed-item .feed=${feed}></sp-add-feed-item>`,
        initial: () => nothing,
      })}
    `;
  }
}
