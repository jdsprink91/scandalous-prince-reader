import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FeedItemUgh, fetchFeedItems } from "../actions/feed";
import { Task } from "@lit/task";

@customElement("sp-show")
export class SpShow extends LitElement {
  @property({ type: String })
  guid: string;

  private _showTask = new Task(this, {
    task: async () => {
      const feedItems = await fetchFeedItems();
      return feedItems.find(({ guid }) => guid === this.guid);
    },
    args: () => [this.guid],
  });

  private _renderShow = (feedItemUgh: FeedItemUgh | undefined) => {
    console.log(feedItemUgh);
    return html`<p>${this.guid}</p>`;
  };

  render() {
    return this._showTask.render({
      pending: () => html`<sp-loading-page></sp-loading-page>`,
      complete: this._renderShow,
    });
  }
}
