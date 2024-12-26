import { html, TemplateResult } from "lit";
import "urlpattern-polyfill";

import { Context, Router } from "@thepassle/app-tools/router.js";

import "./pages/add";
import "./pages/about";
import "./pages/landing";
import "./pages/shows";
import "./pages/show-feed";
import "./pages/show";
import "./components/sp-header";
import "./components/sp-mobile-footer";
import "./components/sp-mobile-audio-player";
import "./components/sp-feed-list-item";
import "./components/sp-play-pause-button";
import "./components/sp-duration";

const baseURL: string = import.meta.env.BASE_URL;

function getPage(pageContent: (context: Context) => TemplateResult) {
  return function (context: Context) {
    return html`
      <sp-header></sp-header>
      <main>${pageContent(context)}</main>
      <sp-mobile-footer pathname=${context.url.pathname}></sp-mobile-footer>
    `;
  };
}

export const router = new Router({
  routes: [
    {
      path: resolveRouterPath(""),
      title: "Landing",
      render: () => {
        return html`<sp-landing-page></sp-landing-page>`;
      },
    },
    {
      path: resolveRouterPath("shows"),
      title: "Shows",
      render: getPage(() => html`<sp-shows-page></sp-shows-page>`),
    },
    {
      path: resolveRouterPath("shows/add"),
      title: "Add Show",
      render: getPage(() => html`<sp-add-feed-page></sp-add-feed-page>`),
    },
    {
      path: resolveRouterPath("shows/:link"),
      title: "Shows",
      render: getPage(
        ({ params }) =>
          html`<sp-show-feed-page .link=${params.link}></sp-show-feed-page>`,
      ),
    },
    {
      path: resolveRouterPath("shows/:link/:guid"),
      title: () => "Show",
      render: getPage(
        ({ params }) =>
          html`<sp-show .link=${params.link} .guid=${params.guid}></sp-show>`,
      ),
    },
    {
      path: resolveRouterPath("about"),
      title: "About",
      render: getPage(() => html`<sp-about-page></sp-about-page>`),
    },
  ],
});

// This function will resolve a path with whatever Base URL was passed to the vite build process.
// Use of this function throughout the starter is not required, but highly recommended, especially if you plan to use GitHub Pages to deploy.
// If no arg is passed to this function, it will return the base URL.

export function resolveRouterPath(unresolvedPath?: string) {
  let resolvedPath = baseURL;
  if (unresolvedPath) {
    resolvedPath = resolvedPath + unresolvedPath;
  }

  return resolvedPath;
}
