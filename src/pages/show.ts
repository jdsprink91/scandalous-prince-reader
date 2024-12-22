import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FeedItemUgh, fetchFeedItems } from "../actions/feed";
import { Task } from "@lit/task";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("sp-show")
export class SpShow extends LitElement {
  @property({ type: String })
  guid: string;

  private _showTask = new Task(this, {
    task: async () => {
      const feedItems = await fetchFeedItems();
      return feedItems.find(
        ({ guid }) => guid === decodeURIComponent(this.guid),
      );
    },
    args: () => [this.guid],
  });

  private _renderShow = (feedItemUgh: FeedItemUgh | undefined) => {
    console.log(feedItemUgh);
    return html`
      <h1>${feedItemUgh?.title}</h1>
      <h2>${feedItemUgh?.feed.title}</h2>
      <date>${dayjs(feedItemUgh?.pubDate).format("MMM D, YYYY")}</date>
      <!-- GOTTA SLAP SOME PLAY THINGS HERE -->
      <section>
        ${unsafeHTML(DOMPurify.sanitize(feedItemUgh?.content ?? ""))}
      </section>
    `;
  };

  connectedCallback() {
    super.connectedCallback();
    document.documentElement.scrollTo(0, 0);
  }

  render() {
    return this._showTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderShow,
    });
  }
}
