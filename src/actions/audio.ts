import { getSPDB } from "./database";

export function getAudioPlayer() {
  const myAudio = document.querySelector<HTMLAudioElement>("#my-audio");
  if (myAudio === null) {
    throw new Error("my-audio should be defined in index.html");
  }
  return myAudio;
}

export async function openAudioPlayer(
  showName: string,
  title: string,
  imgSrc: string,
  audioSrc: string,
) {
  let player = document.querySelector("sp-mobile-audio-player");

  if (!player) {
    player = document.createElement("sp-mobile-audio-player");
    document.body.appendChild(player);
  }

  player.setAttribute("show-name", showName);
  player.setAttribute("title", title);
  player.setAttribute("img-src", imgSrc);

  // set property here
  const audio = getAudioPlayer();
  audio.src = audioSrc;

  // set the current time if they have played this before
  const db = await getSPDB();
  const playbackData = await db.get("feed-item-playback", audioSrc);
  if (playbackData) {
    audio.currentTime = playbackData.currentTime;
  }

  // make sure the widget on lock screen looks good
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: showName,
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
