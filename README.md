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

## V0.0.3 checklist

This one is gonna be the first feature: search for RSS feed, parse it, play
something.

- [x] Figure out how functions work so I can actually read an RSS feed. CORS
      issues are preventing this from being a FE only project.
- [x] Get dev setup with functions.
- [x] display items from fetch
- [x] add mobile listener
- [x] document test feed
- [x] check to see if PWA is working
- [x] save state between pages (global state?)
- [x] get manifest working so player looks good when phone is closed
- [x] loading state
- [x] error state

## V0.0.4 checklist

- [x] Move some code around to make it easier to work with
- [x] Add rss feed and items to indexeddb
- [x] Display feed on page
- [ ] add shows page. List shows and add new one
- [ ] delete rss feed

## V0.0.5 checklist

- [ ] backup image for everything
- [ ] get play and pause button
- [ ] do some checks to make sure that our feed has fields required by db
- [ ] Build page for individual feed item
- [ ] Get rid of `LiteDomLitElement`

## V0.0.6 checklist

- [ ] figure out state needed for playing items (played, save last place, etc)
- [ ] Full page audio player
- [ ] Add hour to mobile audio player

# Testing

Some test urls

- https://shoptalkshow.com/feed/podcast
- https://feed.podbean.com/demolisten/feed.xml
