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

- [ ] Add RSS feed to indexeddb
- [ ] Display feed on page 
- [ ] Build page for individual feed item
- [ ] Save state on whether item has been played and such

## V0.0.5 checklist

- [ ] Full page audio player
- [ ] Add hour to mobile audio player

# Testing

Use this to test reader: https://shoptalkshow.com/feed/podcast
