# Scandalous Prince Reader

I have no idea what I'm doing, but I wanna build an RSS feed reader that works
for podcasts.

## V0.0.1 checklist

Goal here is to just get the basic scaffolding up and running.

- [x] Vite, Lit, Typescript
- [x] Router (https://github.com/thepassle/app-tools/blob/master/router/README.md)
- [x] Lit + neovim setup
- [x] add prettier and eslint officially
- [x] CSS reset
- [x] Fonts (I want a goofy one for the logo and some serious ones for the page)
- [x] Icon (could snag one from that one website I always do)
- [x] Footer with nav with no shadow DOM and can take params

## V0.0.2 checklist

- [x] Add landing page, feed page, add page
- [ ] do some basic animation on landing page and include links to other pages
      (don't care yet -- pushing this to later)

## V0.0.3 checklist

This one is gonna be the first feature: add an RSS feed and display it back.

- [x] Figure out how functions work so I can actually read an RSS feed. CORS
      issues are preventing this from being a FE only project.
- [x] Get dev setup with functions.
- [ ] display items from fetch
- [ ] Figure out what indexeddb library to use (dixie looks promising)
- [ ] How do we want to store rss feeds and items? Seems like this one will be
      non-trivial. I'm thinking we'd maybe need an entry for the rss feed info and
      then separate entries for the entries
- [ ] Figure out lit and best way to display these
