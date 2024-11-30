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
- [ ] get play and pause button
- [ ] display playback info on feed item row (played / time left)

## V0.0.6 checklist

- [ ] backup image for everything
- [ ] do some checks to make sure that our feed has fields required by db
- [ ] Build page for individual feed item
- [ ] Get rid of `LiteDomLitElement`

## V0.0.8 checklist

Tons of style updates

- [ ] Progress bar moves based on time duration (need to set width on duration)
- [ ] Error states
- [ ] Add hour to mobile audio player

## V0.0.7 checklist

- [ ] write about page (links on how to install PWA)
- [ ] search
- [ ] paginate? virtualize?

# Testing

Some test urls

- https://shoptalkshow.com/feed/podcast
- https://feed.podbean.com/demolisten/feed.xml
- https://www.thisamericanlife.org/podcast/rss.xml
