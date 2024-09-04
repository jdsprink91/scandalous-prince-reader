// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md

import { html, TemplateResult } from "lit";

if (!("URLPattern" in globalThis)) {
  await import("urlpattern-polyfill");
}

import { Context, Router } from "@thepassle/app-tools/router.js";

import "./pages/home";
import "./pages/about";

const baseURL: string = import.meta.env.BASE_URL;

function getPage(pageContent: TemplateResult) {
  return function (context: Context) {
    console.log(context);
    return html`
      ${pageContent}
      <sp-footer></sp-footer>
    `;
  };
}

export const router = new Router({
  routes: [
    {
      path: resolveRouterPath(),
      title: "Home",
      render: getPage(html`<sp-home-page></sp-home-page>`),
    },
    {
      path: resolveRouterPath("about"),
      title: "About",
      render: getPage(html`<sp-about-page></sp-about-page>`),
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
