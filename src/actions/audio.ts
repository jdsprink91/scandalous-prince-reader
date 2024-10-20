import { FeedTable } from "../types/database";
import { FeedItem } from "../types/rss";

export function openAudioPlayer(feed: FeedTable, item: FeedItem) {
  const audio = document.querySelector<HTMLAudioElement>("#my-audio");
  let player = document.querySelector("sp-mobile-audio-player");

  if (!player) {
    player = document.createElement("sp-mobile-audio-player");
    document.body.appendChild(player);
  }

  if (!item.enclosure?.url || !audio) {
    return null;
  }

  if (item.enclosure.url! === audio.getAttribute("src")) {
    return null;
  }

  const imgSrc = item.itunes?.image ?? feed.image?.url;

  player.setAttribute("show-name", feed.title!);
  player.setAttribute("title", item.title!);
  player.setAttribute("img-src", imgSrc!);

  // this ALWAYS has to be last
  audio.setAttribute("src", item.enclosure.url!);

  // make sure the widget on lock screen looks good
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: item.title,
      artist: feed.title,
      artwork: [
        {
          src: imgSrc!,
        },
      ],
    });

    const actionHandlers: [
      MediaSessionAction,
      ((details: MediaSessionActionDetails) => void) | null,
    ][] = [
      [
        "play",
        async () => {
          await audio.play();
          navigator.mediaSession.playbackState = "playing";
        },
      ],
      [
        "pause",
        () => {
          audio.pause();
          navigator.mediaSession.playbackState = "paused";
        },
      ],
      ["previoustrack", null],
      ["nexttrack", null],
      ["stop", null],
      [
        "seekbackward",
        (details) => {
          audio.currentTime = Math.max(
            audio.currentTime - (details.seekOffset ?? 15),
            0,
          );
        },
      ],
      [
        "seekforward",
        (details) => {
          audio.currentTime = Math.min(
            audio.currentTime + (details.seekOffset ?? 15),
            audio.duration,
          );
        },
      ],
      [
        "seekto",
        (details) => {
          audio.currentTime = details.seekTime ?? 0;
        },
      ],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        console.log(
          `The media session action "${action}" is not supported yet.`,
        );
      }
    }
  }
}
