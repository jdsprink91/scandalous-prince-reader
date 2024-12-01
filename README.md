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
- [x] add shows page. List shows and add new one
- [x] delete rss feed
- [x] add some nice async things to deleting and adding feed item

## V0.0.5 checklist

- [x] Pull from feed
- [x] figure out feed item metadata (save this info)
- [x] show feed item as playing when they hit play from feed
- [x] get play and pause button
- [x] display playback info on feed item row (played / time left)
- [ ] Remove saving feed items in indexeddb — fetch feed items when app is
      opened and when someone adds or removes a show.
- [ ] do some checks to make sure that our feed has fields required by db

## V0.0.6 checklist

- [ ] Add fast forward and reverse buttons

## V0.0.7 checklist

- [ ] Build page for individual feed item. How to load:

1. If feed item exists in cached feed, then use that.
2. Use url to get link to rss feed and linke to feed item.

## V0.0.8 checklist

Tons of style updates

- [ ] Get rid of `LiteDomLitElement`. Replace with inline style override or
      whatever.
- [ ] backup image for everything
- [ ] Progress bar moves based on time duration (need to set width on duration)
- [ ] Error states
- [ ] Add hour to mobile audio player

## V0.0.9 checklist

- [ ] write about page (links on how to install PWA)
- [ ] search

# Testing

Some test urls

- https://shoptalkshow.com/feed/podcast
- https://feed.podbean.com/demolisten/feed.xml
- https://www.thisamericanlife.org/podcast/rss.xml
