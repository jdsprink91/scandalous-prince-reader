import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./sp-loading-spinner";

@customElement("sp-loading-page")
export class SpLoadingPage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    div {
      display: grid;
      height: 200px;
      place-items: center;
    }
  `;

  @state()
  _showLoadingSpinner = false;

  @state()
  _timeout: number | null = null;

  private _setShowLoadingSpinner = () => {
    this._showLoadingSpinner = true;
  };

  connectedCallback() {
    super.connectedCallback();
    this._timeout = setTimeout(this._setShowLoadingSpinner, 200);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  render() {
    if (this._showLoadingSpinner) {
      return html`<div><sp-loading-spinner></sp-loading-spinner></div>`;
    }

    return null;
  }
}
