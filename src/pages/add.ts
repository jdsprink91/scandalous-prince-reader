import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

//const TEST_RSS_FEED = "https://shoptalkshow.com/feed/";

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
  `;

  private async onFormSubmit(e: SubmitEvent) {
    e.preventDefault();

    //const formData = new FormData(e.target as HTMLFormElement);
    //const rssFeedUrl = formData.get("rss-feed") as string;
    //const rssFeedResponse = await fetch("/test");
    //const rssFeedJson = rssFeedResponse.json();
    //console.log(rssFeedJson);
  }

  render() {
    // so what do we need here?
    // 1. we need an input for taking in the url
    // 2. we need a button to search
    // 3. we need to display the podcast things items
    // 4. we need a button to add it
    // 5. figure out how to add to indexeddb
    return html`
      <form @submit=${this.onFormSubmit}>
        <input type="text" name="rss-feed" />
        <button type="submit">Search</button>
      </form>
    `;
  }
}
